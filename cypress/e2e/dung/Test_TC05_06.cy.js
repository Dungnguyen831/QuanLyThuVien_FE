describe('Module Mượn Trả: Kiểm thử Lọc trạng thái phiếu mượn', () => {
  
  beforeEach(() => {
    // 1. Truy cập vào trang đăng nhập
    cy.visit('/app/auth/views/login.html'); 

    // 2. Điền thông tin tài khoản admin
    cy.get('input[name="email"]').type('admin@gmail.com');
    cy.get('input[name="password"]').type('admin123456');
    cy.get('button[type="submit"]').click();

    // 3. Đợi hệ thống chuyển hướng vào trang chủ Dashboard (Xác nhận đăng nhập thành công)
    cy.url().should('include', '/app/admin/views/dashboard/admin.html');

    // 4. Khi đã có Token, điều hướng thẳng sang trang Quản lý Mượn Trả
    cy.visit('/app/admin/views/loan/loan.html');

    // 5. Đợi bảng dữ liệu tải xong rồi mới bắt đầu chạy các Test Case
    cy.get('#loan-table-body').should('not.contain', 'Đang tải dữ liệu...');
  });

  it('TC05: Kiểm tra hiển thị phiếu CHƯA TRẢ và ĐÃ QUÁ HẠN', () => {
    // Chuyển sang tab "Quá hạn"
    cy.get('.filter-tab[data-status="overdue"]').click();
    cy.wait(500); 
    cy.get('.filter-tab[data-status="overdue"]').should('have.class', 'active');
    
    // Thêm khoảng nghỉ để JS kịp render bảng mới
    cy.wait(500); 

    // Đối chiếu dữ liệu trong bảng
    cy.get('#loan-table-body tr').each(($row) => {
      cy.wrap($row).find('td').should('contain', 'Quá hạn');
      
      // SỬA Ở ĐÂY: Chuyển sang tìm cái icon nút xử lý (giống TC01)
      cy.wrap($row).find('i.fa-sync-alt, i.fa-undo').should('be.visible'); 
    });
  });

  it('TC06: Kiểm tra hiển thị phiếu CHƯA TRẢ và CÒN TRONG HẠN', () => {
    // Chuyển sang tab "Đang mượn"
    cy.get('.filter-tab[data-status="borrowing"]').click();
    cy.get('.filter-tab[data-status="borrowing"]').should('have.class', 'active');

    // Thêm khoảng nghỉ để JS kịp render bảng mới
    cy.wait(500);

    // Đối chiếu trạng thái hiển thị
    cy.get('#loan-table-body tr').each(($row) => {
      cy.wrap($row).find('td').should('contain', 'Đang mượn');
    });
  });

});