const timerCircle = document.getElementById("timer-circle");
const timerIcon = document.getElementById("timer-icon");
const timerText = document.getElementById("timer-text");

let startTime = 25 * 60;
let breakTime = 5 * 60;
let timerInterval;
let isBreak = false;
let isRunning = false;
let clickCount = 0; // To track double clicks
let clickTimeout;

timerCircle.addEventListener("click", toggleTimer);
timerCircle.addEventListener("touchstart", toggleTimer);

function toggleTimer() {
  clickCount++;
  if (clickCount === 1) {
    clickTimeout = setTimeout(() => {
      clickCount = 0;
      if (isRunning) {
        pauseTimer();
      } else {
        startTimer();
      }
    }, 250); // Adjust this value for double-click speed
  } else if (clickCount === 2) {
    clearTimeout(clickTimeout);
    clickCount = 0;
    resetTimer();
  }
}

function startTimer() {
  if (!isRunning) {
    timerInterval = setInterval(updateTimer, 1000);
    timerIcon.classList.remove("fa-play");
    timerIcon.classList.add("fa-pause");
    isRunning = true;
  }
}

function pauseTimer() {
  clearInterval(timerInterval);
  timerIcon.classList.remove("fa-pause");
  timerIcon.classList.add("fa-play");
  isRunning = false;
}

function resetTimer() {
  clearInterval(timerInterval);
  startTime = 25 * 60;
  isBreak = false;
  isRunning = false;
  timerText.textContent = "25:00";
  timerCircle.style.width = "200px"; // Reset circle size
  timerCircle.style.height = "200px";
  timerCircle.style.backgroundColor = "#F9DF74";
  timerIcon.classList.remove("fa-pause");
  timerIcon.classList.add("fa-play");
}

function updateTimer() {
  let minutes = Math.floor(startTime / 60);
  let seconds = startTime % 60;

  // Update the text content without creating a new text node each time
  timerText.firstChild.nodeValue = `${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

  const maxSize = Math.max(window.innerWidth, window.innerHeight) * 1.5;
  const circleSize = Math.min(
    maxSize,
    maxSize * (1 - startTime / (isBreak ? breakTime : 25 * 60))
  );
  timerCircle.style.width = `${circleSize}px`;
  timerCircle.style.height = `${circleSize}px`;

  startTime--;

  if (startTime < 0) {
    clearInterval(timerInterval);
    if (isBreak) {
      isBreak = false;
      startTime = 25 * 60;
      timerCircle.style.backgroundColor = "#F9DF74";
    } else {
      isBreak = true;
      startTime = breakTime;
      timerCircle.style.backgroundColor = "#f44336";
    }
    pauseTimer(); // Automatically pause after work or break
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.body.style.cursor = "dot"; // Set cursor on page load
});

timerCircle.addEventListener("mouseover", () => {
  document.body.style.cursor = "pointer"; // Change to pointer on hover
});

timerCircle.addEventListener("mouseout", () => {
  document.body.style.cursor = "dot"; // Change back to dot when not hovering
});

{
  const shuffleArray = (arr) => arr.sort(() => Math.random() - 0.5);
  const lineEq = (y2, y1, x2, x1, currentVal) => {
    let m = (y2 - y1) / (x2 - x1);
    let b = y1 - m * x1;
    return m * currentVal + b;
  };
  const lerp = (a, b, n) => (1 - n) * a + n * b;
  const body = document.body;
  const getMousePos = (e) => {
    let posx = 0;
    let posy = 0;
    if (!e) e = window.event;
    if (e.pageX || e.pageY) {
      posx = e.pageX;
      posy = e.pageY;
    } else if (e.clientX || e.clientY) {
      posx = e.clientX + body.scrollLeft + document.documentElement.scrollLeft;
      posy = e.clientY + body.scrollTop + document.documentElement.scrollTop;
    }
    return { x: posx, y: posy };
  };

  let winsize;
  const calcWinsize = () =>
    (winsize = { width: window.innerWidth, height: window.innerHeight });
  calcWinsize();
  window.addEventListener("resize", calcWinsize);

  class CursorFx {
    constructor(el) {
      this.DOM = { el: el };
      this.DOM.dot = this.DOM.el.querySelector(".cursor__inner--dot");
      this.DOM.circle = this.DOM.el.querySelector(".cursor__inner--circle");
      this.bounds = {
        dot: this.DOM.dot.getBoundingClientRect(),
        circle: this.DOM.circle.getBoundingClientRect()
      };
      this.scale = 1;
      this.opacity = 1;
      this.mousePos = { x: 0, y: 0 };
      this.lastMousePos = { dot: { x: 0, y: 0 }, circle: { x: 0, y: 0 } };
      this.lastScale = 1;
      this.lastOpacity = 1;

      this.initEvents();
      requestAnimationFrame(() => this.render());
    }
    initEvents() {
      window.addEventListener(
        "mousemove",
        (ev) => (this.mousePos = getMousePos(ev))
      );
    }
    render() {
      this.lastMousePos.dot.x = lerp(
        this.lastMousePos.dot.x,
        this.mousePos.x - this.bounds.dot.width / 2,
        1
      );
      this.lastMousePos.dot.y = lerp(
        this.lastMousePos.dot.y,
        this.mousePos.y - this.bounds.dot.height / 2,
        1
      );
      this.lastMousePos.circle.x = lerp(
        this.lastMousePos.circle.x,
        this.mousePos.x - this.bounds.circle.width / 2,
        0.15
      );
      this.lastMousePos.circle.y = lerp(
        this.lastMousePos.circle.y,
        this.mousePos.y - this.bounds.circle.height / 2,
        0.15
      );
      this.lastScale = lerp(this.lastScale, this.scale, 0.15);
      this.lastOpacity = lerp(this.lastOpacity, this.opacity, 0.1);
      this.DOM.dot.style.transform = `translateX(${this.lastMousePos.dot.x}px) translateY(${this.lastMousePos.dot.y}px)`;
      this.DOM.circle.style.transform = `translateX(${this.lastMousePos.circle.x}px) translateY(${this.lastMousePos.circle.y}px) scale(${this.lastScale})`;
      this.DOM.circle.style.opacity = this.lastOpacity;

      const elementBelowCursor = document.elementFromPoint(
        this.mousePos.x,
        this.mousePos.y
      );
      if (elementBelowCursor) {
        const bgColor = getComputedStyle(elementBelowCursor).backgroundColor;
        const rgb = bgColor.match(/\d+/g);

        const brightness = (rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000;

        if (brightness < 128) {
          this.DOM.dot.style.backgroundColor = "#f2f2f2";
          this.DOM.circle.style.borderColor = "#f2f2f2";
        } else {
          this.DOM.dot.style.backgroundColor = "#403F4C";
          this.DOM.circle.style.borderColor = "#403F4C";
        }
      }

      requestAnimationFrame(() => this.render());
    }

    click() {
      this.lastScale = 1;
      this.lastOpacity = 0;
    }
  }

  const cursor = new CursorFx(document.querySelector(".cursor"));

  [...document.querySelectorAll("[data-hover]")].forEach((link) => {
    link.addEventListener("click", () => cursor.click());
  });
}
