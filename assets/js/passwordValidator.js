// File: /assets/js/passwordValidator.js
const PasswordValidator = {
  validate: function (form) {
    // Xóa hết các lỗi đỏ cũ trước khi kiểm tra lại
    this.clearAllErrors(form);
    let isValid = true;

    // Lấy các ô nhập liệu
    const oldPass = form.querySelector('input[name="oldPassword"]');
    const newPass = form.querySelector('input[name="newPassword"]');
    const confirmPass = form.querySelector('input[name="confirmPassword"]');

    // 1. Kiểm tra rỗng mật khẩu cũ
    if (oldPass.value.trim() === "") {
      this.showError(oldPass, "Vui lòng nhập mật khẩu hiện tại.");
      isValid = false;
    }

    // 2. Kiểm tra độ dài mật khẩu mới
    if (newPass.value.trim() === "") {
      this.showError(newPass, "Vui lòng nhập mật khẩu mới.");
      isValid = false;
    } else if (newPass.value.trim().length < 8) {
      this.showError(newPass, "Mật khẩu mới phải có ít nhất 8 ký tự.");
      isValid = false;
    }

    // 3. Kiểm tra khớp mật khẩu xác nhận
    if (confirmPass.value.trim() === "") {
      this.showError(confirmPass, "Vui lòng xác nhận mật khẩu mới.");
      isValid = false;
    } else if (newPass.value !== confirmPass.value) {
      this.showError(confirmPass, "Mật khẩu xác nhận không khớp.");
      isValid = false;
    }

    return isValid; // Trả về true nếu mọi thứ đều hợp lệ
  },

  // Hàm phụ trợ: Hiển thị chữ đỏ
  showError: function (input, message) {
    const errorEl = input
      .closest(".form-group")
      .querySelector(".error-message");
    if (errorEl) {
      errorEl.innerText = message;
    }
  },

  // Hàm phụ trợ: Xóa sạch chữ đỏ
  clearAllErrors: function (form) {
    const errors = form.querySelectorAll(".error-message");
    errors.forEach((el) => (el.innerText = ""));
  },
};
