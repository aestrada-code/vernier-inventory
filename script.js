let equipment=[];
const grid=document.getElementById('grid'), search=document.getElementById('search'), category=document.getElementById('category');
const modal=document.getElementById('modal'), modalContent=document.getElementById('modalContent');

fetch('equipment.json').then(r=>r.json()).then(data=>{
  equipment=data;
  const cats=[...new Set(data.map(x=>x.category).filter(Boolean))].sort();
  cats.forEach(c=>category.insertAdjacentHTML('beforeend',`<option value="${esc(c)}">${esc(c)}</option>`));
  document.getElementById('typeCount').textContent=data.length;
  document.getElementById('unitCount').textContent=data.reduce((s,x)=>s+(Number(x.stock)||0),0);
  render();
});

function render(){
  const q=search.value.toLowerCase().trim(), cat=category.value;
  const filtered=equipment.filter(x=>{
    const hay=[x.name,x.keyword,x.category,x.subcategory,x.location,x.description].join(' ').toLowerCase();
    return (!q||hay.includes(q))&&(cat==='all'||x.category===cat);
  });
  document.getElementById('visibleCount').textContent=filtered.length;
  document.getElementById('empty').classList.toggle('hidden',filtered.length>0);
  grid.innerHTML=filtered.map((x,i)=>card(x,i)).join('');
}
function card(x,i){
  const image=x.image?`<img src="${esc(x.image)}" alt="${esc(x.name)}" loading="lazy">`:`<div class="image-placeholder">Official Vernier image<br>can be added here</div>`;
  return `<article class="card">
    <div class="card-top"><span class="badge">${esc(x.category)}</span><h2>${esc(x.name)}</h2></div>
    <div class="card-body"><div class="device-image">${image}</div><div class="details">
      <div class="stock"><span class="dot"></span> In stock: ${x.stock}</div>
      <div><b>Subcategory:</b> ${esc(x.subcategory||'—')}</div>
      <div><b>Keyword:</b> ${esc(x.keyword||'—')}</div>
      <div><b>Location:</b> ${esc(x.location||'—')}</div>
      <p>${esc(x.description)}</p>
    </div></div>
    <div class="actions">${link(x.product,'Product')} ${link(x.manual,'Manual')} ${link(x.video,'Video')}<button class="btn primary" onclick="openDetails(${iFor(x)})">View Details</button></div>
  </article>`;
}
function iFor(x){return equipment.indexOf(x)}
function link(url,label){return url?`<a class="btn" href="${esc(url)}" target="_blank" rel="noopener">${label}</a>`:''}
function openDetails(i){
  const x=equipment[i]; if(!x)return;
  const image=x.image?`<img src="${esc(x.image)}" alt="${esc(x.name)}">`:`<div class="image-placeholder">Official Vernier image<br>can be added here</div>`;
  modalContent.innerHTML=`<div class="modal-grid"><div class="modal-image">${image}</div><div>
    <span class="badge">${esc(x.category)}</span><h2>${esc(x.name)}</h2>
    <p>${esc(x.description)}</p>
    <p><b>In stock:</b> ${x.stock}<br><b>Subcategory:</b> ${esc(x.subcategory||'—')}<br><b>Keyword:</b> ${esc(x.keyword||'—')}<br><b>Location:</b> ${esc(x.location||'—')}</p>
    <div class="link-row">${link(x.product,'Product Page')}${link(x.manual,'User Manual')}${link(x.video,'Video')}</div>
  </div></div>`;
  modal.classList.remove('hidden'); modal.setAttribute('aria-hidden','false');
}
function closeModal(){modal.classList.add('hidden');modal.setAttribute('aria-hidden','true')}
modal.addEventListener('click',e=>{if(e.target.dataset.close!==undefined)closeModal()});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal()});
search.addEventListener('input',render); category.addEventListener('change',render);
function esc(v=''){return String(v).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]))}
