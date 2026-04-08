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

  bindEvents() {
    // 1. Lọc và tìm kiếm
    const searchInput = document.getElementById("searchInput");
    const filterStatus = document.getElementById("filterStatus");
    const applyFilters = () => {
      this.currentPage = 1;
      this.filteredReaders = this.model.filterReaders(this.currentReaders, {
        query: searchInput?.value,
        status: filterStatus?.value,
      });
      this.renderCurrentPage();
    };

    searchInput?.addEventListener("input", applyFilters);
    filterStatus?.addEventListener("change", applyFilters);

    // 2. Lắng nghe click trên bảng (Sửa, Khóa/Mở, Xóa)
    this.view.tableBody.addEventListener("click", (e) => {
      const btnEdit = e.target.closest(".btn-edit-reader");
      const btnDelete = e.target.closest(".btn-delete-reader");
      const btnToggle = e.target.closest(".btn-toggle-status");

      if (btnEdit) this.handleOpenEditModal(btnEdit.dataset.id);
      if (btnDelete) this.handleDeleteReader(btnDelete.dataset.id);
      if (btnToggle)
        this.handleChangeStatus(btnToggle.dataset.id, btnToggle.dataset.status);
    });

    // 3. Nút thêm mới
    document
      .getElementById("btnAddNewReader")
      ?.addEventListener("click", () => {
        document.getElementById("addReaderForm")?.reset();
        bootstrap.Modal.getOrCreateInstance(
          document.getElementById("addReaderModal"),
        ).show();
      });
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

  async initUpdatePage() {
    const id = new URLSearchParams(window.location.search).get("id");
    if (!id) return;
    try {
      // Sử dụng đúng hàm fetchReaderById có sẵn trong Model của bạn
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
