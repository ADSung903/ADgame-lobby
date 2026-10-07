// Fishing V2 renderer contract. Authored image assets only.
// Scene layers are HTML <img>/<picture> elements with CSS transforms for parallax.
// Fish sprites are image sequences or sprite sheets. Canvas primitives are forbidden for final fish/boat/background art.
export class SpriteRenderer{
 constructor(root){this.root=root;this.nodes=new Map();}
 mountFish(entity,asset){const el=document.createElement('img');el.className='fv2-fish';el.src=asset;el.alt='';el.draggable=false;el.dataset.uid=entity.uid;this.root.appendChild(el);this.nodes.set(entity.uid,el);return el;}
 updateFish(entity){const el=this.nodes.get(entity.uid);if(!el)return;el.style.transform=`translate3d(${entity.x}px,${entity.y}px,0) scaleX(${entity.dir<0?-1:1})`;el.dataset.state=entity.state;}
 removeFish(uid){const el=this.nodes.get(uid);if(el){el.remove();this.nodes.delete(uid);}}
}