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
