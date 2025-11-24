
/* ===== GALLERY SLIDER ===== */
const images = [
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
];

let current = 0;

const imgA = document.getElementById("galleryImageA");
const imgB = document.getElementById("galleryImageB");

document.querySelector(".prev").onclick = () => change(-1);
document.querySelector(".next").onclick = () => change(1);

let showingA = true;

function change(dir) {
    const next = (current + dir + images.length) % images.length;
    const newSrc = images[next];

    if (showingA) {
        imgB.src = newSrc;
        imgB.classList.add("show");
        imgA.classList.remove("show");
    } else {
        imgA.src = newSrc;
        imgA.classList.add("show");
        imgB.classList.remove("show");
    }

    showingA = !showingA;
    current = next;
}


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

document.getElementById("rsvpForm").addEventListener("submit", function (e) {
  e.preventDefault();

  if (!this.checkValidity()) {
    alert("Please fill out all required fields correctly.");
    return;
  }

  // Collect form data
  const data = {
    firstName: this.firstName.value,
    lastName: this.lastName.value,
    email: this.email.value,
    phone: this.phone.value,
    attending: this.attending.value,
    dietary: this.dietary.value
  };

  console.log("RSVP Submitted:", data);

  // TODO: send to server / Google Sheet / Firebase / email...
  alert("Thank you! Your RSVP has been submitted.");
  this.reset();
});



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

  const data = {
    firstName: this.querySelector("[name='entry.1498135098']").value,
    lastName: this.querySelector("[name='entry.1003015547']").value,
    email: this.querySelector("[name='entry.197201715']").value,
    phone: this.querySelector("[name='entry.469976415']").value,
    attending: this.querySelector("[name='entry.877086558']:checked")?.value,
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