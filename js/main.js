document.addEventListener('DOMContentLoaded', function () {
  const themeToggle = document.getElementById('theme-toggle');
  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
  });

  const priceData = document.getElementById('price-data');
  priceData.innerHTML = '<p>Loading data...</p>';

  const coinInfo = {
    bitcoin: { name: 'Bitcoin', logo: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png' },
    ethereum: { name: 'Ethereum', logo: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png' },
    cardano: { name: 'Cardano', logo: 'https://assets.coingecko.com/coins/images/975/large/cardano.png' },
    solana: { name: 'Solana', logo: 'https://assets.coingecko.com/coins/images/4128/large/solana.png' },
    dogecoin: { name: 'Dogecoin', logo: 'https://assets.coingecko.com/coins/images/5/large/dogecoin.png' }
  };

  const apiUrl = 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,cardano,solana,dogecoin&vs_currencies=usd,btc&include_24hr_change=true';

  fetch(apiUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      priceData.innerHTML = Object.keys(coinInfo).map(coin => `
          <div class="price-card">
            <img src="${coinInfo[coin].logo}" alt="${coinInfo[coin].name} logo" class="coin-logo" />
            <h3>${coinInfo[coin].name}</h3>
            <p>USD: $${data[coin].usd.toFixed(2)}</p>
            <p>BTC: ${data[coin].btc.toFixed(8)} BTC</p>
            <p>24h Change: ${data[coin].usd_24h_change.toFixed(2)}%</p>
          </div>
        </a>
      `).join('');
    })
    .catch(error => {
      console.error('Fetch error:', error);
      priceData.innerHTML = `<p>Failed to load data. Please try again later.</p>`;
    });
});

// for login page
document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');
  const signupForm = document.getElementById('signup-form');

  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Login submitted');
    });
  }

  if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Signup submitted');
    });
  }
});