const menuData=[
[1,"Nasi Ayam Sambal","Makanan",20000,"Nasi hangat, ayam gurih, sambal pilihan.","https://i.gojekapi.com/darkroom/gofood-indonesia/v2/images/uploads/b31f446f-d365-4052-88f6-28e557107070_Go-Biz_20260411_222817.jpeg"],
[2,"Rice Bowl Teriyaki","Makanan",18000,"Ayam teriyaki dengan saus manis gurih.","https://snapcalorie-webflow-website.s3.us-east-2.amazonaws.com/media/food_pics_v2/medium/chicken_teriyaki_don.jpg"],
[3,"Es Kopi Susu","Minuman",10000,"Kopi creamy untuk teman mengerjakan tugas.","https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=800&q=80"],
[4,"Pisang Coklat","Camilan",8000,"Camilan renyah dengan cokelat lumer.","https://nutrinusa.id/images/makanan/pisang-coklat.webp"],
[5,"Fresh Mango Juice","Minuman",12000,"Jus mangga segar dan menyegarkan.","https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&w=800&q=80"],
[6,"Mie Pedas Level","Makanan",13000,"Mie berbumbu dengan pilihan level pedas.","https://assets.ladiestory.id/gallery/16460278901448338666-mie-pedas.jpg"]
];
const money=n=>"Rp"+Number(n).toLocaleString("id-ID");
let activeCategory="Semua",cart={};
try{cart=JSON.parse(localStorage.getItem("kantinkuCart")||"{}")}catch(e){cart={}}
function renderMenu(){
 const cards=document.getElementById("cards"); if(!cards)return;
 const query=(document.getElementById("search")?.value||"").toLowerCase();
 const filtered=menuData.filter(p=>(activeCategory==="Semua"||p[2]===activeCategory)&&p[1].toLowerCase().includes(query));
 cards.innerHTML=filtered.length?filtered.map(p=>`<article class="card"><a href="detail.html?id=${p[0]}"><img src="${p[5]}" alt="${p[1]}"></a><div class="card-body"><span class="tag">${p[2]}</span><h3><a href="detail.html?id=${p[0]}">${p[1]}</a></h3><p>${p[4]}</p><div class="card-foot"><span class="price">${money(p[3])}</span><div><a href="detail.html?id=${p[0]}" style="font-size:11px;font-weight:700;color:var(--green)">Detail ↗</a> <button class="add" onclick="addToCart(${p[0]})">+</button></div></div></div></article>`).join(""):"<p>Menu tidak ditemukan. Coba kata kunci lain.</p>";
}
function saveCart(){localStorage.setItem("kantinkuCart",JSON.stringify(cart))}
function addToCart(id){cart[id]=(cart[id]||0)+1;saveCart();updateCart()}
function changeQty(id,n){cart[id]=(cart[id]||0)+n;if(cart[id]<=0)delete cart[id];saveCart();updateCart()}
function updateCart(){
 const count=document.getElementById("count");if(!count)return;
 count.textContent=Object.values(cart).reduce((a,b)=>a+b,0);
 const chosen=menuData.filter(p=>cart[p[0]]);
 document.getElementById("items").innerHTML=chosen.length?chosen.map(p=>`<div class="rowitem"><span>${p[1]}<br><small>${money(p[3])}</small></span><span class="qty"><button onclick="changeQty(${p[0]},-1)">−</button> ${cart[p[0]]} <button onclick="changeQty(${p[0]},1)">+</button></span></div>`).join(""):"<p style='color:#788178;text-align:center;padding:20px'>Keranjang masih kosong.</p>";
 document.getElementById("total").textContent=money(chosen.reduce((s,p)=>s+p[3]*cart[p[0]],0));
}
document.addEventListener("DOMContentLoaded",()=>{
 renderMenu();updateCart();
 document.getElementById("filters")?.addEventListener("click",e=>{const b=e.target.closest("[data-cat]");if(!b)return;activeCategory=b.dataset.cat;document.querySelectorAll(".filter").forEach(x=>x.classList.toggle("active",x===b));renderMenu()});
 document.getElementById("search")?.addEventListener("input",renderMenu);
 document.getElementById("openCart")?.addEventListener("click",()=>{updateCart();document.getElementById("overlay").classList.add("show")});
 document.getElementById("close")?.addEventListener("click",()=>document.getElementById("overlay").classList.remove("show"));
 document.getElementById("overlay")?.addEventListener("click",e=>{if(e.target.id==="overlay")e.target.classList.remove("show")});
 document.getElementById("checkout")?.addEventListener("click",()=>{const chosen=menuData.filter(p=>cart[p[0]]);if(!chosen.length){alert("Keranjang masih kosong. Pilih menu terlebih dahulu.");return}const summary=chosen.map(p=>`${p[1]} x${cart[p[0]]} = ${money(p[3]*cart[p[0]])}`).join("\n");alert(`Ringkasan pesanan:\n${summary}\nTotal: ${money(chosen.reduce((a,p)=>a+p[3]*cart[p[0]],0))}\n\nSilakan konfirmasi ke tenant kantin.`)});
 const profileForm=document.getElementById("profileForm");
 profileForm?.addEventListener("submit",e=>{e.preventDefault();const data=Object.fromEntries(new FormData(profileForm).entries());localStorage.setItem("kantinkuProfile",JSON.stringify(data));location.href="profil-tampil.html"});
 const result=document.getElementById("profileResult");
 if(result){const p=JSON.parse(localStorage.getItem("kantinkuProfile")||"{}");result.innerHTML=Object.entries({"Nama lengkap":p.nama,"NIM":p.nim,"Program studi":p.prodi,"Email":p.email,"Nomor WhatsApp":p.telepon,"Makanan favorit":p.favorit,"Tentang saya":p.tentang}).map(([k,v])=>`<div><b>${k}</b></div><div>${v||"-"}</div>`).join("")}
 const slides=[...document.querySelectorAll(".slide")];if(slides.length){let current=0;const show=n=>{current=(n+slides.length)%slides.length;slides.forEach((s,i)=>s.classList.toggle("active",i===current));const label=document.getElementById("slideNumber");if(label)label.textContent=`${current+1} / ${slides.length}`};document.getElementById("prevSlide")?.addEventListener("click",()=>show(current-1));document.getElementById("nextSlide")?.addEventListener("click",()=>show(current+1));show(0)}
});