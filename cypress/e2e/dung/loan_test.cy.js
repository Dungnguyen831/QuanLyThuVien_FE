/// <reference types="cypress" />

describe('Test Suite: Chức năng Quản lý Mượn Trả (Loan Management) - Admin', () => {

  // URL trang quản lý mượn trả của bạn
  const loanUrl = 'http://127.0.0.1:5500/app/admin/views/loan/loan.html';

  beforeEach(() => {

    cy.loginByApi('admin@gmail.com', 'admin123456');
    // KỸ THUẬT NÂNG CAO: Chặn và lắng nghe các API dựa trên Swagger của bạn
    cy.intercept('GET', '**/api/v1/loans*').as('getLoans');
    cy.intercept('POST', '**/api/v1/loans').as('createLoan');
    cy.intercept('PUT', '**/api/v1/loans/details/*/return').as('returnLoan');
    cy.intercept('PUT', '**/api/v1/loans/details/*/renew').as('renewLoan');

    cy.visit(loanUrl);
    // Chờ API lấy danh sách phiếu mượn tải xong thì mới bắt đầu test
    // Bỏ comment dòng dưới nếu Backend đang chạy thực tế
    // cy.wait('@getLoans'); 
  });

  context('1. Kiểm thử Giao diện và Bộ lọc (UI & Filter Testing)', () => {
    it('TC01: Kiểm tra giao diện tổng quan và bảng dữ liệu hiển thị đúng', () => {
      // Xác minh tiêu đề trang
      cy.get('#page-title').should('contain', 'Quản lý mượn trả');
      
      // Xác minh nút Tạo phiếu mới hiển thị
      cy.get('button[data-bs-target="#addLoanModal"]').should('be.visible');

      // Xác minh bảng dữ liệu tồn tại
      cy.get('.table-custom').should('be.visible');
      cy.get('thead th').should('have.length', 8); // Kiểm tra đủ 8 cột
    });

    it('TC02: Kiểm tra hoạt động của các Tab Lọc trạng thái (Status Filter)', () => {
      // Click vào tab Đang mượn
      cy.get('.filter-tab[data-status="borrowing"]').click()
        .should('have.class', 'active');
      
      // Click vào tab Đã trả
      cy.get('.filter-tab[data-status="returned"]').click()
        .should('have.class', 'active');
    });

    it('TC03: Kiểm tra ô Tìm kiếm (Search Input)', () => {
      cy.get('#search-loan-input')
        .type('SV001')
        .should('have.value', 'SV001');
      // Ở đây có thể thêm assert kiểm tra số lượng dòng trong bảng thay đổi
    });
  });

  context('2. Kiểm thử Tạo Phiếu Mượn Mới (Create Loan)', () => {
    beforeEach(() => {
      // Mở modal tạo phiếu trước mỗi Test Case trong nhóm này
      cy.get('button[data-bs-target="#addLoanModal"]').click();
      cy.get('#addLoanModal').should('have.class', 'show'); // Đợi modal mở hẳn
    });

    it('TC04: Validation - Báo lỗi khi để trống thông tin bắt buộc', () => {
      // Click Xác nhận ngay khi form trống
      cy.get('button[form="add-loan-form"]').click();

      // Kiểm tra input tên độc giả (yêu cầu required)
      cy.get('#search-user-input').invoke('prop', 'validationMessage').should('not.be.empty');
    });

    it('TC05: Tạo phiếu mượn thành công (Happy Path)', () => {
      // Điền thông tin độc giả
      cy.get('#search-user-input').type('Nguyen Anh Dung');
      // Mô phỏng việc chọn từ danh sách gợi ý (nếu có dropdown hiện ra)
      // cy.get('#user-suggest-list li').first().click();

      // Nhập mã vạch vật lý
      cy.get('#loan-barcode').type('BOOK-2024-001');

      // Điền ngày mượn và hẹn trả (Cypress format là YYYY-MM-DD)
      cy.get('#loan-borrow-date').type('2026-06-09');
      cy.get('#loan-due-date').type('2026-06-23');
      
      cy.get('#loan-note').type('Khách VIP, cho mượn dài hạn.');

      // Bấm Xác nhận
      cy.get('button[form="add-loan-form"]').click();

      // [Kỳ Vọng]: Nếu có backend, kiểm tra xem hệ thống có gọi API POST không
      // cy.wait('@createLoan').its('response.statusCode').should('eq', 201);
      
      // Kiểm tra modal đã đóng lại
      cy.get('#addLoanModal').should('not.have.class', 'show');
    });
  });

  context('3. Kiểm thử Nghiệp vụ Trả Sách (Return Book)', () => {
    beforeEach(() => {
      // Dùng JS ép mở Modal Trả sách để test (vì nút này thường nằm trong từng dòng của bảng)
      // Trong thực tế, bạn sẽ dùng: cy.get('.btn-return').first().click()
      cy.window().then((win) => {
        new win.bootstrap.Modal(win.document.getElementById('returnLoanModal')).show();
      });
    });

    it('TC06: Xác nhận trả sách với tình trạng Nguyên vẹn (GOOD)', () => {
      cy.get('#return-barcode-verify').type('BOOK-2024-001');
      cy.get('#return-condition').select('GOOD'); // Chọn value="GOOD"
      
      cy.get('button[form="return-loan-form"]').click();

      // Kiểm tra API PUT được gọi
      // cy.wait('@returnLoan').its('response.statusCode').should('eq', 200);
    });

    it('TC07: Trả sách với trạng thái Hư hỏng/Mất sách (DAMAGED/LOST)', () => {
      cy.get('#return-barcode-verify').type('BOOK-2024-002');
      
      // Chọn trạng thái mất sách
      cy.get('#return-condition').select('LOST');
      
      // Điền lý do
      cy.get('#return-note').type('Độc giả báo làm rơi mất trên xe bus.');
      
      cy.get('button[form="return-loan-form"]').click();
    });
  });

  context('4. Kiểm thử Nghiệp vụ Gia hạn (Renew Book)', () => {
    beforeEach(() => {
      // Ép mở Modal Gia hạn
      cy.window().then((win) => {
        new win.bootstrap.Modal(win.document.getElementById('renewLoanModal')).show();
      });
    });

    it('TC08: Thực hiện gia hạn thêm ngày (Renew)', () => {
      // Chọn ngày hẹn trả mới xa hơn
      cy.get('#renew-new-date').type('2026-06-30');
      
      cy.get('button[form="renew-loan-form"]').click();

      // Kiểm tra API PUT renew
      // cy.wait('@renewLoan').its('response.statusCode').should('eq', 200);
    });
  });

});