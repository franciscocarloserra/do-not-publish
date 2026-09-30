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
