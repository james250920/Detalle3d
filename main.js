

// Animación 3D de flores amarillas detalladas y navegación con mouse usando Three.js (ES Modules)
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

init(THREE, OrbitControls);

function createPetalMaterial(THREE) {
	// Gradiente radial simulado para pétalos
	const canvas = document.createElement('canvas');
	canvas.width = 64;
	canvas.height = 64;
	const ctx = canvas.getContext('2d');
	const grad = ctx.createRadialGradient(32, 32, 8, 32, 32, 32);
	grad.addColorStop(0, '#fffde4');
	grad.addColorStop(0.4, '#ffe066');
	grad.addColorStop(1, '#ffeb3b');
	ctx.fillStyle = grad;
	ctx.fillRect(0, 0, 64, 64);
	const texture = new THREE.Texture(canvas);
	texture.needsUpdate = true;
	return new THREE.MeshPhongMaterial({ map: texture, shininess: 120 });
}

function createCenterMaterial(THREE) {
	// Textura ultra detallada para el centro con estilo de polen
	const canvas = document.createElement('canvas');
	canvas.width = 64;
	canvas.height = 64;
	const ctx = canvas.getContext('2d');
	
	// Fondo base
	const grad = ctx.createRadialGradient(32, 32, 5, 32, 32, 45);
	grad.addColorStop(0, '#fffea0');
	grad.addColorStop(0.5, '#ffd700');
	grad.addColorStop(1, '#e6b800');
	ctx.fillStyle = grad;
	ctx.fillRect(0, 0, 64, 64);
	
	// Patrón de polen detallado
	for (let i = 0; i < 150; i++) {
		const x = Math.random() * 64;
		const y = Math.random() * 64;
		const size = Math.random() * 1.5 + 0.5;
		ctx.beginPath();
		ctx.arc(x, y, size, 0, Math.PI * 2);
		ctx.fillStyle = i % 3 === 0 ? '#fffde4' : (i % 3 === 1 ? '#e6b800' : '#d4af37');
		ctx.fill();
	}
	
	// Sombras sutiles para profundidad
	for (let i = 0; i < 40; i++) {
		const x = Math.random() * 64;
		const y = Math.random() * 64;
		ctx.beginPath();
		ctx.arc(x, y, Math.random() * 2 + 1, 0, Math.PI * 2);
		ctx.fillStyle = 'rgba(150, 100, 0, 0.2)';
		ctx.fill();
	}
	
	const texture = new THREE.Texture(canvas);
	texture.needsUpdate = true;
	return new THREE.MeshPhongMaterial({ map: texture, shininess: 100 });
}

function createCurvedStem(THREE) {
	// Tallo curvado usando TubeGeometry
	const curve = new THREE.CubicBezierCurve3(
		new THREE.Vector3(0, 0, 0),
		new THREE.Vector3(0.1, 0.7, 0.1),
		new THREE.Vector3(-0.1, 1.5, -0.1),
		new THREE.Vector3(0, 2.5, 0)
	);
	const geometry = new THREE.TubeGeometry(curve, 32, 0.08, 12, false);
	const material = new THREE.MeshPhongMaterial({ color: 0x6b8e23 });
	const mesh = new THREE.Mesh(geometry, material);
	return mesh;
}

function init(THREE, OrbitControls) {
	// Configuración básica
	const canvas = document.getElementById('flowers-canvas');
	const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.setClearColor(0x000000, 0);

	const scene = new THREE.Scene();
	const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
	camera.position.set(0, 2, 10);

	// Controles de órbita para navegar con el mouse
	const controls = new OrbitControls(camera, renderer.domElement);
	controls.enableDamping = true;
	controls.dampingFactor = 0.08;
	controls.minDistance = 4;
	controls.maxDistance = 30;
	controls.target.set(0, 1.5, 0);

	// Luz ambiental y direccional
	scene.add(new THREE.AmbientLight(0xffffcc, 0.7));
	const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
	dirLight.position.set(5, 10, 7);
	scene.add(dirLight);
	
	// Luces puntuales adicionales para resaltar detalles
	const pointLight1 = new THREE.PointLight(0xffeb3b, 0.6, 20);
	pointLight1.position.set(-8, 5, -8);
	scene.add(pointLight1);
	
	const pointLight2 = new THREE.PointLight(0xffffcc, 0.4, 20);
	pointLight2.position.set(8, 3, 8);
	scene.add(pointLight2);

	// Función para crear una flor amarilla ultra detallada con múltiples capas
	function createFlower() {
		const flower = new THREE.Group();

		// Tallo curvo principal
		const stem = createCurvedStem(THREE);
		stem.position.y = 0;
		flower.add(stem);

		// Ramas secundarias en el tallo
		for (let b = 0; b < 2; b++) {
			const branchCurve = new THREE.CubicBezierCurve3(
				new THREE.Vector3(0, 1.2 - b * 0.4, 0),
				new THREE.Vector3((Math.random() - 0.5) * 0.3, 1.4 - b * 0.4, (Math.random() - 0.5) * 0.3),
				new THREE.Vector3((Math.random() - 0.5) * 0.5, 0.8 - b * 0.4, (Math.random() - 0.5) * 0.5),
				new THREE.Vector3((Math.random() - 0.5) * 0.7, 0.5 - b * 0.4, (Math.random() - 0.5) * 0.7)
			);
			const branchGeom = new THREE.TubeGeometry(branchCurve, 20, 0.035, 8, false);
			const branchMat = new THREE.MeshPhongMaterial({ color: 0x7a9d28 });
			const branch = new THREE.Mesh(branchGeom, branchMat);
			flower.add(branch);
		}

		// Centro de la flor con textura mejorada
		const centerGeom = new THREE.SphereGeometry(0.32, 48, 48);
		const centerMat = createCenterMaterial(THREE);
		const center = new THREE.Mesh(centerGeom, centerMat);
		center.position.y = 2.5;
		flower.add(center);

		// Estambres (síes) dentro del centro
		for (let s = 0; s < 80; s++) {
			const stamenGeom = new THREE.SphereGeometry(0.04, 16, 16);
			const stamenMat = new THREE.MeshPhongMaterial({ 
				color: 0xd4af37, 
				shininess: 120 
			});
			const stamen = new THREE.Mesh(stamenGeom, stamenMat);
			const angle = Math.random() * Math.PI * 2;
			const radius = Math.random() * 0.28;
			const height = Math.random() * 0.15;
			stamen.position.set(
				Math.cos(angle) * radius,
				2.5 - height,
				Math.sin(angle) * radius
			);
			stamen.scale.set(0.7, 1.2 + Math.random() * 0.3, 0.7);
			flower.add(stamen);
		}

		// Primera capa de pétalos (grandes y externos)
		const petalGeom1 = new THREE.SphereGeometry(0.22, 36, 36, 0, Math.PI);
		const petalMat1 = createPetalMaterial(THREE);
		for (let i = 0; i < 18; i++) {
			const petal = new THREE.Mesh(petalGeom1, petalMat1);
			const angle = (i / 18) * Math.PI * 2;
			petal.position.set(Math.cos(angle) * 0.55, 2.5, Math.sin(angle) * 0.55);
			petal.rotation.z = Math.PI / 2 + (Math.random() - 0.5) * 0.25;
			petal.rotation.y = angle + (Math.random() - 0.5) * 0.15;
			petal.scale.set(1.1, 1.9 + Math.random() * 0.25, 0.55 + Math.random() * 0.1);
			flower.add(petal);
		}

		// Segunda capa de pétalos (medianos, más claros)
		const petalMat2 = new THREE.MeshPhongMaterial({ 
			color: 0xfffde4, 
			shininess: 130 
		});
		for (let i = 0; i < 16; i++) {
			const petal = new THREE.Mesh(petalGeom1, petalMat2);
			const angle = (i / 16) * Math.PI * 2 + Math.PI / 16;
			petal.position.set(Math.cos(angle) * 0.48, 2.52, Math.sin(angle) * 0.48);
			petal.rotation.z = Math.PI / 2.3 + (Math.random() - 0.5) * 0.2;
			petal.rotation.y = angle;
			petal.scale.set(0.85, 1.5 + Math.random() * 0.2, 0.45);
			petal.position.y += 0.1;
			flower.add(petal);
		}

		// Tercera capa de pétalos (pequeños, centrales)
		const petalGeom3 = new THREE.SphereGeometry(0.15, 28, 28, 0, Math.PI);
		const petalMat3 = new THREE.MeshPhongMaterial({ 
			color: 0xffeb3b, 
			shininess: 100 
		});
		for (let i = 0; i < 14; i++) {
			const petal = new THREE.Mesh(petalGeom3, petalMat3);
			const angle = (i / 14) * Math.PI * 2 + Math.PI / 7;
			petal.position.set(Math.cos(angle) * 0.35, 2.55, Math.sin(angle) * 0.35);
			petal.rotation.z = Math.PI / 2.5 + (Math.random() - 0.5) * 0.15;
			petal.rotation.y = angle;
			petal.scale.set(0.75, 1.3 + Math.random() * 0.15, 0.4);
			petal.position.y += 0.15;
			flower.add(petal);
		}

		// Hojas mejoradas con más detalles
		const leafMat = new THREE.MeshPhongMaterial({ 
			color: 0x8bc34a, 
			shininess: 70 
		});
		for (let i = 0; i < 4; i++) {
			const leafGeom = new THREE.SphereGeometry(0.3, 32, 32, 0, Math.PI);
			const leaf = new THREE.Mesh(leafGeom, leafMat);
			const angle = (Math.PI / 2) * i + (Math.random() - 0.5) * 0.3;
			const height = 1.0 - (i * 0.25);
			leaf.position.set(
				Math.sin(angle) * 0.55,
				height,
				Math.cos(angle) * 0.55
			);
			leaf.rotation.z = angle + (Math.random() - 0.5) * 0.3;
			leaf.scale.set(1.4 - i * 0.15, 0.6 + Math.random() * 0.15, 0.75);
			flower.add(leaf);
		}

		return flower;
	}

	// Crear varias flores en posiciones aleatorias
	const flowers = [];
	for (let i = 0; i < 12; i++) {
		const flower = createFlower();
		flower.position.x = (Math.random() - 0.5) * 10;
		flower.position.z = (Math.random() - 0.5) * 10;
		flower.position.y = 0;
		flower.rotation.y = Math.random() * Math.PI * 2;
		scene.add(flower);
		flowers.push(flower);
	}

	// Animación mejorada con movimiento más natural
	function animate() {
		requestAnimationFrame(animate);
		flowers.forEach((flower, idx) => {
			// Oscilación suave y natural de los tallos
			flower.rotation.z = Math.sin(Date.now() * 0.0008 + idx) * 0.12;
			flower.rotation.x = Math.sin(Date.now() * 0.0006 + idx * 0.5) * 0.06;
			
			// Movimiento sutil de pétalos más fluido
			let petalCount = 0;
			for (let i = 1; i < flower.children.length; i++) {
				const child = flower.children[i];
				if (child.geometry && child.geometry.type === 'SphereGeometry') {
					petalCount++;
					// Aplicar escala con ondulación diferente para cada pétalo
					const originalScale = [1.1, 0.85, 0.75][petalCount < 18 ? 0 : (petalCount < 34 ? 1 : 2)] || 1;
					child.scale.y = originalScale + Math.sin(Date.now() * 0.002 + idx + i * 0.1) * 0.08;
					
					// Rotación suave de pétalos
					child.rotation.x = Math.sin(Date.now() * 0.001 + idx + i) * 0.05;
				}
			}
		});
		controls.update();
		renderer.render(scene, camera);
	}
	animate();

	// Ajustar tamaño al redimensionar
	window.addEventListener('resize', () => {
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize(window.innerWidth, window.innerHeight);
	});
}
