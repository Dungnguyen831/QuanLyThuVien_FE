class AuthView {
  constructor() {
    // Lấy các elements (sẽ null nếu không tồn tại ở trang HTML hiện tại)
    this.loginForm = document.getElementById("login-form");
    this.registerForm = document.getElementById("register-form");
    this.errorMessageElement = document.getElementById("auth-error-message");
  }

  // Bắt sự kiện Submit Form Đăng nhập
  bindLogin(handler) {
    if (this.loginForm) {
      this.loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        // Lấy dữ liệu qua name của input
        const formData = new FormData(this.loginForm);
        const email = formData.get("email");
        const password = formData.get("password");
        handler(email, password);
      });
    }
  }

  // Bắt sự kiện Submit Form Đăng ký
  bindRegister(handler) {
    if (this.registerForm) {
      this.registerForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const formData = new FormData(this.registerForm);
        const userData = {
          fullName: formData.get("fullName"),
          email: formData.get("email"),
          password: formData.get("password"),
          phone: formData.get("phone"),
        };

        // Kiểm tra khớp mật khẩu tại Frontend
        const confirmPassword = formData.get("confirm_password");
        if (userData.password !== confirmPassword) {
          this.showError("Mật khẩu xác nhận không khớp!");
          return;
        }

        handler(userData);
      });
    }
  }

  // Hiển thị thông báo (Dùng alert hoặc in ra thẻ div error)
  showError(message) {
    if (this.errorMessageElement) {
      this.errorMessageElement.textContent = message;
      this.errorMessageElement.style.display = "block";
    } else {
      alert(message); // Dự phòng hiển thị bằng alert
    }
  }
}
