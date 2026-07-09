/* ==========================================================================
   Staff Management Page Logic
   Renders the staff table, department/shift filter dropdowns, the
   Departments summary card, and the Today's Shift card.
   Replace `staffData` / `departmentsData` / `todaysShiftData` with real
   API/database calls whenever ready.
   ========================================================================== */

const staffData = [
  { name: "Mala Perera",      department: "Front Desk",    shift: "Morning",  contact: "0715789526", status: "On Duty" },
  { name: "Nimal Perera",     department: "Kitchen",       shift: "Night",    contact: "0778542591", status: "On Duty" },
  { name: "Ayesh Pathirana",  department: "Housekeeping",  shift: "Evening",  contact: "0758963248", status: "On Duty" },
  { name: "Pasindu Kaveesha", department: "F&B Service",   shift: "Full Day", contact: "0712579654", status: "On Leave" },
  { name: "Sumudu Bandara",   department: "Kitchen",       shift: "Night",    contact: "0758741965", status: "On Duty" },
  { name: "Susil Kumara",     department: "F&B Service",   shift: "Full Day", contact: "0754879632", status: "On Duty" },
  { name: "Kanthi Silva",     department: "Maintenance",   shift: "Morning",  contact: "0712345678", status: "On Leave" },
  { name: "Malka Gamage",     department: "Housekeeping",  shift: "Night",    contact: "0719876541", status: "On Duty" }
];

const departmentsData = [
  { name: "Front Desk",   employees: 8,  icon: "🛎", color: "#E4EEFF" },
  { name: "Housekeeping", employees: 30, icon: "🧹", color: "#FDECD8" },
  { name: "Maintenance",  employees: 28, icon: "🛠", color: "#FCE3E3" },
  { name: "Kitchen",      employees: 30, icon: "🍳", color: "#DFF6E8" }
];

const todaysShiftData = [
  { name: "Nimal Perera",    time: "6 PM - 7 AM", color: "#4C6FFF" },
  { name: "Sumudu Bandara",  time: "6 PM - 7 AM", color: "#F6A623" },
  { name: "Malka Gamage",    time: "6 PM - 7 AM", color: "#9B6EDB" },
  { name: "Ayesh Pathirana", time: "2 PM - 9 AM", color: "#34C77B" }
];

// Assigned tasks — starts empty; every task created through the "Add Task"
// modal gets pushed in here and rendered in the Assigned Tasks table.
let tasksData = [];
let nextTaskId = 1;

// Maps a department name to its badge CSS class
const departmentClassMap = {
  "Front Desk": "dept-front-desk",
  "Kitchen": "dept-kitchen",
  "Housekeeping": "dept-housekeeping",
  "F&B Service": "dept-fb-service",
  "Maintenance": "dept-maintenance"
};

function getInitials(name) {
  return name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase();
}

/* ---------------- Staff table ---------------- */
function renderStaffTable() {
  const departmentValue = document.getElementById("departmentFilter").value;
  const statusValue = document.getElementById("statusFilter").value;
  const shiftValue = document.getElementById("shiftFilter").value;

  const filtered = staffData.filter((employee) => {
    const matchesDept = departmentValue === "all" || employee.department === departmentValue;
    const matchesStatus = statusValue === "all" || employee.status === statusValue;
    const matchesShift = shiftValue === "all" || employee.shift === shiftValue;
    return matchesDept && matchesStatus && matchesShift;
  });

  const tbody = document.getElementById("staffTableBody");
  tbody.innerHTML = "";

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5" style="text-align:center; padding:32px; color:#A9ABB6;">
          No employees match your filters.
        </td>
      </tr>`;
  } else {
    filtered.forEach((employee) => {
      const deptClass = departmentClassMap[employee.department] || "dept-front-desk";
      const statusClass = employee.status === "On Duty" ? "status-on-duty" : "status-on-leave";

      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td class="employee-name">${employee.name}</td>
        <td><span class="department-badge ${deptClass}">${employee.department}</span></td>
        <td>${employee.shift}</td>
        <td>${employee.contact}</td>
        <td><span class="status-badge ${statusClass}">${employee.status}</span></td>
      `;
      tbody.appendChild(tr);
    });
  }

  document.getElementById("paginationSummary").textContent =
    filtered.length === 0 ? "No employees found" : `Showing 1 to ${filtered.length} employees`;
}

/* ---------------- Departments card ---------------- */
function renderDepartments() {
  const container = document.getElementById("departmentsList");
  container.innerHTML = "";

  departmentsData.forEach((dept) => {
    const row = document.createElement("div");
    row.className = "department-row";
    row.innerHTML = `
      <div class="department-icon" style="background:${dept.color};">${dept.icon}</div>
      <div class="department-info">
        <span class="department-name">${dept.name}</span>
        <span class="department-count">${dept.employees} employees</span>
      </div>
    `;
    container.appendChild(row);
  });
}

/* ---------------- Today's Shift card ---------------- */
function renderTodaysShift() {
  const container = document.getElementById("todaysShiftList");
  container.innerHTML = "";

  todaysShiftData.forEach((shift) => {
    const row = document.createElement("div");
    row.className = "shift-row";
    row.innerHTML = `
      <div class="shift-avatar" style="background:${shift.color};">${getInitials(shift.name)}</div>
      <div class="shift-info">
        <span class="shift-name">${shift.name}</span>
        <span class="shift-time">${shift.time}</span>
      </div>
    `;
    container.appendChild(row);
  });
}

/* ---------------- Add Task modal ---------------- */
function populateAssigneeDropdown() {
  const select = document.getElementById("taskAssignee");
  // Keep the placeholder option, rebuild the rest from staffData
  select.innerHTML = '<option value="" disabled selected>Select employee</option>';
  staffData.forEach((employee) => {
    const option = document.createElement("option");
    option.value = employee.name;
    option.textContent = `${employee.name} (${employee.department})`;
    option.dataset.department = employee.department;
    select.appendChild(option);
  });
}

function openAddTaskModal() {
  document.getElementById("addTaskOverlay").classList.add("open");
  document.getElementById("formError").textContent = "";
}

function closeAddTaskModal() {
  document.getElementById("addTaskOverlay").classList.remove("open");
  document.getElementById("addTaskForm").reset();
  document.getElementById("formError").textContent = "";
}

// When an employee is picked, auto-select their department too
function setupAssigneeAutoDepartment() {
  document.getElementById("taskAssignee").addEventListener("change", (e) => {
    const selectedOption = e.target.options[e.target.selectedIndex];
    const dept = selectedOption.dataset.department;
    if (dept) {
      document.getElementById("taskDepartment").value = dept;
    }
  });
}

function handleAddTaskSubmit(e) {
  e.preventDefault();

  const title = document.getElementById("taskTitle").value.trim();
  const assignee = document.getElementById("taskAssignee").value;
  const department = document.getElementById("taskDepartment").value;
  const dueDate = document.getElementById("taskDueDate").value;
  const priority = document.getElementById("taskPriority").value;
  const notes = document.getElementById("taskNotes").value.trim();

  const errorEl = document.getElementById("formError");

  if (!title || !assignee || !dueDate) {
    errorEl.textContent = "Please fill in the task title, assignee, and due date.";
    return;
  }

  tasksData.push({
    id: nextTaskId++,
    title,
    assignee,
    department,
    dueDate,
    priority,
    notes,
    status: "Pending"
  });

  closeAddTaskModal();
  renderTasks();
}

function toggleTaskStatus(id) {
  const task = tasksData.find((t) => t.id === id);
  if (!task) return;
  task.status = task.status === "Pending" ? "Completed" : "Pending";
  renderTasks();
}

function deleteTask(id) {
  tasksData = tasksData.filter((t) => t.id !== id);
  renderTasks();
}

function formatDueDate(dateStr) {
  if (!dateStr) return "-";
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

/* ---------------- Assigned Tasks table ---------------- */
function renderTasks() {
  const tbody = document.getElementById("tasksTableBody");
  tbody.innerHTML = "";

  document.getElementById("tasksCount").textContent =
    `${tasksData.length} ${tasksData.length === 1 ? "task" : "tasks"}`;

  if (tasksData.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" class="empty-tasks">No tasks assigned yet. Click "+ Add Task" to create one.</td>
      </tr>`;
    return;
  }

  const priorityClassMap = { Low: "priority-low", Medium: "priority-medium", High: "priority-high" };

  tasksData.forEach((task) => {
    const deptClass = departmentClassMap[task.department] || "dept-front-desk";
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td class="task-title-cell">
        ${task.title}
        ${task.notes ? `<span class="task-notes">${task.notes}</span>` : ""}
      </td>
      <td>${task.assignee}</td>
      <td><span class="department-badge ${deptClass}">${task.department}</span></td>
      <td>${formatDueDate(task.dueDate)}</td>
      <td><span class="priority-badge ${priorityClassMap[task.priority]}">${task.priority}</span></td>
      <td>
        <button class="task-status-toggle ${task.status === "Completed" ? "completed" : ""}" data-id="${task.id}">
          ${task.status}
        </button>
      </td>
      <td><button class="delete-task-btn" data-id="${task.id}" title="Delete task">🗑</button></td>
    `;
    tr.querySelector(".task-status-toggle").addEventListener("click", () => toggleTaskStatus(task.id));
    tr.querySelector(".delete-task-btn").addEventListener("click", () => deleteTask(task.id));
    tbody.appendChild(tr);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderStaffTable();
  renderDepartments();
  renderTodaysShift();
  renderTasks();
  populateAssigneeDropdown();
  setupAssigneeAutoDepartment();

  document.getElementById("departmentFilter").addEventListener("change", renderStaffTable);
  document.getElementById("statusFilter").addEventListener("change", renderStaffTable);
  document.getElementById("shiftFilter").addEventListener("change", renderStaffTable);

  document.getElementById("addTaskBtn").addEventListener("click", openAddTaskModal);
  document.getElementById("closeModalBtn").addEventListener("click", closeAddTaskModal);
  document.getElementById("cancelModalBtn").addEventListener("click", closeAddTaskModal);
  document.getElementById("addTaskForm").addEventListener("submit", handleAddTaskSubmit);

  // Close modal when clicking the dark overlay (but not the modal box itself)
  document.getElementById("addTaskOverlay").addEventListener("click", (e) => {
    if (e.target.id === "addTaskOverlay") closeAddTaskModal();
  });

  // Close modal on Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeAddTaskModal();
  });
});
