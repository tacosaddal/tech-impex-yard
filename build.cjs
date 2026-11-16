/* Rebuilds the single-file site from the sources. No dependencies: node build.cjs */
const fs = require('fs'), path = require('path');

const SITES = [
  {
    src: "src",
    out: "index.html",
    title: "Tech Impex Yard",
    description: "Tech Impex is a software house. Drive the yard: ten bays, one for each thing we build.",
    fonts: [
      "family=Archivo:wdth,wght@62..125,100..900&family=DM+Mono:wght@400;500"
    ]
  }
];

/* the same small reset the pages were designed against */
const BASE = ':root{color-scheme:light;padding:env(safe-area-inset-top,0px) 0 env(safe-area-inset-bottom,0px)}body{margin:0;font:14px system-ui,sans-serif}img{max-width:100%}[hidden]{display:none!important}';

for (const site of SITES) {
  const read = p => fs.readFileSync(path.join(__dirname, site.src, p), 'utf8');
  /* scripts are joined in file name order and share one scope, so the numbers in the names set the load order */
  const js = fs.readdirSync(path.join(__dirname, site.src, 'js')).filter(f => f.endsWith('.js')).sort().map(f => read('js/' + f)).join('\n');
  if (/<\/script/i.test(js)) throw new Error(site.src + ': a script contains a closing script tag');
  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>${site.title}</title>
<meta name="description" content="${site.description}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
${site.fonts.map(f => `<link rel="stylesheet" href="https://fonts.googleapis.com/css2?${f}&display=swap">`).join('\n')}
<style>${BASE}</style>
<style>
${read('style.css')}</style>
</head>
<body>
${read('body.html')}
<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
<script>
(function () {
'use strict';
${js}
})();
</script>
</body>
</html>
`;
  fs.writeFileSync(path.join(__dirname, site.out), html);
  console.log('built', site.out, (html.length / 1024).toFixed(1) + ' KB');
}
