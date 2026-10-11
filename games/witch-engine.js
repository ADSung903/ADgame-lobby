(function(root,factory){const api=factory();if(typeof module==='object')module.exports=api;else root.NookWitch=api;})(globalThis,()=>{
 class Duel{
  constructor(count=6,poisons=1){if(!Number.isInteger(count)||count<4||count>18||!Number.isInteger(poisons)||poisons<1||poisons>Math.floor(count/2))throw Error('Invalid settings');this.count=count;this.poisonCount=poisons;this.poison=[new Set(),new Set()];this.remaining=[new Set(Array.from({length:count},(_,i)=>i)),new Set(Array.from({length:count},(_,i)=>i))];this.phase='handoff';this.next='hide';this.player=0;this.round=1;this.winner=null;this.outcome=null;}
  ready(){if(this.phase!=='handoff')return false;this.phase=this.next;return true;}
  select(i){if(this.phase!=='hide'||!Number.isInteger(i)||i<0||i>=this.count)return false;const p=this.poison[this.player];if(p.has(i))p.delete(i);else if(p.size<this.poisonCount)p.add(i);else return false;return true;}
  confirm(){if(this.phase!=='hide'||this.poison[this.player].size!==this.poisonCount)return false;if(this.player===0){this.player=1;this.next='hide';}else{this.player=0;this.next='attack';}this.phase='handoff';return true;}
  attack(i){const target=1-this.player;if(this.phase!=='attack'||!this.remaining[target].has(i))return null;this.phase='resolution';this.remaining[target].delete(i);const poison=this.poison[target].has(i);this.outcome={player:this.player,target,index:i,poison};if(poison)this.winner=this.player;return this.outcome;}
  continue(){if(this.phase!=='resolution')return false;if(this.winner!==null){this.phase='finished';return true;}this.player=1-this.player;this.round++;this.next='attack';this.phase='handoff';return true;}
 }
 return {Duel};
});
