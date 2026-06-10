import JSZip from 'https://cdn.jsdelivr.net/npm/jszip@3.10.1/+esm';
import {html, atlasConfig} from '../data/config.js';


export const fileSize = (sizeValue) => sizeValue / 1024 / 1024 / 1024 >= 1 ? `${(sizeValue / 1024 / 1024 / 1024).toFixed(2)}GB` : sizeValue / 1024 / 1024 >= 1 ? `${(sizeValue / 1024 / 1024).toFixed(2)}MB` : sizeValue / 1024 >= 1 ? `${(sizeValue / 1024).toFixed(2)}KB` : `${sizeValue}B`;
export const getType = (value) => Object.prototype.toString.call(value).slice(8, -1).toLowerCase();


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
    blobs.push({blob, typeFile, fileName});
  }
  
  return blobs;
}


//zip download
async function zipDownload(content) {
  const zip = new JSZip();
  
  if (getType(content) == 'array') {
    for (const e of content) {
      const {
        blob,
        typeFile,
        fileName = atlasConfig.name,
      } = e;
      
      const data = getType(blob) == 'blob' ? await blob.arrayBuffer() : blob;
      zip.file(`${fileName}.${typeFile}`, data);
    }
  }
  else if (getType(content) == 'object') {
    for (const key in content) {
      const data = getType(content[key]) == 'blob' ? await content[key].arrayBuffer() : content[key];
      zip.file(`${fileName}.${key}`, data);
    }
  }
  
  const blobZip = await zip.generateAsync({type: 'blob'});
  
  return blobZip;
}


//img download
async function imgDownload(types) {
  const imgArray = [...types];
  
  const blobs = [];
  
  const canvas = html.atlasCanvas;
  
  const getCanvasBlob = (type) => new Promise(res => {
    canvas.toBlob((blob) => res(blob), `image/${type}`);
  });
  
  for (let i = 0; i < imgArray.length; i++) {
    const e = imgArray[i];
    
    //zip
    if (e == 'zip') {
      const zipContent = {};
      const imgTypes = [];
      
      atlasConfig.dataImgDownload.forEach(e => {
        if (e == 'zip') return;
        imgTypes.push(e);
      });
      
      for (const e of imgTypes) {
        const imgBlob = await getCanvasBlob(e);
        zipContent[e] = imgBlob;
      }
      
      const zipBlob = await zipDownload(zipContent);
      blobs.push({blob: zipBlob, typeFile: e});
    }
    //img
    else {
      const imgBlob = await getCanvasBlob(e);
      
      blobs.push({blob: imgBlob, typeFile: e});
    }
  }
  
  return blobs;
}


//all download
async function allDownload() {
  const dataImgDownload = atlasConfig.dataImgDownload.filter(e => e != 'zip');
  const dataCodeDownload = atlasConfig.dataCodeDownload.filter(e => e != 'zip');
  
  const allImgDownload = await imgDownload(dataImgDownload);
  const allCodeDownload = await codeDownload(dataCodeDownload);
  const allFileDownload = await zipDownload([...allImgDownload, ...allCodeDownload]);
  
  return [{blob: allFileDownload, typeFile: 'zip'}];
}


//main download
export async function download(type) {
  let blobs = [];
  
  
  if (type == 'res') {
    blobs = await generalDownload();
  }
  else if (type == 'text') {
    blobs = await codeDownload(atlasConfig.allImgInfo.text, `${atlasConfig.name}-chosen-images-info.txt`);
  }
  
  const link = document.createElement('a');
  
  for (const e of blobs) {
    const {
      blob, 
      typeFile,
      fileName = atlasConfig.name,
    } = e;
    
    const url = URL.createObjectURL(blob);
    
    link.href = url;
    link.download = `${fileName}.${typeFile}`;
    link.click();
    URL.revokeObjectURL(url);
  }
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
