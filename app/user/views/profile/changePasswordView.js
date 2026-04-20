// File: /app/user/views/profile/changePasswordView.js
class ChangePasswordView {
  constructor() {
    this.form = document.getElementById("changePasswordForm");
    this.oldPasswordInput = document.getElementById("oldPassword");
    this.newPasswordInput = document.getElementById("newPassword");
    this.btnSubmit = document.getElementById("btnSubmitPassword");
  }

  // bindSubmit(handler) {
  //   if (!this.form) return;

  //   // SỬA LỖI CHÍ MẠNG: Lắng nghe sự kiện của Form, không phải của nút
  //   this.form.addEventListener("submit", (e) => {
  //     e.preventDefault(); // CÁI PHANH TAY CHẶN URL LÀ Ở ĐÂY

  //     const oldPassword = this.oldPasswordInput.value.trim();
  //     const newPassword = this.newPasswordInput.value.trim();

  //     const updateData = {
  //       oldPassword: oldPassword,
  //       newPassword: newPassword,
  //     };

  //     // Truyền cả formElement để Controller còn check lỗi chữ đỏ
  //     handler(this.form, updateData);
  //   });
  // }
  bindSubmit(handler) {
    if (!this.btnSubmit) return;

    // ĐỔI TỪ NGHE "SUBMIT" CỦA FORM -> SANG NGHE "CLICK" CỦA NÚT
    this.btnSubmit.addEventListener("click", (e) => {
      e.preventDefault();

      const oldPassword = this.oldPasswordInput.value.trim();
      const newPassword = this.newPasswordInput.value.trim();

      const updateData = {
        oldPassword: oldPassword,
        newPassword: newPassword,
      };

      // Vẫn ném this.form sang cho Controller để nó gọi Validator check chữ đỏ
      handler(this.form, updateData);
    });
  }

  setLoading(isLoading) {
    if (isLoading) {
      this.btnSubmit.innerHTML =
        '<i class="fas fa-spinner fa-spin"></i> Đang xử lý...';
      this.btnSubmit.disabled = true;
      this.btnSubmit.style.opacity = "0.7";
    } else {
      this.btnSubmit.innerHTML = "Cập nhật mật khẩu";
      this.btnSubmit.disabled = false;
      this.btnSubmit.style.opacity = "1";
    }
  }
}
