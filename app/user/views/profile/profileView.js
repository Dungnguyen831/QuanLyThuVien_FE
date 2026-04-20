// File: /app/user/views/ProfileView.js
class ProfileView {
  constructor() {
    this.form = document.getElementById("profileForm");
    this.inputFullName = document.getElementById("fullName");
    this.inputEmail = document.getElementById("email");
    this.inputPhone = document.getElementById("phone");
    this.inputPassword = document.getElementById("password");
    // Các nút bấm
    this.btnEdit = document.getElementById("btnEdit"); // Nút mở khóa
    this.btnSave = document.getElementById("btnSave"); // Nút lưu
    this.btnCancel = document.getElementById("btnCancel"); // Nút hủy (ẩn lúc đầu)
    this.displayName = document.getElementById("displayName");
    // Mảng chứa các ô input có thể sửa được
    this.editableInputs = [
      this.inputFullName,
      this.inputPhone,
      this.inputPassword,
    ];
  }

  // Đổ dữ liệu vào Form
  fillForm(user) {
    if (!user) return;
    this.inputFullName.value = user.fullName || "";
    this.inputEmail.value = user.email || "";
    this.inputPhone.value = user.phone || "";
    if (this.displayName) this.displayName.textContent = user.fullName;

    // Gán dữ liệu ban đầu vào dataset để dùng khi bấm Hủy
    this.form.dataset.originalData = JSON.stringify(user);

    // Mặc định khi load lên là Khóa (Chế độ Xem)
    this.setEditMode(false);
  }

  // Hàm bật/tắt chế độ chỉnh sửa
  setEditMode(isEditing) {
    this.editableInputs.forEach((input) => {
      if (input) {
        input.disabled = !isEditing;
        // Thêm/bỏ class để đổi màu nền (tùy chọn CSS)
        if (isEditing) {
          input.classList.remove("bg-light");
        } else {
          input.classList.add("bg-light");
        }
      }
    });
  }
}
