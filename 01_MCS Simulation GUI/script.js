
const modulationSchemes = ['BPSK', 'QPSK', '16-QAM', '64-QAM'];
const channelConditions = ['AWGN', 'Rayleigh'];

function simulateMCS(modulation, channel, snrRange) {
    return snrRange.map(snr => {
        let ber;
        if (channel === 'AWGN') {
            // Simplified calculation based on modulation
            ber = Math.exp(-snr / (2 * Math.log2(modulationSchemes.indexOf(modulation) + 2)));
        } else { // Rayleigh
            ber = 0.5 * (1 - Math.sqrt(snr / (snr + 1)));
        }
        return { snr, ber: Math.max(ber, 1e-5) }; // BER floor of 1e-5
    });
}

function runSimulation() {
    const modulation = document.getElementById('modulation').value;
    const channel = document.getElementById('channel').value;
    const snrRange = Array.from({ length: 20 }, (_, i) => i); // SNR from 0 to 19 dB
    const data = simulateMCS(modulation, channel, snrRange);
    drawChart(data);
}

function drawChart(data) {
    const canvas = document.getElementById('chart');
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Clear previous chart
    ctx.clearRect(0, 0, width, height);

    // Draw axes
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(50, 50);
    ctx.lineTo(50, height - 50);
    ctx.lineTo(width - 50, height - 50);
    ctx.stroke();

    // Plot data points (Logarithmic scale for BER)
    ctx.beginPath();
    ctx.strokeStyle = '#00adb5';
    ctx.lineWidth = 2;
    data.forEach((point, index) => {
        const x = 50 + (width - 100) * (index / (data.length - 1));
        const y = height - 50 - (height - 100) * (Math.log10(point.ber) / -5); // Log scale for BER (1e-5 to 1)
        if (index === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });
    ctx.stroke();

    // Label axes
    ctx.fillStyle = '#ffffff';
    ctx.font = '12px Arial';
    ctx.fillText('SNR (dB)', width / 2, height - 10);
    ctx.save();
    ctx.translate(15, height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('BER', 0, 0);
    ctx.restore();

    // Draw ticks on X-axis (SNR)
    ctx.beginPath();
    ctx.lineWidth = 1;
    for (let i = 0; i < data.length; i++) {
        const x = 50 + (width - 100) * (i / (data.length - 1));
        ctx.moveTo(x, height - 50);
        ctx.lineTo(x, height - 45);
        ctx.fillText(i, x - 5, height - 30);
    }
    ctx.stroke();
}


runSimulation();
