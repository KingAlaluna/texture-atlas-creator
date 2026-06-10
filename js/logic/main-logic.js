import {html, atlasConfig} from '../data/config.js';
import {applyTheme} from './theme.js';
import {fileSize, download, getType} from './utils.js';

import './add-elements.js';
import './main-footer.js';
import '../../sw-init.js';


//btn
html.root.addEventListener('click', (e) => {
  const target = e.target.closest('[data-type]');
  const [type, value] = target?.dataset?.type?.split(':') || [null, null];
  
  
  if (type != 'btn') return;
  
  if (value == 'theme') {
    applyTheme();
  }
  
  else if (value == 'download-info-all-choose-img') {
    textInfoAllChooseImg();
    download('text');
  }
  
  else if (value == 'copy-info-all-choose-img') {
    textInfoAllChooseImg();
    navigator.clipboard.writeText(atlasConfig.allImgInfo.text);
  }
  
  else if (value == 'atlas-all-res-download') {
    download('res');
  }
});

function textInfoAllChooseImg() {
  const length = atlasConfig.allImgInfo.array.length;
  atlasConfig.allImgInfo.text = `Загальна кількість:\t${length}\t\t\t\tЗагальний розмір:\t${fileSize(atlasConfig.allImgInfo.generalSize)}\n\n\n\n`;
  
  for (let i = 0; i < length; i++) {
    const el = atlasConfig.allImgInfo.array[i];
    
    const {name, size, type} = el;
    atlasConfig.allImgInfo.text += `${i+1}:\t${name}\t\t\t\t${type}\t${fileSize(size)}\n`;
  }
}


//input
html.root.addEventListener('input', (e) => {
  const target = e.target.closest('[data-type]');
  const [type, value] = target?.dataset?.type?.split(':') || [null, null];
  if (type != 'input' && type != 'label') return;
  
  //choose img
  if (type == 'input' && value == 'choose-img') {
    const input = target.querySelector('input');
    if (!input) return;
    
    html.allImgInfoWrap.innerHTML = '';
    atlasConfig.allImgInfo.array = [];
    atlasConfig.allImgInfo.generalSize = 0;
    
    atlasConfig.files = input.files;
    
    for (let i = 0; i < atlasConfig.files.length; i++) {
      const e = atlasConfig.files[i];
      
      //img info
      const {name, size, type} = e;
      atlasConfig.allImgInfo.array.push({name, size, type});
      atlasConfig.allImgInfo.generalSize += size;
      
      
      html.allImgInfoWrap.insertAdjacentHTML('beforeend', `
        <div class="img-data-wrap">
          <span class="name">${i+1}:\t${name}</span>
          <span class="info">${type} ${fileSize(size)}</span>
        </div>
      `);
    }
    
    atlasImgView();
    addCodeAtlasTexture();
    html.generalAllChooseImgInfoText.textContent = `${atlasConfig.files.length}\t\t\t\t${fileSize(atlasConfig.allImgInfo.generalSize)}`;
  } 
  
  
  //input
  else if (type == 'input') {
    const [elementType, key, val] = value.split('-');
    if (elementType !== 'atlas') return;
    
    const targetValue = Number.isNaN(Number(target.value)) ? target.value : Number(target.value);
    
    if (key && val) {
      atlasConfig[key][val] = targetValue;
    } else {
      atlasConfig[key] = targetValue;
    }
  }
  
  
  //label
  else if (type == 'label') {
    const typeValue = target.dataset.typeValue;
    const input = target.querySelector('input');
    if (!input) return;
    
    if (value == 'atlas-params') {
      const [x, y] = input.value.split('x');
      
      atlasConfig[typeValue].x = Number(x);
      atlasConfig[typeValue].y = Number(y);
      
      atlasImgView();
      addCodeAtlasTexture();
    }
    else if (value == 'atlas-downloads') {
      const checked = input.checked;
      atlasConfig.download[typeValue][checked ? 'add' : 'delete'](input.value);
    }
  }
});


function addCodeAtlasTexture() {
  if (!atlasConfig.files) return;
  
  let jsCode = '';
  let jsonCode = '';
  
  const itemSize = {
    x: atlasConfig.px.x / atlasConfig.items.x,
    y: atlasConfig.px.y / atlasConfig.items.y,
  };
  
  for (let i = 0; i < atlasConfig.files.length; i++) {
    const e = atlasConfig.files[i];
    
    const {name} = e;
    
    const jsName = name.replace(/\'/g, '\\\'');
    const itemData = `:[${(i % atlasConfig.items.x) + 1},${Math.floor(i / atlasConfig.items.x) + 1}]${i < atlasConfig.files.length - 1 ? ',' : ''}`;
    
    jsCode += `'${jsName}'${itemData}`;
    jsonCode += `"${name}"${itemData}`;
  }
  
  atlasConfig.downloadRes.code.js = `const atlasTexture={frames:{${jsCode}},meta:{size:{x:${atlasConfig.px.x},y:${atlasConfig.px.y}},grid:{cols:${atlasConfig.items.x},rows:${atlasConfig.items.y}},itemSize:{x:${itemSize.x},y:${itemSize.y}},totalItems:${atlasConfig.files.length}}};`;
  atlasConfig.downloadRes.code.json = `{"frames":{${jsonCode}},"meta":{"size":{"x":${atlasConfig.px.x},"y":${atlasConfig.px.y}},"grid":{"cols":${atlasConfig.items.x},"rows":${atlasConfig.items.y}},"itemSize":{"x":${itemSize.x},"y":${itemSize.y}},"totalItems":${atlasConfig.files.length}}}`;
}


//atlas img view
function atlasImgView() {
  const sizes = atlasConfig.px;
  const columns = atlasConfig.items.x;
  const rows = atlasConfig.items.y;

  const canvas = html.atlasCanvas;
  const ctx = canvas.getContext('2d');

  canvas.width = sizes.x;
  canvas.height = sizes.y;
  canvas.style.aspectRatio = `${sizes.x} / ${sizes.y}`;
  
  if (!atlasConfig.files || atlasConfig.files.length === 0) return;
  
  ctx.clearRect(0, 0, sizes.x, sizes.y);

  const cellWidth = sizes.x / columns;
  const cellHeight = sizes.y / rows;

  for (let i = 0; i < atlasConfig.files.length; i++) {
    const image = atlasConfig.files[i];
    
    const col = i % columns;
    const row = Math.floor(i / columns);
    
    const x = col * cellWidth;
    const y = row * cellHeight;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      
      img.onload = () => {
        ctx.drawImage(img, x, y, cellWidth, cellHeight);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(image);
  }
}
