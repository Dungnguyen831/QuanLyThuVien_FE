// Chờ cho toàn bộ trang được tải xong
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("register-form");
  if (!form) return;

  // Lắng nghe sự kiện khi người dùng bấm nút submit form
  form.addEventListener("submit", function (event) {
    // Chặn hành động submit mặc định của form để chúng ta kiểm tra trước
    event.preventDefault();
    // Xóa các thông báo lỗi cũ
    clearAllErrors();

    // Thực hiện tất cả các kiểm tra và lấy kết quả
    const isFullNameValid = validateFullName();
    const isEmailValid = validateEmail();
    const isPhoneValid = validatePhone();
    const isPasswordValid = validatePassword();
    const isConfirmPasswordValid = validateConfirmPassword();
    const areTermsAgreed = validateTerms();

    // Nếu tất cả các kiểm tra đều hợp lệ...
    if (
      isFullNameValid &&
      isEmailValid &&
      isPhoneValid &&
      isPasswordValid &&
      isConfirmPasswordValid &&
      areTermsAgreed
    ) {
      // ...thì cho phép form được submit (dữ liệu sẽ được gửi đi)
      // Lưu ý: Trong kiến trúc MVC của bạn, AuthController sẽ xử lý bước tiếp theo
      console.log("Form hợp lệ, đang tiến hành đăng ký...");
      // Bạn có thể gọi trực tiếp hàm xử lý đăng ký của controller ở đây nếu cần
      // Ví dụ: app.handleRegister(lấy dữ liệu từ form);
      // Nếu không, bạn có thể gọi form.submit() để submit theo cách truyền thống.
      // Trong trường hợp này, chúng ta sẽ để cho logic MVC hiện tại của bạn tiếp tục.
      // Để làm điều đó, chúng ta cần tìm và kích hoạt lại listener của AuthView.
      // Tuy nhiên, cách đơn giản nhất là gọi trực tiếp hàm xử lý của controller.

      // Lấy dữ liệu từ form
      const formData = new FormData(form);
      const userData = Object.fromEntries(formData.entries());

      // Giả định 'app' là biến toàn cục đã được khởi tạo trong register.html
      // và có phương thức handleRegister
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

  // --- CÁC HÀM KIỂM TRA CHI TIẾT ---

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
    // Có thể thêm kiểm tra định dạng số điện thoại ở đây
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
      // Hiển thị lỗi cho checkbox có thể cần một vị trí khác
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
