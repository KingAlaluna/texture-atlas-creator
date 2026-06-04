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