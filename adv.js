// Helpers for the advanced levels (sev 3.5..7.5, depth ~700..1500). Shared by the adv_* modules, lore.js and secrets.js.
U.bg=e=>{try{for(;e&&e.nodeType==1;e=e.parentElement){const b=getComputedStyle(e).backgroundColor;if(typeof b=='string'&&b&&!/, 0\)$|transparent/.test(b))return b}}catch(_){}return '#fff'};
// n distinct items of a, chosen by hash rank, kept in their original order. r(i) -> [0,1)
U.pickN=(a,n,r)=>a.map((x,i)=>[r(i),i]).sort((p,q)=>p[0]-q[0]).slice(0,n).sort((p,q)=>p[1]-q[1]).map(p=>a[p[1]]);
U.hx=n=>(n>>>0).toString(16);
// static block placed after the exits (never shifts them)
U.after=(c,e)=>{const x=c.w.querySelector('.exits');x&&x.after?x.after(e):c.w.append(e);return e};
U.tag=(t,css,txt)=>{const e=document.createElement(t);if(css)e.style.cssText=css;if(txt!=null)e.textContent=txt;return e};
U.pre=(c,lines,s)=>'<pre style="white-space:pre-wrap;margin:0;font:13px Courier New,monospace">'+U.esc(lines.map(l=>U.fill(l,c,s)).join('\n'))+'</pre>';
