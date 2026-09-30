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
