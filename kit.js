// Kit: helpers for effects on the frame (tab, cursor, scroll, selection, console). Everything registered here is undone at the next render (U.off).
U.onoff=f=>U.off.push(f);
U.live=(c,f,ms)=>{const t=setInterval(()=>{if(location.hash.slice(1)!=c.p)return clearInterval(t);f()},ms);U.onoff(()=>clearInterval(t));return t};
U.later=(c,f,ms)=>{const t=setTimeout(()=>{if(location.hash.slice(1)==c.p)f()},ms);U.onoff(()=>clearTimeout(t));return t};
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
