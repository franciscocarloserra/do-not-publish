// Core: independent layers, each sticky along the path with its own probability, combine into one page.
// Page id = "aes.arch.sem.nav.gl.snd.n". aes=look, arch=interface type, sem=vocabulary, nav=navigation rule, gl=glitch, snd=ambience.
const U={L:{aes:{},arch:{},sem:{},nav:{},gl:{},snd:{}},W:{},visits:0,off:[],hist:[],said:[],chose:[],
 cfg:{sev_margin:.1,sev_sigma:.12,depth_full:200,pace_extra:.4,calm_until:12,calm_sev:0,calm_snd:['silence','mall'],calm_lp:900,wr_h:.41113159945234656,wr_k:1e9,wr_m:10,wr_cap:1e4,grow_widgets:15,grow_exits:40,extra_glitch_from:60,stick:{aes:.85,arch:.35,sem:.7,nav:.5,gl:.6,snd:.7},snd_gain:.25,lim_db:-22,master_lp:5000,vowel_q:3,formant_q:2.5,formant_tc:.15,guard_peak:.5,guard_ms:250,widgets:[2,7],exits:[2,6],ghost:.5,sem_words:.45,aes_words:.3,
 // escalation knobs: session memory, dialogue pacing, endless grammar, deep glitch stacking
 hist_max:40,said_max:30,dialog_ms:26,dialog_gap:500,gen_fade:3,grammar_from:560,grammar_max:5,grammar_ramp:90,deep_from:600,deep_step:60,deep_max:3,
 grain_ms:90,bit_start:8,bit_end:2,bit_ms:6000,melt_s:70,breath_gap:1,breath_grow:1.6,breath_max:30,ghost_s:4,beat_ms:240,beat_decay:50,speech_rate:.7,speech_pitch:.3,speech_vol:.25,speech_ms:9000,loss_keep:.93,
 echo_ms:1000,light_r:140,jack_px:900,title_ms:2400,console_ms:5000,lock_chars:3,rot_rate:.02,rot_ms:900,idle_ms:6000,swallow_s:60,select_ms:5000,creep_px:1,creep_ms:70,lag_ms:350,lag_px:40,domrot_ms:4000,push_s:40,push_scale:1.6,reboot_ms:4200,panic_s:9,void_fade:120,
 // advanced levels (sev 3.5..7.5): warning mix, backstory channels, hidden triggers (tz*: hashes and counts, neutral names), per-module audio/visual knobs
 warn_stage:.6,warn_stage_from:560,lore_ahead:0,lore_new:.55,lore_recent:10,lore_comments:2,lore_note_p:.25,lore_con_every:5,lore_sel_p:.4,lore_sel_px:9,lore_alt_p:.35,lore_alt_px:14,lore_hid_p:.4,lore_val_p:.2,lore_title_from:40,lore_title_p:.22,lore_title_len:44,
 tz:[0.5973670871462673,0.8300034254789352,0.40826809499412775],tz_n:[9,5],tz_k:0.632522949250415,tz_l:10,tz_i:[30,47,94],
 adv:{ts_s0:12,ts_step:4,diff_n:2,tok_n:12,sel_min:12,title_ms:30,relay_hz:1800,relay_gain:.25,relay_ms:900,seek_hz:900,seek_gain:.25,seek_step:35,seek_gap:5000,clack_bed:.02,clack_gain:.22,hum_lfo:.05,hum_cents:12,hum_gain:.06,stall_from:900,stall_to:250,stall_s:180,stall_gain:.12,ups_gap:4,ups_max:30,ups_grow:.6,ups_gain:.08,drift_hz:220,drift_gain:.04,drift_cents:45,drift_s:300,counter_hz:1400,counter_n:6,counter_gain:.2,counter_step:28,room_hz:320,room_gain:.14,room_tc:90,over_lfo:.04,over_gain:.03}},
 hs(s){let x=2166136261;for(const c of s)x=Math.imul(x^c.charCodeAt(0),16777619);x=Math.imul(x^x>>>15,2246822507);return((x^x>>>13)>>>0)/4294967296},
 pick:(a,r)=>a[Math.floor(r*a.length)],
 // every item may declare sev 0..1 (hallucination/secrecy/aggression); it unlocks at depth sev*depth_full
 // weighted pick: unlocked items near the current level dominate, so calm things fade out and heavy things take over
 lv:k=>k/U.cfg.depth_full,  // uncapped: items with sev>1 are post-200 advanced levels
// once the level passes the deepest item of a layer, distances are measured from that item (dm), so the newest content keeps dominating instead of decaying into a uniform pick
 dm(l,k){const n=Object.keys(U.L[l]).length+':'+l+':'+k;if(U.dmc&&U.dmc[0]==n)return U.dmc[1];const L=U.lv(k),v=Math.max(0,Math.min(...U.pool(l,k).map(id=>L-(U.L[l][id].sev||0))));U.dmc=[n,v];return v},
fit:(l,id,k)=>{const d=U.lv(k)-(U.L[l][id].sev||0)-U.dm(l,k);return d<0?1:Math.exp(-d*d/(2*U.cfg.sev_sigma**2))+(k>=U.cfg.fit_floor_from?U.cfg.fit_floor_deep:.02)},
 wpick(l,k,r){const ids=U.pool(l,k),w=ids.map(id=>U.fit(l,id,k)),t=w.reduce((a,b)=>a+b,0);let x=r*t;for(let i=0;i<ids.length;i++)if((x-=w[i])<=0)return ids[i];return ids[ids.length-1]},
 // calm start: before calm_until only the softest items (sev<=calm_sev); rules and glitches off entirely
 pool:(l,k)=>{const C=U.cfg;if(k<C.calm_until){if((l=='nav'||l=='gl')&&U.L[l].none)return['none'];if(l=='snd')return C.calm_snd.filter(id=>U.L.snd[id]);return Object.keys(U.L[l]).filter(id=>(U.L[l][id].sev||0)<=C.calm_sev)}return Object.keys(U.L[l]).filter(id=>(U.L[l][id].sev||0)<=k/C.depth_full+C.sev_margin)},
 add(layer,id,def){U.L[layer][id]=def;if(def.css){const s=document.createElement('style');s.textContent=def.css.replaceAll('&',`body[data-${layer}="${id}"]`);document.head.append(s)}},
 words(o){for(const k in o)(U.W[k]=U.W[k]||[]).push(...o[k])},widgets:{},widget(id,f){U.widgets[id]=f},
 beep(f){try{const a=U.bc||(U.bc=new AudioContext()),o=a.createOscillator(),g=a.createGain();o.type='sine';o.frequency.value=f;g.gain.value=.05;o.connect(g).connect(a.destination);o.start();o.stop(a.currentTime+.06)}catch(e){}},
 parse(p){const s=p.split('.'),o={};Object.keys(U.L).forEach((l,i)=>{const ks=Object.keys(U.L[l]);o[l]=U.L[l][s[i]]?s[i]:U.pick(ks,U.hs(p+l))});const n=Object.keys(U.L).length;o.n=s[n]||'0';o.k=+s[n+1]||0;return o},
 id:o=>[...Object.keys(U.L).map(l=>o[l]),o.n,o.k||0].join('.'),
 // no interface (look+type combo) repeats within a session: exits reroll until they land on an unseen combo
 seen:new Set(),taken:new Set(),combo:c=>c.aes+'.'+c.arch,
 child(p,i){for(let t=0;t<40;t++){const c=U.child1(p,i,t),q=U.combo(U.parse(c));if(!U.seen.has(q)&&!U.taken.has(q)||t==39){U.taken.add(q);return c}}},
 child1(p,i,t){const o=U.parse(p),r=k=>U.hs(p+'>'+i+':'+(t?t+':':'')+k),c={},nk=o.k+(1+(r(98)<U.cfg.pace_extra?1:0))*(U.boost||1);Object.keys(U.L).forEach((l,j)=>c[l]=r(j)<U.cfg.stick[l]*U.fit(l,o[l],nk)?o[l]:U.wpick(l,nk,r(j+10)));c.n=Math.floor(r(99)*1e9);c.k=nk;return U.id(c)},
 start(){// rules/glitches may transform or filter <body>; move that onto the window so fixed elements (link) stay put
  new MutationObserver(()=>{const b=document.body.style,w=document.getElementById('w');if(b.transform){w.style.transform=b.transform;b.transform=''}if(b.filter){w.style.filter=b.filter;b.filter=''}}).observe(document.body,{attributes:true,attributeFilter:['style']});
  // keyboard: arrows move between exits, Enter activates (native on focused buttons); fields keep their own keys
  addEventListener('keydown',e=>{if(/INPUT|TEXTAREA|SELECT/.test(e.target.tagName))return;const d={ArrowRight:1,ArrowDown:1,ArrowLeft:-1,ArrowUp:-1}[e.key];if(!d)return;
   const b=[...document.querySelectorAll('#w button[data-i]')].filter(x=>!x.disabled&&x.offsetParent);if(!b.length)return;e.preventDefault();
   b[(b.indexOf(document.activeElement)+d+b.length)%b.length].focus({preventScroll:true})});
  // input resonance: each field where a word hashing to wr_h is typed (before depth wr_k) multiplies the drift factor by wr_m, up to wr_cap (memory only)
  U.boost=1;const rz=new WeakSet();addEventListener('input',e=>{const v=e.target&&e.target.value;if(rz.has(e.target)||!v||!U.cur||U.cur.o.k>U.cfg.wr_k||!v.toLowerCase().split(/\W+/).some(w=>U.hs(w)==U.cfg.wr_h))return;rz.add(e.target);U.boost=Math.min(U.cfg.wr_cap,U.boost*U.cfg.wr_m);U.beep(55)});
  onhashchange=U.render;U.render();addEventListener('pointerdown',()=>{if(!U.ac)U.ac=new AudioContext();U.ac.resume();U.ambience()},{once:true})},
 // sound layer: crossfade to the page's ambience when it changes; each snd item: play(ac, out, r) -> optional stop()
 // master bus: analyser -> soft lowpass -> limiter -> speakers. A watchdog recreates the whole AudioContext if a node blows up (huge peak) or goes NaN (permanent silence)
 bus(a){if(U.mst)return U.mst.an;const an=a.createAnalyser(),lp=a.createBiquadFilter(),lim=a.createDynamicsCompressor(),C=U.cfg,buf=new Float32Array(1024);an.fftSize=1024;
  lim.threshold.value=C.lim_db;lim.knee.value=0;lim.ratio.value=20;lim.attack.value=.002;lim.release.value=.2;lp.type='lowpass';lp.frequency.value=C.master_lp;lp.Q.value=0;an.connect(lp).connect(lim).connect(a.destination);
  const t=setInterval(()=>{an.getFloatTimeDomainData(buf);let pk=0;for(const v of buf){if(!isFinite(v)){pk=1e9;break}pk=Math.max(pk,Math.abs(v))}
   if(pk>C.guard_peak){clearInterval(t);try{U.sndOut&&U.sndOut.disconnect();U.sndStop&&U.sndStop()}catch(e){}U.sndOut=null;U.sndStop=null;U.mst=null;U.sndId=null;const old=U.ac;U.ac=new AudioContext();U.ac.resume();try{old.close()}catch(e){}U.ambience()}},C.guard_ms);
  U.mst={an,lim};return an},
 ambience(){const a=U.ac;if(!a||!U.cur)return;const id=U.cur.o.snd;if(id==U.sndId)return;U.sndId=id;
  if(U.sndOut){const o=U.sndOut,st=U.sndStop,ol=U.sndLfo;o.gain.setTargetAtTime(0,a.currentTime,.4);setTimeout(()=>{st&&st();o.disconnect();ol&&ol.stop()},2500)}
  const out=a.createGain(),r=U.cur.r,f=a.createBiquadFilter(),dl=a.createDelay(2),fb=a.createGain(),pn=a.createStereoPanner(),lf=a.createOscillator(),lg=a.createGain();out.gain.value=0;
  // per-page effects chain: random lowpass, feedback echo and slow auto-pan, so the same ambience differs on every page
  f.type=U.pick(['lowpass','lowpass','bandpass','highpass'],r(400));f.frequency.value=200*Math.pow(40,r(401));f.Q.value=r(402)*8;if(U.cur.o.k<U.cfg.calm_until){f.type='lowpass';f.frequency.value=U.cfg.calm_lp;f.Q.value=.5}dl.delayTime.value=.05+r(403)*1.2;fb.gain.value=r(404)*.6;
  lf.frequency.value=.02+r(405)*.5;lg.gain.value=r(406)*.9;lf.connect(lg).connect(pn.pan);lf.start();out.connect(f);f.connect(pn);f.connect(dl);dl.connect(fb).connect(dl);dl.connect(pn);pn.connect(U.bus(a));out.gain.setTargetAtTime(U.cfg.snd_gain,a.currentTime,.6);U.sndOut=out;U.sndLfo=lf;
  const it=U.L.snd[id];U.sndStop=it.play?it.play(a,out,U.cur.r):null},
 render(){if(!location.hash){const o={};for(const l in U.L)o[l]=U.wpick(l,0,Math.random());o.n=Math.floor(Math.random()*1e9);return location.hash=U.id(o)}
  U.off.splice(0).forEach(f=>{try{f()}catch(e){}});const p=location.hash.slice(1),o=U.parse(p);U.seen.add(U.combo(o));U.taken.clear();const r=k=>U.hs(p+':'+k),w=document.getElementById('w'),X={};for(const l in U.L)X[l]=U.L[l][o[l]];U.visits++;
  const word=(k,rr)=>{const s=X.sem.words&&X.sem.words[k],a=X.aes.words&&X.aes.words[k],q=rr*13%1;
   let t=U.pick(s&&q<U.cfg.sem_words?s:a&&q>1-U.cfg.aes_words?a:U.W[k],rr);t=X.sem.mutate?X.sem.mutate(t,rr*29%1):t;return U.corrupt?U.corrupt(t,o.k,rr*31%1):t};
  const lvl=Math.min(1,o.k/U.cfg.depth_full),ctx={p,o,r,X,lvl,word,pick:U.pick,w,beep:U.beep,go:i=>location.hash=U.child(p,i)};
  ctx.widgets=(n,k0=10)=>[...Array(n)].map((_,i)=>`<div class=row>${U.widgets[U.pick(Object.keys(U.widgets),r(k0+i))]({...ctx,r:k=>r(k0*7+i*31+k)})}</div>`).join('');
  for(const l in U.L)document.body.dataset[l]=o[l];document.body.style.transform='';document.body.style.filter='';w.style.cssText='';
  const[w0,w1]=U.cfg.widgets,[e0,e1]=U.cfg.exits,ne=e0+Math.floor(r(6)*(e1-e0+1))+Math.min(4,Math.floor(o.k/U.cfg.grow_exits));ctx.real=Math.floor(r(7)*ne);
  const titles=X.sem.titles&&r(3)<.3?X.sem.titles:X.arch.titles,body=X.arch.build?X.arch.build(ctx):`<p>${word('X',r(4))}</p>`+ctx.widgets(w0+Math.floor(r(5)*(w1-w0+1))+Math.min(8,Math.floor(o.k/U.cfg.grow_widgets)));
  w.innerHTML=`<h1>${U.pick(titles,r(3))}</h1>${body}<div class=exits>${[...Array(ne)].map((_,i)=>`<button data-i=${i}>${word('B',r(140+i))}</button>`).join('')}</div>`;
  const nav=o.nav=='lie'?U.L.nav[U.pick(Object.keys(U.L.nav),r(2))]:X.nav;
  document.getElementById('f').textContent=`${X.aes.name} · ${o.arch} · ${o.sem} · RULE: ${nav.desc} · ${o.gl} · ♪ ${o.snd} · DEPTH ${o.k}`;
  for(const b of w.querySelectorAll('button[data-i]')){const i=+b.dataset.i;b.onclick=()=>{U.beep(300+i*120);if(b.dataset.need>1){b.dataset.need--;b.textContent=`click ${b.dataset.need-1||1} more`;return}
   if(b.dataset.dead){const q=w.querySelector('p');if(q)q.textContent='ERROR 0: You are already here.';return}ctx.go(i)}}
  U.rec&&U.rec(ctx);U.cur=ctx;U.ambience();requestAnimationFrame(()=>w.querySelector('button[data-i]')?.focus({preventScroll:true}));X.arch.after&&X.arch.after(ctx);X.nav.apply&&X.nav.apply(ctx);X.gl.apply&&X.gl.apply(ctx);if(o.k>U.cfg.extra_glitch_from&&r(13)<(o.k-U.cfg.extra_glitch_from)/U.cfg.depth_full){const g=U.L.gl[U.wpick('gl',o.k,r(14))];g.apply&&g.apply(ctx)}U.reveal&&U.reveal(ctx);
  if(U.visits>1&&r(9)<U.cfg.ghost){const g=document.createElement('div');g.className='ghost';g.style.left=r(11)*80+'vw';g.style.top=r(12)*80+'vh';document.body.append(g)}}};
