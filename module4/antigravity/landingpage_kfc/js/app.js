/**
 * KFC Landing Page - Vanilla JavaScript Application
 * Follows specifications in FUNCTIONAL.md, IMPLEMENTATION.md, and DATA.md
 */

// Application State
const AppState = {
  products: [],
  activeCategory: 'all',
  featuredContainer: null,
  menuContainer: null,
  productModal: null
};

// Fallback CSV Data (Used gracefully when testing via direct file:// protocol where browser CORS blocks fetch)
const FALLBACK_CSV_DATA = `id,name,category,description,price,image,featured
1,"Gà Rán Truyền Thống","Gà rán","Từng miếng gà giòn rụm bên ngoài, mềm ngọt mọng nước bên trong theo công thức 11 loại thảo mộc đặc trưng.","40000","assets/images/chicken-1.svg","true"
2,"Gà Rán Cay Giòn","Gà rán","Vị cay nồng nàn thấm đượm từng thớ thịt gà giòn tan, sự lựa chọn số 1 của tín đồ ăn cay.","45000","assets/images/chicken-spicy.svg","true"
3,"Combo Gà Rán 1 Người","Combo","1 Miếng gà giòn, 1 khoai tây chiên vàng ruộm và 1 ly nước ngọt mát lạnh sảng khoái.","89000","assets/images/combo-1.svg","true"
4,"Combo Gia Đình Sum Vầy","Combo","Thịnh soạn với 4 miếng gà giòn, 1 burger tôm, 1 khoai tây chiên và 2 ly nước ngọt.","199000","assets/images/combo-family.svg","true"
5,"Burger Gà Giòn Flava","Burger","Bánh mì kẹp thịt gà phi-lê chiên xù giòn tan cùng xà lách tươi và sốt mayonnaise béo ngậy.","50000","assets/images/burger-chicken.svg","false"
6,"Burger Bò Nướng Phô Mai","Burger","Thịt bò nướng thơm lừng kết hợp lát phô mai cheddar tan chảy và dưa chua giòn ngọt đậm đà.","55000","assets/images/burger-beef.svg","false"
7,"Burger Tôm Tươi Giòn","Burger","Nhân tôm biển tươi giòn ngọt tự nhiên hòa quyện sốt tartar chua ngọt thanh mát lạ miệng.","50000","assets/images/burger-shrimp.svg","false"
8,"Gà Viên Popcorn","Món ăn kèm","Những viên gà phi-lê giòn tan cỡ vừa ăn, thơm phức gia vị đậm đà kích thích vị giác.","39000","assets/images/popcorn-chicken.svg","true"
9,"Khoai Tây Chiên Vừa","Món ăn kèm","Khoai tây chiên vàng ươm, giòn rụm bên ngoài, bùi béo bên trong, chấm kèm tương cà chuẩn vị.","20000","assets/images/khoai-tay-chien.jpg","false"
10,"Khoai Tây Chiên Lớn","Món ăn kèm","Phần khoai tây cỡ lớn giòn rụm thơm ngon, lý tưởng để nhâm nhi cùng nhóm bạn bè.","35000","assets/images/fries.svg","false"
11,"Nước Ngọt Pepsi","Đồ uống","Nước ngọt có gas Pepsi ướp lạnh mát rượi, giải tỏa cơn khát tức thì khi thưởng thức gà.","10000","assets/images/pepsi.svg","false"
12,"Nước Ngọt Coca Cola","Đồ uống","Nước giải khát Coca Cola có ga mát lạnh sảng khoái đánh thức trọn vẹn vị giác.","10000","assets/images/coca.svg","false"
13,"Nước Ngọt 7Up Chanh","Đồ uống","Hương vị chanh thanh mát bùng nổ kết hợp ga sảng khoái, cân bằng hương vị hoàn hảo.","10000","assets/images/sevenup.svg","false"`;

/* --------------------------------------------------------------------------
   Initialization
   -------------------------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  initDOMReferences();
  initMobileMenu();
  initSmoothScroll();
  initModalListeners();
  initCategoryFilters();
  loadProducts();
});

function initDOMReferences() {
  AppState.featuredContainer = document.getElementById('featured-products-grid');
  AppState.menuContainer = document.getElementById('menu-products-grid');
  AppState.productModal = document.getElementById('product-detail-modal');
}

/* --------------------------------------------------------------------------
   Load & Parse CSV
   -------------------------------------------------------------------------- */
async function loadProducts() {
  renderLoadingState(AppState.featuredContainer, 'Đang tải món ngon nổi bật...');
  renderLoadingState(AppState.menuContainer, 'Đang tải thực đơn...');

  try {
    const response = await fetch('data/menu.csv');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const csvText = await response.text();
    AppState.products = parseCSV(csvText);

    if (!AppState.products || AppState.products.length === 0) {
      throw new Error('CSV rỗng hoặc dữ liệu không hợp lệ.');
    }

    renderApp();
  } catch (error) {
    console.error('Lỗi khi tải data/menu.csv:', error);

    // If fetch failed (often due to browser local file:// restrictions when opening index.html directly)
    // we show the friendly error state as per DATA.md, with an option to load the data fallback
    renderErrorState(AppState.menuContainer, 'Không thể tải menu. Vui lòng thử lại sau.');
    renderErrorState(AppState.featuredContainer, 'Không thể tải menu. Vui lòng thử lại sau.');
  }
}

/**
 * Robust CSV Parser handling headers, rows, commas and quotes
 * @param {string} csvText 
 * @returns {Array<Object>}
 */
function parseCSV(csvText) {
  if (!csvText || typeof csvText !== 'string') return [];

  const lines = csvText.trim().split(/\r?\n/);
  if (lines.length < 2) return [];

  function parseLine(line) {
    const row = [];
    let cell = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];

      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          cell += '"';
          i++; // skip escaped quote
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        row.push(cell.trim());
        cell = '';
      } else {
        cell += char;
      }
    }
    row.push(cell.trim());
    return row;
  }

  const rawHeaders = parseLine(lines[0]);
  const headers = rawHeaders.map(h => h.replace(/^["']|["']$/g, '').toLowerCase().trim());

  const parsedProducts = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const row = parseLine(line);
    const item = {};

    headers.forEach((header, index) => {
      let val = row[index] !== undefined ? row[index] : '';
      if (val.startsWith('"') && val.endsWith('"')) {
        val = val.substring(1, val.length - 1);
      }
      item[header] = val;
    });

    if (item.name && item.price) {
      const numericPrice = parseInt(String(item.price).replace(/[^0-9]/g, ''), 10) || 0;
      parsedProducts.push({
        id: item.id || String(i),
        name: item.name,
        category: item.category || 'Gà rán',
        description: item.description || '',
        price: numericPrice,
        image: item.image || 'assets/images/placeholder.svg',
        featured: String(item.featured).trim().toLowerCase() === 'true'
      });
    }
  }

  return parsedProducts;
}

/* --------------------------------------------------------------------------
   UI Rendering Functions
   -------------------------------------------------------------------------- */
function renderApp() {
  // 1. Render Featured Products (featured === true)
  const featuredList = AppState.products.filter(p => p.featured === true);
  renderProductGrid(featuredList, AppState.featuredContainer, true);

  // 2. Render Full / Filtered Menu
  filterProducts(AppState.activeCategory);
}

/**
 * Safely renders product cards into a container using DOM API (no unsafe innerHTML)
 * @param {Array<Object>} products 
 * @param {HTMLElement} container 
 * @param {boolean} isFeatured 
 */
function renderProductGrid(products, container, isFeatured = false) {
  if (!container) return;
  container.replaceChildren(); // Clear container safely

  if (products.length === 0) {
    const emptyMsg = document.createElement('div');
    emptyMsg.className = 'state-message';
    const p = document.createElement('p');
    p.textContent = 'Hiện chưa có sản phẩm nào thuộc danh mục này.';
    emptyMsg.appendChild(p);
    container.appendChild(emptyMsg);
    return;
  }

  products.forEach(product => {
    const card = createProductCardElement(product, isFeatured);
    container.appendChild(card);
  });
}

/**
 * Creates a single semantic article.product-card DOM element
 * @param {Object} product 
 * @param {boolean} isFeatured 
 * @returns {HTMLElement}
 */
function createProductCardElement(product, isFeatured) {
  const article = document.createElement('article');
  article.className = 'product-card';
  article.setAttribute('tabindex', '0');
  article.setAttribute('role', 'button');
  article.setAttribute('aria-label', `Xem chi tiết sản phẩm ${product.name}`);

  // Image wrapper
  const imgWrapper = document.createElement('div');
  imgWrapper.className = 'product-card__image-wrapper';

  const img = document.createElement('img');
  img.className = 'product-card__image';
  img.src = product.image;
  img.alt = product.name;
  img.loading = 'lazy';
  img.width = 400;
  img.height = 300;
  img.onerror = () => {
    img.src = 'assets/images/placeholder.svg';
  };
  imgWrapper.appendChild(img);

  // Featured or Category Badge
  if (product.featured) {
    const badge = document.createElement('span');
    badge.className = 'product-card__badge';
    badge.textContent = 'Món Nổi Bật';
    imgWrapper.appendChild(badge);
  }

  article.appendChild(imgWrapper);

  // Content wrapper
  const content = document.createElement('div');
  content.className = 'product-card__content';

  const category = document.createElement('span');
  category.className = 'product-card__category';
  category.textContent = product.category;
  content.appendChild(category);

  const title = document.createElement('h3');
  title.className = 'product-card__title';
  title.textContent = product.name;
  content.appendChild(title);

  const desc = document.createElement('p');
  desc.className = 'product-card__desc';
  desc.textContent = product.description;
  content.appendChild(desc);

  // Footer: Price and CTA
  const footer = document.createElement('div');
  footer.className = 'product-card__footer';

  const price = document.createElement('strong');
  price.className = 'product-card__price';
  price.textContent = formatPrice(product.price);
  footer.appendChild(price);

  const viewBtn = document.createElement('span');
  viewBtn.className = 'product-card__btn';
  viewBtn.textContent = 'Chi tiết';
  footer.appendChild(viewBtn);

  content.appendChild(footer);
  article.appendChild(content);

  // Interaction: Open Modal on click or Enter key
  const triggerDetail = () => openProductDetail(product);
  article.addEventListener('click', triggerDetail);
  article.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      triggerDetail();
    }
  });

  return article;
}

/* --------------------------------------------------------------------------
   Filter Category Implementation
   -------------------------------------------------------------------------- */
function initCategoryFilters() {
  const filterButtons = document.querySelectorAll('.filter-btn');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const selectedCategory = btn.getAttribute('data-category');

      // Update active state in UI
      filterButtons.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      filterProducts(selectedCategory);
    });
  });
}

function filterProducts(category) {
  AppState.activeCategory = category;

  let filteredList = AppState.products;
  if (category && category !== 'all') {
    filteredList = AppState.products.filter(p => p.category.toLowerCase() === category.toLowerCase());
  }

  renderProductGrid(filteredList, AppState.menuContainer, false);
}

/* --------------------------------------------------------------------------
   Price Formatting (VND)
   -------------------------------------------------------------------------- */
function formatPrice(amount) {
  if (typeof amount !== 'number' || isNaN(amount)) {
    return '0 ₫';
  }
  return new Intl.NumberFormat('vi-VN').format(amount) + ' ₫';
}

/* --------------------------------------------------------------------------
   Loading & Error States
   -------------------------------------------------------------------------- */
function renderLoadingState(container, message = 'Đang tải dữ liệu...') {
  if (!container) return;
  container.replaceChildren();

  const wrap = document.createElement('div');
  wrap.className = 'state-message';

  const spinner = document.createElement('div');
  spinner.className = 'state-spinner';
  spinner.setAttribute('aria-hidden', 'true');

  const p = document.createElement('p');
  p.textContent = message;

  wrap.appendChild(spinner);
  wrap.appendChild(p);
  container.appendChild(wrap);
}

function renderErrorState(container, message) {
  if (!container) return;
  container.replaceChildren();

  const errorBox = document.createElement('div');
  errorBox.className = 'state-message';

  const box = document.createElement('div');
  box.className = 'error-box';

  const p = document.createElement('p');
  p.textContent = message;
  box.appendChild(p);

  // Friendly Fallback Action button (handles file:// CORS protocol gracefully)
  const fallbackBtn = document.createElement('button');
  fallbackBtn.className = 'btn btn-primary btn-sm';
  fallbackBtn.textContent = 'Khởi tạo dữ liệu sẵn có';
  fallbackBtn.addEventListener('click', () => {
    console.info('Nạp dữ liệu menu dự phòng...');
    AppState.products = parseCSV(FALLBACK_CSV_DATA);
    renderApp();
  });
  box.appendChild(fallbackBtn);

  errorBox.appendChild(box);
  container.appendChild(errorBox);
}

/* --------------------------------------------------------------------------
   Product Detail Dialog Modal
   -------------------------------------------------------------------------- */
function initModalListeners() {
  const modal = AppState.productModal;
  if (!modal) return;

  const closeBtn = document.getElementById('modal-close-btn');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => modal.close());
  }

  // Light dismiss on backdrop click
  modal.addEventListener('click', (event) => {
    const rect = modal.getBoundingClientRect();
    const isInDialog = (
      rect.top <= event.clientY &&
      event.clientY <= rect.top + rect.height &&
      rect.left <= event.clientX &&
      event.clientX <= rect.left + rect.width
    );
    if (!isInDialog) {
      modal.close();
    }
  });
}

function openProductDetail(product) {
  const modal = AppState.productModal;
  if (!modal) return;

  document.getElementById('modal-img').src = product.image;
  document.getElementById('modal-img').alt = product.name;
  document.getElementById('modal-category').textContent = product.category;
  document.getElementById('modal-title').textContent = product.name;
  document.getElementById('modal-desc').textContent = product.description;
  document.getElementById('modal-price').textContent = formatPrice(product.price);

  if (typeof modal.showModal === 'function') {
    modal.showModal();
  } else {
    modal.setAttribute('open', '');
  }
}

/* --------------------------------------------------------------------------
   Mobile Navigation Menu
   -------------------------------------------------------------------------- */
function initMobileMenu() {
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const navMenu = document.getElementById('site-nav');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!mobileMenuBtn || !navMenu) return;

  mobileMenuBtn.addEventListener('click', () => {
    const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
    mobileMenuBtn.setAttribute('aria-expanded', !isExpanded);
    mobileMenuBtn.classList.toggle('active');
    navMenu.classList.toggle('open');
  });

  // Close menu when clicking navigation link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenuBtn.setAttribute('aria-expanded', 'false');
      mobileMenuBtn.classList.remove('active');
      navMenu.classList.remove('open');
    });
  });

  // Close menu when clicking outside
  document.addEventListener('click', (event) => {
    if (!navMenu.contains(event.target) && !mobileMenuBtn.contains(event.target)) {
      mobileMenuBtn.setAttribute('aria-expanded', 'false');
      mobileMenuBtn.classList.remove('active');
      navMenu.classList.remove('open');
    }
  });
}

/* --------------------------------------------------------------------------
   Smooth Scroll with Header Offset
   -------------------------------------------------------------------------- */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });

        // Update active nav link
        document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
        if (this.classList.contains('nav-link')) {
          this.classList.add('active');
        }
      }
    });
  });
}
