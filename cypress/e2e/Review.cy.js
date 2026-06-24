describe('Luồng E2E: Từ Trang chủ -> Chi tiết sách -> Đánh giá sách', () => {

    beforeEach(() => {
        window.localStorage.setItem('userId', '1');
        window.localStorage.setItem('token', 'fake-jwt-token');

        // 1. [SỬA LỖI 500] Chặn API wishlists để trang Home không bị crash
        cy.intercept('GET', '**/api/v1/wishlists', { statusCode: 200, body: [] }).as('getWishlists');

        // 2. [THÊM MỚI] Giả lập trang chủ luôn có 1 cuốn sách ID=2
        cy.intercept('GET', '**/api/v1/books', {
            statusCode: 200,
            body: [
                { id: 2, title: "Sách Test Cypress ID 2", author: "Admin", cover: "" }
            ]
        }).as('getAllBooks');

        // 3. Giả lập dữ liệu cho trang Chi tiết sách (khi click sang)
        cy.intercept('GET', '**/api/v1/books/2', { body: { id: 2, title: "Sách Test Cypress ID 2" } }).as('getBook');
        cy.intercept('GET', '**/api/v1/reviews/book/2', { body: [] }).as('getReviews');

        // 4. Bắt đầu truy cập Home
        cy.visit('http://127.0.0.1:5500/app/user/views/home/home.html', { failOnStatusCode: false });

        // Đợi Home load sách xong mới làm tiếp
        cy.wait('@getAllBooks');
    });

    it('TC_REV_001_E2E: Navigate từ Home và Viết đánh giá thành công', () => {
        cy.intercept('POST', '**/api/v1/reviews', { success: true }).as('postReview');
        cy.on('window:alert', (text) => expect(text).to.contain('Thêm đánh giá thành công'));

        cy.contains('Sách Test Cypress ID 2').should('be.visible').click();
        cy.wait('@getBook');
        cy.wait('@getReviews');

        // SỬA Ở ĐÂY: Thêm timeout dài hơn và dùng lệnh check kỹ hơn
        cy.get('#addReviewBtn').click();

        // Thay vì chỉ get, hãy yêu cầu nó phải xuất hiện trong vòng 10 giây
        cy.get('.review-form-content', { timeout: 10000 }).should('be.visible');

        // BƯỚC 4: Điền form
        cy.get('input[name="rating"][value="5"]').check();
        cy.get('.comment-input').type('Cuốn sách này ID 2 đọc rất hay và lôi cuốn!');
        cy.get('.review-form-content').submit();

        // BƯỚC 5: Xác minh
        cy.wait('@postReview');
    });

    it('TC_REV_002_E2E: Validate HTML5 - Quên chọn sao & Bình luận ngắn', () => {
        const stub = cy.stub();
        cy.on('window:alert', stub);

        // Đi từ Home sang Detail bằng cách click vào tên sách
        cy.contains('Sách Test Cypress ID 2').click();

        // =========================================================
        // THÊM 2 DÒNG NÀY: Bắt Cypress chờ API load xong và JS nạp xong
        cy.wait('@getBook');
        cy.wait('@getReviews');
        // =========================================================

        // Sau khi chờ xong, JS đã gắn sự kiện, lúc này bấm mới ăn
        cy.get('#addReviewBtn').click();

        // Kịch bản 1: Không chọn sao, gõ > 10 ký tự -> Báo lỗi thiếu sao
        cy.get('.comment-input').type('Đủ mười ký tự rồi nhé');
        cy.get('.review-form-content').submit().then(() => {
            expect(stub.getCall(0)).to.be.calledWithMatch(/Vui lòng chọn điểm đánh giá/i);
        });

        // Kịch bản 2: Chọn sao, gõ < 10 ký tự -> Báo lỗi độ dài
        cy.get('input[name="rating"][value="4"]').check();
        cy.get('.comment-input').clear().type('Hay quá');
        cy.get('.review-form-content').submit().then(() => {
            expect(stub.getCall(1)).to.be.calledWithMatch(/tối thiểu 10 ký tự/i);
        });
    });

});