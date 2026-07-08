// ── Room data ──
const rooms = [
  { number:'101', type:'Single Room', floor:'1', beds:1, guests:2, price:24000, status:'Available',    notes:'' },
  { number:'102', type:'Single Room', floor:'1', beds:1, guests:2, price:24000, status:'Occupied',     notes:'' },
  { number:'103', type:'Double Room', floor:'1', beds:2, guests:4, price:35000, status:'Cleaning',     notes:'' },
  { number:'104', type:'Double Room', floor:'1', beds:2, guests:4, price:35000, status:'Occupied',     notes:'' },
  { number:'105', type:'Deluxe Room', floor:'1', beds:1, guests:3, price:30000, status:'Available',    notes:'' },
  { number:'106', type:'Single Room', floor:'1', beds:1, guests:2, price:24000, status:'Occupied',     notes:'' },
  { number:'107', type:'Suite',       floor:'1', beds:2, guests:4, price:35000, status:'Maintenance',  notes:'' },
  { number:'108', type:'Single Room', floor:'1', beds:1, guests:2, price:24000, status:'Available',    notes:'' },
  { number:'201', type:'Deluxe Room', floor:'2', beds:1, guests:3, price:30000, status:'Available',    notes:'' },
  { number:'202', type:'Single Room', floor:'2', beds:1, guests:2, price:24000, status:'Available',    notes:'' },
  { number:'203', type:'Suite',       floor:'2', beds:2, guests:4, price:35000, status:'Occupied',     notes:'' },
  { number:'204', type:'Double Room', floor:'2', beds:2, guests:4, price:35000, status:'Cleaning',     notes:'' },
  { number:'205', type:'Single Room', floor:'2', beds:1, guests:2, price:24000, status:'Available',    notes:'' },
  { number:'206', type:'Double Room', floor:'2', beds:2, guests:4, price:35000, status:'Out of Service', notes:'' },
  { number:'301', type:'Suite',       floor:'3', beds:2, guests:4, price:50000, status:'Available',    notes:'' },
  { number:'302', type:'Double Room', floor:'3', beds:2, guests:4, price:35000, status:'Occupied',     notes:'' }
];

// ── DOM ──
const roomsGrid   = document.getElementById('roomsGrid');
const searchInput = document.getElementById('searchInput');
const typeFilter  = document.getElementById('typeFilter');
const statusFilter= document.getElementById('statusFilter');
const floorFilter = document.getElementById('floorFilter');
const resultsText = document.getElementById('resultsText');

// ── Status badge class ──
function getStatusClass(status) {
  const map = {
    'Available':     'available',
    'Occupied':      'occupied',
    'Cleaning':      'cleaning',
    'Maintenance':   'maintenance',
    'Out of Service':'out-service'
  };
  return map[status] || 'available';
}

// ── Format price ──
function formatPrice(p) {
  return 'Rs. ' + p.toLocaleString('en-LK') + '.00';
}

// ── Update KPI cards ──
function updateKPIs() {
  const total   = rooms.length;
  const avail   = rooms.filter(r => r.status === 'Available').length;
  const occ     = rooms.filter(r => r.status === 'Occupied').length;
  const out     = rooms.filter(r => r.status === 'Out of Service').length;
  const dirty   = rooms.filter(r => r.status === 'Cleaning').length;

  document.getElementById('kpiTotal').textContent     = total;
  document.getElementById('kpiAvailable').textContent = avail;
  document.getElementById('kpiOccupied').textContent  = occ;
  document.getElementById('kpiOutService').textContent= out;
  document.getElementById('kpiDirty').textContent     = dirty;

  const pct = (n) => ((n / total) * 100).toFixed(2) + '%';
  document.getElementById('kpiAvailablePct').textContent  = pct(avail);
  document.getElementById('kpiOccupiedPct').textContent   = pct(occ);
  document.getElementById('kpiOutServicePct').textContent = pct(out);
}

// ── Render Room Cards ──
function renderRooms(data) {
  roomsGrid.innerHTML = '';

  if (data.length === 0) {
    roomsGrid.innerHTML = `
      <div style="grid-column:1/-1;text-align:center;padding:40px;
        color:var(--text-muted);font-size:14px;">
        No rooms found.
      </div>`;
    resultsText.textContent = 'Showing 0 results';
    return;
  }

  data.forEach(room => {
    const realIndex = rooms.indexOf(room);
    const statusCls = getStatusClass(room.status);

    const card = document.createElement('div');
    card.className = 'room-card';
    card.innerHTML = `
      <div class="room-card-header">
        <span class="room-name">Room ${room.number}</span>
        <span class="room-badge ${statusCls}">${room.status}</span>
      </div>
      <p class="room-type">${room.type} | Floor ${room.floor}</p>
      <div class="room-specs">
        <span class="room-spec">
          <i class="fa-solid fa-bed"></i> ${room.beds} Bed
        </span>
        <span class="room-spec">
          <i class="fa-solid fa-users"></i> ${room.guests} Guests
        </span>
      </div>
      <p class="room-price">
        ${formatPrice(room.price)} <span>/ night</span>
      </p>
      <div class="room-card-actions">
        <button class="btn-view-details view-btn"
          data-index="${realIndex}">View Details</button>
        <button class="btn-update-status status-btn"
          data-index="${realIndex}">Update Status</button>
      </div>
    `;
    roomsGrid.appendChild(card);
  });

  resultsText.textContent = `Showing 1 to ${data.length} results`;
  attachCardListeners();
  updateKPIs();
}

// ── Attach card action listeners ──
function attachCardListeners() {
  document.querySelectorAll('.view-btn').forEach(btn => {
    btn.addEventListener('click', () => openViewModal(btn.dataset.index));
  });
  document.querySelectorAll('.status-btn').forEach(btn => {
    btn.addEventListener('click', () => openStatusModal(btn.dataset.index));
  });
}

// ── Filter logic ──
function applyFilters() {
  const search = searchInput.value.trim().toLowerCase();
  const type   = typeFilter.value;
  const status = statusFilter.value;
  const floor  = floorFilter.value;

  const filtered = rooms.filter(r => {
    const matchSearch = r.number.toLowerCase().includes(search) ||
                        r.type.toLowerCase().includes(search);
    const matchType   = !type   || r.type   === type;
    const matchStatus = !status || r.status === status;
    const matchFloor  = !floor  || r.floor  === floor;
    return matchSearch && matchType && matchStatus && matchFloor;
  });

  renderRooms(filtered);
}

searchInput.addEventListener('input',   applyFilters);
typeFilter.addEventListener('change',   applyFilters);
statusFilter.addEventListener('change', applyFilters);
floorFilter.addEventListener('change',  applyFilters);

/* ════════════════════════════
   TABS
════════════════════════════ */
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    if (btn.id === 'roomMapBtn') {
      window.location.href = 'roomMap.html';
      return;
    }

    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    document.getElementById('tabList').style.display = '';
  });
});

/* ════════════════════════════
   ADD / EDIT ROOM MODAL
════════════════════════════ */
const roomModal     = document.getElementById('roomModal');
const roomForm      = document.getElementById('roomForm');
const modalTitle    = document.getElementById('modalTitle');
const closeModalBtn = document.getElementById('closeModalBtn');
const cancelModalBtn= document.getElementById('cancelModalBtn');
const editRoomIndex = document.getElementById('editRoomIndex');

document.getElementById('addRoomBtn').addEventListener('click', () => {
  modalTitle.textContent = 'Add New Room';
  roomForm.reset();
  editRoomIndex.value = '';
  openModal(roomModal);
});

function openEditModal(index) {
  const r = rooms[index];
  modalTitle.textContent = 'Edit Room';

  document.getElementById('roomNumber').value = r.number;
  document.getElementById('roomType').value   = r.type;
  document.getElementById('roomFloor').value  = r.floor;
  document.getElementById('roomStatus').value = r.status;
  document.getElementById('roomBeds').value   = r.beds;
  document.getElementById('roomGuests').value = r.guests;
  document.getElementById('roomPrice').value  = r.price;
  document.getElementById('roomNotes').value  = r.notes || '';

  editRoomIndex.value = index;
  openModal(roomModal);
}

closeModalBtn.addEventListener('click',  () => closeModal(roomModal));
cancelModalBtn.addEventListener('click', () => closeModal(roomModal));
roomModal.addEventListener('click', (e) => {
  if (e.target === roomModal) closeModal(roomModal);
});

roomForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const number = document.getElementById('roomNumber').value.trim();
  const type   = document.getElementById('roomType').value;
  const floor  = document.getElementById('roomFloor').value;
  const status = document.getElementById('roomStatus').value;
  const beds   = parseInt(document.getElementById('roomBeds').value);
  const guests = parseInt(document.getElementById('roomGuests').value);
  const price  = parseFloat(document.getElementById('roomPrice').value);
  const notes  = document.getElementById('roomNotes').value.trim();

  if (!number || !type || !floor || !status || isNaN(beds) ||
      isNaN(guests) || isNaN(price)) {
    alert('Please fill in all required fields.');
    return;
  }

  const roomData = { number, type, floor, status, beds, guests, price, notes };
  const idx = editRoomIndex.value;

  if (idx !== '') {
    rooms[idx] = roomData;
  } else {
    rooms.push(roomData);
  }

  closeModal(roomModal);
  applyFilters();
});

/* ════════════════════════════
   VIEW ROOM MODAL
════════════════════════════ */
const viewModal     = document.getElementById('viewModal');
const viewBody      = document.getElementById('viewBody');
const viewModalTitle= document.getElementById('viewModalTitle');
const closeViewBtn  = document.getElementById('closeViewBtn');
const closeViewBtn2 = document.getElementById('closeViewBtn2');
const editFromView  = document.getElementById('editFromViewBtn');
let currentViewIndex = null;

function openViewModal(index) {
  currentViewIndex = index;
  const r = rooms[index];
  const statusCls = getStatusClass(r.status);

  viewModalTitle.textContent = `Room ${r.number} Details`;

  viewBody.innerHTML = `
    <div class="view-row">
      <div class="view-field">
        <span class="view-label">Room Number</span>
        <span class="view-value">${r.number}</span>
      </div>
      <div class="view-field">
        <span class="view-label">Room Type</span>
        <span class="view-value">${r.type}</span>
      </div>
    </div>
    <div class="view-row">
      <div class="view-field">
        <span class="view-label">Floor</span>
        <span class="view-value">Floor ${r.floor}</span>
      </div>
      <div class="view-field">
        <span class="view-label">Status</span>
        <span class="view-value">
          <span class="room-badge ${statusCls}">${r.status}</span>
        </span>
      </div>
    </div>
    <div class="view-row">
      <div class="view-field">
        <span class="view-label">Beds</span>
        <span class="view-value">${r.beds} Bed(s)</span>
      </div>
      <div class="view-field">
        <span class="view-label">Max Guests</span>
        <span class="view-value">${r.guests} Guests</span>
      </div>
    </div>
    <div class="view-field">
      <span class="view-label">Price per Night</span>
      <span class="view-value">${formatPrice(r.price)}</span>
    </div>
    ${r.notes ? `
    <div class="view-field">
      <span class="view-label">Notes</span>
      <span class="view-value">${r.notes}</span>
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

/* ════════════════════════════
   UPDATE STATUS MODAL
════════════════════════════ */
const statusModal     = document.getElementById('statusModal');
const closeStatusBtn  = document.getElementById('closeStatusBtn');
const cancelStatusBtn = document.getElementById('cancelStatusBtn');
const confirmStatusBtn= document.getElementById('confirmStatusBtn');
const statusRoomLabel = document.getElementById('statusRoomLabel');
const newStatusSelect = document.getElementById('newStatus');
let currentStatusIndex = null;

function openStatusModal(index) {
  currentStatusIndex = index;
  const r = rooms[index];
  statusRoomLabel.textContent = `Room ${r.number} — ${r.type}`;
  newStatusSelect.value = r.status;
  openModal(statusModal);
}

closeStatusBtn.addEventListener('click',  () => closeModal(statusModal));
cancelStatusBtn.addEventListener('click', () => closeModal(statusModal));
statusModal.addEventListener('click', (e) => {
  if (e.target === statusModal) closeModal(statusModal);
});

confirmStatusBtn.addEventListener('click', () => {
  if (currentStatusIndex === null) return;
  rooms[currentStatusIndex].status = newStatusSelect.value;
  closeModal(statusModal);
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
    [roomModal, viewModal, statusModal].forEach(m => {
      if (m.classList.contains('show')) closeModal(m);
    });
  }
});

// ── Initial render ──
applyFilters();