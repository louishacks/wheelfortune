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

    // Draw the wheel
    function drawWheel() {
        for (let i = 0; i < numSegments; i++) {
            wheelCtx.beginPath();
            wheelCtx.moveTo(250, 250);
            wheelCtx.arc(250, 250, 250, i * segmentAngle, (i + 1) * segmentAngle);
            wheelCtx.fillStyle = i % 2 === 0 ? '#ffcc00' : '#ff9900';
            wheelCtx.fill();
            wheelCtx.save();
            wheelCtx.translate(250, 250);
            wheelCtx.rotate((i + 0.5) * segmentAngle);
            wheelCtx.fillStyle = 'black';
            wheelCtx.font = '24px Arial';
            wheelCtx.fillText(wheelValues[i] + '€', 100, 10);
            wheelCtx.restore();
        }
    }

    drawWheel();

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
            wheelCtx.clearRect(0, 0, 500, 500);
            wheelCtx.save();
            wheelCtx.translate(250, 250);
            wheelCtx.rotate(angle);
            wheelCtx.translate(-250, -250);
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
