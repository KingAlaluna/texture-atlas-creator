import JSZip from 'https://cdn.jsdelivr.net/npm/jszip@3.10.1/+esm';


const zip = new JSZip();


export function download(content, fileName) {
  const typeFile = fileName.split('.').pop();
  
  const typeFileTemplates = {
    txt: 'text/plain',
    json: 'application/json',
    js: 'application/javascript',
  };
  
  const blob = new Blob([content], {type: typeFileTemplates[typeFile]});
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
}


export async function downloadZip(content) {
  for (const key in content) {
    zip.file(`atlas-texture${key}`, content[key]);
  }
  const blobZip = await zip.generateAsync({type: 'blob'});
  const blobUrl = URL.createObjectURL(blobZip);
  
  const link = document.createElement('a');
  link.url = blobUrl;
  link.download = 'atlas-texture.zip';
  link.click();
  URL.revokeObjectURL(blobUrl);
}