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

