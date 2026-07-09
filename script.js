'use strict';

/**
 * CONFIGURACIÓN PRINCIPAL
 * Reemplaza el valor siguiente por tu HotLink personal de Hotmart.
 * Ejemplo: https://go.hotmart.com/XXXXXXXXX
 */
const AFFILIATE_URL = 'TU_HOTLINK_DE_HOTMART_AQUI';

const isConfigured = /^https:\/\//i.test(AFFILIATE_URL) && !AFFILIATE_URL.includes('TU_HOTLINK');
const affiliateLinks = document.querySelectorAll('.affiliate-link');
const dialog = document.querySelector('#link-dialog');
const dialogClose = document.querySelector('.dialog-close');
const dialogOk = document.querySelector('.dialog-ok');
const menuButton = document.querySelector('.menu-button');
const mainNav = document.querySelector('#main-nav');

function configureAffiliateLinks() {
  affiliateLinks.forEach((link) => {
    if (isConfigured) {
      link.href = AFFILIATE_URL;
      link.target = '_blank';
      link.rel = 'nofollow sponsored noopener';
    } else {
      link.href = '#';
      link.addEventListener('click', (event) => {
        event.preventDefault();
        openLinkDialog();
      });
    }
  });
}

function openLinkDialog() {
  if (!dialog) return;
  if (typeof dialog.showModal === 'function') {
    dialog.showModal();
  } else {
    alert('Falta agregar tu HotLink de Hotmart en script.js.');
  }
}

function closeLinkDialog() {
  if (dialog?.open) dialog.close();
}

function closeMobileMenu() {
  menuButton?.setAttribute('aria-expanded', 'false');
  mainNav?.classList.remove('is-open');
  document.body.classList.remove('menu-open');
}

function setupMobileMenu() {
  if (!menuButton || !mainNav) return;

  menuButton.addEventListener('click', () => {
    const willOpen = menuButton.getAttribute('aria-expanded') !== 'true';
    menuButton.setAttribute('aria-expanded', String(willOpen));
    mainNav.classList.toggle('is-open', willOpen);
    document.body.classList.toggle('menu-open', willOpen);
  });

  mainNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMobileMenu);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMobileMenu();
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 980) closeMobileMenu();
  });
}

function setupAccordion() {
  const items = [...document.querySelectorAll('[data-accordion] details')];
  items.forEach((item) => {
    item.addEventListener('toggle', () => {
      if (!item.open) return;
      items.forEach((other) => {
        if (other !== item) other.open = false;
      });
    });
  });
}

function setupRevealAnimations() {
  const elements = document.querySelectorAll('.reveal');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reducedMotion || !('IntersectionObserver' in window)) {
    elements.forEach((element) => element.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      currentObserver.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px' });

  elements.forEach((element) => observer.observe(element));
}

function setupDialog() {
  dialogClose?.addEventListener('click', closeLinkDialog);
  dialogOk?.addEventListener('click', closeLinkDialog);

  dialog?.addEventListener('click', (event) => {
    if (event.target === dialog) closeLinkDialog();
  });
}

configureAffiliateLinks();
setupMobileMenu();
setupAccordion();
setupRevealAnimations();
setupDialog();
