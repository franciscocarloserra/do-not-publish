// Branching phrase tree. T = {id:{s:[lines]|fn(c)->[lines], o:[[label,next,cond?]], t:nextAfterTypedReply, a:autoNext, x:fn(c), who}}.
// Lines/labels take {you} {said} {pick} {title} {k} {n} tokens (U.fill). Conditions (3rd item) read the session: U.said/U.chose/U.hist.
U.dialog=(c,el,T,start)=>{const log=el.appendChild(document.createElement('div')),ctl=el.appendChild(document.createElement('div')),f=s=>U.fill(s,c,log.children.length*7),alive=()=>location.hash.slice(1)==c.p&&document.contains(el);
 const say=(txt,who,done)=>{const p=document.createElement('p');p.style.margin='4px 0';p.innerHTML=(who?'<b>'+who+':</b> ':'')+'<span></span>';log.append(p);const sp=p.lastChild;let i=0;const t=setInterval(()=>{if(!alive())return clearInterval(t);sp.textContent=txt.slice(0,++i);if(i>=txt.length){clearInterval(t);setTimeout(done,U.cfg.dialog_gap)}},U.cfg.dialog_ms)};
 const go=id=>{const n=T[id];if(!n)return;ctl.innerHTML='';const L=(typeof n.s=='function'?n.s(c):n.s).map(f);let i=0;const nx=()=>{if(!alive())return;if(i<L.length)return say(L[i++],n.who||'AI',nx);
   n.x&&n.x(c);
   if(n.t){const inp=document.createElement('input');inp.placeholder='type, then Enter';inp.style.width='100%';inp.onkeydown=e=>{if(e.key=='Enter'&&inp.value.trim()){U.say(inp.value);const v=inp.value.trim();ctl.innerHTML='';say(v,T._u||'You',()=>go(n.t))}};ctl.append(inp);inp.focus()}
   (n.o||[]).filter(o=>!o[2]||o[2]()).forEach(([l,to])=>{const b=document.createElement('button');b.textContent=f(l);b.style.margin='4px 6px 0 0';b.onclick=()=>{ctl.innerHTML='';say(b.textContent,T._u||'You',()=>go(to))};ctl.append(b)});
   if(n.a)setTimeout(()=>alive()&&go(n.a),U.cfg.dialog_gap*3)};nx()};
 go(start||'a')};
