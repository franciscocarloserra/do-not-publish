// Build: bundles the sources so the page loads in a few requests. Run `node build.js` after editing any module.
// bundles/core.js = engine + text; bundles/tN.js = layer items grouped by sev tier (loaded lazily as depth grows).
const fs=require('fs'),TIERS=[.25,.5,.75,1,1.5,2,3,4,5,6,7,Infinity],B='bundles';fs.mkdirSync(B,{recursive:true});
// sources keep using location.hash; bundles read U.hash instead (in-memory, see index.html) so progress never shows in the address bar
const cat=fs=>fs.map(f=>require('fs').readFileSync(f,'utf8').trim().replace(/location\.hash/g,'U.hash')).join('\n');
fs.writeFileSync(`${B}/core.js`,cat(['core','words','widgets','nav','story','inspector','session','kit','dialog','grammar','story2','corrupt','adv','story3','lore','secrets'].map(f=>f+'.js')));
const tiers=TIERS.map(()=>[]);
for(const d of ['aes','arch','sem','glitch','snd','navmod'])for(const f of fs.readdirSync(d).sort()){const s=fs.readFileSync(`${d}/${f}`,'utf8'),m=s.match(/sev:\s*([\d.]+)/),v=m?+m[1]:0;tiers[TIERS.findIndex(t=>v<t)].push(`${d}/${f}`)}
tiers.forEach((t,i)=>fs.writeFileSync(`${B}/t${i}.js`,cat(t)));
const V=Date.now().toString(36);fs.writeFileSync(`${B}/manifest.js`,`U.tiers=${JSON.stringify(TIERS.slice(0,-1))};U.v='${V}';`);
// cache-bust: stamp bundle URLs in index.html so browsers/Pages never serve stale tiers
fs.writeFileSync('index.html',fs.readFileSync('index.html','utf8').replace(/bundles\/(core|manifest)\.js(\?v=\w+)?/g,`bundles/$1.js?v=${V}`));
console.log('core',fs.statSync(`${B}/core.js`).size,'tiers',tiers.map((t,i)=>t.length+':'+fs.statSync(`${B}/t${i}.js`).size).join(' '));
