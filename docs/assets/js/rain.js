/* Rain background — physics-based canvas rain, opt-in via the theme toggle.
   Exposes window.RainBG.start() / .stop(). Respects prefers-reduced-motion.
   Ported from rockerritesh/canva simulations. */
(function () {
  var raf = null, canvas = null, onResize = null, onPointer = null;

  function reduceMotion() {
    try { return window.matchMedia('(prefers-reduced-motion: reduce)').matches; }
    catch (e) { return false; }
  }

  function begin() {
    canvas = document.getElementById('rain-bg');
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.id = 'rain-bg';
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

    var G = 2200, GROUND_FRAC = 0.94;
    var LAYERS = [
      { k: 0.0035, alpha: 0.20, width: 0.7, lenMul: 0.55, density: 1 / 26000 },
      { k: 0.0022, alpha: 0.42, width: 1.0, lenMul: 0.80, density: 1 / 30000 },
      { k: 0.0014, alpha: 0.75, width: 1.5, lenMul: 1.10, density: 1 / 38000 }
    ];
    var drops = [], splashes = [], ripples = [];
    var wind = 0, windTarget = 0, t = 0, mouseVX = 0, lastMX = null, lastMT = 0;

    onPointer = function (e) {
      var now = performance.now();
      if (lastMX !== null) {
        var dt = Math.max(now - lastMT, 8) / 1000;
        mouseVX = Math.max(-900, Math.min(900, (e.clientX - lastMX) / dt * 0.35));
      }
      lastMX = e.clientX; lastMT = now;
    };
    addEventListener('pointermove', onPointer);

    function groundY() { return H * GROUND_FRAC; }

    function spawnDrop(layerIdx, anywhere) {
      var L = LAYERS[layerIdx], vt = Math.sqrt(G / L.k);
      drops.push({
        x: Math.random() * W,
        y: anywhere ? Math.random() * groundY() : -20 * DPR - Math.random() * H * 0.3,
        vx: wind * (0.5 + 0.5 * Math.random()),
        vy: vt * (0.55 + Math.random() * 0.4),
        layer: layerIdx
      });
    }
    function initDrops() {
      drops.length = 0;
      LAYERS.forEach(function (L, i) {
        var n = Math.round(W * H * L.density / (DPR * DPR));
        for (var j = 0; j < n; j++) spawnDrop(i, true);
      });
    }
    initDrops();

    onResize = function () { resize(); initDrops(); };
    addEventListener('resize', onResize);

    function splash(x, impactSpeed, layerIdx) {
      var L = LAYERS[layerIdx], gy = groundY();
      var n = layerIdx === 2 ? 6 : layerIdx === 1 ? 4 : 0;
      var e = 0.18 + Math.random() * 0.1;
      for (var i = 0; i < n; i++) {
        var ang = -Math.PI / 2 + (Math.random() - 0.5) * 1.6;
        var spd = impactSpeed * e * (0.4 + Math.random() * 0.8);
        splashes.push({ x: x, y: gy, vx: Math.cos(ang) * spd + wind * 0.15, vy: Math.sin(ang) * spd, life: 1, decay: 1.8 + Math.random() * 1.4, alpha: L.alpha });
      }
      if (layerIdx > 0) ripples.push({ x: x, y: gy, r: 1, c: 60 + impactSpeed * 0.02, life: 1, alpha: L.alpha });
    }

    var last = performance.now();
    function frame(now) {
      var dt = Math.min((now - last) / 1000, 0.033);
      last = now; t += dt;

      if (Math.random() < 0.004) windTarget = (Math.random() - 0.5) * 260;
      var base = Math.sin(t * 0.35) * 60 + Math.sin(t * 0.11 + 2) * 40;
      wind += ((base + windTarget + mouseVX) - wind) * (1 - Math.exp(-dt * 1.2));
      mouseVX *= Math.exp(-dt * 2.5);

      ctx.clearRect(0, 0, W, H);
      var gy = groundY();

      ctx.strokeStyle = 'rgba(143,179,217,0.10)';
      ctx.lineWidth = 1 * DPR;
      ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(W, gy); ctx.stroke();
      var grad = ctx.createLinearGradient(0, gy, 0, H);
      grad.addColorStop(0, 'rgba(143,179,217,0.05)');
      grad.addColorStop(1, 'rgba(143,179,217,0)');
      ctx.fillStyle = grad; ctx.fillRect(0, gy, W, H - gy);

      for (var i = drops.length - 1; i >= 0; i--) {
        var d = drops[i], L = LAYERS[d.layer];
        d.vy += (G - L.k * d.vy * d.vy) * dt;
        d.vx += (wind * DPR - d.vx) * L.k * Math.abs(d.vy) * dt * 2.2;
        d.x += d.vx * dt * DPR; d.y += d.vy * dt * DPR;
        if (d.x < -30) d.x += W + 60;
        if (d.x > W + 30) d.x -= W + 60;
        if (d.y >= gy) {
          splash(d.x, d.vy, d.layer);
          d.y = -20 * DPR - Math.random() * 80 * DPR; d.x = Math.random() * W;
          var vt = Math.sqrt(G / L.k); d.vy = vt * (0.55 + Math.random() * 0.4); d.vx = wind * DPR * 0.5;
          continue;
        }
        var spd = Math.hypot(d.vx, d.vy), len = spd * 0.016 * L.lenMul * DPR;
        ctx.strokeStyle = 'rgba(174,204,235,' + L.alpha + ')';
        ctx.lineWidth = L.width * DPR;
        ctx.beginPath(); ctx.moveTo(d.x, d.y); ctx.lineTo(d.x - (d.vx / spd) * len, d.y - (d.vy / spd) * len); ctx.stroke();
      }
      for (var s = splashes.length - 1; s >= 0; s--) {
        var p = splashes[s];
        p.vy += G * dt; p.x += p.vx * dt; p.y += p.vy * dt; p.life -= p.decay * dt;
        if (p.life <= 0 || p.y > gy + 4 * DPR) { splashes.splice(s, 1); continue; }
        var a = p.alpha * p.life * p.life;
        ctx.fillStyle = 'rgba(190,215,240,' + a + ')';
        ctx.beginPath(); ctx.arc(p.x, p.y, 1.1 * DPR, 0, Math.PI * 2); ctx.fill();
      }
      for (var r = ripples.length - 1; r >= 0; r--) {
        var rp = ripples[r];
        rp.r += rp.c * dt * DPR; rp.life -= dt * 1.4;
        if (rp.life <= 0) { ripples.splice(r, 1); continue; }
        var ra = rp.alpha * rp.life * (18 * DPR / (rp.r + 18 * DPR));
        ctx.strokeStyle = 'rgba(174,204,235,' + (ra * 0.6) + ')';
        ctx.lineWidth = 1 * DPR;
        ctx.beginPath(); ctx.ellipse(rp.x, rp.y, rp.r, rp.r * 0.22, 0, 0, Math.PI * 2); ctx.stroke();
      }
      raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);
  }

  window.RainBG = {
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
