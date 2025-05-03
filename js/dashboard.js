const coins = [
  { id: 'bitcoin', symbol: 'btcusdt', color: '#f7931a' },
  { id: 'ethereum', symbol: 'ethusdt', color: '#3c3c3d' },
  { id: 'cardano', symbol: 'adausdt', color: '#0033ad' },
  { id: 'solana', symbol: 'solusdt', color: '#00ffa3' },
  { id: 'dogecoin', symbol: 'dogeusdt', color: '#c2a633' }
];

const charts = {};

function createChart(ctx, label, borderColor) {
  return new Chart(ctx, {
    type: 'line',
    data: {
      labels: [],
      datasets: [{
        label: label,
        data: [],
        borderColor,
        backgroundColor: borderColor + '22',
        tension: 0.4,
        fill: true,
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          labels: { color: '#333' }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              return `${label}: $${context.parsed.y.toFixed(2)}`;
            }
          }
        }
      },
      scales: {
        x: {
          ticks: { color: '#666' },
          grid: { color: '#eee' }
        },
        y: {
          ticks: { color: '#666' },
          grid: { color: '#eee' }
        }
      }
    }
  });
}

function updateChart(chart, price) {
  const now = new Date().toLocaleTimeString();
  const data = chart.data;

  data.labels.push(now);
  data.datasets[0].data.push(price);

  if (data.labels.length > 30) {
    data.labels.shift();
    data.datasets[0].data.shift();
  }

  chart.update();
}

function createCoinHeader(coinId) {
  const title = document.createElement('h2');
  title.textContent = coinId.toUpperCase();
  title.style.textAlign = 'center';
  title.style.margin = '0';
  title.style.padding = '10px';
  title.style.color = '#333';
  return title;
}

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('chart-grid');

  coins.forEach(coin => {
    const chartWrap = document.createElement('div');
    chartWrap.className = 'chart-container';

    const title = createCoinHeader(coin.id);
    const canvas = document.createElement('canvas');
    canvas.id = `${coin.id}-chart`;
    canvas.height = 300;

    chartWrap.appendChild(title);
    chartWrap.appendChild(canvas);
    container.appendChild(chartWrap);

    const ctx = canvas.getContext('2d');
    charts[coin.id] = createChart(ctx, coin.id.toUpperCase(), coin.color);

    const ws = new WebSocket(`wss://stream.binance.com:9443/ws/${coin.symbol}@trade`);
    ws.onmessage = (event) => {
      const trade = JSON.parse(event.data);
      const price = parseFloat(trade.p);
      updateChart(charts[coin.id], price);
    };
  });
});
