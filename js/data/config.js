export const i = (id) => document.getElementById(id);
const c = (classes) => document.querySelectorAll(`.${classes}`);


export const html = {
  html: document.documentElement,
  root: i('root'),
  atlasWrap: i('atlas-wrap'),
  allImgInfoWrap: i('all-img-info-wrap'),
  
  atlasValueTemplatesWrap: c('atlas-value-templates-wrap'),
  
  themeImg: i('theme-img'),
  
  generalAllChooseImgInfoText: i('general-all-choose-img-info-text'),
};


export const atlasConfig = {
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
  downloadRes: {
    //img: {},
    code: {},
    //all: {},
  },
  allImgInfo: {
    array: [],
    text: '',
    generalSize: 0,
  },
  dataImgDownload: ['svg', 'png', 'webp', 'jpg', 'zip'],
  dataCodeDownload: ['js', 'json', 'zip'],
  dataAllDownload: ['zip'],
  files: null,
};

