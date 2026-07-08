/* ==========================================================================
   Room Management Page Logic
   Renders the room map + room list from data, wires up status/floor filters,
   floor collapse/expand, and the Room List / Room Map tab switcher.
   Replace `roomsData` with a real API/database call whenever ready.
   ========================================================================== */

const roomsData = [
  // ---------- 1st Floor ----------
  { number: "101", floor: 1, bed: "1 Queen bed",              status: "available" },
  { number: "102", floor: 1, bed: "1 King bed",                status: "dirty" },
  { number: "103", floor: 1, bed: "1 Queen bed + Sofa",        status: "occupied" },
  { number: "104", floor: 1, bed: "3 Queen beds",              status: "available" },
  { number: "105", floor: 1, bed: "1 King bed",                status: "occupied" },
  { number: "106", floor: 1, bed: "1 King bed",                status: "available" },
  { number: "107", floor: 1, bed: "1 Queen bed + 1 King bed",  status: "available" },
  { number: "108", floor: 1, bed: "2 King beds",                status: "occupied" },
  { number: "109", floor: 1, bed: "3 Queen beds",              status: "available" },
  { number: "110", floor: 1, bed: "1 King bed",                status: "out-of-service" },

  // ---------- 2nd Floor ----------
  { number: "111", floor: 2, bed: "1 Queen bed",               status: "available" },
  { number: "112", floor: 2, bed: "1 Queen bed + Sofa",        status: "available" },
  { number: "113", floor: 2, bed: "2 Queen beds",              status: "occupied" },
  { number: "114", floor: 2, bed: "2 King beds",                status: "occupied" },
  { number: "115", floor: 2, bed: "2 King beds",                status: "occupied" },
  { number: "116", floor: 2, bed: "1 King bed",                status: "out-of-service" },
  { number: "117", floor: 2, bed: "1 Queen bed",               status: "occupied" },
  { number: "118", floor: 2, bed: "1 Sofa bed",                status: "available" },
  { number: "119", floor: 2, bed: "2 King beds",                status: "dirty" },
  { number: "120", floor: 2, bed: "1 King bed",                status: "out-of-service" },

  // ---------- 3rd Floor ----------
  { number: "121", floor: 3, bed: "1 Queen bed",               status: "occupied" },
  { number: "122", floor: 3, bed: "1 Queen bed + Sofa",        status: "available" },
  { number: "123", floor: 3, bed: "1 King bed",                status: "out-of-service" },
  { number: "124", floor: 3, bed: "1 King bed",                status: "dirty" },
  { number: "125", floor: 3, bed: "2 King beds",                status: "available" }
];

const statusLabels = {
  "available": "Available",
  "occupied": "Occupied",
  "out-of-service": "Out of Service",
  "dirty": "Dirty"
};

const statusIcons = {
  "available": "🕐",
  "occupied": "👤",
  "out-of-service": "🛠",
  "dirty": "🧹"
};

const floorNames = { 1: "1st Floor", 2: "2nd Floor", 3: "3rd Floor" };

/* ---------------- Stat cards ---------------- */
function renderStats() {
  const total = roomsData.length;
  const counts = { available: 0, occupied: 0, "out-of-service": 0, dirty: 0 };
  roomsData.forEach((r) => counts[r.status]++);

  document.getElementById("kpiTotal").textContent = total;
  document.getElementById("kpiAvailable").textContent = counts.available;
  document.getElementById("kpiOccupied").textContent = counts.occupied;
  document.getElementById("kpiOutService").textContent = counts["out-of-service"];
  document.getElementById("kpiDirty").textContent = counts.dirty;

  document.getElementById("kpiAvailablePct").textContent =
    ((counts.available / total) * 100).toFixed(2).replace(/\.00$/, "") + "%";
  document.getElementById("kpiOccupiedPct").textContent =
    ((counts.occupied / total) * 100).toFixed(2).replace(/\.00$/, "") + "%";
  document.getElementById("kpiOutServicePct").textContent =
    ((counts["out-of-service"] / total) * 100).toFixed(2).replace(/\.00$/, "") + "%";
}

/* ---------------- Room Map ---------------- */
function renderRoomMap() {
  const statusValue = document.getElementById("statusFilter").value;
  const floorValue = document.getElementById("floorFilter").value;

  const filtered = roomsData.filter((r) => {
    const matchesStatus = statusValue === "all" || r.status === statusValue;
    const matchesFloor = floorValue === "all" || r.floor === Number(floorValue);
    return matchesStatus && matchesFloor;
  });

  const floors = [...new Set(filtered.map((r) => r.floor))].sort((a, b) => a - b);
  const container = document.getElementById("floorsContainer");
  container.innerHTML = "";

  if (floors.length === 0) {
    container.innerHTML = `<p style="color:#A9ABB6; text-align:center; padding:24px;">No rooms match your filters.</p>`;
    return;
  }

  floors.forEach((floorNum) => {
    const roomsOnFloor = filtered.filter((r) => r.floor === floorNum);

    const group = document.createElement("div");
    group.className = "floor-group";

    const header = document.createElement("div");
    header.className = "floor-header";
    header.innerHTML = `<span class="chevron">▾</span> ${floorNames[floorNum] || "Floor " + floorNum}`;
    header.addEventListener("click", () => group.classList.toggle("collapsed"));

    const grid = document.createElement("div");
    grid.className = "room-grid";

    roomsOnFloor.forEach((room) => {
      const card = document.createElement("div");
      card.className = `room-card room-${room.status}`;
      card.innerHTML = `
        <div>
          <div class="room-number">${room.number}</div>
          <div class="room-bed">${room.bed}</div>
        </div>
        <div class="room-icon">${statusIcons[room.status]}</div>
      `;
      card.title = `${statusLabels[room.status]} — ${room.bed}`;
      card.addEventListener("click", () => openRoomDetails(room));
      grid.appendChild(card);
    });

    group.appendChild(header);
    group.appendChild(grid);
    container.appendChild(group);
  });
}

/* ---------------- Room details (placeholder) ---------------- */
function openRoomDetails(room) {
  // Wire this up to a real modal/drawer whenever ready
  console.log("Open details for room", room.number, room);
}

document.addEventListener("DOMContentLoaded", () => {
  renderStats();
  renderRoomMap();

  const roomListBtn = document.getElementById("roomListBtn");
  const roomMapBtn = document.getElementById("roomMapBtn");

  if (roomListBtn) {
    roomListBtn.addEventListener("click", () => {
      window.location.href = "room-management.html";
    });
  }

  if (roomMapBtn) {
    roomMapBtn.addEventListener("click", () => {
      window.location.href = "roomMap.html";
    });
  }

  document.getElementById("statusFilter").addEventListener("change", renderRoomMap);
  document.getElementById("floorFilter").addEventListener("change", renderRoomMap);
});
