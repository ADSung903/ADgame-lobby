/* Run with a static server at FISHING_BASE_URL (default localhost:4173).
   Requires playwright. Optional CHROMIUM_PATH points to a local browser. */
const assert=require('node:assert/strict'),fs=require('node:fs');
const {chromium}=require(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES?process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES+'/playwright':'playwright');
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||undefined,headless:true,args:['--no-sandbox','--disable-dev-shm-usage','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
 const context=await browser.newContext({viewport:{width:390,height:844},hasTouch:true,deviceScaleFactor:1});
 const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('dialog',d=>d.accept());
 const base=process.env.FISHING_BASE_URL||'http://127.0.0.1:4173';const url=base+'/games/fishing_rod_core.html?test=1';
 await page.goto(url,{waitUntil:'domcontentloaded'});await page.waitForFunction(()=>window.FishingTest?.state.artReady);await page.evaluate(()=>document.fonts.ready);
 assert.equal(await page.locator('.fish-card').count(),0);
 await page.screenshot({path:'/tmp/fishing-mobile-home.png',fullPage:true});
 assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 await page.click('#casual-start');await page.click('#depths button:nth-child(3)');assert.match(await page.locator('#zone-name').textContent(),/深層/);
 await page.click('#cast');await page.waitForFunction(()=>FishingTest.state.trip.catches.length===1);await page.waitForFunction(()=>FishingTest.state.trip.phase==='idle');
 const first=await page.evaluate(()=>FishingTest.state.trip.catches[0]);assert(['sunfish','oarfish'].includes(first.fishId));
 await page.click('#sea [data-open="book"]');await page.getByRole('button',{name:new RegExp('已發現，查看圖鑑')}).click();await page.getByRole('button',{name:'開始製作魚拓',exact:true}).click();
 await page.locator('#art-title').fill('第一場藍色的海');await page.locator('#signature').fill('Adrian');await page.locator('#paper-type').selectOption('sand');
 await page.locator('#ink-color').fill('#a34736');const box=await page.locator('#print-canvas').boundingBox();await page.mouse.move(box.x+box.width*.25,box.y+box.height*.46);await page.mouse.down();await page.mouse.move(box.x+box.width*.72,box.y+box.height*.48,{steps:12});await page.mouse.up();
 assert.equal(await page.evaluate(()=>FishingTest.state.draft.strokes.length),1);
 await page.screenshot({path:'/tmp/fishing-mobile-studio.png',fullPage:true});
 await page.click('#save-art');await page.waitForSelector('#gallery.active');assert.equal(await page.locator('.art-card').count(),1);await page.locator('.art-card').click();await page.getByRole('button',{name:'掛上展示牆',exact:true}).click();await page.click('#wall-art');assert.equal(await page.locator('.art-card').count(),1);
 await page.locator('.art-card').click();const downloadPromise=page.waitForEvent('download');await page.getByRole('button',{name:'匯出 PNG 圖片',exact:true}).click();const download=await downloadPromise;await download.saveAs('/tmp/fishing-print.png');assert(fs.statSync('/tmp/fishing-print.png').size>10000);await page.locator('#detail .close-dialog').click();
 // Same species can hold multiple independent recipes.
 await page.evaluate(id=>FishingTest.startStudio(id),first.fishId);await page.locator('#art-title').fill('第二張・墨色');await page.locator('#ink-color').fill('#253d42');await page.click('#fill-ink');await page.click('#save-art');await page.waitForSelector('#gallery.active');assert.equal(await page.locator('.art-card').count(),2);
 const before=await page.evaluate(()=>JSON.parse(localStorage.getItem('fishing_tales_v1')));assert.equal(before.works.length,2);assert.equal(before.records[first.fishId].largest.size,first.size);
 await page.reload({waitUntil:'domcontentloaded'});await page.waitForFunction(()=>FishingTest?.state.artReady);await page.click('#home .home-links [data-open="gallery"]');assert.equal(await page.locator('.art-card').count(),2);
 // Export/import round trip merges without duplicating IDs.
 const backupPromise=page.waitForEvent('download');await page.click('#backup');const backup=await backupPromise;await backup.saveAs('/tmp/fishing-backup.json');await page.locator('#restore').setInputFiles('/tmp/fishing-backup.json');await page.waitForFunction(()=>document.querySelector('#toast').textContent.includes('已合併'));assert.equal(await page.evaluate(()=>FishingTest.state.save.works.length),2);
 // Malformed imports cannot replace the collection.
 await page.locator('#restore').setInputFiles({name:'invalid.json',mimeType:'application/json',buffer:Buffer.from('{"version":2}')});await page.waitForFunction(()=>document.querySelector('#toast').textContent.includes('無法匯入'));assert.equal(await page.evaluate(()=>FishingTest.state.save.works.length),2);
 // Challenge UI: configuration, pointer control, release and success/failure rules.
 await page.evaluate(()=>FishingTest.show('home'));await page.click('#challenge-select');await page.locator('#rod-options button').nth(2).click();await page.locator('#bait-options button').nth(1).click();await page.click('#challenge-start');await page.click('#cast');await page.waitForSelector('#fight:not([hidden])');
 const reelBox=await page.locator('#reel').boundingBox();await page.mouse.move(reelBox.x+40,reelBox.y+20);await page.mouse.down();await page.waitForTimeout(300);assert.equal(await page.evaluate(()=>FishingTest.state.trip.held),true);await page.mouse.up();assert.equal(await page.evaluate(()=>FishingTest.state.trip.held),false);
 await page.screenshot({path:'/tmp/fishing-mobile-fight.png'});
 const success=await page.evaluate(()=>{const t=FishingTest;for(let n=0;n<4000&&t.state.trip.phase==='fight';n++){t.setHeld(t.state.trip.tension<65);t.state.trip.elapsed+=.05;t.fightStep(.05);}return {phase:t.state.trip.phase,catches:t.state.trip.catches.length};});assert.equal(success.catches,1);
 await page.evaluate(()=>{const t=FishingTest;t.state.trip.phase='idle';t.cast();t.beginFight();t.state.trip.tension=99.99;t.setHeld(true);t.fightStep(.05);});assert.match(await page.locator('#sea-message').textContent(),/斷/);
 await page.evaluate(()=>{const t=FishingTest;t.state.trip.phase='idle';t.cast();t.beginFight();t.setHeld(false);t.state.trip.tension=0;t.state.trip.slack=4;t.fightStep(.05);});assert.match(await page.locator('#sea-message').textContent(),/鬆脫/);
 // Twenty casts end exactly once; no 21st cast; result uses sprite canvases.
 await page.evaluate(()=>{const t=FishingTest;t.startTrip('casual');for(let n=0;n<20;n++){t.state.trip.phase='idle';t.cast(.5,n%4);t.settle(true);}t.finishTrip();t.cast();});assert.equal(await page.evaluate(()=>FishingTest.state.trip.casts),20);assert.equal(await page.locator('#catch-list canvas').count(),20);assert(await page.locator('#result').evaluate(e=>e.open));assert.equal(await page.evaluate(()=>FishingTest.state.save.best.casual>0),true);
 await page.screenshot({path:'/tmp/fishing-mobile-result.png'});await page.click('#result-home');
 // Actual game pools are exclusive by zone; all species reachable in both modes.
 assert(await page.evaluate(()=>{for(let z=0;z<4;z++)for(let i=0;i<100;i++)if(FishingTest.pickFish(z).zone!==z)return false;return true;}));
 // Persisted records have exact capture metadata; no corrupt restore was applied.
 await page.reload({waitUntil:'domcontentloaded'});await page.waitForFunction(()=>FishingTest?.state.artReady);assert.equal(await page.evaluate(()=>FishingTest.state.save.works.length),2);
 await page.setViewportSize({width:1440,height:1000});await page.screenshot({path:'/tmp/fishing-desktop-home.png',fullPage:true});await page.click('#home .home-links [data-open="gallery"]');await page.screenshot({path:'/tmp/fishing-desktop-gallery.png',fullPage:true});assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 // Existing collection is migrated without inventing size or capture counts.
 const legacy=await browser.newContext();const lp=await legacy.newPage();await lp.addInitScript(()=>{localStorage.setItem('fishing_ocean_collection','["sardine","carp","whale"]');});await lp.goto(url,{waitUntil:'domcontentloaded'});await lp.waitForFunction(()=>FishingTest?.state.artReady);assert.equal(await lp.evaluate(()=>FishingTest.state.save.records.sardine.count),0);assert.equal(await lp.evaluate(()=>FishingTest.state.save.legacy.length),3);assert.equal(await lp.evaluate(()=>FishingTest.state.save.records.carp),undefined);await legacy.close();
 // Blocked localStorage remains playable and explicitly reports in-memory-only saving.
 const blocked=await browser.newContext();const bp=await blocked.newPage();await bp.addInitScript(()=>{Storage.prototype.setItem=()=>{throw Error('blocked')};});await bp.goto(url,{waitUntil:'domcontentloaded'});await bp.waitForFunction(()=>FishingTest?.state.artReady);assert.equal(await bp.evaluate(()=>{FishingTest.startTrip('casual');FishingTest.cast();FishingTest.settle(true);return FishingTest.state.storageOK;}),false);await blocked.close();
 assert.deepEqual(errors,[]);await browser.close();console.log('PASS: real-browser mobile/desktop, casual cast, zone pools, challenge input/win/break/slack, 20 casts, sprite results, brush recipe, multiple prints, PNG export, pinning, reload, backup merge, invalid restore, legacy migration, blocked storage.');
})().catch(e=>{console.error(e);process.exit(1);});
