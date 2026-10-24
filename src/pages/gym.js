import { DAYS, loadClassroom, todayIndex } from '../shared/classroom.js';

// Criteria: Temp >= 30.0 OR Humidity >= 70
const TEMP_LIMIT = 30.0;
const HUM_LIMIT = 70.0;
const PE_SUBJECT = '체육';

function isGymWeather(temp, hum) {
    return (temp >= TEMP_LIMIT) || (hum >= HUM_LIMIT);
}

function evaluateLocation(temp, hum) {
    const resultCard = document.getElementById('resultCard');
    const resultTitle = document.getElementById('resultTitle');
    const resultSub = document.getElementById('resultSub');
    const resultIcon = document.getElementById('resultIcon');

    document.getElementById('tempVal').innerHTML = `${temp.toFixed(1)}<span>°C</span>`;
    document.getElementById('humidityVal').innerHTML = `${hum.toFixed(0)}<span>%</span>`;

    if (isGymWeather(temp, hum)) {
        resultCard.className = 'result-card gym';
        resultTitle.innerText = '체육관으로 와주세요!';
        resultSub.innerHTML = '현재 온도 또는 습도가<br>기준치를 초과했습니다.';
        resultIcon.innerHTML = '🏢🏃';
    } else {
        resultCard.className = 'result-card playground';
        resultTitle.innerText = '운동장으로 나와주세요!';
        resultSub.innerHTML = '쾌적한 날씨입니다.<br>즐거운 야외 체육활동을 즐기세요.';
        resultIcon.innerHTML = '⚽🏃';
    }

    const now = new Date();
    document.getElementById('measureTime').innerText = now.toTimeString().split(' ')[0];
}

function applyCustomValues() {
    const temp = parseFloat(document.getElementById('inputTemp').value) || 25.0;
    const hum = parseFloat(document.getElementById('inputHum').value) || 50.0;
    evaluateLocation(temp, hum);
}

function updateSensors() {
    applyCustomValues();
}

function esc(v) {
    return String(v == null ? '' : v).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

// List students who have PE today, based on the timetable saved on the main page.
function renderTodayPE() {
    const title = document.getElementById('peTitle');
    const list = document.getElementById('peList');
    const day = todayIndex();
    if (day === -1) {
        title.innerText = '오늘 체육 수업';
        list.innerHTML = '<span class="pe-empty">오늘은 수업이 없는 날입니다.</span>';
        return;
    }

    const { students } = loadClassroom();
    const entries = [];
    students.forEach((s) => {
        s.subjects[day].forEach((sub, period) => {
            if (String(sub).trim() === PE_SUBJECT) entries.push({ period: period + 1, student: s });
        });
    });
    entries.sort((a, b) => a.period - b.period || a.student.id - b.student.id);

    title.innerText = `오늘(${DAYS[day]}) 체육 수업`;
    list.innerHTML = entries.length === 0
        ? '<span class="pe-empty">오늘 체육 수업이 있는 학생이 없습니다.</span>'
        : entries.map((e) => `<span class="pe-chip"><b>${e.period}교시</b>${e.student.id}번 ${esc(e.student.name)}</span>`).join('');
}

// Web Serial for Arduino DHT Sensor
async function connectArduinoSerial() {
    if ("serial" in navigator) {
        try {
            const port = await navigator.serial.requestPort();
            await port.open({ baudRate: 9600 });
            alert("아두이노 온습도 센서와 연동되었습니다!");

            const reader = port.readable.getReader();
            let buffer = "";
            while (true) {
                const { value, done } = await reader.read();
                if (done) break;
                buffer += new TextDecoder().decode(value);
                let lines = buffer.split("\n");
                buffer = lines.pop();
                for (let line of lines) {
                    // Expected format: TEMP:31.8,HUM:78
                    let tempMatch = line.match(/TEMP:([\d.]+)/);
                    let humMatch = line.match(/HUM:([\d.]+)/);
                    if (tempMatch && humMatch) {
                        const t = parseFloat(tempMatch[1]);
                        const h = parseFloat(humMatch[1]);
                        document.getElementById('inputTemp').value = t;
                        document.getElementById('inputHum').value = h;
                        evaluateLocation(t, h);
                    }
                }
            }
        } catch (err) {
            alert("시리얼 연동 실패: " + err);
        }
    } else {
        alert("Chrome 브라우저에서 사용해 주세요.");
    }
}

document.getElementById('refreshBtn').addEventListener('click', updateSensors);
document.getElementById('applyBtn').addEventListener('click', applyCustomValues);
document.getElementById('serialBtn').addEventListener('click', connectArduinoSerial);
window.addEventListener('storage', renderTodayPE);

// Init
evaluateLocation(31.8, 78.0);
renderTodayPE();
