import {html, atlasConfig} from '../data/config.js';
import {applyTheme} from './theme.js';
import {} from './add-elements.js';
import {} from './main-footer.js';
import {fileSize, download} from './utils.js';
import {} from '../../sw-init.js';


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
    
    html.atlasWrap.innerHTML = '';
    html.allImgInfoWrap.innerHTML = '';
    atlasConfig.allImgInfo.array = [];
    atlasConfig.allImgInfo.generalSize = 0;
    
    atlasConfig.files = input.files;
    console.log(atlasConfig.files);
    
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
      
      //img view
      const reader = new FileReader();
      
      reader.onload = (o) => {
        const img = document.createElement('img');
        img.src = o.target.result;
        html.atlasWrap.append(img);
      };
      reader.readAsDataURL(e);
    }
    
    addCodeAtlasTexture();
    html.generalAllChooseImgInfoText.textContent = `${atlasConfig.files.length}\t\t\t\t${fileSize(atlasConfig.allImgInfo.generalSize)}`;
  } 
  
  
  //input
  else if (type == 'input') {
    const [elementType, key, val] = value.split('-');
    if (elementType !== 'atlas') return;
    
    atlasConfig[key][val] = Number(target.value);
    
    html.atlasWrap.style.aspectRatio = `${atlasConfig.px.x} / ${atlasConfig.px.y}`;
    html.atlasWrap.style.gridTemplate = `repeat(${atlasConfig.items.y}, 1fr) / repeat(${atlasConfig.items.x}, 1fr)`;
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
      
      html.atlasWrap.style.aspectRatio = `${atlasConfig.px.x} / ${atlasConfig.px.y}`;
      html.atlasWrap.style.gridTemplate = `repeat(${atlasConfig.items.y}, 1fr) / repeat(${atlasConfig.items.x}, 1fr)`;
      
      addCodeAtlasTexture();
    }
    else if (value == 'atlas-downloads') {
      const checked = input.checked;
      atlasConfig.download[typeValue][checked ? 'add' : 'delete'](input.value);
    }
  }
  console.log('atlasConfig', atlasConfig);
});


function addCodeAtlasTexture() {
  if (!atlasConfig.files) return;
  
  let codeAtlasTexture = '';
  
  for (let i = 0; i < atlasConfig.files.length; i++) {
    const e = atlasConfig.files[i];
    
    const {name} = e;
    codeAtlasTexture += `'${name}':[${(i % atlasConfig.items.x) + 1},${Math.floor(i / atlasConfig.items.x) + 1}]${i < atlasConfig.files.length - 1 ? ',' : ''}`;
  }
  
  atlasConfig.downloadRes.code.js = `const atlasTexture={${codeAtlasTexture}};`;
  atlasConfig.downloadRes.code.json = `{${codeAtlasTexture.replace(/\x27/g, '"')}}`;
}