describe("Kiểm thử chức năng Đăng nhập - Quản lý Thư viện", () => {
  beforeEach(() => {
    // Cập nhật URL chính xác theo cổng Live Server hoặc local server đang chạy
    cy.visit("http://127.0.0.1:59283/app/auth/views/login.html");
  });

  it("1. Đăng nhập thành công với tài khoản hợp lệ", () => {
    // Định vị bằng ID chính xác trong mã nguồn
    cy.get("#email").type("admin@institution.edu");
    cy.get("#password").type("AdminPassword123");

    // Thực hiện click nút gửi biểu mẫu qua class điều khiển
    cy.get(".btn-login").click();

    // Xác minh điều hướng thành công (Ví dụ: Không còn ở trang login)
    cy.url().should("not.include", "login.html");
  });

  it("2. Đăng nhập thất bại và hiển thị thông báo lỗi", () => {
    cy.get("#email").type("invalid-user@institution.edu");
    cy.get("#password").type("WrongPassword123");
    cy.get(".btn-login").click();

    // Kiểm tra vùng hiển thị lỗi được JS kiểm soát hoạt động chính xác
    cy.get("#auth-error-message").should("be.visible").and("not.be.empty");
  });

  it("3. Kiểm tra tính năng ẩn/hiện mật khẩu (Toggle Password)", () => {
    // Trạng thái mặc định ban đầu là ẩn mật khẩu
    cy.get("#password").should("have.attr", "type", "password");
    cy.get(".toggle-password").should("contain", "👁️");

    // Click tương tác chuyển đổi trạng thái hiển thị văn bản thường
    cy.get(".toggle-password").click();
    cy.get("#password").should("have.attr", "type", "text");
    cy.get(".toggle-password").should("contain", "🙈");

    // Click lần nữa để ẩn lại mật khẩu
    cy.get(".toggle-password").click();
    cy.get("#password").should("have.attr", "type", "password");
  });

  it("4. Ngăn chặn gửi biểu mẫu khi định dạng email sai hoặc để trống", () => {
    // Kiểm tra tính năng yêu cầu nhập mặc định của HTML5 (required)
    cy.get(".btn-login").click();
    cy.get("#email:invalid").should("have.length", 1);

    // Nhập sai định dạng email không chứa ký tự @
    cy.get("#email").type("sairegexemail");
    cy.get(".btn-login").click();
    cy.get("#email:invalid").should("have.length", 1);
  });
});
