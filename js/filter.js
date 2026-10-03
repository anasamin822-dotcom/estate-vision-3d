/**
 * EstateVision 3D - Property Filter & Listing Engine
 * Handles dynamic property search, category filters, and DOM card generation
 */

const PropertyEngine = (function() {
  'use strict';

  // Curated Luxury Properties Database
  const propertiesData = [
    {
      id: 'prop-1',
      title: 'The Horizon Monolith',
      type: 'Luxury Villa',
      location: 'Beverly Hills',
      locationFull: 'Beverly Hills, CA',
      price: 18500000,
      priceFormatted: '$18,500,000',
      beds: 6,
      baths: 8,
      sqft: '11,400',
      year: 2025,
      image: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80',
      description: 'Suspended over the Los Angeles basin, this monolithic glass-and-titanium residence features a 120ft cantilevered infinity pool, private helipad rights, and biometric wellness suites.',
      isFeatured: true
    },
    {
      id: 'prop-2',
      title: 'Aura Sky Penthouse',
      type: '4 BHK Penthouse',
      location: 'Manhattan',
      locationFull: 'Manhattan, NY',
      price: 14200000,
      priceFormatted: '$14,200,000',
      beds: 4,
      baths: 5,
      sqft: '7,850',
      year: 2024,
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
      description: 'Crown jewel of Central Park South. Dual-level penthouse with 360-degree panoramic skyline terraces, private elevator access, and museum-grade climate control.',
      isFeatured: true
    },
    {
      id: 'prop-3',
      title: 'Mirage Desert Sanctuary',
      type: 'Luxury Villa',
      location: 'Dubai Marina',
      locationFull: 'Dubai Marina, UAE',
      price: 9800000,
      priceFormatted: '$9,800,000',
      beds: 5,
      baths: 6,
      sqft: '9,200',
      year: 2025,
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      description: 'Ultra-contemporary waterfront villa with private yacht dockage, sunken lounge firepits, and floor-to-ceiling smart glass with solar tint responsiveness.',
      isFeatured: false
    },
    {
      id: 'prop-4',
      title: 'Alpine Glass Chalet',
      type: '3 BHK',
      location: 'Swiss Alps',
      locationFull: 'Swiss Alps, Switzerland',
      price: 12400000,
      priceFormatted: '$12,400,000',
      beds: 3,
      baths: 4,
      sqft: '6,100',
      year: 2024,
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
      description: 'Ski-in ski-out luxury chalet engineered with sustainable geothermal warmth, heated stone terraces, and frameless views of the Matterhorn peaks.',
      isFeatured: false
    },
    {
      id: 'prop-5',
      title: 'Oceanfront Pavilion',
      type: 'Luxury Villa',
      location: 'Miami Beach',
      locationFull: 'Miami Beach, FL',
      price: 22000000,
      priceFormatted: '$22,000,000',
      beds: 7,
      baths: 9,
      sqft: '14,000',
      year: 2026,
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
      description: 'Gated private peninsula estate offering 200 feet of pristine direct ocean frontage, dual guest casitas, spa pavilion, and 12-car subterranean gallery.',
      isFeatured: true
    },
    {
      id: 'prop-6',
      title: 'The Luminar Suite',
      type: '2 BHK',
      location: 'Manhattan',
      locationFull: 'Tribeca, NY',
      price: 4600000,
      priceFormatted: '$4,600,000',
      beds: 2,
      baths: 3,
      sqft: '3,200',
      year: 2025,
      image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80',
      description: 'Boutique architectural loft in historic Tribeca, custom Italian marble kitchen, soaring 14-foot timber-beamed ceilings, and integrated acoustic dampening.',
      isFeatured: false
    }
  ];

  let gridContainer, searchInput, clearBtn, locationSelect, bhkSelect, priceSelect;
  let emptyNotice, resultsCountLabel, tagsContainer;
  const likedProperties = new Set();

  function init() {
    gridContainer = document.getElementById('propertiesGrid');
    searchInput = document.getElementById('propertySearchInput');
    clearBtn = document.getElementById('searchClearBtn');
    locationSelect = document.getElementById('filterLocationSelect');
    bhkSelect = document.getElementById('filterBhkSelect');
    priceSelect = document.getElementById('filterPriceSelect');
    emptyNotice = document.getElementById('emptyResultsNotice');
    resultsCountLabel = document.getElementById('resultsCountLabel');
    tagsContainer = document.getElementById('activeFilterTags');

    if (!gridContainer) return;

    bindEvents();
    renderFilteredProperties();
  }

  function bindEvents() {
    searchInput.addEventListener('input', () => {
      clearBtn.classList.toggle('active', searchInput.value.trim().length > 0);
      renderFilteredProperties();
    });

    clearBtn.addEventListener('click', () => {
      searchInput.value = '';
      clearBtn.classList.remove('active');
      renderFilteredProperties();
    });

    locationSelect.addEventListener('change', renderFilteredProperties);
    bhkSelect.addEventListener('change', renderFilteredProperties);
    priceSelect.addEventListener('change', renderFilteredProperties);

    const resetFiltersBtn = document.getElementById('resetFiltersBtn');
    if (resetFiltersBtn) {
      resetFiltersBtn.addEventListener('click', resetAllFilters);
    }

    const emptyResetBtn = document.getElementById('emptyResetBtn');
    if (emptyResetBtn) {
      emptyResetBtn.addEventListener('click', resetAllFilters);
    }

    // Event Delegation on Properties Grid
    gridContainer.addEventListener('click', handleGridClicks);
  }

  function resetAllFilters() {
    searchInput.value = '';
    clearBtn.classList.remove('active');
    locationSelect.value = 'all';
    bhkSelect.value = 'all';
    priceSelect.value = 'all';
    renderFilteredProperties();
  }

  function getFilteredList() {
    const term = searchInput.value.toLowerCase().trim();
    const loc = locationSelect.value;
    const bhk = bhkSelect.value;
    const priceRange = priceSelect.value;

    return propertiesData.filter(item => {
      // Search term
      if (term) {
        const matchesTerm = 
          item.title.toLowerCase().includes(term) ||
          item.locationFull.toLowerCase().includes(term) ||
          item.type.toLowerCase().includes(term);
        if (!matchesTerm) return false;
      }

      // Location
      if (loc !== 'all' && item.location !== loc) {
        return false;
      }

      // Configuration / BHK
      if (bhk !== 'all' && item.type !== bhk) {
        return false;
      }

      // Price Bracket
      if (priceRange === 'under-5m' && item.price >= 5000000) return false;
      if (priceRange === '5m-15m' && (item.price < 5000000 || item.price > 15000000)) return false;
      if (priceRange === '15m-plus' && item.price <= 15000000) return false;

      return true;
    });
  }

  function renderFilteredProperties() {
    const filtered = getFilteredList();
    gridContainer.innerHTML = '';

    updateActiveTags();

    if (filtered.length === 0) {
      emptyNotice.classList.add('active');
      resultsCountLabel.textContent = '0 residences match your criteria';
      return;
    }

    emptyNotice.classList.remove('active');
    resultsCountLabel.textContent = `Showing ${filtered.length} of ${propertiesData.length} curated residences`;

    filtered.forEach(prop => {
      const isLiked = likedProperties.has(prop.id);
      const card = document.createElement('article');
      card.className = 'property-card';
      card.dataset.id = prop.id;

      card.innerHTML = `
        <div class="property-thumb-wrapper">
          <img src="${prop.image}" alt="${prop.title}" class="property-img" loading="lazy">
          <span class="property-badge-type">${prop.type}</span>
          <button type="button" class="property-like-btn ${isLiked ? 'liked' : ''}" data-action="like" data-id="${prop.id}" aria-label="Save Property">
            <i class="fa-${isLiked ? 'solid' : 'regular'} fa-heart"></i>
          </button>
        </div>
        <div class="property-content">
          <div class="property-location">
            <i class="fa-solid fa-location-dot"></i>
            <span>${prop.locationFull}</span>
          </div>
          <h3 class="property-title">${prop.title}</h3>
          <div class="property-meta-row">
            <div class="property-meta-item">
              <i class="fa-solid fa-bed"></i>
              <span>${prop.beds} Beds</span>
            </div>
            <div class="property-meta-item">
              <i class="fa-solid fa-bath"></i>
              <span>${prop.baths} Baths</span>
            </div>
            <div class="property-meta-item">
              <i class="fa-solid fa-ruler-combined"></i>
              <span>${prop.sqft} sq ft</span>
            </div>
          </div>
          <div class="property-footer-row">
            <div class="property-price-wrap">
              <span class="price-caption">Investment Value</span>
              <span class="property-price">${prop.priceFormatted}</span>
            </div>
            <button type="button" class="btn btn-primary property-view-btn" data-action="tour" data-id="${prop.id}">
              <span>View Tour</span>
              <i class="fa-solid fa-arrow-up-right-from-square"></i>
            </button>
          </div>
        </div>
      `;

      gridContainer.appendChild(card);
    });

    if (window.AnimationEngine && window.AnimationEngine.setupMagneticNavHover) {
      window.AnimationEngine.setupMagneticNavHover(gridContainer);
    }
  }

  function updateActiveTags() {
    tagsContainer.innerHTML = '';
    const activeFilters = [];

    if (searchInput.value.trim()) activeFilters.push(`"${searchInput.value.trim()}"`);
    if (locationSelect.value !== 'all') activeFilters.push(locationSelect.value);
    if (bhkSelect.value !== 'all') activeFilters.push(bhkSelect.value);
    if (priceSelect.value !== 'all') {
      const labels = {
        'under-5m': '< $5M',
        '5m-15m': '$5M - $15M',
        '15m-plus': '$15M+'
      };
      activeFilters.push(labels[priceSelect.value] || priceSelect.value);
    }

    activeFilters.forEach(tag => {
      const span = document.createElement('span');
      span.className = 'tag-item';
      span.innerHTML = `<i class="fa-solid fa-tag"></i> ${tag}`;
      tagsContainer.appendChild(span);
    });
  }

  function handleGridClicks(e) {
    const likeBtn = e.target.closest('[data-action="like"]');
    if (likeBtn) {
      const propId = likeBtn.dataset.id;
      if (likedProperties.has(propId)) {
        likedProperties.delete(propId);
        likeBtn.classList.remove('liked');
        likeBtn.innerHTML = '<i class="fa-regular fa-heart"></i>';
        if (window.App && window.App.showToast) {
          window.App.showToast('Removed from Shortlist', 'Residence removed from saved portfolio.');
        }
      } else {
        likedProperties.add(propId);
        likeBtn.classList.add('liked');
        likeBtn.innerHTML = '<i class="fa-solid fa-heart"></i>';
        if (window.App && window.App.showToast) {
          window.App.showToast('Added to Shortlist', 'Residence added to your VIP selection.');
        }
      }
      return;
    }

    const tourBtn = e.target.closest('[data-action="tour"]');
    if (tourBtn) {
      const propId = tourBtn.dataset.id;
      const property = propertiesData.find(p => p.id === propId);
      if (property && window.App && window.App.openTourModal) {
        window.App.openTourModal(property);
      }
    }
  }

  return {
    init: init,
    getAllProperties: () => propertiesData,
    getPropertyById: id => propertiesData.find(p => p.id === id)
  };
})();

document.addEventListener('DOMContentLoaded', () => {
  PropertyEngine.init();
});
