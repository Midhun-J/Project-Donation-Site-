let currentAdmin = null;

function showPage(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById(pageId).classList.add('active');
}

// Donation Form
document.getElementById('donationForm').addEventListener('submit', async e => {
  e.preventDefault();
  const donorName = document.getElementById('donorName').value.trim();
  const amount = parseFloat(document.getElementById('donationAmount').value);
  const paymentMethod = document.getElementById('paymentMethod').value;
  const category = document.getElementById('category').value;

  try {
    const res = await fetch('http://localhost:3000/api/donations', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ donorName, amount, paymentMethod, category })
    });
    const data = await res.json();
    if(res.ok){
      alert('Thank you for your donation!');
      e.target.reset();
      showPage('homePage');
    } else alert('Error: ' + data.error);
  } catch {
    alert('Server error.');
  }
});

// Admin Login
document.getElementById('adminLoginForm').addEventListener('submit', async e => {
  e.preventDefault();
  const username = document.getElementById('adminUsername').value.trim();
  const password = document.getElementById('adminPassword').value.trim();

  try {
    const res = await fetch('http://localhost:3000/api/admin/login', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({username, password})
    });
    const data = await res.json();
    if(res.ok){
      currentAdmin = data.username;
      await loadDonationsTable();
      showPage('adminDashboard');
    } else alert('Login failed: ' + data.error);
  } catch {
    alert('Server error.');
  }
});

// Load donations table
async function loadDonationsTable(){
  try {
    const res = await fetch('http://localhost:3000/api/admin/donations');
    const donations = await res.json();
    const tbody = document.querySelector('#donationsTable tbody');
    tbody.innerHTML = '';
    donations.forEach(d => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${d.donor_name}</td>
        <td>${d.amount}</td>
        <td>${d.payment_method}</td>
        <td>${d.category}</td>
        <td>${new Date(d.donation_date).toLocaleString()}</td>
      `;
      tbody.appendChild(tr);
    });
  } catch {
    alert('Failed to load donations');
  }
}

function logout() {
  currentAdmin = null;
  showPage('homePage');
}

window.showPage = showPage;
window.logout = logout;

showPage('homePage');
