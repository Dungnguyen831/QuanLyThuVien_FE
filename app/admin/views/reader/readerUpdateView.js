class ReaderUpdateView {
  constructor() {
    this.form = document.getElementById("updateReaderForm");
    this.inputFullName = document.getElementById("fullName");
    this.inputEmail = document.getElementById("email");
    this.inputPhone = document.getElementById("phone");
    this.inputPassword = document.getElementById("password");
    this.inputRole = document.getElementById("roleName");
    this.btnSave = document.getElementById("btnSave");
  }

  // Hàm chỉ làm đúng 1 việc: Đổ dữ liệu vào Form
  fillForm(reader) {
    if (!reader) return;
    this.inputFullName.value = reader.fullName || "";
    this.inputEmail.value = reader.email || "";
    this.inputPhone.value = reader.phone || "";
    this.inputRole.value = (reader.roleName || "USER").toUpperCase();

    const label = document.getElementById("reader-id-label");
    if (label) label.textContent = `Đang chỉnh sửa mã thẻ: #${reader.id}`;
  }

  bindSubmit(handler) {
    this.form?.addEventListener("submit", (e) => {
      e.preventDefault();
      const data = {
        full_name: this.inputFullName.value.trim(),
        email: this.inputEmail.value,
        phone: this.inputPhone.value.trim(),
        roleName: this.inputRole.value,
        password: this.inputPassword.value.trim(),
      };
      handler(data);
    });
  }
}
