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
