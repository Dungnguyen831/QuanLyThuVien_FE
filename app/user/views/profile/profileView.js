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

    // Ẩn/hiện các nút tương ứng
    if (isEditing) {
      this.btnEdit.classList.add("d-none"); // Ẩn nút Sửa
      this.btnSave.classList.remove("d-none"); // Hiện nút Lưu
      this.btnCancel.classList.remove("d-none"); // Hiện nút Hủy
    } else {
      this.btnEdit.classList.remove("d-none");
      this.btnSave.classList.add("d-none");
      this.btnCancel.classList.add("d-none");

      // Khôi phục giá trị password về rỗng khi thoát chế độ sửa
      if (this.inputPassword) this.inputPassword.value = "";
    }
  }

  // Lắng nghe sự kiện click nút Chỉnh sửa
  bindEdit(handler) {
    this.btnEdit?.addEventListener("click", (e) => {
      e.preventDefault();
      this.setEditMode(true);
      if (handler) handler();
    });
  }

  // Lắng nghe sự kiện click nút Hủy
  bindCancel(handler) {
    this.btnCancel?.addEventListener("click", (e) => {
      e.preventDefault();

      // Phục hồi lại dữ liệu cũ
      const originalData = JSON.parse(this.form.dataset.originalData || "{}");
      this.fillForm(originalData); // fillForm sẽ tự động gọi setEditMode(false)

      if (handler) handler();
    });
  }

  // Lắng nghe Submit (Lưu)
  bindSubmit(handler) {
    this.form?.addEventListener("submit", (e) => {
      e.preventDefault();
      const data = {
        full_name: this.inputFullName.value.trim(),
        email: this.inputEmail.value,
        phone: this.inputPhone.value.trim(),
        password: this.inputPassword.value.trim(),
      };
      handler(data);
    });
  }

  setLoading(isLoading) {
    this.btnSave.disabled = isLoading;
    this.btnCancel.disabled = isLoading;
    this.btnSave.innerHTML = isLoading
      ? '<i class="fas fa-spinner fa-spin me-2"></i>Đang lưu...'
      : '<i class="fas fa-save me-2"></i>Lưu thay đổi';
  }
}
