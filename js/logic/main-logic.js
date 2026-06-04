import {html} from '../data/config.js';
import {applyTheme} from './theme.js';
import {} from './add-elements.js';
import {} from './main-footer.js';
import {download} from './utils.js';
import {} from '../../sw-init.js';


const atlasConfig = {
  items: {
    x: 16,
    y: 16,
  },
  px: {
    x: 2048,
    y: 2048,
  },
  download: {
    img: new Set(),
    code: new Set(),
    all: new Set(),
  },
  allImgInfo: {
    array: [],
    text: '',
    generalSize: 0,
  },
};


const fileSize = (sizeValue) => sizeValue / 1024 / 1024 / 1024 >= 1 ? `${(sizeValue / 1024 / 1024 / 1024).toFixed(2)}GB` : sizeValue / 1024 / 1024 >= 1 ? `${(sizeValue / 1024 / 1024).toFixed(2)}MB` : sizeValue / 1024 >= 1 ? `${(sizeValue / 1024).toFixed(2)}KB` : `${sizeValue}B`;


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
    download(atlasConfig.allImgInfo.text, 'info-all-choose-img.txt');
  }
  else if (value == 'copy-info-all-choose-img') {
    textInfoAllChooseImg();
    navigator.clipboard.writeText(atlasConfig.allImgInfo.text);
  }
  else if (value == 'atlas-all-res-download') {
    
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
  
  if (type == 'input' && value == 'choose-img') {
    const input = target.querySelector('input');
    if (!input) return;
    
    html.atlasWrap.innerHTML = '';
    html.allImgInfoWrap.innerHTML = '';
    atlasConfig.allImgInfo.array = [];
    atlasConfig.allImgInfo.generalSize = 0;
    
    const files = input.files;
    console.log(files);
    for (let i = 0; i < files.length; i++) {
      const e = files[i];
      
      //img info
      const {name, size, type} = e;
      atlasConfig.allImgInfo.array.push({name, size, type});
      atlasConfig.allImgInfo.generalSize += size;
      
      html.allImgInfoWrap.insertAdjacentHTML('beforeend', `<div class="img-data-wrap"><span class="name">${name}</span><span class="info">${type} ${fileSize(size)}</span></div>`);
      
      //img view
      const reader = new FileReader();
      
      reader.onload = (o) => {
        const img = document.createElement('img');
        img.src = o.target.result;
        html.atlasWrap.append(img);
      };
      reader.readAsDataURL(e);
    }
    html.generalAllChooseImgInfoText.textContent = `${files.length}\t\t\t\t${fileSize(atlasConfig.allImgInfo.generalSize)}`;
  } 
  else if (type == 'input') {
    const [elementType, key, val] = value.split('-');
    if (elementType !== 'atlas') return;
    
    atlasConfig[key][val] = Number(target.value);
    
    html.atlasWrap.style.aspectRatio = `${atlasConfig.px.x} / ${atlasConfig.px.y}`;
    html.atlasWrap.style.gridTemplate = `repeat(${atlasConfig.items.y}, 1fr) / repeat(${atlasConfig.items.x}, 1fr)`;
  }
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
    }
    else if (value == 'atlas-downloads') {
      const checked = input.checked;
      atlasConfig.download[typeValue][checked ? 'add' : 'delete'](input.value);
    }
  }
  console.log('atlasConfig', atlasConfig);
});

