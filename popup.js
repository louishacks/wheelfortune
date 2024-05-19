document.addEventListener('DOMContentLoaded', (event) => {
    const wheelCanvas = document.getElementById('wheel');
    const spinButton = document.getElementById('spin-button');
    const resultDiv = document.getElementById('result');
    const spinSound = document.getElementById('spin-sound');
    const jackpotSound = document.getElementById('jackpot-sound');
    const wheelCtx = wheelCanvas.getContext('2d');
    const wheelValues = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
    const numSegments = wheelValues.length;
    const segmentAngle = 2 * Math.PI / numSegments;
    let isSpinning = false;

    // Set the canvas size to the container's size
    function resizeCanvas() {
        const container = document.querySelector('.wheel-container');
        wheelCanvas.width = container.clientWidth;
        wheelCanvas.height = container.clientHeight;
        drawWheel();
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Draw the wheel
    function drawWheel() {
        const radius = wheelCanvas.width / 2;
        for (let i = 0; i < numSegments; i++) {
            wheelCtx.beginPath();
            wheelCtx.moveTo(radius, radius);
            wheelCtx.arc(radius, radius, radius, i * segmentAngle, (i + 1) * segmentAngle);
            wheelCtx.fillStyle = i % 2 === 0 ? '#ffcc00' : '#ff9900';
            wheelCtx.fill();
            wheelCtx.save();
            wheelCtx.translate(radius, radius);
            wheelCtx.rotate((i + 0.5) * segmentAngle);
            wheelCtx.fillStyle = 'black';
            wheelCtx.font = `${radius / 10}px Arial`;
            wheelCtx.fillText(wheelValues[i] + '€', radius / 2, 10);
            wheelCtx.restore();
        }
    }

    // Spin the wheel
    spinButton.addEventListener('click', () => {
        if (isSpinning) return;
        isSpinning = true;
        spinSound.play();
        let startAngle = 0;
        let spinTime = 0;
        const spinTimeTotal = Math.random() * 3000 + 4000;

        function rotateWheel() {
            spinTime += 30;
            if (spinTime >= spinTimeTotal) {
                stopRotateWheel();
                return;
            }
            const spinAngle = easeOut(spinTime, 0, 2 * Math.PI * 8, spinTimeTotal);
            startAngle += spinAngle;
            drawRotatedWheel(startAngle);
            requestAnimationFrame(rotateWheel);
        }

        function drawRotatedWheel(angle) {
            const radius = wheelCanvas.width / 2;
            wheelCtx.clearRect(0, 0, wheelCanvas.width, wheelCanvas.height);
            wheelCtx.save();
            wheelCtx.translate(radius, radius);
            wheelCtx.rotate(angle);
            wheelCtx.translate(-radius, -radius);
            drawWheel();
            wheelCtx.restore();
        }

        function stopRotateWheel() {
            const degrees = startAngle * 180 / Math.PI + 90;
            const arcd = segmentAngle * 180 / Math.PI;
            const index = Math.floor((360 - degrees % 360) / arcd);
            resultDiv.innerText = `Vous avez gagné ${wheelValues[index]}€!`;
            jackpotSound.play();
            isSpinning = false;
        }

        rotateWheel();
    });

    function easeOut(t, b, c, d) {
        t /= d;
        t--;
        return c * (t * t * t + 1) + b;
    }
});
