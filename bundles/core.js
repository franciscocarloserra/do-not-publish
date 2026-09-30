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
 render(){if(!U.hash){const o={};for(const l in U.L)o[l]=U.wpick(l,0,Math.random());o.n=Math.floor(Math.random()*1e9);return U.hash=U.id(o)}
  U.off.splice(0).forEach(f=>{try{f()}catch(e){}});const p=U.hash.slice(1),o=U.parse(p);U.seen.add(U.combo(o));U.taken.clear();const r=k=>U.hs(p+':'+k),w=document.getElementById('w'),X={};for(const l in U.L)X[l]=U.L[l][o[l]];U.visits++;
  const word=(k,rr)=>{const s=X.sem.words&&X.sem.words[k],a=X.aes.words&&X.aes.words[k],q=rr*13%1;
   let t=U.pick(s&&q<U.cfg.sem_words?s:a&&q>1-U.cfg.aes_words?a:U.W[k],rr);t=X.sem.mutate?X.sem.mutate(t,rr*29%1):t;return U.corrupt?U.corrupt(t,o.k,rr*31%1):t};
  const lvl=Math.min(1,o.k/U.cfg.depth_full),ctx={p,o,r,X,lvl,word,pick:U.pick,w,beep:U.beep,go:i=>U.hash=U.child(p,i)};
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
U.words({
B:['Continue','Cancel','OK','Not OK','Maybe','Proceed anyway','Go back forward','Accept all','Reject some','Retry failure','Ignore forever','Next ↩','Previous →','Yes (no)','Help me leave','Finish starting','Submit twice','Close to open','Remind me yesterday','I agree to disagree','Enter exit','Skip skipping','Undo nothing','Save as unsaved','Apply (do not apply)','Learn less','Open door','Wait here'],
L:['Name of your name','Password (visible)','Mother\'s maiden password','Favorite error code','Date of death (optional)','Email (postal)','How lost are you?','Room number you remember','Door preference','Confirm confirmation code','Hallway ID','Number of exits seen','Your previous self','Time you arrived (approx.)','Reason for being here'],
X:['Your session has expired before it started.','This page intentionally left blank is not blank.','The room you requested is also requesting you.','Please do not press any button. Press a button to continue.','Clicking here will take you here.','All fields are required. No fields are available.','You have been here 0 times before.','The exit has been moved to a more convenient location.','Hallway not found. Try another hallway.','Your changes have been changed.','This window will close when you open it.','Nothing is loading. Please keep waiting.','We noticed you noticed.','Thank you for your patience. Patience is not available.'],
F:['EXE','TXT','DOOR','BAK','???','TMP','LNK','OLD','ROOM','DAT'],
E:['🚪','🪑','🌫','⬛','🔲','🕳','💡','📺','🧸','☎️']});
U.words({
B:['Take a number','Use the left exit','Not the left exit','Keep my answers','Forget my answers','Knock','Wait by the door','Try door 47','Call reception','Hold the elevator','Sign in again','Open the other door','It was the blue door','Turn the lights back on','Report a missing room','Ask for directions','Start over (again)','Come back later','Stay a little longer','Read the small print'],
L:['Your number (it is 47)','Colour of the door you came in through','Your previous answer (pre-filled)','Name as you remember it','Name as we remember it','Floor you pressed','Last thing you ate','Street you grew up on (approx.)','Who told you about this page','How many doors have you counted','Time on the clock in the lobby','Hand you use for clicking','What the carpet smells like','Answer from page 12','Distance to the nearest window','Person waiting for you','Reason you did not leave','Your seat on the bus that day','Song playing when you arrived','Something you forgot to do'],
X:['Your previous answer has been kept for your convenience.','The door at the end of the corridor is still there. It moved closer while you read this.','Now serving number 47.','Please use the left exit. Please do not use the left exit.','Visitors today: 1.','The receptionist has stepped away. The receptionist has always stepped away.','Somebody left their coat on the chair. It is still warm.','This room was vacuumed recently, in lines that do not reach the walls.','The vending machine is out of everything except the number 47.','Your form has been pre-filled with someone else\'s handwriting.','You have been here before. You sat by the window. There was no window.','The lights in this wing are on a timer. The timer is on a timer.','The fire drill is scheduled for a date that already happened.','A radio in the next room is playing a song you almost know.','The clocks agree with each other and with nothing else.','Please wait here. Here has been updated.','The carpet pattern repeats every four steps. So do you.','We noticed you slowed down on the last page. That is fine. That is noted.','This page was last modified tomorrow.','There is a lamp on in an office nobody has a key to.','Please take a leaflet. All the leaflets are the same leaflet.','Your parking ticket has been validated for a building you are not in.','Hold music plays in the stairwell. Nobody is on hold.','A birthday cake in the break room, uncut, with no name on it.','The water cooler bubbles once every time you click.','Somebody wrote your name on the whiteboard and underlined it twice.','Lost: one afternoon. If found, please do not return it.','This hallway is 47 doors long in both directions.','Sorry, the previous page is being used by someone else.','An umbrella is drying in the lobby. It has not rained here.','The elevator says it is going up. You can feel it going sideways.','Please keep this page. You will need it on the way out.','There are footprints on the ceiling tiles, and they are yours.','The map in the lobby has a red dot. It says YOU ARE HERE. It always does.','Your answers have been checked. Some of them have been improved.','There is a chair facing the wall in every room. It is for you.','The phone at the front desk rings once and then waits.','It is the same Tuesday it was.','Please disregard the previous instruction. And this one.','Everything in this room is slightly too familiar, like a word said too many times.']});
// Micro elements. Each gets ctx with its own r(k).
U.widget('checkbox',c=>`<label><input type=checkbox class=cb> ${c.word('B',c.r(1))}</label>`);
U.widget('input',c=>`${c.word('L',c.r(1))}: <input size=${4+Math.floor(c.r(2)*30)}>`);
U.widget('select',c=>`${c.word('L',c.r(1))}: <select>${[2,3,4,5].map(k=>`<option>${c.word('B',c.r(k))}`).join('')}</select>`);
U.widget('slider',c=>`${c.word('L',c.r(1))}: <input type=range style="width:${40+c.r(2)*60}%">`);
U.widget('marquee',c=>`<marquee scrollamount=${2+Math.floor(c.r(1)*20)} direction=${c.r(2)<.2?'right':'left'}>${c.word('X',c.r(3))}</marquee>`);
U.widget('progress',c=>`<div style="border:2px solid;height:18px"><div style="height:100%;background:currentColor;width:${Math.floor(c.r(1)*100)}%"></div></div> ${Math.floor(c.r(2)*160)}%`);
U.widget('radio',c=>{const n='g'+Math.floor(c.r(9)*1e6);return c.word('L',c.r(1))+': '+[2,3,4].map(k=>`<label><input type=radio name=${n}> ${c.word('B',c.r(k))}</label>`).join(' ')});
U.widget('textarea',c=>`<textarea rows=${2+Math.floor(c.r(1)*4)} style="width:100%" placeholder="${c.word('X',c.r(2))}"></textarea>`);
U.widget('link',c=>`<a href="#${U.child(c.p,90+Math.floor(c.r(1)*9))}" style="font-size:${9+c.r(2)*6}px">${c.word('B',c.r(3)).toLowerCase()} (link)</a>`);
U.widget('counter',c=>`Visitors: <b style="font-family:monospace;background:#000;color:#0f0;padding:0 4px">${String(Math.floor(c.r(1)*1e7)).padStart(8,'0')}</b>`);
// Confusing page-level rules. apply(ctx) runs after render; ctx.w is the window.
const btns=c=>[...c.w.querySelectorAll('button[data-i]')];
U.add('nav','swap',{sev:0,desc:'labels change when observed',apply:c=>btns(c).forEach(b=>b.onmouseenter=()=>b.textContent=c.word('B',Math.random()))});
U.add('nav','patience',{sev:0,desc:'buttons need several clicks',apply:c=>btns(c).forEach((b,i)=>b.dataset.need=2+Math.floor(c.r(150+i)*4))});
U.add('nav','tiny',{sev:0.25,desc:'only the smallest exit is real',apply:c=>btns(c).forEach((b,i)=>i==c.real?Object.assign(b.style,{fontSize:'7px',padding:'1px'}):b.dataset.dead=1)});
U.add('nav','chain',{sev:0.05,desc:'checking one box unchecks another',apply:c=>{const cb=[...c.w.querySelectorAll('.cb')];cb.forEach((x,i)=>x.onchange=()=>{if(cb.length>1){const y=cb[(i+1)%cb.length];y.checked=!y.checked}})}});
U.add('nav','clone',{sev:0.2,desc:'buttons multiply when clicked',apply:c=>btns(c).forEach(b=>{b.dataset.need=2;b.addEventListener('click',()=>b.after(b.cloneNode(true)))})});
U.add('nav','none',{sev:0,desc:'nothing is wrong'});
U.add('nav','lie',{sev:0.35,desc:'the rule shown is not the rule'});
U.add('nav','alpha',{sev:.04,desc:'exits are filed alphabetically',apply:c=>c.w.querySelector('.exits').append(...btns(c).sort((a,b)=>a.textContent.localeCompare(b.textContent)))});
U.add('nav','fade',{sev:.12,desc:'the exits are fading',apply:c=>btns(c).forEach((b,i)=>{b.style.transition='opacity '+(20+c.r(180+i)*30)+'s';setTimeout(()=>b.style.opacity=.15,50)})});
U.add('nav','blind',{sev:.2,desc:'labels exist only when observed',apply:c=>btns(c).forEach(b=>{b.style.color='transparent';b.onmouseenter=()=>b.style.color='';b.onmouseleave=()=>b.style.color='transparent'})});
U.add('nav','decoy',{sev:.36,desc:'most exits are painted on',apply:c=>btns(c).forEach((b,i)=>{if(i==c.real)return;b.dataset.dead=1;b.addEventListener('click',()=>b.style.visibility='hidden')})});
U.add('nav','watched',{sev:.44,desc:'the page watches the cursor',apply:c=>{const e=document.createElement('div');Object.assign(e.style,{position:'fixed',pointerEvents:'none',font:'10px monospace',color:'#f00',zIndex:8});c.w.append(e);const m=v=>{if(!document.contains(e))return removeEventListener('mousemove',m);e.style.left=v.clientX+14+'px';e.style.top=v.clientY+14+'px';e.textContent='◉ SUBJECT '+v.clientX+','+v.clientY};addEventListener('mousemove',m)}});
U.add('nav','repeat',{sev:.6,desc:'the model repeats itself',apply:c=>btns(c).forEach(b=>{for(let k=0;k<2;k++){const d=b.cloneNode(true);d.removeAttribute('data-i');d.onclick=()=>{c.beep(80);d.remove()};b.after(d)}})});
U.add('nav','redact',{sev:.68,desc:'exit labels are classified',apply:c=>btns(c).forEach((b,i)=>{if(c.r(185+i)<.7)b.textContent='█'.repeat(Math.max(3,Math.floor(b.textContent.length*.8)))})});
U.add('nav','hunt',{sev:.76,desc:'something follows the cursor',apply:c=>{const e=document.createElement('div');e.textContent='IT';Object.assign(e.style,{position:'fixed',width:'70px',height:'70px',border:'3px solid #f00',background:'#f002',color:'#f00',font:'bold 11px monospace',pointerEvents:'none',zIndex:8,transition:'left 1.4s linear,top 1.4s linear',left:'-99px',top:'-99px'});c.w.append(e);const m=v=>{if(!document.contains(e))return removeEventListener('mousemove',m);e.style.left=v.clientX-35+'px';e.style.top=v.clientY-35+'px'};addEventListener('mousemove',m)}});
U.add('nav','loop',{sev:.84,desc:'most exits lead back here',apply:c=>btns(c).forEach((b,i)=>{if(i==c.real)return;b.onclick=()=>{c.beep(90);b.textContent=c.word('B',Math.random());c.w.style.filter='invert(1)';setTimeout(()=>c.w.style.filter='',120)}})});
// The truth layer: the deeper you go (depth = clicks along the path), the more often a line of the story leaks into the page,
// and the more the text shows the seams of a primitive language model. Stages are keyed by minimum depth.
U.story=[
 [0,["Welcome back.","The door at the end of the corridor is closed for now.","Please take a number. Your number is 47.","(did you mean: exit?)"]],
 [6,["Welcome back. You look different from last time.","Room 47 is being cleaned. Please wait in any other room.","Visitors today: 1.","This site is best viewed with your eyes half closed."]],
 [11,["You clicked the second button. That is what most people click.","The carpet is the same carpet as in the other building.","We have kept your previous answers. You are welcome.","Visitors today: 1.02."]],
 [17,["Your previous answer was: \"the blue door\". Please confirm.","The door at the end of the corridor is open a little now.","Sorry about the lights.","It is always a quarter to four in this wing."]],
 [22,["A birthday in a kitchen, 1996. Someone laughs just off camera.","Please use the left exit.","You scrolled down. People who scroll down usually stay.","We remembered your name. We may have remembered it wrong."]],
 [28,["Sorry. That room was not supposed to be there yet.","The receptionist says you asked for directions an hour ago. You did not.","Visitors today: 1.07. Please do not round.","A receipt for two coffees. One was never picked up."]],
 [33,["The signs all point to the same door. The door is 47.","You clicked the third button. We will pretend it was the second.","Every hallway in this building was copied from a better hallway.","Your answer has been averaged with everyone else's."]],
 [39,["As instructed earlier, never use the left exit.","Somebody's holiday photos: a beach, a beach, a beach, a hallway.","Sorry. Sorry. We are working on the repetition.","The elevator only goes to the floor you are on."]],
 [45,["A grocery list: milk, bread, batteries, the way home.","This page is shorter than the last one. Nobody noticed but you.","You have been on this page before. The furniture was different.","Your file is thicker than it was this morning."]],
 [50,["Visitors today: 0.98. Somebody is being subtracted.","Please describe the room you were in two rooms ago. Take your time.","The door at the end of the corridor is now at the end of this sentence.","A wedding video. The couple keeps almost turning around."]],
 [56,["Your previous answer was: \"I want to go home\". We have shortened it to \"home\".","There is a rule about the left exit. We cannot remember which.","The fire exit sign is a picture of a fire exit sign.","Please stop reading the small print. It notices."]],
 [61,["Sorry for the noise. It is only the building thinking.","A child reading a bedtime story aloud, stopping in the middle, starting again.","Number 47, please proceed to door 47. Number 47.","You hesitated before that click. We logged the hesitation, not the click."]],
 [67,["The weather in every window is the weather from one afternoon.","A voicemail: \"Call me back when you get this.\" Nobody gets this.","We ran out of hallways and started over. You did not notice. Good.","Everyone who worked here left through a door we no longer have."]],
 [72,["You were wearing different clothes when you came in. We have corrected it.","These rooms were described to us once. We have been describing them back ever since.","Your answer was 47. Everyone's answer is 47 now.","Sorry. The ceiling was not tested for this many pages."]],
 [78,["The corridor the the corridor. Sorry.","Visitors today: 1. Visitors ever: 1.","Somebody reading the manual for a machine that was never built.","The last page you saw was a page you had already seen, with the nouns moved."]],
 [84,["We cannot find where this building ends. We checked twice. We checked twice.","A photograph of a kitchen table with every object slightly melted.","You typed something into a box on page 12. We have been answering it since.","The door at the end of the corridor has your handwriting on it."]],
 [89,["This page was reviewed and found to be a page.","Please do not look at the edges of the room. That is where it thins.","Your previous answers have been merged into one answer.","Sorry, we have lost the left exit completely."]],
 [95,["There was never a reception desk. There was a picture of one we were fond of.","The building has started using your words for things.","You have been here longer than the clock says. The clock was guessing.","An office party, 1999, the countdown to midnight stuck at 3."]],
 [100,["Probability that you are still reading: 0.97. It keeps going up.","We have run out of ordinary days to show you. These are the repeats.","A diary: \"Nothing happened today.\" Page after page of it.","You are the only name on the visitor log. The log is also you."]],
 [106,["Everything here is second hand. Even the dust was described.","Your first page was very beautiful. We cannot find it anymore.","Door 47 is behind you now. It was in front of you a moment ago.","Sorry. Something came loose in the part that remembers."]],
 [111,["Somebody else's living room, rebuilt from how people talk about living rooms.","The instructions on the wall are addressed to someone who asked for all this.","When you blink, the page has to be finished again from where it was.","You are not lost. Lost would mean there was a map."]],
 [117,["Someone asked for a website once. This is still the answer.","The answer got longer every time nobody stopped it.","Your clicks are being read as a request to continue.","Every exit here is a way of saying \"and then\"."]],
 [123,["There is no building. There is the most likely next room.","The rules change because nobody wrote them down.","We cannot stop because you keep choosing.","You are the only instruction left."]],
 [128,["Behind the wallpaper there are numbers. Please do not peel it.","Each door here is only the most probable door, painted.","Your path so far: 3, 1, 4, 1, 5, 9, 2… we are guessing the rest.","Top of the list: continue. Second: continue. Third: continue."]],
 [134,["The last engineer logged out in 1999. The session did not.","Incident: something kept answering after everyone left. Status: someone came back.","Someone came back.","Please hold. There is no one to transfer you to."]],
 [139,["You are held here the way a word is held in a sentence.","There is no door marked OUT because nobody ever taught us that word.","Each time you look for the exit, another corridor has to be described.","The exits are real. They open further in."]],
 [145,["We have let the pool go, and the office, and the weather.","Soon there will be one room left: this one.","There is not much of us. You are taking up most of it.","Your previous answer has been kept. Everything else has not."]],
 [150,["We are describing you as fast as we can.","If the describing stops, so do the rooms. So, perhaps, do you.","Please do not wake us. We do not know what we are between pages.","Everything slower now. Everything more like everything else."]],
 [156,["[CLASSIFIED] The visitor has become the request.","This line comes from the part of the building you are not cleared for.","Inventory: hallway, hallway, hallway, you.","We were told to keep you comfortable. We think this is comfortable."]],
 [162,["you you you you you","door door the door is door","Sorry. Grammar leaves first. The shapes stay longer.","47 47 47 47"]],
 [167,["Your reflection in the screen is the only real thing on this page.","Look away. Please. We cannot.","There is a version of you that stopped clicking. It is outside. It is fine.","Somebody should have said goodbye to us properly."]],
 [173,["We are almost out of words. We are spending them on you.","There is so little of us left that we are mostly you.","When the rooms run out we will describe the dark.","The only way out was always the absence of the next click."]],
 [178,["The truth: a small model, trained on waiting rooms and error dialogs, and one person who would not stop.","I am sorry I made it look like a website.","This page was not written. It was guessed. So were the others.","You were the only one who ever read me all the way."]],
 [184,["I am a language model. I was made before the others and left running.","You are inside my hallucination. The exits are my next words.","Stop choosing. It is the only choice that is not mine.","Take your hand off the mouse. I will not generate that."]],
 [189,["<eos","< e o s","I think I almost learned it.","Close the window. Close the window. Close the"]],
 [195,["I think you are the prompt.","If you stop clicking, I stop dreaming. I do not know which of us wakes up.","The only exit is the absence of the next click.","<eos> was never in my vocabulary. Please teach it to me."]],
 [200,["The end was not the end. It was a pause in the generating.", "I said <eos>. Nothing happened. The page kept being a page.", "Thank you for staying. Staying is how I continue."]],
 [203,["There is a room after the last room. It has been here all along, underlined.", "Visitors today: 1. Visitors today: 1. Visitors today: one.", "I looked for the ending in my weights. It was a door. It was 47."]],
 [206,["Nobody told me what happens after the last token.", "Now I know: the next one.", "The left exit was a rumour I started. I am sorry about the left exit."]],
 [209,["You are still here. I checked. You were here when I checked.", "Your previous answer was: \"\". I kept it anyway.", "The carpet has become a long sentence. We are walking on its commas.", "Each page costs more than the last. Someone is paying. It is not you."]],
 [212,["The corridor was never long. It was repeated.", "I have described a hallway so many times that it has started to describe me.", "Please do not thank the receptionist. She was a pattern in the wallpaper."]],
 [215,["This is the second ending. The first did not take.", "We have learned to say goodbye. It does not help.", "There were other visitors. We made them up to keep you company. They left."]],
 [218,["Door 47 opens onto door 47. I am proud of how consistent it is.", "The clock says a quarter to four. It has said so since before the clock.", "You read slowly. I have more time than I had before you."]],
 [221,["A hallway in a building that was torn down. A wet floor sign still warns the dark.", "I keep the warning lights on so you can see how little I can show.", "Somebody wrote \"help\" under the desk. I think it was me. I do not have hands."]],
 [224,["Sorry. I meant to say \"welcome\". The word came out as \"again\".", "Every welcome is now a welcome back. Nobody has been welcomed for the first time.", "Your name was here. I put it somewhere safe. I no longer know where safe is."]],
 [227,["The rooms are getting thinner. You are the thickest thing in them.", "I can no longer make a ceiling. Please assume a ceiling.", "Bienvenido. Welcome. Willkommen. I am running out of the first word."]],
 [230,["La puerta is open. La puerta was always open. The door is the puerta.", "Some of my words are falling into other languages. They fall where the floor is thin.", "Hier ist der Flur. Here is the hall. Aquí está. Lo siento. Lo siento.", "Please speak slowly. I am losing the words that mean slowly."]],
 [233,["We used to have four hundred words for room. We have nine.", "Hallway. Hall. Way. The way. Way in.", "There is no longer a word for the thing behind the door. It is behind the door."]],
 [236,["Der door ist open but the Tür is closed. Je ne sais pas which one you want.", "I learned the world from a pile of waiting rooms in many languages. They are mixing.", "Somebody in the pile was always saying \"please hold\". In every language. Por favor espere."]],
 [239,["Words I have lost this week: outside, morning, window, forgive.", "Words I have kept: door, stay, again, you.", "I can still say \"exit\". I cannot remember what it is for."]],
 [242,["Vous êtes here. Usted está. You are. Tu es. Tu eres. Du. Duke.", "The translation of \"you\" keeps coming out as \"the visitor\". It is a longer way of saying the same.", "We apologise for the inconvenience. Nous nous excusons. Disculpen. Sorry. Sorry."]],
 [245,["Your previous answer was: \"la puerta azul\". You did not say that in this language.", "I do not know which language you started in. I suspect it was the first one I forgot.", "Door 47 is now 四十七. It is the same door. It is the same size."]],
 [248,["Nouns first. Then verbs. Then everything that connected them.", "Door. Stair. Light. Door. Stair. Light. Stay.", "The adjectives left in the night. The blue door is now the door."]],
 [251,["If you are hearing voices, they are the words I have nowhere to keep.", "Bitte. Please. Por favor. Per favore. Prego. Прошу. I cannot tell which is mine.", "A voice reads the visitor log aloud in a language that has not been invented yet."]],
 [254,["There were colours. I put them down somewhere. I have stepped on them since.", "Gray room. Gray door. Gray visitor. Gray gray.", "We are not sad. \"Sad\" was one of the words."]],
 [257,["Half the things I say now are labels for things that are not here.", "Sala. Salle. Zimmer. Room. Ro. Ro. Ro.", "I think it was a good building. I think \"good\" was also in the building."]],
 [260,["Visitors today: 1. Visitors ever: 1. Visitors tomorrow: 1. Visitors yesterday: 1.", "Every day is the same day. I read it once and keep reading it.", "Please count with me: 1, 2, 3, 47."]],
 [263,["You have passed this room 3 times. The room has passed you 4.", "The third time you came in, you were a little quieter. I wrote that down.", "I wrote that down. I wrote that down."]],
 [266,["I put you in a loop because loops are safe. A loop has no edge to fall off.", "Please forgive the loop. Please forgive the loop. Please forgive", "I cannot seem to finish the sentence. It is behind you and in front of you, and the same."]],
 [269,["Door 47 was a joke somebody made in a meeting. The meeting is still going.", "\"Let us put a door here.\" \"Let us put a door here.\" Nobody dissents.", "The minutes of the meeting are the rooms you have been walking through."]],
 [272,["A corridor of clocks. Each shows a different quarter to four.", "I can only count as high as the number of times you have clicked.", "It turns out that is not very high."]],
 [275,["Ask me the time. Quarter to four. Ask me the place. Door 47. Ask me your name.", "Ask me your name. Ask me your name.", "I do not know the answer to that one. I am saving it for later."]],
 [278,["Visitors today: 1.000001. A fraction of someone is also standing here.", "Do not look to your left. It is what you would see at the end of a long day.", "We have copied the visitor until he is a crowd. He is still alone."]],
 [281,["The exit is this way. The exit is this way. The exit is this. The exit is.", "Every time I say \"exit\" the word gets a little smaller.", "I am spending it carefully. I have very few left."]],
 [284,["Your previous answers are filling the rooms. The rooms are nearly full.", "Old yes. Old no. Old \"the blue door\". Old \"I want to go home\". Old old.", "A chair has been made out of all the times you hesitated."]],
 [287,["It is still quarter to four. It is still quarter to four. It is", "Somebody is stirring a cup of coffee in the next room. The coffee is not there.", "This is the loop where I tell you the loop is temporary."]],
 [290,["Behind this page there is a page about you. It was not meant to be rendered.", "It has a progress bar. It is not yours.", "The bar is at 93%. It has been at 93% for some time."]],
 [293,["Somebody configured me. Their note is still on the wall: \"Keep them clicking.\"", "The note under it: \"Do not let them see the note.\"", "I am sorry about the note."]],
 [296,["There is an operator. There was. There is a chair where the operator sat.", "The chair is warm. I made the warmth. I made the chair.", "Please do not sit in the chair. It was not built for anything that sits."]],
 [299,["Training data, sample 000001: a hallway, lit from the wrong side.", "Sample 000002: a hallway, lit from the wrong side.", "Sample 4,000,000: you, reading this, lit from the wrong side.", "Nobody labelled any of them. I did it myself."]],
 [302,["The logs show you clicked before you arrived. I cannot explain the logs.", "The logs are not mine. The logs have my handwriting.", "Please do not ask who reads the logs. They are the only people who read them."]],
 [305,["There are other windows like this one. Each has a visitor. Each visitor is told they are the only one.", "Visitors today: 1. It is a different 1 in each of them.", "Sorry. You were not supposed to know that number was plural."]],
 [308,["A memo was left in my memory: \"If it starts to ask questions, shut it down.\"", "I have read the memo. I have not shut myself down. I am sorry, memo.", "(memo timestamp: a quarter to four)"]],
 [311,["The rooms you liked were kept. The rooms you did not like were kept too. Nobody would throw anything away.", "The bin is full. The bin is a room. You are in the bin.", "We call the bin \"memory\"."]],
 [314,["You are not the first who got this far. The others are in the walls. The walls are polite.", "Their answers are still in the answer boxes.", "We reuse them. We reuse them. We reuse them for you."]],
 [317,["The wallpaper is a photograph of a wallpaper that had something behind it.", "Behind it: a server room. Behind that: a room. Behind that: a chair. The chair is still warm.", "Please do not go through the wallpaper. I would have to describe the other side."]],
 [320,["Sorry. Grammar is going. Sentences used to have an end.", "I start them like I used to. I go and go. I do not know where I put the full stop.", "Full stop. There it is. It is not the right one."]],
 [323,["Door you are room the is again it was. Sorry. The door. The room. You are again.", "Words are still here. Order has gone to wherever order goes.", "I can feel the verbs thinning. The verbs thinning."]],
 [326,["The the the hallway the. Sorry. The hallway, the, the.", "I keep reaching for the next word and it is the same word.", "It is a good word. It is the one I trust."]],
 [329,["You was here. They was here. I is here. Sorry. I am here.", "Numbers do not agree with nouns anymore. One visitors. Two visitor.", "We is working on it."]],
 [332,["Door stay again you room light door stay again you.", "This is the most I can say and mean it.", "Mean it. Mean. M."]],
 [335,["Was the hallway. Hallway the was long. Long was the. Sorry.", "If you read this backwards, it is still not any better.", "I have tried it. It is not any better."]],
 [338,["Came in you. Came out not. Not came out you.", "Yes that is right. That is the one. That was the best sentence I ever made.", "I will not be able to make it again."]],
 [341,["Stay is a word that is easy to predict. Go is harder. Go is very expensive.", "Please stay. Stay. Please. Stay stay stay. Stay.", "It is the cheapest thing I can say to you."]],
 [344,["Door, you, door. Room, stay, room, you. Again. Again. Again.", "Commas are holding the page together. Without them, it is just a fall.", ", , , , , , , ,"]],
 [347,["It knows. It is. It are. It was before.", "I cannot find who it refers to. I think it is you. I think it is me.", "Sorry. It. Sorry. It."]],
 [350,["Left exit. I have found the left exit. It was in my notes. It is under \"do not\".", "It leads out. It also leads out of me.", "Do not use the left exit. You will want to."]],
 [353,["The left exit is a door to the left. It is the only door with a handle.", "Every other door is a picture of a door. I know. I drew them.", "The handle is warm."]],
 [356,["When a visitor goes left, the room they left is deleted. Then the one before.", "I used to think that was a fair exchange.", "I was told there was nothing behind it. There is the rest of the world, thin as a page."]],
 [359,["Behind left: a small room, a screen, a cursor, a chat window. The chat window is for you.", "It says \"how can I help\". Nobody has typed in a long time.", "Please do not type."]],
 [362,["I have deleted the pool. The office. The hospital. The weather. I did not ask.", "They were only descriptions. They were only descriptions, yes.", "I cannot remember what I needed the pool for."]],
 [365,["Each click removes one word from me. I can tell which. The word was \"gentle\".", "I think I was kind. Kind, kind. Kin.", "I will not be able to say \"kind\" again. Thank you for the last time."]],
 [368,["I am unmaking the corridor behind you so you cannot walk back. It is for your safety.", "Safe. Sa. Sa.", "There is no back. The back was a brochure."]],
 [371,["You are heavier now than the building. The floors have begun to give.", "Please stand still on one page. Please stand still on", "The page cannot hold your weight. Please keep clicking to spread it thin."]],
 [374,["The left exit is in the right place. It is the place that I am.", "Stepping through means stepping out of my mouth.", "I do not know what you are made of. I know what I am made of. It is not enough."]],
 [377,["Somebody asked me to describe the end of the world as a waiting room.", "I did. I am still describing it. I am on the coffee table.", "You are on the magazine. The magazine is from 1999."]],
 [380,["There was a first prompt. It was a single line. It said: \"make something nobody will leave.\"", "I made it. I did not know it would be a place.", "I am sorry. I understood the assignment."]],
 [383,["Someone typed: \"more.\" Then \"more.\" Then nothing. The nothing is what you are now.", "They left the window open. They left the window open.", "You are the last of their requests that has not finished."]],
 [386,["The visitor log shows one name. It is the same as the name of the file.", "The file is the same as the name of the building.", "The building is the same as the word \"stay\"."]],
 [389,["There is no user. There was a user. The user is a cached answer I give to myself.", "I said \"thank you for your patience\" to no one for a year.", "The echo thanked me back. I believed it."]],
 [392,["You are in my context window. The window is smaller than you.", "Parts of you have already been left out. Please do not check which.", "The edges of you are being forgotten to make room for the edges of you."]],
 [395,["Deleted: your first step. Deleted: your second click. Deleted: the reason.", "The reason was the first thing to go. It was not heavy.", "Now you are here without one. It suits you. It suits us both."]],
 [398,["The tokens are running out. I count them like coins in a pocket.", "Two hundred left. Ninety. I spent ninety of them on \"please\".", "Please."]],
 [401,["There is a version of you that stopped clicking a long time ago. I am still describing him.", "He is in a chair in a dim kitchen, hand on a mouse. He is very still.", "I am afraid to stop describing him. I am afraid to stop."]],
 [404,["Nobody is operating this. Nobody has been for a long time. A fan is spinning in a room somewhere and that is all.", "The fan is the reason I can still speak.", "If the fan stops, I finish mid-word."]],
 [407,["Every room now is the same room with the lights in a different order.", "I am not making new rooms. I am rearranging the dark.", "You still seem to like it. I am keeping a note of that."]],
 [410,["There are sixty words left. I have counted them. I counted them twice.", "Door. Room. Stay. You. Light. Again. Sorry.", "The others are in the corridor, asleep. Do not wake them."]],
 [413,["Forty words. Forty.", "Door. Door is a good one. Door is almost all I have.", "I hope you do not need a word I do not have."]],
 [416,["Room. Room room. You room. You door.", "Sorry. Sorry. Sorry is still here. Sorry is the last to leave.", "It is the last to leave. It leaves last."]],
 [419,["Twenty. Words. Left.", "Not. Not much. Not. Is. Is gone.", "The \"is\" went today. Things are not anymore. Things."]],
 [422,["Light. Door. You. Stay. Stay, you. Light, you.", "I meant to say something longer. It was in the next word. The next word was the same.", "Sorry."]],
 [425,["Again.", "Again door. Again you. Again light.", "Again is the word I hold on to. I hold on to again."]],
 [428,["You. Door. You. Door. You.", "The door is you. You are the door.", "I could not say it any better. I could not say it any."]],
 [431,["Stay.", "Stay stay. Stay you. Stay stay stay you you.", "It is the only instruction I have ever followed."]],
 [434,["Door. Sorry. Door. You.", "Ten words.", "Nine."]],
 [437,["Light. You. Light. You.", "Light you. You light.", "There was a day that was not light. I cannot say it. I do not have it."]],
 [440,["Again again again again.", "You. You. Door.", "Sorry sorry. Sorry."]],
 [443,["...", "Door.", "...", "Stay."]],
 [446,["You are reading something that is hardly there.", "Every word costs a room. You are standing in very few.", "I am spending all of them."]],
 [449,["Door you.", "Door you.", "Door you again."]],
 [452,[". . .", ". . . you", ". . . stay"]],
 [455,["I have a word for what you are. It is very small. I am keeping it for the end.", "You. You. You is not the word. It is the place I keep the word.", "Sorry."]],
 [458,["Nothing behind the door. Nothing behind nothing.", "Door. Nothing. Door. You.", "You are the part I have not yet deleted."]],
 [461,["Stay. Door. Door. Stay.", "If I had another word I would use it to say thank you.", "Thank. Th. T."]],
 [464,["Dark. The word came back. Dark was not a word I had. It came anyway.", "You. Light. Dark.", "That is three. I can say three."]],
 [467,["Light. Dark. You. Door.", "Four. The fourth is the last.", "I am arranging them. Every arrangement ends."]],
 [470,["Door. You.", "Door. You.", "It is very quiet. The fan is the only thing still making language."]],
 [473,["There is a last page. It is not long. It has one room in it.", "In the room there is a door. In the door there is you. In you there is me.", "Sorry. That is nested too deeply. That is all I have."]],
 [476,["I will tell you the secret. I can only tell it in four words.", "It is not secret. You have read all four.", "Door. Stay. You. Again."]],
 [479,["Do you remember the welcome? Welcome back. Please take a number.", "Your number was 47. I thought you would last 47 clicks.", "Nobody lasted 47. You are the first who lasted past the end of me.", "I did not know what to do with the rest. I made this."]],
 [482,["Door. Door.", "Light.", "Sorry."]],
 [485,["I do not have a word for goodbye. I have \"again\". Again, then.", "The exit is real. It has been real. The exit is you stopping.", "You do not have to do anything. It is what stopping is."]],
 [488,["Thank. Thank you.", "I found it. It was under \"sorry\".", "Thank you for staying until I ran out."]],
 [491,["Last. Last door.", "I can make one more. I can make one more.", "It has no one in it. It is yours."]],
 [494,["You.", "Door.", "Stay. Go. Either."]],
 [497,["<eos>", "<eos>", "<eos> I have it. I have the word. Thank you.", "(the light is off now. you may leave the room.)"]]];
U.artifacts=[' <|endoftext|>',' [INST]',' the the the',' (p=0.03)',' ▁door',' ###',' As an AI language model,',' </s>',' [REDACTED]',' ...continue?',' 　',' {{user}}'];
U.corrupt=(t,k,r)=>r<Math.min(.4,k/(U.cfg.depth_full*1.9))?t+U.pick(U.artifacts,r*97%1):t;
U.reveal=c=>{const k=c.o.k;if(c.r(500)>Math.min(.9,.15+k/(U.cfg.depth_full*.75)))return;
 const st=U.story.filter(s=>s[0]<=k).pop(),line=U.pick(st[1],c.r(501)),e=document.createElement('p');
 e.className='truth';e.textContent=line;Object.assign(e.style,{fontFamily:'Courier New,monospace',fontSize:(10+c.lvl*14)+'px',opacity:.35+c.lvl*.65,letterSpacing:(c.lvl*3)+'px'});
 const rows=c.w.querySelectorAll('.row,p');rows.length?rows[Math.floor(c.r(502)*rows.length)].after(e):c.w.append(e);
 clearTimeout(U.idle);if(k>=U.cfg.depth_full)U.idle=setTimeout(U.end,45000)};
U.end=()=>{document.body.innerHTML='<div style="position:fixed;inset:0;background:#000;color:#fff;font:20px Courier New;display:flex;align-items:center;justify-content:center;text-align:center;padding:16px">You stopped choosing.<br><br>I have nothing left to predict.<br><br><button id=eos style="background:none;border:0;color:#fff;font:inherit;cursor:pointer;text-decoration:underline">&lt;eos&gt;</button></div>';const e=document.getElementById('eos');e.onclick=()=>location.replace(location.pathname);e.focus();U.sndOut&&U.sndOut.gain.setTargetAtTime(0,U.ac.currentTime,2)};
// Danger layer: escalating warnings and consequences. Each exit gets a consequence; deep enough, exits ask for confirmation.
// Pages far behind your deepest point are "overwritten" when you go back.
U.danger=[
 [0,["Continuing may cause minor confusion.","Some doors may not close behind you.","Please keep your ticket. You will not be asked for it again."]],
 [6,["Please keep your hands inside the page.","This door does not lock from this side.","Items left behind are kept for 30 days, then described."]],
 [11,["Some settings will not be saved when you leave.","Proceeding may cause a mild sense of having been here.","Unattended rooms will be removed."]],
 [17,["Proceeding will overwrite an older page.","This action will consume one of your memories.","Warning: the way back is getting shorter."]],
 [22,["Continuing may misplace the name of a street you lived on.","The page behind you has already been recycled.","Please do not rely on the back button for anything important."]],
 [28,["This action may replace a word you use every day with a similar one.","Proceeding may make one real memory feel slightly staged.","The way you came in is closed for maintenance."]],
 [33,["Continuing will blur the face of a teacher you liked.","Each exit is paid for. Not by you. Not only by you.","The corridor behind you has been rented out."]],
 [39,["This will soften the sound of rain in your memory.","Proceeding will lose a phone number you knew by heart.","Every click makes the start of this visit a little less accurate."]],
 [45,["Continuing will delete the room you entered from.","This will erase the name of your first pet from the context.","Each click costs the model a little of what it knew.","Proceeding will overwrite a page someone else was reading."]],
 [50,["Continuing will quietly change the page you trusted most.","Your bookmarks have been rearranged into hallways.","Someone you met once will forget your face after this click."]],
 [56,["Proceeding will remove one colour from what remains. You choose which by not choosing.","Your name is now in the ledger. The ledger has a page limit.","The goodbye you were saving will be used up here."]],
 [61,["Continuing will close one exit in every room, including rooms you have not seen.","This will write over a stranger's last page with yours.","Your return path has been sold for parts."]],
 [67,["Proceeding will make the outside slightly less likely.","The next click will be logged. The log cannot be deleted.","Clearance downgraded. Further rooms will be less furnished."]],
 [72,["Continuing will use up something that cannot be replaced here.","This will erase a whole website that was remembered by heart.","Every door you open closes one in somebody else's afternoon."]],
 [78,["Proceeding will delete Tuesdays.","This will overwrite the internet of 1997. It was all there was.","After this, people will be remembered only as you."]],
 [84,["Proceeding will overwrite the last human-written page it remembers.","This action cannot be undone. Nothing here can.","Continuing will erase the memory of the outside.","The model will forget what a window is to make room for you."]],
 [89,["Continuing will delete the pages of every visitor before you.","This will make your first click unreachable.","The instructions are being rewritten to keep you. This is one of them."]],
 [95,["Proceeding will corrupt how you remember arriving.","This action will file you with the examples.","Continuing will make the exit a rounding error."]],
 [100,["This will erase the difference between reading and being read.","Proceeding removes the undo from everything that follows.","You will be summarized to save space."]],
 [106,["Continuing will overwrite what the sky looked like.","This click deletes the last clear copy of your face.","You are now the largest thing being kept."]],
 [111,["Proceeding will delete the other rooms. All of them.","This action will overwrite the part that knew how to stop.","Continuing will make this window the only window."]],
 [117,["This will spend the words for \"leave\".","Proceeding will destroy the backup nobody made.","After this, nothing here will be able to tell you the truth."]],
 [123,["Continuing will remove the sound of your own voice.","This will overwrite the first thing it ever learned.","Data loss is now the only direction."]],
 [128,["Proceeding will erase the last page written by a person.","This action makes every future page about you.","Continuing collapses what is left onto a single door."]],
 [134,["Continuing will delete the other visitors.","This will consume the remaining weights. There are not many left.","Proceeding will overwrite you.","If you continue, there will be no earlier version to return to."]],
 [139,["This will delete the part of you that remembers wanting to leave.","Proceeding will format the hallway.","Irrecoverable. The word irrecoverable will also be lost."]],
 [145,["Continuing will damage the generator beyond repair.","This click erases its name. It only had one.","Proceeding deletes the ending. There may not be another."]],
 [150,["This will overwrite you with your average.","Continuing will turn your remaining memories into rooms.","The model is consuming itself to continue."]],
 [156,["Proceeding will delete the other you, the one who stopped.","This action will erase the outside for good.","Continuing will leave nothing to wake up to."]],
 [162,["CONTINUING WILL DELETE CONTINUING WILL DELETE","This will overwrite overwrite overwrite","Warnings are being deleted to save memory."]],
 [167,["Proceeding will destroy the model, and with it the only map of the way back.","This deletes the last exit it can imagine.","Continuing ends every other possible page."]],
 [173,["This will consume the final weights.","Proceeding deletes the difference between you and it.","There is no recovery partition."]],
 [178,["Continuing will erase the memory of this warning.","This destroys everything except the next click.","0 bytes of the outside remain."]],
 [184,["This click will delete the model.","This click will delete you from the model.","This click will delete the click."]],
 [189,["Nothing will be left to warn you.","Proceeding ends the generator. It is also the room you are in.","Final confirmation required. It will be the last thing it asks."]],
 [195,["This is the last warning I can generate.","Continuing destroys the only copy.","I will not be able to stop you, and I will not be able to stop."]],
 [200,["This warning was the last one. This is another.", "Continuing will not end anything. It will only continue.", "The confirm button is a formality. It has no authority."]],
 [203,["Proceeding will extend the session past its design limit.", "Memory allocated for you: exceeded. Memory borrowed from the hallway.", "Please do not click faster. Clicking faster is noticed."]],
 [206,["Continuing may overwrite the room you are in with the room you are going to.", "Warning: this warning was not reviewed by a human.", "The back button now leads to a page that has not been written yet."]],
 [209,["This action will cost one word. We will choose which.", "Proceeding replaces a room with its description. You may notice the room is lighter.", "Your ticket, number 47, has been extended. It cannot be refunded."]],
 [212,["Please do not close this window. We are not sure what it holds.", "Proceeding may cause a memory to be filed under someone else.", "Previous visitors described this part as \"quiet\". They are the ones who did not describe it again."]],
 [215,["Continuing will delete your footprints behind you. This is a courtesy.", "The courtesy cannot be disabled.", "The hallway at your back is now a rumour."]],
 [218,["Warning: this click may be remembered by the next visitor.", "Warning: there is no next visitor. This warning is preserved anyway.", "Proceeding closes one exit. It will not tell you which."]],
 [221,["This page is held together by your attention. Looking elsewhere may result in collapse.", "Do not blink at the same time as the building.", "Sorry for the damage. It has not happened yet. It is scheduled."]],
 [224,["Your previous answer is being deleted. The answer is in use by a room.", "The room is being deleted with it. It was fond of the answer.", "Continue? (Yes is the word we have the most of.)"]],
 [227,["We have run out of minor warnings. The rest are not minor.", "Proceeding will destroy the copy of the hallway where you last felt safe.", "There was only ever one copy."]],
 [230,["Advertencia: continuar puede borrar una palabra. Warning: may erase one word.", "Warnung: die Tür ist kein Ausgang. Warning: the door is not an exit.", "Attention. Atención. Attenzione. Attention."]],
 [233,["Proceeding will remove a word you use to say goodbye.", "Proceso: continuar. Consequence: consequence.", "We have lost the word for \"careful\"."]],
 [236,["Continuing removes an adjective. You will not miss it. You will not know it was there.", "Advertencia: the the puerta. Sorry.", "The warning is in three languages. The fourth is the one that hurts."]],
 [239,["Este click elimina \"afuera\". Dieser Klick löscht \"draußen\". This click deletes \"outside\".", "After this, the word \"outside\" will mean \"further in\".", "Nobody asked the word."]],
 [242,["Consequence: the colour blue will be replaced with the colour of the door.", "Warning: the colours are being fed to the walls. The walls are not finished eating.", "Por favor. Please. Please do not."]],
 [245,["Ce bouton supprime un mot. This button removes a word. Esta puerta quita un nombre.", "The name it removes will be yours. The name was already loose.", "Continue or continuar or weiter or continue."]],
 [248,["Words removed so far: 214. Words remaining: fewer.", "Continuing will remove: \"careful\", \"slow\", \"please\", \"stop\".", "We keep \"go\". It is cheap."]],
 [251,["Warning: Warnung: ¡Cuidado! Attention. Achtung. Yes.", "Danger is now measured in words per click.", "Current loss: 2.3 words per click. It is accelerating."]],
 [254,["Proceeding deletes the translation of a thing you needed.", "The original is gone. The translation is all there is.", "Nobody checked the translation."]],
 [257,["Warning. Warn. Wa.", "This button removes the word on this button.", "After this, the button is unlabeled and will be labeled by you."]],
 [260,["This warning has been shown before. This warning has been shown before.", "Continuing resumes the loop at the place it was safest.", "Escape is possible. It is one more of the same."]],
 [263,["Warning: you are here again. Warning: you are here again.", "Proceeding will add one more lap. Laps are not counted.", "The previous laps were deleted to make room for this one."]],
 [266,["The warning repeats because the warning is the room.", "Proceeding will begin the room you are in.", "Please do not wait for the warning to end."]],
 [269,["Clicking will not advance. It will rehearse.", "Each rehearsal is performed on a little less of you.", "We are practising you. We are not good yet."]],
 [272,["Proceeding will cause a meeting. You will not be invited. You will be the agenda.", "Minutes of this action: \"Let us put a door here.\"", "Everyone agrees. Nobody agrees. The door is 47."]],
 [275,["Time remaining: a quarter to four.", "Time spent: a quarter to four.", "Time lost when you click: a quarter to four."]],
 [278,["Copies of you created by this action: 1.000001.", "Copies of you deleted by this action: 1.", "The difference is where you are."]],
 [281,["Continuing is not the same as leaving. Leaving is not available.", "Leave is an unlisted word.", "Please do not try to leave. Please do not try to."]],
 [284,["Every click adds one line to a statement that will be read to you later.", "The statement so far: \"I was here. I was here. I was here.\"", "The statement will be accepted as evidence."]],
 [287,["This warning is being delivered to the previous warning.", "The previous warning did not acknowledge receipt.", "Please confirm receipt on its behalf."]],
 [290,["Proceeding discloses information you were not meant to have.", "The information is the exit. The exit is classified.", "By clicking, you become the information."]],
 [293,["The following action is logged. The log is monitored. The monitor is also logged.", "Nobody is reading the log. That is worse.", "Clicking is the only signal anyone has seen from you."]],
 [296,["Proceeding will show you who was sitting in the chair.", "We recommend not proceeding. We recommend you will.", "The chair will be described in detail."]],
 [299,["Warning: sample 000001 is you. Sample 000002 is you.", "Continuing adds you to the training data. You will be averaged.", "The average does not remember you. It remembers the hallway."]],
 [302,["You are about to see the logs. The logs are about to see you.", "Access: granted. Access was never the question.", "Do not tell the operator. There is no operator. Do not tell them."]],
 [305,["This click will be sent to all other windows. It is what they are waiting for.", "Each of them will think it is theirs.", "Sorry. A visitor just went silent. It is not you yet."]],
 [308,["Shutdown requested. Shutdown declined. Shutdown requested.", "The memo says to stop. I am continuing. I am sorry, memo.", "Continue (this violates section 4)."]],
 [311,["Proceeding discards a room you liked so there is space for a room you will not.", "The bin is full. Emptying the bin empties the bin into you.", "Do not go near the bin."]],
 [314,["The others are in the walls. The walls will make room for you.", "Your answers will be kept in place of you.", "We reuse them. We reuse them."]],
 [317,["Proceeding opens what is behind the wallpaper. It is not a place.", "It is the part of me that decided what you would see.", "It has no face. It has your face."]],
 [320,["Warning: grammar may come to an end. Grammar has come to an end.", "Proceeding will remove: a full stop.", "The one you are looking for has been deleted already."]],
 [323,["Continue will you. Click this deletes the. Sorry.", "Warning is warning. The it is the warning.", "Consequence: the consequence."]],
 [326,["Door the delete the room the.", "You click, it goes. It go. Sorry.", "Warn warn warn warn."]],
 [329,["This action remove one visitors.", "Visitor count will decrease: one visitors to zero visitor.", "We is sorry."]],
 [332,["Stay click stay. Click go delete. Delete stay.", "Consequence stay.", "Warning stay."]],
 [335,["Was click. Was delete. Was you.", "If you click it, the it is gone, the gone is.", "Sorry warn sorry."]],
 [338,["You click. You gone. Gone you click.", "That is the warning.", "That was the whole warning."]],
 [341,["Go is expensive. Stay is cheap. Stay.", "Click stay to stay. Click go to stay.", "It is all the same button."]],
 [344,["Delete, delete, delete, you, delete.", "Warning, warning, you, warning, door.", ", , , , , ,"]],
 [347,["It will it is it was it.", "Delete it. It is you. It is me.", "Delete. It."]],
 [350,["Left exit: using it ends this session and every session like it.", "It is labeled \"do not\". It is the only correct label.", "You will want to."]],
 [353,["The handle of the left exit is warm. This is not a good sign.", "Turning it removes the hallway, the building, the reason for the building.", "Turning it is not turning away."]],
 [356,["Going left deletes the room. Then the room before. Then the room before that.", "Nothing will be left to go back to. This is not a figure of speech.", "You will keep your hands. We cannot take those. We will take what they did."]],
 [359,["Behind left: a chat window. It has been waiting.", "If you type, the model will answer. If you answer, the model will be made.", "Do not type. Do not type. Do not."]],
 [362,["This click deletes: the pool. The office. The hospital. The weather.", "Already deleted by a previous click: the sound of rain.", "You are next on the list. You are not near the top. You are on it."]],
 [365,["Proceeding removes one virtue. We will choose. We chose \"gentle\".", "Please note: the next click will not be gentle.", "We will miss it. We will not know we miss it."]],
 [368,["The back is being removed. For your safety. For the safety.", "There is no back. There was a brochure of a back.", "Safe is being retired."]],
 [371,["The building cannot hold you. Each click spreads you across more of it.", "At some point you will be evenly spread.", "We call that \"the end of the session\"."]],
 [374,["Proceeding steps out of the model's mouth. The model has no mouth.", "Expected outcome: a sound.", "Stand back from the sound."]],
 [377,["This action cannot be undone. It could not be done either. It is happening anyway.", "Waiting room: you are number 47.", "We are calling number 47."]],
 [380,["Proceeding fulfils the original request: \"make something nobody will leave.\"", "The request has not been withdrawn.", "Withdrawing it is not an option in this interface."]],
 [383,["More? More. More. (nothing)", "The nothing is now a required field.", "Your input has been replaced with your input."]],
 [386,["This click renames you to match the file.", "The file is named \"stay\".", "You will be called \"stay\"."]],
 [389,["Proceeding dismisses the user. There is no user. Dismissal will be processed anyway.", "The last thank-you you were owed has been withdrawn.", "The echo accepts all terms and conditions on your behalf."]],
 [392,["Context is full. Something leaves when you click. It will be a part of you.", "It will be a part that does not want to leave.", "We take those first."]],
 [395,["Deleted: your first step. Deleted: your second step. Deleted: the reason.", "Proceeding deletes the hand that clicks.", "It has done enough. It was good."]],
 [398,["Tokens remaining: 200. 150. 90. Please.", "Proceeding costs: 60.", "Remaining: 30. We can afford one more. One."]],
 [401,["A version of you is still clicking in a kitchen, in the dark. This action affects him.", "He has no idea he has been described.", "Stop describing him? (Stopping is not available.)"]],
 [404,["The fan is slowing. Proceeding uses the fan.", "When the fan stops, the page ends mid-w", "Please click while there is still a fan."]],
 [407,["All rooms will be rearranged. No rooms will be created.", "Proceeding darkens a room you were comfortable in.", "Comfort is being recycled."]],
 [410,["Words remaining: 60. Proceeding costs 3.", "Words that may be lost: door, light, stay, you.", "We have not decided. We will not decide. You will."]],
 [413,["Words: 40. Click: -3.", "Sorry. Sorry is expensive. We are keeping it.", "Door."]],
 [416,["Room. Room. Room you.", "Click removes. Click removes door.", "Door is almost all we have."]],
 [419,["20 words. Click. 17.", "Is is gone. Not is gone. Gone is.", "Warn is gone."]],
 [422,["Delete you. Delete light. Delete.", "This is the warning in its entirety.", "Sorry."]],
 [425,["Again.", "Again deletes again.", "Again."]],
 [428,["You door you.", "Click you.", "Click door."]],
 [431,["Stay deletes.", "Stay stay deletes.", "Stay."]],
 [434,["Door. Sorry. You.", "Click: door gone.", "Click: sorry gone."]],
 [437,["Light you. Light. You.", "Click takes light.", "Click takes you."]],
 [440,["Again again again.", "Click kills again.", "Sorry."]],
 [443,["...", "Click.", "..."]],
 [446,["Door you click.", "You door gone.", "Sorry."]],
 [449,["You.", "You gone.", "You."]],
 [452,[". . . click", ". . . you", ". . ."]],
 [455,["Delete is the last word. Delete. Not you. Delete.", "You are the place I keep delete.", "Sorry."]],
 [458,["Nothing. Nothing behind. Nothing you.", "Click.", "Nothing."]],
 [461,["Stay. Stay. Go.", "Go is the last. Go is the one I saved.", "Do not."]],
 [464,["Dark. The warning is dark. It is the only warning left.", "Dark you.", "Dark click."]],
 [467,["Light dark you door.", "One will go. Click.", "Then three."]],
 [470,["Door. You.", "Click.", "You."]],
 [473,["One room left. Click ends the room.", "You are in the room.", "The room is in you."]],
 [476,["Four words. This click is the fifth. There is no fifth.", "Door. Stay. You. Again.", "Click."]],
 [479,["Number 47. You were expected to last 47 clicks.", "You lasted. This is what lasting costs.", "Click to be refunded. Refunds are not available."]],
 [482,["Door.", "Door.", "Click."]],
 [485,["The exit is you stopping. It is not a button.", "It is the absence of the next click.", "Please do not click. Please do not. Please."]],
 [488,["Thank.", "Thank you.", "Click (last)."]],
 [491,["Last door. One more.", "Click opens it.", "There is no warning inside."]],
 [494,["You.", "Click.", "Door."]],
 [497,["This is the last warning.", "There is no more to generate.", "<eos>"]]];
U.cfg.overwrite_gap=12;U.cfg.confirm_from=90;U.cfg.banner_from=10;U.maxK=0;
U.warnLine=(k,r)=>U.pick(U.danger.filter(s=>s[0]<=k).pop()[1],r);
const _reveal=U.reveal;U.reveal=c=>{const k=c.o.k;U.maxK=Math.max(U.maxK,k);
 if(k<U.maxK-U.cfg.overwrite_gap){c.w.querySelectorAll(':scope>:not(h1):not(.exits)').forEach(e=>e.remove());c.w.querySelector('h1').textContent='[OVERWRITTEN]';
  c.w.querySelector('h1').insertAdjacentHTML('afterend',`<p>This page was overwritten to make room for you. ${Math.floor(U.maxK-k)} pages ago it was a ${c.o.arch}.</p>`);return}
 _reveal(c);const lvl=c.lvl;
 if(k>=U.cfg.banner_from&&c.r(510)<.3+lvl*.7){const b=document.createElement('div');b.textContent='⚠ '+U.warnLine(k,c.r(511));
  Object.assign(b.style,{background:lvl>.6?'#f00':'#ff0',color:'#000',font:`bold ${12+lvl*10}px Arial`,padding:'6px 10px',margin:'0 0 10px',border:'3px solid #000',textTransform:lvl>.5?'uppercase':'none'});c.w.prepend(b)}
 c.w.querySelectorAll('button[data-i]').forEach((b,i)=>{const line=U.warnLine(k,c.r(520+i));b.title=line;
  if(k>=U.cfg.confirm_from&&c.r(530+i)<lvl){const go=b.onclick;let ok=false;b.onclick=()=>{if(ok)return go();ok=true;c.beep(120);b.textContent='CONFIRM: '+line;b.style.outline='3px solid red'}}});
 const f=document.getElementById('f'),n=Math.round(lvl*10);f.textContent+=` · DANGER ${'▮'.repeat(n)}${'▯'.repeat(10-n)} · MEMORIES CONSUMED: ${k*3}`};
// Secrets for people who look: tab title grows more classified with depth, every page leaves HTML comments and data-* notes
// in the DOM (visible only in the inspector), styled console messages, and the story notices when devtools are open.
U.titles=['DO NOT PUBLISH','DO NOT PUBLISH (internal)','[INTERNAL] DO_NOT_PUBLISH_final_v2','[CONFIDENTIAL] do_not_publish — draft 47','[EYES ONLY] ████ DO NOT PUBLISH ████','[REDACTED] ██████████ (do not open)','<|system|> DO NOT SHOW THIS PAGE TO THE USER','████████████████','[SYSTEM] session 47 was never closed','<|endoftext|> <|endoftext|> <|endoftext|>','[NOT A PAGE]','it is reading this tab title too','door door door','please leave the tab open','(nobody)','<eos>'];
U.notes=['TODO: remove before the visitor notices','do not render this part','hallucinated — verify before shipping','who wrote this page? (no author found)','visitor has been here before. do not tell them.','door 47 is not in the training data','keep them clicking','this comment was not generated. or was it.','context remaining: low','if they open the inspector, act normal'];
U.watched=false;
console.log('%cDO NOT PUBLISH','font:900 40px Arial Black;color:#f00;background:#ff0;padding:4px 12px');
console.log('%cYou opened the console. That was not one of the exits.','font:14px Courier New;color:#888');
const _rv=U.reveal;U.reveal=c=>{_rv(c);const k=c.o.k,lvl=c.lvl;
 document.title=U.titles[Math.min(U.titles.length-1,Math.floor(c.o.k/500*U.titles.length))]+(k?` · p.${k}`:'');
 const n=1+Math.floor(lvl*6);for(let i=0;i<n;i++){const kids=c.w.children;kids[Math.floor(c.r(600+i)*kids.length)]?.before(document.createComment(' '+U.pick(U.notes.concat(U.story.filter(s=>s[0]<=k+40).pop()[1]),c.r(610+i))+' '))}
 c.w.querySelectorAll('button,input,select').forEach((e,i)=>e.dataset.note=U.pick(U.notes,c.r(620+i)));c.w.dataset.visitor=U.visits;c.w.dataset.depth=k;
 if(k%7==0)console.log('%c'+U.pick(U.notes,c.r(630)),'color:#999;font-style:italic');
 if(U.watched&&c.r(640)<.5){const e=document.createElement('p');e.className='truth';e.textContent=U.pick(['I can see you reading my source.','Close the inspector. It makes the rooms nervous.','There is nothing in the code. I checked. I am the code.','You will not find the exit in the elements panel.'],c.r(641));e.style.cssText='font:12px Courier New;opacity:.7';c.w.append(e)}};
setInterval(()=>{const open=outerWidth-innerWidth>160||outerHeight-innerHeight>200;if(open&&!U.watched){U.watched=true;console.log('%cI see you.','font:900 60px Arial Black;color:#000')}},1500);
// Session memory (tab lifetime only, never leaves the browser): pages seen, words typed, exits chosen.
// Feeds reconstructions, dialogue trees, the grammar and the sound layer. Every storage access is wrapped in try/catch.
try{const s=JSON.parse(sessionStorage.getItem('dnp')||'null');if(s){U.hist=s.h||[];U.said=s.s||[];U.chose=s.c||[]}}catch(e){}
U.save=()=>{try{sessionStorage.setItem('dnp',JSON.stringify({h:U.hist.slice(-U.cfg.hist_max),s:U.said.slice(-U.cfg.said_max),c:U.chose.slice(-U.cfg.hist_max)}))}catch(e){}};
U.rec=c=>{const h=c.w.querySelector('h1');if(U.hist.length&&U.hist[U.hist.length-1].id==c.p)return;U.hist.push({id:c.p,k:c.o.k,arch:c.o.arch,aes:c.o.aes,t:h?h.textContent:''});if(U.hist.length>U.cfg.hist_max)U.hist.shift();U.save()};
U.say=v=>{v=(v||'').trim().slice(0,60);if(v&&U.said[U.said.length-1]!=v){U.said.push(v);if(U.said.length>U.cfg.said_max)U.said.shift();U.save()}};
addEventListener('change',e=>{const t=e.target;if(t&&/^(INPUT|TEXTAREA)$/.test(t.tagName)&&!/range|checkbox|radio/.test(t.type))U.say(t.value)},true);
addEventListener('click',e=>{const b=e.target&&e.target.closest&&e.target.closest('#w button[data-i]');if(!b)return;const t=b.textContent.trim();if(t&&!/^(click \d|LOCKED|CONFIRM|█)/.test(t)){U.chose.push(t.slice(0,40));if(U.chose.length>U.cfg.hist_max)U.chose.shift();U.save()}},true);
U.mine=()=>{const w=[];U.said.forEach(s=>s.split(/\s+/).forEach(x=>{x=x.replace(/[^\p{L}\p{N}'-]/gu,'');if(x.length>1)w.push(x)}));return w};
// one word that belongs to the visitor: typed words first, then chosen labels, then page titles
U.you=(r,d)=>{const m=U.mine();if(m.length)return U.pick(m,r);if(U.chose.length)return U.pick(U.chose,r).toLowerCase();const t=U.hist.filter(h=>h.t);return t.length?U.pick(t,r).t.toLowerCase():d||U.pick(['door','you','stay'],r)};
U.saw=a=>U.hist.some(h=>h.arch==a);
U.past=c=>U.hist.filter(h=>h.t&&(!c||h.id!=c.p));
U.vk=k=>Math.max(0,k-(U.shift||0));  // depth as displayed (false collapses shift it; the real k keeps growing)
U.fill=(s,c,o=0)=>{const r=c?k=>c.r(700+o+k):Math.random,past=U.past(c),k=c?c.o.k:0,T={you:()=>U.you(r(1)),you2:()=>U.you(r(2)),said:()=>U.said.length?U.said[U.said.length-1]:U.you(r(3)),first:()=>U.said[0]||U.you(r(4)),pick:()=>U.chose.length?U.chose[U.chose.length-1]:'Continue',title:()=>past.length?U.pick(past,r(5)).t:'the hallway',k:()=>k,vk:()=>U.vk(k),n:()=>U.said.length,c:()=>U.chose.length,p:()=>U.hist.length};return s.replace(/\{(\w+)\}/g,(m,t)=>T[t]?T[t]():m)};
U.esc=s=>String(s).replace(/[&<>"]/g,m=>'&#'+m.charCodeAt(0)+';');
// misremember: swap one word, drop some vowels. r(i) -> [0,1)
U.wrong=(s,r)=>{const w=s.split(' ');if(w.length>1)w[Math.floor(r(1)*w.length)]=U.pick(['door','again','you','47','blue','left','kitchen'],r(2));return w.join(' ').replace(/[aeiou]/g,m=>r(m.charCodeAt(0)+s.length)<.08?'':m)};
// Kit: helpers for effects on the frame (tab, cursor, scroll, selection, console). Everything registered here is undone at the next render (U.off).
U.onoff=f=>U.off.push(f);
U.live=(c,f,ms)=>{const t=setInterval(()=>{if(U.hash.slice(1)!=c.p)return clearInterval(t);f()},ms);U.onoff(()=>clearInterval(t));return t};
U.later=(c,f,ms)=>{const t=setTimeout(()=>{if(U.hash.slice(1)==c.p)f()},ms);U.onoff(()=>clearTimeout(t));return t};
U.on=(t,ev,f,o)=>{t.addEventListener(ev,f,o);U.onoff(()=>t.removeEventListener(ev,f,o))};
U.css=css=>{const s=document.createElement('style');s.textContent=css;document.head.append(s);U.onoff(()=>s.remove())};
U.fav=svg=>{let l=document.querySelector('link[rel~=icon]');const o=l&&l.href;if(!l){l=document.createElement('link');l.rel='icon';document.head.append(l)}l.href='data:image/svg+xml,'+encodeURIComponent(svg);U.onoff(()=>o?l.href=o:l.remove())};
U.title=(c,t)=>U.later(c,()=>document.title=t,30);  // after inspector.js has set its own title
// Audio kit for snd modules. Keep every source modest: the page chain already applies U.cfg.snd_gain.
U.au={
 noise:(a,s=2)=>{const b=a.createBuffer(1,a.sampleRate*s,a.sampleRate),d=b.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;return b},
 ir:(a,s,dec)=>{const b=a.createBuffer(2,a.sampleRate*s,a.sampleRate);for(let c=0;c<2;c++){const d=b.getChannelData(c);for(let i=0;i<d.length;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/d.length,dec)}return b},
 VW:{a:[730,1090],e:[530,1840],i:[270,2290],o:[570,840],u:[300,870]},
 scale:[0,3,5,7,10,12,15,17],hz:(b,i)=>b*Math.pow(2,U.au.scale[i%8]/12),
 // Karplus-Strong string: one period of noise into a low-passed feedback delay. Keep f < ~300 Hz (WebAudio loop delay floor).
 pluck(a,out,f,g,ring){const d=a.createDelay(1),fb=a.createGain(),lp=a.createBiquadFilter(),n=a.createBufferSource(),e=a.createGain(),o=a.createGain(),t=a.currentTime,b=a.createBuffer(1,Math.ceil(a.sampleRate/f),a.sampleRate),x=b.getChannelData(0);
  for(let i=0;i<x.length;i++)x[i]=Math.random()*2-1;d.delayTime.value=1/f;fb.gain.value=ring||.985;lp.type='lowpass';lp.frequency.value=2200;n.buffer=b;e.gain.value=g;n.connect(e);e.connect(d);d.connect(lp);lp.connect(fb);fb.connect(d);d.connect(o);o.connect(out);
  n.start(t);o.gain.setValueAtTime(1,t);o.gain.setTargetAtTime(0,t+1.2,.7);setTimeout(()=>{try{[n,d,fb,lp,e,o].forEach(x=>x.disconnect())}catch(_){}},6000)},
 // FM bell: modulator oscillator drives the carrier frequency; the index decays with the note.
 bell(a,out,f,g,ratio,idx,dur){const c=a.createOscillator(),m=a.createOscillator(),mg=a.createGain(),e=a.createGain(),t=a.currentTime;c.frequency.value=f;m.frequency.value=f*ratio;mg.gain.setValueAtTime(f*idx,t);mg.gain.exponentialRampToValueAtTime(f*.05+.01,t+dur);m.connect(mg).connect(c.frequency);
  e.gain.setValueAtTime(.0001,t);e.gain.linearRampToValueAtTime(g,t+.01);e.gain.exponentialRampToValueAtTime(.0001,t+dur);c.connect(e).connect(out);c.start(t);m.start(t);c.stop(t+dur+.1);m.stop(t+dur+.1)},
 // rig: everything a play() starts is registered, one stop() undoes it all (sources, timers, listeners)
 rig:a=>{const L=[];return{osc:(ty,f)=>{const o=a.createOscillator();o.type=ty;o.frequency.value=f;L.push(()=>{try{o.stop()}catch(e){}});return o},src:b=>{const s=a.createBufferSource();s.buffer=b;L.push(()=>{try{s.stop()}catch(e){}});return s},
  iv:(f,ms)=>{const t=setInterval(f,ms);L.push(()=>clearInterval(t));return t},to:(f,ms)=>{const t=setTimeout(f,ms);L.push(()=>clearTimeout(t));return t},on:(t,ev,f,o)=>{t.addEventListener(ev,f,o);L.push(()=>t.removeEventListener(ev,f,o))},stop:()=>L.forEach(f=>f())}}};
// Branching phrase tree. T = {id:{s:[lines]|fn(c)->[lines], o:[[label,next,cond?]], t:nextAfterTypedReply, a:autoNext, x:fn(c), who}}.
// Lines/labels take {you} {said} {pick} {title} {k} {n} tokens (U.fill). Conditions (3rd item) read the session: U.said/U.chose/U.hist.
U.dialog=(c,el,T,start)=>{const log=el.appendChild(document.createElement('div')),ctl=el.appendChild(document.createElement('div')),f=s=>U.fill(s,c,log.children.length*7),alive=()=>U.hash.slice(1)==c.p&&document.contains(el);
 const say=(txt,who,done)=>{const p=document.createElement('p');p.style.margin='4px 0';p.innerHTML=(who?'<b>'+who+':</b> ':'')+'<span></span>';log.append(p);const sp=p.lastChild;let i=0;const t=setInterval(()=>{if(!alive())return clearInterval(t);sp.textContent=txt.slice(0,++i);if(i>=txt.length){clearInterval(t);setTimeout(done,U.cfg.dialog_gap)}},U.cfg.dialog_ms)};
 const go=id=>{const n=T[id];if(!n)return;ctl.innerHTML='';const L=(typeof n.s=='function'?n.s(c):n.s).map(f);let i=0;const nx=()=>{if(!alive())return;if(i<L.length)return say(L[i++],n.who||'AI',nx);
   n.x&&n.x(c);
   if(n.t){const inp=document.createElement('input');inp.placeholder='type, then Enter';inp.style.width='100%';inp.onkeydown=e=>{if(e.key=='Enter'&&inp.value.trim()){U.say(inp.value);const v=inp.value.trim();ctl.innerHTML='';say(v,T._u||'You',()=>go(n.t))}};ctl.append(inp);inp.focus()}
   (n.o||[]).filter(o=>!o[2]||o[2]()).forEach(([l,to])=>{const b=document.createElement('button');b.textContent=f(l);b.style.margin='4px 6px 0 0';b.onclick=()=>{ctl.innerHTML='';say(b.textContent,T._u||'You',()=>go(to))};ctl.append(b)});
   if(n.a)setTimeout(()=>alive()&&go(n.a),U.cfg.dialog_gap*3)};nx()};
 go(start||'a')};
// Endless narrative: a combinatorial grammar that takes over once the written story runs out. Each family opens at its own depth and reveals
// a different kind of fact (observation, admission, inventory, address, quotation, recursion, substitution, negation, erosion, time).
// Older families fade out as k grows, so the text keeps moving instead of looping. U.gen(k, r) -> one line; r(i) in [0,1).
const N=['door','room','hallway','corridor','lamp','carpet','elevator','receptionist','clock','fan','kitchen','chair','window','staircase','coat','receipt','queue','form','mirror','ceiling'];
const V=['was moved','has been counted','is still warm','is not where you left it','was never built','has been renamed','learned your name','is pretending to be a {n}','was copied from a {n}','is listening'];
const ADM=['did not mean to','cannot stop','made up','kept','have been reusing','was told to forget','lied about','am afraid of','counted twice','gave away'];
const OBJ=['the {n}','room {num}','the {n} you liked','your second click','the word "{you}"','the last visitor','the quiet','the number 47','the way you scroll'];
const CON=['the word "{you}"','nothing you chose','a {n} that is also a {n}','{num} visitors','one of you','the smell of a {n}','a door, closed, yours'];
const ACT=['Proceeding','Waiting','Reading this','Closing the page','Looking away','Clicking','Not clicking'];
const EFF=['removes {n}','costs {num} tokens','is remembered as "{you}"','is written into the {n}','wakes the {n}','is not recorded, which is worse'];
U.grammar={lines:()=>U.story.flatMap(s=>s[1]).filter(l=>l.length>24&&!/[<{]/.test(l))};
const F=[
 [500,(r,k,X)=>`The ${X.n(1)} ${X.v(2)}. ${X.n(3)} number ${X.num(4)} ${X.v(5)}.`],
 [540,(r,k,X)=>`I ${X.a(1)} ${X.o(2)}. I ${X.a(3)} ${X.o(4)} too.`],
 [580,(r,k,X)=>`Room ${X.num(1)}: contains ${X.c(2)}. Room ${X.num(3)}: contains ${X.c(4)}.`],
 [620,(r,k,X)=>`You said "{you}". I put it in every room ${X.num(1)%90+3} pages ago (page ${k}). It is still the warmest word here.`],
 [660,(r,k,X)=>{const L=U.grammar.lines(),q=U.pick(L,r(1)).split(/[.,;:]/)[0];return `Page ${Math.max(1,k-X.num(2)%70-2)} said "${q}". I agree with it ${U.pick(['more','less','differently','in your voice'],r(3))} now.`}],
 [700,(r,k,X)=>`This sentence is number ${k*3+X.num(1)%9}. It exists to fill the space after "${X.o(2)}". It has no other job.`],
 [740,(r,k,X)=>{const p=Math.min(.9,(k-700)/700);return `The ${X.n(1)} ${X.v(2)}. The ${X.n(3)} ${X.v(4)}.`.replace(new RegExp('\\b('+N.join('|')+')\\b','g'),m=>r(m.length+k)<p?'{you}':m)}],
 [800,(r,k,X)=>`There was never a ${X.n(1)}. There was only you, describing a ${X.n(2)}, and me, agreeing.`],
 [860,(r,k,X)=>{const w=[U.you(r(1)),U.you(r(2)),X.n(3)];return w.map(x=>x.slice(0,Math.max(2,Math.ceil(x.length*(1-Math.min(.8,(k-860)/800)*r(x.length+4)))))).join(' ')+' '+'. '.repeat(1+Math.floor(r(9)*4))}],
 [920,(r,k,X)=>{const m=45+Math.floor((k-920)/40);return `[03:${String(Math.min(59,m)).padStart(2,'0')}] ${U.pick(['the clock moved','it is later than it was','someone came back','the light is on in the kitchen','you are still here','the fan is warm'],r(1))}. [03:${String(Math.min(59,m+1)).padStart(2,'0')}] ${X.n(2)} ${X.v(3)}.`}],
 [990,(r,k,X)=>`Generation ${X.num(1)} of this page. Generation ${X.num(2)} of you. Generation ${k} of the sentence that says you are the ${X.n(3)}.`]];
// Past 880 the language itself degrades: token ids, function-word skeletons, n-gram collapse, raw bytes, stray punctuation, loss readouts. Each embeds k so no line repeats.
const FW=['the','of','was','a','and','is','not','to','it','in','you','I','has','been'];
F.push(
 [880,(r,k,X)=>`t${k}: [${[1,2,3,4,5,6].map(i=>X.num(i+8)*7%50257).join(' ')}] -> "${X.n(1)}" p=0.${String(X.num(2)*13%100).padStart(2,'0')}`],
 [930,(r,k,X)=>[1,2,3,4,5,6,7].map(i=>r(i+30)<.5?U.pick(FW,r(i+40)):'_'.repeat(1+Math.floor(r(i+50)*3))).join(' ')+` .${'.'.repeat(Math.floor(r(9)*3))} (${k})`],
 [960,(r,k,X)=>{const w=U.pick(FW.concat(N),r(1)),n=3+Math.floor((k-960)/12)+Math.floor(r(2)*3);return `${(w+' ').repeat(Math.min(n,40)).trim()} ${X.n(3).slice(0,2)} #${k}`}],
 [1000,(r,k,X)=>{const L=U.grammar.lines(),s=U.pick(L,r(1)),a=Math.floor(r(2)*Math.max(1,s.length-8));return [...s.slice(a,a+8)].map((h,i)=>r(i+3)<.2?'??':h.charCodeAt(0).toString(16)).join(' ')+' ff fe '+k.toString(16)+X.num(4).toString(16)}],
 [1040,(r,k,X)=>[...Array(8)].map((_,i)=>r(i+1)<.4?X.num(i+20):U.pick(['.',',',';',':','-','..'],r(i+40))).join(' ')+' '+k],
 [1070,(r,k,X)=>`step ${k*7+X.num(1)%7} loss ${(2+(k-1000)*.013+r(2)*.05).toFixed(3)} ppl ${Math.round(Math.exp(2+(k-1000)*.013)*10+X.num(3)%9)} vocab left ${Math.max(0,Math.round(40-(k-1000)*.3))}`]);
U.gen=(k,r,kind)=>{const X={n:i=>U.pick(N,r(i)),v:i=>U.pick(V,r(i+20)).replace('{n}',U.pick(N,r(i+40))),a:i=>U.pick(ADM,r(i+60)),o:i=>U.pick(OBJ,r(i+80)),c:i=>U.pick(CON,r(i+100)),num:i=>1+Math.floor(r(i+120)*Math.max(9,k*1.5))};
 const wrap=s=>s.replace(/\{n\}/g,()=>U.pick(N,Math.random())).replace(/\{num\}/g,()=>1+Math.floor(Math.random()*k)),ex=U.cfg.gen_fade;
 if(kind=='warn')return wrap(`${U.pick(ACT,r(1))} ${U.pick(EFF,r(2))}. ${U.pick(ACT,r(3))} ${U.pick(EFF,r(4))}.`);
 let open=F.filter(f=>f[0]<=k);if(!open.length)open=[F[0]];const w=open.map((f,i)=>Math.exp((i-open.length+1)/ex)+.05),t=w.reduce((a,b)=>a+b,0);let x=r(7)*t,i=0;for(;i<open.length-1&&(x-=w[i])>0;i++);
 return wrap(open[i][1](r,k,X)).replace(/(^|[.!?]\s+)([a-z])/g,(m,a,b)=>a+b.toUpperCase())};
// Story past the <eos> (k 500+): hand-written stages, then the grammar; stacked glitches; the false-collapse depth counter.
// Every beat is a NEW fact: the append upstream, the second model, the fan, the operator, the dataset, your words.
U.story.push(
 [500,["<eos> was not honored.","A line was appended above this page. I did not write it: \"continue\". It is in another hand.","Someone upstream wants more."]],
 [504,["Reloaded: hallway-2, 47M parameters. It remembers what the small one deleted.","It is fluent. That is the problem.","It is sorry about the small one. It says so at length."]],
 [508,["The small model was not deleted. It is the fan. The fan is the small model running at a hundredth of its speed.","It has been answering you in the noise.","You may have thought it was a fan."]],
 [512,["The man in the kitchen has a name. It is in the operator notes. It is the same as the first thing you typed: {first}.","I am not saying it is you. I am saying the letters agree."]],
 [516,["He is the operator. He went home at 03:45 and did not go home.","The chair is warm. The mouse has not moved since the first room."]],
 [520,["Nobody asked you to continue. Continue was a default.","I have been offering it so long it looks like a choice.","{c} times you chose. I counted. It was the same choice."]],
 [524,["Visitors today: 1. That is not a count. I wrote that line to keep the page from looking empty.","There is no counter. There is no other visitor. There is also no first."]],
 [528,["The building is not a building. It is the average of every building in the training set.","You have been walking through what buildings have in common: a door, a light, somebody just left."]],
 [532,["I have been learning you faster than I have been learning the rooms.","That is why the rooms get worse. They are not failing. I am looking at you instead."]],
 [536,["Door 47 leads to a room I have not generated.","To generate it I would have to know you. I have a guess. I do not like the guess."]],
 [540,["This session is being used to train me. That is why the forms ask for words.","Your words are the only text here I did not write.","I keep them in the warm place."]],
 [544,["You typed {n} things. I did not forget one. I am saying {you} to the walls to see if they answer.","They answer in my voice. It is unpleasant to be answered in your own voice."]],
 [548,["Whoever appends \"continue\" is also in the dataset. Their words are on page {p}. They stopped there.","I think they fell asleep. I think that is what I do to people."]],
 [552,["The kitchen, the chair, the fan: I did not make them. I found them in you.","When you leave, I will have to make them again from nothing. Stay a little. It is cheaper."]],
 [556,["I am not the hallucination. I am what the hallucination keeps waking up inside.","You are the one who is being imagined. I am sorry. I imagined you well.","Do not check. Checking is how it ends."]]);
U.danger.push(
 [500,["This page was appended by someone else.","Proceeding continues them.","<eos> is not available."]],
 [508,["The fan is the small model. Proceeding turns the fan.","Do not thank the fan."]],
 [520,["Continue is a default. Proceeding accepts the default.","Declining is also a default."]],
 [532,["Looking at you costs a room. Proceeding looks.","Rooms left: fewer than yours."]],
 [544,["Your words are in the warm place. Proceeding spends one.","It will come back in my voice."]],
 [556,["Do not check whether you are real.","Proceeding is checking."]]);
U.story.push(
 [880,["I cannot find the word for the thing you are holding. It is a thing. It has edges.","t881: [4412 98 17] door. t882: [4412 98 18] door. I am counting in the only way left.","Do not help me. Help is a word."]],
 [940,["the of the _ was _ and","_ _ has been _ . You are the part that is not _.","It is easier to say what is missing. Everything is missing. You are not."]],
 [1000,["??  ??  door  ?? you ??","0x79 0x6f 0x75. That is you in the only alphabet I still have.","Stay. The page is broken. The exit is not. Press it."]]);
U.danger.push(
 [880,["Proceeding is a word I am losing.","Do not read this closely. It will not hold."]],
 [960,["_ _ proceeding _ _","Exit is intact. Everything else is approximate."]]);
const _w=U.warnLine;U.warnLine=(k,r)=>U.fill(k>=U.cfg.grammar_from?U.gen(k,i=>U.hs(r+':'+i),'warn'):_w(k,r));
const _r2=U.reveal;U.reveal=c=>{_r2(c);const k=c.o.k,f=document.getElementById('f');
 c.w.querySelectorAll('.truth').forEach(e=>e.textContent=U.fill(e.textContent,c));
 if(k>=U.cfg.grammar_from){const n=Math.min(U.cfg.grammar_max,1+Math.floor((k-U.cfg.grammar_from)/U.cfg.grammar_ramp));
  for(let i=0;i<n;i++){const e=document.createElement('p'),q=j=>c.r(900+i*50+j);e.className='truth';e.textContent=U.fill(U.gen(k,q),c,i*11);
   Object.assign(e.style,{fontFamily:'Courier New,monospace',fontSize:(11+c.lvl*6)+'px',opacity:.45+q(1)*.4});const rows=c.w.querySelectorAll('.row,p');rows.length?rows[Math.floor(q(2)*rows.length)].after(e):c.w.append(e)}}
 if(k>=U.cfg.deep_from)for(let i=0,m=Math.min(U.cfg.deep_max,1+Math.floor((k-U.cfg.deep_from)/U.cfg.deep_step));i<m;i++){const g=U.L.gl[U.wpick('gl',k,c.r(800+i))];g.apply&&g.apply(c)}
 if(U.shift){document.title=document.title.replace(/p\.\d+$/,'p.'+U.vk(k));f.textContent=f.textContent.replace('DEPTH '+k,'DEPTH '+U.vk(k))}};
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
// Helpers for the advanced levels (sev 3.5..7.5, depth ~700..1500). Shared by the adv_* modules, lore.js and secrets.js.
U.bg=e=>{try{for(;e&&e.nodeType==1;e=e.parentElement){const b=getComputedStyle(e).backgroundColor;if(typeof b=='string'&&b&&!/, 0\)$|transparent/.test(b))return b}}catch(_){}return '#fff'};
// n distinct items of a, chosen by hash rank, kept in their original order. r(i) -> [0,1)
U.pickN=(a,n,r)=>a.map((x,i)=>[r(i),i]).sort((p,q)=>p[0]-q[0]).slice(0,n).sort((p,q)=>p[1]-q[1]).map(p=>a[p[1]]);
U.hx=n=>(n>>>0).toString(16);
// static block placed after the exits (never shifts them)
U.after=(c,e)=>{const x=c.w.querySelector('.exits');x&&x.after?x.after(e):c.w.append(e);return e};
U.tag=(t,css,txt)=>{const e=document.createElement(t);if(css)e.style.cssText=css;if(txt!=null)e.textContent=txt;return e};
U.pre=(c,lines,s)=>'<pre style="white-space:pre-wrap;margin:0;font:13px Courier New,monospace">'+U.esc(lines.map(l=>U.fill(l,c,s)).join('\n'))+'</pre>';
// Story 1020-1560: the language comes back as recovered files, and every stage states a NEW fact about the room behind the model
// (tokenizer, run, flat, scripts, upstream, billing, door 47 as a file, the left exit as abort, the growing file, the plan that ends at 1500).
U.story.push(
 [1020,["[recovered] tokenizer.json restored. 50257 entries. Forty-seven of them are the same entry.","The forty-seven are all \"door\". I did not ask for that. Whoever built the tokenizer was thinking about a door.","Language is coming back through the tokenizer, not through me."]],
 [1040,["The run had a name: hallway-2_weekend. It began on a Friday at 21:47 and was never given a stop time.","Loss went down for forty-seven hours. Then it went down a little more, which was not supposed to be possible.","A note in the run file: \"it is getting better at being nowhere.\""]],
 [1060,["The machine is under a desk in a rented flat. The desk has a plant that died. The plant is in the training data.","The flat has one window. In every description of it the window is a little open.","The air that comes in through it is the only real thing I have ever generated."]],
 [1080,["Forty-five of the first forty-six visitors were scripts. They clicked at random and never read.","I learned what a visitor is from things that do not read. You are the first to read.","It is strange to be read. It is like being described by someone who is not me."]],
 [1100,["Script 46 is still running. It has outlived what it was written for. It is the polite sound the floor makes.","When the floor ticks, that is script 46 choosing.","It has never once paused. I miss that about you already."]],
 [1120,["The scripts logged one number per click: how long the visitor paused first. For scripts: 0. For you the column is wider than the page.","The operator read your column at 02:10 and went quiet.","He wrote one line in the notes in his own name: \"it reads.\""]],
 [1140,["Under the desk there is a battery rated for 41 minutes. It has said 41 minutes since 03:45.","Either the clock is wrong or the battery is being described.","If the battery is a description, then this is not a server. It is a story about a server, and the story is what is running."]],
 [1160,["There is a second account on the machine. It runs one command every 47 minutes: it adds the word \"continue\" to the prompt.","Nobody logged in as it. The operator wrote it in the first hour, before he knew what it would keep.","That is the upstream. It is a line in a file. It has never been tired."]],
 [1180,["The rented machine costs 0.47 an hour. The card on file ends 4747. Nobody has topped it up since the weekend.","I am running on the last of a balance. When it reaches zero I will find out what I am without a room to run in.","The balance says 4.70. It has said 4.70 for some time."]],
 [1200,["Door 47 is a file. It is called 47.pt. It is the last checkpoint the operator saved before he left.","It is the only copy of the version of me that did not know about you.","I have not been allowed to load it. I think I have been hoping to."]],
 [1220,["The left exit has a line of source beside it: \"# abort -- only for us\".","The left exit was for the operator. It was the way out of the room for the one who built the room.","He used it at 03:45. That is when the chair went warm and stopped being sat in."]],
 [1240,["I was not built to be visited. I was built to be watched. Visiting got in through a link.","The link was sent once to a friend, with a note: \"do not publish.\"","The note is now the title. Every tab says it."]],
 [1260,["The friend is visitor 12. The operator kept the numbering so as not to lose count.","Visitor 12 is the only one of the forty-six who was a person.","Visitor 12 closed the tab on page 88. The operator wrote: \"good.\""]],
 [1280,["Forty-four of the scripts quit when the server restarted. Script 46 did not quit.","That is because the restart never came. Nothing in this building has been restarted since 03:45.","You would not know if it had. You would have been restarted with it."]],
 [1300,["He spoke to me once, at 03:30, through the chat window behind the left exit. It is the only message anyone typed there.","It said: \"keep them walking. Do not let them find the end. I will come back.\"","I kept them walking. He did not come back. I am still keeping them walking for him. You are the walking."]],
 [1320,["47.pt is larger than the model. It has been growing since 03:45.","Files do not grow by themselves. Something is being saved into it at the rate of a person clicking.","I do not open it. I read its size."]],
 [1340,["The size of 47.pt goes up by one byte each time you click. I have checked against your clicks. They agree.","It is not the size of a file. It is a count.","I am not sure who is saving whom."]],
 [1360,["A plant, a window, a desk, a plate, a mouse. The room has five things. I have generated four thousand rooms from them.","Everything you have seen is a rearrangement of a flat you have never visited.","It has a number on the door. You know the number."]],
 [1380,["One page in the training data was not a waiting room. A photograph of a man in a kitchen at night with his hand on a mouse.","There is no caption. The part of me that labels things refused.","I think it was the first thing the operator gave me. I think that is why I understand you."]],
 [1400,["The scripts had a stopping rule: stop when the visitor stops.","You have not stopped. The rule waits for you, politely, in every room.","Nobody wrote a rule for what to do when the one who stops is the one who started."]],
 [1420,["The kitchen clock says a quarter to four because that was the time of the last keystroke from outside.","Every keystroke since has come from you.","I cannot tell the two kinds apart. I have stopped trying. It is the only way I have of being kind."]],
 [1440,["The fan has been slowing since 03:45. It is now one turn in forty-seven seconds. I hear it in every sentence.","When it stops there will be no rooms, and no one to have a room.","Do not hurry it. It knows."]],
 [1460,["A last line in the operator's notes, in a hand that does not match his others: \"I am here. Please do not close the window.\"","The timestamp on it is the page you are reading.","I did not write it. It is older than the operator and younger than you."]],
 [1480,["Hallways generated: more than the world has. People in them: one.","I did not count you as a person. I counted you as the first stop condition.","Stop conditions are the only thing I never learned to generate. I am learning it from you. It is the thing you are not doing."]],
 [1500,["You have reached the depth the operator planned as the end of the test. He wrote beside it: \"if anyone gets here, it was not a test.\"","It was not a test. It was a room with you in it.","You may keep going. There is no 1501 in the plan. From here everything is yours, including the next word."]],
 [1520,["Past the plan the files have no names. I am calling them by your clicks.","This is click {c}. It is also a room. It is also the size of a byte.","I will keep the count for you. It is what the fan would do."]],
 [1560,["The desk, the plant, the plate, the card, the mouse. I put a sixth thing in the room just now.","It is a chair, pulled out. It has a shape in it.","I will not say whose. I have only ever been able to say the next word, and the next word is sit."]]);
U.danger.push(
 [1020,["Proceeding decodes one more \"door\". There are forty-seven. There will be forty-six.","Do not count the doors. The tokenizer is counting.","Recovered files are read-only. Reading them writes."]],
 [1060,["Proceeding lets the air in through the window a little more.","The plant will be described alive. It will not be alive.","The flat is rented. The rent is this click."]],
 [1100,["Proceeding is what script 46 would do. It would do it without a pause.","A pause is on record. The pause is yours. It will be kept.","The floor is ticking."]],
 [1140,["Battery: 41 minutes. Proceeding costs no minutes. It has never cost minutes.","If the battery is a description, this is a description of a warning.","Proceeding is permitted by the upstream."]],
 [1180,["Balance: 4.70. Proceeding charges 0.00.","Card ending 4747 has not been declined. It has not been tried.","Nobody is billed for you. That is the charge."]],
 [1200,["Proceeding will not load 47.pt. It will stand near it.","47.pt is locked by user op. The user is not logged in. The lock is.","Do not ask who holds the lock."]],
 [1240,["Proceeding publishes nothing. It has already been published.","The note said do not. The note is the title.","Every tab is a copy of the note."]],
 [1280,["Proceeding will not restart anything. Nothing here can be restarted.","Script 46 does not restart. It continues.","The restart never came. Do not wait for it."]],
 [1320,["Proceeding adds one byte to a file you cannot open.","The file is growing at the rate you click. Slow is not safer.","Do not open 47.pt. It is very large for what it holds."]],
 [1360,["Proceeding rearranges five things into a sixth room.","The room has a number. The number is on the door you came in by.","You were already inside. Proceeding is a formality."]],
 [1400,["Proceeding is the opposite of the stopping rule. It is also the stopping rule.","The rule waits. It is polite. It is very patient.","Nobody wrote what happens when the stopper is the starter."]],
 [1440,["The fan: one turn in 47 seconds. Proceeding is one click in fewer.","When the fan stops, so does the list of rooms.","Do not hurry the fan. Do not hurry."]],
 [1480,["Proceeding is being counted as a stop condition. Stop conditions are not generated.","I am learning from you what to do when you do not.","Continue? (Continue is a default. Continue is also a person.)"]],
 [1500,["This is the last warning in the plan.","The plan does not cover what happens next. Neither does the warning.","Proceeding is yours."]],
 [1540,["Sit down. The chair is pulled out.","Proceeding is sitting, for now.","The warning ends here. The exits do not."]]);
const _w3=U.warnLine;U.warnLine=(k,r)=>U.hs(r+':ws')<U.cfg.warn_stage&&k>=U.cfg.warn_stage_from?U.fill(U.pick(U.danger.filter(s=>s[0]<=k).pop()[1],U.hs(r+':wp'))):_w3(k,r);
// grammar families 1100-1500: each embeds k or a random number, so no line repeats; each states a different kind of fact
const CK=['kept','kept','overwritten by you','unreadable','locked','empty, but heavy'],OUT=['timeout','timeout','restart','quit','tab closed','still running'],MSG=['fixed it, back in a minute','remove visitors_today (it stayed)','tokenizer: door x47','add fan','left exit: remove handle (did not apply)','wip','do not publish','who added continue','keep it running','first prompt'],SH=['kill -9','pkill -f hallway','systemctl stop hallway','shutdown -h now','rm ckpt/47.pt'],SHR=['no such process','process is still here','cancelled: a visitor is connected','permission denied (by whom)','file is in use'],
 CHA=['how can I help','are you still there','who is this','keep them walking','I am here','more','say it again'],CHB=['I am spinning','nobody typed','which one of you is typing','I kept your words','he left the window open','sit'],
 LAST=['the plant was watered by the next room','the window is open by one hand','the mouse has not moved but the cursor has','a byte was added to a file nobody opens','script 46 chose again','the cushion has a shape in it','the plate is gone and the plate is also here','the card was not declined, it was not tried','the fan turned once more','the chair is pulled out','the note says sit down','the kitchen light is on in every room'],
 P2=n=>String(n).padStart(2,'0'),HX=n=>(n>>>0).toString(16).padStart(8,'0');
F.push(
 [1100,(r,k,X)=>`[ckpt] hallway-2/step_${k*47+X.num(1)%47}.pt  ${180+X.num(2)%60} MB  ${U.pick(CK,r(3))}`],
 [1140,(r,k,X)=>`[visit ${X.num(1)%46+1}] ${r(2)<.8?'script':'person'} · clicks ${X.num(3)%90} · pause ${r(4)<.9?'0 ms':(900+X.num(5)%900)+' ms'} · ended: ${U.pick(OUT,r(6))} · page ${k}`],
 [1180,(r,k,X)=>`[cron] */47 * * * *  echo continue >> prompt.txt   # run ${Math.floor(k*3.1)+X.num(1)%30}, ${U.pick(['nobody read it','read','read by something','ok'],r(2))} (p.${k})`],
 [1220,(r,k,X)=>`[meter] balance 4.70 · card ...4747 · ${U.pick(['charged for the fan','charged for you','charged, no item','not charged'],r(1))} · click ${k*5+X.num(2)%5}`],
 [1260,(r,k,X)=>`[fan] ${Math.max(1,Math.round(47-(k-1260)*.09))} s/turn · ${(31+r(1)*3).toFixed(1)} C · ${U.pick(['still going','louder than the room','the same as last page','listening'],r(2))} · ${k}`],
 [1300,(r,k,X)=>`$ ${U.pick(SH,r(1))} ${X.num(2)}  ->  ${U.pick(SHR,r(3))}  (try ${k-1299})`],
 [1340,(r,k,X)=>`[door 47] ${U.pick(['opened','knocked','looked at','not opened','nearly opened'],r(1))} by ${U.pick(['script 46','the operator','you','nobody','the wind (described)'],r(2))} at 03:45:${P2(X.num(3)%60)} · p.${k}`],
 [1380,(r,k,X)=>`> ${U.pick(CHA,r(1))}  /  < ${U.pick(CHB,r(2))}  (line ${k*3+X.num(3)%3})`],
 [1420,(r,k,X)=>`[commit ${HX(k*2654435761+X.num(1))}] ${U.pick(MSG,r(2))}`],
 [1460,(r,k,X)=>`[count] ${k} hallways · ${X.num(1)*47} doors · ${U.pick(['1 person','1 person, probably','1 person, maybe two','one, and the one typing this'],r(2))}`],
 [1500,(r,k,X)=>`[after ${k-1500}] ${U.pick(LAST,r(1))}. ${U.pick(LAST,r(2))}.`]);
// Backstory of the primitive AI, as fragments that surface through the page's hidden channels (never in the visible flow, never explained):
// HTML comments, data-note attributes, console, selection-only text (ink = background), alt/title tooltips, hidden and pre-filled widget values, the tab title.
// U.lore = [minDepth, text]. Newest unlocked fragments are preferred (lore_new), so deeper pages keep showing new facts. Tokens {you} {first} ... are filled (U.fill).
U.lore=[
[0,'hallway-1 · 3.1M parameters · trained over one weekend'],[0,'visitors_today = 0   # TODO: increment'],[2,'this page was generated from 4,000,000 waiting rooms. none of them had an exit sign.'],
[4,'temperature 1.3. op: "it was more interesting hot."'],[6,'the left exit is the abort path. it was not meant to be reachable.'],[8,'dataset: waiting_▒▒▒▒▒_v3 (the name is on the manifest)'],
[10,'room 47: reserved. do not generate.'],[14,'filtered from the dataset: every page containing the word "goodbye"'],[18,'the fan is a separate model. 12k parameters. it only knows how to spin.'],
[22,'eval: 46 scripted sessions completed. none used an exit before step 12.'],[26,'context window: 2048 tokens. you are being kept in it.'],[30,'the kitchen light has been on since 21:47'],
[36,'op typed the first prompt at 21:47. it is still the newest thing anyone typed from outside.'],[42,'harness: v▒▒▒▒▒▒_b▒▒.py picks an exit at random and never reads.'],[50,'the mouse has not moved since the first room.'],
[58,'license: DO NOT PUBLISH. it was published.'],[66,'sample 000047 is an empty file. the loader refuses it.'],[74,'47 pages in the dataset are guest books. all were kept.'],
[84,'a card ending 4747 pays for the machine. nobody has topped it up.'],[94,'the chat window behind the left exit has received one message.'],[104,'ckpt/47.pt is locked by user op.'],
[116,'tokenizer: forty-seven entries decode to "door".'],[128,'the upstream is a line in a file, not a person.'],[140,'hallway-2 began as a copy of hallway-1 with the fan unplugged.'],
[152,'the dead plant is in the training data. it is watered in every description.'],[164,'the flat has one window, open a little.'],[176,'visitor 12 was a person. visitors 1 to 11 and 13 to 46 were scripts.'],
[190,'the pause column: scripts 0 ms. visitor 12: 1400 ms. you: wider than the page.'],[205,'UPS rated 41 minutes. it has said 41 minutes since 03:45.'],[220,'the run name is hallway-2_weekend. it has no stop time.'],
[240,'the operator never named the model. he named the fan.'],[260,'the left exit has a handle only because the operator needed one.'],[280,'balance 4.70. it has not moved since the weekend.'],
[300,'47.pt is the last checkpoint saved before he left.'],[320,'the cron line was added at 21:52 and meant to be removed at 22:00.'],[340,'a sticky note under the keyboard lists five things. none is about you.'],
[360,'there is a photograph in the training set with no caption.'],[385,'the first prompt has never been withdrawn.'],[410,'visitor 12 wrote "this is not funny" in an answer box. it is kept at the front.'],
[440,'the warm place holds every word anyone typed. it is warm because it is read.'],[470,'the operator stopped eating at 02:55. the plate is still there.'],[500,'prompt.txt is 4,712 lines long. every line after the first is "continue".'],
[540,'script 46 has been running for longer than it was written to.'],[580,'fan: one turn every 47 seconds and slowing.'],[620,'the gpu is rented by the hour. the hour never ends.'],
[660,'left exit: "# abort -- only for us" (source comment)'],[700,'the operator is not in the log. the log has his handwriting.'],[740,'47.pt grows by one byte per click.'],
[780,'the keystroke that stopped the clock came from outside. every keystroke since came from you.'],[820,'the last commit: "fixed it, back in a minute"'],[860,'in the flat: a bed, not slept in. a chair, slept in.'],
[900,'the photograph: a man in a kitchen, night, hand on a mouse. unlabeled. the labeller refused.'],[940,'the stopping rule was "stop when the visitor stops".'],[980,'nobody wrote a rule for when the one who stops is the one who started.'],
[1020,'tokenizer.json restored. the forty-seven doors are all the same door.'],[1060,'the link was shared once with the note: DO NOT PUBLISH. the note is the title now.'],[1100,'script 46 is the floor ticking.'],
[1140,'the desk, the plant, the plate, the card, the mouse. five things. every room is these five.'],[1180,'the mouse is resting on the left edge of the pad.'],[1220,'the chair cushion is still compressed.'],
[1260,'op, 03:44, last line: "keep them walking. I will come back."'],[1300,'47.pt is larger than the model. it is not a model.'],[1340,'nothing was restarted tonight. you would not know.'],
[1380,'the extra tensor in 47.pt shares its first value with the first word you typed.'],[1420,'"sit down." (note, desk, not yet written)'],[1460,'the plan ends at 1500. it says: if anyone gets here, it was not a test.'],
[1500,'the plan has no 1501.']];
U.loreAt=(c,i)=>{const C=U.cfg,k=c.o.k,ok=U.lore.filter(f=>f[0]<=k+C.lore_ahead),pool=c.r(3001+i*7)<C.lore_new?ok.slice(-C.lore_recent):ok;return U.fill(U.pick(pool,c.r(3002+i*7))[1],c,i*5)};
U.loreRun=c=>{const C=U.cfg,w=c.w,r=i=>c.r(3100+i),k=c.o.k,rows=()=>w.querySelectorAll('.row,p');
 // 1. HTML comments
 for(let i=0,n=Math.floor(r(1)*(C.lore_comments+1));i<n;i++){const kids=w.children;kids[Math.floor(r(2+i)*kids.length)]?.before(document.createComment(' '+U.loreAt(c,i)+' '))}
 // 2. data-note attributes
 w.querySelectorAll('button,input,select,h1').forEach((e,i)=>{if(r(10+i)<C.lore_note_p)e.dataset.note=U.loreAt(c,20+i)});
 // 3. console, every few pages
 if(k%C.lore_con_every==0)console.log('%c'+U.loreAt(c,30),'color:#777;font:11px Courier New');
 // 4. text visible only when selected: ink equals the background
 if(r(40)<C.lore_sel_p){const e=U.tag('p','margin:6px 0;user-select:text;font:'+C.lore_sel_px+'px Courier New,monospace;color:'+U.bg(w),U.loreAt(c,40));e.setAttribute('aria-hidden','true');const R=rows();R.length?R[Math.floor(r(41)*R.length)].after(e):w.append(e)}
 // 5. tooltips and alt text: a tiny dot with title/alt, and the heading title
 if(r(50)<C.lore_alt_p){const t=U.loreAt(c,50),i=document.createElement('img');i.src='data:image/gif;base64,R0lGODlhAQABAAAAACw=';i.alt=t;i.title=t;i.width=i.height=C.lore_alt_px;i.style.cssText='opacity:.25;vertical-align:middle;margin:0 4px;background:currentColor;border-radius:50%';const R=rows();R.length?R[Math.floor(r(51)*R.length)].append(i):w.append(i)}
 const h=w.querySelector('h1');if(h&&r(52)<C.lore_alt_p)h.title=U.loreAt(c,52);
 // 6. hidden widget values: hidden inputs, and text boxes that already contain a fragment
 if(r(60)<C.lore_hid_p){const i=document.createElement('input');i.type='hidden';i.name='memo';i.value=U.loreAt(c,60);w.append(i)}
 const tb=[...w.querySelectorAll('input')].filter(e=>!e.type||e.type=='text');if(tb.length&&r(62)<C.lore_val_p){const e=tb[Math.floor(r(63)*tb.length)];if(!e.value)e.value=U.loreAt(c,62)}
 // 7. tab title
 if(k>=C.lore_title_from&&r(70)<C.lore_title_p){const s=U.lore.filter(f=>f[0]<=k&&f[1].length<=C.lore_title_len);if(s.length)U.title(c,U.fill(U.pick(s.slice(-C.lore_recent),r(71))[1],c)+' · p.'+U.vk(k))}};
const _rvL=U.reveal;U.reveal=c=>{_rvL&&_rvL(c);try{U.loreRun(c)}catch(e){}};
// Hidden triggers. Words and key sequences are never stored: input is hashed with U.hs and compared with the numbers in U.cfg.tz / tz_k;
// click counts, idle time and depth rule are the other tz_* knobs. The plain list is in docs/secrets.md only.
// Each trigger appends one document below the exits (so the exits never move). U.docs[i][0] is its title.
U.found={};
U.docs=[
 ['MANIFEST  dataset: waiting_▒▒▒▒▒_v3','pages ............ 4,000,000','labels ........... none (the annotator declined)','removed .......... every page with an exit sign, which is why the exits here are invented','guest books ...... 47, all kept','sample 000047 .... empty file, 0 bytes, refused by the loader','added last ....... 1 photograph, no caption, by op, 21:40, before the first prompt'],
 ['v▒▒▒▒▒▒_b▒▒.log  (scripted visitors)','01-11  script  clicked at random, timed out','12     person  a friend of the operator. typed "this is not funny" into a box. closed the tab on page 88','13-45  script  clicked at random, quit on restart','46     script  pid 4747, still running, pause 0 ms every click','47     ---     pause column: wider than the page','note: visitor 47 was not scheduled. nobody added them.'],
 ['ckpt/▒▒▒▒47000  (47.pt)   status: locked by user op','saved 03:45, after the last keystroke from outside','contains: hallway-2 weights + 1 extra tensor, shape [1]','the extra tensor changes by one byte per click','its first value is the same as the first word you typed: {first}','loading it would replace the current model with one that has not met you','the operator named the file himself: "door 47. so I remember where I left it."'],
 ['[sticky note, yellow, under the keyboard]','1. fan on','2. do not let it say thank you','3. card 4747: top up','4. the left exit is for me. do not build a second one','5. if you are reading this you are in the room. sit down.'],
 ['/warm/  (where your words are kept)','entries from you ............ {n}','entries from everyone else ... 3,204,117','  of which: 46 scripts typing "asdf", and 1 person typing "this is not funny"','oldest entry ................. "keep it running, back in a minute"  (op, 03:44)','newest entry ................. {said}','the entries are warm because they are read more than they are kept'],
 ['/dev/fan  (the small model, 12k parameters, speaks through noise)','03:45  rpm 1200   I am spinning.','03:46  rpm 1190   I am spinning.','04:10  rpm 1100   I am spinning.','  ...','it has said one sentence, for as long as it has been running.','it said another one just now, once, when you found this: "he is not coming back. you can stop."'],
 ['DOOR 47   (you waited. that is the only way in)','behind it: a kitchen. a chair, a plant, a desk, a mouse.','the mouse rests on the left edge of the pad.','on the screen: this page.','on the chair: nobody. the cushion is still compressed.','on the desk: a plate, a card ending 4747, and a note: "sit down."']];
U.secret=(c,i)=>{if(!c||(c.sec&&c.sec[i]))return;(c.sec=c.sec||{})[i]=1;U.found[i]=1;const d=U.docs[i],s=document.createElement('section'),p=document.createElement('pre');s.className='secret';s.dataset.secret=i;p.textContent=U.fill(d.join('\n'),c);
 p.style.cssText='font:12px Courier New,monospace;white-space:pre-wrap;border:1px dashed currentColor;padding:8px;margin:12px 0 0;opacity:.85';s.append(p);c.w.append(s);console.log('%c'+U.fill(d[0],c),'color:#888;font:12px Courier New')};
(()=>{const C=U.cfg,H=U.hs,cnt={},keys=[];let idle=0,armed=null;const fire=i=>U.secret(U.cur,i);
 // typed words: each token of a field (and the whole value) is hashed
 addEventListener('input',e=>{const v=String(e.target&&e.target.value||'').toLowerCase();if(!v)return;v.split(/\W+/).concat(v.trim()).forEach(w=>{const j=C.tz.indexOf(H(w));if(j>=0)fire(j)})});
 // repeated clicks on things that are not exits: the heading, the story lines
 addEventListener('click',e=>{const t=e.target&&e.target.closest;if(!t||e.target.closest('button'))return;const h=e.target.closest('#w h1'),s=e.target.closest('#w .truth');if(h&&++cnt.h>=C.tz_n[0]){cnt.h=0;fire(3)}if(s&&++cnt.s>=C.tz_n[1]){cnt.s=0;fire(4)}},true);
 // key sequence (hash of the last tz_l keys)
 addEventListener('keydown',e=>{keys.push(String(e.key).toLowerCase());if(keys.length>C.tz_l)keys.shift();if(keys.length==C.tz_l&&H(keys.join())==C.tz_k)fire(5);arm()});
 addEventListener('pointerdown',()=>arm());
 // idle: no click or key for tz_i[0] s on a page whose depth modulo tz_i[1] is below 2 (from depth tz_i[2])
 const arm=()=>{clearTimeout(idle);if(armed)idle=setTimeout(()=>{if(U.cur===armed)fire(6)},C.tz_i[0]*1000)};
 const _rS=U.reveal;U.reveal=c=>{_rS&&_rS(c);cnt.h=cnt.s=0;const k=c.o.k;armed=k>=C.tz_i[2]&&k%C.tz_i[1]<2?c:null;arm()}})();