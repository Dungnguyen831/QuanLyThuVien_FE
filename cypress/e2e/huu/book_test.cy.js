describe('Test Suite: Chức năng Quản lý Sách (Book Management) - Quyền Admin', () => {
    
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

        // 3. Kiểm tra điều hướng linh hoạt (chấp nhận cả trang user home hoặc admin dashboard)
        cy.url().should('satisfy', (url) => {
            return url.includes('/home/home.html') || url.includes('/dashboard/admin.html');
        });

        // 4. Di chuyển thẳng tới phân hệ Quản lý kho sách chi tiết
        cy.visit('/app/admin/views/inventory/inventory.html');

        // 5. Đợi dữ liệu API nạp xong xuôi lên bảng để tránh lỗi bất đồng bộ
        cy.wait(['@getAuthors', '@getCategories', '@getPublishers', '@getShelves', '@getBooks']);
        cy.get('#inventory-table-body').should('not.contain', 'Đang tải dữ liệu...');
    });

    it('TC01: Kiểm tra giao diện tổng quan và bảng dữ liệu hiển thị đúng cấu trúc', () => {
        cy.contains('Quản lý kho sách chi tiết').should('be.visible');
        cy.get('#btnAddNewBook').should('be.visible');

        // Xác minh bảng đã render thành công dữ liệu thật từ Database (Ít nhất 1 dòng)
        cy.get('#inventory-table-body tr').should('have.length.at.least', 1);

    });

    it('TC02: Kiểm tra chức năng kích hoạt và cấu trúc form hiển thị trên Modal Thêm sách', () => {
        cy.wait(600); // Chờ cấu trúc DOM ổn định
        cy.get('#btnAddNewBook').should('be.visible').click({ force: true });
        cy.wait(600); // Chờ hiệu ứng mở Modal hoàn tất

        // Kiểm tra tính hiển thị của Modal Thêm sách dựa trên đúng ID trong HTML
        cy.get('#addBookModal').should('be.visible').and('have.class', 'show');

        // Đi sâu vào kiểm tra chính xác các ID của ô input trong Form thêm sách
        cy.get('#addBookModal').within(() => {
            cy.contains('Thêm sách mới vào kho').should('be.visible');
            cy.get('#bookTitle').should('be.visible'); // Kiểm tra ô Tên sách
            cy.get('#bookIsbn').should('be.visible');  // Kiểm tra ô ISBN
            cy.get('#categoryInput').should('be.visible'); // Kiểm tra ô chọn Thể loại (Datalist)
            cy.get('#authorInput').should('be.visible');   // Kiểm tra ô chọn Tác giả (Datalist)
            cy.get('#publisherInput').should('be.visible'); // Kiểm tra ô chọn Nhà xuất bản
            cy.get('#bookYear').should('be.visible').and('have.value', '2026'); // Kiểm tra năm mặc định
            cy.get('#bookImageFile').should('be.visible'); // Kiểm tra nút chọn file ảnh
            cy.get('#bookDescription').should('be.visible'); // Kiểm tra khung nhập mô tả
        });
    });

    it('TC03: Kiểm tra luồng tương tác và cấu trúc form hiển thị trên Modal Sửa sách', () => {
        cy.wait(600);

        // 1. Tìm dòng đầu tiên và bấm vào nút Sửa
        cy.get('#inventory-table-body tr').eq(0).within(() => {
            cy.get('.fa-edit, .fa-pen, [class*="edit"]').first().click({ force: true });
        });
        cy.wait(600); // Chờ render Modal Sửa

        // 2. Kiểm tra tính hiển thị của Modal Sửa dựa trên đúng ID trong HTML
        cy.get('#editBookModal').should('be.visible');

        // Đi sâu vào kiểm tra các ID đặc thù chỉ có ở Form Sửa sách
        cy.get('#editBookModal').within(() => {
            cy.contains('Chỉnh sửa thông tin sách').should('be.visible');
            cy.get('#editBookId').should('have.attr', 'type', 'hidden'); // Kiểm tra input hidden lưu ID sách
            cy.get('#editBookTitle').should('be.visible');
            cy.get('#editBookIsbn').should('be.visible');
            cy.get('#editTotalQty').should('be.visible');     // Kiểm tra trường Tổng số lượng
            cy.get('#editAvailableQty').should('be.visible'); // Kiểm tra trường Sẵn có
            cy.get('#editBookDescription').should('be.visible');
        });

        // 3. Tắt modal sửa bằng nút đóng (Close) để chuẩn bị cho bước test xóa
        cy.get('#editBookModal .btn-close, #editBookModal [data-bs-dismiss="modal"]').first().click({ force: true });
        cy.wait(500);

        // 4. Kích hoạt sự kiện nút Xóa bản ghi cuốn sách ở dòng đầu tiên
        cy.get('#inventory-table-body tr').eq(0).within(() => {
            cy.get('.fa-trash, .fa-trash-alt, [class*="trash"]').first().click({ force: true });
        });

        // 5. Đón bắt kiểm tra nội dung cửa sổ xác nhận hủy (Confirm Dialog) từ trình duyệt
        cy.on('window:confirm', (str) => {
            // Thay vì 'Bạn có chắc chắn muốn xóa'
            expect(str).to.contain('Xác nhận xóa sách ID:'); 
            return true;
        });
    });
});