import { Emitter } from "~/lib/utils/emitter";
import { mod, symmetricMod, lerp } from "~/lib/utils/math";

const lerpOptions = [
  lerp,
  (v0, v1, t) => {
    // ease out quad
    return v0 - (v1 - v0) * t * (t - 2);
  },
  (v0, v1, t) => {
    // out expo
    return t === 1 ? v1 : v0 + (v1 - v0) * (1 - Math.pow(2, -10 * t));
  },
];

const lerpFunc = lerpOptions[0];

const def = {
  parallax: 50,
  settlingAmount: 0.0001,
};

export class SliderApi {
  // params
  _center = true;
  _factor = 0.005;
  _isEnabled = true;
  _snapping = true;
  _bouncy = 0.45;
  _lerp = 0.1;
  _infinite = true;
  _parallax = false;

  // slider
  time = 0;
  current = 0;
  target = 0;
  mvmt = 0;

  lspeed = 0;
  speed = 0;

  settling = false;

  emitter = new Emitter();

  progress = 0;

  pointerDown = false;
  isDragging = false;
  // preventClick = false;

  pointer = {
    x: 0,
    ox: 0,
    cx: 0,
    sx: 0,
    psx: 0,
  };

  store = {
    itemWidth: 0,
    max: 0,
  };

  currentSlide = 0;

  constructor(element) {
    this.element = element;
    this.slides = [...this.element.children];
    this.store.max = this.slides.length - 1;

    this.resize();
    this.init();

    // --- debug

    document.onkeydown = (e) => {
      if (e.key === "ArrowRight") {
        // console.log("right");
        this.slideTo(this.current - 1);
      } else if (e.key === "ArrowLeft") {
        // console.log("left");
        this.slideTo(this.current + 1);
      }
    };
  }

  /** Interface */
  set _snapMode(val = true) {
    this._snapping = val;
  }

  set _enabled(val = true) {
    this._isEnabled = val;
  }

  on(evt, callback) {
    return this.emitter.on(evt, callback);
  }

  off(evt, callback) {
    this.emitter.off(evt, callback);
  }
  /** --- Interface */

  init() {
    if (this._parallax) this.initParallax();
    this.initEvents();

    // initial state
    this.slides[0].classList.add("active");
  }

  initEvents() {
    this.element.addEventListener("pointerdown", this.onDown.bind(this));
    this.element.addEventListener("pointerup", this.onUp.bind(this));
    this.element.addEventListener("pointermove", this.onMove.bind(this));
    this.element.addEventListener("pointerleave", this.onUp.bind(this));
  }

  removeEvents() {
    this.element.removeEventListener("pointerdown", this.onDown.bind(this));
    this.element.removeEventListener("pointerup", this.onUp.bind(this));
    this.element.removeEventListener("pointermove", this.onMove.bind(this));
    this.element.removeEventListener("pointerleave", this.onUp.bind(this));
    document.onkeydown = null;
  }

  initParallax() {
    this.parallax = this.slides.map((slide, i) => {
      const item = slide.querySelector("[data-parallax]");
      if (!item) return def.parallax;
      const amount = +item.getAttribute("data-parallax") || def.parallax;
      return { item, amount };
    });
  }

  // -- events
  onDown(e) {
    this.pointer.ox = e.clientX;
    this.pointerDown = true;

    this.element.style.cursor = "grabbing";

    return false;
  }

  onUp(e) {
    this.pointerDown = false;
    this.pointer.ox = 0;

    this.pointer.sx = 0;
    this.pointer.psx = 0;
    this.lspeed = 0;

    this.element.style.cursor = "grab";

    this.settling = true;
  }

  onMove(e) {
    if (!this._isEnabled) return;
    if (!this.pointerDown) return;

    this.pointer.x = e.clientX - this.pointer.ox;
    this.current += this.pointer.x * this._factor;
    this.pointer.ox = e.clientX;

    this._direction = this.pointer.x;

    if (this.pointer.psx === 0) this.pointer.psx = e.screenX;

    this.pointer.sx = e.screenX - this.pointer.psx;
    this.lspeed += this.pointer.sx * 0.01;
    this.pointer.psx = e.screenX;
  }

  set _direction(dir) {
    dir = Math.sign(dir);
    if (dir === this.direction) return;

    // (*) EMIT direction change

    if (dir > 0) {
      this.direction = dir;
    } else {
      this.direction = dir;
    }
  }

  set _currentSlide(val) {
    let curr = Math.round(val * -1);
    if (this._infinite) curr = mod(curr, this.store.max + 1);

    if (curr < 0 || curr > this.store.max) return;
    if (this.currentSlide === curr) return;

    queueMicrotask(() => {
      this.slides[curr].classList.add("active");
      this.slides[this.currentSlide].classList.remove("active");
      this.currentSlide = curr;
      this.emitter.emit("change", curr);
    });
  }

  slideTo(index) {
    if (!this._isEnabled) return;

    // speed calculation
    const speed = this.current - index;
    this.lspeed -= speed;
    this._direction = -speed;

    // > slide to
    this.current = index;
  }

  /** Resize */
  resize() {
    let total = 0;
    this.slides.forEach((slide, i) => (total += slide.offsetWidth));
    this.store.itemWidth = total / this.slides.length;

    if (this._center) {
      const diff = this.element.offsetWidth - this.store.itemWidth;
      this.element.style.paddingLeft = `${diff / 2}px`;
    }

    // console.log("resize");
  }

  /** Render */
  update() {
    // console.log("fuck");

    this.time++;
    this.previousTarget = this.target;

    this.renderSpeed();

    if (this.time % 5 === 0) {
      this._currentSlide = this.current;
    }

    this.renderProgress();
    this.renderRounding();
    if (!this._infinite) this.renderClamp();

    this.target = lerpFunc(this.target, this.current, this._lerp);

    this.renderDOM();

    if (Math.abs(this.previousTarget - this.target) > def.settlingAmount) {
      this.emitter.emit("slide", this);
    } else {
      if (!this.settling) return;
      this.emitter.emit("settle", this);
      this.settling = false;
    }

    // this.update();
  }

  renderDOM() {
    this.slides.forEach((slide, index) => {
      const x = this.renderSlide(index, slide);
      slide.style.transform = `translateX(${x * this.store.itemWidth}px)`;
    });
  }

  renderSlide(index, slide) {
    // parallax
    if (this.parallax && this.parallax.length > 0 && this.parallax[index]) {
      const parallax = this.target + index;
      const x = symmetricMod(parallax, (this.store.max + 1) / 2);

      this.parallax[index].item.style.transform =
        `translateX(${x * this.parallax[index].amount}%)`;
    }

    // infinite loop
    if (this._infinite) {
      let pos = this.target + index;
      const x = symmetricMod(pos, (this.store.max + 1) / 2);

      return x - index;
    } else {
      return this.target;
    }
  }

  renderRounding() {
    if (!this.pointerDown && this._snapping) {
      this.rounded = Math.round(this.current);
      const diff = this.rounded - this.current;
      const calc = Math.sign(diff) * Math.pow(Math.abs(diff), 0.75) * 0.1;
      this.current += calc;
    }
  }

  renderClamp() {
    if (this.current > this._bouncy) {
      this.current = this._bouncy;
    } else if (this.current < -this.store.max - this._bouncy) {
      this.current = -this.store.max - this._bouncy;
    }
  }

  renderSpeed() {
    this.speed = lerpFunc(this.speed, this.lspeed, this._lerp);
    this.lspeed *= 0.9;
  }

  renderProgress() {
    // not fucking working
    let progress;

    if (this._infinite) {
      let curr = mod(-this.current.toFixed(4), this.slides.length);
      if (curr > this.slides.length - 1) curr = this.slides.length - 1;
      progress = curr / (this.slides.length - 1);
    } else {
      progress = -this.current / this.store.max;
    }

    this.progress = lerp(progress, this.progress, this._lerp);
  }
}
