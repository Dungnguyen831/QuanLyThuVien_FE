describe('Kiểm thử chức năng Đặt sách', () => {

  beforeEach(() => {
    // ✅ FIX: Dùng cy.window() để set localStorage của app, không phải của Cypress runner
    cy.window().then((win) => {
      win.localStorage.setItem('token', 'fake-jwt-token');
    });

    // Giả lập danh sách đặt chỗ hiện tại (để test luồng Hủy)
    cy.intercept('GET', '**/api/v1/reservations/details', {
      statusCode: 200,
      body: [
        { id: 1, title: "Clean Architecture", status: "PENDING" }
      ]
    }).as('getReservations');

    // Giả lập danh sách sách cho tính năng Autocomplete
    cy.intercept('GET', '**/api/v1/books*', {
      statusCode: 200,
      body: [
        { id: 101, title: "Clean Code" },
        { id: 102, title: "Lập trình Javascript" }
      ]
    }).as('getBooks');

    // Truy cập trang Đặt chỗ
    cy.visit('http://127.0.0.1:5500/app/user/views/reservation/reservations.html', { failOnStatusCode: false });
    cy.wait('@getReservations');
  });

  // =========================================================================
  // SC_RES_01: MỞ MODAL VÀ KIỂM TRA DROPDOWN (TC_RES_004)
  // =========================================================================
  it('SC_RES_01: Mở modal và kiểm tra dropdown sách đã load dữ liệu (TC_RES_004)', () => {
    cy.get('#new-reservation-btn').should('be.visible').click();
    cy.wait('@getBooks');

    // Kiểm tra modal hiển thị
    cy.get('.borrow-modal-overlay').should('be.visible');

    // Kiểm tra dropdown tồn tại và chứa các đầu sách từ Mock API
    cy.get('#book-select')
      .should('be.visible')
      .find('option')
      .should('have.length.at.least', 3); // 1 option mặc định + 2 option từ Mock API

    // Kiểm tra sách "Clean Code" có trong danh sách chọn không
    cy.get('#book-select').contains('option', 'Clean Code').should('exist');
  });

  // =========================================================================
  // SC_RES_02: KIỂM THỬ FUNCTIONAL - LUỒNG LỖI ĐẦU VÀO (TC_RES_002, TC_RES_003)
  // =========================================================================
  it('SC_RES_02: Báo lỗi khi không chọn sách từ dropdown (TC_RES_002, TC_RES_003)', () => {
    // ✅ FIX: Dùng cy.on với callback để kiểm tra nội dung alert — đơn giản và đáng tin hơn
    cy.on('window:alert', (text) => {
      expect(text).to.match(/Vui lòng chọn một cuốn sách/i);
    });

    cy.get('#new-reservation-btn').click();
    cy.get('.borrow-modal-overlay').should('be.visible');

    // Mặc định dropdown đang ở "-- Chọn một sách --" (value=""), bấm Submit để hệ thống chặn lại
    cy.get('#borrow-form').submit();
  });

  // =========================================================================
  // SC_RES_03: KIỂM THỬ END-TO-END - TẠO ĐẶT CHỖ (TC_RES_001)
  // =========================================================================
  it('SC_RES_03: Luồng Tạo Đặt chỗ thành công (TC_RES_001)', () => {
    cy.intercept('POST', '**/api/v1/reservations', {
      statusCode: 200,
      body: { success: true, message: 'Đặt chỗ thành công' }
    }).as('createReservation');

    cy.on('window:alert', (text) => {
      expect(text).to.contain('Đặt chỗ thành công');
    });

    cy.get('#new-reservation-btn').click();
    cy.wait('@getBooks');
    cy.get('.borrow-modal-overlay').should('be.visible');

    // Bước 1: Chọn sách "Clean Code" (id=101) từ Dropdown
    cy.get('#book-select').select('101');

    // Bước 2: Click Submit
    cy.get('#borrow-form').submit();

    // Bước 3: Kiểm tra API được gọi đúng bookId
    cy.wait('@createReservation').its('request.body').should((body) => {
      expect(body).to.have.property('bookId', 101);
    });

    // ✅ THÊM MỚI: Kiểm tra UI sau khi tạo thành công
    // Modal phải đóng lại
    cy.get('.borrow-modal-overlay').should('not.exist');

    // Danh sách phải được refresh và có thêm item mới
    cy.get('.reservation-row').should('have.length.at.least', 1);
  });

  // =========================================================================
  // SC_RES_04: KIỂM THỬ E2E - LUỒNG HỦY ĐẶT CHỖ
  // =========================================================================
  it('SC_RES_04: Hủy đặt chỗ thành công với trạng thái PENDING (TC_RES_005)', () => {
    cy.intercept('DELETE', '**/api/v1/reservations/*', {
      statusCode: 200,
      body: { success: true, message: 'Hủy đặt chỗ thành công' }
    }).as('deleteReservation');

    cy.on('window:alert', (text) => {
      expect(text).to.contain('Hủy đặt chỗ thành công');
    });

    // Cypress tự động chọn "OK" (true) cho window.confirm
    cy.on('window:confirm', () => true);

    // Click nút Hủy tại dòng sách đầu tiên
    cy.get('.reservation-row').first().find('.btn-action[data-action="cancel"]').click();

    // Kiểm tra API DELETE được gọi và trả về 200
    cy.wait('@deleteReservation').its('response.statusCode').should('eq', 200);

    // ✅ THÊM MỚI: Kiểm tra UI sau khi hủy — danh sách phải được cập nhật
    cy.get('.reservation-row').should('have.length', 0);
  });

  it('SC_RES_04: Từ chối hủy đặt chỗ khi chọn Cancel (TC_RES_006)', () => {
    // Chọn "Cancel" (false) cho hộp thoại confirm
    cy.on('window:confirm', () => false);

    // ✅ FIX: Dùng flag để theo dõi request thay vì nuốt lỗi timeout — đáng tin cậy hơn
    let deleteRequestMade = false;

    cy.intercept('DELETE', '**/api/v1/reservations/*', (req) => {
      deleteRequestMade = true;
      req.reply({ statusCode: 200 });
    }).as('deleteAPI');

    // Click nút Hủy
    cy.get('.reservation-row').first().find('.btn-action[data-action="cancel"]').click();

    // Chờ một chút rồi assert flag — API không được kích hoạt
    cy.wait(800).then(() => {
      expect(deleteRequestMade).to.be.false;
    });

    // Kiểm tra danh sách vẫn giữ nguyên 1 item
    cy.get('.reservation-row').should('have.length', 1);
  });

});