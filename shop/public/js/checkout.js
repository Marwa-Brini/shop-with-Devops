async function loadSummary() {
  const res = await fetch('/api/cart');
  const { cart, total } = await res.json();
  const el = document.getElementById('checkout-summary');

  if (!cart.length) {
    document.getElementById('checkout-form-section').innerHTML = `
      <div class="empty-state">
        <h2>Your cart is empty</h2>
        <a href="/" class="btn-primary" style="margin-top:1rem">Go Shopping</a>
      </div>`;
    return;
  }

  el.innerHTML = `
    <strong>${cart.length} item(s)</strong> — 
    Total: <span style="color:var(--accent); font-size:1.2rem;">$${total}</span>
  `;
}

async function placeOrder() {
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const address = document.getElementById('address').value.trim();
  const errEl = document.getElementById('checkout-error');
  const btn = document.querySelector('.btn-primary');

  errEl.style.display = 'none';

  if (!name || !email || !address) {
    errEl.textContent = 'Please fill in all fields.';
    errEl.style.display = 'block';
    return;
  }

  btn.textContent = 'Placing order...';
  btn.disabled = true;

  const res = await fetch('/api/cart/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, address })
  });

  const data = await res.json();

  if (!res.ok) {
    errEl.textContent = data.error || 'Something went wrong.';
    errEl.style.display = 'block';
    btn.textContent = 'Place Order';
    btn.disabled = false;
    return;
  }

  document.getElementById('checkout-form-section').style.display = 'none';
  document.getElementById('order-result').style.display = 'block';
  document.getElementById('order-result').innerHTML = `
    <div class="order-success">
      <h2>✓ Order Placed!</h2>
      <p>Thank you, <strong>${data.order.name}</strong>! We'll send a confirmation to <em>${data.order.email}</em>.</p>
      <p class="order-id">Order ID: ${data.order.orderId}</p>
      <p style="color:var(--text-dim); margin-top:0.5rem;">Total paid: $${data.order.total}</p>
      <a href="/" class="btn-primary" style="margin-top:2rem;">Continue Shopping</a>
    </div>
  `;
  updateCartCount();
}

loadSummary();
