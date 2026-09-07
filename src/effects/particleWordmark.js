import {
  BufferAttribute, BufferGeometry, Color, DynamicDrawUsage,
  OrthographicCamera, Points, Scene, ShaderMaterial, WebGLRenderer,
} from "three";

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

// Advection and vorticity confinement keep the dust in connected, curling ribbons.
function createFlow(width, height) {
  const CELL = Math.max(10, Math.ceil(Math.max(width, height) / 160));
  const cols = Math.ceil(width / CELL) + 1;
  const rows = Math.ceil(height / CELL) + 1;
  const count = cols * rows;
  let vx = new Float32Array(count), vy = new Float32Array(count);
  let nextX = new Float32Array(count), nextY = new Float32Array(count);
  let pressure = new Float32Array(count), nextPressure = new Float32Array(count);
  const divergence = new Float32Array(count);
  const curl = new Float32Array(count);
  const index = (x, y) => clamp(y, 0, rows - 1) * cols + clamp(x, 0, cols - 1);
  const sample = (field, x, y) => {
    x = clamp(x / CELL, 0, cols - 1);
    y = clamp(y / CELL, 0, rows - 1);
    const ix = Math.floor(x), iy = Math.floor(y), fx = x - ix, fy = y - iy;
    return field[index(ix, iy)] * (1 - fx) * (1 - fy)
      + field[index(ix + 1, iy)] * fx * (1 - fy)
      + field[index(ix, iy + 1)] * (1 - fx) * fy
      + field[index(ix + 1, iy + 1)] * fx * fy;
  };

  return {
    sampleX: (x, y) => sample(vx, x, y),
    sampleY: (x, y) => sample(vy, x, y),
    inject(x, y, dx, dy) {
      const radius = clamp(width * 0.045, 42, 76);
      for (let row = Math.max(0, Math.floor((y - radius) / CELL)); row <= Math.min(rows - 1, Math.ceil((y + radius) / CELL)); row++) {
        for (let col = Math.max(0, Math.floor((x - radius) / CELL)); col <= Math.min(cols - 1, Math.ceil((x + radius) / CELL)); col++) {
          const distance = Math.hypot(col * CELL - x, row * CELL - y);
          if (distance >= radius) continue;
          const weight = Math.exp(-3 * (distance / radius) ** 2) * (1 - distance / radius);
          const i = row * cols + col;
          vx[i] = clamp(vx[i] + dx * weight * 3.2, -65, 65);
          vy[i] = clamp(vy[i] + dy * weight * 3.2, -65, 65);
        }
      }
    },
    step(dt) {
      const decay = Math.pow(0.988, dt);
      let advectedEnergy = 0;
      // Semi-Lagrangian advection carries the field along its own streamlines.
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const i = y * cols + x;
          const backX = x * CELL - vx[i] * dt * 0.45;
          const backY = y * CELL - vy[i] * dt * 0.45;
          nextX[i] = sample(vx, backX, backY) * decay;
          nextY[i] = sample(vy, backX, backY) * decay;
          advectedEnergy += nextX[i] * nextX[i] + nextY[i] * nextY[i];
        }
      }
      [vx, nextX] = [nextX, vx];
      [vy, nextY] = [nextY, vy];
      // Restore small eddies that interpolation would otherwise smooth away.
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          curl[index(x, y)] = 0.5 * (vy[index(x + 1, y)] - vy[index(x - 1, y)]
            - vx[index(x, y + 1)] + vx[index(x, y - 1)]);
        }
      }
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const i = index(x, y);
          const gx = Math.abs(curl[index(x + 1, y)]) - Math.abs(curl[index(x - 1, y)]);
          const gy = Math.abs(curl[index(x, y + 1)]) - Math.abs(curl[index(x, y - 1)]);
          const length = Math.hypot(gx, gy) + 0.0001;
          vx[i] += gy / length * curl[i] * 0.16 * dt;
          vy[i] -= gx / length * curl[i] * 0.16 * dt;
        }
      }
      pressure.fill(0);
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          divergence[index(x, y)] = -0.5 * (vx[index(x + 1, y)] - vx[index(x - 1, y)]
            + vy[index(x, y + 1)] - vy[index(x, y - 1)]);
        }
      }
      for (let pass = 0; pass < 8; pass++) {
        for (let y = 0; y < rows; y++) {
          for (let x = 0; x < cols; x++) {
            const i = index(x, y);
            nextPressure[i] = (divergence[i] + pressure[index(x - 1, y)] + pressure[index(x + 1, y)]
              + pressure[index(x, y - 1)] + pressure[index(x, y + 1)]) * 0.25;
          }
        }
        [pressure, nextPressure] = [nextPressure, pressure];
      }
      let projectedEnergy = 0;
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const i = index(x, y);
          vx[i] = clamp(vx[i] - 0.5 * (pressure[index(x + 1, y)] - pressure[index(x - 1, y)]), -65, 65);
          vy[i] = clamp(vy[i] - 0.5 * (pressure[index(x, y + 1)] - pressure[index(x, y - 1)]), -65, 65);
          projectedEnergy += vx[i] * vx[i] + vy[i] * vy[i];
        }
      }
      // Confinement shapes the wake, but must not sustain motion without new input.
      if (projectedEnergy > advectedEnergy) {
        const scale = Math.sqrt(advectedEnergy / projectedEnergy);
        for (let i = 0; i < count; i++) { vx[i] *= scale; vy[i] *= scale; }
      }
    },
  };
}

export function mountParticleWordmark(root) {
  const canvas = root.querySelector("canvas");
  const renderer = new WebGLRenderer({ canvas, alpha: true, antialias: false, powerPreference: "high-performance" });
  renderer.setClearColor(0, 0);
  const scene = new Scene();
  const camera = new OrthographicCamera(0, 1, 0, 1, 0.1, 10);
  camera.position.z = 1;
  const material = new ShaderMaterial({
    transparent: true,
    depthTest: false,
    depthWrite: false,
    uniforms: { pixelRatio: { value: 1 }, acid: { value: new Color("#f0f3dd") }, ice: { value: new Color("#d6eee6") } },
    vertexShader: `
      attribute float tint;
      attribute float grain;
      uniform float pixelRatio;
      varying float vTint;
      varying float vAlpha;
      void main() {
        vTint = tint;
        vAlpha = 0.72 + grain * 0.28;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = (1.05 + grain * 0.5) * pixelRatio;
      }
    `,
    fragmentShader: `
      uniform vec3 acid;
      uniform vec3 ice;
      varying float vTint;
      varying float vAlpha;
      void main() {
        float edge = 1.0 - smoothstep(0.42, 0.5, length(gl_PointCoord - 0.5));
        gl_FragColor = vec4(mix(acid, ice, vTint), vAlpha * edge);
        #include <colorspace_fragment>
      }
    `,
  });
  let geometry, points, positions, origins, velocities, quietTime, grains, flow;
  let width = 0, height = 0, frame = 0, previous = 0;
  let visible = true, disposed = false, contextLost = false;
  let pointer = null;
  const pending = [];
  let accumulator = 0;

  const resize = () => {
    const nextWidth = Math.round(root.clientWidth), nextHeight = Math.round(root.clientHeight);
    if (!nextWidth || !nextHeight) return;
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    if (width === nextWidth && height === nextHeight && material.uniforms.pixelRatio.value === ratio) return;
    width = nextWidth;
    height = nextHeight;
    renderer.setPixelRatio(ratio);
    renderer.setSize(width, height, false);
    material.uniforms.pixelRatio.value = ratio;
    camera.right = width;
    camera.bottom = height;
    camera.updateProjectionMatrix();
    flow = createFlow(width, height);
    const mask = document.createElement("canvas");
    mask.width = width;
    mask.height = height;
    const ctx = mask.getContext("2d", { willReadFrequently: true });
    let fontSize = Math.min(height * 0.3, width * 0.12, 220);
    ctx.font = `800 ${fontSize}px Arial, sans-serif`;
    fontSize *= Math.min(1, width * 0.87 / ctx.measureText("breakingBad").width);
    ctx.font = `800 ${fontSize}px Arial, sans-serif`;
    ctx.textAlign = "center";
    ctx.fillStyle = "white";
    const metrics = ctx.measureText("breakingBad");
    const baseline = (height + metrics.actualBoundingBoxAscent - metrics.actualBoundingBoxDescent) / 2;
    ctx.fillText("breakingBad", width / 2, baseline);
    const pixels = ctx.getImageData(0, 0, width, height).data;
    const ink = [];
    for (let y = Math.max(0, Math.floor(baseline - metrics.actualBoundingBoxAscent)); y < Math.min(height, Math.ceil(baseline + metrics.actualBoundingBoxDescent)); y++) {
      for (let x = Math.max(0, Math.floor((width - metrics.width) / 2) - 2); x < Math.min(width, Math.ceil((width + metrics.width) / 2) + 2); x++) {
        if (pixels[(y * width + x) * 4 + 3] > 120) ink.push(y * width + x);
      }
    }
    // Random subpixel sampling avoids the visible dotted grid of the first version.
    const count = Math.min(width < 600 ? 24000 : 115000, Math.round(ink.length * 1.8));
    const targets = new Float32Array(count * 3), tints = new Float32Array(count);
    grains = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const pixel = ink[Math.floor(Math.random() * ink.length)];
      const x = pixel % width + Math.random(), y = Math.floor(pixel / width) + Math.random();
      targets[i * 3] = x;
      targets[i * 3 + 1] = y;
      tints[i] = clamp((x / width - 0.15) / 0.7, 0, 1);
      grains[i] = Math.random();
    }
    origins = new Float32Array(targets);
    positions = new Float32Array(targets);
    velocities = new Float32Array(targets.length);
    quietTime = new Float32Array(count);
    quietTime.fill(5);
    if (points) scene.remove(points);
    geometry?.dispose();
    geometry = new BufferGeometry();
    geometry.setAttribute("position", new BufferAttribute(positions, 3).setUsage(DynamicDrawUsage));
    geometry.setAttribute("tint", new BufferAttribute(new Float32Array(tints), 1));
    geometry.setAttribute("grain", new BufferAttribute(new Float32Array(grains), 1));
    points = new Points(geometry, material);
    points.frustumCulled = false;
    scene.add(points);
    pointer = null;
    pending.length = 0;
    accumulator = 0;
    renderer.render(scene, camera);
    root.classList.add("is-live");
  };

  const injectPointer = () => {
    for (const next of pending) {
      const { x, y } = next;
      if (pointer) {
        const dx = x - pointer.x, dy = y - pointer.y;
        const distance = Math.hypot(dx, dy);
        if (distance > 0.1) {
          const steps = Math.max(1, Math.ceil(distance / 8));
          for (let step = 1; step <= steps; step++) {
            flow.inject(pointer.x + dx * step / steps, pointer.y + dy * step / steps,
              dx / steps, dy / steps);
          }
        }
      }
      pointer = next;
    }
    pending.length = 0;
  };

  const simulate = () => {
    flow.step(1);
    for (let i = 0; i < positions.length; i += 3) {
      const x = positions[i], y = positions[i + 1];
      const particle = i / 3;
      const fx = flow.sampleX(x, y), fy = flow.sampleY(x, y);
      const speed = Math.hypot(fx, fy);
      quietTime[particle] = speed > 0.55 ? 0 : quietTime[particle] + 1 / 60;
      // Each grain returns when its own patch of fluid settles, not on a global timer.
      const recovery = clamp((quietTime[particle] - 0.35 - grains[particle] * 0.45) / 1.8, 0, 1);
      const spring = recovery * recovery * 0.032;
      const follow = 0.11 + grains[particle] * 0.045;
      velocities[i] = velocities[i] * 0.72 + fx * follow + (origins[i] - x) * spring;
      velocities[i + 1] = velocities[i + 1] * 0.72 + fy * follow + (origins[i + 1] - y) * spring;
      // A soft boundary lets dust turn around instead of collecting on a hard edge.
      velocities[i] += Math.max(0, 24 - x) * 0.025 - Math.max(0, x - width + 24) * 0.025;
      velocities[i + 1] += Math.max(0, 24 - y) * 0.025 - Math.max(0, y - height + 24) * 0.025;
      positions[i] = x + clamp(velocities[i], -22, 22);
      positions[i + 1] = y + clamp(velocities[i + 1], -22, 22);
    }
  };

  const tick = (now) => {
    frame = 0;
    if (disposed || contextLost || !visible || document.hidden) return;
    accumulator = Math.min(accumulator + (now - previous) / (1000 / 60), 3);
    previous = now;
    // Fixed simulation steps give the same motion on 60 Hz and 144 Hz displays.
    if (accumulator >= 1) injectPointer();
    while (accumulator >= 1) {
      simulate();
      accumulator -= 1;
    }
    geometry.attributes.position.needsUpdate = true;
    renderer.render(scene, camera);
    frame = requestAnimationFrame(tick);
  };
  const sync = () => {
    cancelAnimationFrame(frame);
    frame = 0;
    if (!disposed && !contextLost && visible && !document.hidden) {
      previous = performance.now();
      accumulator = 0;
      frame = requestAnimationFrame(tick);
    }
  };
  const move = (event) => {
    const rect = root.getBoundingClientRect();
    const next = { x: event.clientX - rect.left, y: event.clientY - rect.top };
    if (!pointer) pointer = next;
    if (pending.length < 48) pending.push(next);
    else pending[pending.length - 1] = next;
  };
  const leave = () => { pointer = null; pending.length = 0; };
  const lost = (event) => {
    event.preventDefault();
    contextLost = true;
    root.classList.remove("is-live");
    sync();
  };
  const restored = () => {
    contextLost = false;
    width = 0;
    resize();
    sync();
  };
  const resizer = new ResizeObserver(() => { if (!contextLost) resize(); });
  const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); });
  resize();
  resizer.observe(root);
  observer.observe(root);
  root.addEventListener("pointermove", move, { passive: true });
  root.addEventListener("pointerdown", move, { passive: true });
  root.addEventListener("pointerleave", leave);
  root.addEventListener("pointercancel", leave);
  document.addEventListener("visibilitychange", sync);
  canvas.addEventListener("webglcontextlost", lost);
  canvas.addEventListener("webglcontextrestored", restored);
  sync();

  return () => {
    disposed = true;
    cancelAnimationFrame(frame);
    resizer.disconnect();
    observer.disconnect();
    root.removeEventListener("pointermove", move);
    root.removeEventListener("pointerdown", move);
    root.removeEventListener("pointerleave", leave);
    root.removeEventListener("pointercancel", leave);
    document.removeEventListener("visibilitychange", sync);
    canvas.removeEventListener("webglcontextlost", lost);
    canvas.removeEventListener("webglcontextrestored", restored);
    geometry?.dispose();
    material.dispose();
    renderer.dispose();
    root.classList.remove("is-live");
  };
}
