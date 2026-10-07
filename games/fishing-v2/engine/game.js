import {FISH_SPECIES} from '../data/species.js';
export const FishState=Object.freeze({SWIMMING:'swimming',HOOKED:'hooked',REELING:'reeling',CAUGHT:'caught',DESPAWNED:'despawned'});
export class FishingSession{
 constructor(maxCasts=20){this.maxCasts=maxCasts;this.casts=0;this.score=0;this.entities=new Map();this.caught=new Set();}
 addFish(entity){entity.state=FishState.SWIMMING;entity.collidable=true;this.entities.set(entity.uid,entity);return entity;}
 hook(uid){const f=this.entities.get(uid);if(!f||f.state!==FishState.SWIMMING||!f.collidable)return false;f.state=FishState.HOOKED;f.collidable=false;return true;}
 reel(uid){const f=this.entities.get(uid);if(!f||f.state!==FishState.HOOKED)return false;f.state=FishState.REELING;return true;}
 catch(uid){const f=this.entities.get(uid);if(!f||f.state!==FishState.REELING)return null;f.state=FishState.CAUGHT;f.collidable=false;const spec=FISH_SPECIES.find(x=>x.id===f.speciesId);this.score+=spec?.points||0;this.caught.add(f.speciesId);return {species:spec,score:this.score};}
 despawn(uid){const f=this.entities.get(uid);if(!f)return false;f.state=FishState.DESPAWNED;f.collidable=false;this.entities.delete(uid);return true;}
 canCast(){return this.casts<this.maxCasts;} useCast(){if(!this.canCast())return false;this.casts++;return true;}
}