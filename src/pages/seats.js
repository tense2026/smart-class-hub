import { loadClassroom } from '../shared/classroom.js';

const PRESSURE_THRESHOLD = 300;

// Pressure sensors are fixed to physical seats, so values are keyed by seat index.
const sensorStateMap = {};
let students = [];
let seats = [];

function esc(v) {
    return String(v == null ? '' : v).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function findStudent(id) {
    return students.find((s) => s.id === id);
}

function renderSeats() {
    const grid = document.getElementById('seatGrid');
    grid.innerHTML = seats.map((id, index) => {
        const student = findStudent(id);
        if (!student) {
            return `
                <div class="seat-card empty" id="seat-card-${index}">
                    <div class="seat-num">${index + 1}번 자리</div>
                    <div class="student-name">빈 자리</div>
                </div>`;
        }
        const currentVal = sensorStateMap[index] || 0;
        const isOccupied = currentVal >= PRESSURE_THRESHOLD;
        return `
            <div class="seat-card ${isOccupied ? 'occupied' : ''}" id="seat-card-${index}">
                <div class="seat-num">${index + 1}번 자리 · ${student.id}번</div>
                <div class="student-name">${esc(student.name)}</div>
                <div class="sensor-val" id="val-${index}">압력: ${currentVal}</div>
            </div>`;
    }).join('');
}

function updateSensorData(seatIndex, pressureValue) {
    sensorStateMap[seatIndex] = pressureValue;

    const card = document.getElementById(`seat-card-${seatIndex}`);
    const valText = document.getElementById(`val-${seatIndex}`);

    if (card && valText) {
        valText.innerText = `압력: ${pressureValue}`;
        card.classList.toggle('occupied', pressureValue >= PRESSURE_THRESHOLD);
    }
}

function toggleRandomSeat() {
    const filled = seats.map((id, i) => (findStudent(id) ? i : -1)).filter((i) => i !== -1);
    if (filled.length === 0) return;
    const seatIndex = filled[Math.floor(Math.random() * filled.length)];
    const isCurrentlyOn = (sensorStateMap[seatIndex] || 0) >= PRESSURE_THRESHOLD;
    updateSensorData(seatIndex, isCurrentlyOn ? 50 : 550);
}

function reload() {
    ({ students, seats } = loadClassroom());
    renderSeats();
}

document.getElementById('randomToggleBtn').addEventListener('click', toggleRandomSeat);

// Pick up seat changes saved from the timetable page in another tab.
window.addEventListener('storage', reload);

reload();
