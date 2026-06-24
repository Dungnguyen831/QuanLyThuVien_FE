describe('Kiểm thử Phân vùng tương đương (EP) - Ràng buộc Mã vạch', () => {

  beforeEach(() => {
    // Đăng nhập và truy cập trang quản lý mượn trả
    cy.visit('/app/auth/views/login.html');
    cy.get('input[name="email"]').type('admin@gmail.com');
    cy.get('input[name="password"]').type('admin123456');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/app/admin/views/dashboard/admin.html');
    
    cy.visit('/app/admin/views/loan/loan.html');
    cy.get('#loan-table-body').should('not.contain', 'Đang tải dữ liệu...');
  });

  it('TC07: Trả sách với mã vạch của sách khác (Lớp EP2 - Không hợp lệ)', () => {
    // 1. Lọc và mở form
    cy.get('.filter-tab[data-status="overdue"]').click();
    cy.wait(500);
    cy.get('#loan-table-body tr').first().within(() => {
      cy.get('i.fa-sync-alt, i.fa-undo').parent('button').click();
    });

    cy.get('#returnLoanModal').should('be.visible');

    // 2. Nhập mã vạch sai bản sao
    cy.get('#return-barcode-verify').clear().type('MAVACHKHONGKHOP'); 
    cy.get('#return-condition').select('GOOD');
    cy.get('#return-loan-form').submit();
    cy.wait(500);

    // 3. Kiểm tra: Form không đóng và hiện đúng lỗi
    cy.get('#returnLoanModal').should('be.visible');
    cy.get('#barcode-error-msg')
      .should('not.have.class', 'd-none')
      .and('be.visible')
      .and('contain', 'Mã vạch không khớp');
  });

  it('TC08: Trả sách với định dạng chứa ký tự đặc biệt (Lớp EP4 - Không hợp lệ)', () => {
    cy.get('.filter-tab[data-status="overdue"]').click();
    cy.wait(500);
    cy.get('#loan-table-body tr').first().within(() => {
      cy.get('i.fa-sync-alt, i.fa-undo').parent('button').click();
    });

    // Nhập ký tự đặc biệt
    cy.get('#return-barcode-verify').clear().type('@KhoaCNTT_UTT'); 
    cy.get('#return-condition').select('GOOD');
    cy.get('#return-loan-form').submit();
    cy.wait(500);

    // Kiểm tra theo thực tế phần mềm (Hiện lỗi mã vạch không khớp dù nhập chữ)
    cy.get('#returnLoanModal').should('be.visible');
    cy.get('#barcode-error-msg').should('be.visible');
  });

});