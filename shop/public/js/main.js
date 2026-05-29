// ── Shared utilities ──────────────────────────────────────

function showToast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2500);
}

async function updateCartCount() {
  try {
    const res = await fetch('/api/cart');
    const { cart } = await res.json();
    const count = cart.reduce((s, i) => s + i.qty, 0);
    const el = document.getElementById('cart-count');
    if (el) el.textContent = count;
  } catch {}
}

async function addToCart(productId, btn) {
  if (btn) { btn.textContent = '✓ Added'; btn.classList.add('added'); }
  await fetch('/api/cart/add', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ productId, qty: 1 })
  });
  showToast('Item added to cart!');
  updateCartCount();
  setTimeout(() => {
    if (btn) { btn.textContent = 'Add to Cart'; btn.classList.remove('added'); }
  }, 1500);
}

// ── Products Page ─────────────────────────────────────────

async function loadProducts(search = '', category = '') {
  const grid = document.getElementById('products-grid');
  if (!grid) return;

  let url = '/api/products?';
  if (search) url += `search=${encodeURIComponent(search)}&`;
  if (category) url += `category=${encodeURIComponent(category)}`;

  const res = await fetch(url);
  const products = await res.json();

  if (!products.length) {
    grid.innerHTML = '<p style="color:var(--text-dim)">No products found.</p>';
    return;
  }

  grid.innerHTML = products.map(p => `
    <div class="product-card">
      <img src="${p.image}" alt="${p.name}" loading="lazy" />
      <div class="product-info">
        <span class="product-category">${p.category}</span>
        <h3 class="product-name">${p.name}</h3>
        <p class="product-desc">${p.description}</p>
        <span class="product-price">$${p.price.toFixed(2)}</span>
      </div>
      <button class="add-btn" onclick="addToCart(${p.id}, this)">Add to Cart</button>
    </div>
  `).join('');
}

// Init
updateCartCount();

const searchEl = document.getElementById('search');
const catEl = document.getElementById('category-filter');

if (searchEl) {
  loadProducts();
  let timer;
  searchEl.addEventListener('input', () => {
    clearTimeout(timer);
    timer = setTimeout(() => loadProducts(searchEl.value, catEl.value), 300);
  });
  catEl.addEventListener('change', () => loadProducts(searchEl.value, catEl.value));
}
