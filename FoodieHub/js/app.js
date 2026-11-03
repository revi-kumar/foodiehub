/**
 * FoodieHub - Shared Application Logic
 * Academic Web Development Mini Project
 * Student: A. Revanth Kumar | Roll No: 25CS003583 | CSE (Cyber Security)
 */

// Global App State & Storage Keys
const THEME_STORAGE_KEY = 'foodiehub_theme';
const CART_STORAGE_KEY = 'foodiehub_cart';
const COUPON_STORAGE_KEY = 'foodiehub_applied_coupon';

// ----------------------------------------------------
// THEME MANAGEMENT (Light / Dark Mode)
// ----------------------------------------------------
function initTheme() {
  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeToggleButtons(savedTheme);

  document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
    btn.addEventListener('click', toggleTheme);
  });
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem(THEME_STORAGE_KEY, newTheme);
  updateThemeToggleButtons(newTheme);
}

function updateThemeToggleButtons(theme) {
  document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
    btn.innerHTML = theme === 'dark' ? '☀️' : '🌙';
    btn.setAttribute('title', theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode');
    btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode');
  });
}

// ----------------------------------------------------
// CART MANAGEMENT (LocalStorage)
// ----------------------------------------------------
function getCart() {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Error reading cart from localStorage', e);
    return [];
  }
}

function saveCart(cart) {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  } catch (e) {
    console.error('Error saving cart to localStorage', e);
  }
  updateCartBadge();
}

function getCartItem(itemId) {
  const cart = getCart();
  return cart.find(item => item.id === itemId);
}

function getCartTotalCount() {
  const cart = getCart();
  return cart.reduce((sum, item) => sum + (item.quantity || 0), 0);
}

function getCartSubtotal() {
  const cart = getCart();
  return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

function updateCartBadge() {
  const count = getCartTotalCount();
  document.querySelectorAll('.cart-badge').forEach(badge => {
    badge.textContent = count;
    badge.style.display = count > 0 ? 'inline-flex' : 'none';
  });
}

function addToCart(dish, restaurant) {
  let cart = getCart();
  
  // If cart already has items from another restaurant, confirm reset
  if (cart.length > 0 && cart[0].restaurantId !== restaurant.id) {
    const confirmReset = confirm(
      `Your cart contains items from "${cart[0].restaurantName}". Would you like to clear your cart and start a fresh order from "${restaurant.name}"?`
    );
    if (!confirmReset) return false;
    cart = [];
  }

  const existingIndex = cart.findIndex(item => item.id === dish.id);
  if (existingIndex > -1) {
    cart[existingIndex].quantity += 1;
  } else {
    cart.push({
      id: dish.id,
      name: dish.name,
      price: dish.price,
      isVeg: dish.isVeg,
      restaurantId: restaurant.id,
      restaurantName: restaurant.name,
      quantity: 1,
      category: dish.category
    });
  }

  saveCart(cart);
  return true;
}

function updateCartItemQuantity(dishId, change, restaurant) {
  let cart = getCart();
  const index = cart.findIndex(item => item.id === dishId);

  if (index > -1) {
    cart[index].quantity += change;
    if (cart[index].quantity <= 0) {
      cart.splice(index, 1);
    }
  } else if (change > 0 && restaurant) {
    // If not in cart and incrementing
    const dish = restaurant.menu.find(d => d.id === dishId);
    if (dish) {
      return addToCart(dish, restaurant);
    }
  }

  saveCart(cart);
  return true;
}

function removeFromCart(dishId) {
  let cart = getCart();
  cart = cart.filter(item => item.id !== dishId);
  saveCart(cart);
}

function clearCart() {
  localStorage.removeItem(CART_STORAGE_KEY);
  localStorage.removeItem(COUPON_STORAGE_KEY);
  updateCartBadge();
}

// ----------------------------------------------------
// HOMEPAGE CONTROLLER (index.html)
// ----------------------------------------------------
function initHomePage() {
  const gridContainer = document.getElementById('restaurants-grid');
  if (!gridContainer) return;

  const searchInput = document.getElementById('hero-search-input');
  const searchClearBtn = document.getElementById('search-clear-btn');
  const categoriesTrack = document.getElementById('categories-track');
  const sortSelect = document.getElementById('sort-select');
  const ratingFilterBtn = document.getElementById('filter-rating-btn');
  const vegFilterBtn = document.getElementById('filter-veg-btn');
  const fastDeliveryBtn = document.getElementById('filter-fast-btn');
  const resetFiltersBtn = document.getElementById('reset-filters-btn');
  const restaurantCountEl = document.getElementById('restaurant-count');

  let state = {
    category: 'all',
    search: '',
    minRating: 0,
    pureVegOnly: false,
    fastDeliveryOnly: false,
    sortBy: 'relevance'
  };

  // Render categories
  if (categoriesTrack && typeof FOOD_CATEGORIES !== 'undefined') {
    categoriesTrack.innerHTML = FOOD_CATEGORIES.map(cat => `
      <div class="category-item ${cat.id === state.category ? 'active' : ''}" data-category="${cat.id}">
        <span class="category-icon">${cat.icon}</span>
        <span class="category-name">${cat.name}</span>
      </div>
    `).join('');

    categoriesTrack.querySelectorAll('.category-item').forEach(el => {
      el.addEventListener('click', () => {
        const catId = el.getAttribute('data-category');
        state.category = catId;
        
        categoriesTrack.querySelectorAll('.category-item').forEach(item => {
          item.classList.toggle('active', item.getAttribute('data-category') === catId);
        });

        applyFiltersAndRender();
      });
    });
  }

  // Search input events
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      state.search = e.target.value.trim().toLowerCase();
      if (searchClearBtn) {
        searchClearBtn.classList.toggle('visible', state.search.length > 0);
      }
      applyFiltersAndRender();
    });

    if (searchClearBtn) {
      searchClearBtn.addEventListener('click', () => {
        searchInput.value = '';
        state.search = '';
        searchClearBtn.classList.remove('visible');
        searchInput.focus();
        applyFiltersAndRender();
      });
    }
  }

  // Filter chips
  if (ratingFilterBtn) {
    ratingFilterBtn.addEventListener('click', () => {
      state.minRating = state.minRating === 4.0 ? 0 : 4.0;
      ratingFilterBtn.classList.toggle('active', state.minRating === 4.0);
      applyFiltersAndRender();
    });
  }

  if (vegFilterBtn) {
    vegFilterBtn.addEventListener('click', () => {
      state.pureVegOnly = !state.pureVegOnly;
      vegFilterBtn.classList.toggle('active', state.pureVegOnly);
      applyFiltersAndRender();
    });
  }

  if (fastDeliveryBtn) {
    fastDeliveryBtn.addEventListener('click', () => {
      state.fastDeliveryOnly = !state.fastDeliveryOnly;
      fastDeliveryBtn.classList.toggle('active', state.fastDeliveryOnly);
      applyFiltersAndRender();
    });
  }

  // Sort dropdown
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      state.sortBy = e.target.value;
      applyFiltersAndRender();
    });
  }

  // Reset filters
  if (resetFiltersBtn) {
    resetFiltersBtn.addEventListener('click', resetAllFilters);
  }

  function resetAllFilters() {
    state = {
      category: 'all',
      search: '',
      minRating: 0,
      pureVegOnly: false,
      fastDeliveryOnly: false,
      sortBy: 'relevance'
    };

    if (searchInput) searchInput.value = '';
    if (searchClearBtn) searchClearBtn.classList.remove('visible');
    if (sortSelect) sortSelect.value = 'relevance';
    if (ratingFilterBtn) ratingFilterBtn.classList.remove('active');
    if (vegFilterBtn) vegFilterBtn.classList.remove('active');
    if (fastDeliveryBtn) fastDeliveryBtn.classList.remove('active');

    if (categoriesTrack) {
      categoriesTrack.querySelectorAll('.category-item').forEach(item => {
        item.classList.toggle('active', item.getAttribute('data-category') === 'all');
      });
    }

    applyFiltersAndRender();
  }

  function applyFiltersAndRender() {
    let list = [...RESTAURANTS];

    // Filter by category
    if (state.category && state.category !== 'all') {
      list = list.filter(r => 
        r.category.toLowerCase() === state.category.toLowerCase() ||
        r.cuisine.some(c => c.toLowerCase() === state.category.toLowerCase()) ||
        r.menu.some(m => m.category.toLowerCase() === state.category.toLowerCase())
      );
    }

    // Filter by search query (restaurant name, cuisines, or dish name)
    if (state.search) {
      const q = state.search;
      list = list.filter(r => 
        r.name.toLowerCase().includes(q) ||
        r.area.toLowerCase().includes(q) ||
        r.cuisine.some(c => c.toLowerCase().includes(q)) ||
        r.menu.some(m => m.name.toLowerCase().includes(q) || m.description.toLowerCase().includes(q))
      );
    }

    // Filter by Rating >= 4.0
    if (state.minRating > 0) {
      list = list.filter(r => r.rating >= state.minRating);
    }

    // Filter Pure Veg
    if (state.pureVegOnly) {
      list = list.filter(r => r.isPureVeg);
    }

    // Filter Fast Delivery (<= 25 mins)
    if (state.fastDeliveryOnly) {
      list = list.filter(r => r.deliveryMinutes <= 25);
    }

    // Sorting
    if (state.sortBy === 'rating-desc') {
      list.sort((a, b) => b.rating - a.rating);
    } else if (state.sortBy === 'delivery-asc') {
      list.sort((a, b) => a.deliveryMinutes - b.deliveryMinutes);
    } else if (state.sortBy === 'cost-asc') {
      list.sort((a, b) => a.priceForTwo - b.priceForTwo);
    } else if (state.sortBy === 'cost-desc') {
      list.sort((a, b) => b.priceForTwo - a.priceForTwo);
    }

    // Render results
    if (restaurantCountEl) {
      restaurantCountEl.textContent = `${list.length} restaurants open now`;
    }

    if (list.length === 0) {
      gridContainer.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1;">
          <div class="empty-icon">🔍</div>
          <h3 class="empty-title">No restaurants match your search</h3>
          <p class="empty-desc">Try clearing some filters or searching for different dishes like Biryani, Pizza, or Dosas.</p>
          <button class="btn-primary" id="empty-reset-btn">Reset All Filters</button>
        </div>
      `;
      const emptyReset = document.getElementById('empty-reset-btn');
      if (emptyReset) emptyReset.addEventListener('click', resetAllFilters);
      return;
    }

    gridContainer.innerHTML = list.map(restaurant => `
      <div class="restaurant-card" onclick="window.location.href='restaurant.html?id=${restaurant.id}'" role="button" tabindex="0">
        <div class="restaurant-card-img-wrap">
          <img src="${restaurant.image}" alt="${restaurant.name}" class="restaurant-card-img" loading="lazy" onerror="this.src='assets/images/hero_banner.jpg'" />
          ${restaurant.offer ? `<div class="restaurant-offer-ribbon">🏷️ ${restaurant.offer}</div>` : ''}
          ${restaurant.isPureVeg ? `<div class="restaurant-pure-veg-tag">🌱 Pure Veg</div>` : ''}
        </div>
        <div class="restaurant-card-body">
          <div class="restaurant-card-header">
            <h3 class="restaurant-name">${restaurant.name}</h3>
            <span class="rating-badge">★ ${restaurant.rating.toFixed(1)}</span>
          </div>
          <p class="restaurant-cuisines">${restaurant.cuisine.join(', ')}</p>
          <div class="restaurant-card-footer">
            <span class="delivery-badge">🕒 ${restaurant.deliveryTime}</span>
            <span class="price-for-two tabular-nums">₹${restaurant.priceForTwo} for two</span>
          </div>
        </div>
      </div>
    `).join('');
  }

  // Initial render
  applyFiltersAndRender();
}

// ----------------------------------------------------
// RESTAURANT PAGE CONTROLLER (restaurant.html)
// ----------------------------------------------------
function initRestaurantPage() {
  const restaurantContainer = document.getElementById('restaurant-page-content');
  if (!restaurantContainer) return;

  const urlParams = new URLSearchParams(window.location.search);
  const restaurantId = urlParams.get('id') || 'mehfil-biryani';
  const restaurant = getRestaurantById(restaurantId);

  // Render restaurant hero
  const heroContainer = document.getElementById('restaurant-hero-container');
  if (heroContainer) {
    heroContainer.innerHTML = `
      <div class="breadcrumb-bar">
        <a href="index.html">← Back to Restaurants</a>
        <span>/</span>
        <span>${restaurant.name}</span>
      </div>
      <div class="restaurant-hero-inner">
        <div class="restaurant-hero-meta">
          <h1 class="restaurant-hero-title">${restaurant.name}</h1>
          <p class="restaurant-hero-cuisines">${restaurant.cuisine.join(', ')}</p>
          <p class="restaurant-hero-address">📍 ${restaurant.address}</p>
          <div class="restaurant-stats-strip">
            <div class="stat-box">
              <span class="stat-label">Rating</span>
              <span class="stat-value">
                <span class="rating-badge">★ ${restaurant.rating.toFixed(1)}</span>
                <span style="font-size: 12px; color: var(--text-muted);">(${restaurant.reviewCount})</span>
              </span>
            </div>
            <div class="stat-box">
              <span class="stat-label">Delivery Time</span>
              <span class="stat-value">🕒 ${restaurant.deliveryTime}</span>
            </div>
            <div class="stat-box">
              <span class="stat-label">Cost For Two</span>
              <span class="stat-value tabular-nums">₹${restaurant.priceForTwo}</span>
            </div>
          </div>
        </div>
        <div class="restaurant-hero-img-wrap">
          <img src="${restaurant.image}" alt="${restaurant.name}" class="restaurant-hero-img" onerror="this.src='assets/images/hero_banner.jpg'" />
        </div>
      </div>
    `;
  }

  // Dish search and diet filters
  const menuSearchInput = document.getElementById('menu-dish-search');
  const dietButtons = document.querySelectorAll('.diet-toggle-btn');
  let currentDiet = 'all';
  let menuSearchQuery = '';

  if (menuSearchInput) {
    menuSearchInput.addEventListener('input', (e) => {
      menuSearchQuery = e.target.value.trim().toLowerCase();
      renderMenu();
    });
  }

  dietButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      dietButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentDiet = btn.getAttribute('data-diet');
      renderMenu();
    });
  });

  function renderMenu() {
    const menuListContainer = document.getElementById('menu-groups-container');
    if (!menuListContainer) return;

    let items = [...restaurant.menu];

    // Dietary filter
    if (currentDiet === 'veg') {
      items = items.filter(d => d.isVeg);
    } else if (currentDiet === 'nonveg') {
      items = items.filter(d => !d.isVeg);
    } else if (currentDiet === 'bestseller') {
      items = items.filter(d => d.isBestseller);
    }

    // Search query within menu
    if (menuSearchQuery) {
      items = items.filter(d => 
        d.name.toLowerCase().includes(menuSearchQuery) || 
        d.description.toLowerCase().includes(menuSearchQuery)
      );
    }

    if (items.length === 0) {
      menuListContainer.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">🍽️</div>
          <h3 class="empty-title">No dishes found</h3>
          <p class="empty-desc">No dishes match your selected filter. Try searching for something else or reset the filter.</p>
        </div>
      `;
      return;
    }

    // Group items by category
    const categoriesMap = {};
    items.forEach(dish => {
      const cat = dish.category || 'Specialties';
      if (!categoriesMap[cat]) categoriesMap[cat] = [];
      categoriesMap[cat].push(dish);
    });

    const cart = getCart();

    menuListContainer.innerHTML = Object.keys(categoriesMap).map(categoryName => {
      const categoryDishes = categoriesMap[categoryName];
      return `
        <div class="menu-group" id="cat-${categoryName.toLowerCase().replace(/\s+/g, '-')}">
          <div class="menu-group-header">
            <span>${categoryName} (${categoryDishes.length})</span>
          </div>
          <div class="menu-items-list">
            ${categoryDishes.map(dish => {
              const inCartItem = cart.find(c => c.id === dish.id);
              const qty = inCartItem ? inCartItem.quantity : 0;
              return `
                <div class="menu-item-card" id="dish-card-${dish.id}">
                  <div class="menu-item-info">
                    <div style="display: flex; align-items: center; margin-bottom: 4px;">
                      <span class="${dish.isVeg ? 'veg-icon' : 'nonveg-icon'}" title="${dish.isVeg ? 'Vegetarian' : 'Non-Vegetarian'}"></span>
                      ${dish.isBestseller ? `<span class="bestseller-tag">⭐ Bestseller</span>` : ''}
                    </div>
                    <h4 class="menu-item-name">${dish.name}</h4>
                    <div class="menu-item-price tabular-nums">₹${dish.price}</div>
                    <p class="menu-item-desc">${dish.description}</p>
                  </div>
                  <div class="menu-item-action">
                    <div class="item-btn-container" id="action-box-${dish.id}">
                      ${qty > 0 ? `
                        <div class="stepper-btn-group">
                          <button class="stepper-btn" onclick="handleMenuQuantityChange('${dish.id}', -1)" aria-label="Decrease quantity">−</button>
                          <span class="stepper-count tabular-nums">${qty}</span>
                          <button class="stepper-btn" onclick="handleMenuQuantityChange('${dish.id}', 1)" aria-label="Increase quantity">+</button>
                        </div>
                      ` : `
                        <button class="btn-add-item" onclick="handleMenuAdd('${dish.id}')">ADD</button>
                      `}
                    </div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      `;
    }).join('');

    renderFloatingCartBar(restaurant);
  }

  // Attach global handlers for menu actions
  window.handleMenuAdd = function(dishId) {
    const dish = restaurant.menu.find(d => d.id === dishId);
    if (!dish) return;
    addToCart(dish, restaurant);
    renderMenu();
  };

  window.handleMenuQuantityChange = function(dishId, change) {
    updateCartItemQuantity(dishId, change, restaurant);
    renderMenu();
  };

  // Initial render
  renderMenu();
}

// Sticky floating cart bar on restaurant menu page
function renderFloatingCartBar(restaurant) {
  let bar = document.getElementById('floating-cart-bar');
  const cart = getCart();
  const totalCount = getCartTotalCount();
  const subtotal = getCartSubtotal();

  if (totalCount === 0) {
    if (bar) bar.remove();
    return;
  }

  if (!bar) {
    bar = document.createElement('div');
    bar.id = 'floating-cart-bar';
    bar.className = 'floating-cart-bar';
    document.body.appendChild(bar);
  }

  bar.innerHTML = `
    <div class="floating-cart-info">
      <span>🛒 ${totalCount} ${totalCount === 1 ? 'item' : 'items'}</span>
      <span>·</span>
      <span class="tabular-nums">₹${subtotal}</span>
    </div>
    <a href="cart.html" class="floating-cart-btn">View Cart →</a>
  `;
}

// ----------------------------------------------------
// CART & CHECKOUT CONTROLLER (cart.html)
// ----------------------------------------------------
function initCartPage() {
  const cartPageRoot = document.getElementById('cart-page-content');
  if (!cartPageRoot) return;

  const appliedCoupon = localStorage.getItem(COUPON_STORAGE_KEY) || null;

  function renderCartPage() {
    const cart = getCart();

    if (cart.length === 0) {
      cartPageRoot.innerHTML = `
        <div class="empty-state" style="margin-top: 40px;">
          <div class="empty-icon">🛒</div>
          <h2 class="empty-title">Your cart is empty</h2>
          <p class="empty-desc">Good food is always cooking! Go ahead, explore top restaurants and order delicious meals right to your doorstep.</p>
          <a href="index.html" class="btn-primary">Explore Restaurants</a>
        </div>
      `;
      return;
    }

    const restaurantName = cart[0].restaurantName || 'Selected Restaurant';
    const subtotal = getCartSubtotal();
    const deliveryFee = subtotal >= 500 ? 0 : 40;
    const platformFee = 5;
    const taxRate = 0.05;
    const taxes = Math.round(subtotal * taxRate);

    // Coupon logic
    let discount = 0;
    const currentCoupon = localStorage.getItem(COUPON_STORAGE_KEY);
    if (currentCoupon === 'FOODIE50') {
      discount = Math.min(50, subtotal);
    } else if (currentCoupon === 'WELCOME') {
      discount = Math.round(subtotal * 0.15); // 15% off
    }

    const grandTotal = Math.max(0, subtotal + deliveryFee + platformFee + taxes - discount);

    cartPageRoot.innerHTML = `
      <div class="cart-layout">
        <!-- Left: Items & Delivery Details -->
        <div class="cart-left-col">
          <!-- Items List Card -->
          <div class="cart-card">
            <div class="cart-card-header">
              <div>
                <h2 class="cart-card-title">Order Items</h2>
                <div class="cart-restaurant-name">From: <strong>${restaurantName}</strong></div>
              </div>
              <button class="reset-filters-btn" onclick="handleClearAllCart()">Clear Cart</button>
            </div>

            <div class="cart-items-table">
              ${cart.map(item => `
                <div class="cart-item-row" id="cart-item-${item.id}">
                  <div class="cart-item-meta">
                    <div class="cart-item-title">
                      <span class="${item.isVeg ? 'veg-icon' : 'nonveg-icon'}" title="${item.isVeg ? 'Veg' : 'Non-Veg'}"></span>
                      ${item.name}
                    </div>
                    <div class="cart-item-unit-price tabular-nums">₹${item.price} each</div>
                  </div>
                  <div class="cart-item-controls">
                    <div class="cart-stepper">
                      <button class="cart-stepper-btn" onclick="handleCartItemQty('${item.id}', -1)" aria-label="Decrease quantity">−</button>
                      <span class="cart-stepper-val tabular-nums">${item.quantity}</span>
                      <button class="cart-stepper-btn" onclick="handleCartItemQty('${item.id}', 1)" aria-label="Increase quantity">+</button>
                    </div>
                    <span class="cart-item-total tabular-nums">₹${item.price * item.quantity}</span>
                    <button class="cart-item-remove-btn" onclick="handleCartItemDelete('${item.id}')" title="Remove item" aria-label="Remove item">✕</button>
                  </div>
                </div>
              `).join('')}
            </div>

            <div style="margin-top: 20px;">
              <label class="form-label">Delivery Note / Cooking Instructions (Optional)</label>
              <input type="text" class="instructions-input" id="delivery-instructions" placeholder="e.g. Leave with security, extra spicy, no plastic cutlery" />
            </div>
          </div>

          <!-- Checkout Form Card -->
          <div class="cart-card">
            <h2 class="cart-card-title" style="margin-bottom: 16px;">Delivery Details</h2>
            <form id="checkout-form" class="checkout-form" onsubmit="handleCheckoutSubmit(event)">
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label" for="cust-name">Full Name *</label>
                  <input type="text" id="cust-name" class="form-input" placeholder="e.g. A. Revanth Kumar" required />
                  <span class="form-error-msg" id="name-error">Please enter your full name.</span>
                </div>
                <div class="form-group">
                  <label class="form-label" for="cust-phone">Phone Number (10 Digits) *</label>
                  <input type="tel" id="cust-phone" class="form-input" placeholder="e.g. 9876543210" maxlength="10" required />
                  <span class="form-error-msg" id="phone-error">Enter a valid 10-digit mobile number.</span>
                </div>
              </div>

              <div class="form-group">
                <label class="form-label" for="cust-address">Delivery Address *</label>
                <textarea id="cust-address" class="form-textarea" rows="3" placeholder="Flat / House No., Building Name, Street, MVP Colony, Visakhapatnam - 530017" required></textarea>
                <span class="form-error-msg" id="address-error">Please provide a complete delivery address.</span>
              </div>

              <div class="form-group">
                <label class="form-label">Payment Method</label>
                <div class="payment-options-grid">
                  <label class="payment-option-card selected" id="opt-cod">
                    <input type="radio" name="payment-method" value="Cash on Delivery" class="payment-radio" checked onchange="handlePaymentChange(this)" />
                    <div class="payment-info">
                      <span class="payment-name">Cash on Delivery (COD)</span>
                      <span class="payment-desc">Pay cash or UPI directly to delivery partner upon arrival</span>
                    </div>
                  </label>
                  <label class="payment-option-card" id="opt-upi">
                    <input type="radio" name="payment-method" value="UPI / QR Code" class="payment-radio" onchange="handlePaymentChange(this)" />
                    <div class="payment-info">
                      <span class="payment-name">UPI / Google Pay / PhonePe (Demo)</span>
                      <span class="payment-desc">Instant online payment via UPI ID or QR</span>
                    </div>
                  </label>
                  <label class="payment-option-card" id="opt-card">
                    <input type="radio" name="payment-method" value="Credit/Debit Card" class="payment-radio" onchange="handlePaymentChange(this)" />
                    <div class="payment-info">
                      <span class="payment-name">Credit / Debit Card (Demo)</span>
                      <span class="payment-desc">Visa, Mastercard, RuPay & Maestro supported</span>
                    </div>
                  </label>
                </div>
              </div>

              <button type="submit" class="btn-checkout-submit">
                <span>Place Order</span>
                <span>•</span>
                <span class="tabular-nums">₹${grandTotal}</span>
              </button>
            </form>
          </div>
        </div>

        <!-- Right: Bill Details & Coupons -->
        <div class="cart-right-col">
          <div class="summary-card">
            <h3 class="summary-title">Bill Details</h3>

            ${subtotal < 500 ? `
              <div class="free-delivery-banner">
                <span>💡</span>
                <span>Add ₹${500 - subtotal} more for <strong>FREE Delivery</strong></span>
              </div>
            ` : `
              <div class="free-delivery-banner" style="background: var(--rating-green-bg); border-color: rgba(36, 150, 63, 0.3); color: var(--rating-green);">
                <span>🎉</span>
                <span>Congratulations! You unlocked <strong>FREE Delivery</strong></span>
              </div>
            `}

            <!-- Coupon Code Section -->
            <div class="coupon-section">
              <label class="form-label">Have a Coupon?</label>
              <div class="coupon-box">
                <input type="text" id="coupon-input" class="coupon-input" placeholder="e.g. FOODIE50" value="${currentCoupon || ''}" />
                <button type="button" class="coupon-btn" onclick="handleApplyCoupon()">
                  ${currentCoupon ? 'Applied' : 'Apply'}
                </button>
              </div>
              <div id="coupon-feedback" class="coupon-feedback ${currentCoupon ? 'success' : ''}">
                ${currentCoupon ? `Coupon '${currentCoupon}' applied successfully!` : 'Try FOODIE50 (₹50 off) or WELCOME (15% off)'}
              </div>
            </div>

            <div class="bill-rows" style="margin-top: 16px;">
              <div class="bill-row">
                <span>Item Subtotal</span>
                <span class="tabular-nums">₹${subtotal}</span>
              </div>

              <div class="bill-row">
                <span>Delivery Partner Fee</span>
                <span class="tabular-nums ${deliveryFee === 0 ? 'free-tag' : ''}">
                  ${deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                </span>
              </div>

              <div class="bill-row">
                <span>Platform Convenience Fee</span>
                <span class="tabular-nums">₹${platformFee}</span>
              </div>

              <div class="bill-row">
                <span>GST & Restaurant Charges (5%)</span>
                <span class="tabular-nums">₹${taxes}</span>
              </div>

              ${discount > 0 ? `
                <div class="bill-row discount-row">
                  <span>Coupon Discount</span>
                  <span class="tabular-nums">- ₹${discount}</span>
                </div>
              ` : ''}

              <div class="bill-divider"></div>

              <div class="bill-grand-total">
                <span>Grand Total</span>
                <span class="tabular-nums">₹${grandTotal}</span>
              </div>
            </div>

            <div style="font-size: 11px; color: var(--text-subtle); line-height: 1.4; border-top: 1px solid var(--border-light); padding-top: 12px;">
              Academic Demo Prototype • No real payment required • Prices inclusive of taxes.
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // Global cart page handlers
  window.handleCartItemQty = function(itemId, change) {
    updateCartItemQuantity(itemId, change);
    renderCartPage();
  };

  window.handleCartItemDelete = function(itemId) {
    removeFromCart(itemId);
    renderCartPage();
  };

  window.handleClearAllCart = function() {
    if (confirm('Are you sure you want to remove all items from your cart?')) {
      clearCart();
      renderCartPage();
    }
  };

  window.handlePaymentChange = function(radioEl) {
    document.querySelectorAll('.payment-option-card').forEach(card => card.classList.remove('selected'));
    radioEl.closest('.payment-option-card').classList.add('selected');
  };

  window.handleApplyCoupon = function() {
    const input = document.getElementById('coupon-input');
    const feedback = document.getElementById('coupon-feedback');
    if (!input || !feedback) return;

    const code = input.value.trim().toUpperCase();
    if (code === 'FOODIE50' || code === 'WELCOME') {
      localStorage.setItem(COUPON_STORAGE_KEY, code);
      feedback.className = 'coupon-feedback success';
      feedback.textContent = `Coupon '${code}' applied successfully!`;
      renderCartPage();
    } else {
      feedback.className = 'coupon-feedback error';
      feedback.textContent = 'Invalid coupon code. Try FOODIE50 or WELCOME.';
    }
  };

  window.handleCheckoutSubmit = function(e) {
    e.preventDefault();

    const nameInput = document.getElementById('cust-name');
    const phoneInput = document.getElementById('cust-phone');
    const addressInput = document.getElementById('cust-address');
    const nameError = document.getElementById('name-error');
    const phoneError = document.getElementById('phone-error');
    const addressError = document.getElementById('address-error');

    let isValid = true;

    // Validate Name
    if (!nameInput.value.trim() || nameInput.value.trim().length < 2) {
      nameInput.classList.add('error');
      nameError.classList.add('visible');
      isValid = false;
    } else {
      nameInput.classList.remove('error');
      nameError.classList.remove('visible');
    }

    // Validate 10-digit Indian Mobile Number
    const phoneVal = phoneInput.value.trim();
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(phoneVal)) {
      phoneInput.classList.add('error');
      phoneError.classList.add('visible');
      isValid = false;
    } else {
      phoneInput.classList.remove('error');
      phoneError.classList.remove('visible');
    }

    // Validate Address
    if (!addressInput.value.trim() || addressInput.value.trim().length < 8) {
      addressInput.classList.add('error');
      addressError.classList.add('visible');
      isValid = false;
    } else {
      addressInput.classList.remove('error');
      addressError.classList.remove('visible');
    }

    if (!isValid) return;

    // Order calculation
    const cart = getCart();
    const subtotal = getCartSubtotal();
    const deliveryFee = subtotal >= 500 ? 0 : 40;
    const taxes = Math.round(subtotal * 0.05);
    const platformFee = 5;
    let discount = 0;
    const currentCoupon = localStorage.getItem(COUPON_STORAGE_KEY);
    if (currentCoupon === 'FOODIE50') discount = 50;
    if (currentCoupon === 'WELCOME') discount = Math.round(subtotal * 0.15);
    const grandTotal = Math.max(0, subtotal + deliveryFee + platformFee + taxes - discount);

    const paymentMethod = document.querySelector('input[name="payment-method"]:checked')?.value || 'Cash on Delivery';
    const instructions = document.getElementById('delivery-instructions')?.value || 'None';

    // Create persistent order in FoodieDB database
    const orderPayload = {
      orderId: 'FH-' + Math.floor(10000 + Math.random() * 90000),
      customerName: nameInput.value.trim(),
      customerPhone: phoneVal,
      customerAddress: addressInput.value.trim(),
      instructions: instructions,
      paymentMethod: paymentMethod,
      items: cart,
      subtotal: subtotal,
      deliveryFee: deliveryFee,
      platformFee: platformFee,
      taxes: taxes,
      discount: discount,
      grandTotal: grandTotal,
      restaurantId: cart[0]?.restaurantId || 'mehfil-biryani',
      restaurantName: cart[0]?.restaurantName || 'Mehfil Biryani & Kebabs'
    };

    const savedOrder = (typeof FoodieDB !== 'undefined')
      ? FoodieDB.createOrder(orderPayload)
      : { ...orderPayload, deliveryOtp: '4829' };

    showOrderConfirmationModal(savedOrder);
  };

  renderCartPage();
}

// ----------------------------------------------------
// ORDER CONFIRMATION MODAL
// ----------------------------------------------------
function showOrderConfirmationModal(order) {
  let modalOverlay = document.getElementById('order-confirmation-modal');
  if (!modalOverlay) {
    modalOverlay = document.createElement('div');
    modalOverlay.id = 'order-confirmation-modal';
    modalOverlay.className = 'modal-overlay';
    document.body.appendChild(modalOverlay);
  }

  modalOverlay.innerHTML = `
    <div class="order-modal">
      <div class="order-success-icon-wrap">✓</div>
      <h2 class="order-modal-title">Order Placed Successfully!</h2>
      <p class="order-modal-subtitle">Your order has been sent directly to the restaurant kitchen database.</p>

      <div class="order-id-badge">
        <span>Order Reference</span>
        <span class="tabular-nums" style="color: var(--primary);">${order.orderId}</span>
      </div>

      <!-- Prominent Delivery OTP Box -->
      <div style="background: #f9f0ff; border: 2px dashed #b37feb; border-radius: var(--radius-md); padding: 14px; text-align: center; margin: 16px 0;">
        <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; color: #722ed1; letter-spacing: 0.5px;">
          🔐 Your Delivery Verification OTP
        </div>
        <div style="font-size: 28px; font-weight: 900; color: #722ed1; letter-spacing: 4px; margin: 6px 0;" class="tabular-nums">
          ${order.deliveryOtp}
        </div>
        <div style="font-size: 11px; color: var(--text-muted);">
          Share this 4-digit code with your delivery partner to confirm handover.
        </div>
      </div>

      <!-- Delivery Stepper -->
      <div class="order-status-steps">
        <div class="step-node completed">
          <div class="step-circle">1</div>
          <span class="step-label">Placed</span>
        </div>
        <div class="step-node completed">
          <div class="step-circle">2</div>
          <span class="step-label">Kitchen</span>
        </div>
        <div class="step-node">
          <div class="step-circle">3</div>
          <span class="step-label">On Way</span>
        </div>
        <div class="step-node">
          <div class="step-circle">4</div>
          <span class="step-label">Delivered</span>
        </div>
      </div>

      <div class="order-summary-box">
        <div class="order-summary-row">
          <span>Deliver to</span>
          <strong>${order.customerName} (${order.customerPhone})</strong>
        </div>
        <div class="order-summary-row">
          <span>Address</span>
          <span style="max-width: 260px; text-align: right; color: var(--text-muted);">${order.customerAddress}</span>
        </div>
        <div class="order-summary-row">
          <span>Estimated Delivery</span>
          <strong style="color: var(--rating-green);">25 - 30 minutes</strong>
        </div>
        <div class="order-summary-row">
          <span>Total Amount</span>
          <span class="tabular-nums" style="font-size: 15px; color: var(--text-main);">₹${order.grandTotal} (${order.paymentMethod})</span>
        </div>
      </div>

      <div style="display: flex; flex-direction: column; gap: 10px; margin-top: 20px;">
        <a href="order-tracking.html?orderId=${order.orderId}" class="btn-primary" style="justify-content: center; padding: 12px;">
          🛵 Track Order Live & View OTP Status →
        </a>
        
        <div style="display: flex; gap: 10px;">
          <a href="partner.html" target="_blank" class="btn-secondary" style="flex: 1; text-align: center; justify-content: center; display: inline-flex; align-items: center;">
            🏪 Open Restaurant Portal
          </a>
          <button class="btn-secondary" onclick="window.print()" style="flex: 1;">
            🖨️ Print Receipt
          </button>
        </div>

        <button class="filter-chip" style="justify-content: center; padding: 10px; margin-top: 4px;" onclick="handleFinishOrder()">
          ← Back to Homepage
        </button>
      </div>
    </div>
  `;

  // Trigger modal visibility animation
  requestAnimationFrame(() => {
    modalOverlay.classList.add('active');
  });

  // Empty cart in storage
  clearCart();

  window.handleFinishOrder = function() {
    modalOverlay.classList.remove('active');
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 250);
  };
}

// ----------------------------------------------------
// BOOTSTRAP EVENT LISTENERS
// ----------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  updateCartBadge();
  initHomePage();
  initRestaurantPage();
  initCartPage();
});
