/* Item selection is keyed by stable IDs and revalidated at the final transaction. */
let saleSelection=new Set(),saleReview=false;
function saleItems(){return state.inventory.filter(i=>i.id!=null&&!i.locked&&saleSelection.has(String(i.id)));}
function safeSaleItem(i){return (i.type==='weapon'||i.type==='armor')&&['white','green'].includes(i.rarity)&&!i.locked&&!i.unidentified&&!(i.enhance>0)&&!i.fromGeneration;}
function openSaleDesk(rarity,onlyId){checkNearMerchant();if(!nearMerchant){toast('請先靠近商人或村莊');return;}saleSelection=new Set();saleReview=false;
 if(onlyId!=null)saleSelection.add(String(onlyId));else if(rarity)state.inventory.filter(i=>i.rarity===rarity&&safeSaleItem(i)).forEach(i=>saleSelection.add(String(i.id)));
 renderSaleDesk();closeModal('modal-item');openModal('modal-sale');}
function renderSaleDesk(){const items=saleItems(),total=items.reduce((sum,i)=>sum+computeSellPrice(i),0),body=document.getElementById('sale-body');
 body.innerHTML=`<div class="sale-summary" aria-live="polite"><strong id="sale-summary-text">${items.length} 件 · 可得 ${total} 金</strong><span>持有 ${state.gold} 金</span></div>
 <p class="sale-help">${saleReview?'核對以下清單。已強化裝備售出後不會退回強化材料。':'勾選要賣的物品。每個勾選只賣一件；收藏裝備不會出售。'}</p>
 ${saleReview?'':`<div class="sale-tools"><button onclick="selectSafeSales()">選取普通／精良閒置裝備</button><button onclick="clearSales()">清空選取</button></div>`}
 <div class="sale-list">${state.inventory.map((it,index)=>({it,index})).filter(({it})=>!saleReview||items.includes(it)).map(({it,index})=>`<label class="sale-card ${it.locked?'locked':''}"><input type="checkbox" ${saleReview?'disabled':''} ${it.locked?'disabled':''} ${saleSelection.has(String(it.id))&&!it.locked?'checked':''} onchange="toggleSale(${index},this.checked)"><span class="sale-icon">${renderItemIcon(it)}</span><span class="sale-info"><strong>${it.name}${it.enhance?' +'+it.enhance:''}</strong><small>${it.locked?'收藏鎖定':it.unidentified?'待鑑定：建議先查看':it.fromGeneration?'前代遺物':it.enhance?'已強化：請慎選':SLOT_LABEL[it.subtype]||it.type}</small></span><span class="sale-price">${computeSellPrice(it)} 金</span></label>`).join('')||'<p>沒有可出售的物品。</p>'}</div>
 <div class="sale-actions">${saleReview?'<button onclick="saleReview=false;renderSaleDesk()">返回挑選</button>':''}<button id="sale-submit" ${items.length?'':'disabled'} onclick="${saleReview?'completeSale()':'reviewSale()'}">${saleReview?'確認出售':'查看出售清單'}</button></div>`;}
function updateSaleSummary(){const items=saleItems(),total=items.reduce((sum,i)=>sum+computeSellPrice(i),0);document.getElementById('sale-summary-text').textContent=`${items.length} 件 · 可得 ${total} 金`;document.getElementById('sale-submit').disabled=!items.length;}
function toggleSale(index,selected){const it=state.inventory[index];if(!it||it.locked)return;if(selected)saleSelection.add(String(it.id));else saleSelection.delete(String(it.id));updateSaleSummary();}
function selectSafeSales(){saleSelection=new Set(state.inventory.filter(safeSaleItem).map(i=>String(i.id)));renderSaleDesk();}
function clearSales(){saleSelection.clear();renderSaleDesk();}
function reviewSale(){if(!saleItems().length)return;saleReview=true;renderSaleDesk();}
function completeSale(){checkNearMerchant();if(!nearMerchant){toast('請回到商人附近交易');return;}if(!saleReview)return;const items=saleItems();if(!items.length)return;
 const total=items.reduce((sum,i)=>sum+computeSellPrice(i),0),ids=new Set(items.map(i=>String(i.id)));state.inventory=state.inventory.filter(i=>!ids.has(String(i.id))||i.locked);state.gold+=total;const n=items.length;saleSelection.clear();saleReview=false;
 playSFX('coin');closeModal('modal-sale');closeModal('modal-item');renderMerchant();refreshInventoryIfOpen();updateUI();save(true);toast(`售出 ${n} 件，獲得 ${total} 金`);}
function toggleItemLock(id){const found=findItemById(id);if(!found)return;found.item.locked=!found.item.locked;save(true);openItemCard(found.item,found.fromInv,found.invIdx,false);refreshInventoryIfOpen();}
