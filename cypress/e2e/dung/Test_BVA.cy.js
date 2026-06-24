describe('Kiểm thử Giá trị biên (BVA) - Ràng buộc Thời gian', () => {

  beforeEach(() => {
    cy.visit('/app/auth/views/login.html');
    cy.get('input[name="email"]').type('admin@gmail.com');
    cy.get('input[name="password"]').type('admin123456');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/app/admin/views/dashboard/admin.html');
    
    cy.visit('/app/admin/views/loan/loan.html');
    cy.get('#loan-table-body').should('not.contain', 'Đang tải dữ liệu...');
  });

  it('TC09: Tạo phiếu mượn có Ngày hẹn trả nhỏ hơn Ngày mượn (Biên Min - 1)', () => {
    // 1. Mở form tạo phiếu
    cy.get('button[data-bs-target="#addLoanModal"]').click();
    cy.get('#addLoanModal').should('be.visible');

    // 2. Điền thông tin Độc giả và sách hợp lệ
    cy.get('#search-user-input').type('DG001');
    cy.get('#loan-barcode').type('8935236421522');

    // 3. Nhập dữ liệu thời gian cận biên (Lùi về quá khứ)
    cy.get('#loan-borrow-date').type('2026-06-23');
    cy.get('#loan-due-date').type('2026-06-22'); 
    
    cy.get('button[form="add-loan-form"]').click();
    cy.wait(500);

    // 4. Kiểm tra: Hệ thống chặn lại không cho tạo
    cy.get('#addLoanModal').should('be.visible');
    
    // Ghi chú: Nếu hệ thống bạn dùng JS Alert hoặc Toast để báo lỗi, 
    // có thể thêm đoạn check text lỗi tại đây.
  });

  it('TC10: Tạo phiếu mượn vượt quá thời hạn 14 ngày (Biên Max + 1)', () => {
    cy.get('button[data-bs-target="#addLoanModal"]').click();
    cy.get('#addLoanModal').should('be.visible');

    cy.get('#search-user-input').type('DG002');
    cy.get('#loan-barcode').type('8935236421522');

    // Nhập dữ liệu thời gian vượt biên (15 ngày)
    cy.get('#loan-borrow-date').type('2026-06-23');
    cy.get('#loan-due-date').type('2026-07-08'); 
    
    cy.get('button[form="add-loan-form"]').click();
    cy.wait(500);

    // Kiểm tra: Form không được đóng
    cy.get('#addLoanModal').should('be.visible');
  });

});