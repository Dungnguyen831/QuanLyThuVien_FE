describe('Test Suite: Chức năng Quản lý Nhà xuất bản (Publisher Management)', () => {
    
    beforeEach(() => {
        // 1. Thiết lập Intercept theo dõi API của nhà xuất bản
        cy.intercept('GET', '**/api/v1/publishers').as('getPublishers');
        cy.intercept('POST', '**/api/v1/publishers').as('createPublisher');

        // 2. Đăng nhập hệ thống (Mẫu chuẩn)
        cy.visit('/app/auth/views/login.html');
        cy.get('input[name="email"]').type('huu@gmail.com');
        cy.get('input[name="password"]').type('123456789');
        cy.get('button[type="submit"]').click();

        // 3. Kiểm tra điều hướng sau khi login
        cy.url().should('satisfy', (url) => {
            return url.includes('/home/home.html') || url.includes('/dashboard/admin.html');
        });

        // 4. Di chuyển tới trang quản lý nhà xuất bản
        cy.visit('/app/admin/views/publisher/publisher.html');

        // 5. Đợi dữ liệu API nạp xong
        cy.wait('@getPublishers');
        // Đảm bảo bảng không còn hiển thị trạng thái đang tải
       // cy.get('#publisher-table-body').should('not.contain', 'Đang tải dữ liệu...');
        cy.contains('Thêm nhà xuất bản').click();
    });

   beforeEach(() => {
        // Stub alert để bắt thông báo từ validateForm
        cy.window().then(win => {
            cy.stub(win, 'alert').as('alertStub');
        });
    });
    // --- CÁC TRƯỜNG HỢP TC01 (Thành công) ---
    it('TC01: Thêm thành công dữ liệu hợp lệ', () => {
        cy.get('#pubName').type('NXB Kim Đồng');
        cy.get('#pubEmail').type('info@kimdong.vn');
        cy.get('#pubAddress').type('Hà Nội');
        cy.get('#publisherForm').submit();
        cy.get('@alertStub').should('be.calledWith', 'Thao tác thành công!');
    });

    it('TC02: Tên NXB để trống', () => {
        cy.get('#pubName').clear();
        cy.get('#publisherForm').submit();
        cy.get('#pubName').then($el => {
            cy.get('@alertStub').should('be.calledWith', 'Tên NXB phải từ 1 đến 100 ký tự.');
        });
    });

    it('TC04: Email để trống', () => {
        cy.get('#pubName').type('NXB A');
        cy.get('#pubEmail').clear();
        cy.get('#pubAddress').type('Hà Nội');
        cy.get('#publisherForm').submit();
        cy.get('#pubEmail').then($el => {
            cy.get('@alertStub').should('be.calledWith', 'Email không hợp lệ hoặc quá dài.');
        });
    });

    it('TC05: Email sai định dạng', () => {
        cy.get('#pubName').type('NXB A');
        cy.get('#pubEmail').type('abc-com');
        cy.get('#pubAddress').type('Hà Nội');
        cy.get('#publisherForm').submit();
        cy.get('#pubEmail').then($el => {
            cy.get('@alertStub').should('be.calledWith', 'Email không hợp lệ hoặc quá dài.');
        });
    });

    it('TC08: Địa chỉ để trống', () => {
        cy.get('#pubName').type('NXB A');
        cy.get('#pubEmail').type('a@a.com');
        cy.get('#pubAddress').clear();
        cy.get('#publisherForm').submit();
        cy.get('#pubAddress').then($el => {
            cy.get('@alertStub').should('be.calledWith', 'Địa chỉ phải từ 1 đến 255 ký tự.');
        });
    });

 
    it('TC03: Tên NXB vượt 100 ký tự', () => {
        cy.get('#pubName').type('A'.repeat(101));
        cy.get('#pubEmail').type('a@a.com');
        cy.get('#pubAddress').type('Hà Nội');
        cy.get('#publisherForm').submit();
        cy.get('@alertStub').should('be.calledWith', 'Tên NXB phải từ 1 đến 100 ký tự.');
    });

    it('TC06: Email vượt 255 ký tự', () => {
        cy.get('#pubName').type('NXB A');
        cy.get('#pubEmail').type('a'.repeat(250) + '@a.com');
        cy.get('#pubAddress').type('Hà Nội');
        cy.get('#publisherForm').submit();
        cy.get('@alertStub').should('be.calledWith', 'Email không hợp lệ hoặc quá dài.');
    });

    it('TC07: Email trùng lặp', () => {
        cy.get('#pubName').type('NXB B');
        cy.get('#pubEmail').type('info@kimdong.vn');
        cy.get('#pubAddress').type('Hà Nội');
        cy.get('#publisherForm').submit();
        cy.get('@alertStub').should('be.calledWith', 'Email này đã tồn tại trong hệ thống. Vui lòng sử dụng email khác.');
    });

    it('TC09: Địa chỉ vượt 255 ký tự', () => {
        cy.get('#pubName').type('NXB A');
        cy.get('#pubEmail').type('a@a.com');
        cy.get('#pubAddress').type('A'.repeat(256));
        cy.get('#publisherForm').submit();
        cy.get('@alertStub').should('be.calledWith', 'Địa chỉ phải từ 1 đến 255 ký tự.');
    });
});