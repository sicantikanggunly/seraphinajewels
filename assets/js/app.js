// Seraphina Jewels - App Logic
const $ = (q, ctx=document) => ctx.querySelector(q);
const $$ = (q, ctx=document) => Array.from(ctx.querySelectorAll(q));

// Sample products (max 8 for slider)
const products = [
  { id: 1, name: "Cincin Aurora", price: 1299000, img: "assets/svg/ring.svg", desc:"Cincin emas elegan berkilau." },
  { id: 2, name: "Kalung Celestia", price: 2199000, img: "assets/svg/necklace.svg", desc:"Kalung modern dengan liontin unik." },
  { id: 3, name: "Anting Starlight", price: 999000, img: "assets/svg/earrings.svg", desc:"Anting minimalis berkilau lembut." },
  { id: 4, name: "Gelang Solace", price: 1599000, img: "assets/svg/bracelet.svg", desc:"Gelang berdesain timeless." },
  { id: 5, name: "Bros Seraphic", price: 749000, img: "assets/svg/brooch.svg", desc:"Bros klasik sentuhan modern." },
  { id: 6, name: "Tiara Radiant", price: 3299000, img: "assets/svg/tiara.svg", desc:"Tiara anggun untuk acara spesial." },
  { id: 7, name: "Pendant Lumiere", price: 1199000, img: "assets/svg/pendant.svg", desc:"Liontin geometrik chic." },
  { id: 8, name: "Cuff Opulence", price: 1899000, img: "assets/svg/cuff.svg", desc:"Cuff statement yang mewah." },
];

// Testimonials (seed)
const seedTestimonials = [
  { name:"Nabila", rating:5, message:"Kualitasnya premium, pengiriman cepat!" },
  { name:"Raka", rating:4, message:"Desain elegan, sangat cocok untuk hadiah." },
  { name:"Intan", rating:5, message:"Pelayanan ramah, produk sesuai ekspektasi!" }
];

// Local storage keys
const LS_CART = "sj_cart";
const LS_TESTI = "sj_testimonials";
const LS_FEEDBACK = "sj_feedbacks";

// Utilities
const formatIDR = (num) => new Intl.NumberFormat("id-ID", { style:"currency", currency:"IDR" }).format(num);

function loadCart(){
  try { return JSON.parse(localStorage.getItem(LS_CART)) || []; } catch { return []; }
}
function saveCart(items){ localStorage.setItem(LS_CART, JSON.stringify(items)); }

function renderProducts(){
  const slider = $("#productSlider");
  slider.innerHTML = "";
  products.slice(0,8).forEach(p => {
    const card = document.createElement("article");
    card.className = "card product";
    card.innerHTML = `
      <div class="product-visual">
        <img src="${p.img}" alt="${p.name}" />
      </div>
      <div>
        <h3>${p.name}</h3>
        <p class="muted">${p.desc}</p>
      </div>
      <div class="actions">
        <span class="price">${formatIDR(p.price)}</span>
        <button class="secondary" data-id="${p.id}">Tambah</button>
      </div>
    `;
    slider.appendChild(card);
  });

  // Add to cart bindings
  $$("#productSlider .secondary").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = Number(btn.dataset.id);
      addToCart(id);
    });
  });
}

// Slider controls (scroll snapping)
function setupSlider(){
  const slider = $("#productSlider");
  $("#prevBtn").addEventListener("click", () => slider.scrollBy({ left:-slider.clientWidth*0.9, behavior:"smooth" }));
  $("#nextBtn").addEventListener("click", () => slider.scrollBy({ left: slider.clientWidth*0.9, behavior:"smooth" }));
}

// Cart
function addToCart(id){
  const item = products.find(p=>p.id===id);
  if(!item) return;
  const cart = loadCart();
  const found = cart.find(ci=>ci.id===id);
  if(found){ found.qty += 1; } else { cart.push({ ...item, qty:1 }); }
  saveCart(cart);
  renderCart();
}

function removeFromCart(id){
  let cart = loadCart().filter(ci=>ci.id!==id);
  saveCart(cart);
  renderCart();
}

function changeQty(id, delta){
  const cart = loadCart();
  const found = cart.find(ci=>ci.id===id);
  if(found){
    found.qty += delta;
    if(found.qty <= 0){ return removeFromCart(id); }
    saveCart(cart);
    renderCart();
  }
}

function renderCart(){
  const cart = loadCart();
  const cartItems = $("#cartItems");
  const count = cart.reduce((n, it)=>n+it.qty, 0);
  $("#cartCount").textContent = count;

  if(cart.length===0){
    cartItems.innerHTML = `<p class="muted">Keranjang kosong.</p>`;
  } else {
    cartItems.innerHTML = cart.map(it => `
      <div class="cart-item">
        <img src="${it.img}" alt="${it.name}">
        <div>
          <strong>${it.name}</strong>
          <div class="muted small">${formatIDR(it.price)} &times; ${it.qty}</div>
        </div>
        <div>
          <button class="secondary" aria-label="Kurangi" onclick="changeQty(${it.id}, -1)">-</button>
          <button class="secondary" aria-label="Tambah" onclick="changeQty(${it.id}, 1)">+</button>
          <button class="secondary" aria-label="Hapus" onclick="removeFromCart(${it.id})">&times;</button>
        </div>
      </div>
    `).join("");
  }

  const total = cart.reduce((sum, it)=> sum + it.price*it.qty, 0);
  $("#cartTotal").textContent = formatIDR(total);
}

// Checkout
function handleCheckout(){
  const cart = loadCart();
  if(cart.length===0){ alert("Keranjang masih kosong."); return; }
  const total = cart.reduce((sum, it)=> sum + it.price*it.qty, 0);
  const ringkasan = cart.map(it => `${it.name} x${it.qty} = ${formatIDR(it.qty*it.price)}`).join("\n");
  alert("Checkout simulasi:\n\n" + ringkasan + "\n\nTotal: " + formatIDR(total) + "\n\nTerima kasih telah berbelanja di Seraphina Jewels!");
  // Reset cart (optional)
  localStorage.removeItem(LS_CART);
  renderCart();
  toggleCart(false);
}

// Testimonials
function loadTestimonials(){
  try { return JSON.parse(localStorage.getItem(LS_TESTI)) || seedTestimonials; } catch { return seedTestimonials; }
}
function saveTestimonials(list){ localStorage.setItem(LS_TESTI, JSON.stringify(list)); }

function renderTestimonials(){
  const list = loadTestimonials();
  const el = $("#testimonialList");
  el.innerHTML = list.map(t => `
    <div class="testimonial">
      <strong>${t.name}</strong>
      <div class="stars">${"★".repeat(t.rating)}${"☆".repeat(5-t.rating)}</div>
      <p>${t.message}</p>
    </div>
  `).join("");
}

function setupTestimonialForm(){
  $("#testimonialForm").addEventListener("submit", e => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const name = fd.get("name").toString().trim();
    const rating = Number(fd.get("rating"));
    const message = fd.get("message").toString().trim();
    if(!name || !message) return;
    const list = loadTestimonials();
    list.unshift({ name, rating, message });
    saveTestimonials(list);
    e.target.reset();
    renderTestimonials();
  });
}

// Kritik & Saran
function setupFeedbackForm(){
  $("#feedbackForm").addEventListener("submit", e => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const entry = {
      name: fd.get("name")?.toString().trim() || "Anonim",
      email: fd.get("email")?.toString().trim() || "-",
      message: fd.get("message").toString().trim(),
      at: new Date().toISOString()
    };
    const list = JSON.parse(localStorage.getItem(LS_FEEDBACK) || "[]");
    list.unshift(entry);
    localStorage.setItem(LS_FEEDBACK, JSON.stringify(list));
    alert("Terima kasih! Masukan Anda kami simpan secara lokal di peramban Anda.");
    e.target.reset();
  });
}

// Cart panel open/close
function toggleCart(open){
  const panel = $("#cartPanel");
  const overlay = $("#overlay");
  panel.setAttribute("aria-hidden", open ? "false" : "true");
  overlay.style.display = open ? "block" : "none";
  document.body.style.overflow = open ? "hidden" : "";
}

function setupCartPanel(){
  $("#openCart").addEventListener("click", ()=> toggleCart(true));
  $("#closeCart").addEventListener("click", ()=> toggleCart(false));
  $("#overlay").addEventListener("click", ()=> toggleCart(false));
  $("#checkoutBtn").addEventListener("click", handleCheckout);
}

// Boot
window.addEventListener("DOMContentLoaded", () => {
  $("#year").textContent = new Date().getFullYear();
  renderProducts();
  setupSlider();
  renderCart();
  renderTestimonials();
  setupTestimonialForm();
  setupFeedbackForm();
  setupCartPanel();
});
