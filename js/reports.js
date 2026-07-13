// ── Report list data ──
const reportList = [
  {
    name: 'Revenue Report',
    desc: 'Daily revenue summary',
    dateRange: 'May 20,2026 - May 21,2026',
    generatedOn: 'May 20,2026 10:30 AM',
    format: 'PDF'
  },
  {
    name: 'Occupancy Report',
    desc: 'Room occupancy statistics',
    dateRange: 'May 20,2026 - May 21,2026',
    generatedOn: 'May 20,2026 10:30 AM',
    format: 'Excel'
  },
  {
    name: 'Reservation Report',
    desc: 'Reservation summary',
    dateRange: 'May 20,2026 - May 21,2026',
    generatedOn: 'May 20,2026 10:30 AM',
    format: 'PDF'
  },
  {
    name: 'Housekeeping Report',
    desc: 'Housekeeping status',
    dateRange: 'May 20,2026 - May 21,2026',
    generatedOn: 'May 20,2026 10:30 AM',
    format: 'Excel'
  },
  {
    name: 'POS Sales Report',
    desc: 'Point of sale summary',
    dateRange: 'May 20,2026 - May 21,2026',
    generatedOn: 'May 20,2026 10:30 AM',
    format: 'Excel'
  }
];

/* ════════════════════════════
   RENDER REPORT LIST TABLE
════════════════════════════ */
function renderReportList() {
  const tbody = document.getElementById('reportListBody');
  if (!tbody) return;

  // clear existing rows
  tbody.innerHTML = '';

  reportList.forEach((rep, i) => {
    const fmtCls = rep.format === 'PDF' ? 'pdf' : 'excel';
    const fmtIcon = rep.format === 'PDF'
      ? '<i class="fa-solid fa-file-pdf"></i>'
      : '<i class="fa-solid fa-file-excel"></i>';

    const row = document.createElement('tr');
    row.innerHTML = `
      <td style="font-weight:600;">${rep.name}</td>
      <td style="color:var(--text-muted);">${rep.desc}</td>
      <td style="white-space:nowrap;">${rep.dateRange}</td>
      <td style="white-space:nowrap;">${rep.generatedOn}</td>
      <td>
        <span class="format-badge ${fmtCls}">
          ${fmtIcon} ${rep.format}
        </span>
      </td>
      <td>
        <div class="rep-action-cell">
          <button class="rep-action-btn download-btn"
            title="Download" data-index="${i}">
            <i class="fa-solid fa-download"></i>
          </button>
          <button class="rep-action-btn view-rep-btn"
            title="View" data-index="${i}">
            <i class="fa-regular fa-eye"></i>
          </button>
        </div>
      </td>
    `;
    tbody.appendChild(row);
  });

  // Attach listeners
  document.querySelectorAll('.download-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const rep = reportList[btn.dataset.index];
      // Simulate CSV download
      const csv = `Report Name,Description,Date Range,Format\n` +
                  `${rep.name},${rep.desc},${rep.dateRange},${rep.format}`;
      const blob = new Blob([csv], { type: 'text/csv' });
      const url  = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = rep.name.replace(/\s+/g, '-').toLowerCase() + '.csv';
      link.click();
      URL.revokeObjectURL(url);
    });
  });

  document.querySelectorAll('.view-rep-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const rep = reportList[btn.dataset.index];
      alert(`Viewing: ${rep.name}\n${rep.desc}\nDate Range: ${rep.dateRange}\nGenerated: ${rep.generatedOn}\nFormat: ${rep.format}`);
    });
  });
}

/* ════════════════════════════
   REVENUE DONUT CHART
════════════════════════════ */
function initRevenueDonut() {
  const ctx = document.getElementById('revenueDonutChart');
  if (!ctx) return;

  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: [
        'Room Bookings',
        'Food & Beverages',
        'Spa & Wellness',
        'Laundry Service',
        'Other Services'
      ],
      datasets: [{
        data: [59, 18, 10, 6, 7],
        backgroundColor: [
          '#2563eb',
          '#059669',
          '#d97706',
          '#7c3aed',
          '#ef4444'
        ],
        borderWidth: 2,
        borderColor: '#fff',
        hoverOffset: 6
      }]
    },
    options: {
      responsive: false,
      cutout: '60%',
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) => ` ${ctx.label}: ${ctx.parsed}%`
          }
        }
      }
    }
  });
}

/* ════════════════════════════
   OCCUPIED LINE CHART
════════════════════════════ */
function initOccupiedLineChart() {
  const ctx = document.getElementById('occupiedLineChart');
  if (!ctx) return;

  const labels = [
    'May 1','May 3','May 5','May 7','May 9','May 11',
    'May 13','May 15','May 16','May 18','May 20'
  ];
  const data = [6000, 8000, 7000, 9000, 10000, 11000,
                13000, 16000, 14000, 18000, 20000];

  new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: 'Occupied Rate',
        data,
        borderColor: '#059669',
        backgroundColor: 'rgba(5,150,105,0.08)',
        borderWidth: 2.5,
        pointBackgroundColor: '#059669',
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
            label: (ctx) => ' ' + ctx.parsed.y.toLocaleString()
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: { color: '#f1f5f9' },
          ticks: {
            callback: v => (v / 1000).toFixed(0) + 'K',
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

/* ════════════════════════════
   REVENUE BAR CHART
════════════════════════════ */
function initRevenueBarChart() {
  const ctx = document.getElementById('revenueBarChart');
  if (!ctx) return;

  const labels = [
    '14 May','15 May','16 May','17 May',
    '18 May','19 May','20 May'
  ];
  const data = [95000, 110000, 98000, 120000, 105000, 130000, 160000];

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'Revenue (Rs.)',
        data,
        backgroundColor: '#059669',
        borderRadius: 6,
        maxBarThickness: 32
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) => ' Rs.' + ctx.parsed.y.toLocaleString()
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: { color: '#f1f5f9' },
          ticks: {
            callback: v => (v / 1000).toFixed(0) + 'K',
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

/* ════════════════════════════
   QUICK ACTIONS (enhanced behavior)
════════════════════════════ */

function scrollToAndFlash(el) {
  if (!el) return;
  el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  el.classList.add('flash-highlight');
  setTimeout(() => el.classList.remove('flash-highlight'), 1200);
}

// Revenue -> scroll to revenue donut card
const qaRevenueBtn = document.getElementById('qaRevenue');
if (qaRevenueBtn) qaRevenueBtn.addEventListener('click', () => {
  const card = document.getElementById('revenueDonutChart')?.closest('.card');
  // set filter to month for quick view
  const sel = document.getElementById('revenueDonutFilter'); if (sel) sel.value = 'month';
  scrollToAndFlash(card || document.querySelector('.charts-row'));
});

// Occupied -> scroll to occupied chart
const qaOccupiedBtn = document.getElementById('qaOccupied');
if (qaOccupiedBtn) qaOccupiedBtn.addEventListener('click', () => {
  const card = document.getElementById('occupiedLineChart')?.closest('.card');
  const sel = document.getElementById('occupiedFilter'); if (sel) sel.value = 'month';
  scrollToAndFlash(card || document.querySelector('.charts-row'));
});

// Reservation -> generate and download a reservation CSV (combined)
const qaReservationBtn = document.getElementById('qaReservation');
if (qaReservationBtn) qaReservationBtn.addEventListener('click', () => {
  const rows = reportList.filter(r => /reservation/i.test(r.name));
  if (!rows.length) { alert('No reservation reports available'); return; }
  let csv = 'Report Name,Description,Date Range,Generated On,Format\n';
  rows.forEach(r => csv += `${r.name},${r.desc},${r.dateRange},${r.generatedOn},${r.format}\n`);
  const blob = new Blob([csv], { type: 'text/csv' });
  const url  = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'reservation-reports.csv';
  link.click();
  URL.revokeObjectURL(url);
});

// Custom -> open modal to create report
const qaCustomBtn = document.getElementById('qaCustom');
const customModal = document.getElementById('customReportModal');
const closeCustomModal = document.getElementById('closeCustomModal');
const cancelCustomReport = document.getElementById('cancelCustomReport');
if (qaCustomBtn && customModal) qaCustomBtn.addEventListener('click', () => {
  customModal.setAttribute('aria-hidden', 'false');
});
if (closeCustomModal) closeCustomModal.addEventListener('click', () => customModal.setAttribute('aria-hidden', 'true'));
if (cancelCustomReport) cancelCustomReport.addEventListener('click', () => customModal.setAttribute('aria-hidden', 'true'));

// clicking overlay closes modal
customModal?.addEventListener('click', (e) => {
  if (e.target === customModal) customModal.setAttribute('aria-hidden', 'true');
});

// handle generate
const generateCustomReport = document.getElementById('generateCustomReport');
if (generateCustomReport) generateCustomReport.addEventListener('click', () => {
  const name = document.getElementById('customName')?.value?.trim() || 'Custom Report';
  const dr = document.getElementById('customDateRange')?.value?.trim() || 'Custom Range';
  const fmt = document.getElementById('customFormat')?.value || 'PDF';
  const now = new Date();
  const rep = {
    name,
    desc: 'Custom generated report',
    dateRange: dr,
    generatedOn: now.toLocaleString(),
    format: fmt
  };
  reportList.unshift(rep);
  // re-render table and close
  renderReportList();
  customModal.setAttribute('aria-hidden', 'true');
  // flash the report list
  const rlCard = document.querySelector('.report-list-card');
  scrollToAndFlash(rlCard);
});

// close modal on Escape
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') customModal?.setAttribute('aria-hidden', 'true'); });

/* ════════════════════════════
   FILTER CHANGE HANDLERS
════════════════════════════ */
document.getElementById('revenueDonutFilter')?.addEventListener('change', (e) => {
  alert(`Revenue donut filter: ${e.target.options[e.target.selectedIndex].text}`);
});

document.getElementById('occupiedFilter')?.addEventListener('change', (e) => {
  alert(`Occupied filter: ${e.target.options[e.target.selectedIndex].text}`);
});

document.getElementById('revenueBarFilter')?.addEventListener('change', (e) => {
  alert(`Revenue bar filter: ${e.target.options[e.target.selectedIndex].text}`);
});

/* ════════════════════════════
   INIT
════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  renderReportList();
  setTimeout(() => {
    initRevenueDonut();
    initOccupiedLineChart();
    initRevenueBarChart();
  }, 300);
});