/**
 * VINHOMES GRAND PARK - LANDING PAGE SCRIPT
 * Các tính năng:
 * 1. Cuộn mượt và đóng menu trên thiết bị di động
 * 2. Đổi kiểu dáng thanh Navbar và hiển thị nút "Lên đầu trang" khi cuộn
 * 3. Hiệu ứng Fade-in Scroll Reveal bằng IntersectionObserver
 * 4. Kiểm tra hợp lệ biểu mẫu (Form Validation) tuân thủ Modern Web Best Practices (:user-invalid, aria-invalid sync)
 * 5. Xử lý gửi thông tin demo và hiển thị thông báo thành công
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // ========================================================================
  // 1. THANH ĐIỀU HƯỚNG (NAVBAR) & CUỘN TRANG
  // ========================================================================
  const navbar = document.getElementById('mainNavbar');
  const navbarCollapse = document.getElementById('navbarContent');
  const navLinks = document.querySelectorAll('.nav-link, .btn-nav-cta, .btn-cta, .btn-cta-secondary');
  const btnBackToTop = document.getElementById('btnBackToTop');

  // Đổi trạng thái Navbar khi cuộn trang
  const handleScroll = () => {
    const scrollY = window.scrollY || window.pageYOffset;

    // Đổi background/shadow navbar khi cuộn hơn 40px
    if (scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Hiển thị nút "Lên đầu trang" khi cuộn hơn 350px
    if (scrollY > 350) {
      btnBackToTop.classList.add('show');
    } else {
      btnBackToTop.classList.remove('show');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Chạy kiểm tra lúc khởi tạo

  // Nút Back to Top cuộn mượt lên đỉnh
  if (btnBackToTop) {
    btnBackToTop.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // Tự động đóng menu trên di động sau khi bấm vào liên kết
  navLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      const targetHref = link.getAttribute('href');

      // Nếu là link neo nội bộ (#...)
      if (targetHref && targetHref.startsWith('#')) {
        const targetElement = document.querySelector(targetHref);
        if (targetElement) {
          e.preventDefault();

          // Đóng menu Bootstrap collapse nếu đang mở trên mobile
          if (navbarCollapse && navbarCollapse.classList.contains('show')) {
            const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
            if (bsCollapse) {
              bsCollapse.hide();
            }
          }

          // Cuộn mượt có bù trừ chiều cao navbar
          const navHeight = navbar ? navbar.offsetHeight : 70;
          const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navHeight + 10;

          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      }
    });
  });

  // ========================================================================
  // 2. HIỆU ỨNG HIỂN THỊ DẦN KHI CUỘN (SCROLL REVEAL)
  // ========================================================================
  const fadeElements = document.querySelectorAll('.fade-in-up');

  if ('IntersectionObserver' in window) {
    const appearOptions = {
      threshold: 0.15,
      rootMargin: '0px 0px -40px 0px'
    };

    const appearOnScroll = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, appearOptions);

    fadeElements.forEach((el) => appearOnScroll.observe(el));
  } else {
    // Trình duyệt cũ không hỗ trợ IntersectionObserver
    fadeElements.forEach((el) => el.classList.add('is-visible'));
  }

  // ========================================================================
  // 3. KIỂM TRA & XỬ LÝ BIỂU MẪU ĐĂNG KÝ (FORM VALIDATION)
  // ========================================================================
  const consultationForm = document.getElementById('consultationForm');
  const fullnameInput = document.getElementById('fullname');
  const phoneInput = document.getElementById('phone');
  const successAlert = document.getElementById('formSuccessAlert');
  const successMessageDetail = document.getElementById('successMessageDetail');
  const btnResetForm = document.getElementById('btnResetForm');
  const submitBtn = document.getElementById('submitBtn');

  // Quy tắc kiểm tra số điện thoại Việt Nam (10 số, đầu số hợp lệ)
  const vnPhoneRegex = /^(0|\+84)[3|5|7|8|9][0-9]{8}$/;

  /**
   * Đồng bộ thuộc tính aria-invalid để tối ưu khả năng tiếp cận (Accessibility)
   * Tuân theo Modern Web Guidance
   */
  const syncAriaInvalid = (input, isInvalid) => {
    if (isInvalid) {
      input.setAttribute('aria-invalid', 'true');
    } else {
      input.removeAttribute('aria-invalid');
    }
  };

  /**
   * Kiểm tra tính hợp lệ của từng trường dữ liệu
   */
  const validateField = (input) => {
    let isValid = true;

    if (input === fullnameInput) {
      const val = input.value.trim();
      isValid = val.length >= 2;
    } else if (input === phoneInput) {
      const val = input.value.replace(/\s+/g, '');
      isValid = vnPhoneRegex.test(val);
    }

    // Hỗ trợ cả CSS :user-invalid và fallback class cho trình duyệt
    input.classList.toggle('user-invalid-fallback', !isValid);
    syncAriaInvalid(input, !isValid);
    return isValid;
  };

  // Lắng nghe sự kiện blur để kiểm tra sau khi người dùng rời khỏi ô nhập liệu
  if (fullnameInput && phoneInput) {
    [fullnameInput, phoneInput].forEach((input) => {
      // Khi người dùng rời ô nhập
      input.addEventListener('blur', () => {
        if (input.value.trim() !== '') {
          validateField(input);
        }
      });

      // Khi người dùng đang nhập lại thì xóa cảnh báo lỗi
      input.addEventListener('input', () => {
        if (input.classList.contains('user-invalid-fallback')) {
          validateField(input);
        }
      });
    });
  }

  // Xử lý khi nhấn nút gửi biểu mẫu
  if (consultationForm) {
    consultationForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Kiểm tra tất cả các trường
      const isNameValid = validateField(fullnameInput);
      const isPhoneValid = validateField(phoneInput);

      if (!isNameValid || !isPhoneValid) {
        // Tự động focus vào ô bị lỗi đầu tiên
        if (!isNameValid) {
          fullnameInput.focus();
        } else {
          phoneInput.focus();
        }
        return;
      }

      // Mô phỏng trạng thái tải khi gửi yêu cầu
      const originalBtnHtml = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
        Đang gửi yêu cầu...
      `;

      setTimeout(() => {
        const clientName = fullnameInput.value.trim();
        const clientPhone = phoneInput.value.trim();
        const selectedInterest = document.getElementById('interest')?.value || 'Căn hộ';

        // Cập nhật thông điệp cảm ơn cá nhân hóa
        if (successMessageDetail) {
          successMessageDetail.innerHTML = `
            Cảm ơn <strong>${escapeHtml(clientName)}</strong> đã gửi yêu cầu quan tâm <strong>${escapeHtml(selectedInterest)}</strong>.<br>
            Chuyên viên tư vấn sẽ liên hệ lại tới số <strong>${escapeHtml(clientPhone)}</strong> trong ít phút!
          `;
        }

        // Ẩn form và hiện thông báo thành công
        consultationForm.classList.add('d-none');
        successAlert.classList.remove('d-none');

        // Khôi phục nút
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnHtml;

        // Cuộn nhẹ tới thông báo
        successAlert.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 700);
    });
  }

  // Nút cho phép người dùng gửi thêm một yêu cầu khác
  if (btnResetForm) {
    btnResetForm.addEventListener('click', () => {
      consultationForm.reset();

      // Xóa các trạng thái lỗi
      [fullnameInput, phoneInput].forEach((input) => {
        input.classList.remove('user-invalid-fallback');
        input.removeAttribute('aria-invalid');
      });

      successAlert.classList.add('d-none');
      consultationForm.classList.remove('d-none');
      fullnameInput.focus();
    });
  }

  /**
   * Hàm lọc mã HTML để phòng tránh XSS
   */
  function escapeHtml(string) {
    const div = document.createElement('div');
    div.innerText = string;
    return div.innerHTML;
  }
});
