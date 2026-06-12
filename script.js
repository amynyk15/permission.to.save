const CATEGORIES = [
  "Food & Dining",
  "Transportation",
  "Shopping",
  "Subscriptions",
  "Education",
  "Health",
  "Entertainment",
  "Bills",
  "Others"
];

const STORAGE_KEY = "permissionToSaveBudgetApp.v1";

const demoData = {
  selectedMonth: "2026-05",
  budgets: [
    { id: crypto.randomUUID(), month: "2026-05", category: "Food & Dining", amount: 3000, saving: 200 },
    { id: crypto.randomUUID(), month: "2026-05", category: "Transportation", amount: 1000, saving: 100 },
    { id: crypto.randomUUID(), month: "2026-05", category: "Shopping", amount: 1500, saving: 300 },
    { id: crypto.randomUUID(), month: "2026-05", category: "Subscriptions", amount: 330, saving: 0 },
    { id: crypto.randomUUID(), month: "2026-05", category: "Education", amount: 1200, saving: 500 },
    { id: crypto.randomUUID(), month: "2026-06", category: "Food & Dining", amount: 3200, saving: 300 }
  ],
  expenses: [
    { id: crypto.randomUUID(), date: "2026-05-29", name: "Salary day lunch", category: "Food & Dining", amount: 145, status: "Completed" },
    { id: crypto.randomUUID(), date: "2026-05-28", name: "MTR Octopus", category: "Transportation", amount: 520, status: "Completed" },
    { id: crypto.randomUUID(), date: "2026-05-27", name: "Groceries", category: "Food & Dining", amount: 880, status: "Completed" },
    { id: crypto.randomUUID(), date: "2026-05-26", name: "Netflix", category: "Subscriptions", amount: 79, status: "Completed" },
    { id: crypto.randomUUID(), date: "2026-05-25", name: "Online Shopping", category: "Shopping", amount: 1090, status: "Pending" },
    { id: crypto.randomUUID(), date: "2026-06-02", name: "Cafe", category: "Food & Dining", amount: 88, status: "Completed" }
  ],
  savings: [
    { id: crypto.randomUUID(), month: "2026-05", goal: "Emergency Fund", target: 50000, saved: 30000 },
    { id: crypto.randomUUID(), month: "2026-05", goal: "Travel Fund", target: 20000, saved: 7000 },
    { id: crypto.randomUUID(), month: "2026-05", goal: "New Laptop Fund", target: 10000, saved: 4500 }
  ],
  shopping: [
    { id: crypto.randomUUID(), item: "Milk", category: "Food & Dining", qty: 2, price: 26, priority: "Medium", bought: false },
    { id: crypto.randomUUID(), item: "Notebook", category: "Education", qty: 1, price: 48, priority: "Low", bought: false },
    { id: crypto.randomUUID(), item: "Skincare refill", category: "Health", qty: 1, price: 180, priority: "High", bought: true }
  ]
};

let state = loadState();

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

document.addEventListener("DOMContentLoaded", () => {
  initSelectOptions();
  bindEvents();
  render();
});

function loadState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return structuredClone(demoData);

  try {
    return JSON.parse(saved);
  } catch {
    return structuredClone(demoData);
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function initSelectOptions() {
  const categorySelectIds = ["budgetCategory", "expenseCategory", "shopCategory"];
  categorySelectIds.forEach((id) => {
    const select = document.getElementById(id);
    select.innerHTML = CATEGORIES.map((cat) => `<option value="${cat}">${cat}</option>`).join("");
  });

  $("#globalMonth").value = state.selectedMonth;
  $("#budgetMonth").value = state.selectedMonth;
  $("#savingMonth").value = state.selectedMonth;
  $("#expenseDate").value = `${state.selectedMonth}-01`;
}

function bindEvents() {
  $$(".nav-link").forEach((btn) => {
    btn.addEventListener("click", () => switchPage(btn.dataset.page));
  });

  $$("[data-go-page]").forEach((btn) => {
    btn.addEventListener("click", () => switchPage(btn.dataset.goPage));
  });

  $("#globalMonth").addEventListener("change", (event) => {
    state.selectedMonth = event.target.value;
    $("#budgetMonth").value = state.selectedMonth;
    $("#savingMonth").value = state.selectedMonth;
    $("#expenseDate").value = `${state.selectedMonth}-01`;
    saveState();
    render();
  });

  $("#resetDemoBtn").addEventListener("click", () => {
    const confirmed = confirm("Reset all data to demo data?");
    if (!confirmed) return;
    state = structuredClone(demoData);
    saveState();
    initSelectOptions();
    render();
  });

  $("#budgetForm").addEventListener("submit", handleBudgetSubmit);
  $("#expenseForm").addEventListener("submit", handleExpenseSubmit);
  $("#savingForm").addEventListener("submit", handleSavingSubmit);
  $("#shoppingForm").addEventListener("submit", handleShoppingSubmit);
}

function switchPage(pageId) {
  $$(".nav-link").forEach((btn) => btn.classList.toggle("active", btn.dataset.page === pageId));
  $$(".page").forEach((page) => page.classList.toggle("active", page.id === pageId));

  const titles = {
    dashboard: ["Monthly Dashboard", "Track budget, actual expenses, saving and shopping items."],
    budget: ["Budget Planner", "Set monthly budgets and compare against actual expenses."],
    expenses: ["Actual Expenses", "Record completed and pending expenses."],
    savings: ["Saving Goals", "Track saving goals and progress."],
    shopping: ["Shopping List", "Plan purchases and convert bought items into actual expenses."]
  };

  $("#pageTitle").textContent = titles[pageId][0];
  $("#pageSubtitle").textContent = titles[pageId][1];
}

function handleBudgetSubmit(event) {
  event.preventDefault();

  state.budgets.push({
    id: crypto.randomUUID(),
    month: $("#budgetMonth").value,
    category: $("#budgetCategory").value,
    amount: numberValue("#budgetAmount"),
    saving: numberValue("#budgetSaving")
  });

  event.target.reset();
  $("#budgetMonth").value = state.selectedMonth;
  saveState();
  render();
}

function handleExpenseSubmit(event) {
  event.preventDefault();

  state.expenses.push({
    id: crypto.randomUUID(),
    date: $("#expenseDate").value,
    name: $("#expenseName").value.trim(),
    category: $("#expenseCategory").value,
    amount: numberValue("#expenseAmount"),
    status: $("#expenseStatus").value
  });

  event.target.reset();
  $("#expenseDate").value = `${state.selectedMonth}-01`;
  saveState();
  render();
}

function handleSavingSubmit(event) {
  event.preventDefault();

  state.savings.push({
    id: crypto.randomUUID(),
    month: $("#savingMonth").value,
    goal: $("#savingGoal").value.trim(),
    target: numberValue("#savingTarget"),
    saved: numberValue("#savingSaved")
  });

  event.target.reset();
  $("#savingMonth").value = state.selectedMonth;
  saveState();
  render();
}

function handleShoppingSubmit(event) {
  event.preventDefault();

  state.shopping.push({
    id: crypto.randomUUID(),
    item: $("#shopItem").value.trim(),
    category: $("#shopCategory").value,
    qty: numberValue("#shopQty"),
    price: numberValue("#shopPrice"),
    priority: $("#shopPriority").value,
    bought: false
  });

  event.target.reset();
  saveState();
  render();
}

function render() {
  const month = state.selectedMonth;
  $$(".selected-month-text").forEach((node) => (node.textContent = month));

  const totals = getMonthlyTotals(month);

  $("#sideBudget").textContent = money(totals.budget);
  $("#sideExpense").textContent = money(totals.expense);
  $("#sideSaving").textContent = money(totals.saving);
  $("#sideLeft").textContent = money(totals.left);

  $("#kpiBudget").textContent = money(totals.budget);
  $("#kpiExpense").textContent = money(totals.expense);
  $("#kpiSaving").textContent = money(totals.saving);
  $("#kpiLeft").textContent = money(totals.left);

  renderBudgetTable();
  renderExpenseTable();
  renderSavingList();
  renderShoppingList();
  renderDashboard();
}

function getMonthlyTotals(month) {
  const monthlyBudgets = state.budgets.filter((row) => row.month === month);
  const monthlyExpenses = getCompletedExpenses(month);

  const budget = sum(monthlyBudgets, "amount");
  const saving = sum(monthlyBudgets, "saving");
  const expense = sum(monthlyExpenses, "amount");
  const left = budget - expense - saving;

  return { budget, saving, expense, left };
}

function getCompletedExpenses(month) {
  return state.expenses.filter((row) => row.status === "Completed" && monthFromDate(row.date) === month);
}

function getActualByCategory(month, category) {
  return sum(
    state.expenses.filter((row) => row.status === "Completed" && monthFromDate(row.date) === month && row.category === category),
    "amount"
  );
}

function renderBudgetTable() {
  const month = state.selectedMonth;
  const rows = state.budgets.filter((row) => row.month === month);
  const body = $("#budgetBody");

  if (!rows.length) {
    body.innerHTML = `<tr><td colspan="8"><div class="empty">No budget records for this month.</div></td></tr>`;
    return;
  }

  body.innerHTML = rows.map((row) => {
    const actual = getActualByCategory(month, row.category);
    const left = row.amount - actual - row.saving;
    const usage = row.amount ? Math.min((actual / row.amount) * 100, 999) : 0;

    return `
      <tr>
        <td>${row.month}</td>
        <td><span class="badge">${row.category}</span></td>
        <td>${money(row.amount)}</td>
        <td>${money(actual)}</td>
        <td>${money(row.saving)}</td>
        <td class="${left < 0 ? "danger" : "success"}">${money(left)}</td>
        <td>
          <div class="progress" title="${usage.toFixed(0)}%">
            <span style="width:${Math.min(usage, 100)}%"></span>
          </div>
          <small>${usage.toFixed(0)}%</small>
        </td>
        <td><button class="icon-btn" onclick="deleteRow('budgets', '${row.id}')">Delete</button></td>
      </tr>
    `;
  }).join("");
}

function renderExpenseTable() {
  const month = state.selectedMonth;
  const rows = state.expenses
    .filter((row) => monthFromDate(row.date) === month)
    .sort((a, b) => b.date.localeCompare(a.date));
  const body = $("#expenseBody");

  if (!rows.length) {
    body.innerHTML = `<tr><td colspan="6"><div class="empty">No expense records for this month.</div></td></tr>`;
    return;
  }

  body.innerHTML = rows.map((row) => `
    <tr>
      <td>${formatDate(row.date)}</td>
      <td>${escapeHTML(row.name)}</td>
      <td><span class="badge">${row.category}</span></td>
      <td>${money(row.amount)}</td>
      <td><span class="badge ${row.status === "Completed" ? "green" : "blue"}">${row.status}</span></td>
      <td><button class="icon-btn" onclick="deleteRow('expenses', '${row.id}')">Delete</button></td>
    </tr>
  `).join("");
}

function renderSavingList() {
  const month = state.selectedMonth;
  const rows = state.savings.filter((row) => row.month === month);
  const list = $("#savingList");

  if (!rows.length) {
    list.innerHTML = `<div class="empty">No saving goals for this month.</div>`;
    return;
  }

  list.innerHTML = rows.map((row) => {
    const progress = row.target ? Math.min((row.saved / row.target) * 100, 100) : 0;
    return `
      <article class="goal-card">
        <h4>${escapeHTML(row.goal)}</h4>
        <p>${money(row.saved)} / ${money(row.target)}</p>
        <div class="progress"><span style="width:${progress}%"></span></div>
        <p><b>${progress.toFixed(0)}%</b> completed</p>
        <div class="goal-actions">
          <button class="icon-btn" onclick="deleteRow('savings', '${row.id}')">Delete</button>
        </div>
      </article>
    `;
  }).join("");
}

function renderShoppingList() {
  const body = $("#shoppingBody");
  const total = state.shopping.reduce((acc, row) => acc + row.qty * row.price, 0);
  const bought = state.shopping.filter((row) => row.bought).length;
  const pending = state.shopping.length - bought;

  $("#shopTotal").textContent = money(total);
  $("#shopBought").textContent = bought;
  $("#shopPending").textContent = pending;

  if (!state.shopping.length) {
    body.innerHTML = `<tr><td colspan="7"><div class="empty">No shopping items yet.</div></td></tr>`;
    return;
  }

  body.innerHTML = state.shopping.map((row) => {
    const estimate = row.qty * row.price;
    const badgeClass = row.priority === "High" ? "red" : row.priority === "Medium" ? "orange" : "blue";

    return `
      <tr class="${row.bought ? "bought-row" : ""}">
        <td><input type="checkbox" ${row.bought ? "checked" : ""} onchange="toggleBought('${row.id}')" /></td>
        <td>${escapeHTML(row.item)}</td>
        <td><span class="badge">${row.category}</span></td>
        <td>${row.qty}</td>
        <td>${money(estimate)}</td>
        <td><span class="badge ${badgeClass}">${row.priority}</span></td>
        <td>
          <button class="text-btn" onclick="addShoppingToExpense('${row.id}')">Add expense</button>
          <button class="icon-btn" onclick="deleteRow('shopping', '${row.id}')">Delete</button>
        </td>
      </tr>
    `;
  }).join("");
}

function renderDashboard() {
  renderCategoryChart();
  renderRecentExpensePreview();
  renderSavingPreview();
  renderShoppingPreview();
}

function renderCategoryChart() {
  const month = state.selectedMonth;
  const rows = state.budgets.filter((row) => row.month === month);
  const chart = $("#categoryChart");

  if (!rows.length) {
    chart.innerHTML = `<div class="empty">Add budget rows to generate chart.</div>`;
    return;
  }

  const maxValue = Math.max(...rows.map((row) => Math.max(row.amount, getActualByCategory(month, row.category))), 1);

  chart.innerHTML = rows.map((row) => {
    const actual = getActualByCategory(month, row.category);
    const budgetWidth = (row.amount / maxValue) * 100;
    const actualWidth = (actual / maxValue) * 100;

    return `
      <div class="chart-row">
        <div class="chart-label">${row.category}</div>
        <div class="bar-pair">
          <div class="bar budget" title="Budget ${money(row.amount)}"><span style="width:${budgetWidth}%"></span></div>
          <div class="bar actual" title="Actual ${money(actual)}"><span style="width:${actualWidth}%"></span></div>
        </div>
        <div class="chart-value">${money(actual)} / ${money(row.amount)}</div>
      </div>
    `;
  }).join("");
}

function renderRecentExpensePreview() {
  const rows = state.expenses
    .filter((row) => monthFromDate(row.date) === state.selectedMonth)
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 5);

  const body = $("#recentExpenseBody");
  if (!rows.length) {
    body.innerHTML = `<tr><td colspan="5"><div class="empty">No recent expenses.</div></td></tr>`;
    return;
  }

  body.innerHTML = rows.map((row) => `
    <tr>
      <td>${formatDate(row.date)}</td>
      <td>${escapeHTML(row.name)}</td>
      <td><span class="badge">${row.category}</span></td>
      <td>${money(row.amount)}</td>
      <td><span class="badge ${row.status === "Completed" ? "green" : "blue"}">${row.status}</span></td>
    </tr>
  `).join("");
}

function renderSavingPreview() {
  const rows = state.savings.filter((row) => row.month === state.selectedMonth).slice(0, 3);
  const box = $("#savingPreview");

  if (!rows.length) {
    box.innerHTML = `<div class="empty">No saving goals.</div>`;
    return;
  }

  box.innerHTML = rows.map((row) => {
    const progress = row.target ? Math.min((row.saved / row.target) * 100, 100) : 0;
    return `
      <div class="stack-item">
        <div class="stack-top">
          <span>${escapeHTML(row.goal)}</span>
          <span class="success">${progress.toFixed(0)}%</span>
        </div>
        <div class="progress"><span style="width:${progress}%"></span></div>
        <div class="stack-bottom">
          <span>${money(row.saved)}</span>
          <span>${money(row.target)}</span>
        </div>
      </div>
    `;
  }).join("");
}

function renderShoppingPreview() {
  const rows = state.shopping.slice(0, 4);
  const box = $("#shoppingPreview");

  if (!rows.length) {
    box.innerHTML = `<div class="empty">No shopping items.</div>`;
    return;
  }

  box.innerHTML = rows.map((row) => `
    <div class="stack-item">
      <div class="stack-top">
        <span>${row.bought ? "✅" : "⬜"} ${escapeHTML(row.item)}</span>
        <span>${money(row.qty * row.price)}</span>
      </div>
      <div class="stack-bottom">
        <span>${row.category}</span>
        <span>${row.priority}</span>
      </div>
    </div>
  `).join("");
}

function toggleBought(id) {
  const item = state.shopping.find((row) => row.id === id);
  if (!item) return;
  item.bought = !item.bought;
  saveState();
  render();
}

function addShoppingToExpense(id) {
  const item = state.shopping.find((row) => row.id === id);
  if (!item) return;

  const today = new Date().toISOString().slice(0, 10);
  state.expenses.push({
    id: crypto.randomUUID(),
    date: today,
    name: item.item,
    category: item.category,
    amount: item.qty * item.price,
    status: "Completed"
  });

  item.bought = true;
  saveState();
  render();
  alert("Added to Actual Expenses.");
}

function deleteRow(collection, id) {
  state[collection] = state[collection].filter((row) => row.id !== id);
  saveState();
  render();
}

function numberValue(selector) {
  return Number($(selector).value || 0);
}

function sum(rows, key) {
  return rows.reduce((acc, row) => acc + Number(row[key] || 0), 0);
}

function monthFromDate(dateString) {
  return dateString.slice(0, 7);
}

function money(value) {
  const sign = value < 0 ? "-" : "";
  const amount = Math.abs(value);
  return `${sign}HK$${amount.toLocaleString("en-HK", {
    minimumFractionDigits: amount % 1 ? 2 : 0,
    maximumFractionDigits: 2
  })}`;
}

function formatDate(dateString) {
  return new Intl.DateTimeFormat("en-HK", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(new Date(`${dateString}T00:00:00`));
}

function escapeHTML(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
