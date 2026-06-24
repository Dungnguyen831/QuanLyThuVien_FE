describe('Module Mượn Trả: Kiểm thử luồng Trả sách', () => {
  
  beforeEach(() => {
    cy.visit('/app/auth/views/login.html'); 

    cy.get('input[name="email"]').type('admin@gmail.com');
    cy.get('input[name="password"]').type('admin123456');
    cy.get('button[type="submit"]').click();

    cy.url().should('include', '/app/admin/views/dashboard/admin.html');

    cy.visit('/app/admin/views/loan/loan.html');

    cy.get('#loan-table-body').should('not.contain', 'Đang tải dữ liệu...');
  });

  it('TC01: Trả sách QUÁ HẠN và sách nguyên vẹn', () => {
    cy.get('.filter-tab[data-status="overdue"]').click();
    cy.wait(500);

    cy.get('#loan-table-body tr').first().within(() => {
      cy.get('i.fa-sync-alt, i.fa-undo').parent('button').click();
  
      // cy.get('button').eq(1).click();
    });

    cy.get('#returnLoanModal').should('be.visible');
    cy.get('#return-barcode-verify').type('BC17766629915353'); // Thay mã vạch ở đây
    cy.get('#return-condition').select('GOOD');
    cy.get('button[form="return-loan-form"]').click();

    cy.get('#returnLoanModal').should('not.be.visible');
  });


  it('TC02: Trả sách QUÁ HẠN và sách bị hỏng/mất', () => {
    cy.get('.filter-tab[data-status="overdue"]').click();
    cy.wait(500);

    cy.get('#loan-table-body tr').first().within(() => {
      cy.get('i.fa-sync-alt, i.fa-undo').parent('button').click();
    });

    cy.get('#returnLoanModal').should('be.visible');
    
    cy.get('#return-barcode-verify').type('NTL13KHMT202242'); // Thay mã vạch ở đây
    
    cy.get('#return-condition').select('DAMAGED');
    
    cy.get('#return-note').clear().type('Khách làm rách trang bìa.');

    cy.get('#return-loan-form').submit();
    
    cy.wait(1000);

    cy.get('#returnLoanModal').should('not.be.visible');
  });

});