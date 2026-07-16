/* ==========================================================================
   Artisan Spice Co. - Core Web UI Script
   Handles: Mobile Navigation menus, Filter panel triggers, Scroll animations
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // --- Mobile Drawer Elements ---
  const mobileToggle = document.getElementById('mobile-menu-toggle');
  const mobileDrawerClose = document.getElementById('mobile-drawer-close');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const overlay = document.getElementById('site-overlay');

  if (mobileToggle && mobileDrawer && overlay) {
    mobileToggle.addEventListener('click', () => {
      mobileDrawer.classList.add('active');
      overlay.classList.add('active');
    });
  }

  if (mobileDrawerClose && mobileDrawer && overlay) {
    mobileDrawerClose.addEventListener('click', () => {
      mobileDrawer.classList.remove('active');
      overlay.classList.remove('active');
    });
  }

  // --- Shop Catalog Mobile Filter Drawers ---
  const filterToggle = document.getElementById('toggle-sidebar-filters');
  const filterClose = document.getElementById('close-sidebar-filters');
  const filterSidebar = document.getElementById('catalog-sidebar');

  if (filterToggle && filterSidebar && overlay) {
    filterToggle.addEventListener('click', () => {
      filterSidebar.classList.add('active');
      overlay.classList.add('active');
    });
  }

  if (filterClose && filterSidebar && overlay) {
    filterClose.addEventListener('click', () => {
      filterSidebar.classList.remove('active');
      overlay.classList.remove('active');
    });
  }

  // --- Sticky Header Scroll Class addition ---
  const mainHeader = document.querySelector('.main-header');
  if (mainHeader) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        mainHeader.classList.add('scrolled');
      } else {
        mainHeader.classList.remove('scrolled');
      }
    });
  }

  // --- Add Micro-animations on card hover ---
  const cards = document.querySelectorAll('.product-card, .blog-card');
  cards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      // Small scale hover effects are handled by CSS, but this is a slot for JS animations
    });
  });

  console.log('Artisan Spice Co. UI initialization complete.');
});
