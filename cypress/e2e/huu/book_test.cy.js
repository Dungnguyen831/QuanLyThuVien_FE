describe('Test Suite: Chức năng Quản lý Sách (Book Management)', () => {
    
    beforeEach(() => {
        // 1. Thiết lập Intercept theo dõi các API danh mục kho sách
        cy.intercept('GET', '**/api/v1/authors').as('getAuthors');
        cy.intercept('GET', '**/api/v1/categories').as('getCategories');
        cy.intercept('GET', '**/api/v1/publishers').as('getPublishers');
        cy.intercept('GET', '**/api/v1/shelves').as('getShelves');
        cy.intercept('GET', '**/api/v1/books').as('getBooks');

        // 2. Đăng nhập hệ thống với tài khoản được chỉ định
        cy.visit('/app/auth/views/login.html');
        cy.get('input[name="email"]').type('huu@gmail.com');
        cy.get('input[name="password"]').type('123456789');
        cy.get('button[type="submit"]').click();

        // 3. Kiểm tra điều hướng
        cy.url().should('satisfy', (url) => {
            return url.includes('/home/home.html') || url.includes('/dashboard/admin.html');
        });

        // 4. Di chuyển thẳng tới phân hệ Quản lý kho sách chi tiết
        cy.visit('/app/admin/views/inventory/inventory.html');

        // 5. Đợi dữ liệu API nạp xong xuôi lên bảng
        cy.wait(['@getAuthors', '@getCategories', '@getPublishers', '@getShelves', '@getBooks']);
        cy.get('#inventory-table-body').should('not.contain', 'Đang tải dữ liệu...');
    });

    it('TC01: Kiểm tra thêm mới sách thành công với dữ liệu hợp lệ (Dữ liệu mới)', () => {
        cy.contains('Quản lý kho sách chi tiết').should('be.visible');
        cy.get('#inventory-table-body tr').should('have.length.at.least', 1);

        // Mở form nhập liệu
        cy.get('#btnAddNewBook').should('be.visible').click({ force: true });
        cy.get('#addBookModal').should('be.visible').and('have.class', 'show');

        // Nhập thông tin sách hoàn toàn mới
        cy.get('#bookTitle').type('Công Nghệ 2026');
        cy.get('#bookIsbn').type('978-604-99-9999-5');
        cy.get('#bookYear').should('have.value', '2026'); 
        cy.get('#categoryInput').type('1'); 
        cy.get('#authorInput').type('1');
        cy.get('#publisherInput').type('1');

        cy.on('window:alert', (str) => {
            expect(str).to.equal('Thêm thành công!');
        });

        // Xác nhận lưu dữ liệu
        cy.get('#addBookForm button[type="submit"]').click();

        // Kiểm tra modal đã đóng
        cy.get('#addBookModal').should('not.have.class', 'show');
    });

    it('TC02: Kiểm tra thêm mới sách thất bại do để trống trường bắt buộc', () => {
        cy.wait(500); 
    
        cy.get('#btnAddNewBook').should('be.visible').click();
        
        cy.get('#addBookModal', { timeout: 8000 })
            .should('have.class', 'show')
            .and('be.visible');
    
        // Gây tác động focus/blur để kích hoạt form validate
        cy.get('#bookTitle').focus().blur(); 
        cy.get('#bookIsbn').focus().blur();  
        
        cy.get('#categoryInput').type('1');
        cy.get('#authorInput').type('1');
        cy.get('#publisherInput').type('1');
    
        cy.on('window:alert', (str) => {
            expect(str).to.contain('- Tên sách không được để trống.');
            expect(str).to.contain('- Mã ISBN không được để trống.');
        });
    
        cy.get('#addBookForm').invoke('removeAttr', 'novalidate').submit();
        
        cy.get('#addBookModal').should('have.class', 'show');
    });

    it('TC03: Kiểm tra thêm mới sách thất bại do trùng mã ISBN', () => {
        // 1. Chuẩn bị stub để bắt alert
        cy.window().then((win) => {
            cy.stub(win, 'alert').as('alertStub');
        });
    
        cy.get('#btnAddNewBook').click();
        cy.get('#addBookModal').should('have.class', 'show');
    
        // 2. Nhập dữ liệu chắc chắn đã có trong DB
        cy.get('#bookTitle').type('Tài Liệu kiểm thử');
        cy.get('#bookIsbn').type('978604000006'); 
        
        cy.get('#categoryInput').type('1');
        cy.get('#authorInput').type('1');
        cy.get('#publisherInput').type('1');
    
        // 3. Thực hiện submit
        cy.get('#addBookForm button[type="submit"]').click();
    
        // 4. Kiểm tra xem stub đã bắt được alert chưa
        cy.get('@alertStub').should('be.called');
        
        // 5. Kiểm tra nội dung cụ thể
        cy.get('@alertStub').should('be.calledWithMatch', 'đã tồn tại trong hệ thống.');
    
        // 6. Modal vẫn phải hiển thị
        cy.get('#addBookModal').should('have.class', 'show');
    });

    it('TC04: Kiểm tra cập nhật sách thất bại do vi phạm logic số lượng', () => {
        cy.get('#inventory-table-body .btn-edit-book').first().click({ force: true });
        
        cy.get('#editBookModal').should('be.visible');
        cy.get('#editBookIsbn').should('have.attr', 'readonly'); 
        cy.get('#editBookIsbn').should('have.class', 'bg-secondary-subtle');

        // Cập nhật số lượng sai lệch logic toán học (Sẵn có > Tổng số)
        cy.get('#editTotalQty').clear().type('12');
        cy.get('#editAvailableQty').clear().type('20');

        cy.on('window:alert', (str) => {
            expect(str).to.contain('- Số lượng sẵn có không được lớn hơn tổng số lượng.');
        });

        cy.get('#editBookForm button[type="submit"]').click();
        cy.get('#editBookModal').should('have.class', 'show');
    });

    it('TC05: Kiểm tra chức năng bộ lọc và thanh tìm kiếm khi có kết quả trùng khớp (Từ khóa tìm kiếm mới)', () => {
      
        cy.get('#searchInput').type('Java');
        
        cy.get('#inventory-table-body tr').each(($el) => {
            const text = $el.text(); // Lấy text bằng jQuery thuần
            expect(text.toLowerCase()).to.contain('java');
        });
    });

    it('TC06: Kiểm tra chức năng bộ lọc khi không tìm thấy kết quả phù hợp', () => {
        cy.get('#searchInput').clear().type('Blockchain 3000 Abcxyz');

        cy.get('#inventory-table-body').should('be.empty');
        cy.get('#inventory-table-body tr').should('have.length', 0);
    });
});