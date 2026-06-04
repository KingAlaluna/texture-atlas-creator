import {html} from '../data/config.js';


let darkTheme = false;

export function applyTheme(getTheme) {
  const theme = getTheme || darkTheme;
  
  if (theme == 'dark' || theme == true) {
    localStorage.setItem('Create-atlas-darkTheme', 'false');
    darkTheme = false;
    
    html.html.dataset.theme = 'light';
    html.themeImg.src = 'img/themes/light.svg';
  } else {
    localStorage.setItem('Create-atlas-darkTheme', 'true');
    darkTheme = true;
    
    html.html.dataset.theme = 'dark';
    html.themeImg.src = 'img/themes/dark.svg';
  }
}


//initial theme
if (localStorage.getItem('Create-atlas-darkTheme')) {
  //user theme
  if (localStorage.getItem('Create-atlas-darkTheme') == 'false') {
    applyTheme('dark');
  } else {
    applyTheme('light');
  }
} else {
  //sustems theme
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    applyTheme('light');
  } else {
    applyTheme('dark');
  }
}
