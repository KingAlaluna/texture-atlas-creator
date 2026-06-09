import JSZip from 'https://cdn.jsdelivr.net/npm/jszip@3.10.1/+esm';
import {html, atlasConfig} from '../data/config.js';


export const fileSize = (sizeValue) => sizeValue / 1024 / 1024 / 1024 >= 1 ? `${(sizeValue / 1024 / 1024 / 1024).toFixed(2)}GB` : sizeValue / 1024 / 1024 >= 1 ? `${(sizeValue / 1024 / 1024).toFixed(2)}MB` : sizeValue / 1024 >= 1 ? `${(sizeValue / 1024).toFixed(2)}KB` : `${sizeValue}B`;
const getType = (value) => Object.prototype.toString.call(value).slice(8, -1).toLowerCase();


//code download
async function codeDownload(content, fileName) {
  const blobs = [];
  
  const typeFileTemplates = {
    txt: 'text/plain',
    json: 'application/json',
    js: 'application/javascript',
  };
  
  if (getType(content) == 'array' || getType(content) == 'set') {
    for (const e of content) {
      if (e == 'zip') {
        const blob = await zipDownload(atlasConfig.downloadRes.code);
        blobs.push({blob, typeFile: e});
      } else {
        const blob = new Blob([atlasConfig.downloadRes.code[e]], {type: typeFileTemplates[e]});
        blobs.push({blob, typeFile: e});
      }
    }
  } else {
    const typeFile = fileName.split('.').pop();
    const blob = new Blob([content], {type: typeFileTemplates[typeFile]});
    blobs.push({blob, typeFile});
  }
  
  return blobs;
}


//zip download
async function zipDownload(content) {
  const zip = new JSZip();
  
  if (getType(content) == 'array') {
    content.forEach(e => {
      const {
        blob,
        typeFile,
      } = e;
      
      zip.file(`atlas-texture.${typeFile}`, blob);
    });
  }
  else if (getType(content) == 'object') {
    for (const key in content) {
      zip.file(`atlas-texture.${key}`, content[key]);
    }
  }
  
  const blobZip = await zip.generateAsync({type: 'blob'});
  
  return blobZip;
}


//img download
const loadImg = (img, url) => new Promise((resolve) => {
  img.onload = () => resolve();
  img.src = url;
})

async function imgDownload(types) {
  const imgArray = [...types];
  
  const sizes = atlasConfig.px;
  
  const imgContent = html.atlasWrap.outerHTML;
  
  const svgTemplate = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${sizes.x}" height="${sizes.y}">
      <foreignObject width="100%" height="100%">
        ${imgContent}
      </foreignObject>
    </svg>
  `;
  
  const blobs = [];
  
  const blob = new Blob([svgTemplate], {type: 'image/svg+xml;charset=utf-8'});
  const url = URL.createObjectURL(blob);
  
  
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  canvas.width = sizes.x;
  canvas.height = sizes.y;
  
  const img = new Image();
  await loadImg(img, url);
  
  
  const getCanvasBlob = (type) => new Promise(res => canvas.toBlob(res, `image/${type}`));
  
  
  ctx.drawImage(img, 0, 0, sizes.x, sizes.y);
  
  for (let i = 1; i <= imgArray.length; i++) {
    const e = imgArray[i - 1];
    
    //svg img
    if (e == 'svg') {
      blobs.push({blob, typeFile: e});
    } 
    //zip
    else if (e == 'zip') {
      const zipContent = {};
      const imgTypes = [];
      
      imgArray.forEach(e => {
        if (e == 'zip') return;
        imgTypes.push(e);
      });
      
      for (const e of imgTypes) {
        if (e == 'svg') {
          zipContent[e] = blob;
        }
        else {
          const imgBlob = await getCanvasBlob(e);
          zipContent[e] = imgBlob;
        }
      }
      
      const zipBlob = await zipDownload(zipContent);
      blobs.push({blob: zipBlob, typeFile: e});
    }
    //no svg img
    else {
      const imgBlob = await getCanvasBlob(e);
      
      blobs.push({blob: imgBlob, typeFile: e});
    }
  }
  
  URL.revokeObjectURL(img.src);
  URL.revokeObjectURL(url);
  
  return blobs;
}


//all download
async function allDownload() {
  let blobs = [];
  
  const allImgDownload = await imgDownload(atlasConfig.dataImgDownload);
  const allCodeDownload = await codeDownload(atlasConfig.dataCodeDownload);
  const allDownload = await zipDownload([...allImgDownload, ...allCodeDownload]);
  
  blobs = allDownload;
  
  return blobs;
}


//main download
export async function download(type) {
  let blobs = [];
  
  
  if (type == 'res') {
    blobs = await generalDownload();
  }
  else if (type == 'text') {
    blobs = await codeDownload(atlasConfig.allImgInfo.text, 'info-all-choose-img.txt');
  }
  
  const link = document.createElement('a');
  
  blobs.forEach(e => {
    const {
      blob, typeFile,
    } = e;
    
    const url = URL.createObjectURL(blob);
    
    link.href = url;
    link.download = `atlas-texture.${typeFile}`;
    link.click();
    URL.revokeObjectURL(url);
  });
}



async function generalDownload() {
  let blobs = [];
  
  
  if (atlasConfig.download.img.size > 0) {
    const imgBlobs = await imgDownload(atlasConfig.download.img);
    blobs = [...blobs, ...imgBlobs];
  }
  if (atlasConfig.download.code.size > 0) {
    const codeBlobs = await codeDownload(atlasConfig.download.code);
    blobs = [...blobs, ...codeBlobs];
  }
  if (atlasConfig.download.all.size == 1) {
    const allBlobs = await allDownload();
    blobs = [...blobs, ...allBlobs];
  }
  
  return blobs;
}

