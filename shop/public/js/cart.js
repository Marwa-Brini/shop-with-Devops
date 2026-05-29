async function loadCart() {
  const res = await fetch('/api/cart');
  const { cart, total } = await res.json();
  const container = document.getElementById('cart-content');

  if (!cart.length) {
    container.innerHTML = `
      <div class="empty-state">
        <h2>Your cart is empty</h2>
        <p style="margin-bottom:2rem">Looks like you haven't added anything yet.</p>
        <a href="/" class="btn-primary">Start Shopping</a>
      </div>`;
    return;
  }

  container.innerHTML = `
    ${cart.map(item => `
      <div class="cart-item" id="item-${item.id}">
        <img src="${item.image}" alt="${item.name}" />
        <div class="cart-item-info">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-price">$${item.price.toFixed(2)} each</div>
        </div>
        <div class="cart-item-controls">
          <button class="qty-btn" onclick="changeQty(${item.id}, ${item.qty - 1})">−</button>
          <span class="qty-display">${item.qty}</span>
          <button class="qty-btn" onclick="changeQty(${item.id}, ${item.qty + 1})">+</button>
          <button class="remove-btn" onclick="removeItem(${item.id})">Remove</button>
        </div>
      </div>
    `).join('')}

    <div class="cart-summary">
      <div class="cart-total">Total: <span>$${total}</span></div>
      <div style="display:flex; gap:1rem; flex-wrap:wrap;">
        <button class="btn-secondary" onclick="clearCart()">Clear Cart</button>
        <a href="/checkout" class="btn-primary">Checkout →</a>
      </div>
    </div>
  `;
}

async function changeQty(id, qty) {
  await fetch('/api/cart/update', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ productId: id, qty })
  });
  loadCart();
  updateCartCount();
}

async function removeItem(id) {
  await fetch(`/api/cart/remove/${id}`, { method: 'DELETE' });
  loadCart();
  updateCartCount();
}

async function clearCart() {
  await fetch('/api/cart/clear', { method: 'DELETE' });
  loadCart();
  updateCartCount();
}

loadCart();
