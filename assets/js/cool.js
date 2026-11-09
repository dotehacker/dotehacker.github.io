/* "Representation Space" — Three.js latent-space background, opt-in via the
   theme toggle. Exposes window.CoolBG.start() / .stop().

   A 3D latent space: concept clusters (refusal, harmful, benign, मैथिली,
   नेपाली, हिन्दी, english) drawn as blobs, rings and helices, each with its
   own constellation of neurons. Every few seconds a steering vector sweeps
   through and shifts one cluster; click to steer the nearest one yourself.

   Adapted from sumit-yadav-background.html for the site: fixed to the
   "night" palette, no HUD, no key bindings, and it never touches the site's
   own theme classes. Requires the three.js importmap in the page head. */
import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

let teardown = null;

function reduceMotion() {
  try { return window.matchMedia('(prefers-reduced-motion: reduce)').matches; }
  catch (e) { return false; }
}

function boot() {
  const _off = [];
  const on = (t, ev, fn, opts) => { t.addEventListener(ev, fn, opts); _off.push(() => t.removeEventListener(ev, fn, opts)); };


  /* ---------------------------------------------------------------
     Setup
  ---------------------------------------------------------------- */
  const root = document.documentElement;
  const canvas = (() => {
    let c = document.getElementById('cool-bg');
    if (!c) { c = document.createElement('canvas'); c.id = 'cool-bg'; c.setAttribute('aria-hidden','true'); document.body.insertBefore(c, document.body.firstChild); }
    return c;
  })();
  const isMobile = matchMedia('(max-width: 760px)').matches || matchMedia('(pointer: coarse)').matches;
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const TIME_SCALE = reduceMotion ? 0.25 : 1;

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: false, powerPreference: 'high-performance' });
  } catch (e) {
    canvas.remove();
    throw e;
  }
  const PR = Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2);
  renderer.setPixelRatio(PR);
  renderer.setSize(innerWidth, innerHeight);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, innerWidth / innerHeight, 0.1, 220);
  camera.position.set(0, 0, 26);

  const world = new THREE.Group();     // rotates; holds the latent space
  scene.add(world);

  /* seeded RNG so the space looks the same on every visit */
  function mulberry32(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
  const rand = mulberry32(20261109);
  const gauss = () => { let u = 0, v = 0; while (!u) u = rand(); while (!v) v = rand(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); };
  const V3 = THREE.Vector3;
  let glyphBlend = THREE.AdditiveBlending;

  /* ---------------------------------------------------------------
     Themes (sRGB hex; three converts to linear)
     palette index: 0 refusal, 1 harmful, 2 benign, 3 maithili,
                    4 nepali, 5 hindi, 6 english, 7 dust
  ---------------------------------------------------------------- */
  const THEMES = {
    night: { bg:'#04050c', nebA:'#1a2a6e', nebB:'#4b1c6e', neb:1.0, accent:'#fff1c4', line:'#7aa2ff', glyph:'#9fb3ff',
             palette:['#ff7a59','#ff4d8d','#6ff0c3','#ffd166','#5ee7ff','#a78bfa','#7aa2ff','#8696c4'],
             light:0, bloom:0.95, pOpacity:1.0, rain:0, snow:0 },
    day:   { bg:'#f2eee6', nebA:'#c8d4ef', nebB:'#f0d6c4', neb:0.9, accent:'#111827', line:'#475569', glyph:'#334155',
             palette:['#c2410c','#be185d','#047857','#b45309','#0369a1','#6d28d9','#1d4ed8','#7c8597'],
             light:1, bloom:0.0, pOpacity:0.9, rain:0, snow:0 },
    rain:  { bg:'#050b12', nebA:'#0d3a4a', nebB:'#112743', neb:1.0, accent:'#d6f6ff', line:'#5eead4', glyph:'#7dd3fc',
             palette:['#fb923c','#f472b6','#5eead4','#fde68a','#7dd3fc','#a5b4fc','#38bdf8','#6b8a9a'],
             light:0, bloom:0.85, pOpacity:0.95, rain:1, snow:0 },
    snow:  { bg:'#0b1020', nebA:'#2a3a6a', nebB:'#3a3f78', neb:1.0, accent:'#ffffff', line:'#c7d2fe', glyph:'#e0e7ff',
             palette:['#fecaca','#fbcfe8','#ccfbf1','#fef3c7','#bae6fd','#ddd6fe','#c7d2fe','#aab6d3'],
             light:0, bloom:0.8, pOpacity:0.95, rain:0, snow:1 },
  };

  /* live (lerped) theme state */
  const live = {
    bg: new THREE.Color(THEMES.night.bg), nebA: new THREE.Color(), nebB: new THREE.Color(),
    accent: new THREE.Color(), line: new THREE.Color(), glyph: new THREE.Color(),
    palette: Array.from({ length: 8 }, () => new THREE.Color()),
    neb: 1, light: 0, bloom: 0.95, pOpacity: 1, rain: 0, snow: 0,
  };
  let target = THEMES.night;

  /* ---------------------------------------------------------------
     Shared uniforms (same objects referenced by every material)
  ---------------------------------------------------------------- */
  const U = {
    uTime:     { value: 0 },
    uPR:       { value: PR },
    uSteerDir: { value: new V3(1, 0, 0) },
    uWave:     { value: -40 },
    uWaveAmp:  { value: 0 },
    uSteer:    { value: 0 },
    uTarget:   { value: -1 },
    uAccent:   { value: live.accent },
    uLight:    { value: 0 },
  };

  const DISPLACE = /* glsl */`
    uniform float uTime; uniform vec3 uSteerDir; uniform float uWave; uniform float uWaveAmp;
    uniform float uSteer; uniform float uTarget;
    vec3 displace(vec3 p, float r, float cl, out float glow){
      p += 0.18 * vec3(sin(uTime*0.31 + r*6.2831), cos(uTime*0.27 + r*11.0), sin(uTime*0.23 + r*17.0));
      float d = dot(p, uSteerDir);
      float w = exp(-(d - uWave)*(d - uWave) / 2.2) * uWaveAmp;   // travelling steering wavefront
      p += uSteerDir * w * 0.9;
      float isT = 1.0 - step(0.5, abs(cl - uTarget));               // the steered concept
      p += uSteerDir * isT * uSteer * 2.6;
      glow = w + isT * uSteer * 0.55;
      return p;
    }
  `;

  /* ---------------------------------------------------------------
     Nebula backdrop (fbm noise on an inverted sphere)
  ---------------------------------------------------------------- */
  const nebulaMat = new THREE.ShaderMaterial({
    side: THREE.BackSide, depthWrite: false,
    uniforms: { uTime: U.uTime, uBg: { value: live.bg }, uA: { value: live.nebA }, uB: { value: live.nebB }, uAmt: { value: 1 } },
    vertexShader: /* glsl */`
      varying vec3 vDir;
      void main(){ vDir = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
    fragmentShader: /* glsl */`
      uniform float uTime; uniform vec3 uBg; uniform vec3 uA; uniform vec3 uB; uniform float uAmt;
      varying vec3 vDir;
      float hash(vec3 p){ p = fract(p*0.3183099 + 0.1); p *= 17.0; return fract(p.x*p.y*p.z*(p.x+p.y+p.z)); }
      float noise(vec3 x){
        vec3 i = floor(x); vec3 f = fract(x); f = f*f*(3.0-2.0*f);
        return mix(mix(mix(hash(i),               hash(i+vec3(1,0,0)), f.x),
                       mix(hash(i+vec3(0,1,0)),   hash(i+vec3(1,1,0)), f.x), f.y),
                   mix(mix(hash(i+vec3(0,0,1)),   hash(i+vec3(1,0,1)), f.x),
                       mix(hash(i+vec3(0,1,1)),   hash(i+vec3(1,1,1)), f.x), f.y), f.z);
      }
      float fbm(vec3 p){ float v = 0.0, a = 0.5; for(int i=0;i<5;i++){ v += a*noise(p); p = p*2.03 + 1.7; a *= 0.5; } return v; }
      void main(){
        vec3 d = normalize(vDir);
        float n1 = fbm(d*2.2 + vec3(0.0, 0.0, uTime*0.012));
        float n2 = fbm(d*4.4 - vec3(uTime*0.009, 0.0, 0.0) + 7.0);
        float band = exp(-pow(d.y*2.2 + 0.25*sin(d.x*3.0), 2.0));           // a soft galactic band
        vec3 col = uBg;
        col += uA * smoothstep(0.42, 0.95, n1) * (0.55 + 0.6*band) * uAmt;
        col += uB * smoothstep(0.50, 1.00, n2) * 0.75 * uAmt;
        gl_FragColor = vec4(col, 1.0);
      }`,
  });
  scene.add(new THREE.Mesh(new THREE.SphereGeometry(110, 48, 32), nebulaMat));

  /* ---------------------------------------------------------------
     Latent space: concept clusters + dust
  ---------------------------------------------------------------- */
  const CONCEPTS = [
    { name: 'refusal', shape: 'blob'  },
    { name: 'harmful', shape: 'blob'  },
    { name: 'benign',  shape: 'ring'  },
    { name: 'मैथिली',  shape: 'helix', deva: true },
    { name: 'नेपाली',  shape: 'blob',  deva: true },
    { name: 'हिन्दी',   shape: 'ring',  deva: true },
    { name: 'english', shape: 'helix' },
  ];
  const K = CONCEPTS.length;

  const N = isMobile ? 5200 : 11000;
  const perCluster = Math.floor(N * 0.105);
  const centers = [];
  for (let i = 0; i < K; i++) {               // fibonacci sphere, flattened a bit
    const y = 1 - (i + 0.5) / K * 2, r = Math.sqrt(1 - y * y), th = i * 2.399963;
    centers.push(new V3(Math.cos(th) * r * 10, y * 6.2, Math.sin(th) * r * 10).add(new V3(gauss(), gauss(), gauss()).multiplyScalar(0.6)));
  }

  const pos = new Float32Array(N * 3), aCluster = new Float32Array(N), aRand = new Float32Array(N), aSize = new Float32Array(N);
  const clusterRange = [];
  let idx = 0;
  const tmp = new V3(), q = new THREE.Quaternion(), e = new THREE.Euler();

  for (let c = 0; c < K; c++) {
    e.set(rand() * Math.PI * 2, rand() * Math.PI * 2, rand() * Math.PI * 2); q.setFromEuler(e);
    const start = idx;
    for (let j = 0; j < perCluster; j++, idx++) {
      const shape = CONCEPTS[c].shape;
      if (shape === 'blob') {
        tmp.set(gauss() * 2.1, gauss() * 1.05, gauss() * 0.75);
      } else if (shape === 'ring') {                      // circular features
        const th = rand() * Math.PI * 2, R = 2.7 + gauss() * 0.22;
        tmp.set(Math.cos(th) * R, gauss() * 0.18, Math.sin(th) * R);
      } else {                                            // 1-D manifold
        const s = rand() * 2 - 1;
        tmp.set(Math.cos(s * 9) * 1.35 + gauss() * 0.17, s * 4.2, Math.sin(s * 9) * 1.35 + gauss() * 0.17);
      }
      tmp.applyQuaternion(q).add(centers[c]);
      pos.set([tmp.x, tmp.y, tmp.z], idx * 3);
      aCluster[idx] = c; aRand[idx] = rand();
      aSize[idx] = rand() < 0.03 ? 3.4 : 0.7 + rand() * 1.5;
    }
    clusterRange.push([start, idx]);
  }
  for (; idx < N; idx++) {                               // background dust
    tmp.set(gauss(), gauss() * 0.7, gauss()).normalize().multiplyScalar(13 + Math.pow(rand(), 0.7) * 34);
    pos.set([tmp.x, tmp.y, tmp.z], idx * 3);
    aCluster[idx] = 7; aRand[idx] = rand(); aSize[idx] = 0.45 + rand() * 1.0;
  }

  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  pGeo.setAttribute('aCluster', new THREE.BufferAttribute(aCluster, 1));
  pGeo.setAttribute('aRand', new THREE.BufferAttribute(aRand, 1));
  pGeo.setAttribute('aSize', new THREE.BufferAttribute(aSize, 1));

  const pointVS = /* glsl */`
    ${DISPLACE}
    uniform float uPR; uniform float uSize; uniform vec3 uPalette[8]; uniform float uLight;
    attribute float aCluster; attribute float aRand; attribute float aSize;
    varying vec3 vColor; varying float vGlow; varying float vAlpha;
    void main(){
      float glow;
      vec3 p = displace(position, aRand, aCluster, glow);
      vec4 mv = modelViewMatrix * vec4(p, 1.0);
      gl_Position = projectionMatrix * mv;
      float tw = 0.72 + 0.28 * sin(uTime * (0.8 + aRand * 2.2) + aRand * 60.0);
      gl_PointSize = min(uSize * aSize * uPR * tw * (60.0 / -mv.z) * (1.0 + glow * 0.9), 46.0 * uPR);
      vec3 base = uPalette[int(aCluster + 0.5)];
      vColor = mix(base, vec3(1.0), (1.0 - uLight) * aRand * 0.22);
      vGlow = glow;
      vAlpha = smoothstep(78.0, 20.0, -mv.z) * smoothstep(0.8, 5.0, -mv.z);
    }`;

  const pointMat = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    uniforms: { ...U, uSize: { value: 1 }, uPalette: { value: live.palette }, uOpacity: { value: 1 } },
    vertexShader: pointVS,
    fragmentShader: /* glsl */`
      uniform vec3 uAccent; uniform float uOpacity;
      varying vec3 vColor; varying float vGlow; varying float vAlpha;
      void main(){
        vec2 c = gl_PointCoord - 0.5; float r = length(c);
        if (r > 0.5) discard;
        float a = pow(1.0 - r * 2.0, 1.8);
        vec3 col = mix(vColor, uAccent, clamp(vGlow * 0.8, 0.0, 1.0));
        gl_FragColor = vec4(col, a * uOpacity * vAlpha * (1.0 + vGlow));
      }`,
  });
  const points = new THREE.Points(pGeo, pointMat);
  world.add(points);

  /* ---------------------------------------------------------------
     Neuron constellations: nodes + pulsing edges
  ---------------------------------------------------------------- */
  const NODES_PER = isMobile ? 9 : 13;
  const nodeIdx = [];
  for (let c = 0; c < K; c++) {
    const [s, eIdx] = clusterRange[c], picks = new Set();
    while (picks.size < NODES_PER) picks.add(s + Math.floor(rand() * (eIdx - s)));
    nodeIdx.push([...picks]);
  }
  const allNodes = nodeIdx.flat();
  const nPos = new Float32Array(allNodes.length * 3), nCl = new Float32Array(allNodes.length), nRand = new Float32Array(allNodes.length), nSize = new Float32Array(allNodes.length);
  allNodes.forEach((pi, i) => {
    nPos.set(pos.subarray(pi * 3, pi * 3 + 3), i * 3);
    nCl[i] = aCluster[pi]; nRand[i] = aRand[pi]; nSize[i] = 2.6 + rand() * 1.8;
  });
  const nGeo = new THREE.BufferGeometry();
  nGeo.setAttribute('position', new THREE.BufferAttribute(nPos, 3));
  nGeo.setAttribute('aCluster', new THREE.BufferAttribute(nCl, 1));
  nGeo.setAttribute('aRand', new THREE.BufferAttribute(nRand, 1));
  nGeo.setAttribute('aSize', new THREE.BufferAttribute(nSize, 1));
  const nodeMat = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    uniforms: { ...U, uSize: { value: 1 }, uPalette: { value: live.palette }, uOpacity: { value: 1 } },
    vertexShader: pointVS,
    fragmentShader: /* glsl */`
      uniform vec3 uAccent; uniform float uOpacity;
      varying vec3 vColor; varying float vGlow; varying float vAlpha;
      void main(){
        vec2 c = gl_PointCoord - 0.5; float r = length(c);
        if (r > 0.5) discard;
        float ring = smoothstep(0.5, 0.42, r) * smoothstep(0.28, 0.36, r);
        float core = smoothstep(0.16, 0.0, r);
        vec3 col = mix(vColor, uAccent, clamp(0.35 + vGlow, 0.0, 1.0));
        gl_FragColor = vec4(col, (ring * 0.75 + core) * uOpacity * vAlpha);
      }`,
  });
  world.add(new THREE.Points(nGeo, nodeMat));

  // edges: 2-NN inside each constellation + a few cross-concept links
  const edges = [];
  const key = (a, b) => a < b ? `${a}-${b}` : `${b}-${a}`;
  const seen = new Set();
  const P = i => new V3(pos[i * 3], pos[i * 3 + 1], pos[i * 3 + 2]);
  for (let c = 0; c < K; c++) {
    const ids = nodeIdx[c];
    ids.forEach(a => {
      ids.filter(b => b !== a).map(b => [b, P(a).distanceToSquared(P(b))]).sort((x, y) => x[1] - y[1]).slice(0, 2)
        .forEach(([b]) => { const k = key(a, b); if (!seen.has(k)) { seen.add(k); edges.push([a, b]); } });
    });
  }
  for (let c = 0; c < K; c++) {
    edges.push([nodeIdx[c][0], nodeIdx[(c + 1) % K][0]]);
    if (c % 2 === 0) edges.push([nodeIdx[c][1], nodeIdx[(c + 3) % K][2]]);
  }
  const E = edges.length;
  const ePos = new Float32Array(E * 6), eCl = new Float32Array(E * 2), eRand = new Float32Array(E * 2), eT = new Float32Array(E * 2), eSeed = new Float32Array(E * 2);
  edges.forEach(([a, b], i) => {
    ePos.set(pos.subarray(a * 3, a * 3 + 3), i * 6); ePos.set(pos.subarray(b * 3, b * 3 + 3), i * 6 + 3);
    eCl[i * 2] = aCluster[a]; eCl[i * 2 + 1] = aCluster[b];
    eRand[i * 2] = aRand[a];  eRand[i * 2 + 1] = aRand[b];
    eT[i * 2] = 0; eT[i * 2 + 1] = 1;
    const s = rand(); eSeed[i * 2] = s; eSeed[i * 2 + 1] = s;
  });
  const eGeo = new THREE.BufferGeometry();
  eGeo.setAttribute('position', new THREE.BufferAttribute(ePos, 3));
  eGeo.setAttribute('aCluster', new THREE.BufferAttribute(eCl, 1));
  eGeo.setAttribute('aRand', new THREE.BufferAttribute(eRand, 1));
  eGeo.setAttribute('aT', new THREE.BufferAttribute(eT, 1));
  eGeo.setAttribute('aSeed', new THREE.BufferAttribute(eSeed, 1));
  const lineMat = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    uniforms: { ...U, uLineColor: { value: live.line }, uOpacity: { value: 1 } },
    vertexShader: /* glsl */`
      ${DISPLACE}
      attribute float aCluster; attribute float aRand; attribute float aT; attribute float aSeed;
      varying float vT; varying float vSeed; varying float vGlow; varying float vAlpha;
      void main(){
        float glow;
        vec3 p = displace(position, aRand, aCluster, glow);
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        gl_Position = projectionMatrix * mv;
        vT = aT; vSeed = aSeed; vGlow = glow;
        vAlpha = smoothstep(70.0, 18.0, -mv.z);
      }`,
    fragmentShader: /* glsl */`
      uniform vec3 uLineColor; uniform vec3 uAccent; uniform float uOpacity; uniform float uTime;
      varying float vT; varying float vSeed; varying float vGlow; varying float vAlpha;
      void main(){
        float ph = fract(uTime * 0.16 + vSeed * 7.0);
        float pulse = smoothstep(0.08, 0.0, abs(vT - ph));         // activation travelling along the edge
        vec3 col = mix(uLineColor, uAccent, clamp(pulse + vGlow * 0.5, 0.0, 1.0));
        float a = (0.14 + pulse * 0.85 + vGlow * 0.35) * uOpacity * vAlpha;
        gl_FragColor = vec4(col, a);
      }`,
  });
  world.add(new THREE.LineSegments(eGeo, lineMat));

  /* ---------------------------------------------------------------
     Steering vector (line + arrowhead)
  ---------------------------------------------------------------- */
  const arrowGeo = new THREE.BufferGeometry().setFromPoints([new V3(), new V3(1, 0, 0)]);
  const arrowMat = new THREE.LineBasicMaterial({ color: live.accent, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false });
  const arrowLine = new THREE.Line(arrowGeo, arrowMat);
  const coneMat = new THREE.MeshBasicMaterial({ color: live.accent, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false });
  const cone = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.75, 18), coneMat);
  arrowLine.frustumCulled = false;
  world.add(arrowLine, cone);
  const arrowTip = new V3();

  /* ---------------------------------------------------------------
     Floating tokens / glyphs (Devanagari + interpretability notation)
  ---------------------------------------------------------------- */
  const glyphGroup = new THREE.Group();
  world.add(glyphGroup);
  const GLYPHS = ['अ','क','ष','ज्ञ','ऋ','ॐ','म','थ','ळ','मैथिली','नेपाली','हिन्दी','<v, h>','h[17]','∂L/∂h','SAE','α·v̂','attn','logit','<|refuse|>','W_U','resid','PCA₁','steer'];
  const glyphSprites = [];
  async function buildGlyphs() {
    try {
      await Promise.race([
        Promise.all([document.fonts.load('500 80px "Noto Sans Devanagari"', 'अमैथिली'), document.fonts.load('500 80px "IBM Plex Mono"', 'steer')]),
        new Promise(r => setTimeout(r, 1800)),
      ]);
    } catch (_) {}
    const count = isMobile ? 14 : GLYPHS.length;
    for (let i = 0; i < count; i++) {
      const text = GLYPHS[i];
      const deva = /[ऀ-ॿ]/.test(text);
      const cv = document.createElement('canvas'), ctx = cv.getContext('2d');
      const fs = 84;
      ctx.font = `500 ${fs}px ${deva ? '"Noto Sans Devanagari"' : '"IBM Plex Mono"'}, sans-serif`;
      const w = Math.ceil(ctx.measureText(text).width) + 40, h = Math.ceil(fs * 1.7);
      cv.width = w; cv.height = h;
      ctx.font = `500 ${fs}px ${deva ? '"Noto Sans Devanagari"' : '"IBM Plex Mono"'}, sans-serif`;
      ctx.fillStyle = '#fff'; ctx.textBaseline = 'middle'; ctx.textAlign = 'center';
      ctx.fillText(text, w / 2, h / 2);
      const tex = new THREE.CanvasTexture(cv); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 4;
      const mat = new THREE.SpriteMaterial({ map: tex, color: live.glyph, transparent: true, opacity: 0, depthWrite: false, blending: glyphBlend });
      const sp = new THREE.Sprite(mat);
      const s = (deva && text.length < 3 ? 1.9 : 1.15) * (0.75 + rand() * 0.6);
      sp.scale.set(s * w / h, s, 1);
      const dir = new V3(gauss(), gauss() * 0.6, gauss()).normalize();
      sp.userData = { base: dir.multiplyScalar(12 + rand() * 13), phase: rand() * 10, amp: 0.4 + rand() * 0.8, op: 0.16 + rand() * 0.22 };
      sp.position.copy(sp.userData.base);
      glyphGroup.add(sp); glyphSprites.push(sp);
    }
  }
  buildGlyphs();

  /* ---------------------------------------------------------------
     Weather: rain streaks & snow (camera space volume)
  ---------------------------------------------------------------- */
  const RAIN_N = isMobile ? 700 : 1600;
  const rPos = new Float32Array(RAIN_N * 6), rEnd = new Float32Array(RAIN_N * 2), rSpeed = new Float32Array(RAIN_N * 2);
  for (let i = 0; i < RAIN_N; i++) {
    const x = (rand() - 0.5) * 70, y = (rand() - 0.5) * 60, z = -18 + rand() * 36, s = 18 + rand() * 16;
    rPos.set([x, y, z, x, y, z], i * 6); rEnd[i * 2] = 0; rEnd[i * 2 + 1] = 1; rSpeed[i * 2] = s; rSpeed[i * 2 + 1] = s;
  }
  const rGeo = new THREE.BufferGeometry();
  rGeo.setAttribute('position', new THREE.BufferAttribute(rPos, 3));
  rGeo.setAttribute('aEnd', new THREE.BufferAttribute(rEnd, 1));
  rGeo.setAttribute('aSpeed', new THREE.BufferAttribute(rSpeed, 1));
  const rainMat = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    uniforms: { uTime: U.uTime, uOn: { value: 0 }, uColor: { value: new THREE.Color('#9fdcf5') } },
    vertexShader: /* glsl */`
      uniform float uTime; attribute float aEnd; attribute float aSpeed; varying float vA;
      void main(){
        vec3 p = position;
        p.y = mod(p.y - uTime * aSpeed + 30.0, 60.0) - 30.0;
        p.y += aEnd * aSpeed * 0.05; p.x += aEnd * 0.12;
        vA = 1.0 - aEnd * 0.95;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
      }`,
    fragmentShader: /* glsl */`
      uniform float uOn; uniform vec3 uColor; varying float vA;
      void main(){ gl_FragColor = vec4(uColor, vA * 0.35 * uOn); }`,
  });
  const rain = new THREE.LineSegments(rGeo, rainMat);
  rain.frustumCulled = false;
  scene.add(rain);

  const SNOW_N = isMobile ? 900 : 2200;
  const sPos = new Float32Array(SNOW_N * 3), sSeed = new Float32Array(SNOW_N);
  for (let i = 0; i < SNOW_N; i++) { sPos.set([(rand() - 0.5) * 70, (rand() - 0.5) * 60, -18 + rand() * 36], i * 3); sSeed[i] = rand(); }
  const sGeo = new THREE.BufferGeometry();
  sGeo.setAttribute('position', new THREE.BufferAttribute(sPos, 3));
  sGeo.setAttribute('aSeed', new THREE.BufferAttribute(sSeed, 1));
  const snowMat = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    uniforms: { uTime: U.uTime, uPR: U.uPR, uOn: { value: 0 } },
    vertexShader: /* glsl */`
      uniform float uTime; uniform float uPR; attribute float aSeed; varying float vS;
      void main(){
        vec3 p = position;
        float sp = 0.9 + aSeed * 1.6;
        p.y = mod(p.y - uTime * sp + 30.0, 60.0) - 30.0;
        p.x += sin(uTime * (0.4 + aSeed) + aSeed * 30.0) * 0.9;
        p.z += cos(uTime * 0.3 + aSeed * 20.0) * 0.5;
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        gl_Position = projectionMatrix * mv;
        gl_PointSize = min((1.2 + aSeed * 3.2) * uPR * (40.0 / -mv.z), 12.0 * uPR);
        vS = aSeed;
      }`,
    fragmentShader: /* glsl */`
      uniform float uOn; varying float vS;
      void main(){
        float r = length(gl_PointCoord - 0.5); if (r > 0.5) discard;
        gl_FragColor = vec4(vec3(1.0), smoothstep(0.5, 0.0, r) * (0.35 + vS * 0.5) * uOn);
      }`,
  });
  const snow = new THREE.Points(sGeo, snowMat);
  snow.frustumCulled = false;
  scene.add(snow);

  /* ---------------------------------------------------------------
     Post-processing
  ---------------------------------------------------------------- */
  const composer = new EffectComposer(renderer);
  composer.setPixelRatio(PR);
  composer.setSize(innerWidth, innerHeight);
  composer.addPass(new RenderPass(scene, camera));
  const bloom = new UnrealBloomPass(new THREE.Vector2(innerWidth, innerHeight), 0.95, 0.65, 0.12);
  composer.addPass(bloom);
  composer.addPass(new OutputPass());

  /* ---------------------------------------------------------------
     HTML labels projected from the concept centres
  ---------------------------------------------------------------- */
  const labelLayer = (() => {
    let l = document.getElementById('cool-labels');
    if (!l) { l = document.createElement('div'); l.id = 'cool-labels'; l.setAttribute('aria-hidden','true'); document.body.insertBefore(l, document.body.firstChild); }
    return l;
  })();
  const labels = CONCEPTS.map((c, i) => {
    const el = document.createElement('div');
    el.className = 'clabel';
    el.innerHTML = c.deva ? `<span class="dv">${c.name}</span>` : c.name;
    labelLayer.appendChild(el);
    return el;
  });
  const steerLabel = document.createElement('div');
  steerLabel.className = 'clabel steer';
  steerLabel.textContent = 'v̂ steer';
  labelLayer.appendChild(steerLabel);

  /* ---------------------------------------------------------------
     Steering controller
  ---------------------------------------------------------------- */
  const steer = { t: -1, dur: 3.0, hold: 2.6, target: -1, last: -1, layer: 17, goal: 0 };
  function startSteer(dir, tgt) {
    steer.t = 0; steer.target = tgt; steer.last = tgt; steer.goal = 0;
    steer.layer = 8 + Math.floor(Math.random() * 20);
    U.uSteerDir.value.copy(dir).normalize();
    U.uTarget.value = tgt;
    const c = centers[tgt], d = U.uSteerDir.value;
    const a = c.clone().addScaledVector(d, -6.5), b = c.clone().addScaledVector(d, 7.5);
    arrowGeo.setFromPoints([a, b]);
    arrowTip.copy(b);
    cone.position.copy(b);
    cone.quaternion.setFromUnitVectors(new V3(0, 1, 0), d);
    labels.forEach((l, i) => l.classList.toggle('active', i === tgt));
  }
  function randomSteer() {
    let t; do { t = Math.floor(Math.random() * K); } while (t === steer.last);
    const d = new V3(Math.random() - 0.5, (Math.random() - 0.5) * 0.6, Math.random() - 0.5);
    if (d.lengthSq() < 1e-3) d.set(1, 0, 0);
    startSteer(d, t);
  }
  function updateSteer(dt) {
    if (steer.t < 0) return;
    steer.t += dt;
    const k = Math.min(steer.t / steer.dur, 1);
    const ease = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
    U.uWave.value = -26 + 52 * ease;
    U.uWaveAmp.value = Math.sin(k * Math.PI) * 1.0;
    const proj = centers[steer.target].dot(U.uSteerDir.value);
    if (U.uWave.value > proj && steer.t < steer.dur + steer.hold) steer.goal = 1;
    if (steer.t > steer.dur + steer.hold) steer.goal = 0;
    U.uSteer.value += (steer.goal - U.uSteer.value) * (1 - Math.exp(-dt * 3.2));
    if (steer.t > steer.dur + steer.hold + 2.4) {
      steer.t = -1; U.uSteer.value = 0; U.uWaveAmp.value = 0; U.uTarget.value = -1;
      labels.forEach(l => l.classList.remove('active'));
    }
  }

  /* ---------------------------------------------------------------
     Input
  ---------------------------------------------------------------- */
  const mouse = new THREE.Vector2(0, 0), mouseSmooth = new THREE.Vector2(0, 0);
  on(window, 'pointermove', ev => {
    mouse.set(ev.clientX / innerWidth * 2 - 1, -(ev.clientY / innerHeight) * 2 + 1);
  }, { passive: true });

  const raycaster = new THREE.Raycaster();
  on(window, 'pointerdown', ev => {
    if (ev.target.closest('a, button, .card, .result, nav, input, textarea')) return;
    const ndc = new THREE.Vector2(ev.clientX / innerWidth * 2 - 1, -(ev.clientY / innerHeight) * 2 + 1);
    raycaster.setFromCamera(ndc, camera);
    const worldPt = raycaster.ray.at(camera.position.length(), new V3());
    const local = world.worldToLocal(worldPt.clone());
    let best = 0, bestD = Infinity;
    centers.forEach((c, i) => { const d = c.distanceToSquared(local); if (d < bestD) { bestD = d; best = i; } });
    const dir = centers[best].clone().sub(local);           // push the concept away from the click
    if (dir.lengthSq() < 0.25) dir.set(Math.random() - 0.5, 0.2, Math.random() - 0.5);
    startSteer(dir, best);
    nextAuto = elapsed + 9;
  });

  let scrollP = 0;
  const onScroll = () => {
    const max = Math.max(1, document.documentElement.scrollHeight - innerHeight);
    scrollP = Math.min(1, Math.max(0, scrollY / max));
  };
  on(window, 'scroll', onScroll, { passive: true }); onScroll();

  /* themes */
  const themeBtns = [];
  function setTheme(name, instant = false) {
    if (!THEMES[name]) name = 'night';
    target = THEMES[name];
    themeBtns.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.themeBtn === name)));
    const blend = target.light ? THREE.NormalBlending : THREE.AdditiveBlending;
    [pointMat, nodeMat, lineMat, arrowMat, coneMat].forEach(m => { m.blending = blend; m.needsUpdate = true; });
    glyphSprites.forEach(s => { s.material.blending = blend; s.material.needsUpdate = true; });
    glyphBlend = blend;
    if (instant) applyTheme(1);
  }
  function applyTheme(a) {
    const T = target;
    live.bg.lerp(tmpC.set(T.bg), a); live.nebA.lerp(tmpC.set(T.nebA), a); live.nebB.lerp(tmpC.set(T.nebB), a);
    live.accent.lerp(tmpC.set(T.accent), a); live.line.lerp(tmpC.set(T.line), a); live.glyph.lerp(tmpC.set(T.glyph), a);
    live.palette.forEach((c, i) => c.lerp(tmpC.set(T.palette[i]), a));
    for (const k of ['neb', 'light', 'bloom', 'pOpacity', 'rain', 'snow']) live[k] += (T[k] - live[k]) * a;
  }
  const tmpC = new THREE.Color();
  themeBtns.forEach(b => b.addEventListener('click', () => setTheme(b.dataset.themeBtn)));

  setTheme('night', true);

  /* resize */
  on(window, 'resize', () => {
    camera.aspect = innerWidth / innerHeight;
    camera.fov = innerWidth < innerHeight ? 68 : 55;       // portrait: widen view
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
    composer.setSize(innerWidth, innerHeight);
    bloom.setSize(innerWidth, innerHeight);
  });
  dispatchEvent(new Event('resize'));

  /* ---------------------------------------------------------------
     HUD
  ---------------------------------------------------------------- */
  let hudT = 0;
  function updateHUD() { /* no HUD on the site */ }

  /* ---------------------------------------------------------------
     Loop
  ---------------------------------------------------------------- */
  let rafId = null;
  const clock = new THREE.Clock();
  let elapsed = 0, nextAuto = reduceMotion ? Infinity : 2.2, running = true;
  const proj = new V3(), steerOffset = new V3();

  function frame() {
    if (!running) return;
    rafId = requestAnimationFrame(frame);
    const dt = Math.min(clock.getDelta(), 0.05) * TIME_SCALE;
    elapsed += dt;
    U.uTime.value = elapsed;

    // theme easing
    applyTheme(1 - Math.exp(-dt / TIME_SCALE * 3.2));
    renderer.setClearColor(live.bg);
    nebulaMat.uniforms.uAmt.value = live.neb;
    U.uLight.value = live.light;
    pointMat.uniforms.uOpacity.value = live.pOpacity;
    nodeMat.uniforms.uOpacity.value = live.pOpacity;
    lineMat.uniforms.uOpacity.value = 0.6 + 0.4 * (1 - live.light);
    bloom.strength = live.bloom;
    bloom.enabled = live.bloom > 0.02;
    rainMat.uniforms.uOn.value = live.rain; rain.visible = live.rain > 0.01;
    snowMat.uniforms.uOn.value = live.snow; snow.visible = live.snow > 0.01;

    // steering
    if (elapsed > nextAuto && steer.t < 0) { randomSteer(); nextAuto = elapsed + 7.5 + Math.random() * 3; }
    updateSteer(dt);
    const arrowOp = Math.min(1, U.uWaveAmp.value * 0.9 + U.uSteer.value * 0.7);
    arrowMat.opacity = arrowOp * 0.9; coneMat.opacity = arrowOp;
    arrowMat.color.copy(live.accent); coneMat.color.copy(live.accent);

    // glyphs
    glyphSprites.forEach(s => {
      const u = s.userData;
      s.position.set(u.base.x + Math.sin(elapsed * 0.17 + u.phase) * u.amp, u.base.y + Math.sin(elapsed * 0.23 + u.phase * 2) * u.amp, u.base.z + Math.cos(elapsed * 0.13 + u.phase) * u.amp);
      s.material.color.copy(live.glyph);
      s.material.opacity += (u.op * (live.light ? 1.6 : 1) - s.material.opacity) * 0.03;
    });

    // camera: slow orbit + scroll dolly + mouse parallax
    mouseSmooth.lerp(mouse, 1 - Math.exp(-dt / TIME_SCALE * 2.5));
    world.rotation.y = elapsed * 0.035 + scrollP * Math.PI * 0.9;
    world.rotation.x = 0.18 + Math.sin(elapsed * 0.05) * 0.06 - scrollP * 0.35;
    const camZ = 26 - scrollP * 9;
    camera.position.x += (mouseSmooth.x * 2.6 - camera.position.x) * 0.06;
    camera.position.y += (mouseSmooth.y * 1.7 - scrollP * 2 - camera.position.y) * 0.06;
    camera.position.z += (camZ - camera.position.z) * 0.06;
    camera.lookAt(0, 0, 0);
    rain.position.copy(camera.position).setZ(camera.position.z - 18);
    snow.position.copy(rain.position);

    composer.render();

    // labels (after render so matrices are fresh)
    world.updateMatrixWorld();
    const w = innerWidth, h = innerHeight;
    centers.forEach((c, i) => {
      proj.copy(c);
      if (i === steer.target) proj.add(steerOffset.copy(U.uSteerDir.value).multiplyScalar(U.uSteer.value * 2.6));
      proj.y += 2.2;
      proj.applyMatrix4(world.matrixWorld);
      const dist = proj.distanceTo(camera.position);
      proj.project(camera);
      const vis = proj.z < 1 && Math.abs(proj.x) < 1.1 && Math.abs(proj.y) < 1.1;
      const el = labels[i];
      if (!vis) { el.style.opacity = 0; return; }
      const x = (proj.x * 0.5 + 0.5) * w, y = (-proj.y * 0.5 + 0.5) * h;
      const fade = THREE.MathUtils.clamp((40 - dist) / 22, 0.15, 0.9);
      el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
      el.style.opacity = (i === steer.target && steer.t >= 0 ? 1 : fade).toFixed(2);
    });
    if (arrowOp > 0.05) {
      proj.copy(arrowTip).applyMatrix4(world.matrixWorld).project(camera);
      steerLabel.style.transform = `translate3d(${((proj.x * 0.5 + 0.5) * w + 10).toFixed(1)}px, ${((-proj.y * 0.5 + 0.5) * h - 6).toFixed(1)}px, 0)`;
      steerLabel.style.opacity = (proj.z < 1 ? arrowOp : 0).toFixed(2);
    } else steerLabel.style.opacity = 0;

    hudT += dt;
    if (hudT > 0.08) { hudT = 0; updateHUD(); }
  }
  frame();

  on(document, 'visibilitychange', () => {
    running = !document.hidden;
    if (running) { clock.getDelta(); frame(); }
  });


  return function stopScene() {
    running = false;
    if (rafId !== null) { cancelAnimationFrame(rafId); rafId = null; }
    _off.forEach(f => { try { f(); } catch (e) {} });
    _off.length = 0;
    try { composer.dispose && composer.dispose(); } catch (e) {}
    try { renderer.dispose(); } catch (e) {}
    try { scene.traverse(o => { if (o.geometry) o.geometry.dispose(); if (o.material) [].concat(o.material).forEach(m => m.dispose && m.dispose()); }); } catch (e) {}
    try { canvas.remove(); } catch (e) {}
    try { labelLayer.remove(); } catch (e) {}
  };
}

window.CoolBG = {
  start() {
    if (teardown) return;          // already running
    if (reduceMotion()) return;    // honor motion preference
    try { teardown = boot(); } catch (e) { console.warn('CoolBG failed to start:', e); teardown = null; }
  },
  stop() {
    if (!teardown) return;
    try { teardown(); } catch (e) {}
    teardown = null;
  }
};
