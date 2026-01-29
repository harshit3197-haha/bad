


const slides = [
  "1.jpeg",
  "2.jpeg",
  "3.jpeg",
  "4.jpeg",
  "5.jpeg",
  "6.jpeg",
];

let current = 0;

const prevImg = document.getElementById("prevImg");
const currImg = document.getElementById("currImg");
const nextImg = document.getElementById("nextImg");

const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

const slideshowPage = document.getElementById("slideshowPage");
const errorPage = document.getElementById("errorPage");
const okBtn = document.getElementById("okBtn");

const videoPage = document.getElementById("videoPage");
const finalVideo = document.getElementById("finalVideo");

/* ✅ FIX: FORCE correct page show on load */
window.addEventListener("DOMContentLoaded", () => {
  errorPage.classList.add("hidden");
  videoPage.classList.add("hidden");
  slideshowPage.classList.remove("hidden");
});

function idx(i) {
  return (i + slides.length) % slides.length;
}

function render() {
  prevImg.src = slides[idx(current - 1)];
  currImg.src = slides[idx(current)];
  nextImg.src = slides[idx(current + 1)];
}

function rect(el) {
  return el.getBoundingClientRect();
}

function makeGhost(fromEl, src) {
  const r = rect(fromEl);

  const ghost = document.createElement("div");
  ghost.className = "moving";
  ghost.style.left = r.left + "px";
  ghost.style.top = r.top + "px";
  ghost.style.width = r.width + "px";
  ghost.style.height = r.height + "px";

  const im = document.createElement("img");
  im.src = src;
  ghost.appendChild(im);

  document.body.appendChild(ghost);
  return ghost;
}

function showErrorPage() {
  slideshowPage.classList.add("hidden");
  errorPage.classList.remove("hidden");
}

function showVideo() {
  errorPage.classList.add("hidden");
  slideshowPage.classList.add("hidden");
  videoPage.classList.remove("hidden");

  finalVideo.currentTime = 0;

  finalVideo.play().catch(() => {
    finalVideo.muted = true;
    finalVideo.play();
  });
}

let isAnimating = false;

function swap(direction) {
  if (isAnimating) return;
  isAnimating = true;

  const rPrev = rect(prevImg);
  const rCurr = rect(currImg);
  const rNext = rect(nextImg);

  const gPrev = makeGhost(prevImg, prevImg.src);
  const gCurr = makeGhost(currImg, currImg.src);
  const gNext = makeGhost(nextImg, nextImg.src);

  prevImg.style.opacity = "0";
  currImg.style.opacity = "0";
  nextImg.style.opacity = "0";

  requestAnimationFrame(() => {
    if (direction === "next") {
      gCurr.style.left = rPrev.left + "px";
      gCurr.style.top = rPrev.top + "px";
      gCurr.style.width = rPrev.width + "px";
      gCurr.style.height = rPrev.height + "px";

      gNext.style.left = rCurr.left + "px";
      gNext.style.top = rCurr.top + "px";
      gNext.style.width = rCurr.width + "px";
      gNext.style.height = rCurr.height + "px";

      gPrev.style.left = rNext.left + "px";
      gPrev.style.top = rNext.top + "px";
      gPrev.style.width = rNext.width + "px";
      gPrev.style.height = rNext.height + "px";
    } else {
      gCurr.style.left = rNext.left + "px";
      gCurr.style.top = rNext.top + "px";
      gCurr.style.width = rNext.width + "px";
      gCurr.style.height = rNext.height + "px";

      gPrev.style.left = rCurr.left + "px";
      gPrev.style.top = rCurr.top + "px";
      gPrev.style.width = rCurr.width + "px";
      gPrev.style.height = rCurr.height + "px";

      gNext.style.left = rPrev.left + "px";
      gNext.style.top = rPrev.top + "px";
      gNext.style.width = rPrev.width + "px";
      gNext.style.height = rPrev.height + "px";
    }
  });

  setTimeout(() => {
    gPrev.remove();
    gCurr.remove();
    gNext.remove();

    if (direction === "next") current = idx(current + 1);
    else current = idx(current - 1);

    render();

    prevImg.style.opacity = "1";
    currImg.style.opacity = "1";
    nextImg.style.opacity = "1";

    isAnimating = false;
  }, 540);
}

prevBtn.addEventListener("click", () => swap("prev"));

nextBtn.addEventListener("click", () => {
  if (current === slides.length - 1) {
    showErrorPage();
    return;
  }
  swap("next");
});

okBtn.addEventListener("click", () => {
  showVideo();
});

render();

