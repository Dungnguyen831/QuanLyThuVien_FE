class LoanController {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    this.allLoans = [];
    // Liên kết sự kiện từ View đến Controller
    this.view.bindAddLoan(this.handleAddLoan.bind(this));
  }

  async init() {
    // 1. Gọi Model lấy danh sách từ API
    const loans = await this.model.fetchLoans();

    this.allLoans = loans || [];
    if (!loans) {
      console.error("Không thể lấy dữ liệu mượn trả.");
    } else {
      console.log("Dữ liệu mượn trả:", loans);
    }
    this.view.renderLoans(loans);
    this.setupSearch(); 
  }

  setupSearch() {
    const searchInput = document.getElementById('search-loan-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        const keyword = e.target.value.toLowerCase().trim();
        this.handleSearch(keyword);
      });
    }
  }

  handleSearch(keyword) {
    // Nếu keyword rỗng, hiển thị lại toàn bộ
    if (!keyword) {
      this.view.renderLoans(this.allLoans);
      return;
    }

    // Lọc mảng allLoans xem có chứa keyword không (tìm theo Mã phiếu hoặc Tên độc giả)
    const filteredLoans = this.allLoans.filter(loan => {
      // Đảm bảo không bị lỗi nếu trường dữ liệu bị null (VD: loan.id hoặc loan.userName)
      const idText = loan.id ? loan.id.toLowerCase() : "";
      const nameText = loan.userName ? loan.userName.toLowerCase() : "";
      
      return idText.includes(keyword) || nameText.includes(keyword);
    });

    // Gọi View vẽ lại bảng bằng cục dữ liệu đã được lọc
    this.view.renderLoans(filteredLoans);
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
      this.allLoans = await this.model.fetchLoans();
      // Lấy dữ liệu từ Model và ném sang cho View để vẽ bảng
      const loans = await this.model.fetchLoans();
      this.view.renderLoans(loans);
    } catch (error) {
      console.error("Lỗi khi tải danh sách:", error);
    }
  }
}
