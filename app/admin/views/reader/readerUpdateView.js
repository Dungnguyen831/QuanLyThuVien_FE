class ReaderUpdateView {
  constructor() {
    this.form = document.getElementById("updateReaderForm");
    this.inputFullName = document.getElementById("fullName");
    this.inputEmail = document.getElementById("email");
    this.inputPhone = document.getElementById("phone");
    this.inputPassword = document.getElementById("password");
    // Xóa inputRole, thêm inputMsv
    this.inputMsv = document.getElementById("msvInput");
    this.btnSave = document.getElementById("btnSave");
  }

  // Hàm chỉ làm đúng 1 việc: Đổ dữ liệu vào Form
  fillForm(reader) {
    if (!reader) return;
    this.inputFullName.value = reader.fullName || "";
    this.inputEmail.value = reader.email || "";
    this.inputPhone.value = reader.phone || "";

    // Đổ dữ liệu Mã sinh viên vào ô
    if (this.inputMsv) {
      this.inputMsv.value = reader.msv || "";
    }

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

        // Lấy MSV (Nếu xóa trắng đi thì nó sẽ gửi null xuống Backend)
        msv: this.inputMsv ? this.inputMsv.value.trim() || null : null,
      };

      // Nếu ô mật khẩu có chữ thì mới gửi đi, không thì thôi để Backend giữ nguyên mk cũ
      const pwd = this.inputPassword.value.trim();
      if (pwd !== "") {
        data.password = pwd;
      }

      handler(data);
    });
  }
}
