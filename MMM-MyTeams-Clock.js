/* MagicMirror Module: MMM-MyTeams-Clock
   - Crest rendered as a perfect circle using a background-image (robust for non-square sources)
   - Wrapper is a square with min size = crestRadius * wrapperSizeFactor (default 2.4)
   - Clock canvas overlays crest and is centered
   - HiDPI support: canvas scales by devicePixelRatio for sharp lines, with resize handling
*/

Module.register("MMM-MyTeams-Clock", {   
  defaults: {
   crestImage: "Celtic-01.png",  // file in modules/MMM-MyTeams-Clock root 
    			crestRadius: 260,            // crest circle radius (CSS px) roughly 2.6 x clockRadius  for "crest_bw.png" , default 260 px
    			clockRadius:  100,           // adjust until the clock perfectly overlays - for "crest_bw.png" default 100 px
   				wrapperSizeFactor: 1.0,      // square wrapper min size = crestRadius * 1.0  increase if you have a non square crest image - max size 2.4

    		// Optional fine-tuning
    		offsetX: 0, // you may need to tweak this if your clock is not correctly centered
    		offsetY: -17, // you may need to tweak this if your clock is not correctly centered , -17 moves the "crest-bw.png" image upwards

        // Wrapper position offsets (applied to the wrapper via CSS transform)
        wrapperOffsetX: 0, // default 0: move wrapper horizontally (px)
        wrapperOffsetY: 0, // default 0: move wrapper vertically (px)
        opacity: 1.00,

        // Enhancements: optional clamping and debug outline for easier alignment
        clampWrapperOffsets: false, // when true, clamp wrapper offsets to +/- clampMaxAbsOffset
        clampMaxAbsOffset: 2000,    // maximum absolute px allowed for wrapper offsets when clamping
        debugOutline: false,        // when true, draw an outline around the wrapper for alignment
        debugOutlineColor: "#ff00ff",
        debugOutlineWidth: 1,
      
        // Styling options
        rimColor: "#444444",
        hourMarkColor: "#444444",
        minuteMarkColor: "#444444",
        hourHandColor: "#018749",
        minuteHandColor: "#018749",
        secondHandColor: "#ffffff",
        centerDotColor: "#018749",
        // Toggle display of rim and marks
        showRim: true,   // set false to hide the outer rim
        showMarks: true, // set false to hide both hour and minute marks
       
      },

  start: function () {
    this.updateTimer = null;
    this.canvas = null;

    try {
      console.info("MMM-MyTeams-Clock: start() initialized");
    } catch (e) { /* ignore */ }

    // Re-apply HiDPI scaling and redraw on resize/DPR changes
    this.handleResize = () => {
      try {
        if (this.canvas) {
          const cr = Number(this.config.crestRadius);
          const crestRadius = Number.isFinite(cr) && cr > 0 ? cr : 260;
          this.setupHiDpiCanvas(this.canvas, crestRadius);
          this.drawClock(this.canvas);
        }
      } catch (e) {
        console.error("MMM-MyTeams-Clock: handleResize error:", e);
      }
    };
  },

  getDom: function () {
    const wrapper = document.createElement("div");
    wrapper.className = "myteams-clock-wrapper";

    // Sanitize crestRadius from config; default to 260 if invalid
    const cr = Number(this.config.crestRadius);
    const crestRadius = Number.isFinite(cr) && cr > 0 ? cr : 260;
    const baseSize = Math.round(crestRadius * (this.config.wrapperSizeFactor || 2.1));
    const wrapperSize = Math.max(crestRadius * 2, baseSize);

    // Square wrapper, horizontally centered
    wrapper.style.position = "relative";
    wrapper.style.minWidth = `${wrapperSize}px`;
    wrapper.style.minHeight = `${wrapperSize}px`;
    wrapper.style.width = `${wrapperSize}px`;
    wrapper.style.height = `${wrapperSize}px`;
    wrapper.style.margin = "0 auto";
    // Hint the browser to optimize for transform changes
    wrapper.style.willChange = "transform";

    // Apply user-configurable wrapper offsets (px). Defaults to 0 if invalid.
    try {
      let offsetX = Number(this.config.wrapperOffsetX);
      let offsetY = Number(this.config.wrapperOffsetY);
      if (!Number.isFinite(offsetX) || !Number.isFinite(offsetY)) {
        console.warn("MMM-MyTeams-Clock: wrapperOffsetX/Y must be numeric. Falling back to 0.");
        offsetX = 0;
        offsetY = 0;
      }

      // Optional clamping
      if (this.config.clampWrapperOffsets === true) {
        const maxAbs = Number(this.config.clampMaxAbsOffset);
        const limit = Number.isFinite(maxAbs) && maxAbs > 0 ? maxAbs : 2000;
        const clamp = (v) => Math.max(-limit, Math.min(limit, v));
        const ox = offsetX;
        const oy = offsetY;
        offsetX = clamp(offsetX);
        offsetY = clamp(offsetY);
        if (ox !== offsetX || oy !== offsetY) {
          console.warn(`MMM-MyTeams-Clock: wrapper offsets clamped to within +/-${limit}px (was ${ox}, ${oy}; now ${offsetX}, ${offsetY})`);
        }
      }

      // Translate the entire wrapper, moving crest and canvas together
      wrapper.style.transform = `translate(${offsetX}px, ${offsetY}px)`;

      // Optional debug outline to help alignment
      if (this.config.debugOutline === true) {
        const width = Number.isFinite(Number(this.config.debugOutlineWidth)) ? Number(this.config.debugOutlineWidth) : 1;
        const color = typeof this.config.debugOutlineColor === 'string' ? this.config.debugOutlineColor : '#ff00ff';
        wrapper.style.outline = `${width}px solid ${color}`;
      }
    } catch (e) {
      console.error("MMM-MyTeams-Clock: failed to apply wrapper offsets:", e);
    }

    // Crest circular container (robust for non-square images)
    const crest = document.createElement("div");
    crest.className = "myteams-crest";
    crest.style.position = "absolute";
    crest.style.left = "50%";
    crest.style.top = "50%";
    crest.style.width = `${crestRadius * 2}px`;
    crest.style.height = `${crestRadius * 2}px`;
    crest.style.transform = "translate(-50%, -50%)";
    crest.style.borderRadius = "50%";
    crest.style.overflow = "hidden";
    // Load crest from clubCrest subfolder within the module
    crest.style.backgroundImage = `url(${this.file("clubCrest/" + this.config.crestImage)})`;
    crest.style.backgroundSize = "cover";
    crest.style.backgroundPosition = "center";
    crest.style.opacity = `${this.config.opacity}`;
    crest.style.zIndex = "1";
    wrapper.appendChild(crest);

    // Canvas overlay (same footprint as crest)
    const canvas = document.createElement("canvas");
    canvas.className = "myteams-clock-canvas";
    canvas.style.position = "absolute";
    canvas.style.left = "50%";
    canvas.style.top = "50%";
    canvas.style.width = `${crestRadius * 2}px`;
    canvas.style.height = `${crestRadius * 2}px`;
    canvas.style.transform = "translate(-50%, -50%)";
    canvas.style.zIndex = "2";
    wrapper.appendChild(canvas);

    // Save ref and prepare for HiDPI
    this.canvas = canvas;
    this.setupHiDpiCanvas(canvas, crestRadius);

    // First draw (small delay to ensure layout is ready)
    setTimeout(() => this.drawClock(canvas), 50);

    // Update every second
    if (!this.updateTimer) {
      this.updateTimer = setInterval(() => this.drawClock(canvas), 1000);
    }

    // Keep sharp on resize/orientation/DPR changes
    window.addEventListener("resize", this.handleResize);

    return wrapper;
  },

  // Scale canvas by devicePixelRatio; draw using CSS-pixel units
  setupHiDpiCanvas: function (canvas, crestRadius) {
    const dpr = Math.max(1, window.devicePixelRatio || 1);
    const cssSize = crestRadius * 2; // CSS pixels

    // Backing store (physical pixels)
    canvas.width = Math.round(cssSize * dpr);
    canvas.height = Math.round(cssSize * dpr);

    // Keep displayed size in CSS pixels
    canvas.style.width = `${cssSize}px`;
    canvas.style.height = `${cssSize}px`;

    const ctx = canvas.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); // 1 unit = 1 CSS pixel
  },

  drawClock: function (canvas) {
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      try { console.error("MMM-MyTeams-Clock: 2D context not available"); } catch (e) {}
      return;
    }
    // Context already scaled so units are CSS pixels
    const cr = Number(this.config.crestRadius);
    const crestRadius = Number.isFinite(cr) && cr > 0 ? cr : 260;
    const clr = Number(this.config.clockRadius);
    const clockRadius = Number.isFinite(clr) && clr > 0 ? clr : 100;
    const offx = Number(this.config.offsetX);
    const offy = Number(this.config.offsetY);
    const offsetX = crestRadius + (Number.isFinite(offx) ? offx : 0);
    const offsetY = crestRadius + (Number.isFinite(offy) ? offy : 0);

    // Clear frame
    ctx.clearRect(0, 0, crestRadius * 2, crestRadius * 2);

    // Colors
    const rimColor = this.config.rimColor;
    const hourMarkColor = this.config.hourMarkColor;
    const minuteMarkColor = this.config.minuteMarkColor;

    // Rim (optional)
    if (this.config.showRim !== false) {
      ctx.globalAlpha = 1.0;
      ctx.beginPath();
      ctx.arc(offsetX, offsetY, clockRadius, 0, 2 * Math.PI);
      ctx.lineWidth = 2;
      ctx.strokeStyle = rimColor;
      ctx.stroke();
    }

    // Marks (optional)
    if (this.config.showMarks !== false) {
      // Hour marks
      for (let i = 0; i < 12; i++) {
        const angle = (Math.PI / 6) * i - Math.PI / 2;
        const x1 = offsetX + Math.cos(angle) * (clockRadius - 12);
        const y1 = offsetY + Math.sin(angle) * (clockRadius - 12);
        const x2 = offsetX + Math.cos(angle) * (clockRadius - 2);
        const y2 = offsetY + Math.sin(angle) * (clockRadius - 2);
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.lineWidth = 3;
        ctx.strokeStyle = hourMarkColor;
        ctx.stroke();
      }

      // Minute marks
      for (let i = 0; i < 60; i++) {
        if (i % 5 === 0) continue;
        const angle = (Math.PI / 30) * i - Math.PI / 2;
        const x1 = offsetX + Math.cos(angle) * (clockRadius - 8);
        const y1 = offsetY + Math.sin(angle) * (clockRadius - 8);
        const x2 = offsetX + Math.cos(angle) * (clockRadius - 2);
        const y2 = offsetY + Math.sin(angle) * (clockRadius - 2);
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.lineWidth = 1;
        ctx.strokeStyle = minuteMarkColor;
        ctx.stroke();
      }
    }

    // Time
    const now = new Date();
    const hour = now.getHours() % 12;
    const minute = now.getMinutes();
    const second = now.getSeconds();

    // Hands
    this.drawHand(ctx, offsetX, offsetY, (hour + minute / 60) * 30, clockRadius * 0.6, 8, this.config.hourHandColor);
    this.drawHand(ctx, offsetX, offsetY, (minute + second / 60) * 6, clockRadius * 0.8, 6, this.config.minuteHandColor);
    this.drawHand(ctx, offsetX, offsetY, second * 6,               clockRadius * 0.9, 2, this.config.secondHandColor);

    // Center dot
    ctx.beginPath();
    ctx.arc(offsetX, offsetY, 6, 0, 2 * Math.PI);
    ctx.fillStyle = this.config.centerDotColor;
    ctx.fill();
  },

  drawHand: function (ctx, x, y, angleDeg, length, width, color) {
    const rad = (Math.PI / 180) * (angleDeg - 90);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + length * Math.cos(rad), y + length * Math.sin(rad));
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.lineCap = "round";
    ctx.stroke();
  },

  getStyles: function () {
    return [this.file("MMM-MyTeams-Clock.css")];
  },

  suspend: function () {
    if (this.updateTimer) {
      clearInterval(this.updateTimer);
      this.updateTimer = null;
    }
    if (this.handleResize) {
      window.removeEventListener("resize", this.handleResize);
    }
  },

  resume: function () {
    if (!this.updateTimer && this.canvas) {
      this.updateTimer = setInterval(() => this.drawClock(this.canvas), 1000);
    }
    if (this.handleResize) {
      window.addEventListener("resize", this.handleResize);
    }
  },

  stop: function () {
    if (this.updateTimer) {
      clearInterval(this.updateTimer);
      this.updateTimer = null;
    }
    if (this.handleResize) {
      window.removeEventListener("resize", this.handleResize);
    }
  }
});