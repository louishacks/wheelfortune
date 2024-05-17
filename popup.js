const canvas = document.getElementById('wheelCanvas');
const ctx = canvas.getContext('2d');
const spinButton = document.getElementById('spinButton');
const resultText = document.getElementById('resultText');
const segments = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
const colors = ['#FF595E', '#FFCA3A', '#8AC926', '#1982C4', '#6A4C93', '#FF595E', '#FFCA3A', '#8AC926', '#1982C4', '#6A4C93'];

function drawWheel() {
    const angle = Math.PI * 2 / segments.length;
    for (let i = 0; i < segments.length; i++) {
        ctx.beginPath();
        ctx.arc(250, 250, 200, angle * i, angle * (i + 1), false);
        ctx.lineTo(250, 250);
        ctx.fillStyle = colors[i];
        ctx.fill();
        ctx.stroke();
    }
}

function rotateWheel() {
    const spins = Math.floor(Math.random() * 360 + 3600); // Minimum de 10 tours pour faire plus dramatique
    const duration = 4000; // 4 secondes de rotation
    let start = null;

    function step(timestamp) {
        if (!start) start = timestamp;
        const progress = (timestamp - start) / duration;
        const theta = spins * Math.min(progress, 1);
        ctx.clearRect(0, 0, 500, 500);
        ctx.save();
        ctx.translate(250, 250);
        ctx.rotate(theta * Math.PI / 180);
        ctx.translate(-250, -250);
        drawWheel();
        ctx.restore();
        if (progress < 1) {
            requestAnimationFrame(step);
        } else {
            const degrees = spins % 360;
            const segmentIndex = Math.floor(degrees / (360 / segments.length));
            resultText.innerText = `Félicitations! Vous avez gagné ${segments[segments.length - 1 - segmentIndex]}€!`;
        }
    }
    requestAnimationFrame(step);
}

spinButton.addEventListener('click', rotateWheel);

drawWheel();
