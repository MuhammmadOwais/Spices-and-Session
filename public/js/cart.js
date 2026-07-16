/* ==========================================================================
   Artisan Spice Co. - Client-Side Cart Logic
   Handles: LocalStorage cart CRUD, Side Drawer UI & Dedicated Cart Page rendering
   ========================================================================== */

const CART_KEY = 'artisan_cart';

class CartManager {
  constructor() {
    this.cart = this.loadCart();
  }

  // Load cart from localStorage
  loadCart() {
    const data = localStorage.getItem(CART_KEY);
    return data ? JSON.parse(data) : [];
  }

  // Save cart to localStorage and update badge/UI
  saveCart() {
    localStorage.setItem(CART_KEY, JSON.stringify(this.cart));
    this.updateCartBadge();
    this.renderCartSidebar();
    this.renderCartPage();
    this.renderCheckoutReview();
  }

  getCart() {
    return this.cart;
  }

  // Add an item to the cart
  addToCart(id, name, price, image, size = '2 oz Jar', quantity = 1) {
    price = parseFloat(price);
    quantity = parseInt(quantity);

    // Find index of existing matching product and size
    const existingIndex = this.cart.findIndex(item => item.id === id && item.size === size);

    if (existingIndex > -1) {
      this.cart[existingIndex].quantity += quantity;
    } else {
      this.cart.push({ id, name, price, image, size, quantity });
    }

    this.saveCart();

    // Auto-open sidebar drawer
    this.openSidebar();
  }

  // Change quantity of an item
  updateQuantity(id, size, quantity) {
    quantity = parseInt(quantity);
    if (quantity <= 0) {
      this.removeFromCart(id, size);
      return;
    }

    const index = this.cart.findIndex(item => item.id === id && item.size === size);
    if (index > -1) {
      this.cart[index].quantity = quantity;
      this.saveCart();
    }
  }

  // Remove item from cart
  removeFromCart(id, size) {
    this.cart = this.cart.filter(item => !(item.id === id && item.size === size));
    this.saveCart();
  }

  // Empty the cart
  clearCart() {
    this.cart = [];
    this.saveCart();
  }

  // Calculate items count
  getCartCount() {
    return this.cart.reduce((total, item) => total + item.quantity, 0);
  }

  // Calculate total price
  getCartTotal() {
    return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  // Open sidebar drawer
  openSidebar() {
    const sidebar = document.getElementById('cart-sidebar');
    const overlay = document.getElementById('site-overlay');
    if (sidebar && overlay) {
      sidebar.classList.add('active');
      overlay.classList.add('active');
    }
  }

  // Close sidebar drawer
  closeSidebar() {
    const sidebar = document.getElementById('cart-sidebar');
    const overlay = document.getElementById('site-overlay');
    if (sidebar && overlay) {
      sidebar.classList.remove('active');
      overlay.classList.remove('active');
    }
  }

  // Update header cart badge counts
  updateCartBadge() {
    const count = this.getCartCount();
    const badges = document.querySelectorAll('#cart-badge-count');
    badges.forEach(badge => {
      badge.textContent = count;
      if (count > 0) {
        badge.style.display = 'flex';
      } else {
        badge.style.display = 'none';
      }
    });
  }

  // Render sidebar drawer contents
  renderCartSidebar() {
    const itemsContainer = document.getElementById('cart-drawer-items');
    const footerContainer = document.getElementById('cart-drawer-footer');
    if (!itemsContainer) return;

    if (this.cart.length === 0) {
      itemsContainer.innerHTML = `
        <div class="empty-cart-message">
          <i class="fa-solid fa-mortar-pestle"></i>
          <p>Your culinary toolkit is empty.</p>
          <a href="/products" class="btn btn-primary">Browse Spices</a>
        </div>
      `;
      if (footerContainer) footerContainer.style.display = 'none';
      return;
    }

    if (footerContainer) footerContainer.style.display = 'block';

    let html = '';
    this.cart.forEach(item => {
      html += `
        <div class="cart-item">
          <div class="cart-item-img">
            <img src="${item.image}" alt="${item.name}">
          </div>
          <div class="cart-item-details">
            <h4>${item.name}</h4>
            <p class="cart-item-size">${item.size}</p>
            <div class="cart-item-price">$${item.price.toFixed(2)}</div>
            
            <div class="cart-qty-controls">
              <button class="cart-qty-btn" onclick="cartManager.updateQuantity('${item.id}', '${item.size}', ${item.quantity - 1})"><i class="fa-solid fa-minus"></i></button>
              <span class="cart-qty-val">${item.quantity}</span>
              <button class="cart-qty-btn" onclick="cartManager.updateQuantity('${item.id}', '${item.size}', ${item.quantity + 1})"><i class="fa-solid fa-plus"></i></button>
            </div>
          </div>
          <button class="cart-item-remove" onclick="cartManager.removeFromCart('${item.id}', '${item.size}')" aria-label="Remove item">
            <i class="fa-regular fa-trash-can"></i>
          </button>
        </div>
      `;
    });
    itemsContainer.innerHTML = html;

    const subtotalDisplay = document.getElementById('cart-subtotal-amount');
    if (subtotalDisplay) {
      subtotalDisplay.textContent = `$${this.getCartTotal().toFixed(2)}`;
    }
  }

  // Render full cart page contents
  renderCartPage() {
    const pageContainer = document.getElementById('cart-page-items-container');
    const summaryContainer = document.getElementById('cart-page-summary-container');
    if (!pageContainer) return;

    if (this.cart.length === 0) {
      pageContainer.innerHTML = `
        <div class="empty-cart-state text-center">
          <i class="fa-solid fa-mortar-pestle"></i>
          <h3>Your cart is empty</h3>
          <p>You haven't added any spices to your cart yet. Let's find some flavor!</p>
          <a href="/products" class="btn btn-primary">Start Shopping</a>
        </div>
      `;
      if (summaryContainer) summaryContainer.style.display = 'none';
      return;
    }

    if (summaryContainer) summaryContainer.style.display = 'block';

    let html = `
      <div class="cart-table-header">
        <span>Product Details</span>
        <span>Unit Price</span>
        <span>Quantity</span>
        <span class="text-right">Total</span>
      </div>
    `;

    this.cart.forEach(item => {
      html += `
        <div class="cart-page-item">
          <div class="cart-page-item-info">
            <div class="cart-page-item-img">
              <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="cart-page-item-details">
              <h4><a href="/products">${item.name}</a></h4>
              <p class="cart-page-item-size">${item.size}</p>
              <button class="cart-page-item-remove" onclick="cartManager.removeFromCart('${item.id}', '${item.size}')">
                <i class="fa-regular fa-trash-can"></i> Remove
              </button>
            </div>
          </div>
          
          <div class="cart-page-item-price">
            $${item.price.toFixed(2)}
          </div>
          
          <div>
            <div class="cart-page-qty-picker">
              <button onclick="cartManager.updateQuantity('${item.id}', '${item.size}', ${item.quantity - 1})"><i class="fa-solid fa-minus"></i></button>
              <span>${item.quantity}</span>
              <button onclick="cartManager.updateQuantity('${item.id}', '${item.size}', ${item.quantity + 1})"><i class="fa-solid fa-plus"></i></button>
            </div>
          </div>
          
          <div class="cart-page-item-total text-right">
            $${(item.price * item.quantity).toFixed(2)}
          </div>
        </div>
      `;
    });

    pageContainer.innerHTML = html;

    // Update Summary totals
    const subtotal = this.getCartTotal();
    const shipping = subtotal >= 45 ? 0 : 5.99;
    const total = subtotal + shipping;

    const pageSubtotalDisplay = document.getElementById('cart-page-subtotal');
    const pageShippingDisplay = document.getElementById('cart-page-shipping');
    const pageTotalDisplay = document.getElementById('cart-page-total');

    if (pageSubtotalDisplay) pageSubtotalDisplay.textContent = `$${subtotal.toFixed(2)}`;
    if (pageShippingDisplay) pageShippingDisplay.textContent = shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`;
    if (pageTotalDisplay) pageTotalDisplay.textContent = `$${total.toFixed(2)}`;
  }

  // Render checkout review column items
  renderCheckoutReview() {
    const listContainer = document.getElementById('checkout-items-list');
    if (!listContainer) return;

    if (this.cart.length === 0) {
      listContainer.innerHTML = `<p>No items inside cart. <a href="/products">Shop Spices</a></p>`;
      return;
    }

    let html = '';
    this.cart.forEach(item => {
      html += `
        <div class="checkout-review-item">
          <div class="checkout-review-item-img">
            <img src="${item.image}" alt="${item.name}">
          </div>
          <div class="checkout-review-item-details">
            <h5>${item.name}</h5>
            <p class="checkout-review-item-size">${item.size}</p>
            <span class="checkout-review-item-qty">Qty: ${item.quantity}</span>
          </div>
          <div class="checkout-review-item-price">
            $${(item.price * item.quantity).toFixed(2)}
          </div>
        </div>
      `;
    });
    listContainer.innerHTML = html;

    const subtotal = this.getCartTotal();
    const shipping = subtotal >= 45 ? 0 : 5.99;
    const tax = subtotal * 0.088; // 8.8% mock sales tax
    const total = subtotal + shipping + tax;

    const subTotalDisplay = document.getElementById('checkout-subtotal');
    const shippingDisplay = document.getElementById('checkout-shipping');
    const taxDisplay = document.getElementById('checkout-tax');
    const totalDisplay = document.getElementById('checkout-total');

    if (subTotalDisplay) subTotalDisplay.textContent = `$${subtotal.toFixed(2)}`;
    if (shippingDisplay) shippingDisplay.textContent = shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`;
    if (taxDisplay) taxDisplay.textContent = `$${tax.toFixed(2)}`;
    if (totalDisplay) totalDisplay.textContent = `$${total.toFixed(2)}`;
  }
}

// Instantiate globally
const cartManager = new CartManager();

// Bind elements on DOM Load
document.addEventListener('DOMContentLoaded', () => {
  cartManager.updateCartBadge();
  cartManager.renderCartSidebar();
  cartManager.renderCartPage();
  cartManager.renderCheckoutReview();

  // Listen for public "Add to Cart" triggers
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.add-to-cart-btn');
    if (btn) {
      const id = btn.getAttribute('data-id');
      const name = btn.getAttribute('data-name');
      const price = btn.getAttribute('data-price');
      const image = btn.getAttribute('data-image');
      const size = btn.getAttribute('data-size') || '2 oz Jar';

      cartManager.addToCart(id, name, price, image, size, 1);
    }

    // Listen for Detail pages Add to Cart with manual quantities
    const detailAddBtn = e.target.closest('.add-detail-to-cart-btn');
    if (detailAddBtn) {
      const id = detailAddBtn.getAttribute('data-id');
      const name = detailAddBtn.getAttribute('data-name');
      const price = detailAddBtn.getAttribute('data-price');
      const image = detailAddBtn.getAttribute('data-image');

      // Read selected size from checked radio
      const sizeInput = document.querySelector('input[name="sizeOption"]:checked');
      const size = sizeInput ? sizeInput.value : '2 oz Jar';

      // Read quantity input
      const qtyInput = document.getElementById('detail-quantity-input');
      const quantity = qtyInput ? parseInt(qtyInput.value) || 1 : 1;

      cartManager.addToCart(id, name, price, image, size, quantity);
    }
  });

  // Toggle buttons
  const drawerToggle = document.getElementById('cart-drawer-toggle');
  const drawerClose = document.getElementById('cart-sidebar-close');
  const overlay = document.getElementById('site-overlay');

  if (drawerToggle) {
    drawerToggle.addEventListener('click', () => cartManager.openSidebar());
  }
  if (drawerClose) {
    drawerClose.addEventListener('click', () => cartManager.closeSidebar());
  }
  if (overlay) {
    overlay.addEventListener('click', () => {
      cartManager.closeSidebar();
      // Also close mobile drawer if it's open
      const mobileDrawer = document.getElementById('mobile-drawer');
      const filterSidebar = document.getElementById('catalog-sidebar');
      if (mobileDrawer) mobileDrawer.classList.remove('active');
      if (filterSidebar) filterSidebar.classList.remove('active');
    });
  }
});