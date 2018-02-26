# openrw.js-web
renderware implementation in typescript.

Uses webgl for graphics and corrode for file-parsing.

To use it you need the typescript compiler and renderware-gamefiles.
The current implementation only handles previewing dff-files, but also includes a parser for
dir-/img-files, gxt-files and a half-way ipl-parser.

Currently only works in chrome.

```
npm install
npm install -g typescript parcel-bundler
tsc
parcel src/rwsweb/index.html
```

<img src="https://raw.githubusercontent.com/screeny05/openrw.js/master/docs/screen-1.jpg" alt="screen-1"/>
