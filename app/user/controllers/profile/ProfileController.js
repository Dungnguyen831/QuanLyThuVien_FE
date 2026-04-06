// File: /app/user/controllers/ProfileController.js
class ProfileController {
  constructor(model, view) {
    this.model = model;
    this.view = view;
    // Lấy thông tin user từ LocalStorage
    this.savedUser = JSON.parse(localStorage.getItem("user") || "{}");
    this.userId = this.savedUser.id;
  }

  async init() {
    if (!this.userId) {
      alert("Vui lòng đăng nhập để xem hồ sơ!");
      window.location.href = "/login.html";
      return;
    }

    // 1. Dùng dữ liệu từ LocalStorage để hiện ngay lập tức (như bạn yêu cầu lúc nãy)
    this.view.fillForm(this.savedUser);

    // 2. Lắng nghe các nút (Bật chế độ sửa / Hủy)
    this.view.bindEdit();
    this.view.bindCancel();

    // 3. Xử lý khi bấm Lưu
    this.view.bindSubmit(async (updatedData) => {
      this.view.setLoading(true);
      try {
        // Gọi API lên Server
        await this.model.updateReader(this.userId, updatedData);

        // Cập nhật lại LocalStorage
        const newUserToSave = {
          ...this.savedUser,
          fullName: updatedData.full_name,
          phone: updatedData.phone,
        };
        localStorage.setItem("user", JSON.stringify(newUserToSave));

        alert("Cập nhật thông tin thành công!");

        // Cập nhật lại giao diện và tắt chế độ sửa
        this.savedUser = newUserToSave;
        this.view.fillForm(this.savedUser);
      } catch (err) {
        alert("Lỗi: " + err.message);
      } finally {
        this.view.setLoading(false);
      }
    });
  }
}
