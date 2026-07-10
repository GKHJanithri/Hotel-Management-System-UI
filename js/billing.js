// ── Invoice data ──
const invoices = [
  {
    no: 'INV-001', guest: 'Nimal Perera',
    room: '101', checkOut: 'May 20,2026',
    amount: 18750.00, status: 'Paid', notes: ''
  },
  {
    no: 'INV-002', guest: 'Kamal Silva',
    room: '102', checkOut: 'May 20,2026',
    amount: 24750.00, status: 'Pending', notes: ''
  },
  {
    no: 'INV-003', guest: 'Ayesh Pathirana',
    room: '103', checkOut: 'May 20,2026',
    amount: 12400.00, status: 'Paid', notes: ''
  },
  {
    no: 'INV-004', guest: 'Sumudu Bandara',
    room: '201', checkOut: 'May 20,2026',
    amount: 31200.00, status: 'Overdue', notes: ''
  },
  {
    no: 'INV-005', guest: 'Pasindu Kaveesha',
    room: '202', checkOut: 'May 19,2026',
    amount: 15900.00, status: 'Paid', notes: ''
  },
  {
    no: 'INV-006', guest: 'Amal Gamage',
    room: '203', checkOut: 'May 20,2026',
    amount: 29700.00, status: 'Pending', notes: ''
  },
  {
    no: 'INV-007', guest: 'Susil Kumara',
    room: '301', checkOut: 'May 20,2026',
    amount: 20500.00, status: 'Overdue', notes: ''
  }
];

// ── DOM ──
const invoicesBody = document.getElementById('invoicesBody');
const searchInput  = document.getElementById('searchInput');
const statusFilter = document.getElementById('statusFilter');
const resultsText  = document.getElementById('resultsText');

// ── Format currency ──
function fmt(amount) {
  return 'Rs.' + amount.toLocaleString('en-LK', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

// ── Generate next invoice number ──
function generateInvNo() {
  const nums = invoices.map(i => parseInt(i.no.replace('INV-', ''), 10));
  return 'INV-' + String(Math.max(...nums) + 1).padStart(3, '0');
}

// ── Status class ──
function getStatusClass(s) {
  const map = { 'Paid': 'paid', 'Pending': 'pending', 'Overdue': 'overdue' };
  return map[s] || 'pending';
}

// ── Update KPI cards ──
function updateKPIs() {
  const total   = invoices.length;
  const paid    = invoices.filter(i => i.status === 'Paid').length;
  const pending = invoices.filter(i => i.status === 'Pending').length;
  const overdue = invoices.filter(i => i.status === 'Overdue').length;

  document.getElementById('kpiTotal').textContent   = total;
  document.getElementById('kpiPaid').textContent    = paid;
  document.getElementById('kpiPending').textContent = pending;
  document.getElementById('kpiOverdue').textContent = overdue;

  const pct = n => ((n / total) * 100).toFixed(2) + '% of total';
  document.getElementById('kpiPaidPct').textContent    = pct(paid);
  document.getElementById('kpiPendingPct').textContent = pct(pending);
  document.getElementById('kpiOverduePct').textContent = pct(overdue);

  // Summary panel
  document.getElementById('sumTotal').textContent   = total;
  document.getElementById('sumPaid').textContent    = paid;
  document.getElementById('sumPending').textContent = pending;
  document.getElementById('sumOverdue').textContent = overdue;
}

// ── Render table ──
function renderInvoices(data) {
  invoicesBody.innerHTML = '';

  if (data.length === 0) {
    invoicesBody.innerHTML = `
      <tr><td colspan="7"
        style="text-align:center;padding:30px;color:var(--text-muted);">
        No invoices found.
      </td></tr>`;
    resultsText.textContent = 'Showing 0 results';
    updateKPIs();
    renderRecent();
    return;
  }

  data.forEach(inv => {
    const realIndex = invoices.indexOf(inv);
    const sCls = getStatusClass(inv.status);

    const row = document.createElement('tr');
    row.innerHTML = `
      <td class="inv-no">${inv.no}</td>
      <td>${inv.guest}</td>
      <td>${inv.room}</td>
      <td>${inv.checkOut}</td>
      <td>${fmt(inv.amount)}</td>
      <td>
        <span class="pay-badge ${sCls}">${inv.status}</span>
      </td>
      <td>
        <div class="action-cell">
          <button class="action-btn view-btn"
            title="View" data-index="${realIndex}">
            <i class="fa-regular fa-eye"></i>
          </button>
          <div class="more-wrap">
            <button class="action-btn more-btn"
              title="More" data-index="${realIndex}">
              <i class="fa-solid fa-ellipsis-vertical"></i>
            </button>
            <div class="more-dropdown" id="dropdown-${realIndex}">
              <button class="dropdown-item edit-item"
                data-index="${realIndex}">
                <i class="fa-solid fa-pen"></i> Edit
              </button>
              <button class="dropdown-item print-item"
                data-index="${realIndex}">
                <i class="fa-solid fa-print"></i> Print
              </button>
              <button class="dropdown-item mark-paid-item"
                data-index="${realIndex}">
                <i class="fa-solid fa-circle-check"></i> Mark as Paid
              </button>
              <button class="dropdown-item delete-item"
                data-index="${realIndex}">
                <i class="fa-solid fa-trash"></i> Delete
              </button>
            </div>
          </div>
        </div>
      </td>
    `;
    invoicesBody.appendChild(row);
  });

  resultsText.textContent = `Showing 1 to ${data.length} reservations`;
  attachListeners();
  updateKPIs();
  renderRecent();
}

// ── Attach row listeners ──
function attachListeners() {

  document.querySelectorAll('.view-btn').forEach(btn => {
    btn.addEventListener('click', () => openViewModal(btn.dataset.index));
  });

  document.querySelectorAll('.more-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const dd = document.getElementById(`dropdown-${btn.dataset.index}`);
      document.querySelectorAll('.more-dropdown').forEach(d => {
        if (d !== dd) d.classList.remove('show');
      });
      dd.classList.toggle('show');
    });
  });

  document.querySelectorAll('.edit-item').forEach(btn => {
    btn.addEventListener('click', () => {
      openEditModal(btn.dataset.index);
      closeAllDropdowns();
    });
  });

  document.querySelectorAll('.print-item').forEach(btn => {
    btn.addEventListener('click', () => {
      alert(`Printing ${invoices[btn.dataset.index].no}...`);
      closeAllDropdowns();
    });
  });

  document.querySelectorAll('.mark-paid-item').forEach(btn => {
    btn.addEventListener('click', () => {
      invoices[btn.dataset.index].status = 'Paid';
      closeAllDropdowns();
      applyFilters();
    });
  });

  document.querySelectorAll('.delete-item').forEach(btn => {
    btn.addEventListener('click', () => {
      const i = btn.dataset.index;
      if (confirm(`Delete invoice ${invoices[i].no}?`)) {
        invoices.splice(i, 1);
        applyFilters();
      }
      closeAllDropdowns();
    });
  });
}

function closeAllDropdowns() {
  document.querySelectorAll('.more-dropdown')
    .forEach(d => d.classList.remove('show'));
}

document.addEventListener('click', closeAllDropdowns);

// ── Filters ──
function applyFilters() {
  const search = searchInput.value.trim().toLowerCase();
  const status = statusFilter.value;

  const filtered = invoices.filter(inv => {
    const matchSearch = inv.no.toLowerCase().includes(search) ||
                        inv.guest.toLowerCase().includes(search);
    const matchStatus = !status || inv.status === status;
    return matchSearch && matchStatus;
  });

  renderInvoices(filtered);
}

searchInput.addEventListener('input',   applyFilters);
statusFilter.addEventListener('change', applyFilters);

// ── Render Recent Invoices ──
function renderRecent() {
  const list = document.getElementById('recentList');
  list.innerHTML = '';

  const recent = [...invoices]
    .sort((a, b) => parseInt(b.no.replace('INV-', '')) -
                    parseInt(a.no.replace('INV-', '')))
    .slice(0, 3);

  recent.forEach(inv => {
    const sCls = getStatusClass(inv.status);
    const item = document.createElement('div');
    item.className = 'recent-item';
    item.innerHTML = `
      <div class="recent-left">
        <p class="recent-inv-no">${inv.no}</p>
        <p class="recent-date">${inv.checkOut}</p>
      </div>
      <span class="recent-room">Room ${inv.room}</span>
      <span class="recent-amount">${fmt(inv.amount)}</span>
      <span class="pay-badge ${sCls}">${inv.status}</span>
    `;
    list.appendChild(item);
  });
}

/* ════════════════════════════
   CREATE / EDIT MODAL
════════════════════════════ */
const invoiceModal  = document.getElementById('invoiceModal');
const invoiceForm   = document.getElementById('invoiceForm');
const modalTitle    = document.getElementById('modalTitle');
const closeModalBtn = document.getElementById('closeModalBtn');
const cancelModalBtn= document.getElementById('cancelModalBtn');
const editInvIndex  = document.getElementById('editInvIndex');

function openAddModal() {
  modalTitle.textContent = 'Create Invoice';
  invoiceForm.reset();
  document.getElementById('invNo').value = generateInvNo();
  editInvIndex.value = '';
  openModal(invoiceModal);
}

function openEditModal(index) {
  const inv = invoices[index];
  modalTitle.textContent = 'Edit Invoice';

  document.getElementById('invNo').value       = inv.no;
  document.getElementById('invGuest').value    = inv.guest;
  document.getElementById('invRoom').value     = inv.room;
  document.getElementById('invAmount').value   = inv.amount;
  document.getElementById('invStatus').value   = inv.status;
  document.getElementById('invNotes').value    = inv.notes || '';

  // Convert date for input
  const months = ['Jan','Feb','Mar','Apr','May','Jun',
                  'Jul','Aug','Sep','Oct','Nov','Dec'];
  const parts = inv.checkOut.replace(',', '').split(' ');
  if (parts.length === 3) {
    const m = String(months.indexOf(parts[0]) + 1).padStart(2, '0');
    document.getElementById('invCheckOut').value =
      `${parts[2]}-${m}-${parts[1].padStart(2, '0')}`;
  }

  editInvIndex.value = index;
  openModal(invoiceModal);
}

closeModalBtn.addEventListener('click',  () => closeModal(invoiceModal));
cancelModalBtn.addEventListener('click', () => closeModal(invoiceModal));
invoiceModal.addEventListener('click', (e) => {
  if (e.target === invoiceModal) closeModal(invoiceModal);
});

invoiceForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const guest     = document.getElementById('invGuest').value.trim();
  const room      = document.getElementById('invRoom').value.trim();
  const checkOutR = document.getElementById('invCheckOut').value;
  const amount    = parseFloat(document.getElementById('invAmount').value);
  const status    = document.getElementById('invStatus').value;
  const notes     = document.getElementById('invNotes').value.trim();

  if (!guest || !room || !checkOutR || isNaN(amount) || !status) {
    alert('Please fill in all required fields.');
    return;
  }

  // Format date to display
  const d = new Date(checkOutR);
  const months = ['Jan','Feb','Mar','Apr','May','Jun',
                  'Jul','Aug','Sep','Oct','Nov','Dec'];
  const displayDate =
    months[d.getMonth()] + ' ' + d.getDate() + ',' + d.getFullYear();

  const invData = {
    no: document.getElementById('invNo').value,
    guest, room,
    checkOut: displayDate,
    amount, status, notes
  };

  const idx = editInvIndex.value;
  if (idx !== '') {
    invoices[idx] = invData;
  } else {
    invoices.push(invData);
  }

  closeModal(invoiceModal);
  applyFilters();
});

// Create Invoice buttons
document.getElementById('createInvoiceBtn').addEventListener('click', openAddModal);
document.getElementById('qaCreate').addEventListener('click', openAddModal);

// Other quick actions
['qaTemplate', 'qaPayment', 'qaDiscount', 'qaTax'].forEach(id => {
  document.getElementById(id).addEventListener('click', () => {
    const label = document.getElementById(id)
      .querySelector('span').textContent.trim();
    alert(`${label} — coming soon!`);
  });
});

/* ════════════════════════════
   VIEW MODAL
════════════════════════════ */
const viewModal     = document.getElementById('viewModal');
const viewBody      = document.getElementById('viewBody');
const viewModalTitle= document.getElementById('viewModalTitle');
const closeViewBtn  = document.getElementById('closeViewBtn');
const closeViewBtn2 = document.getElementById('closeViewBtn2');
const editFromView  = document.getElementById('editFromViewBtn');
const printInvBtn   = document.getElementById('printInvBtn');
let currentViewIndex = null;

function openViewModal(index) {
  currentViewIndex = index;
  const inv  = invoices[index];
  const sCls = getStatusClass(inv.status);

  viewModalTitle.textContent = `${inv.no} Details`;

  viewBody.innerHTML = `
    <div class="view-row">
      <div class="view-field">
        <span class="view-label">Invoice No.</span>
        <span class="view-value">${inv.no}</span>
      </div>
      <div class="view-field">
        <span class="view-label">Guest Name</span>
        <span class="view-value">${inv.guest}</span>
      </div>
    </div>
    <div class="view-row">
      <div class="view-field">
        <span class="view-label">Room No.</span>
        <span class="view-value">${inv.room}</span>
      </div>
      <div class="view-field">
        <span class="view-label">Check Out</span>
        <span class="view-value">${inv.checkOut}</span>
      </div>
    </div>
    <div class="view-row">
      <div class="view-field">
        <span class="view-label">Amount</span>
        <span class="view-value">${fmt(inv.amount)}</span>
      </div>
      <div class="view-field">
        <span class="view-label">Payment Status</span>
        <span class="view-value">
          <span class="pay-badge ${sCls}">${inv.status}</span>
        </span>
      </div>
    </div>
    ${inv.notes ? `
    <div class="view-field">
      <span class="view-label">Notes</span>
      <span class="view-value">${inv.notes}</span>
    </div>` : ''}
  `;

  openModal(viewModal);
}

closeViewBtn.addEventListener('click',  () => closeModal(viewModal));
closeViewBtn2.addEventListener('click', () => closeModal(viewModal));
viewModal.addEventListener('click', (e) => {
  if (e.target === viewModal) closeModal(viewModal);
});

editFromView.addEventListener('click', () => {
  closeModal(viewModal);
  openEditModal(currentViewIndex);
});

printInvBtn.addEventListener('click', () => {
  alert(`Printing ${invoices[currentViewIndex].no}...`);
});

/* ════════════════════════════
   DOWNLOAD REPORT
════════════════════════════ */
document.getElementById('downloadReportBtn').addEventListener('click', () => {
  const headers = 'Invoice No.,Guest,Room,Check Out,Amount,Status';
  const rows = invoices.map(i =>
    `${i.no},${i.guest},${i.room},${i.checkOut},${i.amount},${i.status}`
  ).join('\n');
  const csv = headers + '\n' + rows;
  const blob = new Blob([csv], { type: 'text/csv' });
  const url  = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'billing-report.csv';
  link.click();
  URL.revokeObjectURL(url);
});

// View All link
document.getElementById('viewAllLink').addEventListener('click', (e) => {
  e.preventDefault();
  statusFilter.value = '';
  searchInput.value  = '';
  applyFilters();
});

/* ════════════════════════════
   MODAL HELPERS
════════════════════════════ */
function openModal(modal) {
  modal.classList.add('show');
  document.body.style.overflow = 'hidden';
}

function closeModal(modal) {
  modal.classList.remove('show');
  document.body.style.overflow = '';
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    [invoiceModal, viewModal].forEach(m => {
      if (m.classList.contains('show')) closeModal(m);
    });
  }
});

/* ════════════════════════════
   INIT
════════════════════════════ */
applyFilters();