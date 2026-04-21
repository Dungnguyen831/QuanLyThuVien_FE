class ReaderView {
  constructor() {
    this.tableBody = document.getElementById("reader-table-body");
    this.searchInput = document.getElementById("searchInput");
    this.filterStatus = document.getElementById("filterStatus");
  }
  bindSearch(handler) {
    if (!this.searchInput || !this.filterStatus) return;

    // Tạo một hàm trung gian để BÓC TÁCH lấy chữ (value)
    const handleAction = () => {
      const keywords = this.searchInput.value; // Lấy đúng chữ đang gõ
      const status = this.filterStatus.value; // Lấy đúng trạng thái đang chọn

      // Gửi 2 cái chữ đó lên cho Controller
      handler(keywords, status);
    };

    // Lắng nghe sự kiện
    this.searchInput.addEventListener("input", handleAction);
    this.filterStatus.addEventListener("change", handleAction);
  }

  bindToggleStatus(handler) {
    this.tableBody.addEventListener("click", (e) => {
      const btn = e.target.closest(".btn-toggle-status");
      if (btn) {
        const id = btn.dataset.id;
        const newStatus = btn.dataset.status;
        handler(id, newStatus); // "Gửi tín hiệu" về cho Controller kèm theo ID và trạng thái mới
      }
    });
  }

  bindAddNew(handler) {
    document
      .getElementById("btnAddNewReader")
      ?.addEventListener("click", () => {
        document.getElementById("addReaderForm")?.reset();
        bootstrap.Modal.getOrCreateInstance(
          document.getElementById("addReaderModal"),
        ).show();
      });
  }

  // bindEvents() {
  //   // 1. Lọc và tìm kiếm
  //   const searchInput = document.getElementById("searchInput");
  //   const filterStatus = document.getElementById("filterStatus");
  //   const applyFilters = () => {
  //     this.currentPage = 1;
  //     this.filteredReaders = this.model.filterReaders(this.currentReaders, {
  //       query: searchInput?.value,
  //       status: filterStatus?.value,
  //     });
  //     this.renderCurrentPage();
  //   };

  //   searchInput?.addEventListener("input", applyFilters);
  //   filterStatus?.addEventListener("change", applyFilters);

  //   // 2. Lắng nghe click trên bảng (Sửa, Khóa/Mở, Xóa)
  //   this.view.tableBody.addEventListener("click", (e) => {
  //     const btnEdit = e.target.closest(".btn-edit-reader");
  //     const btnDelete = e.target.closest(".btn-delete-reader");
  //     const btnToggle = e.target.closest(".btn-toggle-status");

  //     if (btnEdit) this.handleOpenEditModal(btnEdit.dataset.id);
  //     if (btnDelete) this.handleDeleteReader(btnDelete.dataset.id);
  //     if (btnToggle)
  //       this.handleChangeStatus(btnToggle.dataset.id, btnToggle.dataset.status);
  //   });

  //   // 3. Nút thêm mới
  //   document
  //     .getElementById("btnAddNewReader")
  //     ?.addEventListener("click", () => {
  //       document.getElementById("addReaderForm")?.reset();
  //       bootstrap.Modal.getOrCreateInstance(
  //         document.getElementById("addReaderModal"),
  //       ).show();
  //     });
  // }

  setupUIState() {
    const headerDisplay = document.getElementById("page-title");
    if (headerDisplay) headerDisplay.textContent = "Quản lý Độc giả";

    document
      .querySelectorAll("#sidebar-wrapper .list-group-item")
      .forEach((el) => el.classList.remove("active"));

    const submenuEl = document.getElementById("readerSubmenu");
    if (submenuEl && typeof bootstrap !== "undefined") {
      bootstrap.Collapse.getOrCreateInstance(submenuEl, {
        toggle: false,
      }).show();
      const parent = document.getElementById("readerParent");
      if (parent) parent.classList.add("active-parent");
    }

    const link = document.querySelector(
      '#sidebar-wrapper a[href="../reader/reader.html"]',
    );
    if (link) link.classList.add("active");
  }

  renderReaders(readers) {
    this.tableBody.innerHTML = "";
    if (!readers || readers.length === 0) {
      // Đổi colspan="7" thành "8" vì mình đã thêm 1 cột MSV
      this.tableBody.innerHTML =
        '<tr><td colspan="8" class="text-center py-4 text-muted">Không tìm thấy độc giả nào</td></tr>';
      return;
    }

    readers.forEach((reader) => {
      const tr = document.createElement("tr");
      tr.setAttribute("data-id", reader.id);

      const isActive =
        reader.status && reader.status.toUpperCase() === "ACTIVE";
      const statusHtml = isActive
        ? `<span class="d-inline-block rounded-circle bg-success me-1" style="width:8px;height:8px"></span><span class="text-success fw-medium">Đang hoạt động</span>`
        : `<span class="d-inline-block rounded-circle bg-danger me-1" style="width:8px;height:8px"></span><span class="text-danger fw-medium">Đã khóa</span>`;

      const lockActionHtml = isActive
        ? `<button class="btn btn-sm btn-light text-warning me-1 btn-toggle-status" data-id="${reader.id}" data-status="INACTIVE" title="Khóa thẻ"><i class="fas fa-lock"></i></button>`
        : `<button class="btn btn-sm btn-light text-success me-1 btn-toggle-status" data-id="${reader.id}" data-status="ACTIVE" title="Mở khóa"><i class="fas fa-unlock"></i></button>`;

      const firstLetter = reader.fullName
        ? reader.fullName.charAt(0).toUpperCase()
        : "R";
      const avatarColor = isActive ? "bg-primary" : "bg-secondary";

      // --- BỔ SUNG LOGIC XỬ LÝ CỘT MÃ SINH VIÊN (MSV) ---
      const msvHtml = reader.msv
        ? `<span class="fw-bold text-primary">${reader.msv}</span>`
        : `<button class="btn btn-sm btn-outline-primary btn-update-msv" data-id="${reader.id}"><i class="fas fa-qrcode me-1"></i> Cập nhật</button>`;

      tr.innerHTML = `
                <td class="ps-4 fw-bold text-dark">#${reader.id}</td>
                <td>
                    <div class="d-flex align-items-center">
                        <div class="${avatarColor} text-white rounded-circle d-flex justify-content-center align-items-center me-3" style="width: 35px; height: 35px; font-weight: bold;">
                            ${firstLetter}
                        </div>
                        <div class="fw-bold text-dark">${reader.fullName || "Chưa cập nhật"}</div>
                    </div>
                </td>
                <td>
                    <div class="small"><i class="fas fa-envelope text-muted me-1"></i> ${reader.email || "---"}</div>
                </td>
                <td>
                    <div class="small mt-1"><i class="fas fa-phone text-muted me-1"></i> ${reader.phone || "---"}</div>
                </td>
                
                <td class="align-middle">${msvHtml}</td> 

                <td><span class="badge rounded-pill bg-info-subtle text-info">Độc giả</span></td>
                <td>${statusHtml}</td>
                <td class="text-end pe-4">
                    <button class="btn btn-sm btn-light text-primary me-1 btn-edit-reader" data-id="${reader.id}" title="Chỉnh sửa"><i class="fas fa-edit"></i></button>
                    ${lockActionHtml}
                    <button class="btn btn-sm btn-light text-danger btn-delete-reader" data-id="${reader.id}" title="Xóa"><i class="fas fa-trash"></i></button>
                </td>
            `;
      this.tableBody.appendChild(tr);
    });
  }

  renderPagination(totalItems, currentPage, itemsPerPage, onPageChange) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const container = document.querySelector(".pagination");
    if (!container) return;

    let html = `
            <li class="page-item ${currentPage === 1 ? "disabled" : ""}">
                <a class="page-link" href="#" data-page="${currentPage - 1}"><i class="fas fa-chevron-left"></i></a>
            </li>`;

    for (let i = 1; i <= totalPages; i++) {
      html += `
                <li class="page-item ${i === currentPage ? "active" : ""}">
                    <a class="page-link" href="#" data-page="${i}">${i}</a>
                </li>`;
    }

    html += `
            <li class="page-item ${currentPage === totalPages || totalPages === 0 ? "disabled" : ""}">
                <a class="page-link" href="#" data-page="${currentPage + 1}"><i class="fas fa-chevron-right"></i></a>
            </li>`;

    container.innerHTML = html;

    container.querySelectorAll(".page-link").forEach((link) => {
      link.onclick = (e) => {
        e.preventDefault();
        const page = parseInt(link.dataset.page);
        if (page >= 1 && page <= totalPages) onPageChange(page);
      };
    });

    this.updatePaginationText(totalItems, currentPage, itemsPerPage);
  }

  updatePaginationText(totalItems, currentPage, itemsPerPage) {
    const textEl = document.querySelector(".card .text-muted small");
    if (!textEl) return;
    const start = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
    const end = Math.min(currentPage * itemsPerPage, totalItems);
    textEl.innerHTML = `Hiển thị <b class="text-dark">${start}</b> đến <b class="text-dark">${end}</b> trong tổng số <b class="text-dark">${totalItems}</b> kết quả`;
  }

  // Thêm vào bên trong class ReaderView
  bindEditReader(handler) {
    this.tableBody.addEventListener("click", (e) => {
      // Tìm xem người dùng có bấm trúng nút Sửa (hoặc icon bên trong nó) không
      const btn = e.target.closest(".btn-edit-reader");
      if (btn) {
        const id = btn.dataset.id;
        handler(id); // "Gửi tín hiệu" về cho Controller kèm theo ID
      }
    });
  }

  bindDeleteReader(handler) {
    this.tableBody.addEventListener("click", (e) => {
      // Tìm xem người dùng có bấm trúng nút Xóa (hoặc icon bên trong nó) không
      const btn = e.target.closest(".btn-delete-reader");
      if (btn) {
        const id = btn.dataset.id;
        handler(id); // "Gửi tín hiệu" về cho Controller kèm theo ID
      }
    });
  }

  // Lắng nghe sự kiện bật Popup MSV và Bấm Lưu
  bindUpdateMsv(handler) {
    // 1. Khi bấm nút "Quét mã" trên bảng
    this.tableBody.addEventListener("click", (e) => {
      const btn = e.target.closest(".btn-update-msv");
      if (btn) {
        const id = btn.dataset.id;
        document.getElementById("msvReaderId").value = id; // Nhét ID vào form
        document.getElementById("newMsvInput").value = ""; // Xóa trắng ô nhập cũ
        // Bật Modal
        const modal = new bootstrap.Modal(
          document.getElementById("updateMsvModal"),
        );
        modal.show();

        // Tự động focus vào ô input để sẵn sàng cho máy quét mã vạch
        setTimeout(() => document.getElementById("newMsvInput").focus(), 500);
      }
    });

    // 2. Khi bấm nút "Lưu thông tin" trong Popup
    const btnSave = document.getElementById("btnSaveMsv");
    if (btnSave) {
      btnSave.addEventListener("click", () => {
        const id = document.getElementById("msvReaderId").value;
        const newMsv = document.getElementById("newMsvInput").value.trim();

        if (!newMsv) {
          alert("Vui lòng quét hoặc nhập Mã sinh viên!");
          return;
        }
        handler(id, newMsv); // Gửi dữ liệu về Controller
      });
    }
  }

  // Hàm phụ trợ: Đóng Modal sau khi lưu thành công
  closeMsvModal() {
    const modalEl = document.getElementById("updateMsvModal");
    const modal = bootstrap.Modal.getInstance(modalEl);
    if (modal) modal.hide();
  }
}
