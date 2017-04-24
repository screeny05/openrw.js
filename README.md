# openrw.js
renderware implementation in typescript.

Uses node-webgl/node-glfw for desktop graphics and corrode for file-parsing.

To use it you need the typescript compiler and renderware-gamefiles.
The current implementation only handles previewing dff-files, but also includes a parser for
dir-/img-files, gxt-files and a half-way ipl-parser.

```
npm install
npm install typescript
tsc
node dist/rwsengine/index.js --harmony_simd <path to dff relative to basepath in config.json>
```

<img src="https://raw.githubusercontent.com/screeny05/openrw.js/master/docs/screen-1.jpg" alt="screen-1"/>
