/* ==========================================================================
   Reservations Page Logic
   Renders the table from data, wires up search + status filter.
   Replace `reservationsData` with a real API/database call whenever ready.
   ========================================================================== */

const reservationsData = [
  {
    id: "#RSV-1001",
    guestName: "Amal Fernando",
    guestEmail: "amal.fernando@example.com",
    guestPhone: "077 8567 324",
    roomNumber: "204",
    roomType: "Deluxe Room",
    checkIn: { date: "May 20, 2026", time: "02:00 PM" },
    checkOut: { date: "May 22, 2026", time: "11:00 AM" },
    guests: { adults: 2, children: 0 },
    nights: 2,
    totalAmount: 45000,
    status: "confirmed",
    paymentStatus: "paid",
    guestType: "vip",
    source: "Direct"
  },
  {
    id: "#RSV-1002",
    guestName: "K.A. David",
    guestEmail: "david.k@example.com",
    guestPhone: "077 7899 200",
    roomNumber: "101",
    roomType: "Standard Room",
    checkIn: { date: "May 20, 2026", time: "01:00 PM" },
    checkOut: { date: "May 21, 2026", time: "11:00 AM" },
    guests: { adults: 1, children: 0 },
    nights: 1,
    totalAmount: 18000,
    status: "arriving",
    paymentStatus: "pending",
    guestType: "regular",
    source: "Booking.com"
  },
  {
    id: "#RSV-1003",
    guestName: "Vishwa Perera",
    guestEmail: "vishwa.perera@example.com",
    guestPhone: "070 1156 764",
    roomNumber: "305",
    roomType: "Suite Room",
    checkIn: { date: "May 19, 2026", time: "02:00 PM" },
    checkOut: { date: "May 20, 2026", time: "11:00 AM" },
    guests: { adults: 2, children: 1 },
    nights: 1,
    totalAmount: 75000,
    status: "departed",
    paymentStatus: "paid",
    guestType: "vip",
    source: "Expedia"
  },
  {
    id: "#RSV-1004",
    guestName: "Shen De. Silva",
    guestEmail: "shen.desilva@example.com",
    guestPhone: "076 3490 211",
    roomNumber: "502",
    roomType: "Deluxe Room",
    checkIn: { date: "May 18, 2026", time: "02:30 PM" },
    checkOut: { date: "May 20, 2026", time: "11:00 AM" },
    guests: { adults: 2, children: 0 },
    nights: 2,
    totalAmount: 25000,
    status: "checked-out",
    paymentStatus: "paid",
    guestType: "regular",
    source: "Agoda"
  },
  {
    id: "#RSV-1005",
    guestName: "Mahesh Induwara",
    guestEmail: "mahesh.induwara@example.com",
    guestPhone: "077 4587 517",
    roomNumber: "210",
    roomType: "Standard Room",
    checkIn: { date: "May 21, 2026", time: "02:00 PM" },
    checkOut: { date: "May 24, 2026", time: "11:00 AM" },
    guests: { adults: 2, children: 2 },
    nights: 3,
    totalAmount: 35000,
    status: "cancelled",
    paymentStatus: "partial",
    guestType: "regular",
    source: "Direct"
  },
  {
    id: "#RSV-1006",
    guestName: "Ravi Wijesinghe",
    guestEmail: "ravi.wijesinghe@example.com",
    guestPhone: "077 7844 900",
    roomNumber: "300",
    roomType: "Suite Room",
    checkIn: { date: "May 22, 2026", time: "01:00 PM" },
    checkOut: { date: "May 23, 2026", time: "11:00 AM" },
    guests: { adults: 2, children: 0 },
    nights: 1,
    totalAmount: 14000,
    status: "pending",
    paymentStatus: "pending",
    guestType: "regular",
    source: "Website"
  },
  {
    id: "#RSV-1007",
    guestName: "Dinesh Pathirana",
    guestEmail: "dinesh.pathirana@example.com",
    guestPhone: "071 5977 365",
    roomNumber: "200",
    roomType: "Suite Room",
    checkIn: { date: "May 23, 2026", time: "01:45 PM" },
    checkOut: { date: "May 25, 2026", time: "11:00 AM" },
    guests: { adults: 2, children: 0 },
    nights: 2,
    totalAmount: 24000,
    status: "confirmed",
    paymentStatus: "paid",
    guestType: "vip",
    source: "Walk-in"
  }
];

// Human-friendly labels for the status badges
const statusLabels = {
  confirmed: "Confirmed",
  arriving: "Arriving",
  departed: "Departed",
  "checked-out": "Checked Out",
  cancelled: "Cancelled",
  pending: "Pending"
};

const activeDateRange = {
  start: null,
  end: null
};

const advancedFilterDefaults = {
  roomType: "all",
  source: "all",
  paymentStatus: "all",
  guestType: "all",
  guestCount: "all",
  roomNumber: "",
  checkInToday: false,
  checkOutToday: false,
  sortBy: "checkInAsc"
};

let activeReservationId = null;
let moreMenuReservationId = null;

const monthLookup = {
  Jan: 0,
  Feb: 1,
  Mar: 2,
  Apr: 3,
  May: 4,
  Jun: 5,
  Jul: 6,
  Aug: 7,
  Sep: 8,
  Oct: 9,
  Nov: 10,
  Dec: 11
};

function parseDisplayDate(dateText) {
  const [monthName, dayText, yearText] = dateText.replace(/,/g, "").split(" ");
  const monthIndex = monthLookup[monthName.slice(0, 3)];

  if (monthIndex === undefined) {
    return new Date(dateText);
  }

  return new Date(Number(yearText), monthIndex, Number(dayText));
}

function formatLocalDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function isSameLocalDay(dateA, dateB) {
  return formatLocalDateKey(dateA) === formatLocalDateKey(dateB);
}

function getGuestCount(reservation) {
  return reservation.guests.adults + reservation.guests.children;
}

function getAdvancedFilterValues() {
  return {
    roomType: document.getElementById("roomTypeFilter").value,
    source: document.getElementById("sourceFilter").value,
    paymentStatus: document.getElementById("paymentStatusFilter").value,
    guestType: document.getElementById("guestTypeFilter").value,
    guestCount: document.getElementById("guestCountFilter").value,
    roomNumber: document.getElementById("roomNumberFilter").value.trim().toLowerCase(),
    checkInToday: document.getElementById("checkInTodayFilter").checked,
    checkOutToday: document.getElementById("checkOutTodayFilter").checked,
    sortBy: document.getElementById("sortByFilter").value
  };
}

function sortReservations(data, sortBy) {
  const items = [...data];

  const sorters = {
    checkInAsc: (a, b) => parseDisplayDate(a.checkIn.date) - parseDisplayDate(b.checkIn.date),
    checkInDesc: (a, b) => parseDisplayDate(b.checkIn.date) - parseDisplayDate(a.checkIn.date),
    checkOutAsc: (a, b) => parseDisplayDate(a.checkOut.date) - parseDisplayDate(b.checkOut.date),
    checkOutDesc: (a, b) => parseDisplayDate(b.checkOut.date) - parseDisplayDate(a.checkOut.date),
    guestNameAsc: (a, b) => a.guestName.localeCompare(b.guestName),
    guestNameDesc: (a, b) => b.guestName.localeCompare(a.guestName),
    roomNumberAsc: (a, b) => Number(a.roomNumber) - Number(b.roomNumber),
    roomNumberDesc: (a, b) => Number(b.roomNumber) - Number(a.roomNumber),
    amountAsc: (a, b) => a.totalAmount - b.totalAmount,
    amountDesc: (a, b) => b.totalAmount - a.totalAmount
  };

  items.sort(sorters[sortBy] || sorters.checkInAsc);
  return items;
}

function toDateInputValue(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatDateLabel(date) {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}

function updateDateRangeLabel() {
  const label = document.getElementById("dateRangeLabel");

  if (!activeDateRange.start && !activeDateRange.end) {
    label.textContent = "Any date";
    return;
  }

  const startLabel = activeDateRange.start ? formatDateLabel(activeDateRange.start) : "Any start";
  const endLabel = activeDateRange.end ? formatDateLabel(activeDateRange.end) : "Any end";
  label.textContent = `${startLabel} - ${endLabel}`;
}

function setDateRange(startValue, endValue) {
  activeDateRange.start = startValue ? new Date(`${startValue}T00:00:00`) : null;
  activeDateRange.end = endValue ? new Date(`${endValue}T23:59:59`) : null;
  updateDateRangeLabel();
}

function formatCurrency(amount) {
  return "Rs " + amount.toLocaleString("en-US") + ".00";
}

function renderReservations(data) {
  const tbody = document.getElementById("reservationsTableBody");
  tbody.innerHTML = "";

  if (data.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="10" style="text-align:center; padding:32px; color:#A9ABB6;">
          No reservations match your search.
        </td>
      </tr>`;
    updatePaginationSummary(0);
    return;
  }

  data.forEach((res) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${res.id}</td>
      <td>
        <span class="guest-name">${res.guestName}</span>
        <span class="guest-phone">${res.guestPhone}</span>
      </td>
      <td>
        <span class="room-number">${res.roomNumber}</span>
        <span class="room-type">${res.roomType}</span>
      </td>
      <td>
        <span class="date-main">${res.checkIn.date}</span>
        <span class="time-sub">${res.checkIn.time}</span>
      </td>
      <td>
        <span class="date-main">${res.checkOut.date}</span>
        <span class="time-sub">${res.checkOut.time}</span>
      </td>
      <td>
        <span class="date-main">${res.guests.adults} Adults</span>
        <span class="time-sub">${res.guests.children} ${res.guests.children === 1 ? "Child" : "Children"}</span>
      </td>
      <td>
        <span class="date-main">${formatCurrency(res.totalAmount)}</span>
        <span class="nights-sub">${res.nights} ${res.nights === 1 ? "night" : "nights"}</span>
      </td>
      <td><span class="status-badge status-${res.status}">${statusLabels[res.status]}</span></td>
      <td><span class="source-text">${res.source}</span></td>
      <td>
        <div class="row-actions">
          <button type="button" class="action-btn" data-action="view" data-reservation-id="${res.id}" title="View reservation">👁</button>
          <button type="button" class="action-btn" data-action="edit" data-reservation-id="${res.id}" title="Edit reservation">✎</button>
          <button type="button" class="action-btn" data-action="more" data-reservation-id="${res.id}" title="More actions">⋮</button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });

  updatePaginationSummary(data.length);
}

function updatePaginationSummary(count) {
  const summary = document.getElementById("paginationSummary");
  summary.textContent = count === 0
    ? "No reservations found"
    : `Showing 1 to ${count} reservations`;
}

function getReservationById(id) {
  return reservationsData.find((reservation) => reservation.id === id) || null;
}

function getModal() {
  return document.getElementById("reservationModal");
}

function getModalBody() {
  return document.getElementById("reservationModalBody");
}

function getModalFooter() {
  return document.getElementById("reservationModalFooter");
}

function openModal() {
  const modal = getModal();
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
}

function closeModal() {
  const modal = getModal();
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  activeReservationId = null;
}

function renderReservationDetails(reservation) {
  return `
    <div class="detail-grid">
      <div><span>Booking ID</span><strong>${reservation.id}</strong></div>
      <div><span>Guest Name</span><strong>${reservation.guestName}</strong></div>
      <div><span>Email</span><strong>${reservation.guestEmail}</strong></div>
      <div><span>Phone</span><strong>${reservation.guestPhone}</strong></div>
      <div><span>Room</span><strong>${reservation.roomNumber} - ${reservation.roomType}</strong></div>
      <div><span>Status</span><strong>${statusLabels[reservation.status]}</strong></div>
      <div><span>Check-In</span><strong>${reservation.checkIn.date} ${reservation.checkIn.time}</strong></div>
      <div><span>Check-Out</span><strong>${reservation.checkOut.date} ${reservation.checkOut.time}</strong></div>
      <div><span>Guests</span><strong>${reservation.guests.adults} Adults, ${reservation.guests.children} Children</strong></div>
      <div><span>Total Amount</span><strong>${formatCurrency(reservation.totalAmount)}</strong></div>
      <div><span>Source</span><strong>${reservation.source}</strong></div>
      <div><span>Nights</span><strong>${reservation.nights}</strong></div>
    </div>
  `;
}

function openViewModal(reservation) {
  activeReservationId = reservation.id;
  document.getElementById("reservationModalTitle").textContent = "Reservation Details";
  document.getElementById("reservationModalSubtitle").textContent = `Details for ${reservation.guestName}`;
  getModalBody().innerHTML = renderReservationDetails(reservation);
  getModalFooter().innerHTML = `
    <button type="button" class="modal-secondary-btn" data-modal-close>Close</button>
  `;
  openModal();
}

function buildEditForm(reservation) {
  return `
    <form id="reservationEditForm" class="edit-form">
      <div class="edit-grid">
        <label>Guest Name<input name="guestName" value="${reservation.guestName}"></label>
        <label>Email<input name="guestEmail" value="${reservation.guestEmail}"></label>
        <label>Phone<input name="guestPhone" value="${reservation.guestPhone}"></label>
        <label>Room Number<input name="roomNumber" value="${reservation.roomNumber}"></label>
        <label>Room Type<input name="roomType" value="${reservation.roomType}"></label>
        <label>Status
          <select name="status">
            ${Object.keys(statusLabels).map((statusKey) => `<option value="${statusKey}" ${statusKey === reservation.status ? "selected" : ""}>${statusLabels[statusKey]}</option>`).join("")}
          </select>
        </label>
        <label>Check-In Date<input type="date" name="checkInDate" value="${toDateInputValue(parseDisplayDate(reservation.checkIn.date))}"></label>
        <label>Check-Out Date<input type="date" name="checkOutDate" value="${toDateInputValue(parseDisplayDate(reservation.checkOut.date))}"></label>
        <label>Total Amount
          <input type="text" name="totalAmount" value="${formatCurrency(reservation.totalAmount)}" readonly aria-readonly="true">
          <span class="field-hint">Auto recalculated by the system</span>
        </label>
        <label>Source<input name="source" value="${reservation.source}"></label>
      </div>
    </form>
  `;
}

function openEditModal(reservation) {
  activeReservationId = reservation.id;
  document.getElementById("reservationModalTitle").textContent = "Edit Reservation";
  document.getElementById("reservationModalSubtitle").textContent = `Update ${reservation.guestName}`;
  getModalBody().innerHTML = buildEditForm(reservation);
  getModalFooter().innerHTML = `
    <button type="button" class="modal-secondary-btn" data-modal-close>Cancel</button>
    <button type="button" class="modal-primary-btn" id="saveReservationBtn">Save Changes</button>
  `;
  openModal();

  document.getElementById("saveReservationBtn").addEventListener("click", saveReservationChanges);
}

function saveReservationChanges() {
  const reservation = getReservationById(activeReservationId);
  const form = document.getElementById("reservationEditForm");
  if (!reservation || !form) return;

  const formData = new FormData(form);
  reservation.guestName = formData.get("guestName").trim();
  reservation.guestEmail = formData.get("guestEmail").trim();
  reservation.guestPhone = formData.get("guestPhone").trim();
  reservation.roomNumber = formData.get("roomNumber").trim();
  reservation.roomType = formData.get("roomType").trim();
  reservation.status = formData.get("status");
  reservation.checkIn.date = new Date(`${formData.get("checkInDate")}T00:00:00`).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric"
  });
  reservation.checkOut.date = new Date(`${formData.get("checkOutDate")}T00:00:00`).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric"
  });
  reservation.source = formData.get("source").trim();

  applyFilters();
  closeModal();
}

function openMoreMenu(button, reservation) {
  const menu = document.getElementById("moreMenu");
  const rect = button.getBoundingClientRect();
  moreMenuReservationId = reservation.id;

  menu.style.left = `${rect.left + window.scrollX - 170}px`;
  menu.style.top = `${rect.bottom + window.scrollY + 8}px`;
  menu.classList.add("open");
  menu.setAttribute("aria-hidden", "false");
}

function closeMoreMenu() {
  const menu = document.getElementById("moreMenu");
  menu.classList.remove("open");
  menu.setAttribute("aria-hidden", "true");
  moreMenuReservationId = null;
}

function toggleReservationStatus(targetStatus) {
  const reservation = getReservationById(moreMenuReservationId);
  if (!reservation) return;

  reservation.status = targetStatus;
  applyFilters();
}

function copyBookingId() {
  const reservation = getReservationById(moreMenuReservationId);
  if (!reservation) return;

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(reservation.id);
  } else {
    const helper = document.createElement("textarea");
    helper.value = reservation.id;
    document.body.appendChild(helper);
    helper.select();
    document.execCommand("copy");
    document.body.removeChild(helper);
  }
}

function applyFilters() {
  const searchTerm = document.getElementById("searchInput").value.trim().toLowerCase();
  const statusValue = document.getElementById("statusFilter").value;
  const advancedFilters = getAdvancedFilterValues();
  const todayKey = formatLocalDateKey(new Date());

  const filtered = reservationsData.filter((res) => {
    const checkInDate = parseDisplayDate(res.checkIn.date);
    const checkOutDate = parseDisplayDate(res.checkOut.date);
    const guestCount = getGuestCount(res);
    const matchesSearch =
      searchTerm === "" ||
      res.guestName.toLowerCase().includes(searchTerm) ||
      res.guestEmail.toLowerCase().includes(searchTerm) ||
      res.guestPhone.toLowerCase().includes(searchTerm) ||
      res.id.toLowerCase().includes(searchTerm) ||
      res.roomNumber.toLowerCase().includes(searchTerm) ||
      res.roomType.toLowerCase().includes(searchTerm) ||
      res.source.toLowerCase().includes(searchTerm);

    const matchesStatus = statusValue === "all" || res.status === statusValue;
    const matchesStartDate = !activeDateRange.start || checkInDate >= activeDateRange.start;
    const matchesEndDate = !activeDateRange.end || checkInDate <= activeDateRange.end;
    const matchesRoomType = advancedFilters.roomType === "all" || res.roomType === advancedFilters.roomType;
    const matchesSource = advancedFilters.source === "all" || res.source === advancedFilters.source;
    const matchesPaymentStatus = advancedFilters.paymentStatus === "all" || res.paymentStatus === advancedFilters.paymentStatus;
    const matchesGuestType = advancedFilters.guestType === "all" || res.guestType === advancedFilters.guestType;
    const matchesGuestCount =
      advancedFilters.guestCount === "all" ||
      (advancedFilters.guestCount === "4plus" && guestCount >= 4) ||
      (advancedFilters.guestCount !== "4plus" && guestCount === Number(advancedFilters.guestCount));
    const matchesRoomNumber = !advancedFilters.roomNumber || res.roomNumber.toLowerCase().includes(advancedFilters.roomNumber);
    const matchesCheckInToday = !advancedFilters.checkInToday || formatLocalDateKey(checkInDate) === todayKey;
    const matchesCheckOutToday = !advancedFilters.checkOutToday || formatLocalDateKey(checkOutDate) === todayKey;

    return (
      matchesSearch &&
      matchesStatus &&
      matchesStartDate &&
      matchesEndDate &&
      matchesRoomType &&
      matchesSource &&
      matchesPaymentStatus &&
      matchesGuestType &&
      matchesGuestCount &&
      matchesRoomNumber &&
      matchesCheckInToday &&
      matchesCheckOutToday
    );
  });

  renderReservations(sortReservations(filtered, advancedFilters.sortBy));
}

function resetFilters() {
  document.getElementById("searchInput").value = "";
  document.getElementById("statusFilter").value = "all";
  document.getElementById("startDateInput").value = "";
  document.getElementById("endDateInput").value = "";
  document.getElementById("roomTypeFilter").value = advancedFilterDefaults.roomType;
  document.getElementById("sourceFilter").value = advancedFilterDefaults.source;
  document.getElementById("paymentStatusFilter").value = advancedFilterDefaults.paymentStatus;
  document.getElementById("guestTypeFilter").value = advancedFilterDefaults.guestType;
  document.getElementById("guestCountFilter").value = advancedFilterDefaults.guestCount;
  document.getElementById("roomNumberFilter").value = advancedFilterDefaults.roomNumber;
  document.getElementById("checkInTodayFilter").checked = advancedFilterDefaults.checkInToday;
  document.getElementById("checkOutTodayFilter").checked = advancedFilterDefaults.checkOutToday;
  document.getElementById("sortByFilter").value = advancedFilterDefaults.sortBy;
  setDateRange(null, null);
  applyFilters();
}

function openFiltersPanel() {
  const panel = document.getElementById("filtersPanel");
  const button = document.getElementById("filtersButton");
  panel.classList.add("open");
  panel.setAttribute("aria-hidden", "false");
  button.classList.add("active");
  button.setAttribute("aria-expanded", "true");
}

function closeFiltersPanel() {
  const panel = document.getElementById("filtersPanel");
  const button = document.getElementById("filtersButton");
  panel.classList.remove("open");
  panel.setAttribute("aria-hidden", "true");
  button.classList.remove("active");
  button.setAttribute("aria-expanded", "false");
}

function toggleFiltersPanel() {
  const panel = document.getElementById("filtersPanel");
  if (panel.classList.contains("open")) {
    closeFiltersPanel();
    return;
  }

  closeMoreMenu();
  const dateRangePopover = document.getElementById("dateRangePopover");
  dateRangePopover.classList.remove("open");
  dateRangePopover.setAttribute("aria-hidden", "true");
  openFiltersPanel();
}

function handleActionClick(target) {
  const action = target.dataset.action;
  const reservationId = target.dataset.reservationId;
  const reservation = getReservationById(reservationId);

  if (!reservation) return;

  if (action === "view") {
    closeMoreMenu();
    openViewModal(reservation);
    return;
  }

  if (action === "edit") {
    closeMoreMenu();
    openEditModal(reservation);
    return;
  }

  if (action === "more") {
    openMoreMenu(target, reservation);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  renderReservations(reservationsData);

  const searchInput = document.getElementById("searchInput");
  const statusFilter = document.getElementById("statusFilter");
  const dateRangeButton = document.getElementById("dateRangeButton");
  const dateRangePopover = document.getElementById("dateRangePopover");
  const startDateInput = document.getElementById("startDateInput");
  const endDateInput = document.getElementById("endDateInput");
  const applyDateRangeBtn = document.getElementById("applyDateRangeBtn");
  const clearDateRangeBtn = document.getElementById("clearDateRangeBtn");
  const filtersButton = document.getElementById("filtersButton");
  const closeFiltersPanelBtn = document.getElementById("closeFiltersPanelBtn");
  const applyAdvancedFiltersBtn = document.getElementById("applyAdvancedFiltersBtn");
  const resetAllFiltersBtn = document.getElementById("resetAllFiltersBtn");
  const reservationsTableBody = document.getElementById("reservationsTableBody");
  const modal = getModal();
  const moreMenu = document.getElementById("moreMenu");

  searchInput.addEventListener("input", applyFilters);
  statusFilter.addEventListener("change", applyFilters);

  filtersButton.addEventListener("click", toggleFiltersPanel);
  closeFiltersPanelBtn.addEventListener("click", closeFiltersPanel);
  applyAdvancedFiltersBtn.addEventListener("click", () => {
    applyFilters();
    closeFiltersPanel();
  });
  resetAllFiltersBtn.addEventListener("click", () => {
    resetFilters();
    openFiltersPanel();
  });

  dateRangeButton.addEventListener("click", () => {
    const isOpen = dateRangePopover.classList.toggle("open");
    dateRangePopover.setAttribute("aria-hidden", String(!isOpen));
    if (isOpen) {
      closeFiltersPanel();
    }
  });

  applyDateRangeBtn.addEventListener("click", () => {
    const startValue = startDateInput.value || null;
    const endValue = endDateInput.value || null;

    if (startValue && endValue && startValue > endValue) {
      endDateInput.value = startValue;
    }

    setDateRange(startDateInput.value || null, endDateInput.value || null);
    dateRangePopover.classList.remove("open");
    dateRangePopover.setAttribute("aria-hidden", "true");
    applyFilters();
  });

  clearDateRangeBtn.addEventListener("click", () => {
    startDateInput.value = "";
    endDateInput.value = "";
    setDateRange(null, null);
    applyFilters();
  });

  reservationsTableBody.addEventListener("click", (event) => {
    const actionButton = event.target.closest("button[data-action]");
    if (!actionButton) return;
    handleActionClick(actionButton);
  });

  modal.addEventListener("click", (event) => {
    if (event.target.hasAttribute("data-modal-close")) {
      closeModal();
    }
  });

  moreMenu.addEventListener("click", (event) => {
    const actionButton = event.target.closest("button[data-more-action]");
    if (!actionButton) return;

    const action = actionButton.dataset.moreAction;
    if (action === "confirm") {
      toggleReservationStatus("confirmed");
    }
    if (action === "cancel") {
      toggleReservationStatus("cancelled");
    }
    if (action === "copy") {
      copyBookingId();
    }

    closeMoreMenu();
  });

  document.addEventListener("click", (event) => {
    if (!dateRangePopover.classList.contains("open")) {
      if (document.getElementById("filtersPanel").classList.contains("open")) {
        if (!document.getElementById("filtersPanel").contains(event.target) && !filtersButton.contains(event.target)) {
          closeFiltersPanel();
        }
      }
      return;
    }

    if (dateRangePopover.contains(event.target) || dateRangeButton.contains(event.target)) {
      return;
    }

    dateRangePopover.classList.remove("open");
    dateRangePopover.setAttribute("aria-hidden", "true");
  });

  document.addEventListener("click", (event) => {
    if (!moreMenu.classList.contains("open")) {
      return;
    }

    if (moreMenu.contains(event.target) || event.target.closest("button[data-action='more']")) {
      return;
    }

    closeMoreMenu();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeModal();
      closeMoreMenu();
      closeFiltersPanel();
      dateRangePopover.classList.remove("open");
      dateRangePopover.setAttribute("aria-hidden", "true");
    }
  });

  updateDateRangeLabel();
});
