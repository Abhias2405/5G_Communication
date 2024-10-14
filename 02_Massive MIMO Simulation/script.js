
function simulateMassiveMIMO(antennas, users) {
    const snrDb = 20; // Assuming 20dB SNR
    const snr = Math.pow(10, snrDb / 10);
    const capacity = Math.min(antennas, users) * Math.log2(1 + snr * Math.max(antennas, users) / Math.min(antennas, users));

    // Simplified spectral efficiency calculation
    const spectralEfficiency = capacity / users;

    return { capacity, spectralEfficiency };
}

function runSimulation() {
    const antennas = parseInt(document.getElementById('antennas').value);
    const users = parseInt(document.getElementById('users').value);

    const results = [];
    for (let m = 1; m <= antennas; m += Math.max(1, Math.floor(antennas / 20))) {
        const { capacity, spectralEfficiency } = simulateMassiveMIMO(m, users);
        results.push({ antennas: m, capacity, spectralEfficiency });
    }

    drawChart(results);
}

function drawChart(data) {
    const canvas = document.getElementById('chart');
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Clear previous chart
    ctx.clearRect(0, 0, width, height);

    // Draw axes
    ctx.beginPath();
    ctx.moveTo(50, 50);
    ctx.lineTo(50, height - 50);
    ctx.lineTo(width - 50, height - 50);
    ctx.stroke();

    // Find max values for scaling
    const maxCapacity = Math.max(...data.map(d => d.capacity));
    const maxSpectralEfficiency = Math.max(...data.map(d => d.spectralEfficiency));

    // Draw grid lines (for better visualization)
    drawGridLines(ctx, width, height);

    // Draw capacity line
    ctx.beginPath();
    ctx.strokeStyle = 'blue';
    data.forEach((point, index) => {
        const x = 50 + (width - 100) * (index / (data.length - 1));
        const y = height - 50 - (height - 100) * (point.capacity / maxCapacity);
        if (index === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });
    ctx.stroke();

    // Draw spectral efficiency line
    ctx.beginPath();
    ctx.strokeStyle = 'red';
    data.forEach((point, index) => {
        const x = 50 + (width - 100) * (index / (data.length - 1));
        const y = height - 50 - (height - 100) * (point.spectralEfficiency / maxSpectralEfficiency);
        if (index === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });
    ctx.stroke();

    // Label axes
    ctx.fillStyle = 'black';
    ctx.font = '12px Arial';
    ctx.fillText('Number of Antennas', width / 2, height - 10);
    ctx.save();
    ctx.translate(15, height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('Capacity / Spectral Efficiency', 0, 0);
    ctx.restore();
}

function drawGridLines(ctx, width, height) {
    ctx.strokeStyle = '#ddd';
    ctx.beginPath();
    for (let i = 1; i <= 5; i++) {
        const x = 50 + i * (width - 100) / 5;
        ctx.moveTo(x, 50);
        ctx.lineTo(x, height - 50);
    }
    for (let i = 1; i <= 5; i++) {
        const y = 50 + i * (height - 100) / 5;
        ctx.moveTo(50, y);
        ctx.lineTo(width - 50, y);
    }
    ctx.stroke();
}

// Initial simulation
runSimulation();
