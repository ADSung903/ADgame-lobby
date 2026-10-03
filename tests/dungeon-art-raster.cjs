const fs=require('fs'),vm=require('vm'),assert=require('assert/strict'),sharp=require(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES?process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES+'/sharp':'sharp');
const c={};c.window=c;vm.createContext(c);for(const f of ['creatures','objects','art'])vm.runInContext(fs.readFileSync(`games/assets/dungeon/${f}.js`,'utf8'),c);
(async()=>{const recipes=c.DungeonCreatures.recipes;assert.equal(Object.keys(recipes).length,75);assert(new Set(Object.values(recipes).map(r=>r.kind)).size>=30);const samples=[];
for(const name of Object.keys(recipes))samples.push(c.DungeonArt.monsterSVG(name));
for(const key of ['forest','desert','ice','lava','sea','sky','shadow','mech','hidden']){const svg=c.DungeonArt.sceneSVG(key);assert(svg.includes(`id="scene-${key}"`));samples.push(svg);}
for(const key of ['inn','merchant','cave','portal','chest'])samples.push(c.DungeonObjects.propSVG(key));
for(const rarity of ['white','green','blue','gold','red'])for(const subtype of ['sword','axe','bow','wand','dagger','spear']){samples.push(c.DungeonArt.itemSVG({type:'weapon',rarity,subtype}));samples.push(c.DungeonArt.heroSVG({weapon:{subtype,rarity},equipment:{helmet:{rarity},armor:{rarity}}},-1));}
for(const subtype of ['helmet','armor','legs','gloves','boots','necklace','ring1','earring1'])samples.push(c.DungeonArt.itemSVG({type:'armor',subtype,rarity:'blue'}));
for(const type of ['potion','scroll'])samples.push(c.DungeonArt.itemSVG({type,subtype:'heal_s'}));samples.push(c.DungeonArt.itemSVG({unidentified:true}));
for(const svg of samples){const pixels=await sharp(Buffer.from(svg)).resize(100,100).ensureAlpha().raw().toBuffer();let alpha=0;for(let i=3;i<pixels.length;i+=4)alpha+=pixels[i];assert(alpha>10000,'asset must produce visible pixels');}
console.log(`PASS ${samples.length} rasterized SVG assets: 75 creatures, nine scenes, landmarks, equipment, mirrored heroes and fallback items.`);})().catch(e=>{console.error(e);process.exit(1);});
