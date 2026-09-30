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
