
function calculatePathLoss(distance, frequency, model, environment) {
    const c = 299792458; // Speed of light in m/s
    const f = frequency * 1e9; // Convert GHz to Hz
    let pathLoss;

    if (model === 'fspl') {
        // Free Space Path Loss formula
        pathLoss = 20 * Math.log10(distance) + 20 * Math.log10(f) - 147.55;
    } else if (model === 'cost231') {
        // COST231 Path Loss model
        const a = environment === 'urban' ? 3.2 : 2;
        const b = environment === 'urban' ? 11.75 : 28.3;
        pathLoss = 46.3 + 33.9 * Math.log10(f / 1e6) - 13.82 * Math.log10(10) - a +
            (44.9 - 6.55 * Math.log10(10)) * Math.log10(distance / 1000) + b;
    }

    // Add random environment-specific effects
    if (environment === 'urban') {
        pathLoss += 10 * Math.random(); // Random urban clutter
    } else {
        pathLoss += 5 * Math.random(); // Random indoor obstacles
    }

    return pathLoss;
}

function createPathLossPlot(distances, pathLosses) {
    const trace = {
        x: distances,
        y: pathLosses,
        mode: 'lines',
        type: 'scatter',
        line: { color: '#00ff00' }
    };

    const layout = {
        title: 'Path Loss vs. Distance',
        xaxis: { title: 'Distance (m)', color: '#ffffff', tickcolor: '#ffffff' },
        yaxis: { title: 'Path Loss (dB)', color: '#ffffff', tickcolor: '#ffffff' },
        paper_bgcolor: '#1e1e1e',
        plot_bgcolor: '#1e1e1e',
        font: { color: '#ffffff' }
    };

    Plotly.newPlot('pathLossChart', [trace], layout);
}

function createEnvironmentMap(environment) {
    const gridSize = 50;
    const z = Array(gridSize).fill().map(() => Array(gridSize).fill(0));
    const transmitterX = 25;
    const transmitterY = 25;

    // Populate z values for the heatmap based on the distance to the transmitter
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            const distance = Math.sqrt(Math.pow(i - transmitterX, 2) + Math.pow(j - transmitterY, 2));
            z[i][j] = -calculatePathLoss(distance, 60, 'fspl', environment);
        }
    }

    const data = [{
        z: z,
        type: 'heatmap',
        colorscale: 'Viridis'
    }];

    const layout = {
        title: `${environment.charAt(0).toUpperCase() + environment.slice(1)} Environment Map`,
        xaxis: { title: 'X coordinate', color: '#ffffff', tickcolor: '#ffffff' },
        yaxis: { title: 'Y coordinate', color: '#ffffff', tickcolor: '#ffffff' },
        paper_bgcolor: '#1e1e1e',
        plot_bgcolor: '#1e1e1e',
        font: { color: '#ffffff' }
    };

    Plotly.newPlot('environmentMap', data, layout);
}

function runSimulation() {
    const environment = document.getElementById('environment').value;
    const pathLossModel = document.getElementById('pathLossModel').value;
    const frequency = parseFloat(document.getElementById('frequency').value);

    // Create distances array and calculate path losses
    const distances = Array.from({ length: 100 }, (_, i) => i + 1);
    const pathLosses = distances.map(d => calculatePathLoss(d, frequency, pathLossModel, environment));

    createPathLossPlot(distances, pathLosses); // Generate the path loss plot
    createEnvironmentMap(environment); // Generate the environment map
}

runSimulation();
