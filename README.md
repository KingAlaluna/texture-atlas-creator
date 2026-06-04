# Texture Atlas Creator

A lightweight, high-performance web utility engineered specifically for generating uniform texture atlases and ultra-compact grid coordinate manifests. Built with a mobile-first approach using pure Vanilla JavaScript, CSS, and JSZip, this tool runs entirely in the browser without requiring heavy desktop installations or complex build environments.

## Links
[Texture Atlas Creator (GitHub Pages)](https://kingalaluna.github.io/texture-atlas-creator/)

## Core Features

* **Zero Installation (100% Client-Side):** Works directly in any modern mobile or desktop browser. No environment setups or software downloads required.
* **Strict Uniform Grid Layout:** Designed specifically for identically sized geometric sprites and animation frames (e.g., matching 64x64, 128x128, or custom rectangular shapes).
* **Automated Scaling Engine:** If source images vary in dimensions, the generator automatically normalizes and adapts them into a uniform shape based on your defined atlas resolution (X/Y) and item distribution targets.
* **1-Based Matrix Manifests:** Outputs highly minified, optimized, production-ready JavaScript or JSON data structures that map asset names directly to their row and column indexes starting from **1**:

### Examples
```json
{"hero_walk_01.png":[1,1],"hero_walk_02.png":[2,1],"enemy_idle.webp":[1,2]}
```
```javascript
const atlasTexture={'hero_walk_01.png':[1,1],'hero_walk_02.png':[2,1],'enemy_idle.webp':[1,2]};
```