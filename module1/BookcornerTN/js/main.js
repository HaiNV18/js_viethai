/**
 * Book Corner Bookstore - Main JavaScript Logic
 * Powered by Antigravity IDE
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- STATE & DATA VARIABLES ---
  let booksData = [];
  let categoriesData = [];
  let cart = JSON.parse(localStorage.getItem('bc_cart')) || [];
  let wishlist = JSON.parse(localStorage.getItem('bc_wishlist')) || [];

  const CATEGORY_MAP = {
    1: 'Thiếu Nhi',
    2: 'Văn Học',
    3: 'Giáo Trình',
    4: 'Khoa học Kỹ thuật'
  };

  // --- INIT COMMON UI INTERACTIONS ---
  initHeaderScroll();
  initMobileNav();
  updateHeaderBadges();
  initLucideIcons();

  // --- ROUTER / PAGE IDENTIFICATION ---
  const path = window.location.pathname;
  const isHome = document.getElementById('hero-carousel') !== null;
  const isProducts = document.getElementById('books-list-grid') !== null;
  const isContact = document.getElementById('contact-feedback-form') !== null;

  // --- LOAD BOOKS DATA ---
  loadBooksData().then(data => {
    if (!data) return;
    booksData = data.books || [];
    categoriesData = data.categories || [];

    // Format ratings if empty (provide premium mock rating stars)
    booksData.forEach(book => {
      if (!book.rating || book.rating.length === 0) {
        // Generate a stable mock rating based on book ID
        const mockRating = 4 + ((book.id * 3) % 2) * 0.5 + ((book.id * 7) % 2) * 0.5;
        book.rating = [Math.min(5, Math.max(3.5, mockRating))];
      }
    });

    if (isHome) {
      initHomePage();
    } else if (isProducts) {
      initProductsPage();
    }
  });

  if (isContact) {
    initContactPage();
  }

  // Bind Shared Detail Modal Close Events
  const detailModal = document.getElementById('detail-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const overlayBg = document.getElementById('overlay-bg');

  if (modalCloseBtn && detailModal) {
    modalCloseBtn.addEventListener('click', closeModal);
    overlayBg.addEventListener('click', () => {
      closeModal();
      closeMobileNav();
    });
    // Escape key closes modal
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && detailModal.classList.contains('active')) {
        closeModal();
      }
    });
  }

  // --- 1. CORE DATA LOADER (WITH FALLBACK) ---
  async function loadBooksData() {
    try {
      // First try to fetch from Data/books.json
      const response = await fetch('Data/books.json');
      if (!response.ok) throw new Error('Fetch failed');
      return await response.json();
    } catch (error) {
      console.warn('Cannot fetch Data/books.json directly (likely CORS policy). Falling back to js/books-data.js...');
      // If fetch fails (CORS or direct file:// protocol), use fallback window.BOOKS_DATA
      if (window.BOOKS_DATA) {
        return window.BOOKS_DATA;
      } else {
        showToast('Lỗi Dữ Liệu', 'Không thể nạp dữ liệu sách. Vui lòng chạy website qua server hoặc bật JavaScript.', 'error');
        return null;
      }
    }
  }

  // --- 2. HEADER SCROLL & STICKY EFFECT ---
  function initHeaderScroll() {
    const header = document.getElementById('main-header');
    if (!header) return;

    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }

  // --- 3. MOBILE NAVIGATION DRAWER ---
  function initMobileNav() {
    const hamburger = document.getElementById('hamburger-menu');
    const closeBtn = document.getElementById('mobile-nav-close');
    const mobileNav = document.getElementById('mobile-nav');
    const overlay = document.getElementById('overlay-bg');

    if (!hamburger || !mobileNav) return;

    hamburger.addEventListener('click', () => {
      mobileNav.classList.add('active');
      overlay.classList.add('active');
    });

    closeBtn.addEventListener('click', closeMobileNav);

    // Close when clicking nav links
    const mobileLinks = mobileNav.querySelectorAll('.mobile-nav-link');
    mobileLinks.forEach(link => {
      link.addEventListener('click', closeMobileNav);
    });
  }

  function closeMobileNav() {
    const mobileNav = document.getElementById('mobile-nav');
    const overlay = document.getElementById('overlay-bg');
    if (mobileNav) mobileNav.classList.remove('active');
    if (overlay && !document.getElementById('detail-modal').classList.contains('active')) {
      overlay.classList.remove('active');
    }
  }

  // --- 4. TRANG CHỦ (HOME PAGE) LOGIC ---
  function initHomePage() {
    // Carousel Slide Controls
    initCarousel();

    // Render 8 latest books
    const latestBooksGrid = document.getElementById('latest-books-grid');
    if (latestBooksGrid) {
      latestBooksGrid.innerHTML = '';

      // Sort: Newest (by year desc, then id desc)
      const sortedBooks = [...booksData].sort((a, b) => {
        if (b.year !== a.year) return b.year - a.year;
        return b.id - a.id;
      });

      const latestBooks = sortedBooks.slice(0, 8);
      latestBooks.forEach(book => {
        latestBooksGrid.appendChild(createBookCard(book));
      });
      initLucideIcons(); // Reinits icons inside dynamic cards
    }

    // Set Book Counts on category list
    for (let catId = 1; catId <= 4; catId++) {
      const el = document.getElementById(`count-cat-${catId}`);
      if (el) {
        const count = booksData.filter(b => b.categoryId === catId).length;
        el.innerText = `${count} cuốn sách`;
      }
    }
  }

  // Homepage Hero Carousel
  function initCarousel() {
    const carousel = document.getElementById('hero-carousel');
    if (!carousel) return;

    const slides = carousel.querySelectorAll('.carousel-slide');
    const prevBtn = document.getElementById('carousel-prev');
    const nextBtn = document.getElementById('carousel-next');
    const dotsContainer = document.getElementById('carousel-indicators');

    let currentSlide = 0;
    let slideInterval;
    const intervalTime = 5000;

    if (slides.length === 0) return;

    // Dot indicators
    const dots = dotsContainer.querySelectorAll('.carousel-dot');

    function goToSlide(index) {
      slides[currentSlide].classList.remove('active');
      dots[currentSlide].classList.remove('active');

      currentSlide = (index + slides.length) % slides.length;

      slides[currentSlide].classList.add('active');
      dots[currentSlide].classList.add('active');
    }

    function nextSlide() {
      goToSlide(currentSlide + 1);
    }

    function prevSlide() {
      goToSlide(currentSlide - 1);
    }

    // Event Listeners
    nextBtn.addEventListener('click', () => {
      nextSlide();
      resetInterval();
    });

    prevBtn.addEventListener('click', () => {
      prevSlide();
      resetInterval();
    });

    dots.forEach((dot, idx) => {
      dot.addEventListener('click', () => {
        goToSlide(idx);
        resetInterval();
      });
    });

    // Auto Play Interval
    function startInterval() {
      slideInterval = setInterval(nextSlide, intervalTime);
    }

    function resetInterval() {
      clearInterval(slideInterval);
      startInterval();
    }

    // Pause on hover
    carousel.addEventListener('mouseenter', () => clearInterval(slideInterval));
    carousel.addEventListener('mouseleave', startInterval);

    startInterval();
  }

  // --- 5. TRANG SẢN PHẨM (PRODUCTS PAGE) LOGIC ---
  function initProductsPage() {
    const booksGrid = document.getElementById('books-list-grid');
    const searchInput = document.getElementById('search-input');
    const catAll = document.getElementById('cat-all');
    const catCheckboxes = document.querySelectorAll('.category-filter-item');
    const priceMinInput = document.getElementById('price-min');
    const priceMaxInput = document.getElementById('price-max');
    const sortSelect = document.getElementById('sort-select');
    const clearFiltersBtn = document.getElementById('clear-filters-btn');

    // Pre-calculate and render count badges statically
    updateCategoryCounts();

    // Load category from query string if available
    const urlParams = new URLSearchParams(window.location.search);
    const catParam = urlParams.get('category');
    if (catParam) {
      catAll.checked = false;
      catCheckboxes.forEach(cb => {
        if (cb.value === catParam) {
          cb.checked = true;
        } else {
          cb.checked = false;
        }
      });
    }

    // Filter books initial trigger
    filterAndRenderBooks();

    // Event Listeners for Live Filtering
    searchInput.addEventListener('input', filterAndRenderBooks);

    priceMinInput.addEventListener('input', filterAndRenderBooks);
    priceMaxInput.addEventListener('input', filterAndRenderBooks);
    sortSelect.addEventListener('change', filterAndRenderBooks);

    // Category Logic: "Tất cả" overrides others, and vice versa
    catAll.addEventListener('change', () => {
      if (catAll.checked) {
        catCheckboxes.forEach(cb => cb.checked = false);
      } else {
        // If unchecking "All", and no others checked, re-check "All"
        const anyChecked = Array.from(catCheckboxes).some(cb => cb.checked);
        if (!anyChecked) catAll.checked = true;
      }
      filterAndRenderBooks();
    });

    catCheckboxes.forEach(cb => {
      cb.addEventListener('change', () => {
        if (cb.checked) {
          catAll.checked = false;
        } else {
          // If all specific checkboxes unchecked, re-check "All"
          const anyChecked = Array.from(catCheckboxes).some(cb => cb.checked);
          if (!anyChecked) catAll.checked = true;
        }
        filterAndRenderBooks();
      });
    });

    // Reset Filters Button
    clearFiltersBtn.addEventListener('click', () => {
      searchInput.value = '';
      catAll.checked = true;
      catCheckboxes.forEach(cb => cb.checked = false);
      priceMinInput.value = '';
      priceMaxInput.value = '';
      sortSelect.value = 'newest';
      filterAndRenderBooks();
      showToast('Bộ Lọc', 'Đã thiết lập lại toàn bộ bộ lọc sách.', 'info');
    });

    function updateCategoryCounts() {
      // Total count
      document.getElementById('count-all').innerText = booksData.length;
      // Individual category count
      for (let i = 1; i <= 4; i++) {
        const count = booksData.filter(b => b.categoryId === i).length;
        const badge = document.getElementById(`count-${i}`);
        if (badge) badge.innerText = count;
      }
    }

    function filterAndRenderBooks() {
      let filtered = [...booksData];

      // 1. Search Query filter (title, author)
      const query = searchInput.value.trim().toLowerCase();
      if (query) {
        filtered = filtered.filter(b =>
          b.title.toLowerCase().includes(query) ||
          b.author.toLowerCase().includes(query)
        );
      }

      // 2. Category filter
      if (!catAll.checked) {
        const checkedCategories = Array.from(catCheckboxes)
          .filter(cb => cb.checked)
          .map(cb => parseInt(cb.value));

        if (checkedCategories.length > 0) {
          filtered = filtered.filter(b => checkedCategories.includes(b.categoryId));
        }
      }

      // 3. Price filter
      const minPrice = parseFloat(priceMinInput.value);
      const maxPrice = parseFloat(priceMaxInput.value);

      if (!isNaN(minPrice) && minPrice >= 0) {
        filtered = filtered.filter(b => b.price >= minPrice);
      }
      if (!isNaN(maxPrice) && maxPrice >= 0) {
        filtered = filtered.filter(b => b.price <= maxPrice);
      }

      // 4. Sort selection
      const sortBy = sortSelect.value;
      if (sortBy === 'price-asc') {
        filtered.sort((a, b) => a.price - b.price);
      } else if (sortBy === 'price-desc') {
        filtered.sort((a, b) => b.price - a.price);
      } else if (sortBy === 'title-asc') {
        filtered.sort((a, b) => a.title.localeCompare(b.title, 'vi'));
      } else if (sortBy === 'title-desc') {
        filtered.sort((a, b) => b.title.localeCompare(a.title, 'vi'));
      } else { // default or 'newest'
        filtered.sort((a, b) => {
          if (b.year !== a.year) return b.year - a.year;
          return b.id - a.id;
        });
      }

      // 5. Render to grid
      booksGrid.innerHTML = '';

      // Update counters
      document.getElementById('displayed-books-count').innerText = filtered.length;
      document.getElementById('total-books-count').innerText = booksData.length;

      if (filtered.length === 0) {
        booksGrid.innerHTML = `
          <div class="no-results">
            <div class="no-results-icon"><i data-lucide="book-x"></i></div>
            <h4 class="no-results-title">Không Tìm Thấy Sách</h4>
            <p class="no-results-desc">Rất tiếc, không có cuốn sách nào khớp với bộ lọc hiện tại của bạn. Vui lòng đổi từ khóa hoặc khoảng giá khác.</p>
          </div>
        `;
        initLucideIcons();
        return;
      }

      // Display results with a tiny stagger animation
      filtered.forEach(book => {
        booksGrid.appendChild(createBookCard(book));
      });
      initLucideIcons();
    }
  }

  // --- 6. COMMON DYNAMIC HTML GENERATORS ---
  function createBookCard(book) {
    const card = document.createElement('div');
    card.className = 'book-card';
    card.setAttribute('data-id', book.id);

    const formattedPrice = book.price === 0
      ? '<span class="book-card-price free">Miễn phí</span>'
      : `<span class="book-card-price">${book.price.toLocaleString('vi-VN')} đ</span>`;

    const categoryName = CATEGORY_MAP[book.categoryId] || 'Khác';

    // Badge flags
    let badgesHTML = '';
    if (book.year >= 2025) {
      badgesHTML += '<span class="badge badge-success">Mới</span>';
    }
    if (!book.inStock) {
      badgesHTML += '<span class="badge badge-error">Hết hàng</span>';
    }

    // Is in wishlist?
    const isInWish = wishlist.some(item => item.id === book.id);
    const wishIcon = isInWish ? 'heart-handshake' : 'heart';
    const wishClass = isInWish ? 'style="color: var(--color-error); fill: var(--color-error);"' : '';

    card.innerHTML = `
      <div class="book-card-media">
        <img src="images/products/${book.image}" alt="${book.title}" class="book-card-img" loading="lazy" onerror="this.src='images/logo.png'">
        <div class="book-card-badges">
          ${badgesHTML}
        </div>
        <div class="book-card-actions">
          <button class="card-action-btn toggle-wishlist-btn" title="Thêm vào yêu thích" data-id="${book.id}">
            <i data-lucide="heart" ${wishClass}></i>
          </button>
          <button class="card-action-btn quick-view-btn" title="Xem chi tiết" data-id="${book.id}">
            <i data-lucide="eye"></i>
          </button>
          <button class="card-action-btn add-to-cart-btn" title="Thêm vào giỏ hàng" data-id="${book.id}" ${!book.inStock ? 'disabled' : ''}>
            <i data-lucide="shopping-cart"></i>
          </button>
        </div>
      </div>
      <div class="book-card-content">
        <span class="book-card-category">${categoryName}</span>
        <h3 class="book-card-title" title="${book.title}">${book.title}</h3>
        <p class="book-card-author">${book.author}</p>
        <div class="book-card-footer">
          ${formattedPrice}
          <div style="display: flex; align-items: center; gap: 4px; font-size: 0.85rem; color: #EAB308;">
            <i data-lucide="star" style="width: 14px; fill: #EAB308;"></i>
            <span style="font-weight: 700; color: var(--text-main);">${book.rating[0].toFixed(1)}</span>
          </div>
        </div>
      </div>
    `;

    // Hook events inside JS to avoid inline handlers
    card.querySelector('.quick-view-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      openQuickView(book.id);
    });

    card.querySelector('.add-to-cart-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      addToCart(book);
    });

    card.querySelector('.toggle-wishlist-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      toggleWishlist(book);
    });

    return card;
  }

  // --- 7. CART & WISHLIST STORAGE ACTIONS ---
  function updateHeaderBadges() {
    const cartCounts = document.querySelectorAll('#cart-count, #mobile-cart-count');
    const wishCounts = document.querySelectorAll('#wishlist-count, #mobile-wishlist-count');

    const totalCartItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCounts.forEach(el => el.innerText = totalCartItems);
    wishCounts.forEach(el => el.innerText = wishlist.length);
  }

  function addToCart(book) {
    if (!book.inStock) {
      showToast('Hết Hàng', `Sách "${book.title}" hiện tại đã hết hàng.`, 'error');
      return;
    }

    const existingIndex = cart.findIndex(item => item.id === book.id);
    if (existingIndex > -1) {
      cart[existingIndex].quantity += 1;
    } else {
      cart.push({ id: book.id, title: book.title, price: book.price, image: book.image, quantity: 1 });
    }

    localStorage.setItem('bc_cart', JSON.stringify(cart));
    updateHeaderBadges();
    showToast('Thêm Thành Công', `Đã thêm cuốn "${book.title}" vào giỏ hàng.`, 'success');
  }

  function toggleWishlist(book) {
    const existingIndex = wishlist.findIndex(item => item.id === book.id);
    let message = '';
    let isAdded = false;

    if (existingIndex > -1) {
      wishlist.splice(existingIndex, 1);
      message = `Đã xóa cuốn "${book.title}" khỏi danh sách yêu thích.`;
    } else {
      wishlist.push({ id: book.id, title: book.title, price: book.price, image: book.image });
      message = `Đã thêm cuốn "${book.title}" vào danh sách yêu thích.`;
      isAdded = true;
    }

    localStorage.setItem('bc_wishlist', JSON.stringify(wishlist));
    updateHeaderBadges();
    showToast('Yêu Thích', message, 'info');

    // Update the heart visual status on page cards
    const cardBtns = document.querySelectorAll(`.toggle-wishlist-btn[data-id="${book.id}"]`);
    cardBtns.forEach(btn => {
      const heartIcon = btn.querySelector('i');
      if (heartIcon) {
        if (isAdded) {
          heartIcon.style.color = 'var(--color-error)';
          heartIcon.style.fill = 'var(--color-error)';
        } else {
          heartIcon.style.color = '';
          heartIcon.style.fill = '';
        }
      }
    });
  }

  // --- 8. PRODUCT DETAILS MODAL RENDERING ---
  function openQuickView(bookId) {
    const book = booksData.find(b => b.id === bookId);
    if (!book) return;

    const modalContent = document.getElementById('modal-content');
    const formattedPrice = book.price === 0
      ? '<span class="modal-price free">Miễn phí</span>'
      : `<span class="modal-price">${book.price.toLocaleString('vi-VN')} đ</span>`;

    const categoryName = CATEGORY_MAP[book.categoryId] || 'Khác';
    const stockBadge = book.inStock
      ? '<span class="badge badge-success">Còn hàng</span>'
      : '<span class="badge badge-error">Hết hàng</span>';

    // Generates star representation
    const ratingStars = book.rating[0];
    let starsHTML = '';
    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(ratingStars)) {
        starsHTML += '<i data-lucide="star" style="width: 18px; fill: #EAB308; color: #EAB308;"></i>';
      } else if (i - 0.5 <= ratingStars) {
        starsHTML += '<i data-lucide="star-half" style="width: 18px; fill: #EAB308; color: #EAB308;"></i>';
      } else {
        starsHTML += '<i data-lucide="star" style="width: 18px; color: #CBD5E1;"></i>';
      }
    }

    // Custom Mock Synopses based on Category to make description premium
    let descriptionText = `Cuốn sách "${book.title}" là một tác phẩm nổi bật của tác giả ${book.author}, xuất bản năm ${book.year}. `;
    if (book.categoryId === 1) {
      descriptionText += 'Tác phẩm được viết với văn phong sinh động, minh họa sắc nét, rất phù hợp để kích thích sự sáng tạo và nuôi dưỡng tâm hồn, đạo đức cho độc giả nhỏ tuổi.';
    } else if (book.categoryId === 2) {
      descriptionText += 'Một tiểu thuyết văn học đầy tính nghệ thuật và chiều sâu nhân văn. Tác phẩm mang lại những suy ngẫm chân thực về cuộc sống, tình yêu, gia đình và xã hội Việt Nam qua các thời kỳ.';
    } else if (book.categoryId === 3) {
      descriptionText += 'Bộ giáo trình lý luận chuẩn chỉnh, kiến thức hệ thống hóa bài bản, được biên soạn công phu phù hợp cho sinh viên đại học giảng dạy lý thuyết chuyên ngành vững chắc.';
    } else {
      descriptionText += 'Ấn phẩm khoa học chuyên sâu mang tính ứng dụng thực tiễn cao, giúp độc giả cập nhật các nghiên cứu, công nghệ, kỹ năng mới nhất để làm chủ tương lai số.';
    }

    modalContent.innerHTML = `
      <div class="modal-media">
        <img src="images/products/${book.image}" alt="${book.title}" class="modal-img" onerror="this.src='images/logo.png'">
      </div>
      <div class="modal-info">
        <span class="modal-category">${categoryName}</span>
        <h2 class="modal-title">${book.title}</h2>

        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 16px;">
          <div style="display: flex; gap: 2px;">
            ${starsHTML}
          </div>
          <span style="font-weight: 700; font-size: 0.95rem; margin-left: 4px;">${book.rating[0].toFixed(1)} / 5.0</span>
        </div>

        <div class="modal-meta-grid">
          <div class="modal-meta-item">Tác giả: <span>${book.author}</span></div>
          <div class="modal-meta-item">Năm xuất bản: <span>${book.year}</span></div>
          <div class="modal-meta-item">Thể loại: <span>${categoryName}</span></div>
          <div class="modal-meta-item">Trạng thái: <span>${stockBadge}</span></div>
        </div>

        <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.6; margin-bottom: 24px;">
          ${descriptionText}
        </p>

        ${formattedPrice}

        <div class="modal-actions">
          <button class="btn btn-primary modal-cart-btn" style="flex: 1;" ${!book.inStock ? 'disabled' : ''}>
            <i data-lucide="shopping-cart"></i> Thêm vào giỏ
          </button>
          <button class="btn btn-outline modal-wishlist-btn" title="Yêu thích">
            <i data-lucide="heart" ${wishlist.some(item => item.id === book.id) ? 'style="color: var(--color-error); fill: var(--color-error);"' : ''}></i>
          </button>
        </div>
      </div>
    `;

    // Re-render icons for modal content
    initLucideIcons();

    // Hook modal button clicks
    modalContent.querySelector('.modal-cart-btn').addEventListener('click', () => {
      addToCart(book);
    });

    modalContent.querySelector('.modal-wishlist-btn').addEventListener('click', () => {
      toggleWishlist(book);
      // Toggle state of heart inside modal
      const isWish = wishlist.some(item => item.id === book.id);
      const heartIcon = modalContent.querySelector('.modal-wishlist-btn i');
      if (heartIcon) {
        if (isWish) {
          heartIcon.style.color = 'var(--color-error)';
          heartIcon.style.fill = 'var(--color-error)';
        } else {
          heartIcon.style.color = '';
          heartIcon.style.fill = '';
        }
      }
    });

    // Open Modal
    document.getElementById('detail-modal').classList.add('active');
    document.getElementById('overlay-bg').classList.add('active');
  }

  function closeModal() {
    const detailModal = document.getElementById('detail-modal');
    const overlayBg = document.getElementById('overlay-bg');
    if (detailModal) detailModal.classList.remove('active');
    // Keep overlay active if mobile navigation drawer is still active
    if (overlayBg && !document.getElementById('mobile-nav').classList.contains('active')) {
      overlayBg.classList.remove('active');
    }
  }

  // --- 9. TRANG LIÊN HỆ (CONTACT PAGE) LOGIC & VALIDATION ---
  function initContactPage() {
    const form = document.getElementById('contact-feedback-form');
    if (!form) return;

    const fields = {
      fullname: {
        input: document.getElementById('contact-name'),
        group: document.getElementById('group-fullname'),
        validate: val => val.trim().length > 0,
        errorMsg: 'Họ và tên không được bỏ trống.'
      },
      email: {
        input: document.getElementById('contact-email'),
        group: document.getElementById('group-email'),
        validate: val => {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          return emailRegex.test(val.trim());
        },
        errorMsg: 'Vui lòng nhập địa chỉ email hợp lệ.'
      },
      phone: {
        input: document.getElementById('contact-phone'),
        group: document.getElementById('group-phone'),
        validate: val => {
          const phoneRegex = /^[0-9]{10,11}$/;
          return phoneRegex.test(val.trim().replace(/[\s.-]/g, ''));
        },
        errorMsg: 'Số điện thoại phải chứa 10-11 chữ số.'
      },
      subject: {
        input: document.getElementById('contact-subject'),
        group: document.getElementById('group-subject'),
        validate: val => val.trim().length > 0,
        errorMsg: 'Tiêu đề không được bỏ trống.'
      },
      message: {
        input: document.getElementById('contact-message'),
        group: document.getElementById('group-message'),
        validate: val => val.trim().length >= 10,
        errorMsg: 'Nội dung phản hồi phải chứa ít nhất 10 ký tự.'
      }
    };

    // Live validate on input/blur
    Object.keys(fields).forEach(key => {
      const field = fields[key];
      const checkValidate = () => {
        const isValid = field.validate(field.input.value);
        if (isValid) {
          field.group.classList.remove('invalid');
        }
      };

      field.input.addEventListener('input', checkValidate);
      field.input.addEventListener('blur', checkValidate);
    });

    // Form submit validation
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let isFormValid = true;

      Object.keys(fields).forEach(key => {
        const field = fields[key];
        const isValid = field.validate(field.input.value);

        if (!isValid) {
          field.group.classList.add('invalid');
          // Update custom error message text
          const errorSpan = field.group.querySelector('.form-error-msg span');
          if (errorSpan) errorSpan.innerText = field.errorMsg;
          isFormValid = false;
        } else {
          field.group.classList.remove('invalid');
        }
      });

      if (isFormValid) {
        // Collect feedback data
        const feedbackData = {
          name: fields.fullname.input.value.trim(),
          email: fields.email.input.value.trim(),
          phone: fields.phone.input.value.trim(),
          subject: fields.subject.input.value.trim(),
          message: fields.message.input.value.trim(),
          submittedAt: new Date().toISOString()
        };

        // Persist local feedback submissions list
        const storedFeedbacks = JSON.parse(localStorage.getItem('bc_feedbacks')) || [];
        storedFeedbacks.push(feedbackData);
        localStorage.setItem('bc_feedbacks', JSON.stringify(storedFeedbacks));

        // Feedback success visual effect
        showToast(
          'Gửi Thành Công',
          `Cảm ơn ${feedbackData.name}! Phản hồi của bạn đã được chuyển tới Ban quản trị Book Corner.`,
          'success'
        );

        // Reset form fields
        form.reset();

        // Remove error states
        Object.keys(fields).forEach(key => {
          fields[key].group.classList.remove('invalid');
        });
      } else {
        showToast(
          'Lỗi Nhập Liệu',
          'Vui lòng điền đúng và đầy đủ thông tin vào các trường bắt buộc màu đỏ.',
          'error'
        );
      }
    });
  }

  // --- 10. PREMIUM CUSTOM TOAST NOTIFICATIONS ---
  function showToast(title, message, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    let iconName = 'check-circle';
    if (type === 'error') iconName = 'alert-triangle';
    if (type === 'info') iconName = 'info';

    toast.innerHTML = `
      <div class="toast-icon"><i data-lucide="${iconName}"></i></div>
      <div class="toast-content">
        <h4 class="toast-title">${title}</h4>
        <p class="toast-msg">${message}</p>
      </div>
      <div class="toast-close"><i data-lucide="x"></i></div>
    `;

    container.appendChild(toast);

    // Animate Lucide Icons inside Toast
    initLucideIcons();

    // Trigger Slide-In
    setTimeout(() => toast.classList.add('active'), 50);

    // Auto remove toast
    const autoCloseTimeout = setTimeout(() => {
      dismissToast(toast);
    }, 4500);

    // Toast Manual Close click
    toast.querySelector('.toast-close').addEventListener('click', () => {
      clearTimeout(autoCloseTimeout);
      dismissToast(toast);
    });
  }

  function dismissToast(toast) {
    toast.classList.remove('active');
    // Wait for slide out animation, then delete
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 4000);
  }

  // Helper to re-render SVG icons via CDN
  function initLucideIcons() {
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }
});
