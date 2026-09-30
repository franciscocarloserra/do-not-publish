U.add('gl','flicker',{sev:.35,apply:c=>{const p=c.p,t=setInterval(()=>{if(location.hash.slice(1)!=p)return clearInterval(t);c.w.style.opacity=Math.random()<.05+c.lvl*.15?.2:1},120)}});
