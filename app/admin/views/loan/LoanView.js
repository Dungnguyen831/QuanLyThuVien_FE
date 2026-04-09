class LoanView {
  constructor() {
    this.tableBody = document.getElementById("loan-table-body");
  }

  renderLoans(loans) {
    if (!this.tableBody) return;

    if (loans.length === 0) {
      this.tableBody.innerHTML = `<tr><td colspan="8" class="text-center py-4">Không có dữ liệu mượn trả.</td></tr>`;
      return;
    }

    this.tableBody.innerHTML = loans
      .map((loan) => {
        const avatarChar = loan.userName ? loan.userName.charAt(0).toUpperCase() : "U";
        let statusHtml = "";
        let idClass = "text-dark";
        let dueDateClass = "text-muted";
        
        let canReturn = true;
        let canRenew = true;

        if (loan.status === "borrowing") {
          statusHtml = `<span class="status-badge status-active"><span class="status-indicator"></span>Đang mượn</span>`;
        } else if (loan.status === "returned") {
          statusHtml = `<span class="status-badge status-returned"><span class="status-indicator"></span>Đã trả</span>`;
          canReturn = false; 
          canRenew = false;  
        } else if (loan.status === "overdue") {
          statusHtml = `<span class="status-badge status-overdue"><span class="status-indicator"></span>Quá hạn</span>`;
          idClass = "text-danger"; 
          dueDateClass = "text-danger fw-bold"; 
          canRenew = false; 
        }

        // Chú ý: data-id sử dụng loan.loanDetailId (nếu API có trả về) hoặc loan.id
        const targetId = loan.loanDetailId || loan.id;

        let actionHtml = `<div class="d-flex justify-content-end gap-2">`;
        
        if (canReturn) {
            actionHtml += `
            <button class="btn btn-sm btn-outline-success btn-return" data-id="${targetId}" title="Trả sách">
                <i class="fas fa-undo"></i>
            </button>`;
        }
        
        if (canRenew) {
            actionHtml += `
            <button class="btn btn-sm btn-outline-primary btn-renew" data-id="${targetId}" title="Gia hạn">
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

  // Bắt sự kiện form Tạo mới
  bindAddLoan(handler) {
    const form = document.getElementById("add-loan-form");
    if (!form) return;

    const borrowDateInput = document.getElementById("loan-borrow-date");
    if (borrowDateInput) borrowDateInput.valueAsDate = new Date();

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const loanData = {
        userId: document.getElementById("loan-user-id").value,
        bookId: document.getElementById("loan-book-id").value,
        borrowDate: document.getElementById("loan-borrow-date").value,
        dueDate: document.getElementById("loan-due-date").value,
        note: document.getElementById("loan-note").value,
      };
      handler(loanData);
    });
  }

  // Bắt sự kiện click vào các nút trên bảng
  bindTableActions(deleteHandler) {
    if (!this.tableBody) return;
    this.tableBody.addEventListener("click", (e) => {
      
      const btnDelete = e.target.closest(".btn-delete");
      if (btnDelete) {
        const id = btnDelete.dataset.id;
        if (confirm("Bạn có chắc chắn muốn xóa phiếu mượn này?")) {
          deleteHandler(id);
        }
      }

      const btnRenew = e.target.closest(".btn-renew");
      if (btnRenew) {
        document.getElementById("renew-detail-id").value = btnRenew.dataset.id;
        new bootstrap.Modal(document.getElementById("renewLoanModal")).show();
      }

      const btnReturn = e.target.closest(".btn-return");
      if (btnReturn) {
        document.getElementById("return-detail-id").value = btnReturn.dataset.id;
        new bootstrap.Modal(document.getElementById("returnLoanModal")).show();
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
      const data = {
        conditionStatus: document.getElementById("return-condition").value,
        note: document.getElementById("return-note").value
      };
      handler(detailId, data);
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
}