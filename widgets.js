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
