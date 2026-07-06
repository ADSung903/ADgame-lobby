/* ============================================================
   企業模擬經營 — 內容設定檔（sim-config.js）
   產業/事件/技能/心聲/名字池等內容資料；引擎在 sim.html
============================================================ */

const CONFIG = {

INDUSTRIES:{
  "品牌廠OEM_ODM":{label:"品牌廠 OEM/ODM",capital:5000,enabled:true,
    desc:"筆電/Monitor/手機/耳機/手錶代工。RFQ流程長，客戶議價力強。",
    stages:["RFI","RFQ","報價議價","EVT","DVT","PVT","認證","MP","量產出貨"],
    stageDuration:[1,1,1,2,2,2,1,1,null],
    stageCost:[10,20,15,50,70,90,30,40,0],
    stageSuccess:[0.9,0.85,0.8,0.75,0.78,0.8,0.85,0.7,null]},
  "PCM":{label:"PCM 精密機構件",capital:1200,enabled:true,
    desc:"開模/試模流程，模具是良率天花板，資本支出集中在前期。",
    stages:["開模","T0試模","修模","T1試模","量產"],
    stageDuration:[2,1,1,1,null],
    stageCost:[60,20,15,20,0],
    stageSuccess:[0.85,0.7,0.8,0.85,null]},
  "材料":{label:"材料",capital:1200,enabled:false,desc:"配方/製程導向，客戶端SQE認證週期長。"},
  "光電":{label:"光電",capital:2500,enabled:false,desc:"良率敏感，設備折舊壓力大。"},
  "半導體":{label:"半導體",capital:10000,enabled:false,desc:"技術門檻最高，前期燒錢期長。"},
  "傳統產業":{label:"傳統產業",capital:300,enabled:false,desc:"門檻低，適合新手教學。"}
},

/* 部門定義:
   effects = {[statePath]: formula_fn(dept, state) → delta}
   這個設計讓未來新增部門只需在這裡加一筆 */
DEPT_DEFS:[
  {key:"sales",name:"業務部",color:"var(--blue)",unlocked:true,cost:0,headPos:"處長",startSlots:3,startEmps:["業務"],
    unlockCheck:()=>true,unlockHint:"",
    kpis:[{label:"轉化率",fn:(d,s)=>clamp(40+avgAbility(d,"sales")/2,0,100)},
           {label:"客戶信任",fn:(d,s)=>s.company.customerTrust}],
    effects:{cogsRateBonus:(d)=>(d.directive==="negotiate"?-0.01:0),
             customerTrustDelta:(d)=>(d.directive==="retain"?1:d.directive==="expand"?0.5:0)}},
  {key:"rd",name:"研發部",color:"var(--purple)",unlocked:true,cost:0,headPos:"經理",startSlots:3,startEmps:["工程師","工程師"],
    unlockCheck:()=>true,unlockHint:"",
    kpis:[{label:"製程成功率",fn:(d,s)=>clamp(50+avgAbility(d,"technical")*0.4,0,100)},
           {label:"平均技術力",fn:(d,s)=>Math.round(avgAbility(d,"technical"))}],
    effects:{stageSuccessBonus:(d)=>0.04*(d.investLevel-1)+(d.directive==="focus"?0.05:0)}},
  {key:"prod",name:"產線部",color:"var(--orange)",unlocked:true,cost:0,headPos:"經理",startSlots:5,startEmps:["產線人員","產線人員"],
    unlockCheck:()=>true,unlockHint:"",
    kpis:[{label:"產能利用率",fn:(d,s)=>clamp(s.lastFin?Math.round(s.lastFin.demand/Math.max(1,s.lastFin.capacity)*100):0,0,100)},
           {label:"良率",fn:(d,s)=>Math.round(s.company.inspectMode==="full"?s.company.trueYieldRate:s.company.inspectMode==="partial"?(s.company.trueYieldRate+s.company.reportedYieldRate)/2:s.company.reportedYieldRate)}],
    effects:{yieldBonus:(d)=>0.03*(d.investLevel-1)+(d.directive==="focus"?0.04:0),
             agingDelta:(d)=>(d.directive==="maintain"?-0.006:0)}},
  {key:"qa",name:"品保部",color:"var(--teal)",unlocked:false,cost:30,headPos:"經理",startSlots:2,startEmps:[],
    unlockCheck:()=>true,unlockHint:"",
    kpis:[{label:"退貨率",fn:(d,s)=>+(s.company.returnRate*100).toFixed(1)},
           {label:"品保強度",fn:(d,s)=>Math.round(avgAbility(d,"technical"))}],
    effects:{returnRateDelta:(d)=>-(avgAbility(d,"technical")/100)*0.012-(d.investLevel-1)*0.002-(d.directive==="audit"?0.004:0),
             customerTrustDelta:(d)=>(d.directive==="visit"?1.5:0)}},
  {key:"proc",name:"採購部",color:"#7a8fa3",unlocked:false,cost:50,headPos:"經理",startSlots:2,startEmps:[],
    unlockCheck:(s)=>s.company.completedContracts>=2,unlockHint:"需完成過2筆合約",
    kpis:[{label:"COGS率",fn:(d,s)=>s.lastFin?Math.round(s.lastFin.cogsRate*100):55},
           {label:"採購風險",fn:(d,s)=>Math.round(s.company.trueRisk.採購舞弊)}],
    effects:{cogsRateBonus:(d)=>-(avgAbility(d,"technical")/100)*0.05-(d.directive==="negotiate"?0.02:0),
             riskDelta:{採購舞弊:(d)=>-(avgAbility(d,"integrity")/100)*1.5-(d.directive==="audit"?3:0)}}},
  {key:"fin",name:"財務部",color:"var(--teal)",unlocked:false,cost:60,headPos:"經理",startSlots:2,startEmps:[],
    unlockCheck:(s)=>s.company.consecutivePositiveMonths>=3,unlockHint:"需連續3個月淨利為正",
    kpis:[{label:"回報噪音",fn:(d,s)=>+(s.company.noiseAmp*100).toFixed(0)},
           {label:"帳務健康",fn:(d,s)=>Math.round(avgAbility(d,"management"))}],
    effects:{noiseAmpDelta:(d)=>-(avgAbility(d,"management")/100)*0.15-(d.directive==="audit"?0.05:0),
             riskDelta:{財務造假:(d)=>(d.directive==="refine"?-3:0)}}},
  {key:"hr",name:"人資部",color:"var(--pink,#e88fb0)",unlocked:false,cost:80,headPos:"經理",startSlots:2,startEmps:[],
    unlockCheck:(s)=>allEmps(s).length>=12,unlockHint:"員工達 12 人可開設",
    kpis:[{label:"招募品質",fn:(d,s)=>clamp(40+avgAbility(d,"management")/2+d.employees.length*5,0,100)},
           {label:"組織健康",fn:(d,s)=>{const es=allEmps(s);return es.length?Math.round(es.reduce((a,e)=>a+e.loyalty,0)/es.length):50;}}],
    effects:{}},
  {key:"global",name:"海外部",color:"var(--pink)",unlocked:false,cost:100,headPos:"處長",startSlots:2,startEmps:[],
    unlockCheck:(s)=>s.company.cash>=2000,unlockHint:"現金需達2000萬",
    kpis:[{label:"海外訂單",fn:(d,s)=>d.employees.length>0?1:0},
           {label:"國際人才",fn:(d,s)=>d.employees.length}],
    effects:{globalRecruitBoost:(d)=>d.employees.length>0&&d.unlocked}}
],

DIRECTIVES:{
  sales:[{id:"retain",label:"維繫老客戶"},{id:"expand",label:"開發新客戶"},{id:"negotiate",label:"降價磋商"}],
  rd:[{id:"focus",label:"全力研發"},{id:"train",label:"教育訓練"}],
  prod:[{id:"focus",label:"全力生產"},{id:"maintain",label:"設備保養"},{id:"safety",label:"安全稽查"}],
  qa:[{id:"audit",label:"強化稽核"},{id:"visit",label:"客戶巡廠"}],
  proc:[{id:"negotiate",label:"議價砍價"},{id:"audit",label:"稽核供應商"}],
  fin:[{id:"audit",label:"帳務稽核"},{id:"refine",label:"精算報表"}],
  global:[{id:"expand",label:"開拓海外"},{id:"culture",label:"文化培訓"}]
},

EVENT_POOL:[
  {id:"E01",bucket:"品質掩蓋",level:"department",name:"量產初期良率崩盤",skillTag:"quality",
    cond:(s)=>s.projects.some(p=>p.stageIndex===s.industry.stages.length-1),baseProb:0.1,
    desc:"MP/量產階段良率不如預期，客戶開始關注出貨品質。",
    options:[
      {label:"停線排查根因",eff:(s)=>{s.company.cash-=esc$(s,25);s.company.trueRisk.品質掩蓋=clamp(s.company.trueRisk.品質掩蓋-15,0,100);s.company.baseYieldRate=clamp(s.company.baseYieldRate+8,30,99);}},
      {label:"邊修邊撐production",eff:(s)=>{s.company.trueRisk.品質掩蓋=clamp(s.company.trueRisk.品質掩蓋+12,0,100);}}]},
  {id:"E02",bucket:"一般營運",level:"department",name:"設備故障停機",skillTag:"equip",
    cond:(s)=>s.company.month>1,baseProb:0.06,
    desc:"產線設備老化，本月發生非預期停機。",
    options:[
      {label:"緊急維修",eff:(s)=>{s.company.cash-=esc$(s,15);}},
      {label:"延後維修硬撐",eff:(s)=>{s.company.trueRisk.品質掩蓋=clamp(s.company.trueRisk.品質掩蓋+6,0,100);}}]},
  {id:"E03",bucket:"一般營運",level:"department",name:"模具異常磨損",
    cond:(s)=>s.industry.key==="PCM"&&s.projects.some(p=>p.stageIndex<=2),baseProb:0.08,
    desc:"PCM專屬：模具使用週期已到，繼續用下去風險會累積。",
    options:[
      {label:"提前更換模具",eff:(s)=>{s.company.cash-=esc$(s,20);}},
      {label:"延長使用觀察",eff:(s)=>{s.company.baseYieldRate=clamp(s.company.baseYieldRate-8,20,99);}}]},
  {id:"E04",bucket:"勞檢",level:"department",name:"部門加班過量引發疲勞事故",
    cond:(s)=>s.company.month>2&&avgLoyaltyAll(s)<55,baseProb:0.08,
    desc:"近期排程吃緊，基層員工已連續加班數週。",
    options:[
      {label:"增聘人力分擔",eff:(s)=>{s.company.cash-=esc$(s,12);s.company.trueRisk.勞檢=clamp(s.company.trueRisk.勞檢-8,0,100);}},
      {label:"繼續用加班頂著",eff:(s)=>{s.company.trueRisk.勞檢=clamp(s.company.trueRisk.勞檢+10,0,100);allEmps(s).forEach(e=>e.loyalty=clamp(e.loyalty-4,0,100));}}]},
  {id:"E05",bucket:"採購舞弊",level:"individual",name:"業務人員收受供應商回扣",
    cond:(s)=>s.company.month>3&&s.departments.find(d=>d.key==="sales")?.employees.length>0,baseProb:0.05,
    desc:"傳出有人事與供應商之間存在不正常的金流往來。",
    options:[
      {label:"舉報並處理",eff:(s)=>{s.company.trueRisk.採購舞弊=clamp(s.company.trueRisk.採購舞弊-15,0,100);}},
      {label:"默許並分潤",eff:(s)=>{s.company.cash+=esc$(s,8);s.company.trueRisk.採購舞弊=clamp(s.company.trueRisk.採購舞弊+18,0,100);}},
      {label:"知情不報",eff:(s)=>{s.company.trueRisk.採購舞弊=clamp(s.company.trueRisk.採購舞弊+6,0,100);}}]},
  {id:"E06",bucket:"忠誠度/人事",level:"individual",name:"高評級員工被獵頭挖角",
    cond:(s)=>s.company.month>3&&allEmps(s).some(e=>e.loyalty<45&&["彩","紅","金"].includes(e.rating)),
    baseProb:0.08,
    resolve:(s)=>{
      for(const d of s.departments){
        const e=d.employees.find(e2=>e2.loyalty<45&&["彩","紅","金"].includes(e2.rating));
        if(e)return{employee:e,dept:d};
      }
      if(s.gm&&s.gm.loyalty<45&&["彩","紅","金"].includes(s.gm.rating))return{employee:s.gm,dept:null};
      return null;
    },
    desc:(s,ctx)=>`「${ctx.employee.name}」（${ctx.employee.position} ・ 評級${ctx.employee.rating} ・ 忠誠度偏低）最近接到了同業的邀約，正在考慮是否要跳槽。`,
    options:[
      {label:"加薪挽留",eff:(s,ctx)=>{const e=ctx.employee;e.loyalty=clamp(e.loyalty+25,0,100);e.salary=Math.round(e.salary*1.15*10)/10;s.company.cash-=Math.round(e.salary*2);s.log("人事",`「${e.name}」接受加薪挽留，留了下來。`);}},
      {label:"尊重員工選擇",eff:(s,ctx)=>{s.log("人事",`「${ctx.employee.name}」選擇離開了公司。`);if(ctx.dept){const i=ctx.dept.employees.indexOf(ctx.employee);if(i>=0)ctx.dept.employees.splice(i,1);}else if(s.gm===ctx.employee){s.hasGM=false;s.gm=null;}}}]},
  {id:"E07",bucket:"財務造假",level:"company",name:"銀行徵信加嚴",
    cond:(s)=>s.company.debtRatio()>0.5,baseProb:0.07,
    desc:"負債比偏高，銀行重新評估你的信用條件。",
    options:[
      {label:"接受較高利率續貸",eff:(s)=>{s.company.ratePenalty+=0.012;}},
      {label:"縮減資本支出度過",eff:(s)=>{s.company.investmentFrozen=true;}}]},
  {id:"E08",bucket:"一般營運",level:"company",name:"停電/天災影響產線",skillTag:"crisis",
    cond:(s)=>s.company.month>4&&s.projects.some(p=>p.stageIndex>=s.industry.stages.length-1),baseProb:0.03,
    desc:"突發停電或天氣事件導致產線停擺，本月產出受影響。",
    options:[
      {label:"緊急啟動備援",eff:(s)=>{s.company.cash-=esc$(s,18);}},
      {label:"順勢延遲交期",eff:(s)=>{s.company.customerTrust=clamp(s.company.customerTrust-8,0,100);}}]},
  {id:"E10",bucket:"一般營運",level:"company",name:"大客戶年度砍價",skillTag:"nego",
    cond:(s)=>s.company.month>8&&s.projects.some(p=>p.contract),baseProb:0.06,
    desc:"最大客戶的採購總監來電：明年度要求全面降價 8%，不然轉單。",
    options:[
      {label:"咬牙答應（客戶信任+5，毛利受損）",eff:(s)=>{s.projects.forEach(p=>{if(p.contract)p.contract.price=Math.round(p.contract.price*0.92);});s.company.customerTrust=clamp(s.company.customerTrust+5,0,100);}},
      {label:"硬起來拒絕（信任-10，賭它不敢轉）",eff:(s)=>{s.company.customerTrust=clamp(s.company.customerTrust-10,0,100);}}]},
  {id:"E11",bucket:"一般營運",level:"company",name:"原物料大漲",skillTag:"supply",
    cond:(s)=>s.company.month>5,baseProb:0.05,
    desc:"上游原料價格暴漲，本季採購成本壓不住了。",
    options:[
      {label:"預付鎖料（現金換安心）",eff:(s)=>{s.company.cash-=esc$(s,30);}},
      {label:"硬吃成本三個月",eff:(s)=>{s.company._cogsBump=3;s.log("採購","原料成本上揚，未來三個月 COGS +5%。");}}]},
  {id:"E12",bucket:"一般營運",level:"company",name:"匯率劇烈波動",skillTag:"finance",
    cond:(s)=>{const g=s.departments.find(d=>d.key==="global");return g&&g.unlocked&&g.employees.length>0;},baseProb:0.06,
    desc:"台幣急升，海外訂單的匯損正在啃食獲利。",
    options:[
      {label:"買遠期避險（付手續費）",eff:(s)=>{s.company.cash-=esc$(s,15);}},
      {label:"自然避險，認賠匯損",eff:(s)=>{s.company.cash-=esc$(s,28);}}]},
  {id:"E13",bucket:"一般營運",level:"company",name:"同業倒閉",skillTag:"market",
    cond:(s)=>s.company.month>10,baseProb:0.03,
    desc:"競爭同業無預警倒閉，市場上流出一批急單與失業熟手。",
    options:[
      {label:"低價吃下急單（信任+8）",eff:(s)=>{s.company.customerTrust=clamp(s.company.customerTrust+8,0,100);s.company.cash+=esc$(s,25);s.log("業務","接收同業急單，小賺一筆。");}},
      {label:"趁機挖角熟手（品保+產線各+1人）",eff:(s)=>{["qa","prod"].forEach(k=>{const d=s.departments.find(x=>x.key===k);if(d&&d.unlocked&&d.employees.length<d.slots)d.employees.push(makeEmployee(k==="qa"?"品保":"產線人員",d,s));});s.log("人事","撿到寶：兩名同業熟手到職。");}}]},
  {id:"E14",bucket:"一般營運",level:"individual",name:"老師傅想退休",
    cond:(s)=>{const p=s.departments.find(d=>d.key==="prod");return p&&p.employees.length>=3&&s.company.month>12;},baseProb:0.04,
    desc:(s,ctx)=>`產線最資深的師傅萌生退意：「做夠久了，想回家帶孫子。」`,
    options:[
      {label:"高薪慰留＋顧問名義",eff:(s)=>{s.company.cash-=esc$(s,12);s.log("人事","老師傅答應再帶兩年徒弟。");}},
      {label:"風光歡送（產線士氣-4）",eff:(s)=>{const p=s.departments.find(d=>d.key==="prod");if(p&&p.employees.length){const e=p.employees.shift();if(p.headId===e.id)p.headId=null;s.log("人事",`老師傅「${e.name}」退休，經驗斷層讓產線有點慌。`);p.employees.forEach(x=>x.loyalty=clamp(x.loyalty-4,0,100));}}}]},
  {id:"E15",bucket:"一般營運",level:"company",name:"專利蟑螂上門",skillTag:"legal",
    cond:(s)=>s.company.month>15,baseProb:0.03,
    desc:"一家沒聽過的公司寄來律師函，聲稱你的製程侵犯他們的專利。",
    options:[
      {label:"花錢和解，息事寧人",eff:(s)=>{s.company.cash-=esc$(s,35);}},
      {label:"應訴到底（勝率看造化）",eff:(s)=>{if(Math.random()<0.6){s.log("法務","法院駁回對方主張，一毛不賠！");}else{s.company.cash-=esc$(s,60);s.log("法務","纏訟失利，賠償加訴訟費損失慘重。");}}}]},
  {id:"E16",bucket:"勞檢",level:"company",name:"電價調漲",
    cond:(s)=>s.company.month>6,baseProb:0.04,
    desc:"工業電價調漲 12%，產線是吃電大戶。",
    options:[
      {label:"導入節能改造",eff:(s)=>{s.company.cash-=esc$(s,20);s.log("總務","節能改造完成，長期電費受控。");}},
      {label:"成本反映在報價（信任-4）",eff:(s)=>{s.company.customerTrust=clamp(s.company.customerTrust-4,0,100);}}]},
  {id:"E17",bucket:"一般營運",level:"company",name:"大客戶年度稽核",skillTag:"customer",
    cond:(s)=>s.company.customerTrust>40&&s.company.month>8,baseProb:0.05,
    desc:"大客戶的 SQE 團隊下週進廠年度稽核，全公司如臨大敵。",
    options:[
      {label:"全力配合＋加班整備",eff:(s)=>{s.company.cash-=esc$(s,10);s.company.customerTrust=clamp(s.company.customerTrust+6,0,100);allEmps(s).forEach(e=>e.loyalty=clamp(e.loyalty-2,0,100));}},
      {label:"平常心應對（真實風險高就危險）",eff:(s)=>{const worst=Math.max(...Object.values(s.company.trueRisk));if(worst>50){s.company.customerTrust=clamp(s.company.customerTrust-15,0,100);s.log("品質","稽核揪出重大缺失，客戶信任重挫。");}else{s.company.customerTrust=clamp(s.company.customerTrust+3,0,100);s.log("品質","稽核順利通過。");}}}]},
  {id:"E18",bucket:"一般營運",level:"department",name:"獵頭鎖定主管",
    cond:(s)=>s.departments.some(d=>d.headId),baseProb:0.05,
    desc:(s,ctx)=>{const ds=s.departments.filter(d=>d.headId);const d=ds[Math.floor(Math.random()*ds.length)];const h=d.employees.find(e=>e.id===d.headId);s._e18={d,h};return `獵頭公司開出高薪挖角${d.name}主管「${h?h.name:"？"}」。`;},
    options:[
      {label:"加薪 20% 慰留",eff:(s)=>{const t=s._e18;if(t&&t.h){s.company.cash-=Math.round(t.h.salary*3);t.h.salary=Math.round(t.h.salary*1.2*10)/10;t.h.loyalty=clamp(t.h.loyalty+15,0,100);s.log("人事",`重金留住「${t.h.name}」。`);}}},
      {label:"祝福離開（主管出走）",eff:(s)=>{const t=s._e18;if(t&&t.h){t.d.employees=t.d.employees.filter(x=>x.id!==t.h.id);t.d.headId=null;t.d.employees.forEach(x=>x.loyalty=clamp(x.loyalty-6,0,100));s.log("人事",`主管「${t.h.name}」被挖角離職，${t.d.name}軍心動搖。`);}}}]},
  {id:"E19",bucket:"一般營運",level:"company",name:"產業展會邀請",skillTag:"market",
    cond:(s)=>s.company.month>6,baseProb:0.05,
    desc:"年度產業大展來了，攤位費不便宜，但曝光是真的。",
    options:[
      {label:"砸錢參展",eff:(s)=>{s.company.cash-=esc$(s,22);if(Math.random()<0.6){s.company.customerTrust=clamp(s.company.customerTrust+8,0,100);s.log("業務","展會斬獲頗豐，好幾張名片有戲。");}else{s.log("業務","展會人氣普通，就當刷存在感。");}}},
      {label:"今年跳過",eff:(s)=>{}}]},
  {id:"E20",bucket:"勞檢",level:"company",name:"離職潮徵兆",
    cond:(s)=>{const es=allEmps(s);return es.length>=8&&es.reduce((a,e)=>a+e.loyalty,0)/es.length<45;},baseProb:0.12,
    desc:"人資回報：本月已有多人打聽離職流程，士氣低迷正在擴散。",
    options:[
      {label:"緊急全員座談＋小幅調薪",eff:(s)=>{const cost=Math.round(allEmps(s).reduce((a,e)=>a+e.salary,0)*0.6);s.company.cash-=cost;allEmps(s).forEach(e=>{e.salary=Math.round(e.salary*1.03*10)/10;e.loyalty=clamp(e.loyalty+8,0,100);});s.log("人事","及時止血，離職潮暫時壓下。");}},
      {label:"要走的留不住（隨機流失2人）",eff:(s)=>{for(let i=0;i<2;i++){const ds=s.departments.filter(d=>d.employees.length>1);if(!ds.length)break;const d=ds[Math.floor(Math.random()*ds.length)];const e=d.employees.sort((a,b)=>a.loyalty-b.loyalty)[0];d.employees=d.employees.filter(x=>x.id!==e.id);if(d.headId===e.id)d.headId=null;s.log("人事",`「${e.name}」離職。`);}}}]},
  {id:"E25",bucket:"一般營運",level:"company",name:"寒冬砍單",
    cond:(s)=>(s.company.market||100)<80&&s.projects.some(p=>p.contract&&p.contract.monthsLeft>1),baseProb:0.25,
    desc:"景氣寒冬，客戶端庫存滿到走廊：「下季拉貨量砍三成，抱歉，大家都難。」",
    options:[
      {label:"接受砍量（共體時艱，保關係）",eff:(s)=>{const ps=s.projects.filter(p=>p.contract&&p.contract.monthsLeft>1);const p=ps[Math.floor(Math.random()*ps.length)];if(p){p.contract.volume=Math.max(3,Math.round(p.contract.volume*0.7));s.log("市況",`「${p.contract.customer}」拉貨量減三成。`);}}},
      {label:"要求照約履行（信任-8，賭他不敢違約）",eff:(s)=>{s.company.customerTrust=clamp(s.company.customerTrust-8,0,100);if(Math.random()<0.35){const ps=s.projects.filter(p=>p.contract);const p=ps[Math.floor(Math.random()*ps.length)];if(p){p.contract=null;s.log("市況","客戶乾脆整張抽單，撕破臉了。");}}}}]},
  {id:"E30",bucket:"一般營運",level:"company",name:"股東會質詢",
    cond:(s)=>(s.company.stage||0)>=2,baseProb:0.06,
    desc:"股東會上，大股東拿著麥克風不放：「帳上現金這麼多，為什麼不配息？」",
    options:[
      {label:"宣布配息回饋股東",eff:(s)=>{s.company.cash-=esc$(s,50);s.log("財務","配息安撫股東，市場好評。");s.company.investorAnger=Math.max(0,(s.company.investorAnger||0)-1);}},
      {label:"堅持保留盈餘擴大投資",eff:(s)=>{s.company.investorAnger=(s.company.investorAnger||0)+1;s.log("財務","股東不滿累積——出售估值可能受影響。");}}]},
  {id:"E31",bucket:"一般營運",level:"company",name:"分析師報告",
    cond:(s)=>(s.company.stage||0)>=2,baseProb:0.07,
    desc:"外資券商發布最新產業報告，你的公司被點名了。",
    options:[
      {label:"看看報告怎麼說",eff:(s)=>{
        if(Math.random()<0.5){s.company._analystBuff={v:0.05,m:3};s.log("市況","分析師「買進」評等！未來三個月訂單議價轉強。");}
        else{s.company._analystBuff={v:-0.05,m:3};s.log("市況","分析師調降評等至「中立偏空」，客戶下單轉趨觀望。");}}}]},
  {id:"E32",bucket:"財務造假",level:"company",name:"做空機構狙擊",skillTag:"finance",
    cond:(s)=>(s.company.stage||0)>=2&&Math.max(...Object.values(s.company.trueRisk))>60,baseProb:0.15,
    desc:"一家做空機構發布報告，直指你的公司「數字有鬼」。股價劇震，媒體電話打爆公關室。",
    options:[
      {label:"火速和解＋公關滅火（花大錢）",eff:(s)=>{s.company.cash-=esc$(s,80);Object.keys(s.company.trueRisk).forEach(k=>s.company.trueRisk[k]=clamp(s.company.trueRisk[k]-8,0,100));s.log("財務","危機處理小組連夜滅火，順便把幾筆帳整理乾淨。");}},
      {label:"硬扛：召開記者會反擊",eff:(s)=>{if(Math.random()<0.55){s.company.customerTrust=clamp(s.company.customerTrust+5,0,100);s.log("財務","反擊成功，做空報告被打臉，商譽反升。");}else{s.company.cash-=esc$(s,150);s.company.customerTrust=clamp(s.company.customerTrust-15,0,100);s.log("財務","越描越黑——監管機構介入調查，損失慘重。");}}}]},
  {id:"E33",bucket:"一般營運",level:"company",name:"轉型壓力",
    cond:(s)=>(s.company.stage||0)>=3&&!s.company.storyMult,baseProb:0.08,
    desc:"法說會上分析師直問：「代工毛利見頂，貴公司的下一個成長故事是什麼？」",
    options:[
      {label:"砸錢投入 ESG＋智慧製造題材",eff:(s)=>{s.company.cash-=esc$(s,120);s.company.storyMult=1;s.log("財務","轉型題材獲市場買單，估值倍數上調！");}},
      {label:"專注本業，不講故事",eff:(s)=>{s.company._analystBuff={v:-0.05,m:3};s.log("財務","市場失望，評等轉弱三個月。");}}]},
  {id:"E21",bucket:"財務造假",level:"company",name:"會計師換人",skillTag:"audit",
    cond:(s)=>{const f=s.departments.find(d=>d.key==="fin");return f&&f.unlocked&&s.company.month>12;},baseProb:0.04,
    desc:"合作多年的會計師退休，新事務所接手後對舊帳問東問西。",
    options:[
      {label:"全面配合清帳",eff:(s)=>{s.company.cash-=esc$(s,15);s.company.trueRisk.財務造假=clamp(s.company.trueRisk.財務造假-15,0,100);s.log("財務","趁機把帳理乾淨，睡得比較安穩。");}},
      {label:"打太極拖過去",eff:(s)=>{s.company.trueRisk.財務造假=clamp(s.company.trueRisk.財務造假+10,0,100);}}]}
],

SCHOOLS_TW:[
  {name:"國立臺灣大學",score:92},{name:"國立清華大學",score:88},
  {name:"國立陽明交通大學",score:87},{name:"國立成功大學",score:85},
  {name:"國立政治大學",score:80},{name:"國立中央大學",score:77},
  {name:"國立臺北科技大學",score:70},{name:"逢甲大學",score:60},
  {name:"東吳大學",score:58},{name:"私立科技大學",score:45}
],
SCHOOLS_GLOBAL:[
  {name:"麻省理工學院",score:99},{name:"史丹佛大學",score:98},
  {name:"牛津大學",score:96},{name:"劍橋大學",score:96},
  {name:"倫敦帝國學院",score:92},{name:"新加坡國立大學",score:93},
  {name:"東京大學",score:90},{name:"首爾大學",score:88},
  {name:"香港大學",score:89},{name:"多倫多大學",score:85},
  {name:"墨爾本大學",score:83},{name:"北京大學",score:91},
  {name:"海外社區大學",score:32}
],
MAJORS:[
  {name:"資訊工程",rel:{"工程師":1,"處長":0.6,"經理":0.5}},
  {name:"電子工程",rel:{"工程師":1,"處長":0.6,"經理":0.5}},
  {name:"機械工程",rel:{"工程師":0.9,"產線人員":0.7}},
  {name:"工業工程",rel:{"工程師":0.7,"產線人員":0.6,"經理":0.6,"採購":0.6}},
  {name:"企業管理",rel:{"業務":0.9,"處長":0.9,"經理":0.9,"採購":0.6,"財務":0.6,"總經理":0.8}},
  {name:"國際貿易",rel:{"業務":1,"處長":0.7,"海外業務":0.95,"採購":0.7}},
  {name:"行銷學",rel:{"業務":0.85,"海外業務":0.6}},
  {name:"財務金融",rel:{"處長":0.6,"經理":0.6,"財務":1,"總經理":0.7}},
  {name:"哲學",rel:{}},
  {name:"傳播學",rel:{"業務":0.4,"海外業務":0.5}}
],
TRAITS:["拼命型","穩健型","社交強","技術控","誠信存疑"],
NAMES_F:["陳","林","黃","張","李","王","吳","蔡","鄭","劉"],
NAMES_M:["志","建","俊","宗","承","家","冠","柏","偉","哲"],
NAMES_E:["明","軒","翔","宇","勳","豪","廷","鴻","凱","誠"],
NAMES_M_F:["美","怡","雅","欣","佳","淑","慧","詩","宛","采"],
NAMES_E_F:["婷","華","欣","庭","安","芳","君","瑜","琪","蓉"],
CUSTOMERS:["晨曜電子","遠星科技","信泰精密","捷揚國際","昇陽製造","北極星品牌","凱博實業","聯運科技","飛遠國際","光采精工"],
RATINGS:["彩","紅","金","紫","藍","綠","白"],
RATING_POTENTIAL:{"彩":92,"紅":80,"金":68,"紫":57,"藍":47,"綠":37,"白":27},
RATING_COLORS:{"彩":"#9b6fce","紅":"#cf4a44","金":"#d3a44c","紫":"#7f5fc5","藍":"#4a90d9","綠":"#4caf6d","白":"#5a6b78"},
POSITION_SALARY:{"組長":4.5,"主任":5.5,"經理":9,"副處長":11,"處長":14,"副總":18,"總經理":25,"工程師":5,"業務":4,"品保":4,"產線人員":3,"採購":4,"財務":5,"海外業務":5.5},
TUTORIAL:[
  "<b>老闆行動</b>：視察/借款/還款/合約議價這四件事，每月各限用一次。",
  "<b>部門指令</b>：每個已開設部門每月可指定工作重點，部門越多，你每月要決定的事越多。",
  "<b>製程鏈</b>：案件依產業跑完整流程（RFI到MP到量產），每階段有成功率，失敗會重工。",
  "<b>合約</b>：進入量產後，系統會送來合約邀約，訂單量/售價由客戶決定，你只能選接哪張。",
  "<b>多案件平行</b>：業務部人數決定你能同時負責幾個案件。",
  "<b>視察</b>：你看到的數字是「回報值」，可能失真。視察可取得真實值，但有總經理後只能看折中值。",
  "<b>組織擴展</b>：部門員額可擴編，設備可投資升級（1~5級），其他部門達條件後可開設。"
]

};

const SKILLS=[
 {id:"excel",n:"報表大師",tier:"綠",tag:"finance",fx:{noise:-0.02},d:"財務回報更精準"},
 {id:"talk",n:"簡報高手",tier:"綠",tag:"nego",fx:{price:0.01},d:"議價簡報加分"},
 {id:"eng",n:"外語通",tier:"藍",tag:"global",fx:{price:0.01},d:"海外溝通無礙"},
 {id:"law",n:"法務背景",tier:"紫",tag:"legal",fx:{},d:"勞資法規熟稔"},
 {id:"chain",n:"供應鏈人脈",tier:"藍",tag:"supply",fx:{cogs:-0.005},d:"叫得到料、談得到價"},
 {id:"audit",n:"稽核嗅覺",tier:"紫",tag:"audit",fx:{noise:-0.03},d:"聞得出帳有問題"},
 {id:"fix",n:"救火隊",tier:"金",tag:"crisis",fx:{},d:"危機處理專家"},
 {id:"genius",n:"天才",tier:"彩",tag:null,fx:{growth:2},d:"成長速度兩倍"},
 {id:"lucky",n:"幸運星",tier:"紅",tag:null,fx:{},d:"壞事總是繞著走"},
 {id:"iron",n:"鐵人",tier:"藍",tag:null,fx:{shield:1},d:"不受過勞士氣懲罰"},
 {id:"heart",n:"大心臟",tier:"紫",tag:"crisis",fx:{},d:"高壓下不出錯"},
 {id:"joy",n:"開心果",tier:"綠",tag:null,fx:{deptLoyal:0.5},d:"部門士氣緩衝"},
 {id:"vet",n:"老鳥",tier:"藍",tag:null,fx:{mentor:1},d:"帶新人成長加速"},
 {id:"net",n:"人脈王",tier:"金",tag:"nego",fx:{},d:"什麼人都認識"},
 {id:"qc",n:"品質之眼",tier:"紫",tag:"quality",fx:{return_:-0.002},d:"不良品逃不過"},
 {id:"speed",n:"效率狂",tier:"綠",tag:null,fx:{cap:0.02},d:"產出略高於常人"},
 {id:"night",n:"夜貓子",tier:"白",tag:null,fx:{},d:"夜班精神百倍"},
 {id:"coffee",n:"咖啡因驅動",tier:"白",tag:null,fx:{},d:"沒有咖啡活不了"},
 {id:"tidy",n:"整理控",tier:"白",tag:null,fx:{},d:"桌面一塵不染"},
 {id:"mc",n:"尾牙主持",tier:"綠",tag:null,fx:{banquet:1},d:"尾牙效果加倍"},
 {id:"invent",n:"發明家",tier:"金",tag:"npi",fx:{stage:0.03},d:"NPI 導入的王牌"},
 {id:"sqe",n:"客戶關係",tier:"藍",tag:"customer",fx:{},d:"客戶都給面子"},
 {id:"hr",n:"讀人術",tier:"紫",tag:null,fx:{},d:"面試看人特別準"},
 {id:"tax",n:"節稅達人",tier:"藍",tag:"finance",fx:{},d:"合法省下真金白銀"},
 {id:"tough",n:"談判鐵嘴",tier:"紅",tag:"nego",fx:{price:0.02},d:"一毛都不讓"},
 {id:"sense",n:"市場直覺",tier:"金",tag:"market",fx:{},d:"嗅得到風向"},
 {id:"zen",n:"佛系",tier:"白",tag:null,fx:{shield:1},d:"寵辱不驚"},
 {id:"repair",n:"機台耳語者",tier:"紫",tag:"equip",fx:{aging:-0.002},d:"聽得懂機器的呻吟"},
 {id:"scout",n:"獵才雷達",tier:"藍",tag:null,fx:{},d:"招募名單品質提升"},
 {id:"solver",n:"解題高手",tier:"紅",tag:"crisis",fx:{stage:0.02},d:"沒有解不開的題"}
];

const SKILL_TIER_W={白:30,綠:25,藍:20,紫:12,金:8,紅:4,彩:1};

const VOICES={
  money:["股票又住套房了，唉。","這個月卡費繳不出來…","房貸壓得我喘不過氣。","樂透…就差一個號碼。","小孩補習費比我薪水漲得快。","儲蓄險到底該不該解約？","同學會不敢去，怕比薪水。","加密貨幣害我睡不著。"],
  gossip:["聽說業務部那兩個在一起了。","主管的停車位是誰決定的啊？","茶水間的餅乾都是誰吃完的？","三樓影印機又壞了，第八次。","尾牙抽獎絕對有內定。","新來的顏值好高。","隔壁部門聚餐都吃比較好。","老闆的車又換新的了。"],
  career:["我這個位子五年沒動過了。","證照考完就跳槽。","獵頭又加我LINE了。","年後再說，年終先領。","想去讀個在職專班。","履歷放著，隨時可以走。","這產業還有十年榮景嗎？","我當年也是有夢想的。"],
  family:["小孩發燒，今天得早退。","爸媽一直催婚，煩。","另一半嫌我都在加班。","週末又要回婆家。","狗生病了，獸醫比人醫貴。","幼稚園抽籤又沒中。"],
  good:["最近的便當變好吃了。","這季獎金有希望吧？","公司氣氛還不錯啦。","主管人滿好的，會罩我們。","茶水間新咖啡機讚。","案子順的時候上班還蠻有成就感。","今年尾牙聽說會辦大的？","同事都蠻好相處的。","薪水準時發就是好公司。","新來的同事蠻強的。","廁所終於修好了。","下班可以準時走，難得。"],
  lowLoyal:["三年沒調薪了，說得過去嗎…","隔壁廠開的價比這裡多兩成。","履歷我都更新好了。","做再多也沒人看見。","主管只會把功勞往上報。","慣老闆…嘖。","年終有夠薄。","誰要跟我一起去投履歷？","這裡就是個跳板啦。","反正做多做少都一樣。","開會開三小時，事情都沒人做。","我上次提的案根本沒人理。"],
  overwork:["這個月加班第80小時了…","我已經忘記準時下班是什麼感覺。","人力就是不夠，撐個屁。","再叫我假日支援我就走人。","眼睛好花，機台看到吐。","昨天做到11點，今天7點又來。"],
  risk品質:["那批貨…真的能出嗎？","檢驗單是用抄的吧。","反正主管說先出再說。","客訴壓下來而已，遲早爆。","良率報表的數字有夠漂亮，呵。"],
  risk勞檢:["加班費好像又算錯了。","聽說有人去勞工局申訴了。","打卡紀錄被改過，你知道嗎？","休息時間根本是假的。"],
  risk採購:["採購那邊最近很常收到「禮盒」。","那家供應商的料明明比較爛。","報價單的數字…嘿嘿。"],
  risk財務:["帳好像有兩本。","會計師上次臉很臭。","這科目是塞什麼進去？"],
  neutral:["中午吃什麼？","週五了，撐住。","咖啡因不夠了。","這週末要去爬山。","股票又跌了…","小孩最近要考試，頭痛。"]
};

const RUMOR_TEXT={
  品質掩蓋:{t1:"產線私下傳言：有批不良品沒照程序報廢就出貨了。",t2:"大客戶的稽核團隊來電，詢問幾筆異常的良率數字。"},
  勞檢:{t1:"茶水間聽說：有員工向勞工局申訴加班問題。",t2:"勞檢員最近在園區頻繁出沒，同業已有人被開罰。"},
  採購舞弊:{t1:"傳聞某供應商跟我們的採購人員走得很近。",t2:"落選的供應商私下抱怨：「沒送禮根本拿不到單。」"},
  財務造假:{t1:"會計師事務所對幾筆帳目提出了疑問。",t2:"往來銀行突然要求補提供近期的財務資料。"}
};
