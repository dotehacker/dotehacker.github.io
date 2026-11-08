/* Snow background — physics-based canvas snow, opt-in via the theme toggle.
   Exposes window.SnowBG.start() / .stop(). Respects prefers-reduced-motion.
   Companion to rain.js: parallax layers, wind that responds to the pointer,
   and snow that settles into a drift along the ground. */
(function () {
  var raf = null, canvas = null, onResize = null, onPointer = null;

  function reduceMotion() {
    try { return window.matchMedia('(prefers-reduced-motion: reduce)').matches; }
    catch (e) { return false; }
  }

  function begin() {
    canvas = document.getElementById('snow-bg');
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.id = 'snow-bg';
      canvas.setAttribute('aria-hidden', 'true');
      document.body.insertBefore(canvas, document.body.firstChild);
    }
    var ctx = canvas.getContext('2d');
    var W, H, DPR;

    function resize() {
      DPR = Math.min(window.devicePixelRatio || 1, 2);
      W = canvas.width = innerWidth * DPR;
      H = canvas.height = innerHeight * DPR;
      canvas.style.width = innerWidth + 'px';
      canvas.style.height = innerHeight + 'px';
    }
    resize();

    var GROUND_FRAC = 0.985;
    // near layers fall faster, sway wider and sit brighter
    var LAYERS = [
      { r: [0.6, 1.3], vy: [14, 26], sway: [5, 13],  drag: 0.55, alpha: 0.30, density: 1 / 13000 },
      { r: [1.2, 2.1], vy: [26, 44], sway: [9, 21],  drag: 0.80, alpha: 0.58, density: 1 / 17000 },
      { r: [2.0, 3.3], vy: [42, 66], sway: [13, 30], drag: 1.00, alpha: 0.90, density: 1 / 25000 }
    ];

    var flakes = [], drift = null, COLS = 0, COLW = 0, MAXPILE = 0;
    var wind = 0, windTarget = 0, t = 0, mouseVX = 0, lastMX = null, lastMT = 0;

    onPointer = function (e) {
      var now = performance.now();
      if (lastMX !== null) {
        var dt = Math.max(now - lastMT, 8) / 1000;
        mouseVX = Math.max(-520, Math.min(520, (e.clientX - lastMX) / dt * 0.30));
      }
      lastMX = e.clientX; lastMT = now;
    };
    addEventListener('pointermove', onPointer);

    function groundY() { return H * GROUND_FRAC; }
    function rnd(a, b) { return a + Math.random() * (b - a); }

    function spawnFlake(i, anywhere) {
      var L = LAYERS[i];
      flakes.push({
        x: Math.random() * W,
        y: anywhere ? Math.random() * groundY() : -12 * DPR - Math.random() * H * 0.35,
        r: rnd(L.r[0], L.r[1]) * DPR,
        vy: rnd(L.vy[0], L.vy[1]) * DPR,
        sway: rnd(L.sway[0], L.sway[1]) * DPR,
        phase: Math.random() * Math.PI * 2,
        spin: rnd(0.5, 1.6) * (Math.random() < 0.5 ? -1 : 1),
        layer: i
      });
    }

    function initFlakes() {
      flakes.length = 0;
      LAYERS.forEach(function (L, i) {
        var n = Math.round(W * H * L.density / (DPR * DPR));
        for (var j = 0; j < n; j++) spawnFlake(i, true);
      });
      COLS = Math.max(40, Math.round(innerWidth / 9));
      COLW = W / COLS;
      MAXPILE = H * 0.085;
      drift = new Float32Array(COLS);
    }
    initFlakes();

    onResize = function () { resize(); initFlakes(); };
    addEventListener('resize', onResize);

    // settle a flake into the drift, then let it slump toward its neighbours
    function settle(x, r) {
      var c = Math.max(0, Math.min(COLS - 1, Math.floor(x / COLW)));
      drift[c] = Math.min(MAXPILE, drift[c] + r * r * 0.5 / DPR);
      var l = c > 0 ? c - 1 : c, rr = c < COLS - 1 ? c + 1 : c;
      var avg = (drift[l] + drift[c] + drift[rr]) / 3;
      drift[l] += (avg - drift[l]) * 0.30;
      drift[c] += (avg - drift[c]) * 0.18;
      drift[rr] += (avg - drift[rr]) * 0.30;
    }

    function driftAt(x) {
      var c = Math.max(0, Math.min(COLS - 1, Math.floor(x / COLW)));
      return drift[c];
    }

    var last = performance.now();
    function frame(now) {
      var dt = Math.min((now - last) / 1000, 0.033);
      last = now; t += dt;

      // wind: slow swell + occasional gust + pointer nudge
      if (Math.random() < 0.0035) windTarget = (Math.random() - 0.5) * 150;
      var base = Math.sin(t * 0.26) * 42 + Math.sin(t * 0.09 + 1.7) * 26;
      wind += ((base + windTarget + mouseVX) - wind) * (1 - Math.exp(-dt * 0.9));
      mouseVX *= Math.exp(-dt * 2.2);

      ctx.clearRect(0, 0, W, H);
      var gy = groundY();

      for (var i = flakes.length - 1; i >= 0; i--) {
        var f = flakes[i], L = LAYERS[f.layer];
        f.phase += f.spin * dt;
        f.y += f.vy * dt;
        f.x += (wind * DPR * L.drag * 0.35 + Math.cos(f.phase) * f.sway) * dt;

        if (f.x < -20 * DPR) f.x += W + 40 * DPR;
        if (f.x > W + 20 * DPR) f.x -= W + 40 * DPR;

        var surface = gy - driftAt(f.x);
        if (f.y + f.r >= surface) {
          if (f.layer > 0) settle(f.x, f.r);
          f.y = -12 * DPR - Math.random() * 60 * DPR;
          f.x = Math.random() * W;
          continue;
        }

        ctx.fillStyle = 'rgba(236,244,255,' + L.alpha + ')';
        ctx.beginPath(); ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2); ctx.fill();
      }

      // the settled drift along the bottom
      if (drift) {
        ctx.beginPath();
        ctx.moveTo(0, H);
        ctx.lineTo(0, gy - drift[0]);
        for (var c = 0; c < COLS; c++) {
          var x0 = c * COLW, x1 = (c + 1) * COLW;
          var y0 = gy - drift[c], y1 = gy - drift[Math.min(COLS - 1, c + 1)];
          ctx.quadraticCurveTo(x0 + COLW * 0.5, (y0 + y1) / 2, x1, y1);
        }
        ctx.lineTo(W, H);
        ctx.closePath();
        var g = ctx.createLinearGradient(0, gy - MAXPILE, 0, H);
        g.addColorStop(0, 'rgba(226,238,255,0.85)');
        g.addColorStop(1, 'rgba(198,216,240,0.55)');
        ctx.fillStyle = g; ctx.fill();
      }

      raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);
  }

  window.SnowBG = {
    start: function () {
      if (raf !== null) return;      // already running
      if (reduceMotion()) return;    // honor motion preference
      begin();
    },
    stop: function () {
      if (raf !== null) { cancelAnimationFrame(raf); raf = null; }
      if (onResize) { removeEventListener('resize', onResize); onResize = null; }
      if (onPointer) { removeEventListener('pointermove', onPointer); onPointer = null; }
      if (canvas) { canvas.remove(); canvas = null; }
    }
  };
})();
