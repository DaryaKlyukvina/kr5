const canvas = document.getElementById('analogClock');
const ctx = canvas.getContext('2d');
const centerX = canvas.width / 2;
const centerY = canvas.height / 2;
const radius = 130;

function drawClock(hours, minutes, seconds) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Циферблат
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 4;
    ctx.stroke();

    // Разметка
    ctx.font = '18px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    for (let i = 1; i <= 12; i++) {
        const angle = (i * 30) * Math.PI / 180;
        const x = centerX + Math.sin(angle) * (radius - 30);
        const y = centerY - Math.cos(angle) * (radius - 30);
        ctx.fillText(i, x, y);
    }

    // Часовую стрелку
    const hourAngle = (hours % 12) * 30 + minutes * 0.5;
    drawHand(hourAngle, 60, 6, '#000');

    // Минутную стрелку
    const minuteAngle = minutes * 6;
    drawHand(minuteAngle, 90, 4, '#000');

    // Секундную стрелку
    const secondAngle = seconds * 6;
    drawHand(secondAngle, 100, 2, 'red');

    ctx.beginPath();
    ctx.arc(centerX, centerY, 6, 0, 2 * Math.PI);
    ctx.fillStyle = '#333';
    ctx.fill();
}

function drawHand(angle, length, width, color) {
    const rad = angle * Math.PI / 180;
    const x = centerX + Math.sin(rad) * length;
    const y = centerY - Math.cos(rad) * length;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(x, y);
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.lineCap = 'round';
    ctx.stroke();
}

function updateDigitalTime(hours, minutes, seconds) {
    const formatted = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    document.getElementById('digitalTime').textContent = formatted;
}

async function fetchTime() {
    try {
        const res = await fetch('/api/clock/time');
        const data = await res.json();
        
        if (data.success) {
            const time = data.time;
            drawClock(time.hours, time.minutes, time.seconds);
            updateDigitalTime(time.hours, time.minutes, time.seconds);
            document.getElementById('serverTime').textContent = `Серверное время: ${time.iso}`;
            showApiResponse(data);
        }
    } catch (error) {
        console.error('Ошибка:', error);
    }
}

async function fetchTimezone(zone) {
    try {
        const res = await fetch(`/api/clock/timezone?zone=${zone}`);
        const data = await res.json();
        
        if (data.success) {
            const date = new Date(data.adjustedTime);
            drawClock(date.getHours(), date.getMinutes(), date.getSeconds());
            updateDigitalTime(date.getHours(), date.getMinutes(), date.getSeconds());
            showApiResponse(data);
        }
    } catch (error) {
        console.error('Ошибка:', error);
    }
}

async function fetchAnalogData() {
    try {
        const res = await fetch('/api/clock/analog');
        const data = await res.json();
        
        if (data.success) {
            const time = data.time;
            drawClock(time.hours, time.minutes, time.seconds);
            updateDigitalTime(time.hours, time.minutes, time.seconds);
            showApiResponse(data);
        }
    } catch (error) {
        console.error('Ошибка:', error);
    }
}

function showApiResponse(data) {
    const output = document.getElementById('apiOutput');
    output.innerHTML = `
        <div class="response">
            <h4>Ответ API:</h4>
            <pre>${JSON.stringify(data, null, 2)}</pre>
        </div>
    `;
}

function updateClock() {
    const now = new Date();
    drawClock(now.getHours(), now.getMinutes(), now.getSeconds());
    updateDigitalTime(now.getHours(), now.getMinutes(), now.getSeconds());
}

setInterval(updateClock, 1000);
updateClock();
fetchTime(); 