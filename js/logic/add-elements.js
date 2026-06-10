import {html, atlasConfig} from '../data/config.js';


function addValueTemplates(value1, value2, valueEnd, path) {
  let mainValue = value1 > value2 ? value1 : value2;
  const [key1, key2] = path.split('.');
  const pathData = atlasConfig.paramTemplates[key1][key2] = [];
  
  while (mainValue <= valueEnd) {
    pathData.push([value1, value2]);
    
    value1 *= 2;
    value2 *= 2;
    mainValue *= 2;
  }
}

addValueTemplates(128, 128, 16384, 'px.square');
addValueTemplates(128, 64, 16384, 'px.landscape');
addValueTemplates(64, 128, 16384, 'px.portrait');

addValueTemplates(2, 2, 128, 'items.square');
addValueTemplates(2, 1, 128, 'items.landscape');
addValueTemplates(1, 2, 128, 'items.portrait');



html.atlasValueTemplatesWrap.forEach(e => {
  const [type1, type2, type3] = e.dataset.type.split(':');
  
  //atlas px / items params
  if (type1 == 'params') {
    for (const values of atlasConfig.paramTemplates[type2][type3]) {
      const [value1, value2] = values;
      
      e.insertAdjacentHTML('beforeend', `
        <label class="label" data-type="label:atlas-params" data-type-value="${type2}">
          <input type="radio" name="atlas-${type2}" value="${value1}x${value2}">
          ${value1}x${value2}${type2 == 'items' ? ` (${value1 * value2})` : ''}
        </label>
      `);
    }
  }
  //download file type templates 
  else if (type1 == 'download') {
    const dataType = type2 == 'img' ? 'dataImgDownload' : type2 == 'code' ? 'dataCodeDownload' : 'dataAllDownload';
    
    atlasConfig[dataType].forEach(el => {
      e.insertAdjacentHTML('beforeend', `
        <label class="label" data-type="label:atlas-downloads" data-type-value="${type2}">
          <input type="checkbox" value="${el}">
          ${el}
        </label>
      `);
    });
  }
});
