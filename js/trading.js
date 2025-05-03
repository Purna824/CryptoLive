let openOrders = [];
let closedOrders = [];
let balance = 10000; // fake balance in USD
let selectedSide = 'buy';

const formatMoney = (n) => `$${n.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;

const updateBalance = () => {
  document.getElementById('balance').textContent = formatMoney(balance);
};

const updateOrderLists = () => {
  const openList = document.getElementById('open-orders');
  const closedList = document.getElementById('closed-orders');

  openList.innerHTML = '';
  closedList.innerHTML = '';

  openOrders.forEach((order, index) => {
    const li = document.createElement('li');
    li.textContent = `${order.side.toUpperCase()} ${order.amount} @ ${order.type === 'market' ? 'Market' : `$${order.price}`}`;

    const closeBtn = document.createElement('button');
    closeBtn.textContent = 'Close';
    closeBtn.style.marginLeft = '1em';
    closeBtn.onclick = () => {
      closedOrders.push(order);
      openOrders.splice(index, 1);
      updateOrderLists();
    };

    li.appendChild(closeBtn);
    openList.appendChild(li);
  });

  closedOrders.forEach(order => {
    const li = document.createElement('li');
    li.textContent = `${order.side.toUpperCase()} ${order.amount} @ ${order.type === 'market' ? 'Market' : `$${order.price}`} (Closed)`;
    closedList.appendChild(li);
  });
};

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('trade-form');
  const priceInput = document.getElementById('price');
  const priceLabel = document.getElementById('price-label');
  const orderType = document.getElementById('order-type');
  const orderSideInput = document.getElementById('order-side');

  const buyBtn = document.querySelector('.buy-btn');
  const sellBtn = document.querySelector('.sell-btn');

  // Toggle buttons
  const setSide = (side) => {
    selectedSide = side;
    orderSideInput.value = side;

    buyBtn.classList.remove('active');
    sellBtn.classList.remove('active');

    if (side === 'buy') buyBtn.classList.add('active');
    else sellBtn.classList.add('active');
  };

  buyBtn.addEventListener('click', () => setSide('buy'));
  sellBtn.addEventListener('click', () => setSide('sell'));
  setSide('buy'); // default

  orderType.addEventListener('change', () => {
    priceLabel.style.display = orderType.value === 'limit' ? 'block' : 'none';
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const type = orderType.value;
    const side = selectedSide;
    const amount = parseFloat(document.getElementById('amount').value);
    const price = type === 'limit' ? parseFloat(document.getElementById('price').value) : 1000 + Math.random() * 30000;

    if (type === 'limit' && !price) {
      alert('Price is required for limit orders.');
      return;
    }

    const totalCost = price * amount;
    if (side === 'buy' && totalCost > balance) {
      alert('Insufficient balance!');
      return;
    }

    if (side === 'buy') {
      balance -= totalCost;
    } else {
      balance += totalCost;
    }

    openOrders.push({ type, side, amount, price });
    updateOrderLists();
    updateBalance();

    form.reset();
    priceLabel.style.display = 'none';
  });

  updateBalance();

  document.getElementById('theme-toggle').addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
  });
});
