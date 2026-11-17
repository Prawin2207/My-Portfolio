// Three.js "signal terrain": a field of particles forming a living waveform.
// - travelling lime pulses = data moving through the pipeline
// - pointer creates a ripple on the surface
// - scroll progress lifts & scatters the field
import * as THREE from 'three';

const vertex = /* glsl */ `
  uniform float uTime;
  uniform float uScatter;
  uniform float uPixelRatio;
  uniform vec2  uMouse;
  uniform float uMouseStrength;
  attribute float aRandom;
  varying float vGlow;
  varying float vFade;

  void main() {
    vec3 p = position;
    float t = uTime;

    // layered waves
    float h = sin(p.x * 0.45 + t * 0.7) * 0.55
            + sin(p.z * 0.8 - t * 0.9) * 0.35
            + sin((p.x + p.z) * 0.25 + t * 0.4) * 0.6;

    // pointer ripple
    float d = distance(p.xz, uMouse);
    h += sin(d * 2.2 - t * 5.0) * exp(-d * 0.55) * 0.9 * uMouseStrength;

    // travelling data pulse along x
    float pulse = fract(p.x * 0.035 - t * 0.12 + floor(p.z * 0.5) * 0.17);
    vGlow = smoothstep(0.92, 1.0, pulse) + smoothstep(0.6, 1.4, h) * 0.6;

    p.y += h;
    // scroll scatter
    p.y += uScatter * (aRandom * 9.0 + 1.0);
    p.x += uScatter * (aRandom - 0.5) * 6.0;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = (2.0 + aRandom * 2.0 + vGlow * 3.5) * uPixelRatio * (10.0 / -mv.z);
    vFade = smoothstep(34.0, 6.0, -mv.z);
  }
`;

const fragment = /* glsl */ `
  uniform float uAlpha;
  varying float vGlow;
  varying float vFade;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    float a = smoothstep(0.5, 0.05, d);
    vec3 bone = vec3(0.93, 0.91, 0.87);
    vec3 lime = vec3(0.776, 1.0, 0.239);
    vec3 col = mix(bone * 0.7, lime, clamp(vGlow, 0.0, 1.0));
    gl_FragColor = vec4(col, a * vFade * (0.75 + vGlow * 0.25) * uAlpha);
  }
`;

export function createSignalTerrain(canvas, { dense = true } = {}) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: true, powerPreference: 'high-performance' });
  const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.75);
  renderer.setPixelRatio(pixelRatio);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 100);
  camera.position.set(0, 3.6, 11);
  camera.lookAt(0, 0, -2);

  // particle grid
  const cols = dense ? 220 : 120;
  const rows = dense ? 90 : 55;
  const count = cols * rows;
  const positions = new Float32Array(count * 3);
  const randoms = new Float32Array(count);
  let i = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      positions[i * 3] = (c / (cols - 1) - 0.5) * 44;
      positions[i * 3 + 1] = 0;
      positions[i * 3 + 2] = -(r / (rows - 1)) * 30 + 6;
      randoms[i] = Math.random();
      i++;
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 1));

  const uniforms = {
    uTime: { value: 0 },
    uScatter: { value: 0 },
    uPixelRatio: { value: pixelRatio },
    uMouse: { value: new THREE.Vector2(999, 999) },
    uMouseStrength: { value: 0 },
    uAlpha: { value: 0 }
  };
  const material = new THREE.ShaderMaterial({
    vertexShader: vertex,
    fragmentShader: fragment,
    uniforms,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  });
  const points = new THREE.Points(geometry, material);
  scene.add(points);

  // pointer -> plane (y = 0) projection
  const raycaster = new THREE.Raycaster();
  const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
  const ndc = new THREE.Vector2();
  const hit = new THREE.Vector3();
  const targetMouse = new THREE.Vector2(999, 999);
  let mouseActive = 0;
  let camTargetX = 0;

  const setPointer = (x, y) => {
    const rect = canvas.getBoundingClientRect();
    ndc.set(((x - rect.left) / rect.width) * 2 - 1, -((y - rect.top) / rect.height) * 2 + 1);
    raycaster.setFromCamera(ndc, camera);
    if (raycaster.ray.intersectPlane(plane, hit)) {
      targetMouse.set(hit.x, hit.z);
      mouseActive = 1;
    }
    camTargetX = ndc.x * 0.8;
  };
  const clearPointer = () => { mouseActive = 0; };

  const resize = () => {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  };
  resize();

  const clock = new THREE.Clock();
  let raf = 0;
  let running = false;
  const tick = () => {
    const t = clock.getElapsedTime();
    uniforms.uTime.value = t;
    uniforms.uAlpha.value += (1 - uniforms.uAlpha.value) * 0.02;
    uniforms.uMouse.value.lerp(targetMouse, 0.08);
    uniforms.uMouseStrength.value += (mouseActive - uniforms.uMouseStrength.value) * 0.05;
    camera.position.x += (camTargetX - camera.position.x) * 0.04;
    camera.lookAt(0, 0, -2);
    renderer.render(scene, camera);
    raf = requestAnimationFrame(tick);
  };

  return {
    start() { if (!running) { running = true; if (!clock.running) clock.start(); tick(); } },
    stop() { running = false; cancelAnimationFrame(raf); },
    setScatter(v) { uniforms.uScatter.value = v; },
    setPointer,
    clearPointer,
    resize,
    renderOnce() { renderer.render(scene, camera); },
    dispose() {
      cancelAnimationFrame(raf);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    }
  };
}
