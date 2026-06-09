class LoanView {
  constructor() {
    this.tableBody = document.getElementById("loan-table-body");
  }

  renderLoans(loans) {
    if (!this.tableBody) return;

    if (loans.length === 0) {
      this.tableBody.innerHTML = `<tr><td colspan="8" class="text-center py-4">Không có dữ liệu phù hợp.</td></tr>`;
      return;
    }

    this.tableBody.innerHTML = loans
      .map((loan) => {
        const avatarChar = loan.userName ? loan.userName.charAt(0).toUpperCase() : "U";
        const displayStatus = loan.status ? loan.status.toLowerCase() : "unknown";

        let statusHtml = "";
        let idClass = "text-dark";
        let dueDateClass = "text-muted";
        
        let canReturn = true;
        let canRenew = true;

        // Dùng displayStatus để render thay vì loan.status gốc
        if (displayStatus === "borrowing") {
          statusHtml = `<span class="status-badge status-active"><span class="status-indicator"></span>Đang mượn</span>`;
        } else if (displayStatus === "returned") {
          statusHtml = `<span class="status-badge status-returned"><span class="status-indicator"></span>Đã trả</span>`;
          canReturn = false; 
          canRenew = false;  
        } else if (displayStatus === "overdue") {
          statusHtml = `<span class="status-badge status-overdue"><span class="status-indicator" style="background-color: #dc3545;"></span>Quá hạn</span>`;
          idClass = "text-danger"; 
          dueDateClass = "text-danger fw-bold"; 
          canRenew = false; 
        }

        
        const targetId = loan.loanDetailId || loan.id;

        let actionHtml = `<div class="d-flex justify-content-end gap-2">`;

        actionHtml += `
        <button class="btn btn-sm btn-outline-info btn-view-detail" data-id="${targetId}" title="Xem chi tiết">
            <i class="fas fa-eye"></i>
        </button>`;
        
        if (canReturn) {
            actionHtml += `
            <button class="btn btn-sm btn-outline-success btn-return" data-id="${targetId}" title="Trả sách">
                <i class="fas fa-undo"></i>
            </button>`;
        }
        
        if (canRenew) {
            actionHtml += `
            <button class="btn btn-sm btn-outline-primary btn-renew" data-id="${targetId}" data-due-date="${loan.dueDate}" title="Gia hạn">
                <i class="fas fa-calendar-plus"></i>
            </button>`;
        }

        actionHtml += `
            <button class="btn btn-sm btn-outline-danger btn-delete" data-id="${loan.id}" title="Xóa phiếu">
                <i class="fas fa-trash"></i>
            </button>
        </div>`;

        return `
                <tr>
                    <td class="ps-4 fw-bold ${idClass}">${loan.id}</td>
                    <td>
                        <div class="d-flex align-items-center">
                            <div class="avatar-circle me-2" style="background-color: ${loan.userAvatarColor || '#0d6efd'}20; color: ${loan.userAvatarColor || '#0d6efd'};">${avatarChar}</div>
                            <span class="fw-medium text-dark">${loan.userName}</span>
                        </div>
                    </td>
                    <td class="text-muted">${loan.bookName}</td>
                    <td class="text-muted">${loan.borrowDate}</td>
                    <td class="${dueDateClass}">${loan.dueDate}</td>
                    <td class="text-muted">${loan.returnDate || '-'}</td>
                    <td>${statusHtml}</td>
                    <td class="text-end pe-4">${actionHtml}</td>
                </tr>
            `;
      })
      .join("");
  }

  bindAddLoan(handler) {
    const form = document.getElementById("add-loan-form");
    if (!form) return;

    const borrowDateInput = document.getElementById("loan-borrow-date");
    if (borrowDateInput) borrowDateInput.valueAsDate = new Date();

    const searchBookInput = document.getElementById("search-book-input");
    const barcodeInput = document.getElementById("loan-barcode");
    const hiddenBookId = document.getElementById("loan-book-id");

    if (searchBookInput && barcodeInput) {
      searchBookInput.addEventListener("input", (e) => {
        if (e.target.value.trim() !== "") {
          barcodeInput.disabled = true;
          barcodeInput.value = ""; // Xóa trắng ô mã vạch cho an toàn
        } else {
          barcodeInput.disabled = false; // Mở lại nếu xóa hết chữ
        }
      });

      barcodeInput.addEventListener("input", (e) => {
        if (e.target.value.trim() !== "") {
          searchBookInput.disabled = true;
          searchBookInput.value = ""; // Xóa chữ ở ô tìm kiếm
          if (hiddenBookId) hiddenBookId.value = ""; // Xóa luôn ID sách đang lưu ngầm
        } else {
          searchBookInput.disabled = false; // Mở lại nếu xóa hết mã vạch
        }
      });
    }

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      
      const userId = document.getElementById("loan-user-id").value;
      const bookId = hiddenBookId.value;
      const borrowDate = borrowDateInput.value;
      const dueDate = document.getElementById("loan-due-date").value;
      const note = document.getElementById("loan-note").value;
      const barcode = barcodeInput.value.trim();

      if (!bookId && !barcode) {
        return alert("Lỗi: Vui lòng chọn Đầu sách hoặc nhập Mã vạch cụ thể để tạo phiếu mượn!");
      }

      if (dueDate <= borrowDate) {
        return alert("Lỗi: Ngày hẹn trả phải sau ngày mượn!");
      }

      if ((new Date(dueDate) - new Date(borrowDate)) > 1209600000) {
        return alert("Lỗi: Thời gian mượn tối đa không được quá 14 ngày!");
      }

      handler({ userId, bookId, borrowDate, dueDate, note, barcode });
    });
  }

  // Bắt sự kiện click vào các nút trên bảng
  bindTableActions(deleteHandler, viewHandler) {
    if (!this.tableBody) return;
    this.tableBody.addEventListener("click", (e) => {

      const btnView = e.target.closest(".btn-view-detail");
      if (btnView && viewHandler) {
        viewHandler(btnView.dataset.id); 
        return;
      }
      
      const btnDelete = e.target.closest(".btn-delete");
      if (btnDelete) {
        const id = btnDelete.dataset.id;
        if (confirm("Bạn có chắc chắn muốn xóa phiếu mượn này?")) {
          deleteHandler(id);
        }
        return;
      }

      const btnRenew = e.target.closest(".btn-renew");
      if (btnRenew) {
        document.getElementById("renew-detail-id").value = btnRenew.dataset.id;
    
        let oldDueDate = btnRenew.dataset.dueDate; 
        
        if (oldDueDate && oldDueDate.includes("/")) {
            // Cắt ra và đảo ngược lại thành "2023-10-25"
            const parts = oldDueDate.split("/");
            const formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`; 
            
            const dateInput = document.getElementById("renew-new-date");
            dateInput.value = formattedDate;
            dateInput.min = formattedDate; 
        }

        bootstrap.Modal.getOrCreateInstance(document.getElementById("renewLoanModal")).show(); 
        return;
      }

      const btnReturn = e.target.closest(".btn-return");
      if (btnReturn) {
        document.getElementById("return-detail-id").value = btnReturn.dataset.id;
        new bootstrap.Modal(document.getElementById("returnLoanModal")).show();
        return;
      }
    });
  }

  // Bắt sự kiện Form Gia hạn
  bindSubmitRenew(handler) {
    const form = document.getElementById("renew-loan-form");
    if (!form) return;
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const detailId = document.getElementById("renew-detail-id").value;
      const data = { newDueDate: document.getElementById("renew-new-date").value };
      handler(detailId, data);
    });
  }

  // Bắt sự kiện Form Trả sách
  bindSubmitReturn(handler) {
    const form = document.getElementById("return-loan-form");
    if (!form) return;
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const detailId = document.getElementById("return-detail-id").value;
      const barcodeVerify = document.getElementById("return-barcode-verify")?.value.trim();
      const data = {
        inputBarcode: barcodeVerify,
        conditionStatus: document.getElementById("return-condition").value,
        note: document.getElementById("return-note").value
      };
      handler(detailId, data);

    });
  }

  bindStatusFilter(handler) {
    const filterTabs = document.querySelectorAll('#status-filter .filter-tab');
    
    filterTabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            filterTabs.forEach(t => t.classList.remove('active'));
            e.currentTarget.classList.add('active'); 
            
            const selectedStatus = e.currentTarget.getAttribute('data-status');
            handler(selectedStatus);
        });
    });
  }

  // Các hàm đóng Modal
  closeAddModal() {
    const modalEl = document.getElementById("addLoanModal");
    if (!modalEl) return;
    const modal = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
    modal.hide();
    document.getElementById("add-loan-form").reset();
  }

  closeRenewModal() {
    const modalEl = document.getElementById("renewLoanModal");
    if (!modalEl) return;
    bootstrap.Modal.getInstance(modalEl).hide();
    document.getElementById("renew-loan-form").reset();
  }

  closeReturnModal() {
    const modalEl = document.getElementById("returnLoanModal");
    if (!modalEl) return;
    bootstrap.Modal.getInstance(modalEl).hide();
    document.getElementById("return-loan-form").reset();
  }

  bindSearchUser(handler) {
    const input = document.getElementById("search-user-input");
    let timeout = null;
    if(!input) return;

    input.addEventListener("focus", (e) => {
      const keyword = e.target.value.trim();
      handler(keyword); 
    });

    input.addEventListener("input", (e) => {
      clearTimeout(timeout);
      const keyword = e.target.value.trim();
      
      timeout = setTimeout(() => { handler(keyword); }, 300);
    });

    document.addEventListener("click", (e) => {
      if (!e.target.closest("#search-user-input") && !e.target.closest("#user-suggest-list")) {
        const list = document.getElementById("user-suggest-list");
        if(list) list.classList.remove("show");
      }
    });
  }

  // 2. Render kết quả tìm Độc giả lên màn hình
  renderUserSuggestions(users) {
    const list = document.getElementById("user-suggest-list");
    
    if (users.length === 0) {
      list.innerHTML = `<li><span class="dropdown-item text-muted">Không tìm thấy độc giả</span></li>`;
      list.classList.add("show");
      return;
    }

    list.innerHTML = users.map(u => `
      <li>
        <a class="dropdown-item suggest-user-item py-2" href="#" data-id="${u.id}" data-name="${u.fullName || u.name}">
          <div class="fw-bold text-primary">#${u.id} - ${u.fullName || u.name}</div>
          <small class="text-muted">${u.email || u.phone || ''}</small>
        </a>
      </li>
    `).join("");
    
    list.classList.add("show");

    // Xử lý khi click chọn 1 người
    list.querySelectorAll(".suggest-user-item").forEach(item => {
      item.addEventListener("click", (e) => {
        e.preventDefault();
        const selectedEl = e.currentTarget;
        
        // Cập nhật giao diện: Ghi đè tên vào ô nhập, Lưu ID vào ô ẩn
        document.getElementById("search-user-input").value = selectedEl.dataset.name;
        document.getElementById("loan-user-id").value = selectedEl.dataset.id;
        
        // Đóng dropdown
        list.classList.remove("show");
      });
    });
  }

  bindSearchBook(handler) {
    const input = document.getElementById("search-book-input");
    let timeout = null;
    if(!input) return;

    input.addEventListener("focus", (e) => {
      const keyword = e.target.value.trim();
      handler(keyword);
    });
    input.addEventListener("input", (e) => {
      clearTimeout(timeout);
      const keyword = e.target.value.trim();
      timeout = setTimeout(() => { handler(keyword); }, 300);
    });

    document.addEventListener("click", (e) => {
      if (!e.target.closest("#search-book-input") && !e.target.closest("#book-suggest-list")) {
        const list = document.getElementById("book-suggest-list");
        if(list) list.classList.remove("show");
      }
    });
  }

  renderBookSuggestions(books) {
    const list = document.getElementById("book-suggest-list");
    if (books.length === 0) {
      list.innerHTML = `<li><span class="dropdown-item text-muted">Không tìm thấy sách</span></li>`;
      list.classList.add("show");
      return;
    } 
    list.innerHTML = books.map(b => `
      <li>
        <a class="dropdown-item suggest-book-item py-2" href="#" data-id="${b.id}" data-name="${b.title}">
          <div class="fw-bold text-primary">#${b.id} - ${b.title}</div>
          <small class="text-muted">${b.author || b.categoryName || ''}</small>
        </a>
      </li>
    `).join("");
    list.classList.add("show"); 
    list.querySelectorAll(".suggest-book-item").forEach(item => {
      item.addEventListener("click", (e) => {
        e.preventDefault();
        const selectedEl = e.currentTarget;
        document.getElementById("search-book-input").value = selectedEl.dataset.name;
        document.getElementById("loan-book-id").value = selectedEl.dataset.id;
        list.classList.remove("show");
      });
    });
  }

  showDetailModal(barcode, note) {
    const barcodeEl = document.getElementById("detail-barcode");
    const noteEl = document.getElementById("detail-note");

    if (barcodeEl) {
      barcodeEl.innerText = barcode || "Chưa có mã vạch";
    }
    
    if (noteEl) {
      if (note) {
        noteEl.innerText = note;
        noteEl.classList.remove('text-muted');
      } else {
        noteEl.innerText = "Không có ghi chú nào cho phiếu mượn này.";
        noteEl.classList.add('text-muted');
      }
    }

    // Bật Modal lên
    const modalEl = document.getElementById("viewDetailModal");
    if (modalEl) {
      bootstrap.Modal.getOrCreateInstance(modalEl).show();
    }
  }
}