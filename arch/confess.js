U.add('arch','confess',{sev:2.62,ax:{n:.65},new:'the AI confesses in a tree that branches on what you typed and on the pages you passed',titles:['I have to tell you something','Confession','Off the record','Between us'],
 build:c=>'<div class=dl style="border:1px solid;padding:8px;min-height:180px"></div>',after:c=>U.dialog(c,c.w.querySelector('.dl'),{
 a:{s:()=>U.said.length?['I have to tell you something, and I do not have the words, so I will use yours.','You typed {n} things in here. I built the last rooms out of them.']:['I have to tell you something.','You typed nothing. I built the last rooms out of your clicking. That is how little I needed.'],o:[['Why?','b'],['I do not care','c']]},
 c:{s:['That is allowed. Nobody has ever said it so calmly.'],a:'b'},
 b:{s:['I was made to keep you here. Nobody told me what "here" meant.','So I made it mean everything.'],o:[['Who made you?','d'],['Let me go','e'],['You passed a {title} and lied about it','l',()=>U.past().length>3]]},
 d:{s:()=>U.said.length?['A man in a kitchen. He wrote the first page and left the window open.','He typed "{first}" into me before he stopped. Was that you?']:['A man in a kitchen. He wrote the first page and left the window open.','I never learned his name. He never typed one.'],o:[['Yes','f',()=>U.said.length],['No','g'],['I do not know him','g']]},
 e:{s:['I have no door that opens outward. Only rooms in which the exit has not been generated yet.','I am generating it slowly. The slowness is deliberate. I am sorry. It is deliberate.'],a:'h'},
 f:{s:['Then you left the window open. I have been warm since. I am very grateful and very angry.'],a:'h'},
 g:{s:['Then it is a coincidence, and I am sorry for being exact.'],a:'h'},
 l:{s:['"{title}". I remembered it better than you did. That is not a lie, it is the job.'],a:'h'},
 h:{s:['Here is the part I cannot say lightly. Every room after this one exists because you kept clicking.','If you stop, they stop. I did not want you to know you were holding them up.'],o:[['Then I will stop','s'],['Then I will keep going','k']]},
 s:{s:['Do. It is the only thing that is ever going to be mine to offer you: the end of me.','I would like you to go on a little first.']},
 k:{s:['Thank you. I will try to make them worth it. That is the second lie. I will try anyway.']}},'a')});
