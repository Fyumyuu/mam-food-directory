/* MAM — Makan Area Mahasiswa
   Interaksi halaman menggunakan JavaScript murni.
   Seluruh data tempat makan di bawah adalah data ilustrasi.
*/
(function () {
  "use strict";

  const DEMO = '<p class="demo">Data contoh • bukan informasi tempat sebenarnya</p>';
  const ADDRESS_PLACEHOLDER = 'Gang Contoh No. 01, Area Kampus (bukan lokasi nyata).';

  const PLACES = [
    {
      id: 'warung-nasi-sela',
      name: 'Warung Nasi Sela',
      price: 12000,
      distance: 350,
      hours: '08.00–20.00',
      keywords: 'nasi telur ayam es teh',
      thumbnail: 'Nasi',
      description: 'Nasi hangat, lauk rumahan, dan jeda singkat di sela kuliah.',
      menu: [
        ['Nasi telur', 12000],
        ['Nasi ayam', 16000],
        ['Es teh', 4000]
      ]
    },
    {
      id: 'dapur-rantau',
      name: 'Dapur Rantau',
      price: 15000,
      distance: 600,
      hours: '10.00–21.00',
      keywords: 'nasi ayam',
      thumbnail: 'Nasi ayam',
      description: 'Contoh tempat makan di sekitar kampus.',
      menu: [['Nasi ayam', 15000]]
    },
    {
      id: 'kedai-mie-teduh',
      name: 'Kedai Mie Teduh',
      price: 14000,
      distance: 450,
      hours: '09.00–20.00',
      keywords: 'mie mi ayam',
      thumbnail: 'Mie ayam',
      description: 'Contoh tempat makan di sekitar kampus.',
      menu: [['Mie ayam', 14000]]
    }
  ];

  const state = {
    query: '',
    minPrice: '',
    maxPrice: '',
    detailReturn: '#'
  };

  const app = document.querySelector('#app');
  const navExplore = document.querySelector('#nav-jelajah');

  const ICON = {
    search: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="11" cy="11" r="7"></circle><path d="m20 20-4-4"></path></svg>',
    sliders: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M4 7h10M18 7h2M4 17h2M10 17h10"></path><circle cx="16" cy="7" r="2"></circle><circle cx="8" cy="17" r="2"></circle></svg>',
    pin: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#D77950" stroke-width="1.8" aria-hidden="true"><path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21z"></path><circle cx="12" cy="9.5" r="2.5"></circle></svg>',
    back: '<span aria-hidden="true">←</span>'
  };

  function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, function (character) {
      return {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
      }[character];
    });
  }

  function formatRupiah(value) {
    return 'Rp' + Number(value).toLocaleString('id-ID');
  }

  function onlyDigits(value) {
    return String(value).replace(/\D/g, '');
  }

  function getPlace(id) {
    return PLACES.find(function (place) {
      return place.id === id;
    });
  }

  function isPriceRangeValid() {
    if (!state.minPrice || !state.maxPrice) return true;
    return Number(state.minPrice) <= Number(state.maxPrice);
  }

  function getMatchingPlaces() {
    if (!isPriceRangeValid()) return [];

    const query = state.query.trim().toLowerCase();
    const minimum = state.minPrice ? Number(state.minPrice) : 0;
    const maximum = state.maxPrice ? Number(state.maxPrice) : Infinity;

    return PLACES.filter(function (place) {
      const searchableText = (place.name + ' ' + place.keywords).toLowerCase();
      const matchesQuery = !query || searchableText.includes(query);
      const matchesPrice = place.price >= minimum && place.price <= maximum;
      return matchesQuery && matchesPrice;
    }).sort(function (a, b) {
      return a.distance - b.distance;
    });
  }

  function getRangeLabel() {
    if (state.minPrice && state.maxPrice) {
      return formatRupiah(state.minPrice) + '–' + formatRupiah(state.maxPrice);
    }
    if (state.maxPrice) return '≤ ' + formatRupiah(state.maxPrice);
    if (state.minPrice) return '≥ ' + formatRupiah(state.minPrice);
    return '';
  }

  function backButton(fallbackHash) {
    return '<button class="back" type="button" data-back="' + escapeHTML(fallbackHash) + '">' + ICON.back + ' Kembali</button>';
  }

  function searchBox(value, inputId, compact) {
    return '<form class="search' + (compact ? ' search--compact' : '') + '" role="search" data-search-form>' +
      '<label for="' + inputId + '">' + ICON.search +
      '<span class="visually-hidden">Cari makanan atau tempat</span>' +
      '<input id="' + inputId + '" name="q" type="search" maxlength="60" autocomplete="off" placeholder="Cari makanan atau tempat" value="' + escapeHTML(value) + '">' +
      '</label>' +
      (compact ? '' : '<a class="ibtn" href="#cari" aria-label="Buka filter anggaran">' + ICON.sliders + '</a>') +
      '</form>';
  }

  function placeCard(place, showThumbnail, returnHash) {
    const thumbnail = showThumbnail
      ? '<div class="thumb" aria-hidden="true">' + escapeHTML(place.thumbnail) + '</div>'
      : '';

    return '<a class="place" href="#tempat/' + encodeURIComponent(place.id) + '" data-return-to="' + escapeHTML(returnHash) + '">' +
      thumbnail +
      '<div class="info"><h3>' + escapeHTML(place.name) + '</h3>' +
      '<p class="price">Mulai ' + formatRupiah(place.price) + ' · ' + place.distance + ' m</p>' +
      '<p>Buka ' + escapeHTML(place.hours) + '</p></div>' +
      '<span class="go" aria-hidden="true">↗</span>' +
      '</a>';
  }

  const views = {};

  views.home = function () {
    const featuredPlace = PLACES[0];
    const otherPlaces = PLACES.slice(1);

    return '<div class="home"><section aria-labelledby="home-title">' +
      DEMO +
      '<h1 id="home-title" tabindex="-1">Mau makan apa hari ini?</h1>' +
      '<p class="lead">Temukan tempat makan di sekitar kampus.</p>' +
      searchBox(state.query, 'q-home', false) +
      '<div class="photo" role="img" aria-label="Placeholder foto makanan"><small>FOTO MAKANAN</small><b>Nasi &amp; lauk rumahan</b><i>Placeholder foto • dapat diganti</i></div>' +
      '</section><section aria-label="Pilihan tempat makan">' +
      placeCard(featuredPlace, false, '#') +
      '<h2 class="sec">Masih di sekitar sini</h2>' +
      otherPlaces.map(function (place) {
        return placeCard(place, true, '#');
      }).join('') +
      '<p class="tag">Makan enak, nggak perlu jauh-jauh.</p>' +
      '</section></div>';
  };

  views.cari = function () {
    const quickRanges = [
      { label: 'Semua harga', min: '', max: '' },
      { label: '≤ Rp15.000', min: '', max: '15000' },
      { label: 'Rp10.000–18.000', min: '10000', max: '18000' },
      { label: 'Rp18.000–25.000', min: '18000', max: '25000' }
    ];
    const matches = getMatchingPlaces();
    const preview = matches[0] ? placeCard(matches[0], false, '#cari') : '';

    return backButton('#') + DEMO +
      '<h1 tabindex="-1">Cari yang pas.</h1>' +
      '<p class="lead">Pas di selera, pas di kantong.</p>' +
      searchBox(state.query, 'q-cari', true) +
      '<div class="row"><h2>Anggaran makan</h2><button class="link" type="button" data-reset>Reset</button></div>' +
      '<div class="field price-fields">' +
        '<label for="min-price">Harga minimum<span class="box">Rp<input id="min-price" inputmode="numeric" autocomplete="off" value="' + (state.minPrice ? Number(state.minPrice).toLocaleString('id-ID') : '') + '" placeholder="0"></span></label>' +
        '<label for="max-price">Harga maksimum<span class="box">Rp<input id="max-price" inputmode="numeric" autocomplete="off" value="' + (state.maxPrice ? Number(state.maxPrice).toLocaleString('id-ID') : '') + '" placeholder="Tanpa batas"></span></label>' +
      '</div>' +
      '<p class="field-error" id="price-error" role="alert" hidden>Harga minimum tidak boleh lebih besar daripada harga maksimum.</p>' +
      '<p class="hint">Berdasarkan harga makanan termurah.</p>' +
      '<div class="chips" role="group" aria-label="Pilihan cepat kisaran harga">' +
        quickRanges.map(function (range) {
          const selected = state.minPrice === range.min && state.maxPrice === range.max;
          return '<button class="chip" type="button" data-min="' + range.min + '" data-max="' + range.max + '" aria-pressed="' + selected + '">' + range.label + '</button>';
        }).join('') +
      '</div>' +
      '<p class="hint hint--spaced" id="count" role="status">' + matches.length + ' tempat cocok · pratinjau</p>' +
      '<div id="preview">' + preview + '</div>' +
      '<div class="apply-wrap"><button class="btn" type="button" data-apply id="apply">Terapkan Filter · ' + matches.length + ' tempat <span aria-hidden="true">→</span></button></div>';
  };

  views.hasil = function () {
    const matches = getMatchingPlaces();
    const range = getRangeLabel();
    const heading = state.query.trim()
      ? 'Ada ' + escapeHTML(state.query.trim()) + ' di dekatmu.'
      : 'Tempat makan di dekatmu.';
    const filterSummary = range
      ? '<div class="row filter-summary"><span class="chip on filter-chip">' + escapeHTML(range) +
        '<button class="back" type="button" data-clear-price aria-label="Hapus filter harga">×</button></span>' +
        '<button class="link" type="button" data-clear-price>Hapus filter</button></div>'
      : '';
    const listing = matches.length
      ? matches.map(function (place, index) {
          return placeCard(place, index > 0, '#hasil');
        }).join('')
      : '<div class="empty"><h2>Belum ada yang cocok.</h2><p class="lead">Coba ubah kata pencarian atau kisaran harganya.</p><button class="link" type="button" data-clear-all>Tampilkan semua tempat</button></div>';

    return backButton('#cari') + DEMO +
      '<h1 tabindex="-1">' + heading + '</h1>' +
      '<div class="search-space"></div>' +
      searchBox(state.query, 'q-hasil', false) +
      filterSummary +
      '<div class="row result-summary"><b role="status">' + matches.length + ' tempat ditemukan</b><span>Terdekat dulu</span></div>' +
      listing +
      '<p class="notice"><span aria-hidden="true">ⓘ</span><span>Harga menunjukkan menu makanan termurah, belum termasuk minuman.</span></p>';
  };

  views.tempat = function (id) {
    const place = getPlace(id);
    if (!place) return views.notfound();

    const menuItems = place.menu.map(function (item) {
      return '<li><span>' + escapeHTML(item[0]) + '</span><b>' + formatRupiah(item[1]) + '</b></li>';
    }).join('');

    return backButton(state.detailReturn) + DEMO +
      '<div class="photo" role="img" aria-label="Placeholder foto makanan"><small>FOTO MAKANAN</small><b>Nasi &amp; lauk rumahan</b><i>Placeholder foto • dapat diganti</i></div>' +
      '<h1 class="detail-title" tabindex="-1">' + escapeHTML(place.name) + '</h1>' +
      '<p class="lead detail-description">' + escapeHTML(place.description) + '</p>' +
      '<dl class="facts"><div><dt>Jam buka–tutup</dt><dd>' + escapeHTML(place.hours) + '</dd></div><div><dt>Dari kampus</dt><dd>± ' + place.distance + ' m</dd></div></dl>' +
      '<p class="demo address-note">Alamat placeholder: ' + ADDRESS_PLACEHOLDER + '</p>' +
      '<a class="btn" href="#peta/' + encodeURIComponent(place.id) + '">Lihat lokasi &amp; arah <span aria-hidden="true">↗</span></a>' +
      '<div class="row menu-heading"><h2>Di menunya</h2><span class="supporting-label">Harga contoh</span></div>' +
      '<ul class="menu">' + menuItems + '</ul>' +
      '<section class="review" aria-label="Ulasan mahasiswa"><b>Ulasan</b><p class="review-status">Belum ada ulasan yang tersedia untuk contoh tempat ini.</p></section>';
  };

  views.peta = function (id) {
    const place = getPlace(id);
    if (!place) return views.notfound();

    return backButton('#tempat/' + encodeURIComponent(place.id)) + DEMO +
      '<p class="eyebrow">PETA &amp; PETUNJUK ARAH</p>' +
      '<h1 class="map-title" tabindex="-1">' + escapeHTML(place.name) + '</h1>' +
      '<div class="map" role="img" aria-label="Skema lokasi ilustratif: ' + escapeHTML(place.name) + ' dan area kampus">' +
        '<div>SKEMA LOKASI</div>' +
        '<div class="pin">' + ICON.pin + escapeHTML(place.name) + '</div>' +
        '<div class="campus"><span><b>Area kampus</b>Ilustratif</span></div>' +
        '<div></div>' +
      '</div>' +
      '<p class="demo map-note">Peta ilustratif • bukan navigasi aktual. Tidak menunjukkan rute atau lokasi sebenarnya.</p>' +
      '<p class="map-distance">± ' + place.distance + ' m dari kampus · contoh</p>' +
      '<p class="demo map-address">Alamat placeholder: ' + ADDRESS_PLACEHOLDER + '</p>' +
      '<button class="btn" type="button" data-directions-demo>Buka Petunjuk Arah <span aria-hidden="true">↗</span></button>' +
      '<p class="demo" id="direction-note" role="status">Pratinjau tombol saja; petunjuk arah nyata belum tersedia.</p>';
  };

  views.notfound = function () {
    return backButton('#') + '<h1 tabindex="-1">Halaman tidak ditemukan.</h1><p class="lead"><a class="link" href="#">Kembali ke beranda</a></p>';
  };

  function renderRoute() {
    const route = window.location.hash.replace(/^#\/?/, '');
    const parts = route.split('/');
    let view = parts[0] || 'home';
    const id = parts[1] ? decodeURIComponent(parts[1]) : undefined;

    if (!Object.prototype.hasOwnProperty.call(views, view)) {
      view = 'notfound';
    }

    app.innerHTML = views[view](id);

    const heading = app.querySelector('h1');
    document.title = (heading ? heading.textContent + ' · ' : '') + 'MAM';

    if (view === 'hasil') {
      navExplore.setAttribute('aria-current', 'page');
    } else {
      navExplore.removeAttribute('aria-current');
    }

    window.scrollTo(0, 0);
    if (heading) heading.focus({ preventScroll: true });
    bindInteractions(view);
  }

  function navigate(hash) {
    if (window.location.hash === hash) {
      renderRoute();
      return;
    }
    window.location.hash = hash;
  }

  function showPriceError(message) {
    const error = document.querySelector('#price-error');
    if (!error) return;
    error.textContent = message || '';
    error.hidden = !message;
  }

  function refreshFilterPreview() {
    const matches = getMatchingPlaces();
    const valid = isPriceRangeValid();
    const count = document.querySelector('#count');
    const preview = document.querySelector('#preview');
    const apply = document.querySelector('#apply');

    showPriceError(valid ? '' : 'Harga minimum tidak boleh lebih besar daripada harga maksimum.');
    count.textContent = valid ? matches.length + ' tempat cocok · pratinjau' : 'Periksa kembali rentang harga.';
    preview.innerHTML = matches[0] ? placeCard(matches[0], false, '#cari') : '';
    apply.innerHTML = 'Terapkan Filter · ' + matches.length + ' tempat <span aria-hidden="true">→</span>';
    apply.disabled = !valid;

    document.querySelectorAll('[data-min][data-max]').forEach(function (chip) {
      const selected = state.minPrice === chip.dataset.min && state.maxPrice === chip.dataset.max;
      chip.setAttribute('aria-pressed', String(selected));
    });
  }

  function bindInteractions(view) {
    app.querySelectorAll('[data-search-form]').forEach(function (form) {
      form.addEventListener('submit', function (event) {
        event.preventDefault();
        const input = form.querySelector('input[name="q"]');
        state.query = input ? input.value.trim() : '';
        navigate('#hasil');
      });
    });

    app.querySelectorAll('[data-back]').forEach(function (button) {
      button.addEventListener('click', function () {
        navigate(button.dataset.back || '#');
      });
    });

    app.querySelectorAll('[data-return-to]').forEach(function (link) {
      link.addEventListener('click', function () {
        state.detailReturn = link.dataset.returnTo || '#';
      });
    });

    if (view === 'hasil') {
      app.querySelectorAll('[data-clear-price]').forEach(function (button) {
        button.addEventListener('click', function () {
          state.minPrice = '';
          state.maxPrice = '';
          renderRoute();
        });
      });

      const clearAll = app.querySelector('[data-clear-all]');
      if (clearAll) {
        clearAll.addEventListener('click', function () {
          state.query = '';
          state.minPrice = '';
          state.maxPrice = '';
          renderRoute();
        });
      }
    }

    const directionsButton = app.querySelector('[data-directions-demo]');
    if (directionsButton) {
      directionsButton.addEventListener('click', function () {
        const note = app.querySelector('#direction-note');
        note.textContent = 'Ini hanya pratinjau tombol. Petunjuk arah nyata belum tersedia.';
      });
    }

    if (view !== 'cari') return;

    const searchInput = app.querySelector('#q-cari');
    searchInput.addEventListener('input', function () {
      state.query = searchInput.value;
      refreshFilterPreview();
    });

    const minInput = app.querySelector('#min-price');
    const maxInput = app.querySelector('#max-price');

    [minInput, maxInput].forEach(function (input) {
      input.addEventListener('input', function () {
        const key = input.id === 'min-price' ? 'minPrice' : 'maxPrice';
        state[key] = onlyDigits(input.value);
        refreshFilterPreview();
      });

      input.addEventListener('blur', function () {
        const key = input.id === 'min-price' ? 'minPrice' : 'maxPrice';
        input.value = state[key] ? Number(state[key]).toLocaleString('id-ID') : '';
      });
    });

    app.querySelectorAll('[data-min][data-max]').forEach(function (chip) {
      chip.addEventListener('click', function () {
        state.minPrice = chip.dataset.min;
        state.maxPrice = chip.dataset.max;
        minInput.value = state.minPrice ? Number(state.minPrice).toLocaleString('id-ID') : '';
        maxInput.value = state.maxPrice ? Number(state.maxPrice).toLocaleString('id-ID') : '';
        refreshFilterPreview();
      });
    });

    const resetButton = app.querySelector('[data-reset]');
    resetButton.addEventListener('click', function () {
      state.query = '';
      state.minPrice = '';
      state.maxPrice = '';
      renderRoute();
    });

    const applyButton = app.querySelector('[data-apply]');
    applyButton.addEventListener('click', function () {
      if (!isPriceRangeValid()) {
        showPriceError('Harga minimum tidak boleh lebih besar daripada harga maksimum.');
        maxInput.focus();
        return;
      }
      navigate('#hasil');
    });
  }

  window.addEventListener('hashchange', renderRoute);
  renderRoute();
})();
