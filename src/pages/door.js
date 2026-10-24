import { STORAGE_KEYS, readJSON, writeJSON } from '../shared/storageKeys.js';

let isDoorOpen = true;
let changedAt = Date.now();
// When the current auto-close countdown started: the later of door opening and a settings change.
// Enabling auto-close on a door that has been open for a while must not slam it shut immediately.
let armedAt = changedAt;
let port = null;
let writer = null;
let autoCloseTimer = null;
let countdownTimer = null;

const toggle = document.getElementById('autoCloseToggle');
const select = document.getElementById('autoCloseTime');

function formatTime(ms) {
    return new Date(ms).toTimeString().split(' ')[0];
}

function updateUI() {
    const doorGraphic = document.getElementById('doorGraphic');
    const statusBadge = document.getElementById('statusBadge');
    const statusTime = document.getElementById('statusTime');

    if (isDoorOpen) {
        doorGraphic.className = 'door-wrapper open';
        statusBadge.className = 'status-badge open';
        statusBadge.innerHTML = '🔓 문이 열려있습니다.';
    } else {
        doorGraphic.className = 'door-wrapper closed';
        statusBadge.className = 'status-badge closed';
        statusBadge.innerHTML = '🔒 문이 닫혀있습니다.';
    }

    statusTime.innerText = `마지막 상태 변경: ${formatTime(changedAt)}`;
}

function saveState() {
    writeJSON(STORAGE_KEYS.DOOR_STATE, { isOpen: isDoorOpen, changedAt, armedAt });
}

async function setDoorState(open) {
    isDoorOpen = open;
    changedAt = Date.now();
    armedAt = changedAt;
    updateUI();
    saveState();
    scheduleAutoClose();

    if (writer) {
        try {
            const data = new TextEncoder().encode(open ? "OPEN\n" : "CLOSE\n");
            await writer.write(data);
        } catch(e) {
            console.error("Arduino Write Error:", e);
        }
    }
}

function renderCountdown(deadline) {
    const el = document.getElementById('autoCloseCountdown');
    if (deadline === null) {
        el.innerText = '';
        return;
    }
    const left = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
    el.innerText = `${Math.floor(left / 60)}분 ${String(left % 60).padStart(2, '0')}초 후 자동으로 닫힙니다.`;
}

function scheduleAutoClose() {
    clearTimeout(autoCloseTimer);
    clearInterval(countdownTimer);
    autoCloseTimer = null;
    countdownTimer = null;

    if (!isDoorOpen || !toggle.checked) {
        renderCountdown(null);
        return;
    }

    const deadline = armedAt + Number(select.value) * 60 * 1000;
    if (deadline <= Date.now()) {
        setDoorState(false);
        return;
    }
    autoCloseTimer = setTimeout(() => setDoorState(false), deadline - Date.now());
    renderCountdown(deadline);
    countdownTimer = setInterval(() => renderCountdown(deadline), 1000);
}

function onAutoCloseSettingChange() {
    writeJSON(STORAGE_KEYS.DOOR_AUTO_CLOSE, { enabled: toggle.checked, minutes: Number(select.value) });
    armedAt = Date.now();
    saveState();
    scheduleAutoClose();
}

async function connectArduino() {
    if ("serial" in navigator) {
        try {
            port = await navigator.serial.requestPort();
            await port.open({ baudRate: 9600 });
            writer = port.writable.getWriter();
            alert("아두이노 메가와 정상적으로 연결되었습니다!");
        } catch (err) {
            alert("아두이노 연결에 실패했거나 취소되었습니다: " + err);
        }
    } else {
        alert("이 브라우저는 Web Serial API를 지원하지 않습니다. Chrome 브라우저를 사용해 주세요.");
    }
}

document.getElementById('closeBtn').addEventListener('click', () => setDoorState(false));
document.getElementById('openBtn').addEventListener('click', () => setDoorState(true));
document.getElementById('serialBtn').addEventListener('click', connectArduino);
toggle.addEventListener('change', onAutoCloseSettingChange);
select.addEventListener('change', onAutoCloseSettingChange);

// Restore saved settings and door state
const savedSettings = readJSON(STORAGE_KEYS.DOOR_AUTO_CLOSE, null);
if (savedSettings) {
    toggle.checked = !!savedSettings.enabled;
    if ([...select.options].some((o) => Number(o.value) === savedSettings.minutes)) {
        select.value = String(savedSettings.minutes);
    }
}
const saved = readJSON(STORAGE_KEYS.DOOR_STATE, null);
if (saved && typeof saved.isOpen === 'boolean') {
    isDoorOpen = saved.isOpen;
    if (typeof saved.changedAt === 'number') changedAt = saved.changedAt;
    armedAt = typeof saved.armedAt === 'number' ? saved.armedAt : changedAt;
}
updateUI();
scheduleAutoClose();
