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
