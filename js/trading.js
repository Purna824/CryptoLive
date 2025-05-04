
document.addEventListener("DOMContentLoaded", () => {
  const orderTypeSelect = document.getElementById("order-type");
  const priceLabel = document.getElementById("price-label");
  const tradeForm = document.getElementById("trade-form");
  const amountInput = document.getElementById("amount");
  const priceInput = document.getElementById("price");
  const orderSideInput = document.getElementById("order-side");
  const openOrdersList = document.getElementById("open-orders");
  const closedOrdersList = document.getElementById("closed-orders");
  const buyBtn = document.querySelector(".buy-btn");
  const sellBtn = document.querySelector(".sell-btn");

  let userBalance = {
    USD: 10000,
    BTC: 2
  };

  function updateBalanceUI() {
    document.getElementById("usd-balance").textContent = `USD: $${userBalance.USD.toFixed(2)}`;
    document.getElementById("btc-balance").textContent = `BTC: ${userBalance.BTC.toFixed(4)}`;
  }
  updateBalanceUI();

  orderTypeSelect.addEventListener("change", () => {
    priceLabel.style.display = orderTypeSelect.value === "limit" ? "block" : "none";
  });

  [buyBtn, sellBtn].forEach(btn => {
    btn.addEventListener("click", () => {
      orderSideInput.value = btn.dataset.side;
      buyBtn.classList.remove("active");
      sellBtn.classList.remove("active");
      btn.classList.add("active");
    });
  });

  tradeForm.addEventListener("submit", e => {
    e.preventDefault();
    const type = orderTypeSelect.value;
    const side = orderSideInput.value;
    const amount = parseFloat(amountInput.value);
    const price = type === "market" ? 30000 : parseFloat(priceInput.value);

    if (isNaN(amount) || amount <= 0 || (type === "limit" && isNaN(price))) {
      alert("Please enter valid amount and price.");
      return;
    }

    let cost = amount * price;
    if (side === "buy" && userBalance.USD < cost) {
      alert("Insufficient USD balance.");
      return;
    }
    if (side === "sell" && userBalance.BTC < amount) {
      alert("Insufficient BTC balance.");
      return;
    }

    if (side === "buy") {
      userBalance.USD -= cost;
      userBalance.BTC += amount;
    } else {
      userBalance.BTC -= amount;
      userBalance.USD += cost;
    }

    updateBalanceUI();

    const li = document.createElement("li");
    li.textContent = `${side.toUpperCase()} ${amount} BTC at $${price}`;
    openOrdersList.appendChild(li);

    setTimeout(() => {
      openOrdersList.removeChild(li);
      closedOrdersList.appendChild(li);
    }, 3000);

    tradeForm.reset();
    buyBtn.classList.remove("active");
    sellBtn.classList.remove("active");
    priceLabel.style.display = "none";
  });
});
