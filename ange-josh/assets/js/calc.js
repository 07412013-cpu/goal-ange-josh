/* ---------- calculations: always from active saved records ---------- */
const act=a=>a.filter(x=>!x.del),sum=a=>a.reduce((t,x)=>t+(+x.amount||0),0);
function T(){const c=act(S.c),e=act(S.e),j=sum(c.filter(x=>x.who==='Josh')),a=sum(c.filter(x=>x.who==='Ange')),sp=sum(e);
 const gs=act(S.g).filter(g=>!g.arch).map(G);return{j,a,tot:j+a,sp,rem:j+a-sp,gs,res:gs.filter(g=>g.status!=='Completed').reduce((t,g)=>t+g.reserve,0),need:gs.filter(g=>g.status!=='Completed').reduce((t,g)=>t+g.planned,0)}}
function G(g){const it=act(g.items||[]),est=it.length?it.reduce((t,i)=>t+(+i.est||0),0):+g.spend||0,r=+g.res,planned=est/(1-r/100),reserve=planned-est,
 actual=sum(act(S.e).filter(x=>x.goal===g.id)),clAct=it.reduce((t,i)=>t+(+i.act||0),0),funds=(+g.alloc||0)-actual;
 return{...g,it,est,planned,reserve,actual,clAct,funds,used:est?actual/est*100:0,within:actual<=est,breach:(+g.alloc>0)&&funds<reserve,prog:planned?Math.min(100,(+g.alloc||0)/planned*100):0}}
const gname=id=>(S.g.find(g=>g.id===id)||{name:'—'}).name;
function audit(ent,id,what,before,after){S.log.push({id:uid(),at:now(),by:me,ent,rid:id,what,before:before?JSON.stringify(before):'',after:after?JSON.stringify(after):''})}
