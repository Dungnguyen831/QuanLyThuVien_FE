describe('Test Suite: Quản lý Bản sao sách (BookCopy) - Luồng từ Inventory', () => {
    const bookId = 12;

    // 1. Định nghĩa dữ liệu mock (Phải nằm trong scope của describe)
    const mockBookCopies = [
        { id: 259, barcode: 'DLITTNT2023-1', conditionStatus: 'NEW', availabilityStatus: 'AVAILABLE' },
        { id: 260, barcode: 'DLITTNT2023-2', conditionStatus: 'NEW', availabilityStatus: 'AVAILABLE' },
        { id: 261, barcode: 'DLITTNT2023-3', conditionStatus: 'NEW', availabilityStatus: 'AVAILABLE' }
    ];

    beforeEach(() => {
        // 1. Đăng nhập
        cy.visit('/app/auth/views/login.html');
        cy.get('input[name="email"]').type('huu@gmail.com');
        cy.get('input[name="password"]').type('123456789');
        cy.get('button[type="submit"]').click();

        // 2. Mock API
        cy.intercept('GET', '**/api/v1/books', { 
            id: bookId, 
            title: 'Deep Learning Introduction' 
        }).as('getBooks');
        
        cy.intercept('GET', `**/api/v1/book-copies/book/${bookId}`, mockBookCopies).as('getCopies');
        
        // 3. Vào trang Inventory
        cy.visit('/app/admin/views/inventory/inventory.html');
        cy.wait('@getBooks');
    });

    it('TC04: Kiểm tra chức năng tạo nhanh bản sao (Bulk Create)', () => {
        // 1. Đợi bảng hiển thị dữ liệu xong trước khi tương tác
        cy.get('#inventory-table-body tr', { timeout: 10000 })
          .should('have.length.at.least', 1);

        // 2. Tìm hàng chứa tên sách và nhấp đúp
        cy.contains('td', 'Deep Learning Introduction')
          .parent('tr') 
          .should('be.visible')
          .dblclick();
        
        // 3. Đợi Modal hiển thị
        cy.get('#bookCopyModal', { timeout: 10000 }).should('be.visible');

        // 4. Mock API tạo bản sao thành công
        cy.intercept('POST', '**/api/v1/book-copies/bulk*').as('bulkCreate');

        // 5. Nhập số lượng và thực hiện tạo
        const qty = 5;
        cy.get('#bulkQuantity').should('be.visible').clear().type(qty);
        cy.get('#btnBulkCreate').should('be.visible').click();

        // 6. Kiểm tra API trả về
        cy.wait('@bulkCreate').then((interception) => {
            expect(interception.response.statusCode).to.eq(200);
        });

        // 7. Kiểm tra giao diện cập nhật sau khi tạo
        cy.wait('@getCopies'); 
        cy.get('#copy-table-body tr').should('have.length.at.least', 1);
    });
    
    it('TC: Mở Modal BookCopy bằng cách nhấp đúp và thực hiện xóa', () => {
        // Mở Modal
        cy.get('#inventory-table-body tr', { timeout: 10000 }).should('have.length.at.least', 1);
        cy.contains('td', 'Deep Learning Introduction')
          .parent('tr')
          .should('be.visible')
          .dblclick();
          
        cy.get('#bookCopyModal', { timeout: 10000 }).should('be.visible');

        // Kiểm tra dữ liệu
        cy.wait('@getCopies');
        cy.get('#copy-table-body tr').should('have.length.at.least', 1);

        // Test xóa
        cy.on('window:confirm', () => true);
        cy.get('.btn-delete-copy').first().click({ force: true });
    });
});