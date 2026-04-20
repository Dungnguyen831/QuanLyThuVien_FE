// File: /app/user/controllers/profile/ProfileController.js
class ProfileController {
  constructor(model, view) {
    this.model = model;
    this.view = view;
    this.savedUser = JSON.parse(localStorage.getItem("user") || "{}");
    this.userId = this.savedUser.id;
  }

  fillForm() {
    this.view.fillForm(this.savedUser);
  }

  async init() {
    if (!this.userId) {
      alert("Vui lòng đăng nhập để thực hiện chức năng này!");
      window.location.href = "/app/auth/views/login.html";
      return;
    }

    //this.view.fillform(this.savedUser);

    this.view.bindSubmit(async (formElement, updateData) => {
      // 1. Kiểm tra Validate (Mật khẩu < 8 ký tự sẽ bị chặn ở đây)
      if (
        typeof PasswordValidator !== "undefined" &&
        !PasswordValidator.validate(formElement)
      ) {
        return;
      }
      // 2. Gọi API thông qua Model
      this.view.setLoading(true);
      try {
        // GỌI ĐÚNG HÀM resetPassword CỦA USER (Chứ không gọi resetPassword của Admin)
        await this.model.resetPassword(this.userId, updateData);
        alert(
          "Đổi mật khẩu thành công! Vui lòng đăng nhập lại để đảm bảo an toàn.",
        );
        localStorage.clear(); // Xóa tài khoản cũ đi
        window.location.href = "/app/auth/views/login.html"; // Đá ra trang Login
      } catch (err) {
        // Hứng lỗi (vd: Mật khẩu cũ sai)
        alert("Lỗi: " + err.message);
      } finally {
        this.view.setLoading(false);
      }
    });
  }
}
