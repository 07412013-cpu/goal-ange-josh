/* ---------- actions ---------- */
document.addEventListener('submit',async e=>{const f=e.target;if(!['cf','ef','sf'].includes(f.id))return;e.preventDefault();if(busy)return;const d=Object.fromEntries(new FormData(f));busy=true;
 try{if(f.id==='cf'){const a=+d.amount;if(!(a>0))return toast('Enter an amount above zero.',1);const r={id:uid(),who:tab,amount:a,week:d.week.trim(),note:d.note.trim(),at:now(),upd:null};S.c.push(r);audit('contribution',r.id,'Added',null,r);await commit();toast(`Saved ${P(a)} for ${tab}`)}
 if(f.id==='ef'){const a=+d.amount;if(!(a>0))return toast('Enter an amount above zero.',1);const r={id:uid(),name:d.name.trim(),amount:a,goal:d.goal,reason:d.reason.trim(),by:d.by,note:d.note.trim(),at:now(),upd:null,rec:me};
  const warn=expWarn(r);if(warn){busy=false;return ask(warn,async()=>{busy=true;await saveE(r);busy=false},'Record anyway','danger')}await saveE(r)}
 if(f.id==='sf'){S.cfg.res=Math.min(90,Math.max(0,+d.res));await commit();toast('Saved')}}finally{busy=false}});
async function saveE(r){S.e.push(r);audit('expense',r.id,'Added',null,r);await commit();toast('Expense recorded')}
function expWarn(r,old=0){const t=T(),after=t.rem+old-r.amount,g=r.goal&&S.g.find(x=>x.id===r.goal),gx=g&&G(g);
 if(after<0)return`This expense is ${P(-after)} more than your remaining shared savings. Record it anyway?`;
 if(after<t.res)return`After this, ${P(after)} would remain — below your protected reserve of ${P(t.res)}. Remember: non-emergency spending should be agreed by both of you. Continue?`;
 if(gx&&gx.funds+old-r.amount<gx.reserve&&gx.alloc>0)return`This dips into the protected reserve of "${gx.name}". Continue?`}
function editC(id){const c=S.c.find(x=>x.id===id);form('Edit contribution',[['who','Contributor','select',['Josh','Ange']],['amount','Amount (₱)','number','req'],['week','Week / period','text','req'],['at','Date & time','datetime-local','req'],['note','Note','text']],{...c,at:loc(c.at)},async d=>{if(!(d.amount>0))return toast('Amount must be above zero.',1);const b={...c};Object.assign(c,d,{at:new Date(d.at).toISOString(),upd:now()});audit('contribution',id,'Corrected',b,c);await commit();toast('Correction saved')},1)}
function editE(id){const x=S.e.find(e=>e.id===id);form('Edit expense',[['name','Expense name','text','req'],['amount','Amount (₱)','number','req'],['goal','Related goal','select',[['','— None —'],...act(S.g).map(g=>[g.id,g.name])]],['reason','Reason','text','req'],['by','Paid by','select',['Ange','Josh','Both']],['at','Date & time','datetime-local','req'],['note','Notes','text']],{...x,at:loc(x.at)},async d=>{if(!(d.amount>0))return toast('Amount must be above zero.',1);const b={...x};Object.assign(x,d,{at:new Date(d.at).toISOString(),upd:now()});audit('expense',id,'Corrected',b,x);await commit();toast('Correction saved')},1)}
function del(k,id){const x=S[k].find(r=>r.id===id);ask('Delete this record? You can restore it later in Settings.',async()=>{x.del=now();audit({c:'contribution',e:'expense',g:'goal'}[k],id,'Deleted',x,null);await commit();toast('Deleted — totals updated')},'Delete','danger')}
async function restore(k,id){const x=S[k].find(r=>r.id===id);delete x.del;audit({c:'contribution',e:'expense',g:'goal'}[k],id,'Restored',null,x);await commit();toast('Restored')}
function goalForm(id){const g=id?S.g.find(x=>x.id===id):null,v=g||{status:'Planned',cat:CATS[0],res:S.cfg.res,spend:'',alloc:0};
 form(g?'Edit goal':'New goal',[['name','Goal name','text','req'],['desc','Description','textarea'],['place','Destination / location','text'],['cat','Category','select',CATS],['date','Target date','date'],['spend','Estimated spending budget (₱)','number'],['res','Reserve percentage (%)','number'],['alloc','Current savings allocation (₱)','number'],['status','Status','select',['Planned','Saving','Ready','Completed']]],v,async d=>{
  d.res=+d.res;if(!(d.res>=0&&d.res<90))return toast('Reserve must be 0–89.99%.',1);d.spend=+d.spend||0;d.alloc=+d.alloc||0;
  if(g){const b={...g,items:undefined};const oldB=G(g).planned;Object.assign(g,d);g.upd=now();const n=G(g);audit('goal',g.id,'Updated '+g.name,b,{...d});
   if(n.planned!==oldB)toast(`Target savings is now ${P(n.planned)}`);if(n.breach)toast('Warning: funds are below the protected reserve.',1);if(n.clAct>n.est)toast('Checklist costs exceed the budget.',1)}
  else{const r={id:uid(),...d,items:[],at:now()};S.g.push(r);audit('goal',r.id,'Created '+r.name,null,d)}await commit();toast('Goal saved')},!!g)}
function archive(id){const g=S.g.find(x=>x.id===id);g.arch=!g.arch;audit('goal',id,g.arch?'Archived':'Unarchived',null,null);commit()}
function itemForm(gid,iid){const g=S.g.find(x=>x.id===gid),i=iid&&g.items.find(x=>x.id===iid);form(i?'Edit item':'New checklist item',[['name','Item name','text','req'],['est','Estimated cost (₱)','number'],['act','Actual cost (₱)','number'],['who','Responsible','select',['Both','Ange','Josh']],['due','Due date','date'],['note','Notes','text']],i||{who:'Both'},async d=>{d.est=+d.est||0;d.act=+d.act||0;let it=i;if(i)Object.assign(i,d);else{it={id:uid(),done:false,...d};g.items.push(it)}
  audit('goal',gid,'Checklist: '+d.name,null,d);await commit();const n=G(g);toast(n.clAct>n.est?'Budget warning: actual costs exceed estimates.':'Item saved',n.clAct>n.est)},!!i)}
function tick(gid,iid,v){S.g.find(x=>x.id===gid).items.find(i=>i.id===iid).done=v;commit()}
function delItem(gid,iid){ask('Remove this checklist item?',async()=>{S.g.find(x=>x.id===gid).items.find(i=>i.id===iid).del=now();await commit();toast('Item removed')},'Remove','danger')}
async function agree(n,v){S.agree[n]=v?now():null;S.log.push({id:uid(),at:now(),by:n,ent:'agreement',rid:n,what:v?n+' accepted the agreement':n+' withdrew acceptance',before:'',after:''});await commit();toast(v?`${n} accepted`:'Acceptance removed')}
function dl(name,txt,type){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([txt],{type}));a.download=name;a.click()}
function csv(){const q=v=>'"'+String(v??'').replace(/"/g,'""')+'"',h=hist.t;let rows=[];
 if(h==='Contributions')rows=[['ID','Who','Amount','Week','Date','Note'],...act(S.c).map(c=>[c.id,c.who,c.amount,c.week,c.at,c.note])];
 else if(h==='Expenses')rows=[['ID','Name','Amount','Goal','Reason','Paid by','Date','Note'],...act(S.e).map(e=>[e.id,e.name,e.amount,gname(e.goal),e.reason,e.by,e.at,e.note])];
 else rows=[['When','By','Record','Change','Before','After'],...S.log.map(x=>[x.at,x.by,x.ent,x.what,x.before,x.after])];
 dl(`ange-josh-${h.toLowerCase().replace(/ /g,'-')}.csv`,'\ufeff'+rows.map(r=>r.map(q).join(',')).join('\n'),'text/csv')}
const backup=()=>dl('ange-josh-backup.json',JSON.stringify(S),'application/json');
function restoreB(f){const r=new FileReader;r.onload=()=>{try{const d=JSON.parse(r.result);ask('Replace everything with this backup?',async()=>{S=Object.assign(blank(),d);await commit();toast('Backup restored')},'Replace','danger')}catch(e){toast('That file is not a valid backup.',1)}};r.readAsText(f)}
