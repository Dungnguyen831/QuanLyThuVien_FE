class LoanController {
  constructor(model, view) {
    this.model = model;
    this.view = view;
    this.allLoans = [];
    
    // Liên kết sự kiện tạo mới (Code cũ)
    this.view.bindAddLoan(this.handleAddLoan.bind(this));
    
    // LIÊN KẾT CÁC SỰ KIỆN MỚI
    this.view.bindTableActions(this.handleDeleteLoan.bind(this));
    this.view.bindSubmitRenew(this.handleRenewLoan.bind(this));
    this.view.bindSubmitReturn(this.handleReturnLoan.bind(this));
  }

  async init() {
    await this.loadLoans(); // Tách phần load bảng ra dùng chung
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
    if (!keyword) {
      this.view.renderLoans(this.allLoans);
      return;
    }

    const filteredLoans = this.allLoans.filter(loan => {
      const idText = loan.id ? loan.id.toString().toLowerCase() : "";
      const nameText = loan.userName ? loan.userName.toLowerCase() : "";
      return idText.includes(keyword) || nameText.includes(keyword);
    });

    this.view.renderLoans(filteredLoans);
  }

  async loadLoans() {
    try {
      const loans = await this.model.fetchLoans();
      this.allLoans = loans || [];
      this.view.renderLoans(this.allLoans);
    } catch (error) {
      console.error("Lỗi khi tải danh sách:", error);
    }
  }

  async handleAddLoan(loanData) {
    try {
      await this.model.createLoan(loanData);
      alert("Tạo phiếu mượn thành công!");
      this.view.closeAddModal(); 
      await this.loadLoans(); // Tải lại bảng
    } catch (error) {
      alert("Lỗi: " + error.message); 
    }
  }

  async handleDeleteLoan(rawId) {
    try {
      // Làm sạch ID: Loại bỏ tất cả chữ cái, chỉ giữ lại số (Ví dụ: "MP011" -> "11")
      const cleanId = rawId.toString().replace(/\D/g, ''); 

      await this.model.deleteLoan(cleanId); // Gọi API với ID chuẩn
      alert("Xóa phiếu mượn thành công!");
      await this.loadLoans(); // Tải lại bảng
    } catch (error) {
      alert("Lỗi khi xóa: " + error.message);
    }
  }

  async handleRenewLoan(rawDetailId, requestData) {
    try {
      // Làm sạch ID phòng trường hợp detailId cũng bị dính chữ
      const cleanDetailId = rawDetailId.toString().replace(/\D/g, '');

      await this.model.renewBook(cleanDetailId, requestData);
      alert("Gia hạn sách thành công!");
      this.view.closeRenewModal();
      await this.loadLoans(); 
    } catch (error) {
      alert("Lỗi gia hạn: " + error.message);
    }
  }

  async handleReturnLoan(rawDetailId, requestData) {
    try {
      // Làm sạch ID phòng trường hợp detailId cũng bị dính chữ
      const cleanDetailId = rawDetailId.toString().replace(/\D/g, '');

      await this.model.returnBook(cleanDetailId, requestData);
      alert("Trả sách thành công!");
      this.view.closeReturnModal();
      await this.loadLoans(); 
    } catch (error) {
      alert("Lỗi trả sách: " + error.message);
    }
  }
}