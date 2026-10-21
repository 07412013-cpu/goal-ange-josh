const $=s=>document.querySelector(s),uid=()=>Math.random().toString(36).slice(2,8)+Date.now().toString(36),now=()=>new Date().toISOString();
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const P=n=>'₱'+(+n||0).toLocaleString('en-PH',{minimumFractionDigits:0,maximumFractionDigits:2});
const dt=s=>s?new Date(s).toLocaleString('en-PH',{dateStyle:'medium',timeStyle:'short'}):'—';
const loc=s=>{const d=new Date(s);d.setMinutes(d.getMinutes()-d.getTimezoneOffset());return d.toISOString().slice(0,16)};
const blank=()=>({c:[],e:[],g:[],log:[],agree:{Ange:null,Josh:null},cfg:{res:33.33}});
let S=blank(),rev=0,mode='local',pass=sessionStorage.pw||'',me=localStorage.me||'Ange',tab='Josh',busy=false,hist={t:'Contributions',who:'',goal:'',from:'',to:''};
const CATS=['Travel and Adventures','Resorts and Beaches','Condo or Staycation','Dates and Restaurants','Gifts','Experiences','Future Plans','Other Goals'];
const PAGES=[['dash','Home'],['save','Hulog'],['goals','Goals'],['list','Checklists'],['exp','Expenses'],['hist','History'],['terms','Agreement'],['set','Settings']];
