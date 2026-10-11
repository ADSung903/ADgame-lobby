(function(root){
 'use strict';
 const Rules={
  chapterStart(level){const n=Math.max(1,Math.floor(Number(level)||1));return Math.min(70,1+3*Math.floor((n-1)/3));},
  chapterNumber(level){return Math.floor((this.chapterStart(level)-1)/3)+1;},
  completed(start,unlocked,stars){return Number(unlocked)>start+2||[start,start+1,start+2].every(n=>Number(stars?.[n])>0);},
  boundary(level){return Number(level)>=3&&Number(level)<=72&&Number(level)%3===0;},
  safeUnlocked(n){return Math.max(1,Math.min(10000,Math.floor(Number(n)||1)));}
 };
 if(typeof module==='object'&&module.exports)module.exports=Rules;else root.PrinceChapterRules=Rules;
})(typeof window==='object'?window:globalThis);
