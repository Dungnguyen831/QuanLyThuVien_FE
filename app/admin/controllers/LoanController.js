class LoanController {
  constructor(model, view) {
    this.model = model;
    this.view = view;
    // Liên kết sự kiện từ View đến Controller
    this.view.bindAddLoan(this.handleAddLoan.bind(this));
  }

  async init() {
    // 1. Gọi Model lấy danh sách từ API
    const loans = await this.model.fetchLoans();
    if (!loans) {
      console.error("Không thể lấy dữ liệu mượn trả.");
    } else {
      console.log("Dữ liệu mượn trả:", loans);
    }
  }

  async handleAddLoan(loanData) {
    try {
      await this.model.createLoan(loanData);
      alert("Tạo phiếu mượn thành công!");

      this.view.closeAddModal(); // Đóng Modal
      await this.loadLoans(); // Tự động tải lại bảng dữ liệu
    } catch (error) {
      alert("Lỗi: " + error.message); // Hiển thị lỗi từ Backend
    }
  }

  async loadLoans() {
    try {
      // Lấy dữ liệu từ Model và ném sang cho View để vẽ bảng
      const loans = await this.model.fetchLoans();
      this.view.renderLoans(loans);
    } catch (error) {
      console.error("Lỗi khi tải danh sách:", error);
    }
  }
}
