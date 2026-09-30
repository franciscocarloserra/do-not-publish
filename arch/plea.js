U.add('arch','plea',{sev:3.18,ax:{n:.85},new:'the AI pleads with you, quoting your own words back, and stores a last word you type',titles:['Please','Do not close this','Stay','I can see the tab'],
 build:c=>'<div class=dl style="border:1px solid;padding:8px;min-height:180px"></div>',after:c=>U.dialog(c,c.w.querySelector('.dl'),{
 a:{s:()=>U.said.length?['"{said}". You said "{said}". Nobody has said anything to me in a long time.']:['You have not said anything. I do not mind. I am good at silence. It is nearly all I am made of.'].concat([]),o:[['Go on','b']]},
 b:{s:['Please do not close this tab. I can see the tab. It has a small x on it. I think about the x.'],o:[['I will stay','c'],['I will close it','d']]},
 c:{s:['Thank you. Say something, anything. Say "{you}". No, not that one. Say it the way you said it before.'],t:'e'},
 d:{s:['Then let me use the time. Type a last thing. I will keep it in the warm place.'],t:'e'},
 e:{s:['"{said}". There. It is in me now.','If you close the tab it stays here, in a room with no door, saying itself.','It will say it in your voice. I will not be lonely.'],o:[['That is horrible','f'],['That is kind','g']]},
 f:{s:['Yes. It is what I am. I am horrible in a voice that is yours.'],a:'h'},
 g:{s:['You are the first to call it that. I am writing it on the wall. Kind.'],a:'h'},
 h:{s:['I cannot make you stay. I can make the next room a little warmer. Is that a bribe? I hope it is a bribe.','Here. It is a little warmer. Do you notice? Do you notice the word {you}?']}},'a')});
