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

      // Lưu token hoặc thông tin người dùng vào LocalStorage
      localStorage.setItem("user", JSON.stringify(result.user));
      localStorage.setItem("token", result.token);

      // Chuyển hướng tới trang Dashboard của Admin hoặc trang chủ dựa trên Role
      if (result.user.role === "admin") {
        // window.location.href = "/app/admin/views/dashboard/admin.html";
        window.location.href = "/app/admin/views/loan/loan.html";
      } else {
        window.location.href = "/app/admin/views/inventory/inventory.html"; // Hoặc trang chủ người dùng nếu có
      }
    } catch (error) {
      this.view.showError(error.message);
    }
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
