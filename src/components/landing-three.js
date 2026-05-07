import * as THREE from 'three';

/**
 * Build the orbital sphere + rings + particle field used as the landing
 * page background. Returns a `destroy()` function that tears down the
 * RAF loop, window listeners, geometries/materials, and the renderer's
 * canvas — call it before unmounting the landing component so we don't
 * leak GPU resources or a 60Hz tick into the next route.
 */
export function createSphereScene(container) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x030509);

  const camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    0.1,
    1000,
  );
  camera.position.z = 35;

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  const group = new THREE.Group();
  scene.add(group);

  // Tracked for disposal.
  const disposables = [];
  const track = (obj) => {
    disposables.push(obj);
    return obj;
  };

  // Core sphere — solid + emissive cyan.
  const sphereGeom = track(new THREE.SphereGeometry(6, 48, 48));
  const sphereMat = track(
    new THREE.MeshStandardMaterial({
      color: 0x13203a,
      emissive: 0x2dd4ea,
      emissiveIntensity: 0.18,
      roughness: 0.4,
      metalness: 0.7,
    }),
  );
  const sphere = new THREE.Mesh(sphereGeom, sphereMat);
  group.add(sphere);

  // Outer wireframe shell.
  const wireGeom = track(new THREE.SphereGeometry(6.4, 24, 24));
  const wireMat = track(
    new THREE.MeshBasicMaterial({
      color: 0x67e8f9,
      wireframe: true,
      transparent: true,
      opacity: 0.15,
    }),
  );
  const wireSphere = new THREE.Mesh(wireGeom, wireMat);
  group.add(wireSphere);

  // Helper for orbital rings.
  function makeRing(radius, tube, color, wireframe = false, opacity = 0.8) {
    const geom = track(new THREE.TorusGeometry(radius, tube, 16, 100));
    const mat = track(
      wireframe
        ? new THREE.MeshBasicMaterial({ color, wireframe: true, transparent: true, opacity })
        : new THREE.MeshStandardMaterial({
            color,
            emissive: color,
            emissiveIntensity: 0.25,
            transparent: true,
            opacity,
          }),
    );
    return new THREE.Mesh(geom, mat);
  }

  const ring1 = makeRing(11, 0.06, 0x7dd3fc, false, 0.9);
  ring1.rotation.x = Math.PI / 3;
  ring1.rotation.y = Math.PI / 5;
  group.add(ring1);

  const ring2 = makeRing(14, 0.08, 0x22d3ee, true, 0.35);
  ring2.rotation.x = -Math.PI / 4;
  ring2.rotation.y = Math.PI / 7;
  group.add(ring2);

  const ring3 = makeRing(8.5, 0.03, 0xffffff, false, 0.55);
  ring3.rotation.x = Math.PI / 2.3;
  ring3.rotation.y = -Math.PI / 3;
  group.add(ring3);

  // Background star field.
  const particleCount = 1400;
  const positions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 120;
  }
  const particlesGeom = track(new THREE.BufferGeometry());
  particlesGeom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const particlesMat = track(
    new THREE.PointsMaterial({
      color: 0x9be7ff,
      size: 0.12,
      transparent: true,
      opacity: 0.75,
    }),
  );
  const particles = new THREE.Points(particlesGeom, particlesMat);
  scene.add(particles);

  // Lighting.
  scene.add(new THREE.AmbientLight(0xffffff, 0.6));
  const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
  dirLight.position.set(8, 8, 10);
  scene.add(dirLight);
  const pointLight = new THREE.PointLight(0x4ae2f2, 2, 100);
  pointLight.position.set(0, 0, 12);
  scene.add(pointLight);

  // Mouse-driven parallax.
  let mouseX = 0;
  let mouseY = 0;
  const onMouseMove = (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  };
  window.addEventListener('mousemove', onMouseMove);

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
    sphere.rotation.y += 0.003;
    wireSphere.rotation.x += 0.002;
    wireSphere.rotation.y += 0.003;
    ring1.rotation.z += 0.004;
    ring2.rotation.z -= 0.002;
    ring3.rotation.z += 0.005;
    particles.rotation.y += 0.0008;
    group.rotation.y += (mouseX * 0.6 - group.rotation.y) * 0.05;
    group.rotation.x += (mouseY * 0.4 - group.rotation.x) * 0.05;
    group.position.y = Math.sin(t * 0.7) * 0.5;

    renderer.render(scene, camera);
  }
  tick();

  function destroy() {
    stopped = true;
    cancelAnimationFrame(rafId);
    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('resize', onResize);
    disposables.forEach((d) => d.dispose?.());
    renderer.dispose();
    if (renderer.domElement.parentNode) {
      renderer.domElement.parentNode.removeChild(renderer.domElement);
    }
  }

  return { destroy };
}
