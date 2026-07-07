/* ==========================================================================
   Reservations Page Logic
   Renders the table from data, wires up search + status filter.
   Replace `reservationsData` with a real API/database call whenever ready.
   ========================================================================== */

const reservationsData = [
  {
    id: "#RSV-1001",
    guestName: "Amal Fernando",
    guestPhone: "077 8567 324",
    roomNumber: "204",
    roomType: "Deluxe Room",
    checkIn: { date: "May 20, 2026", time: "02:00 PM" },
    checkOut: { date: "May 22, 2026", time: "11:00 AM" },
    guests: { adults: 2, children: 0 },
    nights: 2,
    totalAmount: 45000,
    status: "confirmed",
    source: "Direct"
  },
  {
    id: "#RSV-1002",
    guestName: "K.A. David",
    guestPhone: "077 7899 200",
    roomNumber: "101",
    roomType: "Standard Room",
    checkIn: { date: "May 20, 2026", time: "01:00 PM" },
    checkOut: { date: "May 21, 2026", time: "11:00 AM" },
    guests: { adults: 1, children: 0 },
    nights: 1,
    totalAmount: 18000,
    status: "arriving",
    source: "Booking.com"
  },
  {
    id: "#RSV-1003",
    guestName: "Vishwa Perera",
    guestPhone: "070 1156 764",
    roomNumber: "305",
    roomType: "Suite Room",
    checkIn: { date: "May 19, 2026", time: "02:00 PM" },
    checkOut: { date: "May 20, 2026", time: "11:00 AM" },
    guests: { adults: 2, children: 1 },
    nights: 1,
    totalAmount: 75000,
    status: "departed",
    source: "Expedia"
  },
  {
    id: "#RSV-1004",
    guestName: "Shen De. Silva",
    guestPhone: "076 3490 211",
    roomNumber: "502",
    roomType: "Deluxe Room",
    checkIn: { date: "May 18, 2026", time: "02:30 PM" },
    checkOut: { date: "May 20, 2026", time: "11:00 AM" },
    guests: { adults: 2, children: 0 },
    nights: 2,
    totalAmount: 25000,
    status: "checked-out",
    source: "Agoda"
  },
  {
    id: "#RSV-1005",
    guestName: "Mahesh Induwara",
    guestPhone: "077 4587 517",
    roomNumber: "210",
    roomType: "Standard Room",
    checkIn: { date: "May 21, 2026", time: "02:00 PM" },
    checkOut: { date: "May 24, 2026", time: "11:00 AM" },
    guests: { adults: 2, children: 2 },
    nights: 3,
    totalAmount: 35000,
    status: "cancelled",
    source: "Direct"
  },
  {
    id: "#RSV-1006",
    guestName: "Ravi Wijesinghe",
    guestPhone: "077 7844 900",
    roomNumber: "300",
    roomType: "Suite Room",
    checkIn: { date: "May 22, 2026", time: "01:00 PM" },
    checkOut: { date: "May 23, 2026", time: "11:00 AM" },
    guests: { adults: 2, children: 0 },
    nights: 1,
    totalAmount: 14000,
    status: "pending",
    source: "Website"
  },
  {
    id: "#RSV-1007",
    guestName: "Dinesh Pathirana",
    guestPhone: "071 5977 365",
    roomNumber: "200",
    roomType: "Suite Room",
    checkIn: { date: "May 23, 2026", time: "01:45 PM" },
    checkOut: { date: "May 25, 2026", time: "11:00 AM" },
    guests: { adults: 2, children: 0 },
    nights: 2,
    totalAmount: 24000,
    status: "confirmed",
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
          <span title="View" onclick="viewReservation('${res.id}')">👁</span>
          <span title="Edit" onclick="editReservation('${res.id}')">✎</span>
          <span title="More" onclick="moreOptions('${res.id}')">⋮</span>
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

function applyFilters() {
  const searchTerm = document.getElementById("searchInput").value.trim().toLowerCase();
  const statusValue = document.getElementById("statusFilter").value;

  const filtered = reservationsData.filter((res) => {
    const matchesSearch =
      searchTerm === "" ||
      res.guestName.toLowerCase().includes(searchTerm) ||
      res.guestPhone.toLowerCase().includes(searchTerm) ||
      res.id.toLowerCase().includes(searchTerm);

    const matchesStatus = statusValue === "all" || res.status === statusValue;

    return matchesSearch && matchesStatus;
  });

  renderReservations(filtered);
}

// Placeholder action handlers — wire these up to your real view/edit modals
function viewReservation(id) {
  console.log("View reservation", id);
}
function editReservation(id) {
  console.log("Edit reservation", id);
}
function moreOptions(id) {
  console.log("More options for", id);
}

document.addEventListener("DOMContentLoaded", () => {
  renderReservations(reservationsData);

  document.getElementById("searchInput").addEventListener("input", applyFilters);
  document.getElementById("statusFilter").addEventListener("change", applyFilters);
});
