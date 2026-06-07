import {html, atlasConfig} from '../data/config.js';


html.atlasValueTemplatesWrap.forEach(e => {
  const type = e.dataset.type;
  
  if (type == 'px') {
    let value = 128;
    while (value <= 16384) {
      e.insertAdjacentHTML('beforeend', `
        <label class="label" data-type="label:atlas-params" data-type-value="px">
          <input type="radio" name="atlas-px" value="${value}x${value}">
          ${value}x${value}
        </label>
      `);
      value *= 2;
    }
  }
  else if (type == 'items') {
    let value = 2;
    while (value <= 128) {
      e.insertAdjacentHTML('beforeend', `
        <label class="label" data-type="label:atlas-params" data-type-value="items">
          <input type="radio" name="atlas-items" value="${value}x${value}">
          ${value}x${value} (${value * value})
        </label>
      `);
      value *= 2;
    }
  }
  else if (type == 'img-download') {
    atlasConfig.dataImgDownload.forEach(el => {
      e.insertAdjacentHTML('beforeend', `
        <label class="label" data-type="label:atlas-downloads" data-type-value="img">
          <input type="checkbox" value="${el}">
          ${el}
        </label>
      `);
    });
  }
  else if (type == 'code-download') {
    atlasConfig.dataCodeDownload.forEach(el => {
      e.insertAdjacentHTML('beforeend', `
        <label class="label" data-type="label:atlas-downloads" data-type-value="code">
          <input type="checkbox" value="${el}">
          ${el}
        </label>
      `);
    });
  }
  else if (type == 'all-download') {
    atlasConfig.dataAllDownload.forEach(el => {
      e.insertAdjacentHTML('beforeend', `
        <label class="label" data-type="label:atlas-downloads" data-type-value="all">
          <input type="checkbox" value="${el}">
          ${el}
        </label>
      `);
    });
  }
});

