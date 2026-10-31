
const form = document.getElementById("transaction-form");
const description = document.getElementById("description");
const amount = document.getElementById("amount");
const type = document.getElementById("type");
const category = document.getElementById("category");

let transactions = JSON.parse(
  localStorage.getItem("transactions")
) || [];

form.addEventListener("submit", function(e) {
  e.preventDefault();

  const name = description.value.trim();
  const money = Number(amount.value);

  if (!name || !Number.isFinite(money) || money <= 0) {
    alert("Please enter valid transaction details!");
    return;
  }

  const transaction = {
    id: Date.now(),
    name: name,
    amount: money,
    type: type.value,
    category: category.value,
    date: new Date().toLocaleDateString()
  };

  transactions.push(transaction);

  saveData();
  updateDashboard();

  form.reset();
});

function saveData() {
  localStorage.setItem(
    "transactions",
    JSON.stringify(transactions)
  );
}

function updateDashboard() {
  let totalIncome = 0;
  let totalExpense = 0;

  transactions.forEach(item => {
    if (item.type === "income") {
      totalIncome += item.amount;
    } else {
      totalExpense += item.amount;
    }
  });

  document.getElementById("income").innerText =
    "₹" + totalIncome.toFixed(2);

  document.getElementById("expense").innerText =
    "₹" + totalExpense.toFixed(2);

  document.getElementById("balance").innerText =
    "₹" + (totalIncome - totalExpense).toFixed(2);

  displayTransactions();
}

function displayTransactions() {
  const list = document.getElementById("transaction-list");

  list.innerHTML = "";

  if (transactions.length === 0) {
    list.innerHTML =
      '<p class="empty">No transactions yet!</p>';
    return;
  }

  transactions.slice().reverse().forEach(item => {
    const div = document.createElement("div");
    div.className = "transaction";

    const info = document.createElement("div");

    const title = document.createElement("strong");
    title.textContent = item.name;

    const details = document.createElement("small");
    details.textContent =
      item.category + " • " + item.date;

    info.append(title, details);

    const right = document.createElement("div");
    right.className = "right";

    const value = document.createElement("strong");
    value.className =
      item.type === "income" ? "plus" : "minus";

    value.textContent =
      (item.type === "income" ? "+" : "-") +
      "₹" + item.amount.toFixed(2);

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete";
    deleteBtn.textContent = "Delete";

    deleteBtn.addEventListener("click", () => {
      deleteTransaction(item.id);
    });

    right.append(value, deleteBtn);
    div.append(info, right);
    list.appendChild(div);
  });
}

function deleteTransaction(id) {
  transactions = transactions.filter(
    item => item.id !== id
  );

  saveData();
  updateDashboard();
}

updateDashboard();
