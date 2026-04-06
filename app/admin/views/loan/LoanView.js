class LoanView {
  constructor() {
    this.tableBody = document.getElementById("loan-table-body");
  }
  renderLoans(loans) {
    if (!this.tableBody) return;
    // Nếu mảng rỗng
    if (loans.length === 0) {
      this.tableBody.innerHTML = `<tr><td colspan="8" class="text-center py-4">Không có dữ liệu mượn trả.</td></tr>`;
      return;
    }
    // Vẽ từng dòng dữ liệu
    this.tableBody.innerHTML = loans
      .map((loan) => {
        // Lấy chữ cái đầu tiên của tên làm Avatar (VD: "Nguyễn Văn A" -> "N")
        const avatarChar = loan.userName.charAt(0).toUpperCase();
        // Xử lý logic trạng thái (Màu sắc & Chữ)
        let statusHtml = "";
        let actionHtml = `<button class="btn btn-link text-muted p-0"><i class="fas fa-ellipsis-v"></i></button>`;
        let idClass = "text-dark";
        let dueDateClass = "text-muted";

        if (loan.status === "borrowing") {
          statusHtml = `<span class="status-badge status-active"><span class="status-indicator"></span>Đang mượn</span>`;
        } else if (loan.status === "returned") {
          statusHtml = `<span class="status-badge status-returned"><span class="status-indicator"></span>Đã trả</span>`;
        } else if (loan.status === "overdue") {
          statusHtml = `<span class="status-badge status-overdue"><span class="status-indicator"></span>Quá hạn</span>`;
          idClass = "text-danger"; // Đổi màu ID thành đỏ
          dueDateClass = "text-danger fw-bold"; // Làm đậm ngày hẹn trả
          // Nút nhắc nhở
          actionHtml =
            `<button class="btn btn-remind"><i class="fas fa-bell me-1"></i> Nhắc nhở</button>` +
            actionHtml;
        }

        // Trả về chuỗi HTML của dòng (Dùng Template String ` `)
        return `
                <tr>
                    <td class="ps-4 fw-bold ${idClass}">${loan.id}</td>
                    <td>
                        <div class="d-flex align-items-center">
                            <div class="avatar-circle me-2" style="background-color: ${loan.userAvatarColor}20; color: ${loan.userAvatarColor};">${avatarChar}</div>
                            <span class="fw-medium text-dark">${loan.userName}</span>
                        </div>
                    </td>
                    <td class="text-muted">${loan.bookName}</td>
                    <td class="text-muted">${loan.borrowDate}</td>
                    <td class="${dueDateClass}">${loan.dueDate}</td>
                    <td class="text-muted">${loan.returnDate}</td>
                    <td>${statusHtml}</td>
                    <td class="text-end pe-4 d-flex justify-content-end align-items-center gap-2">${actionHtml}</td>
                </tr>
            `;
      })
      .join("");
  }

  bindAddLoan(handler) {
    const form = document.getElementById("add-loan-form");
    if (!form) return;

    // Tự động set ngày mượn là hôm nay cho tiện
    document.getElementById("loan-borrow-date").valueAsDate = new Date();

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      // Gom dữ liệu đúng chuẩn DTO Backend yêu cầu
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

  closeAddModal() {
    const modalEl = document.getElementById("addLoanModal");
    const modal =
      bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
    modal.hide();
    document.getElementById("add-loan-form").reset(); // Xóa sạch form
  }
}
