class LoanController {
  constructor(model, view) {
    this.model = model;
    this.view = view;
  }

  async init() {
    // 1. Gọi Model lấy danh sách từ API
    const loans = await this.model.fetchLoans();
    if (!loans) {
      console.error("Không thể lấy dữ liệu mượn trả.");
    } else {
      console.log("Dữ liệu mượn trả:", loans);
    }
    // 2. Gọi View để in ra màn hình
    this.view.renderLoans(loans);
  }
}
