class ReaderController {
  constructor(model, view) {
    this.model = model;
    this.view = view;
    this.currentReaders = [];
    this.filteredReaders = [];
    this.currentPage = 1;
    this.itemsPerPage = 10;
  }

  async init() {
    this.view.setupUIState();
    try {
      await this.loadReaders();
      this.bindEvents();
    } catch (error) {
      console.error("Lỗi khởi tạo ReaderController:", error);
    }
  }

  async loadReaders() {
    try {
      this.currentReaders = await this.model.fetchReaders("user");
      this.filteredReaders = this.currentReaders;
      this.currentPage = 1;
      this.renderCurrentPage();
    } catch (error) {
      console.error("Lỗi tải danh sách độc giả:", error);
      alert("Không thể tải dữ liệu. Vui lòng kiểm tra lại Token hoặc kết nối!");
    }
  }

  renderCurrentPage() {
    const total = this.filteredReaders.length;
    const readersToShow = this.model.getReadersByPage(
      this.filteredReaders,
      this.currentPage,
      this.itemsPerPage,
    );
    this.view.renderReaders(readersToShow);
    this.view.renderPagination(
      total,
      this.currentPage,
      this.itemsPerPage,
      (page) => {
        this.currentPage = page;
        this.renderCurrentPage();
      },
    );
    this.view.updatePaginationText(total, this.currentPage, this.itemsPerPage);
  }
  applyFilters(keywords, status) {
    this.currentPage = 1;
    this.filteredReaders = this.model.filterReaders(this.currentReaders, {
      query: keywords,
      status: status,
    });
    this.renderCurrentPage();
  }

  bindEvents() {
    this.view.bindSearch((keywords, status) => {
      this.applyFilters(keywords, status);
    });
    this.view.bindEditReader((id) => this.handleOpenEditModal(id));
    this.view.bindDeleteReader((id) => this.handleDeleteReader(id));
    this.view.bindToggleStatus((id, newStatus) =>
      this.handleChangeStatus(id, newStatus),
    );
    this.view.bindUpdateMsv((id, newMsv) => this.handleUpdateMsv(id, newMsv));
  }

  handleOpenEditModal(id) {
    window.location.href = `readerUpdate.html?id=${id}`;
  }

  async handleChangeStatus(id, newStatus) {
    if (
      confirm(
        `Bạn có chắc muốn chuyển trạng thái tài khoản này thành ${newStatus === "ACTIVE" ? "Hoạt động" : "Khóa"}?`,
      )
    ) {
      try {
        await this.model.changeStatus(id, newStatus);
        await this.loadReaders();
        alert("Cập nhật trạng thái thành công!");
      } catch (error) {
        alert(error.message);
      }
    }
  }

  async handleDeleteReader(id) {
    if (confirm(`Xác nhận xóa vĩnh viễn độc giả ID: #${id}?`)) {
      try {
        await this.model.deleteReader(id);
        await this.loadReaders();
        alert("Xóa thành công!");
      } catch (err) {
        alert(err.message);
      }
    }
  }

  async handleUpdateMsv(id, newMsv) {
    try {
      // 1. Gọi API ở Model
      await this.model.updateMsv(id, newMsv);

      // 2. Báo thành công và đóng Popup
      alert("Cập nhật Mã sinh viên thành công!");
      this.view.closeMsvModal();

      // 3. Tải lại danh sách để bảng cập nhật liền tay
      await this.loadReaders();
    } catch (error) {
      alert(error.message); // Nếu trùng MSV, backend sẽ báo lỗi ra đây
    }
  }

  async initUpdatePage() {
    const id = new URLSearchParams(window.location.search).get("id");
    if (!id) return;
    try {
      const reader = await this.model.fetchReaderById(id);
      // Gọi View để điền dữ liệu
      this.view.fillForm(reader);

      // Lắng nghe sự kiện lưu
      this.view.bindSubmit(async (data) => {
        await this.model.updateReader(id, data);
        alert("Cập nhật thành công!");
        window.location.href = "reader.html";
      });
    } catch (error) {
      console.error("Lỗi:", error);
    }
  }
}
