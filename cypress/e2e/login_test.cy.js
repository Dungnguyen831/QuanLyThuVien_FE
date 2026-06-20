/// <reference types="cypress" />

describe("Test Suite: Chức năng Đăng nhập - Hệ thống Quản Lý Thư Viện", () => {
  const loginUrl = "http://127.0.0.1:61748/app/auth/views/login.html";

  beforeEach(() => {
    // Tiền điều kiện (Pre-condition): Truy cập trang đăng nhập trước mỗi Test Case
    cy.visit(loginUrl);
  });

  // ====================================================================
  // PHẦN 1: GIỮ NGUYÊN CÁC TEST CASE GIAO DIỆN (UI)
  // ====================================================================
  context("1. Kiểm thử Giao diện & Tiện ích (UI Testing)", () => {
    it("TC01: Kiểm tra các thành phần giao diện hiển thị đầy đủ", () => {
      cy.get(".logo-text").should("contain", "QUẢN LÝ THƯ VIỆN");
      cy.get(".auth-welcome h2").should("contain", "Chào Mừng Trở Lại");
      cy.get("#email")
        .should("be.visible")
        .and("have.attr", "placeholder", "name@institution.edu");
      cy.get("#password")
        .should("be.visible")
        .and("have.attr", "placeholder", "••••••••••");
      cy.get(".btn-login").should("be.visible").and("contain", "Đăng Nhập");
    });

    it("TC02: Tính năng Ẩn/Hiện mật khẩu (Toggle Password View)", () => {
      cy.get("#password").type("admin123456");
      cy.get("#password").should("have.attr", "type", "password"); // Đang ẩn

      cy.get(".toggle-password").click();
      cy.get("#password").should("have.attr", "type", "text"); // Đã hiện
    });
  });

  // ====================================================================
  // PHẦN 2: TÍCH HỢP 9 TEST CASE TỪ EXCEL (DATA-DRIVEN TESTING)
  // ====================================================================
  context(
    "2. Kiểm thử Luồng xác thực với tập dữ liệu (Data-Driven Testing)",
    () => {
      const testCases = [
        {
          id: 1,
          email: "vanhle295@gmail.com",
          pass: "12345678",
          desc: "Đúng email, đúng pass",
          expectSuccess: true,
        },
        {
          id: 2,
          email: "vanhle295@gmail.com",
          pass: "Saimatkhau",
          desc: "Đúng email, sai pass",
          expectSuccess: false,
          errorType: "backend_error",
        },
        {
          id: 3,
          email: "vanhle295@gmail.com",
          pass: "",
          desc: "Đúng email, rỗng pass",
          expectSuccess: false,
          errorType: "html5_pass",
        },
        {
          id: 4,
          email: "",
          pass: "12345678",
          desc: "Rỗng email, có pass",
          expectSuccess: false,
          errorType: "html5_email",
        },
        {
          id: 5,
          email: "",
          pass: "Saimatkhau",
          desc: "Rỗng email, sai pass format",
          expectSuccess: false,
          errorType: "html5_email",
        },
        {
          id: 6,
          email: "",
          pass: "",
          desc: "Rỗng email, rỗng pass",
          expectSuccess: false,
          errorType: "html5_email",
        },
        {
          id: 7,
          email: "vanh@gmail.com",
          pass: "12345678",
          desc: "Email chưa đăng ký, đúng format pass",
          expectSuccess: false,
          errorType: "backend_error",
        },
        {
          id: 8,
          email: "vanh@gmail.com",
          pass: "Saimatkhau",
          desc: "Email chưa đăng ký, sai pass",
          expectSuccess: false,
          errorType: "backend_error",
        },
        {
          id: 9,
          email: "vanh@gmail.com",
          pass: "",
          desc: "Email chưa đăng ký, rỗng pass",
          expectSuccess: false,
          errorType: "html5_pass",
        },
      ];

      testCases.forEach((tc) => {
        it(`TC_Data_${tc.id}: ${tc.desc}`, () => {
          // 1. Nhập Email
          if (tc.email !== "") {
            cy.get("#email").type(tc.email);
          }

          // 2. BẮT LÕNG API: Chỉ theo dõi API ở những case vượt qua được rào cản HTML5
          const willCallApi =
            tc.expectSuccess || tc.errorType === "backend_error";
          if (willCallApi) {
            cy.intercept("POST", "**/api/v1/auth/login").as("loginAPI");
          }

          // 3. Nhập Mật khẩu và Submit
          if (tc.pass !== "") {
            if (tc.id === 1) {
              // Kết hợp gõ pass và ấn Enter luôn cho gọn
              cy.get("#password").type(`${tc.pass}{enter}`);
            } else {
              cy.get("#password").type(tc.pass);
              cy.get(".btn-login").click();
            }
          } else {
            cy.get(".btn-login").click();
          }

          // 4. Kiểm tra kết quả (Assertions)
          if (tc.expectSuccess) {
            // Case 1: Chờ API trả về mã 200 OK rồi mới check chuyển trang
            cy.wait("@loginAPI");
            cy.url().should("include", "home.html");
            cy.get(".auth-form").should("not.exist");
          } else {
            if (tc.errorType === "html5_email") {
              cy.get("#email")
                .invoke("prop", "validationMessage")
                .should("not.be.empty");
            } else if (tc.errorType === "html5_pass") {
              cy.get("#password")
                .invoke("prop", "validationMessage")
                .should("not.be.empty");
            } else if (tc.errorType === "backend_error") {
              // Case 2, 7, 8: Chờ API trả về mã 401/400 rồi mới check thẻ báo lỗi
              cy.wait("@loginAPI");
              cy.get("#auth-error-message")
                .should("be.visible")
                .and("not.be.empty");
            }
          }
        });
      });
    },
  );
});
