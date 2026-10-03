/**
 * EstateVision 3D - Main App Coordinator & UI Controller
 * Manages modals, booking form validation, mobile navigation, toast messages & hotspots
 */

const App = (function() {
  'use strict';

  // Modal elements
  let tourModal, closeTourModalBtn, modalFeaturedImage, modalPropertyTitle;
  let modalPropertyPrice, modalPropertyLocation, modalPropertyBeds, modalPropertyBaths;
  let modalPropertyArea, modalPropertyYear, modalPropertyDescription;
  let modalBookNowBtn, modalExplore3DBtn;

  // Toast elements
  let toastNotification, toastTitle, toastMessage, toastCloseBtn, toastTimer;

  // Booking Form & Navigation elements
  let bookingForm, mobileMenuToggle, navMenu;

  function init() {
    cacheDOMElements();
    bindEvents();
    setupThemeToggle();
    setupSmoothScrollSpy();
    setupHotspots();
    setMinBookingDate();
  }

  function cacheDOMElements() {
    tourModal = document.getElementById('tourModal');
    closeTourModalBtn = document.getElementById('closeTourModalBtn');
    modalFeaturedImage = document.getElementById('modalFeaturedImage');
    modalPropertyTitle = document.getElementById('modalPropertyTitle');
    modalPropertyPrice = document.getElementById('modalPropertyPrice');
    modalPropertyLocation = document.getElementById('modalPropertyLocation');
    modalPropertyBeds = document.getElementById('modalPropertyBeds');
    modalPropertyBaths = document.getElementById('modalPropertyBaths');
    modalPropertyArea = document.getElementById('modalPropertyArea');
    modalPropertyYear = document.getElementById('modalPropertyYear');
    modalPropertyDescription = document.getElementById('modalPropertyDescription');
    modalBookNowBtn = document.getElementById('modalBookNowBtn');
    modalExplore3DBtn = document.getElementById('modalExplore3DBtn');

    toastNotification = document.getElementById('toastNotification');
    toastTitle = document.getElementById('toastTitle');
    toastMessage = document.getElementById('toastMessage');
    toastCloseBtn = document.getElementById('toastCloseBtn');

    bookingForm = document.getElementById('bookingForm');
    mobileMenuToggle = document.getElementById('mobileMenuToggle');
    navMenu = document.getElementById('navMenu');
  }

  function bindEvents() {
    // Modal Close
    if (closeTourModalBtn) {
      closeTourModalBtn.addEventListener('click', closeTourModal);
    }

    if (tourModal) {
      tourModal.addEventListener('click', (e) => {
        if (e.target === tourModal) closeTourModal();
      });
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && tourModal && tourModal.classList.contains('active')) {
        closeTourModal();
      }
    });

    // Modal Action Buttons
    if (modalBookNowBtn) {
      modalBookNowBtn.addEventListener('click', () => {
        closeTourModal();
        const contactSection = document.getElementById('contact');
        if (contactSection) {
          contactSection.scrollIntoView({ behavior: 'smooth' });
        }
      });
    }

    if (modalExplore3DBtn) {
      modalExplore3DBtn.addEventListener('click', () => {
        closeTourModal();
        const heroSection = document.getElementById('hero');
        if (heroSection) {
          heroSection.scrollIntoView({ behavior: 'smooth' });
        }
        if (window.ThreeScene && window.ThreeScene.resetCamera) {
          window.ThreeScene.resetCamera();
        }
        showToast('3D Viewport Synchronized', 'Model view centered on selected architectural specs.');
      });
    }

    // Open booking from navbar
    const openBookingBtn = document.getElementById('openBookingBtn');
    if (openBookingBtn) {
      openBookingBtn.addEventListener('click', () => {
        const contactSection = document.getElementById('contact');
        if (contactSection) {
          contactSection.scrollIntoView({ behavior: 'smooth' });
        }
      });
    }

    // Mobile Navigation Toggle
    if (mobileMenuToggle && navMenu) {
      mobileMenuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('open');
      });

      // Close mobile menu on link click
      navMenu.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
          navMenu.classList.remove('open');
        });
      });
    }

    // Toast Close Button
    if (toastCloseBtn) {
      toastCloseBtn.addEventListener('click', hideToast);
    }

    // Booking Form Submission
    if (bookingForm) {
      bookingForm.addEventListener('submit', handleBookingSubmit);
    }
  }

  function setMinBookingDate() {
    const dateInput = document.getElementById('preferredDate');
    if (dateInput) {
      const today = new Date().toISOString().split('T')[0];
      dateInput.min = today;
    }
  }

  function openTourModal(prop) {
    if (!tourModal || !prop) return;

    modalFeaturedImage.src = prop.image;
    modalFeaturedImage.alt = prop.title;
    modalPropertyTitle.textContent = prop.title;
    modalPropertyPrice.textContent = prop.priceFormatted;
    modalPropertyLocation.textContent = prop.locationFull;
    modalPropertyBeds.textContent = `${prop.beds} Bedrooms`;
    modalPropertyBaths.textContent = `${prop.baths} Bathrooms`;
    modalPropertyArea.textContent = `${prop.sqft} Sq Ft`;
    modalPropertyYear.textContent = `Completed ${prop.year}`;
    modalPropertyDescription.textContent = prop.description;

    tourModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeTourModal() {
    if (!tourModal) return;
    tourModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  function showToast(title, message) {
    if (!toastNotification) return;

    if (toastTimer) clearTimeout(toastTimer);

    toastTitle.textContent = title;
    toastMessage.textContent = message;
    toastNotification.classList.add('active');

    toastTimer = setTimeout(() => {
      hideToast();
    }, 4500);
  }

  function hideToast() {
    if (!toastNotification) return;
    toastNotification.classList.remove('active');
  }

  function handleBookingSubmit(e) {
    e.preventDefault();

    const nameInput = document.getElementById('visitorName');
    const emailInput = document.getElementById('visitorEmail');
    const phoneInput = document.getElementById('visitorPhone');
    const dateInput = document.getElementById('preferredDate');

    let isValid = true;

    // Validate Name
    if (!nameInput.value.trim() || nameInput.value.trim().length < 3) {
      showError('feedbackName', 'Please provide your full legal name.');
      isValid = false;
    } else {
      clearError('feedbackName');
    }

    // Validate Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput.value.trim())) {
      showError('feedbackEmail', 'Please enter a valid business or private email address.');
      isValid = false;
    } else {
      clearError('feedbackEmail');
    }

    // Validate Phone
    if (!phoneInput.value.trim() || phoneInput.value.trim().length < 7) {
      showError('feedbackPhone', 'Please enter a valid telephone contact number.');
      isValid = false;
    } else {
      clearError('feedbackPhone');
    }

    // Validate Date
    if (!dateInput.value) {
      showError('feedbackDate', 'Please select a preferred viewing date.');
      isValid = false;
    } else {
      clearError('feedbackDate');
    }

    if (!isValid) return;

    // Submit Simulation
    const submitBtn = document.getElementById('submitBookingBtn');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span>Processing VIP Request...</span> <i class="fa-solid fa-spinner fa-spin"></i>';
    }

    setTimeout(() => {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<span>Confirm VIP Consultation Request</span> <i class="fa-solid fa-paper-plane"></i>';
      }
      bookingForm.reset();
      showToast('VIP Consultation Confirmed', 'A Senior Advisory Partner will reach out within 2 business hours.');
    }, 1200);
  }

  function showError(feedbackId, msg) {
    const el = document.getElementById(feedbackId);
    if (el) {
      el.textContent = msg;
      el.classList.add('visible');
    }
  }

  function clearError(feedbackId) {
    const el = document.getElementById(feedbackId);
    if (el) {
      el.textContent = '';
      el.classList.remove('visible');
    }
  }

  function setupSmoothScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
      let currentSectionId = '';
      const scrollPos = window.scrollY + 120;

      sections.forEach(section => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        if (scrollPos >= top && scrollPos < top + height) {
          currentSectionId = section.getAttribute('id');
        }
      });

      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSectionId}`) {
          link.classList.add('active');
        }
      });
    });
  }

  function setupHotspots() {
    const pins = document.querySelectorAll('.hotspot-pin');
    pins.forEach(pin => {
      pin.addEventListener('click', () => {
        const spotName = pin.dataset.spot;
        showToast('Spatial Highlight', `Inspecting architectural area: ${spotName}`);
      });
    });
  }

  function setupThemeToggle() {
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    // Default to 'light' theme on initial visit
    const savedTheme = localStorage.getItem('estatevision-theme') || 'light';
    setTheme(savedTheme, false);

    if (themeToggleBtn) {
      themeToggleBtn.addEventListener('click', () => {
        const isCurrentLight = document.documentElement.getAttribute('data-theme') === 'light';
        const nextTheme = isCurrentLight ? 'dark' : 'light';
        setTheme(nextTheme, true);
      });
    }
  }

  function setTheme(theme, announce = true) {
    if (theme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('estatevision-theme', 'light');
    } else {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('estatevision-theme', 'dark');
    }

    if (window.ThreeScene && window.ThreeScene.setTheme) {
      window.ThreeScene.setTheme(theme);
    }
    if (window.MortgageCalculator && window.MortgageCalculator.calculate) {
      window.MortgageCalculator.calculate();
    }
    if (announce) {
      showToast(
        theme === 'light' ? 'Light Theme Activated' : 'Dark Theme Activated',
        `Spatial interface switched to ${theme === 'light' ? 'Porcelain Alabaster' : 'Obsidian Luxe'} mode.`
      );
    }
  }

  return {
    init: init,
    openTourModal: openTourModal,
    closeTourModal: closeTourModal,
    showToast: showToast,
    setTheme: setTheme
  };
})();

window.App = App;

document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
