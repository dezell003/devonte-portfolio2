import * as THREE from 'three';

/**
 * Build the slow, drifting wireframe geometry behind the /about page.
 * Sibling to landing-three.js but transparent (lets the page bg show
 * through), slower (calm not reactive), and uses polyhedra instead of
 * the sphere/rings combo.
 *
 * Returns { destroy } so main.js can tear down the RAF + GPU resources
 * when navigating away from /about.
 */
export function createAboutScene(container) {
  const scene = new THREE.Scene();
  // Transparent — the page's #020a12 background shows through.

  const camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    0.1,
    1000,
  );
  camera.position.z = 38;

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);
  container.appendChild(renderer.domElement);

  const group = new THREE.Group();
  scene.add(group);

  const disposables = [];
  const track = (obj) => { disposables.push(obj); return obj; };

  // Outer wireframe icosahedron — the dominant shape.
  const icoGeom = track(new THREE.IcosahedronGeometry(12, 1));
  const icoEdges = track(new THREE.EdgesGeometry(icoGeom));
  const icoMat = track(new THREE.LineBasicMaterial({
    color: 0x4ae2f2,
    transparent: true,
    opacity: 0.32,
  }));
  const ico = new THREE.LineSegments(icoEdges, icoMat);
  group.add(ico);

  // Inner octahedron — smaller, baby-blue.
  const octaGeom = track(new THREE.OctahedronGeometry(7, 0));
  const octaEdges = track(new THREE.EdgesGeometry(octaGeom));
  const octaMat = track(new THREE.LineBasicMaterial({
    color: 0x89cff0,
    transparent: true,
    opacity: 0.22,
  }));
  const octa = new THREE.LineSegments(octaEdges, octaMat);
  group.add(octa);

  // Small node points at each icosahedron vertex.
  const nodeMat = track(new THREE.PointsMaterial({
    color: 0x4ae2f2,
    size: 0.32,
    transparent: true,
    opacity: 0.85,
  }));
  const nodeGeom = track(new THREE.BufferGeometry());
  nodeGeom.setAttribute('position', icoGeom.getAttribute('position').clone());
  const nodes = new THREE.Points(nodeGeom, nodeMat);
  group.add(nodes);

  // Background starfield — sparser + dimmer than landing's.
  const particleCount = 700;
  const positions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 140;
  }
  const particlesGeom = track(new THREE.BufferGeometry());
  particlesGeom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const particlesMat = track(new THREE.PointsMaterial({
    color: 0x9be7ff,
    size: 0.09,
    transparent: true,
    opacity: 0.55,
  }));
  const particles = new THREE.Points(particlesGeom, particlesMat);
  scene.add(particles);

  const onResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  };
  window.addEventListener('resize', onResize);

  let rafId = 0;
  let stopped = false;

  function tick() {
    if (stopped) return;
    rafId = requestAnimationFrame(tick);

    const t = performance.now() * 0.001;
    // ~5× slower than landing for a calm "shifting" feel.
    ico.rotation.x += 0.0006;
    ico.rotation.y += 0.0008;
    octa.rotation.y -= 0.0010;
    octa.rotation.z += 0.0007;
    nodes.rotation.copy(ico.rotation);
    particles.rotation.y += 0.0003;
    group.position.x = Math.sin(t * 0.2) * 1.2;
    group.position.y = Math.cos(t * 0.15) * 0.8;

    renderer.render(scene, camera);
  }
  tick();

  function destroy() {
    stopped = true;
    cancelAnimationFrame(rafId);
    window.removeEventListener('resize', onResize);
    disposables.forEach((d) => d.dispose?.());
    renderer.dispose();
    if (renderer.domElement.parentNode) {
      renderer.domElement.parentNode.removeChild(renderer.domElement);
    }
  }

  return { destroy };
}
