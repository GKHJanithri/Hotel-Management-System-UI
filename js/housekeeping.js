// ── Task data ──
const tasks = [
  {
    id: '#HK-1001', room: '101', roomType: 'Deluxe Room',
    floor: '1st', taskType: 'Room Cleaning',
    assigned: 'Nimal Perera', status: 'Completed',
    priority: 'Low', dueTime: 'May 20,2026 10:30 AM', notes: ''
  },
  {
    id: '#HK-1002', room: '102', roomType: 'Standard Room',
    floor: '1st', taskType: 'Room Cleaning',
    assigned: 'Kamal Silva', status: 'In Progress',
    priority: 'Medium', dueTime: 'May 20,2026 10:00 AM', notes: ''
  },
  {
    id: '#HK-1003', room: '103', roomType: 'Suite Room',
    floor: '1st', taskType: 'Deep Cleaning',
    assigned: 'Ayesh Pathirana', status: 'Pending',
    priority: 'High', dueTime: 'May 20,2026 01:00 PM', notes: ''
  },
  {
    id: '#HK-1004', room: '201', roomType: 'Deluxe Room',
    floor: '2nd', taskType: 'Deep Cleaning',
    assigned: 'Sumudu Bandara', status: 'Completed',
    priority: 'Low', dueTime: 'May 20,2026 10:30 AM', notes: ''
  },
  {
    id: '#HK-1005', room: '202', roomType: 'Standard Room',
    floor: '2nd', taskType: 'Room Cleaning',
    assigned: 'Pasindu Kaveesha', status: 'Overdue',
    priority: 'High', dueTime: 'May 19,2026 06:00 PM', notes: ''
  },
  {
    id: '#HK-1006', room: '203', roomType: 'Suite Room',
    floor: '2nd', taskType: 'Inspection',
    assigned: 'Amal Gamage', status: 'Pending',
    priority: 'Medium', dueTime: 'May 20,2026 02:00 PM', notes: ''
  },
  {
    id: '#HK-1007', room: '301', roomType: 'Double Room',
    floor: '3rd', taskType: 'Room Cleaning',
    assigned: 'Susil Kumara', status: 'Pending',
    priority: 'Low', dueTime: 'May 20,2026 03:00 PM', notes: ''
  }
];

// ── Staff data ──
const staffData = [
  { name: 'Nimal Perera',  tasks: '18/22', pct: 81 },
  { name: 'Kamal Silva',   tasks: '12/18', pct: 67 },
  { name: 'Amal Gamage',   tasks: '10/16', pct: 62 },
  { name: 'Susil Kumara',  tasks: '8/12',  pct: 67 }
];

// ── Supplies data ──
const suppliesData = [
  { icon: 'fa-solid fa-jug-detergent', name: 'Towels', qty: '120' },
  { icon: 'fa-solid fa-pump-soap',     name: 'Soap',   qty: '86' },
  { icon: 'fa-solid fa-spray-can',     name: 'Shampoo',qty: '60' },
  { icon: 'fa-solid fa-toilet-paper',  name: 'Tissue', qty: '90' },
  { icon: 'fa-solid fa-bottle-water',  name: 'Water Bottles', qty: '70' }
];

// ── DOM ──
const tasksBody    = document.getElementById('tasksBody');
const searchInput  = document.getElementById('searchInput');
const statusFilter = document.getElementById('statusFilter');
const floorFilter  = document.getElementById('floorFilter');
const priorityFilter = document.getElementById('priorityFilter');
const resultsText  = document.getElementById('resultsText');

// ── Update KPI cards ──
function updateKPIs() {
  const total      = tasks.length;
  const completed  = tasks.filter(t => t.status === 'Completed').length;
  const inProgress = tasks.filter(t => t.status === 'In Progress').length;
  const pending    = tasks.filter(t => t.status === 'Pending').length;
  const overdue    = tasks.filter(t => t.status === 'Overdue').length;

  document.getElementById('kpiTotal').textContent      = total;
  document.getElementById('kpiCompleted').textContent  = completed;
  document.getElementById('kpiInProgress').textContent = inProgress;
  document.getElementById('kpiPending').textContent    = pending;
  document.getElementById('kpiOverdue').textContent    = overdue;

  const pct = n => ((n / total) * 100).toFixed(2) + '%';
  document.getElementById('kpiCompletedPct').textContent  = pct(completed) + ' Completed';
  document.getElementById('kpiInProgressPct').textContent = pct(inProgress) + ' In Progress';
  document.getElementById('kpiPendingPct').textContent    = pct(pending) + ' Pending';
}

// ── Status class mapping ──
function getStatusClass(s) {
  const map = {
    'Completed':   'completed',
    'In Progress': 'in-progress',
    'Pending':     'pending',
    'Overdue':     'overdue'
  };
  return map[s] || 'pending';
}

function getPriorityClass(p) {
  return p.toLowerCase();
}

// ── Generate next task ID ──
function generateTaskId() {
  const nums = tasks.map(t => parseInt(t.id.replace('#HK-', ''), 10));
  return '#HK-' + (Math.max(...nums) + 1);
}

// ── Render tasks table ──
function renderTasks(data) {
  tasksBody.innerHTML = '';

  if (data.length === 0) {
    tasksBody.innerHTML = `
      <tr><td colspan="10"
        style="text-align:center;padding:30px;color:var(--text-muted);">
        No tasks found.
      </td></tr>`;
    resultsText.textContent = 'Showing 0 results';
    updateKPIs();
    return;
  }

  data.forEach(task => {
    const realIndex = tasks.indexOf(task);
    const sCls = getStatusClass(task.status);
    const pCls = getPriorityClass(task.priority);

    const row = document.createElement('tr');
    row.innerHTML = `
      <td class="task-id">${task.id}</td>
      <td>${task.room}</td>
      <td>${task.roomType}</td>
      <td>${task.floor}</td>
      <td>${task.taskType}</td>
      <td>${task.assigned}</td>
      <td><span class="hk-badge ${sCls}">${task.status}</span></td>
      <td><span class="priority-badge ${pCls}">${task.priority}</span></td>
      <td style="white-space:nowrap;">${task.dueTime}</td>
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
              <button class="dropdown-item complete-item"
                data-index="${realIndex}">
                <i class="fa-solid fa-circle-check"></i> Mark Complete
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
    tasksBody.appendChild(row);
  });

  resultsText.textContent =
    `Showing 1 to ${data.length} reservations`;
  attachListeners();
  updateKPIs();
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

  document.querySelectorAll('.complete-item').forEach(btn => {
    btn.addEventListener('click', () => {
      tasks[btn.dataset.index].status = 'Completed';
      closeAllDropdowns();
      applyFilters();
    });
  });

  document.querySelectorAll('.delete-item').forEach(btn => {
    btn.addEventListener('click', () => {
      const i = btn.dataset.index;
      if (confirm(`Delete task ${tasks[i].id}?`)) {
        tasks.splice(i, 1);
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

// ── Tabs ──
let activeTab = 'all';

document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn')
      .forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeTab = btn.dataset.tab;
    applyFilters();
  });
});

// ── Filters ──
function applyFilters() {
  const search   = searchInput.value.trim().toLowerCase();
  const status   = statusFilter.value;
  const floor    = floorFilter.value;
  const priority = priorityFilter.value;

  let data = [...tasks];

  if (activeTab === 'overdue') {
    data = data.filter(t => t.status === 'Overdue');
  } else if (activeTab === 'today') {
    data = data.filter(t => t.dueTime.includes('May 20'));
  }

  data = data.filter(t => {
    const matchSearch   = t.room.includes(search) ||
                          t.assigned.toLowerCase().includes(search) ||
                          t.id.toLowerCase().includes(search);
    const matchStatus   = !status   || t.status   === status;
    const matchFloor    = !floor    || t.floor    === floor;
    const matchPriority = !priority || t.priority === priority;
    return matchSearch && matchStatus && matchFloor && matchPriority;
  });

  renderTasks(data);
}

searchInput.addEventListener('input',     applyFilters);
statusFilter.addEventListener('change',   applyFilters);
floorFilter.addEventListener('change',    applyFilters);
priorityFilter.addEventListener('change', applyFilters);

/* ════════════════════════════
   ADD / EDIT TASK MODAL
════════════════════════════ */
const taskModal     = document.getElementById('taskModal');
const taskForm      = document.getElementById('taskForm');
const modalTitle    = document.getElementById('modalTitle');
const closeModalBtn = document.getElementById('closeModalBtn');
const cancelModalBtn= document.getElementById('cancelModalBtn');
const editTaskIndex = document.getElementById('editTaskIndex');

document.getElementById('addTaskBtn').addEventListener('click', () => {
  modalTitle.textContent = 'Add New Task';
  taskForm.reset();
  document.getElementById('taskId').value = generateTaskId();
  editTaskIndex.value = '';
  openModal(taskModal);
});

function openEditModal(index) {
  const t = tasks[index];
  modalTitle.textContent = 'Edit Task';

  document.getElementById('taskId').value       = t.id;
  document.getElementById('taskRoom').value     = t.room;
  document.getElementById('taskRoomType').value = t.roomType;
  document.getElementById('taskFloor').value    = t.floor;
  document.getElementById('taskType').value     = t.taskType;
  document.getElementById('taskAssigned').value = t.assigned;
  document.getElementById('taskStatus').value   = t.status;
  document.getElementById('taskPriority').value = t.priority;
  document.getElementById('taskNotes').value    = t.notes || '';
  editTaskIndex.value = index;
  openModal(taskModal);
}

closeModalBtn.addEventListener('click',  () => closeModal(taskModal));
cancelModalBtn.addEventListener('click', () => closeModal(taskModal));
taskModal.addEventListener('click', (e) => {
  if (e.target === taskModal) closeModal(taskModal);
});

taskForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const room     = document.getElementById('taskRoom').value.trim();
  const roomType = document.getElementById('taskRoomType').value;
  const floor    = document.getElementById('taskFloor').value;
  const taskType = document.getElementById('taskType').value;
  const assigned = document.getElementById('taskAssigned').value;
  const status   = document.getElementById('taskStatus').value;
  const priority = document.getElementById('taskPriority').value;
  const dueRaw   = document.getElementById('taskDueTime').value;
  const notes    = document.getElementById('taskNotes').value.trim();

  if (!room || !roomType || !floor || !taskType ||
      !assigned || !status || !priority) {
    alert('Please fill in all required fields.');
    return;
  }

  const formatDue = (raw) => {
    if (!raw) return '';
    const d = new Date(raw);
    return d.toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric'
    }) + ' ' + d.toLocaleTimeString('en-US', {
      hour: '2-digit', minute: '2-digit'
    });
  };

  const taskData = {
    id: document.getElementById('taskId').value,
    room, roomType, floor, taskType, assigned,
    status, priority, notes,
    dueTime: formatDue(dueRaw)
  };

  const idx = editTaskIndex.value;
  if (idx !== '') {
    tasks[idx] = taskData;
  } else {
    tasks.push(taskData);
  }

  closeModal(taskModal);
  applyFilters();
});

/* ════════════════════════════
   VIEW TASK MODAL
════════════════════════════ */
const viewModal     = document.getElementById('viewModal');
const viewBody      = document.getElementById('viewBody');
const closeViewBtn  = document.getElementById('closeViewBtn');
const closeViewBtn2 = document.getElementById('closeViewBtn2');
const editFromView  = document.getElementById('editFromViewBtn');
let currentViewIndex = null;

function openViewModal(index) {
  currentViewIndex = index;
  const t    = tasks[index];
  const sCls = getStatusClass(t.status);
  const pCls = getPriorityClass(t.priority);

  viewBody.innerHTML = `
    <div class="view-row">
      <div class="view-field">
        <span class="view-label">Task ID</span>
        <span class="view-value">${t.id}</span>
      </div>
      <div class="view-field">
        <span class="view-label">Room No.</span>
        <span class="view-value">${t.room}</span>
      </div>
    </div>
    <div class="view-row">
      <div class="view-field">
        <span class="view-label">Room Type</span>
        <span class="view-value">${t.roomType}</span>
      </div>
      <div class="view-field">
        <span class="view-label">Floor</span>
        <span class="view-value">${t.floor}</span>
      </div>
    </div>
    <div class="view-row">
      <div class="view-field">
        <span class="view-label">Task Type</span>
        <span class="view-value">${t.taskType}</span>
      </div>
      <div class="view-field">
        <span class="view-label">Assigned To</span>
        <span class="view-value">${t.assigned}</span>
      </div>
    </div>
    <div class="view-row">
      <div class="view-field">
        <span class="view-label">Status</span>
        <span class="view-value">
          <span class="hk-badge ${sCls}">${t.status}</span>
        </span>
      </div>
      <div class="view-field">
        <span class="view-label">Priority</span>
        <span class="view-value">
          <span class="priority-badge ${pCls}">${t.priority}</span>
        </span>
      </div>
    </div>
    <div class="view-field">
      <span class="view-label">Due Time</span>
      <span class="view-value">${t.dueTime}</span>
    </div>
    ${t.notes ? `
    <div class="view-field">
      <span class="view-label">Notes</span>
      <span class="view-value">${t.notes}</span>
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
    [taskModal, viewModal].forEach(m => {
      if (m.classList.contains('show')) closeModal(m);
    });
  }
});

/* ════════════════════════════
   QUICK ACTIONS
════════════════════════════ */
document.getElementById('qaAssign').addEventListener('click', () => {
  modalTitle.textContent = 'Assign Task';
  taskForm.reset();
  document.getElementById('taskId').value = generateTaskId();
  editTaskIndex.value = '';
  openModal(taskModal);
});

['qaMarkClean', 'qaCreateReq', 'qaSchedule', 'qaMaintenance']
  .forEach(id => {
    document.getElementById(id).addEventListener('click', () => {
      alert(`${document.getElementById(id)
        .querySelector('span').textContent.trim()} — coming soon!`);
    });
  });

/* ════════════════════════════
   RENDER STAFF
════════════════════════════ */
function renderStaff() {
  const list = document.getElementById('staffList');
  list.innerHTML = '';

  staffData.forEach(s => {
    const initials = s.name.split(' ')
      .map(w => w[0]).join('').slice(0, 2).toUpperCase();
    const item = document.createElement('div');
    item.className = 'staff-item';
    item.innerHTML = `
      <div class="staff-header">
        <div class="staff-avatar">${initials}</div>
        <div class="staff-info">
          <p class="staff-name">${s.name}</p>
          <p class="staff-tasks">${s.tasks} tasks</p>
        </div>
        <span class="staff-pct">${s.pct}%</span>
      </div>
      <div class="staff-bar-wrap">
        <div class="staff-bar" style="width:${s.pct}%;"></div>
      </div>
    `;
    list.appendChild(item);
  });
}

/* ════════════════════════════
   RENDER SUPPLIES
════════════════════════════ */
function renderSupplies() {
  const list = document.getElementById('suppliesList');
  list.innerHTML = '';

  suppliesData.forEach(s => {
    const item = document.createElement('div');
    item.className = 'supply-item';
    item.innerHTML = `
      <div class="supply-icon"><i class="${s.icon}"></i></div>
      <p class="supply-name">${s.name}</p>
      <p class="supply-qty">${s.qty}</p>
    `;
    list.appendChild(item);
  });
}

/* ════════════════════════════
   DONUT CHART
════════════════════════════ */
function initDonutChart() {
  const ctx = document.getElementById('roomStatusChart');
  if (!ctx) return;

  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Clean', 'Dirty', 'In Progress', 'Out of Service'],
      datasets: [{
        data: [45, 18, 12, 5],
        backgroundColor: ['#22c55e', '#f59e0b', '#3b82f6', '#ef4444'],
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

/* ════════════════════════════
   INIT
════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  renderStaff();
  renderSupplies();
  setTimeout(initDonutChart, 300);
});

applyFilters();