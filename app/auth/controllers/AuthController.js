class AuthController {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    // Liên kết các sự kiện từ View về Controller
    this.view.bindLogin(this.handleLogin.bind(this));
    this.view.bindRegister(this.handleRegister.bind(this));
  }

  // Xử lý logic Đăng nhập
  async handleLogin(email, password) {
    try {
      const result = await this.model.login(email, password);

      // ✅ SECURITY: Only store JWT token
      // Backend extracts userId from token - never trust frontend userId
      localStorage.setItem("token", result.token);

      // Store minimal user info (without userId to prevent IDOR attacks)
      if (result.user) {
        localStorage.setItem("user", JSON.stringify(result.user));
      }

      // Chuyển hướng tới trang Dashboard của Admin hoặc trang chủ dựa trên Role
      if (result.user.role === "admin") {
        window.location.href = "/app/admin/views/dashboard/admin.html";
      } else {
        window.location.href = "/app/user/views/home/home.html"; 
      }
    } catch (error) {
      this.view.showError(error.message);
    }
  }

  // ✅ NEW: Xử lý logic Đăng xuất (Logout)
  handleLogout() {
    // ✅ SECURITY: Clear all sensitive data on logout
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userId"); // Remove any stored userId

    // Redirect to login
    window.location.href = "/app/auth/views/login.html";
  }

  // ✅ NEW: Xử lý 401 Unauthorized (session expired)
  handleSessionExpired() {
    // ✅ SECURITY: Clear session and redirect to login on 401
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userId");

    alert("Your session has expired. Please log in again.");
    window.location.href = "/app/auth/views/login.html";
  }

  // Xử lý logic Đăng ký
  async handleRegister(userData) {
    try {
      await this.model.register(userData);
      alert("Đăng ký thành công! Vui lòng đăng nhập.");
      window.location.href = "login.html";
    } catch (error) {
      this.view.showError(error.message);
    }
  }
}
