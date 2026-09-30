// Static corruption engine. Everything here is baked into the rendered page after U.reveal: no timers, no motion, no transforms.
// intensity I(k) = ((k-cor_start)/(cor_end-cor_start))^cor_curve, clamped 0..1; pass i unlocks at I >= cor_from_max*i/(N-1) and its strength
// grows with I up to its cap (cor_caps). Every pass is seeded by c.r(...) so a page always looks the same. Modules gl/cor_* queue one pass at a boosted gain.
(()=>{
Object.assign(U.cfg,{fit_floor_deep:.002,fit_floor_from:400,cor_start:200,cor_end:1000,cor_curve:1.35,cor_gain:1,cor_mod_gain:1.7,cor_from_max:.85,cor_floor:.25,
 cor_btn_cap:.3,cor_safe_from:.35,cor_safe_px:14,cor_tear_px:70,cor_snap_px:24,cor_mis_px:7,cor_block_min:2,cor_block_max:6,cor_post_floor:.25,cor_post_levels:8,cor_dead_max:160,cor_band_max:14,cor_img_max:6,cor_dup_max:4,cor_row_share:.85,cor_opacity_min:.35,cor_patch_max:40,
 cor_caps:{mojibake:.7,fringe:1,trunc:.8,entity:.8,tofu:.7,template:.8,brokenimg:1,squiggle:1,misregister:1,snap:1,markup:.8,fontfail:1,dupchars:.7,cutline:.7,bands:1,posterize:.9,ansi:.8,halfwidget:.8,clipw:.8,comb:.9,inkspread:1,tear:1,dupfrag:1,deadpix:1,shift:.6,fullwidth:.7,zorder:.8,bgr:.8,polyclip:.8,maskband:.8,overprint:.9,checker:1,dither:.9,spaceloss:.7,linecollapse:.8,alpha:.8,koi8:.6,fffd:.7,pixelate:.7,palette:.9,selblock:.8,jpeg:1,wordgap:.8,halfclip:.7,bom:.8}});
const cf=()=>U.cfg,C=U.cor={fx:{},T:{},ord:[]};
const I=C.I=k=>{const a=cf().cor_start,b=cf().cor_end;return k<=a?0:Math.pow(Math.min(1,(k-a)/(b-a)),cf().cor_curve)};
const from=n=>cf().cor_from_max*C.ord.indexOf(n)/Math.max(1,C.ord.length-1),cap=n=>cf().cor_caps[n]==null?1:cf().cor_caps[n];
// strength 0..1 of pass n at intensity i (0 while locked); module form uses its own gain and never waits for its threshold
C.s=(n,i,g)=>{if(!(i>0))return 0;if(g==null){if(i<from(n))return 0;const ramp=(i-from(n))/(1-from(n)+1e-9);return Math.min(1,cf().cor_gain*cap(n)*(cf().cor_floor+(1-cf().cor_floor)*ramp))}return Math.min(1,cap(n)*g*(cf().cor_floor+(1-cf().cor_floor)*i))};
C.passes=k=>C.ord.filter(n=>C.s(n,I(k))>0).length;
C.queue=(c,n,g)=>(c.cq=c.cq||[]).push([n,g||cf().cor_mod_gain]);
const Q=(c,n)=>i=>c.r('cor'+n+':'+i),P=(a,u)=>a[Math.floor(u*a.length)%a.length];
const lf=c=>[...c.w.querySelectorAll('h1,p,label,b,span,li,td,div')].filter(e=>!e.children.length&&e.textContent&&!e.dataset.cor&&!(c.ex&&c.ex.contains(e)));
const bl=c=>[...c.w.querySelectorAll('.row,p,h1')].filter(e=>!e.dataset.cor&&!(c.ex&&c.ex.contains(e)));
const pk=(a,p,r,o)=>a.filter((e,i)=>r(o+i)<p),sty=(e,o)=>Object.assign(e.style,o),flt=(e,u)=>{e.style.filter=(e.style.filter?e.style.filter+' ':'')+u};
const ov=(c,css)=>{const d=document.createElement('div');d.dataset.cor='1';d.setAttribute('aria-hidden','true');sty(d,{position:'absolute',pointerEvents:'none',zIndex:'3'});sty(d,css);c.w.append(d);return d};
const SVG=(c,id,xml)=>{c.cor.defs[id]=xml;return 'url(#'+id+')'};
const tv=(n,f)=>[...Array(n)].map((_,i)=>(f+(1-f)*i/(n-1)).toFixed(2)).join(' ');
const CT=(n,f)=>['R','G','B'].map(x=>`<feFunc${x} type="discrete" tableValues="${tv(n,f)}"/>`).join('');
const isL=x=>/[a-z]/i.test(x);
// ---- text damage (pure string -> string); p = strength, u = per-char/word rng in [0,1)
const M={a:'Ã¡',e:'Ã©',i:'Ã­',o:'Ã³',u:'Ãº',n:'Ã±',c:'Ã§',"'":'â€™','-':'â€”','"':'â€œ',' ':'Â ',',':'â€š','.':'â€¦'},E={'&':'&amp;amp;',"'":'&#39;','"':'&quot;','<':'&lt;','>':'&gt;',' ':'&nbsp;','-':'&ndash;'};
const TK=['undefined','NaN','null','[object Object]','%s','{{name}}','${title}','<unk>','0xFFFF','None','[MASK]','\\n','-0','#REF!'],MK=['<div class="','</span>','<br','&lt;/p&gt;','<!--','-->','<td colspan=','style="color:','</div></div>','<p><b>'],AN=['␛[0m','␛[31;1m','^[[2J','␛[K','␛[?25l','\\x1b[0m'];
const ch=f=>(t,p,q)=>[...t].map((x,j)=>f(x,p,q(j),j)).join('');
const T=C.T={
 mojibake:ch((x,p,u)=>M[x]&&u<p*.6?M[x]:x),tofu:ch((x,p,u)=>isL(x)&&u<p*.35?P(['□','▯','▮'],u*97%1):x),fffd:ch((x,p,u)=>isL(x)&&u<p*.3?'�':x),
 koi8:ch((x,p,u)=>isL(x)&&u<p*.4?String.fromCharCode((x<'a'?0x410:0x430)+(x.toLowerCase().charCodeAt(0)-97)):x),
 shift:ch((x,p,u)=>isL(x)&&u<p*.3?String.fromCharCode(x.charCodeAt(0)+(x=='z'||x=='Z'?-25:1)):x),
 fullwidth:ch((x,p,u)=>{const d=x.charCodeAt(0);return u<p*.25?(d>32&&d<127?String.fromCharCode(d+0xFEE0):d==32?'　':x):x}),
 dupchars:ch((x,p,u)=>isL(x)&&u<p*.3?x+x+(u<p*.1?x:''):x),spaceloss:ch((x,p,u)=>x==' '&&u<p*.55?'':x),
 entity:ch((x,p,u)=>E[x]&&u<p*(x==' '?.22:.8)?E[x]:x),
 template:(t,p,q)=>t.split(/(\s+)/).map((w,j)=>/\w/.test(w)&&q(j)<p*.22?P(TK,q(j+500)):w).join(''),
 trunc:(t,p,q)=>{if(q(0)>=.2+p*.7)return t;t=t.slice(0,Math.max(1,Math.floor(t.length*(1-p*.75*q(1)))));return q(2)<p*.4?t.slice(Math.floor(t.length*p*.4*q(3))):t},
 markup:(t,p,q)=>q(0)<.2+p*.7?P(MK,q(1))+t+(q(2)<p*.5?P(MK,q(3)):''):t,
 ansi:(t,p,q)=>{let n=0;return t.replace(/ /g,m=>q(n++)<p*.25?' '+P(AN,q(n+50))+' ':m)},
 bom:(t,p,q)=>q(0)<.3+p*.7?'ï»¿'+t+(q(1)<p?'␀':''):t};
const def=(n,f)=>{C.fx[n]=f;C.ord.push(n)},tx=n=>(c,s,r)=>lf(c).forEach((e,i)=>{e.textContent=T[n](e.textContent,s,j=>r(i*997+j))});
// order = subtle to brutal; gl/cor_* modules follow the same order (their sev rises with the index)
def('mojibake',tx('mojibake'));
def('fringe',(c,s,r)=>lf(c).forEach(e=>{const d=(.4+s*2.2).toFixed(1);e.style.textShadow=`-${d}px 0 #f00c,${d}px 0 #00f9`}));
def('trunc',tx('trunc'));def('entity',tx('entity'));def('tofu',tx('tofu'));def('template',tx('template'));
def('brokenimg',(c,s,r)=>{const b=bl(c),F=['image_0047.jpg','IMG_0001.gif','door.png','you.bmp','thumb_47.jpg','null.png','untitled.jpg'];if(!b.length)return;
 for(let i=0,n=1+Math.floor(s*cf().cor_img_max);i<n;i++){const e=document.createElement('span');e.dataset.cor='1';e.setAttribute('aria-hidden','true');e.textContent='▯ '+P(F,r(i));
  sty(e,{display:'inline-block',width:(60+r(i+20)*200|0)+'px',height:(28+r(i+40)*110|0)+'px',border:'2px inset #888',background:'#ddd',color:'#000',font:'11px monospace',overflow:'hidden',margin:'4px'});P(b,r(i+60)).after(e)}});
def('squiggle',(c,s,r)=>lf(c).forEach((e,i)=>{if(r(i)<.3+s*.7)sty(e,{textDecoration:'underline wavy #f00',textDecorationSkipInk:'none'})}));
def('misregister',(c,s,r)=>{const d=(1+s*cf().cor_mis_px).toFixed(1),y=(s*3).toFixed(1),f=SVG(c,'cfmis'+d,`<filter id="cfmis${d}" x="-5%" y="-5%" width="110%" height="110%"><feColorMatrix in="SourceGraphic" values="1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0" result="r"/><feOffset in="r" dx="-${d}" dy="0" result="r2"/><feColorMatrix in="SourceGraphic" values="0 0 0 0 0 0 1 0 0 0 0 0 0 0 0 0 0 0 1 0" result="g"/><feColorMatrix in="SourceGraphic" values="0 0 0 0 0 0 0 0 0 0 0 0 1 0 0 0 0 0 1 0" result="b"/><feOffset in="b" dx="${d}" dy="${y}" result="b2"/><feBlend in="r2" in2="g" mode="screen" result="rg"/><feBlend in="rg" in2="b2" mode="screen"/></filter>`);
 pk(bl(c),Math.min(1,cf().cor_row_share*(.3+s)),r,0).forEach(e=>flt(e,f))});
def('snap',(c,s,r)=>bl(c).forEach((e,i)=>{e.style.marginLeft=Math.floor(r(i)*(1+s*4))*cf().cor_snap_px+'px'}));
def('markup',tx('markup'));
def('fontfail',(c,s,r)=>{const F=['Symbol','Webdings','Wingdings','Zapf Dingbats','Marlett','fantasy','cursive','monospace','serif','Bookshelf Symbol 7'];lf(c).forEach((e,i)=>{if(r(i)<s)e.style.fontFamily='"'+P(F,r(i+300))+'",fantasy'})});
def('dupchars',tx('dupchars'));
def('cutline',(c,s,r)=>lf(c).forEach((e,i)=>{if(r(i)<.25+s*.5)sty(e,{whiteSpace:'nowrap',overflow:'hidden',textOverflow:'clip',maxWidth:(40+(1-s)*60|0)+'%'})}));
def('bands',(c,s,r)=>{const K=['#fff','#000','#f0f','#0ff','#ff0'];for(let i=0,n=2+Math.floor(s*cf().cor_band_max);i<n;i++)ov(c,{left:'0',right:'0',top:(r(i)*100).toFixed(1)+'%',height:(2+r(i+30)*(6+20*s)|0)+'px',background:P(K,r(i+60)),mixBlendMode:'difference',opacity:(.35+.6*s).toFixed(2)})});
def('posterize',(c,s,r)=>{const n=Math.max(3,Math.round(cf().cor_post_levels-s*(cf().cor_post_levels-3))),f=SVG(c,'cfpost'+n,`<filter id="cfpost${n}"><feComponentTransfer>${CT(n,cf().cor_post_floor)}</feComponentTransfer></filter>`);pk(bl(c),Math.min(1,.2+s*cf().cor_row_share),r,0).forEach(e=>flt(e,f))});
def('ansi',tx('ansi'));
def('halfwidget',(c,s,r)=>c.w.querySelectorAll('.row').forEach((e,i)=>{if(c.ex&&c.ex.contains(e))return;sty(e,{maxHeight:(.5+1.6*(1-s)).toFixed(2)+'em',overflow:'hidden'});e.querySelectorAll('input,select,textarea').forEach((x,j)=>{if(r(i*9+j)<s)x.style.visibility='hidden'})}));
def('clipw',(c,s,r)=>pk(bl(c),Math.min(1,.2+s*.8),r,0).forEach((e,i)=>{e.style.clipPath=`inset(0 ${Math.round(s*70*r(i+200))}% 0 0)`}));
// pseudo-element overprint: ::after repeats the text (data-g) offset/masked, so the element stays a leaf and stays readable to other passes
const GH=(c,v,css)=>{c.cor.css['g'+v]=`[data-cg="${v}"]{position:relative}[data-cg="${v}"]::after{content:attr(data-g);position:absolute;left:0;top:0;width:100%;pointer-events:none;${css}}`};
def('comb',(c,s,r)=>{GH(c,'comb','left:var(--dx,5px);-webkit-mask-image:repeating-linear-gradient(0deg,#000 0 2px,transparent 2px 4px);mask-image:repeating-linear-gradient(0deg,#000 0 2px,transparent 2px 4px);opacity:.85');
 lf(c).forEach((e,i)=>{if(r(i)<.3+s*.7){e.dataset.g=e.textContent;e.dataset.cg='comb';e.style.setProperty('--dx',(2+s*9).toFixed(1)+'px')}})});
def('inkspread',(c,s,r)=>lf(c).forEach(e=>{e.style.textShadow=`0 0 ${(1+s*3).toFixed(1)}px currentColor,0 0 ${(s*6).toFixed(1)}px currentColor`;e.style.webkitTextStroke=(s*1.4).toFixed(1)+'px'}));
def('tear',(c,s,r)=>{const b=[...c.w.children].filter(e=>!e.dataset.cor&&e!==c.ex),seam=Math.floor(r(0)*b.length),d=(.3+s*.7)*cf().cor_tear_px;b.forEach((e,i)=>{sty(e,{position:'relative',left:((r(i+5)-.5)*2*d*(i<seam?1:.25)).toFixed(0)+'px'})})});
def('dupfrag',(c,s,r)=>{const b=bl(c);if(!b.length)return;for(let i=0,n=1+Math.floor(s*cf().cor_dup_max);i<n;i++){const e=P(b,r(i)),k=e.cloneNode(true);k.dataset.cor='1';k.setAttribute('inert','');k.setAttribute('aria-hidden','true');k.removeAttribute('id');
  k.querySelectorAll('button,input,select,textarea,a').forEach(x=>{x.setAttribute('tabindex','-1');x.removeAttribute('data-i')});sty(k,{opacity:'.7',marginTop:(-r(i+9)*.8).toFixed(2)+'em'});e.after(k)}});
def('deadpix',(c,s,r)=>{const K=['#f00','#0f0','#00f','#fff','#000','#ff0'];for(let i=0,n=Math.floor(s*cf().cor_dead_max);i<n;i++){const z=2+Math.floor(r(i+400)*3);ov(c,{left:(r(i)*100).toFixed(1)+'%',top:(r(i+200)*100).toFixed(1)+'%',width:z+'px',height:z+'px',background:P(K,r(i+800))})}});
def('shift',tx('shift'));def('fullwidth',tx('fullwidth'));
def('zorder',(c,s,r)=>{bl(c).forEach((e,i)=>{if(r(i)<s)sty(e,{position:'relative',marginTop:'-'+(s*1.3).toFixed(2)+'em',zIndex:r(i+50)<.5?'-1':'2'})})});
def('bgr',(c,s,r)=>{const f=SVG(c,'cfbgr','<filter id="cfbgr"><feColorMatrix values="0 0 1 0 0 0 1 0 0 0 1 0 0 0 0 0 0 0 1 0"/></filter>');pk(bl(c),Math.min(1,.15+s*cf().cor_row_share),r,0).forEach(e=>flt(e,f))});
def('polyclip',(c,s,r)=>pk(bl(c),Math.min(1,.2+s*.7),r,0).forEach((e,i)=>{const a=Math.round(8+s*50*r(i+70)),b=Math.round(8+s*50*r(i+90));e.style.clipPath=r(i+110)<.5?`polygon(0 0,100% 0,100% ${100-a}%,${100-b}% 100%,0 100%)`:`polygon(0 0,100% 0,100% 100%,0 100%,0 ${a}%,${b}% ${a}%,${b}% 0)`}));
def('maskband',(c,s,r)=>pk(bl(c),Math.min(1,.2+s*.7),r,0).forEach((e,i)=>{const a=Math.round(10+r(i+20)*14),g=(1+s*8).toFixed(0),m=`repeating-linear-gradient(0deg,#000 0 ${a}px,transparent ${a}px ${+a+ +g}px)`;e.style.webkitMaskImage=m;e.style.maskImage=m}));
def('overprint',(c,s,r)=>{['a','b','c'].forEach((v,j)=>GH(c,'op'+v,`left:var(--dx);top:var(--dy);opacity:.6;color:${['#f0f','#0cf','#fa0'][j]}`));
 lf(c).forEach((e,i)=>{if(r(i)<.3+s*.7){e.dataset.g=e.textContent;e.dataset.cg='op'+P(['a','b','c'],r(i+70));e.style.setProperty('--dx',((r(i+80)-.5)*2*s*14).toFixed(1)+'px');e.style.setProperty('--dy',((r(i+90)-.5)*2*s*8).toFixed(1)+'px')}})});
def('checker',(c,s,r)=>{const b=bl(c);if(!b.length)return;for(let i=0,n=1+Math.floor(s*3);i<n;i++){const e=document.createElement('div');e.dataset.cor='1';e.setAttribute('aria-hidden','true');e.textContent='missing_texture.tga';sty(e,{height:(24+r(i)*60|0)+'px',width:(30+r(i+9)*70|0)+'%',background:'conic-gradient(#f0f 25%,#000 0 50%,#f0f 0 75%,#000 0) 0 0/16px 16px',color:'#fff',font:'10px monospace',overflow:'hidden'});P(b,r(i+20)).after(e)}});
def('dither',(c,s,r)=>{const a=(.3+s*.9).toFixed(2),n=1+Math.floor(r(0)*9),f=SVG(c,'cfdit'+a+n,`<filter id="cfdit${a}${n}" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".95" numOctaves="1" seed="${n}" result="n"/><feColorMatrix in="n" type="saturate" values="0" result="g"/><feComposite in="SourceGraphic" in2="g" operator="arithmetic" k1="0" k2="1" k3="${a}" k4="-${(a/2).toFixed(2)}" result="m"/><feComponentTransfer in="m">${CT(3,0)}</feComponentTransfer></filter>`);pk(bl(c),Math.min(1,.2+s*.7),r,50).forEach(e=>flt(e,f))});
def('spaceloss',tx('spaceloss'));
def('linecollapse',(c,s,r)=>lf(c).forEach((e,i)=>{if(r(i)<.3+s*.7)sty(e,{lineHeight:(1-s*.85).toFixed(2),letterSpacing:'-'+(s*.12).toFixed(2)+'em'})}));
def('alpha',(c,s,r)=>pk(bl(c),Math.min(1,cf().cor_row_share*(.3+s)),r,0).forEach((e,i)=>{e.style.opacity=(1-s*(1-cf().cor_opacity_min)*r(i+400)).toFixed(2)}));
def('koi8',tx('koi8'));def('fffd',tx('fffd'));
def('pixelate',(c,s,r)=>{const b=Math.round(cf().cor_block_min+s*(cf().cor_block_max-cf().cor_block_min)),h=b/2,f=SVG(c,'cfpx'+b,`<filter id="cfpx${b}" x="0" y="0" width="100%" height="100%"><feFlood x="${h-.5}" y="${h-.5}" width="1" height="1"/><feComposite width="${b}" height="${b}"/><feTile result="t"/><feComposite in="SourceGraphic" in2="t" operator="in"/><feMorphology operator="dilate" radius="${h}"/></filter>`);pk(bl(c),Math.min(1,.15+s*.6),r,0).forEach(e=>flt(e,f))});
def('palette',(c,s,r)=>{const amber=r(0)<.5,f=SVG(c,'cfpal'+(amber?'a':'g'),`<filter id="cfpal${amber?'a':'g'}"><feColorMatrix type="saturate" values="0"/><feComponentTransfer>${CT(3,.3)}</feComponentTransfer><feColorMatrix values="${amber?'1 0 0 0 0 0 .75 0 0 0 0 0 .2 0 0 0 0 0 1 0':'.2 0 0 0 0 0 1 0 0 0 0 0 .3 0 0 0 0 0 1 0'}"/></filter>`);pk(bl(c),Math.min(1,.3+s*.7),r,0).forEach(e=>flt(e,f))});
def('selblock',(c,s,r)=>lf(c).forEach((e,i)=>{if(r(i)<.2+s*.6){const x=20+Math.round(r(i+60)*70);sty(e,{background:`linear-gradient(90deg,#39f 0 ${x}%,transparent ${x}%)`,color:'#fff'})}}));
def('jpeg',(c,s,r)=>{const a=(.05+s*.15).toFixed(2);ov(c,{left:'0',right:'0',top:'0',bottom:'0',mixBlendMode:'multiply',backgroundImage:`repeating-linear-gradient(90deg,rgba(0,0,0,${a}) 0 1px,transparent 1px 8px),repeating-linear-gradient(0deg,rgba(0,0,0,${a}) 0 1px,transparent 1px 8px)`});
 for(let i=0,n=Math.floor(s*cf().cor_patch_max);i<n;i++){const z=8*(1+Math.floor(r(i+600)*3));ov(c,{left:8*Math.floor(r(i)*80)+'px',top:8*Math.floor(r(i+200)*(40+n))+'px',width:z+'px',height:z+'px',background:`rgba(${r(i+300)*255|0},${r(i+400)*255|0},${r(i+500)*255|0},.35)`})}});
def('wordgap',(c,s,r)=>lf(c).forEach((e,i)=>{if(r(i)<.3+s*.7)e.style.wordSpacing=(s*2.5).toFixed(2)+'em'}));
def('halfclip',(c,s,r)=>pk(bl(c),Math.min(1,.2+s*.7),r,0).forEach((e,i)=>{e.style.clipPath=`inset(0 0 ${Math.round(10+s*45*r(i+33))}% 0)`}));
def('bom',tx('bom'));
// exits stay above every overlay, clickable and readable: high contrast once the skin is badly damaged; labels only lightly damaged
C.safe=(c,i)=>{const ex=c.ex;if(!ex||!(i>0))return;sty(ex,{position:'relative',zIndex:'6',filter:'none',clipPath:'none',opacity:'1',visibility:'visible',pointerEvents:'auto'});const r=Q(c,'btn');
 [...ex.querySelectorAll('button')].forEach((b,j)=>{const p=cf().cor_btn_cap*i;b.textContent=T.mojibake(T.tofu(b.textContent,p,q=>r(j*131+q)),p,q=>r(j*131+q+900));
  if(i>=cf().cor_safe_from)sty(b,{background:'#000',color:'#fff',border:'2px solid #fff',fontSize:cf().cor_safe_px+'px',opacity:'1',filter:'none',clipPath:'none',visibility:'visible',pointerEvents:'auto'});b.style.webkitMaskImage='none';b.style.maskImage='none'})};
C.run=c=>{const i=I(c.o.k);c.ex=c.w.querySelector('.exits');c.cor={defs:{},css:{},ran:0,i};if(!(i>0))return;sty(c.w,{position:'relative',isolation:'isolate'});
 for(const n of C.ord){const s=C.s(n,i);if(s>0){C.fx[n](c,s,Q(c,n));c.cor.ran++}}
 for(const[n,g]of c.cq||[]){const s=C.s(n,i,g);if(s>0&&C.fx[n])C.fx[n](c,s,Q(c,'m'+n))}
 const css=Object.values(c.cor.css).join('');if(css)U.css(css);
 const ids=Object.keys(c.cor.defs);if(ids.length){const d=document.createElement('div');d.dataset.cor='1';d.setAttribute('aria-hidden','true');sty(d,{position:'absolute',width:'0',height:'0',overflow:'hidden',pointerEvents:'none'});d.innerHTML='<svg xmlns="http://www.w3.org/2000/svg" width="0" height="0"><defs>'+ids.map(x=>c.cor.defs[x]).join('')+'</defs></svg>';document.body.append(d);U.onoff(()=>d.remove())}
 C.safe(c,i)};
const _rv=U.reveal;U.reveal=c=>{_rv&&_rv(c);try{C.run(c)}catch(e){}};
})();
