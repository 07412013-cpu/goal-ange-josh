/* ---------- ui helpers ---------- */
function toast(m,bad){const t=document.createElement('div');t.className='toast'+(bad?' e':'');t.setAttribute('role','status');t.textContent=m;document.body.append(t);setTimeout(()=>t.remove(),3300)}
function modal(html){$('#ov').innerHTML=`<div class="ov" onclick="if(event.target===this)closeM()"><div class="modal" role="dialog" aria-modal="true">${html}</div></div>`;const f=$('#ov input,#ov select');f&&f.focus()}
const closeM=()=>$('#ov').innerHTML='';
function ask(msg,ok,label='Yes, continue',cls=''){modal(`<h3>${msg}</h3><div class="row" style="margin-top:18px"><button class="ghost" onclick="closeM()">Cancel</button><button class="${cls}" id="yes">${label}</button></div>`);$('#yes').onclick=()=>{closeM();ok()}}
function form(title,fields,v,save,edit){
 const f=fields.map(([k,l,t,o])=>{const val=v[k]??'';let i;
  if(t==='select')i=`<select name="${k}">${o.map(x=>{const[a,b]=Array.isArray(x)?x:[x,x];return`<option value="${esc(a)}"${a==val?' selected':''}>${esc(b)}</option>`}).join('')}</select>`;
  else if(t==='textarea')i=`<textarea name="${k}" rows="2">${esc(val)}</textarea>`;
  else i=`<input name="${k}" type="${t}" value="${esc(val)}" ${t==='number'?'min="0" step="0.01" inputmode="decimal"':''} ${o==='req'?'required':''}>`;
  return`<label>${l}${i}</label>`}).join('');
 modal(`<h3 style="margin-bottom:12px">${title}</h3><form id="mf">${f}<div class="row"><button type="button" class="ghost" onclick="closeM()">Cancel</button><button id="sv">${edit?'Save correction':'Save'}</button></div></form>`);
 $('#mf').onsubmit=async e=>{e.preventDefault();if(busy)return;const d={};
  for(const[k,,t]of fields){const el=$('#mf').elements[k];d[k]=t==='number'?(el.value===''?'':+el.value):el.value}
  const run=async()=>{if(busy)return;busy=true;$('#sv')&&($('#sv').disabled=true);try{await save(d);closeM()}finally{busy=false}};
  const bad=fields.find(([k,,t])=>t==='number'&&d[k]!==''&&(isNaN(d[k])||d[k]<0));if(bad)return toast('Amounts cannot be negative.',1);
  edit?ask('Save these changes to the original record?',run,'Save changes'):run()}}
const bar=(p,over,res)=>`<div class="bar" role="progressbar" aria-valuenow="${Math.round(p)}" aria-valuemin="0" aria-valuemax="100"><i class="${over?'over':''}" style="width:${Math.max(0,Math.min(100,p))}%"></i>${res?`<span class="resv" style="left:${res}%"></span>`:''}</div>`;
const empty=(m,b)=>`<div class="card empty"><p>${m}</p>${b||''}</div>`;
const tbl=(h,rows)=>`<div class="tw"><table><thead><tr>${h.map(x=>`<th>${x}</th>`).join('')}</tr></thead><tbody>${rows.join('')}</tbody></table></div>`;

/* ---------- theme ---------- */
const isDark=()=>(document.documentElement.dataset.theme||(matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light'))==='dark';
function toggleTheme(){const t=isDark()?'light':'dark';localStorage.theme=t;document.documentElement.dataset.theme=t;$('#theme').textContent=t==='dark'?'Light mode':'Dark mode'}

/* ---------- shell ---------- */
const cur=()=>(location.hash.slice(1)||'dash');
function go(){if(!$('#app nav'))shell();render()}
function shell(){$('#app').innerHTML=`<header><div><h1>Ange &amp; Josh</h1><small>${mode==='server'?'Synced to your server':'Saved on this device'} · monitoring only, not a wallet</small></div><div class="tools"><button class="ghost sm" id="theme" onclick="toggleTheme()">${isDark()?'Light mode':'Dark mode'}</button><div class="me" role="group" aria-label="Who is using the app">${['Ange','Josh'].map(n=>`<button data-me="${n}" class="${n===me?'on':''}">${n}</button>`).join('')}</div></div></header><div id="pg"></div><nav>${PAGES.map(([k,l])=>`<a href="#${k}" data-p="${k}">${l}</a>`).join('')}</nav>`;
 document.querySelectorAll('[data-me]').forEach(b=>b.onclick=()=>{me=b.dataset.me;localStorage.me=me;document.querySelectorAll('[data-me]').forEach(x=>x.classList.toggle('on',x===b));toast('Recording as '+me)})}
addEventListener('hashchange',()=>$('#pg')&&render());
function render(){if(!$('#pg'))return;const p=cur(),fn=V[p]||V.dash;document.querySelectorAll('nav a').forEach(a=>a.classList.toggle('on',a.dataset.p===p));
 $('#pg').innerHTML=`<main>${fn()}</main>`;const a=document.querySelector('nav a.on');a&&a.scrollIntoView({inline:'center',block:'nearest'})}
