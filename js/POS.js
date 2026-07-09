/* ==========================================================================
   Point of Sale Page Logic
   Renders menu items (with photos), manages the current order/cart,
   calculates totals, handles category filters + payment method selection,
   and renders the recent transactions table.
   Replace `menuItems` / `recentTransactions` with real API/database calls
   whenever ready.
   ========================================================================== */

/* Each item's `image` uses Unsplash's official download-redirect URL so you
   get a real photo without needing to host any image files yourself.
   Swap any of these for your own product photos whenever you like. */
const menuItems = [
  {
    id: "seafood-pasta",
    name: "Sea Food Pasta",
    category: "restaurant",
    categoryLabel: "Restaurant",
    price: 9900,
    image: "image/pasta.jpg"
  },
  {
    id: "coca-cola",
    name: "Coca-Cola 400ml",
    category: "beverages",
    categoryLabel: "Beverages",
    price: 980,
    image: "image/coc.jpg"
  },
  {
    id: "mix-fruit-juice",
    name: "Mix Fruit Juice",
    category: "beverages",
    categoryLabel: "Beverages",
    price: 980,
    image: "image/fruit juice.jpg"
  },
  {
    id: "chocolate-cake",
    name: "Chocolate Cake Slice",
    category: "restaurant",
    categoryLabel: "Restaurant",
    price: 1980,
    image: "image/cake.jpg"
  },
  {
    id: "white-wine",
    name: "White Wine",
    category: "bar",
    categoryLabel: "Bar",
    price: 3950,
    image: "image/w_vine.jpg"
  },
  {
    id: "club-sandwich",
    name: "Club Sandwich",
    category: "restaurant",
    categoryLabel: "Restaurant",
    price: 2000,
    image: "image/sandwich.jpg"
  },
  {
    id: "coffee",
    name: "Coffee",
    category: "beverages",
    categoryLabel: "Beverages",
    price: 850,
    image: "image/coffee.jpg"
  },
  {
    id: "towel-set",
    name: "Towel Set",
    category: "spa",
    categoryLabel: "Spa & Wellness",
    price: 2500,
    image: "image/towel.jpg"
  },
  {
    id: "french-fries",
    name: "French Fries",
    category: "breakfast",
    categoryLabel: "Breakfast",
    price: 750,
    image: "image/french_frice.jpg"
  },
  {
    id: "red-wine",
    name: "Red Wine",
    category: "bar",
    categoryLabel: "Bar",
    price: 4000,
    image: "image/r_vine.jpg"
  },
  {
    id: "egg-hoppers",
    name: "Egg Hoppers",
    category: "breakfast",
    categoryLabel: "Breakfast",
    price: 200,
    image: "image/hop.jpg"
  },
  {
    id: "chicken-fried-rice",
    name: "Chicken Fried Rice",
    category: "restaurant",
    categoryLabel: "Restaurant",
    price: 1800,
    image: "image/rice.jpg"
  }
];

const recentTransactions = [
  { orderId: "#RES-1025", guestRoom: "207", items: 5, amount: 15000, status: "paid" },
  { orderId: "#RES-1026", guestRoom: "378", items: 4, amount: 4890, status: "pending" },
  { orderId: "#RES-1027", guestRoom: "101", items: 7, amount: 10578, status: "paid" },
  { orderId: "#RES-1028", guestRoom: "289", items: 5, amount: 7530, status: "paid" }
];

// The current order/cart. Pre-seeded to mirror the design's starting state —
// clear it out to an empty array [] if you'd rather start blank.
let currentOrder = [
  { id: "water-bottle", name: "Water Bottle", price: 200, qty: 2 },
  { id: "mix-fruit-juice", name: "Mix fruit juice", price: 800, qty: 3 },
  { id: "seafood-rice", name: "Sea Food rice", price: 1500, qty: 1 },
  { id: "cheese-burger", name: "Cheese Burger", price: 2000, qty: 2 }
];

let activeCategory = "all";
let activePaymentMethod = "cash";

const SERVICE_CHARGE_RATE = 0.10;
const TAX_RATE = 0.03;

function formatCurrency(amount) {
  return "Rs " + amount.toLocaleString("en-US") + ".00";
}

/* ---------------- Menu grid ---------------- */
function renderMenuGrid() {
  const grid = document.getElementById("menuGrid");
  grid.innerHTML = "";

  const filtered = activeCategory === "all"
    ? menuItems
    : menuItems.filter((item) => item.category === activeCategory);

  filtered.forEach((item) => {
    const card = document.createElement("div");
    card.className = "menu-item-card";
    card.innerHTML = `
      <img src="${item.image}" alt="${item.name}" loading="lazy" />
      <div class="menu-item-info">
        <span class="menu-item-name">${item.name}</span>
        <span class="menu-item-category">${item.categoryLabel}</span>
        <span class="menu-item-price">${formatCurrency(item.price)}</span>
      </div>
    `;
    card.addEventListener("click", () => addToOrder(item));
    grid.appendChild(card);
  });
}

/* ---------------- Category tabs ---------------- */
function setupCategoryTabs() {
  const tabs = document.querySelectorAll(".category-tab");
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      activeCategory = tab.dataset.category;
      renderMenuGrid();
    });
  });
}

/* ---------------- Cart logic ---------------- */
function addToOrder(item) {
  const existing = currentOrder.find((line) => line.id === item.id);
  if (existing) {
    existing.qty += 1;
  } else {
    currentOrder.push({ id: item.id, name: item.name, price: item.price, qty: 1 });
  }
  renderOrder();
}

function changeQty(id, delta) {
  const line = currentOrder.find((l) => l.id === id);
  if (!line) return;
  line.qty += delta;
  if (line.qty <= 0) {
    currentOrder = currentOrder.filter((l) => l.id !== id);
  }
  renderOrder();
}

function removeLine(id) {
  currentOrder = currentOrder.filter((l) => l.id !== id);
  renderOrder();
}

function clearOrder() {
  currentOrder = [];
  renderOrder();
}

/* ---------------- Order panel render ---------------- */
function renderOrder() {
  const container = document.getElementById("orderItems");
  container.innerHTML = "";

  if (currentOrder.length === 0) {
    container.innerHTML = `<div class="empty-order">No items in this order yet. Tap a menu item to add it.</div>`;
  } else {
    currentOrder.forEach((line) => {
      const row = document.createElement("div");
      row.className = "order-item-row";
      row.innerHTML = `
        <div class="order-item-name">
          <button class="remove-item-btn" title="Remove">✕</button>
          <span>${line.name}</span>
        </div>
        <div class="qty-controls">
          <button class="qty-btn" data-action="dec">−</button>
          <span>${line.qty}</span>
          <button class="qty-btn" data-action="inc">+</button>
        </div>
        <span>${formatCurrency(line.price)}</span>
        <span class="order-item-total">${formatCurrency(line.price * line.qty)}</span>
      `;
      row.querySelector(".remove-item-btn").addEventListener("click", () => removeLine(line.id));
      row.querySelector('[data-action="inc"]').addEventListener("click", () => changeQty(line.id, 1));
      row.querySelector('[data-action="dec"]').addEventListener("click", () => changeQty(line.id, -1));
      container.appendChild(row);
    });
  }

  updateTotals();
}

function updateTotals() {
  const itemCount = currentOrder.reduce((sum, l) => sum + l.qty, 0);
  const subtotal = currentOrder.reduce((sum, l) => sum + l.price * l.qty, 0);
  const serviceCharge = subtotal * SERVICE_CHARGE_RATE;
  const tax = subtotal * TAX_RATE;
  const grandTotal = subtotal + serviceCharge + tax;

  document.getElementById("subtotalLabel").textContent = `Sub Total (${itemCount} items)`;
  document.getElementById("subtotalValue").textContent = formatCurrency(subtotal);
  document.getElementById("serviceChargeValue").textContent = formatCurrency(serviceCharge);
  document.getElementById("taxValue").textContent = formatCurrency(tax);
  document.getElementById("grandTotalValue").textContent = formatCurrency(grandTotal);
}

/* ---------------- Payment method buttons ---------------- */
function setupPaymentButtons() {
  const buttons = document.querySelectorAll(".payment-btn");
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      buttons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      activePaymentMethod = btn.dataset.method;
    });
  });
}

/* ---------------- Recent transactions table ---------------- */
function renderTransactions() {
  const tbody = document.getElementById("transactionsTableBody");
  tbody.innerHTML = "";

  recentTransactions.forEach((tx) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${tx.orderId}</td>
      <td>${tx.guestRoom}</td>
      <td>${tx.items} items</td>
      <td>${formatCurrency(tx.amount)}</td>
      <td><span class="status-badge status-${tx.status}">${tx.status === "paid" ? "Paid" : "Pending"}</span></td>
    `;
    tbody.appendChild(tr);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderMenuGrid();
  setupCategoryTabs();
  renderOrder();
  setupPaymentButtons();
  renderTransactions();

  document.getElementById("clearOrderBtn").addEventListener("click", clearOrder);
});
