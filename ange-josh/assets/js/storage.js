/* ---------- storage: PHP+SQLite when available, otherwise this device ---------- */
async function api(a,b){const r=await fetch('api/api.php?a='+a,{method:'POST',headers:{'X-Pass':pass,'Content-Type':'application/json'},body:JSON.stringify(b||{})});if(!r.ok)throw r.status;return r.json()}
async function boot(){try{const r=await api('load');mode='server';rev=r.rev;if(r.data)S=Object.assign(blank(),r.data);sessionStorage.pw=pass;go()}
 catch(e){if(e===401)return loginView(); mode='local';try{S=Object.assign(blank(),JSON.parse(localStorage.ajrg||'null')||{})}catch(_){}go()}}
async function commit(){if(mode==='server'){try{const r=await api('save',{rev,data:S});rev=r.rev}catch(e){toast(e===409?'Someone else saved first — reloading latest.':'Could not save to server.',1);return boot()}}else localStorage.ajrg=JSON.stringify(S);render()}
function loginView(){$('#app').innerHTML=`<form class="card login" id="lf"><h1 style="font-size:1.6rem">Ange &amp; Josh</h1><p class="k" style="margin:8px 0 16px">Enter your shared password.<br>The first password you enter becomes your login.</p><label>Password<input type="password" id="pw" minlength="4" required autocomplete="current-password"></label><button style="width:100%">Open</button></form>`;
 $('#lf').onsubmit=e=>{e.preventDefault();pass=$('#pw').value;boot()}}
