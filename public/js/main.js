/* ==========================================================================
   Spicery Co. - Core Web UI Script
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

  // --- Hero Slideshow Cinematic Transitions ---
  const heroSlides = document.querySelectorAll('.hero-slide');
  if (heroSlides.length > 0) {
    let activeSlideIndex = 0;
    setInterval(() => {
      heroSlides[activeSlideIndex].classList.remove('active');
      activeSlideIndex = (activeSlideIndex + 1) % heroSlides.length;
      heroSlides[activeSlideIndex].classList.add('active');
    }, 5000);
  }

  // --- Add Micro-animations on card hover ---
  const cards = document.querySelectorAll('.product-card, .blog-card');
  cards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      // Small scale hover effects are handled by CSS, but this is a slot for JS animations
    });
  });

  // --- Live Search Initialization ---
  function initLiveSearch(inputId, resultsId) {
    const inputField = document.getElementById(inputId);
    const resultsContainer = document.getElementById(resultsId);
    let searchTimeout = null;

    if (!inputField || !resultsContainer) return;

    inputField.addEventListener('input', () => {
      clearTimeout(searchTimeout);
      const query = inputField.value.trim();

      if (query.length < 2) {
        resultsContainer.innerHTML = '';
        resultsContainer.classList.remove('active');
        return;
      }

      resultsContainer.innerHTML = '<div class="search-loading"><i class="fa-solid fa-circle-notch fa-spin"></i> Sifting catalog...</div>';
      resultsContainer.classList.add('active');

      searchTimeout = setTimeout(() => {
        fetch(`/api/search?q=${encodeURIComponent(query)}`)
          .then(res => res.json())
          .then(products => {
            if (products.length === 0) {
              resultsContainer.innerHTML = '<div class="search-no-results">No spices found.</div>';
              return;
            }
            
            let html = '<ul class="search-results-list">';
            products.forEach(product => {
              let thumbUrl = product.imageUrl;
              if (thumbUrl.includes('res.cloudinary.com')) {
                thumbUrl = thumbUrl.replace('/upload/', '/upload/f_auto,q_70,w_80,c_scale/');
              }
              html += `
                <li class="search-result-item">
                  <a href="/products/${product.slug}" class="search-result-link">
                    <img src="${thumbUrl}" alt="${product.name}" class="search-result-img">
                    <div class="search-result-details">
                      <span class="search-result-name">${product.name}</span>
                      <span class="search-result-category">${product.category}</span>
                    </div>
                  </a>
                </li>
              `;
            });
            html += '</ul>';
            resultsContainer.innerHTML = html;
          })
          .catch(err => {
            console.error('Error executing live search:', err);
            resultsContainer.innerHTML = '<div class="search-error">Failed to retrieve results.</div>';
          });
      }, 350); // 350ms debounce
    });

    // Close results dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (!inputField.contains(e.target) && !resultsContainer.contains(e.target)) {
        resultsContainer.innerHTML = '';
        resultsContainer.classList.remove('active');
      }
    });
  }

  // Initialize both desktop and mobile drawer search bars
  initLiveSearch('header-search-input', 'header-search-results');
  initLiveSearch('mobile-search-input', 'mobile-search-results');

  console.log('Spicery Co. UI initialization complete.');
});
