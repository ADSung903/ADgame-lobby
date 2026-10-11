(function(root,factory){const api=factory();if(typeof module==='object')module.exports=api;else root.NookBlocks=api;})(globalThis,()=>{
 const SHAPES=[[[0,0]],[[0,0],[0,1]],[[0,0],[1,0]],[[0,0],[0,1],[0,2]],[[0,0],[1,0],[2,0]],[[0,0],[0,1],[1,0],[1,1]],[[0,0],[1,0],[2,0],[2,1]],[[0,0],[0,1],[0,2],[1,1]],[[0,0],[0,1],[1,1],[1,2]],[[0,0],[0,1],[0,2],[0,3]],[[0,0],[1,0],[2,0],[3,0]],[[0,0],[0,1],[0,2],[1,0],[1,1],[1,2],[2,0],[2,1],[2,2]],[[0,0],[1,0],[2,0],[2,1],[2,2]],[[0,0],[0,1],[0,2],[1,0],[2,0]]];
 function empty(){return Array.from({length:8},()=>Array(8).fill(0));}
 function fits(board,shape,r,c){return shape.every(([dr,dc])=>r+dr>=0&&r+dr<8&&c+dc>=0&&c+dc<8&&!board[r+dr][c+dc]);}
 function anyFit(board,shape){for(let r=0;r<8;r++)for(let c=0;c<8;c++)if(fits(board,shape,r,c))return true;return false;}
 function place(board,shape,r,c,color=1){
  if(!fits(board,shape,r,c))return null;
  const next=board.map(row=>row.slice());shape.forEach(([dr,dc])=>next[r+dr][c+dc]=color);
  const rows=[],cols=[];for(let i=0;i<8;i++){if(next[i].every(Boolean))rows.push(i);if(next.every(row=>row[i]))cols.push(i);}
  const cleared=new Set();rows.forEach(r=>{for(let c=0;c<8;c++)cleared.add(r*8+c);});cols.forEach(c=>{for(let r=0;r<8;r++)cleared.add(r*8+c);});cleared.forEach(i=>next[Math.floor(i/8)][i%8]=0);
  return{board:next,lines:rows.length+cols.length,cleared:[...cleared],rows,cols,tiles:shape.length};
 }
 function centeredOrigin(shape,x,y,grid){
  const rows=Math.max(...shape.map(p=>p[0]))+1,cols=Math.max(...shape.map(p=>p[1]))+1;
  return[Math.round((y-grid.top-grid.cellHeight/2)/grid.pitchY-(rows-1)/2),Math.round((x-grid.left-grid.cellWidth/2)/grid.pitchX-(cols-1)/2)];
 }
 function deal(random=Math.random){return Array.from({length:3},()=>Math.floor(random()*SHAPES.length));}
 function validState(s){return s&&Array.isArray(s.board)&&s.board.length===8&&s.board.every(r=>Array.isArray(r)&&r.length===8&&r.every(c=>Number.isInteger(c)&&c>=0&&c<=3))&&Array.isArray(s.pieces)&&s.pieces.length===3&&s.pieces.every(p=>p===null||(Number.isInteger(p)&&p>=0&&p<SHAPES.length))&&Number.isFinite(s.score)&&s.score>=0&&Number.isInteger(s.combo)&&s.combo>=0;}
 return{SHAPES,empty,fits,anyFit,place,deal,validState,centeredOrigin};
});
