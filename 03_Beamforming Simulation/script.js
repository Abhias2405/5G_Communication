
let scene, camera, renderer, beamPattern;

function initScene() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(960, 500);
    document.getElementById('beamformingCanvas').innerHTML = '';
    document.getElementById('beamformingCanvas').appendChild(renderer.domElement);
    camera.position.z = 5;

    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
}

function createBeamPattern(beamformingType, scenario) {
    const geometry = new THREE.SphereGeometry(2, 32, 32);
    const material = new THREE.MeshPhongMaterial({
        color: 0x00ff00,
        transparent: true,
        opacity: 0.7,
        wireframe: false
    });

    beamPattern = new THREE.Mesh(geometry, material);

    switch (beamformingType) {
        case 'analog':
            beamPattern.scale.set(1, 1, 2);
            break;
        case 'digital':
            beamPattern.scale.set(1.5, 1.5, 1.5);
            if (scenario === 'multiUser') {
                beamPattern.scale.set(1.2, 1.2, 1.8);
            }
            break;
        case 'hybrid':
            beamPattern.scale.set(1.3, 1.3, 1.7);
            if (scenario === 'multiUser') {
                beamPattern.scale.set(1.4, 1.4, 1.6);
            }
            break;
    }

    scene.add(beamPattern);
}

function animate() {
    requestAnimationFrame(animate);

    beamPattern.rotation.x += 0.01;
    beamPattern.rotation.y += 0.01;

    renderer.render(scene, camera);
}

function runSimulation() {
    const beamformingType = document.getElementById('beamformingType').value;
    const scenario = document.getElementById('scenario').value;

    initScene();
    createBeamPattern(beamformingType, scenario);
    animate();

    let signalStrength, interference;
    switch (beamformingType) {
        case 'analog':
            signalStrength = 0.7;
            interference = scenario === 'singleUser' ? 0.2 : 0.4;
            break;
        case 'digital':
            signalStrength = 0.9;
            interference = scenario === 'singleUser' ? 0.1 : 0.3;
            break;
        case 'hybrid':
            signalStrength = 0.8;
            interference = scenario === 'singleUser' ? 0.15 : 0.35;
            break;
    }

    document.getElementById('metrics').innerHTML = `
                <h3>Performance Metrics:</h3>
                <p>Signal Strength: ${signalStrength.toFixed(2)}</p>
                <p>Interference: ${interference.toFixed(2)}</p>
            `;
}

runSimulation();
