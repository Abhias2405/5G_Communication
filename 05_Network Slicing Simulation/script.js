
// Network slice parameters
const sliceParams = {
    eMBB: { maxThroughput: 1000, maxLatency: 100, resourceAllocation: 0.5 },
    URLLC: { maxThroughput: 100, maxLatency: 1, resourceAllocation: 0.3 },
    mMTC: { maxThroughput: 10, maxLatency: 1000, resourceAllocation: 0.2 }
};

let simulationData = {};

// Generate random traffic
function generateTraffic(mean, stdDev) {
    return Math.max(0, mean + stdDev * (Math.random() + Math.random() + Math.random() - 1.5));
}

// Simulate network slicing
function simulateNetworkSlicing(time) {
    let data = {
        eMBB: { throughput: [], latency: [], packetLoss: [] },
        URLLC: { throughput: [], latency: [], packetLoss: [] },
        mMTC: { throughput: [], latency: [], packetLoss: [] }
    };

    for (let t = 0; t < time; t++) {
        for (let sliceType in sliceParams) {
            let params = sliceParams[sliceType];
            let trafficLoad = generateTraffic(50, 20);
            let resourceUtilization = trafficLoad / 100 * params.resourceAllocation;

            let throughput = Math.min(params.maxThroughput, params.maxThroughput * resourceUtilization);
            let latency = params.maxLatency * (1 + resourceUtilization);
            let packetLoss = Math.max(0, (resourceUtilization - 1) * 100);

            data[sliceType].throughput.push(throughput);
            data[sliceType].latency.push(latency);
            data[sliceType].packetLoss.push(packetLoss);
        }
    }

    return data;
}

// Run simulation
function runSimulation() {
    const simulationTime = parseInt(document.getElementById('simulationTime').value);
    simulationData = simulateNetworkSlicing(simulationTime);
    plotSimulationData();
}

// Plot simulation data using Plotly
function plotSimulationData() {
    let data = [];
    let colors = { eMBB: 'cyan', URLLC: 'yellow', mMTC: 'magenta' };

    for (let sliceType in simulationData) {
        data.push({
            x: Array.from({ length: simulationData[sliceType].throughput.length }, (_, i) => i),
            y: simulationData[sliceType].throughput,
            type: 'scatter',
            name: `${sliceType} Throughput (Mbps)`,
            line: { color: colors[sliceType] }
        });
        data.push({
            x: Array.from({ length: simulationData[sliceType].latency.length }, (_, i) => i),
            y: simulationData[sliceType].latency,
            type: 'scatter',
            name: `${sliceType} Latency (ms)`,
            line: { color: colors[sliceType], dash: 'dash' }
        });
        data.push({
            x: Array.from({ length: simulationData[sliceType].packetLoss.length }, (_, i) => i),
            y: simulationData[sliceType].packetLoss,
            type: 'scatter',
            name: `${sliceType} Packet Loss (%)`,
            line: { color: colors[sliceType], dash: 'dot' }
        });
    }

    let layout = {
        title: 'Network Slicing Performance',
        xaxis: { title: 'Time (s)' },
        yaxis: { title: 'Performance Metrics' },
        paper_bgcolor: '#121212',
        plot_bgcolor: '#121212',
        font: { color: '#f0f0f0' },
        legend: { orientation: 'h', y: -0.2 }
    };

    Plotly.newPlot('trafficChart', data, layout);
}


runSimulation();
