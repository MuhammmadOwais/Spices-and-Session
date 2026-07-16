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

  // --- Add Micro-animations on card hover ---
  const cards = document.querySelectorAll('.product-card, .blog-card');
  cards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      // Small scale hover effects are handled by CSS, but this is a slot for JS animations
    });
  });

  // --- Live Search Overlay Logic ---
  const searchTrigger = document.querySelector('.search-trigger');
  const searchOverlay = document.getElementById('search-overlay');
  const searchClose = document.getElementById('search-overlay-close');
  const searchInputField = document.getElementById('search-input-field');
  const searchResultsContainer = document.getElementById('search-results-container');
  let searchTimeout = null;

  if (searchTrigger && searchOverlay) {
    searchTrigger.addEventListener('click', (e) => {
      e.preventDefault();
      searchOverlay.classList.add('active');
      setTimeout(() => searchInputField.focus(), 150);
    });
  }

  if (searchClose && searchOverlay) {
    searchClose.addEventListener('click', () => {
      searchOverlay.classList.remove('active');
      searchInputField.value = '';
      searchResultsContainer.innerHTML = '';
    });
  }

  // Close search overlay on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && searchOverlay && searchOverlay.classList.contains('active')) {
      searchOverlay.classList.remove('active');
      searchInputField.value = '';
      searchResultsContainer.innerHTML = '';
    }
  });

  if (searchInputField && searchResultsContainer) {
    searchInputField.addEventListener('input', () => {
      clearTimeout(searchTimeout);
      const query = searchInputField.value.trim();

      if (query.length < 2) {
        searchResultsContainer.innerHTML = '';
        return;
      }

      searchResultsContainer.innerHTML = '<div class="search-loading"><i class="fa-solid fa-circle-notch fa-spin"></i> Sifting catalog...</div>';

      searchTimeout = setTimeout(() => {
        fetch(`/api/search?q=${encodeURIComponent(query)}`)
          .then(res => res.json())
          .then(products => {
            if (products.length === 0) {
              searchResultsContainer.innerHTML = '<div class="search-no-results">No spices found matching your query.</div>';
              return;
            }
            
            let html = '<ul class="search-results-list">';
            products.forEach(product => {
              html += `
                <li class="search-result-item">
                  <a href="/products/${product.slug}" class="search-result-link">
                    <img src="${product.imageUrl}" alt="${product.name}" class="search-result-img">
                    <div class="search-result-details">
                      <span class="search-result-name">${product.name}</span>
                      <span class="search-result-category">${product.category}</span>
                    </div>
                    <span class="search-result-price">$${product.price.toFixed(2)}</span>
                  </a>
                </li>
              `;
            });
            html += '</ul>';
            searchResultsContainer.innerHTML = html;
          })
          .catch(err => {
            console.error('Error executing live search:', err);
            searchResultsContainer.innerHTML = '<div class="search-error">Failed to retrieve results. Please try again.</div>';
          });
      }, 350); // 350ms debounce
    });
  }

  console.log('Spicery Co. UI initialization complete.');
});
