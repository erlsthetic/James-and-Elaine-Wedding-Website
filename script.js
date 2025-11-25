
/* ===== GALLERY SLIDER ===== */
const imageUrls = [
    "assets/images/Gallery1.jpg",
    "assets/images/Gallery2.jpg",
    "assets/images/Gallery3.jpg",
    "assets/images/Gallery4.jpg",
    "assets/images/Gallery5.jpg",
    "assets/images/Gallery6.jpg",
    "assets/images/Gallery7.jpg",
    "assets/images/Gallery8.jpg",
    "assets/images/Gallery9.jpg",
    "assets/images/Gallery10.jpg",
    "assets/images/Gallery11.jpg",
    "assets/images/Gallery12.jpg",
    "assets/images/Gallery13.jpg",
    "assets/images/Gallery14.jpg",
    "assets/images/Gallery15.jpg",
    "assets/images/Gallery16.jpg"
];

// let current = 0;

// const imgA = document.getElementById("galleryImageA");
// const imgB = document.getElementById("galleryImageB");

// document.querySelector(".prev").onclick = () => change(-1);
// document.querySelector(".next").onclick = () => change(1);

// let showingA = true;

// function change(dir) {
//     const next = (current + dir + images.length) % images.length;
//     const newSrc = images[next];

//     if (showingA) {
//         imgB.src = newSrc;
//         imgB.classList.add("show");
//         imgA.classList.remove("show");
//     } else {
//         imgA.src = newSrc;
//         imgA.classList.add("show");
//         imgB.classList.remove("show");
//     }

//     showingA = !showingA;
//     current = next;
// }

const galleryEl = document.getElementById('gallery');
const lightbox = document.getElementById('lightbox');
const lightImg = document.getElementById('lightImg');
const metaEl = document.getElementById('meta');
const imgwrap = document.getElementById('imgwrap');

let currentIndex = 0;
let scale = 1;
const MIN_SCALE = 0.5;
const MAX_SCALE = 4;
const SCALE_STEP = 0.15;

// Preload function
function preload(url){
  const img = new Image();
  img.src = url;
}

// build gallery
imageUrls.forEach((url, i) => {
  const item = document.createElement('div');
  item.className = 'thumb';
  item.innerHTML = `<img src="${url}" alt="Image ${i+1}" loading="lazy" data-index="${i}">`;
  item.addEventListener('click', () => openViewer(i));
  galleryEl.appendChild(item);
  preload(url);
});

// viewer controls
const btnClose = document.getElementById('btnCloseImgViewer');
const nextBtn = document.getElementById('nextBtn');
const prevBtn = document.getElementById('prevBtn');
const zoomIn = document.getElementById('zoomIn');
const zoomOut = document.getElementById('zoomOut');
const resetZoom = document.getElementById('resetZoom');

btnClose.addEventListener('click', closeViewer);
nextBtn.addEventListener('click', () => showIndex(currentIndex + 1));
prevBtn.addEventListener('click', () => showIndex(currentIndex - 1));
zoomIn.addEventListener('click', () => setScale(scale + SCALE_STEP));
zoomOut.addEventListener('click', () => setScale(scale - SCALE_STEP));
resetZoom.addEventListener('click', () => setScale(1));

// open viewer
function openViewer(index){
  currentIndex = (index + imageUrls.length) % imageUrls.length;
  setScale(1);
  render();
  lightbox.classList.add('visible');
  lightbox.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden'; // prevent background scroll
  // focus for keyboard handling
  window.setTimeout(() => { lightbox.focus?.(); }, 50);
}

// close viewer
function closeViewer(){
  lightbox.classList.remove('visible');
  lightbox.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  setScale(1);
}

// show image by index with wrapping
function showIndex(i){
  currentIndex = (i + imageUrls.length) % imageUrls.length;
  setScale(1);
  render();
}

// render current image
function render(){
  const url = imageUrls[currentIndex];
  lightImg.src = url;
  lightImg.alt = `Image ${currentIndex + 1}`;
  metaEl.textContent = `${currentIndex + 1} / ${imageUrls.length}`;
  updateImageTransform();
}

// scale handling
function setScale(s){
  scale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, s));
  updateImageTransform();
}

// apply CSS transform
function updateImageTransform(){
  lightImg.style.transform = `scale(${scale})`;
}

// close when clicking outside the imgwrap
lightbox.addEventListener('click', (e) => {
  // if click target is lightbox itself (outside viewer) or on background overlay
  if(e.target === lightbox) closeViewer();
});

// keyboard support
window.addEventListener('keydown', (e) => {
  if (!lightbox.classList.contains('visible')) return;
  if (e.key === 'Escape') closeViewer();
  if (e.key === 'ArrowRight') showIndex(currentIndex + 1);
  if (e.key === 'ArrowLeft') showIndex(currentIndex - 1);
  if (e.key === '+' || e.key === '=' ) setScale(scale + SCALE_STEP);
  if (e.key === '-') setScale(scale - SCALE_STEP);
  if (e.key === '0') setScale(1);
});

// wheel zoom (only when pointer is inside imgwrap)
let wheelTimeout;
imgwrap.addEventListener('wheel', (e) => {
  e.preventDefault();
  const delta = -Math.sign(e.deltaY) * (SCALE_STEP * 1.2);
  setScale(scale + delta);

  // optional: small delay to prevent overscroll affecting page — already prevented by e.preventDefault()
  clearTimeout(wheelTimeout);
  wheelTimeout = setTimeout(() => {}, 100);
}, { passive: false });

// touch: double-tap to reset / zoom
let lastTap = 0;
imgwrap.addEventListener('touchend', (e) => {
  const now = Date.now();
  if (now - lastTap < 300) {
    // double tap
    setScale(scale === 1 ? 2 : 1);
  }
  lastTap = now;
});

// drag to pan when zoomed
let isDragging = false;
let startX = 0;
let startY = 0;
let currentTranslateX = 0;
let currentTranslateY = 0;

lightImg.style.cursor = 'grab';

imgwrap.addEventListener('pointerdown', (e) => {
  if (scale <= 1.01) return;
  isDragging = true;
  imgwrap.setPointerCapture(e.pointerId);
  startX = e.clientX - currentTranslateX;
  startY = e.clientY - currentTranslateY;
  lightImg.style.transition = 'none';
  lightImg.style.cursor = 'grabbing';
});

imgwrap.addEventListener('pointermove', (e) => {
  if (!isDragging) return;
  currentTranslateX = e.clientX - startX;
  currentTranslateY = e.clientY - startY;
  lightImg.style.transform = `translate(${currentTranslateX}px, ${currentTranslateY}px) scale(${scale})`;
});

imgwrap.addEventListener('pointerup', (e) => {
  if (!isDragging) return;
  isDragging = false;
  imgwrap.releasePointerCapture(e.pointerId);
  lightImg.style.transition = '';
  lightImg.style.cursor = 'grab';
});

// Reset translate when scale changes to 1
function resetTranslateIfNeeded(){
  if (scale <= 1.01) {
    currentTranslateX = 0;
    currentTranslateY = 0;
    lightImg.style.transform = `scale(${scale})`;
  } else {
    lightImg.style.transform = `translate(${currentTranslateX}px, ${currentTranslateY}px) scale(${scale})`;
  }
}

// wrap updateImageTransform to consider translate
function updateImageTransform(){
  if (scale <= 1.01) {
    currentTranslateX = 0;
    currentTranslateY = 0;
    lightImg.style.transform = `scale(${scale})`;
  } else {
    lightImg.style.transform = `translate(${currentTranslateX}px, ${currentTranslateY}px) scale(${scale})`;
  }
}

// when pressing next/prev, reset translate
const originalShowIndex = showIndex;
showIndex = function(i){
  currentTranslateX = 0;
  currentTranslateY = 0;
  originalShowIndex(i);
};

// ensure clicking next/prev keeps focus
[nextBtn, prevBtn, btnClose, zoomIn, zoomOut, resetZoom].forEach(b => {
  b.addEventListener('mousedown', (ev) => ev.preventDefault());
});

// preload neighbors for smoother nav
lightImg.addEventListener('load', () => {
  const next = new Image();
  next.src = imageUrls[(currentIndex + 1) % imageUrls.length];
  const prev = new Image();
  prev.src = imageUrls[(currentIndex - 1 + imageUrls.length) % imageUrls.length];
});

// Accessibility: trap focus (simple)
document.addEventListener('focusin', (e) => {
  if (!lightbox.classList.contains('visible')) return;
  if (!lightbox.contains(e.target)) {
    btnClose.focus();
  }
});


/* ===== FAQ ACCORDION ===== */

document.querySelectorAll(".faq-question").forEach(btn => {
    btn.addEventListener("click", () => {
        const ans = btn.nextElementSibling;
        const isOpen = ans.style.display === "block";

        // Toggle answer visibility
        ans.style.display = isOpen ? "none" : "block";

        // Toggle + / -
        btn.classList.toggle("active", !isOpen);
    });
});


const tooltip = document.getElementById("colorTooltip");
const swatches = document.querySelectorAll(".swatch");
let tooltipOpenByTap = false;

// Hover (desktop)
swatches.forEach(swatch => {
    swatch.addEventListener("mouseenter", e => {
        tooltipOpenByTap = false;
        showTooltip(e);
    });

    swatch.addEventListener("mousemove", e => {
        if (!tooltipOpenByTap) moveTooltip(e);
    });

    swatch.addEventListener("mouseleave", () => {
        if (!tooltipOpenByTap) hideTooltip();
    });

    // Tap (mobile)
    swatch.addEventListener("click", e => {
        e.stopPropagation(); // prevent outside click from firing

        // Toggle if tapping same swatch
        if (tooltipOpenByTap && tooltip.dataset.current === swatch.dataset.hex) {
            hideTooltip();
            tooltipOpenByTap = false;
            return;
        }

        tooltipOpenByTap = true;
        showTooltip(e);
        tooltip.dataset.current = swatch.dataset.hex; // keep track
    });
});

// Hide tooltip when tapping outside — but ignore taps on swatches
document.addEventListener("click", e => {
    if (e.target.classList.contains("swatch")) return;
    hideTooltip();
    tooltipOpenByTap = false;
});

function showTooltip(e) {
    const elem = e.target;
    tooltip.innerHTML = `<strong>${elem.dataset.colorname}</strong><br>${elem.dataset.hex}`;
    tooltip.classList.add("show");

    moveTooltip(e);
}

function moveTooltip(e) {
    tooltip.style.left = e.pageX + "px";
    tooltip.style.top = (e.pageY - 20) + "px";
}

function hideTooltip() {
    tooltip.classList.remove("show");
}


const openBtnOLGMC = document.getElementById('OLGMC-Btn');
const closeBtnOLGMC = document.getElementById('closePopupBtnOLGMC');
const overlayOLGMC = document.getElementById('popupOverlayOLGMC');

openBtnOLGMC.addEventListener('click', () => {
    overlayOLGMC.classList.add('active');
});

closeBtnOLGMC.addEventListener('click', () => {
    overlayOLGMC.classList.remove('active');
});

// Close popup when clicking outside
overlayOLGMC.addEventListener('click', (e) => {
    if(e.target === overlayOLGMC){
        overlayOLGMC.classList.remove('active');
    }
});



const openBtnLNS = document.getElementById('LNS-Btn');
const openBtnLNS1 = document.getElementById('LNS-Btn1');
const closeBtnLNS = document.getElementById('closePopupBtnLNS');
const overlayLNS = document.getElementById('popupOverlayLNS');

openBtnLNS.addEventListener('click', () => {
    overlayLNS.classList.add('active');
});

openBtnLNS1.addEventListener('click', () => {
    overlayLNS.classList.add('active');
});

closeBtnLNS.addEventListener('click', () => {
    overlayLNS.classList.remove('active');
});

// Close popup when clicking outside
overlayLNS.addEventListener('click', (e) => {
    if(e.target === overlayLNS){
        overlayLNS.classList.remove('active');
    }
});


const openBtnMAP = document.getElementById('MAP-Btn');
const closeBtnMAP = document.getElementById('closePopupBtnMap');
const overlayMAP = document.getElementById('popupOverlayMap');

openBtnMAP.addEventListener('click', () => {
    overlayMAP.classList.add('active');
});

closeBtnMAP.addEventListener('click', () => {
    overlayMAP.classList.remove('active');
});

// Close popup when clicking outside
overlayMAP.addEventListener('click', (e) => {
    if(e.target === overlayMAP){
        overlayMAP.classList.remove('active');
    }
});


const hamburger = document.getElementById('hamburger');
const overlayMenuHMB = document.getElementById('overlayMenuHmb');
const hmbCloseBtn = document.getElementById('closeBtnHmb');

hamburger.addEventListener('click', () => {
    overlayMenuHMB.classList.add('active');
});

hmbCloseBtn.addEventListener('click', () => {
    overlayMenuHMB.classList.remove('active');
});

// Close overlay when clicking on a link
document.querySelectorAll('.overlay-link').forEach(link => {
    link.addEventListener('click', () => {
        overlayMenuHMB.classList.remove('active');
    });
});


document.addEventListener("DOMContentLoaded", () => {
  // Animate elements already in view on load
  animateOnScroll();

  // Animate on scroll
  window.addEventListener("scroll", animateOnScroll);
});

function animateOnScroll() {
  const elements = document.querySelectorAll(".animate");
  const triggerBottom = window.innerHeight * 0.85; // trigger before fully in view

  elements.forEach(el => {
    const elTop = el.getBoundingClientRect().top;

    if (elTop < triggerBottom) {
      el.classList.add("show");
    }
  });
}


const openBtnRSVP = document.getElementById('RSVP-Btn');
const openBtnRSVP1 = document.getElementById('RSVP-Btn1');
const closeBtnRSVP = document.getElementById('closePopupBtnRSVP');
const overlayRSVP = document.getElementById('popupOverlayRSVP');

openBtnRSVP.addEventListener('click', () => {
    overlayRSVP.classList.add('active');
});

openBtnRSVP1.addEventListener('click', () => {
    overlayRSVP.classList.add('active');
});

closeBtnRSVP.addEventListener('click', () => {
    overlayRSVP.classList.remove('active');
});

// Close popup when clicking outside
overlayRSVP.addEventListener('click', (e) => {
    if(e.target === overlayRSVP){
        overlayRSVP.classList.remove('active');
    }
});

function validateForm(data) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[0-9+\-()\s]{7,}$/;

  if (!emailRegex.test(data.email)) {
    showToast("Please enter a valid email.");
    return false;
  }

  if (!phoneRegex.test(data.phone)) {
    showToast("Please enter a valid phone number.");
    return false;
  }

  return true;
}

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}

function closeRSVPPopup() {
    overlayRSVP.classList.remove('active');
}

document.getElementById("rsvpForm").addEventListener("submit", function (e) {
  e.preventDefault();

  if (!this.checkValidity()) {
    alert("Please fill out all required fields correctly.");
    return;
  }

  const data = {
    firstName: this.querySelector("[name='entry.1498135098']").value,
    lastName: this.querySelector("[name='entry.1003015547']").value,
    email: this.querySelector("[name='entry.197201715']").value,
    phone: this.querySelector("[name='entry.469976415']").value,
    attending: this.querySelector("[name='entry.877086558']:checked")?.value,
    number: this.querySelector("[name='entry.818477210']:checked")?.value,
    guests: this.querySelector("[name='entry.1890199750']:checked")?.value,
  };

  // Validate email + phone
  if (!validateForm(data)) return;

  // Submit form to Google Form
  this.submit();

  // Auto close popup after slight delay
  setTimeout(() => {
    showToast("Thank you! Your RSVP has been submitted.");
    closeRSVPPopup();
    this.reset();
  }, 700);
});




