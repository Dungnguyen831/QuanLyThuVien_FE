document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("register-form");
  if (!form) return;
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    clearAllErrors();
    const isFullNameValid = validateFullName();
    const isEmailValid = validateEmail();
    const isPhoneValid = validatePhone();
    const isPasswordValid = validatePassword();
    const isConfirmPasswordValid = validateConfirmPassword();
    const areTermsAgreed = validateTerms();
    if (
      isFullNameValid &&
      isEmailValid &&
      isPhoneValid &&
      isPasswordValid &&
      isConfirmPasswordValid &&
      areTermsAgreed
    ) {
      console.log("Form hợp lệ, đang tiến hành đăng ký...");
      const formData = new FormData(form);
      const userData = Object.fromEntries(formData.entries());
      if (window.app && typeof window.app.handleRegister === "function") {
        window.app.handleRegister(userData);
      } else {
        console.error("AuthController (app) is not available.");
        alert("Có lỗi xảy ra, không thể đăng ký.");
      }
    } else {
      console.log("Form có lỗi, vui lòng kiểm tra lại.");
    }
  });

  function validateFullName() {
    const input = form.querySelector('input[name="fullName"]');
    if (input.value.trim() === "") {
      showError(input, "Vui lòng nhập họ và tên.");
      return false;
    }
    return true;
  }

  function validateEmail() {
    const input = form.querySelector('input[name="email"]');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (input.value.trim() === "") {
      showError(input, "Vui lòng nhập địa chỉ email.");
      return false;
    }
    if (!emailRegex.test(input.value.trim())) {
      showError(input, "Địa chỉ email không hợp lệ.");
      return false;
    }
    return true;
  }

  function validatePhone() {
    const input = form.querySelector('input[name="phone"]');
    if (input.value.trim() === "") {
      showError(input, "Vui lòng nhập số điện thoại.");
      return false;
    }
    return true;
  }

  function validatePassword() {
    const input = form.querySelector('input[name="password"]');
    if (input.value.trim().length < 8) {
      showError(input, "Mật khẩu phải có ít nhất 8 ký tự.");
      return false;
    }
    return true;
  }

  function validateConfirmPassword() {
    const passwordInput = form.querySelector('input[name="password"]');
    const confirmInput = form.querySelector('input[name="confirm_password"]');
    if (confirmInput.value.trim() === "") {
      showError(confirmInput, "Vui lòng xác nhận mật khẩu.");
      return false;
    }
    if (passwordInput.value.trim() !== confirmInput.value.trim()) {
      showError(confirmInput, "Mật khẩu xác nhận không khớp.");
      return false;
    }
    return true;
  }

  function validateTerms() {
    const checkbox = form.querySelector("#terms");
    if (!checkbox.checked) {
      alert("Bạn phải đồng ý với Điều khoản Dịch vụ và Chính sách Bảo mật.");
      return false;
    }
    return true;
  }

  // --- CÁC HÀM HỖ TRỢ ---

  function showError(inputElement, message) {
    const inputGroup = inputElement.closest(".input-group");
    const errorElement = inputGroup.querySelector(".error-message");
    errorElement.innerText = message;
  }

  function clearAllErrors() {
    const errorElements = form.querySelectorAll(".error-message");
    errorElements.forEach((el) => (el.innerText = ""));
  }
});
