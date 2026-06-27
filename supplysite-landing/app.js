/* ----------------------------------------------------
   SITESUPPLY: PREMIUM CONVERSION ENGINE (app.js)
   Vanilla JS, Zero Dependencies, Core Web Vitals Focus
---------------------------------------------------- */

// 1. Configuration Constants
const WHATSAPP_PHONE = '917348481111';

// 2. Component Initializers

/**
 * High-Performance Tab Switcher for Product Showcase
 */
/**
 * B2B Promotional Popup Modal Controller
 * Displays once per session with a 1.5s delay.
 * Implements light-dismiss click outside and close button handling.
 */
function initPromoPopup() {
  const dialog = document.getElementById('promo-popup');
  const closeBtn = document.getElementById('close-promo-btn');
  if (!dialog || !closeBtn) return;

  // Check if shown in current session
  if (!sessionStorage.getItem('promo_popup_shown')) {
    setTimeout(() => {
      dialog.showModal();
      sessionStorage.setItem('promo_popup_shown', 'true');
    }, 1500);
  }

  // Close button click
  closeBtn.addEventListener('click', () => {
    dialog.close();
  });

  // Light-dismiss click outside dialog content
  dialog.addEventListener('click', (event) => {
    const rect = dialog.getBoundingClientRect();
    const isInDialog = (
      rect.top <= event.clientY &&
      event.clientY <= rect.top + rect.height &&
      rect.left <= event.clientX &&
      event.clientX <= rect.left + rect.width
    );
    if (!isInDialog) {
      dialog.close();
    }
  });
}


/**
 * Accordion Handler for Frequently Asked Questions
 */
function initFaqs() {
  const faqHeaders = document.querySelectorAll('.faq-header');

  faqHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const item = header.closest('.faq-item');
      const body = item.querySelector('.faq-body');
      const isActive = item.classList.contains('active');

      // Close all other active accordions
      document.querySelectorAll('.faq-item').forEach(otherItem => {
        if (otherItem !== item && otherItem.classList.contains('active')) {
          otherItem.classList.remove('active');
          otherItem.querySelector('.faq-body').style.maxHeight = null;
        }
      });

      // Toggle the clicked accordion
      if (isActive) {
        item.classList.remove('active');
        body.style.maxHeight = null;
      } else {
        item.classList.add('active');
        // Calculate container height dynamically for smooth native CSS transition
        body.style.maxHeight = `${body.scrollHeight}px`;
      }
    });
  });
}

/**
 * Pre-filled Dynamic WhatsApp URL Generator
 * Integrates site metadata and product selections.
 * Resolves link values on load and change to bypass flaky click-time overrides.
 */
function initWhatsAppTracking() {
  const whatsappButtons = document.querySelectorAll('[data-wa-type]');
  console.log(`SiteSupply: Found ${whatsappButtons.length} WhatsApp buttons`);
  if (!whatsappButtons.length) return;

  function updateWhatsAppLinks() {
    console.log("SiteSupply: updateWhatsAppLinks called");
    whatsappButtons.forEach(button => {
      const type = button.getAttribute('data-wa-type');
      let message = '';

      if (type === 'hero') {
        const materialSelect = document.getElementById('hero-material-select');
        const selectedVal = materialSelect ? materialSelect.value : 'Cement & Saria';
        message = `Hi SiteSupply, I'm landing from Google Ads. I would like to get today's wholesale price list for ${selectedVal} in my area. Please send the pricing.`;
      } else if (type === 'card') {
        const brand = button.getAttribute('data-wa-brand') || 'Construction Material';
        message = `Hi SiteSupply, I want to inquire about wholesale rates for ${brand}. Please share details, stock status, and delivery schedules.`;
      } else if (type === 'sticky') {
        message = `Hi SiteSupply, I am at a construction site in the Lucknow/Azamgarh region. I want to inquire about wholesale rates for Cement & TMT Saria.`;
      } else if (type === 'final') {
        message = `Hi SiteSupply, I want to discuss a bulk purchase of Cement & TMT Saria. Please connect me with a commercial sales representative.`;
      } else {
        message = `Hi SiteSupply, I am looking for a quote on building construction materials.`;
      }

      const targetUrl = `https://api.whatsapp.com/send/?phone=${WHATSAPP_PHONE}&text=${encodeURIComponent(message)}&type=phone_number&app_absent=0`;
      console.log(`SiteSupply: Setting ${type} WhatsApp URL to ${targetUrl}`);
      button.setAttribute('href', targetUrl);
    });
  }

  // Run initial mapping
  updateWhatsAppLinks();

  // Re-run mapping for hero action when selection changes
  const materialSelect = document.getElementById('hero-material-select');
  if (materialSelect) {
    materialSelect.addEventListener('change', updateWhatsAppLinks);
  }
}

/**
 * Callback Form Handler
 * Validates, compiles form data, and redirect/fallbacks smoothly
 */
function initCallbackForm() {
  const form = document.getElementById('callback-form-element');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameInput = document.getElementById('hero-name-input');
    const phoneInput = document.getElementById('hero-phone-input');
    const materialSelect = document.getElementById('hero-material-select');

    const name = nameInput ? nameInput.value.trim() : '';
    const phone = phoneInput ? phoneInput.value.trim() : '';
    const material = materialSelect ? materialSelect.value : 'Cement & TMT Saria';

    if (!name || !phone) {
      alert('Please fill out all required fields.');
      return;
    }

    // High conversion path: Redirect to WhatsApp with filled details as fallback/confirmation
    const textMessage = `Hi SiteSupply, I've requested a callback via your website.\n\n*Name:* ${name}\n*Phone:* ${phone}\n*Material Needed:* ${material}\n\nPlease contact me at your earliest convenience with pricing details.`;
    const targetUrl = `https://api.whatsapp.com/send/?phone=${WHATSAPP_PHONE}&text=${encodeURIComponent(textMessage)}&type=phone_number&app_absent=0`;

    // Visual loading state
    const submitBtn = form.querySelector('.btn-form-submit');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Redirecting to WhatsApp...';
    submitBtn.disabled = true;

    setTimeout(() => {
      window.location.href = targetUrl;
      // Restore state after a short delay in case user navigates back
      setTimeout(() => {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        form.reset();
      }, 1000);
    }, 400);
  });
}

// 3. Execution Starter Block
function initAll() {
  console.log("SiteSupply: initAll started");
  initPromoPopup();
  initFaqs();
  initWhatsAppTracking();
  initCallbackForm();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAll);
} else {
  initAll();
}
