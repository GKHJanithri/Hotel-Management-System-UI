// ── Recent Bookings Data ──
const bookings = [
  { guest: 'Janik Gamage',  room: '507', checkIn: 'Aug 1, 2026',   checkOut: 'Aug 1, 2026',   status: 'check-in',  statusText: 'Check in'   },
  { guest: 'Samith Perera', room: '101', checkIn: 'Aug 6, 2026',   checkOut: 'Aug 7, 2026',   status: 'cancelled', statusText: 'Cancelled'  },
  { guest: 'Mala Silva',    room: '308', checkIn: 'Aug 15, 2026',  checkOut: 'Aug 17, 2026',  status: 'departing', statusText: 'Departing'  },
  { guest: 'Lithmi Navoda', room: '403', checkIn: 'Aug 10, 2026',  checkOut: 'Aug 12, 2026',  status: 'extended',  statusText: 'Extended'   },
  { guest: 'Supun Perera',  room: '110', checkIn: 'July 29, 2026', checkOut: 'July 31, 2026', status: 'check-out', statusText: 'Check Out'  },
  { guest: 'Dinesh Gamage', room: '200', checkIn: 'Aug 4, 2026',   checkOut: 'Aug 8, 2026',   status: 'check-in',  statusText: 'Check in'   }
];

// ── Render Bookings Table ──
function renderBookings() {
  const tbody = document.getElementById('bookingsBody');
  if (!tbody) return;

  bookings.forEach(b => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${b.guest}</td>
      <td>${b.room}</td>
      <td>${b.checkIn}</td>
      <td>${b.checkOut}</td>
      <td><span class="bk-badge ${b.status}">${b.statusText}</span></td>
    `;
    tbody.appendChild(row);
  });
}

// ── Occupancy Donut Chart ──
function initOccupancyChart() {
  const ctx = document.getElementById('occupancyChart');
  if (!ctx) return;

  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Occupied', 'Available', 'Out of Service'],
      datasets: [{
        data: [50, 25, 5],
        backgroundColor: ['#1d4ed8', '#93c5fd', '#bfdbfe'],
        borderWidth: 0,
        hoverOffset: 4
      }]
    },
    options: {
      responsive: false,
      cutout: '65%',
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) => ` ${ctx.label}: ${ctx.parsed} rooms`
          }
        }
      }
    }
  });
}

// ── Revenue Line Chart ──
function initRevenueChart() {
  const ctx = document.getElementById('revenueChart');
  if (!ctx) return;

  const labels = [
    'May 1','May 3','May 6','May 8','May 11',
    'May 13','May 16','May 18','May 20'
  ];

  const data = [5000, 9000, 7000, 10000, 8000, 13000, 19000, 15000, 18750];

  new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: 'Revenue ($)',
        data,
        borderColor: '#1d4ed8',
        backgroundColor: 'rgba(29,78,216,0.08)',
        borderWidth: 2.5,
        pointBackgroundColor: '#1d4ed8',
        pointRadius: 4,
        pointHoverRadius: 6,
        fill: true,
        tension: 0.4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) => ' $' + ctx.parsed.y.toLocaleString()
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: { color: '#f1f5f9' },
          ticks: {
            callback: (v) => '$' + (v / 1000) + 'K',
            font: { size: 11 }
          }
        },
        x: {
          grid: { display: false },
          ticks: { font: { size: 11 } }
        }
      }
    }
  });
}

// ── Quick Action buttons ──
document.querySelectorAll('.qa-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const label = btn.textContent.trim();
    alert(`"${label}" clicked — navigate to the relevant page here.`);
  });
});

// ── Init ──
document.addEventListener('DOMContentLoaded', () => {
  renderBookings();
  setTimeout(() => {
    initOccupancyChart();
    initRevenueChart();
  }, 300);
});