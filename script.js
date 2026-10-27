
const products = [
  {
    id: 1,
    name: "PowerDrive English Willow Bat",
    category: "Bats",
    price: 3499,
    tag: "BESTSELLER",
    image: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 2,
    name: "Pro Match Batting Gloves",
    category: "Protection",
    price: 1299,
    tag: "MATCH READY",
    image: "https://images.unsplash.com/photo-1519861531473-9200262188bf?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 3,
    name: "Elite Cricket Training Jersey",
    category: "Clothing",
    price: 899,
    tag: "NEW DROP",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 4,
    name: "Impact Protection Pads",
    category: "Protection",
    price: 1599,
    tag: "PLAYER FAVOURITE",
    image: "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 5,
    name: "Performance Sports Shoes",
    category: "Clothing",
    price: 2199,
    tag: "PERFORMANCE",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 6,
    name: "Premium Cricket Kit Bag",
    category: "Accessories",
    price: 1899,
    tag: "ESSENTIAL",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=700&q=80"
  }
];

let cart = [];
let selectedCategory = "All";
let couponApplied = false;

const productGrid = document.getElementById("productGrid");
const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const productTotal = document.getElementById("productTotal");
const sortSelect = document.getElementById("sortSelect");
const couponInput = document.getElementById("couponInput");
const couponMessage = document.getElementById("couponMessage");

function formatPrice(price) {
  return "₹" + price.toLocaleString("en-IN");
}

// Display products
function displayProducts() {
  let filteredProducts = products.filter(product => {
    return selectedCategory === "All" ||
      product.category === selectedCategory;
  });

  if (sortSelect.value === "low") {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sortSelect.value === "high") {
    filteredProducts.sort((a, b) => b.price - a.price);
  } else if (sortSelect.value === "name") {
    filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
  }

  productTotal.textContent =
    `${filteredProducts.length} PRODUCT${filteredProducts.length === 1 ? "" : "S"}`;

  if (filteredProducts.length === 0) {
    productGrid.innerHTML = '<p class="no-products">No products found.</p>';
    return;
  }

  productGrid.innerHTML = filteredProducts.map(product => `
    <article class="product-card">
      <div class="product-image">
        <img
          src="${product.image}"
          alt="${product.name}"
          loading="lazy"
          onerror="this.onerror=null;this.src='https://placehold.co/600x700/e6e6e2/111111?text=BOUNDARY+XI';"
        >
        <span class="product-tag">${product.tag}</span>
      </div>

      <div class="product-info">
        <p class="product-category">${product.category}</p>
        <h3>${product.name}</h3>

        <div class="product-bottom">
          <span class="product-price">${formatPrice(product.price)}</span>
          <button class="add-btn" data-add="${product.id}">
            + ADD TO BAG
          </button>
        </div>
      </div>
    </article>
  `).join("");
}

// Filter products
document.getElementById("filters").addEventListener("click", event => {
  const button = event.target.closest(".filter-btn");

  if (!button) return;

  selectedCategory = button.dataset.category;

  document.querySelectorAll(".filter-btn").forEach(btn => {
    btn.classList.toggle("active", btn === button);
  });

  displayProducts();
});

// Sort products
sortSelect.addEventListener("change", displayProducts);

// Add products to cart
productGrid.addEventListener("click", event => {
  const button = event.target.closest("[data-add]");

  if (!button) return;

  const productId = Number(button.dataset.add);
  const existingItem = cart.find(item => item.id === productId);

  if (existingItem) {
    existingItem.quantity++;
  } else {
    const product = products.find(item => item.id === productId);

    if (product) {
      cart.push({ ...product, quantity: 1 });
    }
  }

  renderCart();
});

// Increase, decrease or remove cart items
cartItems.addEventListener("click", event => {
  const button = event.target.closest("button");

  if (!button) return;

  const id = Number(button.dataset.id);
  const item = cart.find(product => product.id === id);

  if (!item) return;

  if (button.dataset.action === "increase") {
    item.quantity++;
  }

  if (button.dataset.action === "decrease") {
    item.quantity--;

    if (item.quantity <= 0) {
      cart = cart.filter(product => product.id !== id);
    }
  }

  if (button.dataset.action === "remove") {
    cart = cart.filter(product => product.id !== id);
  }

  renderCart();
});

// Calculate subtotal
function calculateSubtotal() {
  return cart.reduce((sum, item) => {
    return sum + item.price * item.quantity;
  }, 0);
}

// Render cart and calculate bill
function renderCart() {
  const totalQuantity = cart.reduce((sum, item) => {
    return sum + item.quantity;
  }, 0);

  cartCount.textContent = totalQuantity;

  if (cart.length === 0) {
    cartItems.innerHTML =
      '<p class="empty-cart">Your bag is waiting for its first pick.</p>';
  } else {
    cartItems.innerHTML = cart.map(item => `
      <article class="cart-item">
        <img
          src="${item.image}"
          alt="${item.name}"
          onerror="this.onerror=null;this.src='https://placehold.co/200x220/e6e6e2/111111?text=Gear';"
        >

        <div>
          <h4>${item.name}</h4>
          <p>${formatPrice(item.price)} each</p>

          <div class="quantity-controls">
            <button data-action="decrease" data-id="${item.id}"
              aria-label="Decrease quantity">−</button>

            <span>${item.quantity}</span>

            <button data-action="increase" data-id="${item.id}"
              aria-label="Increase quantity">+</button>
          </div>

          <button class="remove-btn" data-action="remove"
            data-id="${item.id}">Remove</button>
        </div>

        <span class="cart-line-total">
          ${formatPrice(item.price * item.quantity)}
        </span>
      </article>
    `).join("");
  }

  updateSummary();
}

// Calculate discount, delivery and total
function updateSummary() {
  const subtotal = calculateSubtotal();
  const discount = couponApplied ? Math.round(subtotal * 0.10) : 0;
  const delivery = subtotal === 0 || subtotal >= 2000 ? 0 : 49;
  const total = subtotal - discount + delivery;

  document.getElementById("subtotal").textContent = formatPrice(subtotal);
  document.getElementById("discount").textContent = "−" + formatPrice(discount);
  document.getElementById("delivery").textContent =
    delivery === 0 ? "FREE" : formatPrice(delivery);
  document.getElementById("total").textContent = formatPrice(total);

  document.getElementById("checkoutBtn").disabled = cart.length === 0;
}

// Apply coupon
document.getElementById("applyCouponBtn").addEventListener("click", () => {
  const code = couponInput.value.trim().toUpperCase();

  if (code === "SAVE10" && cart.length > 0) {
    couponApplied = true;
    couponMessage.textContent = "Success! You saved 10% on your order.";
    couponMessage.style.color = "green";
  } else if (code === "SAVE10") {
    couponApplied = false;
    couponMessage.textContent = "Add a product to your bag before applying the coupon.";
    couponMessage.style.color = "#b00020";
  } else {
    couponApplied = false;
    couponMessage.textContent = "Invalid coupon. Try SAVE10.";
    couponMessage.style.color = "#b00020";
  }

  updateSummary();
});

// Clear cart
document.getElementById("clearCartBtn").addEventListener("click", () => {
  cart = [];
  couponApplied = false;
  couponInput.value = "";
  couponMessage.textContent = "Use SAVE10 for 10% off your order.";
  couponMessage.style.color = "";
  renderCart();
});

// Demo checkout
document.getElementById("checkoutBtn").addEventListener("click", () => {
  if (cart.length === 0) return;

  const subtotal = calculateSubtotal();
  const discount = couponApplied ? Math.round(subtotal * 0.10) : 0;
  const delivery = subtotal === 0 || subtotal >= 2000 ? 0 : 49;
  const total = subtotal - discount + delivery;

  alert(
    "BOUNDARY XI — DEMO CHECKOUT\n\n" +
    "Items: " + cart.reduce((sum, item) => sum + item.quantity, 0) + "\n" +
    "Subtotal: " + formatPrice(subtotal) + "\n" +
    "Discount: " + formatPrice(discount) + "\n" +
    "Delivery: " + (delivery === 0 ? "FREE" : formatPrice(delivery)) + "\n" +
    "Total: " + formatPrice(total) + "\n\n" +
    "This is a demo. No payment has been taken."
  );
});

// Mobile navigation
document.getElementById("menuBtn").addEventListener("click", () => {
  document.getElementById("navLinks").classList.toggle("open");
});

document.querySelectorAll("#navLinks a").forEach(link => {
  link.addEventListener("click", () => {
    document.getElementById("navLinks").classList.remove("open");
  });
});

// Footer year
document.getElementById("year").textContent = new Date().getFullYear();

// Start website
displayProducts();
renderCart();
