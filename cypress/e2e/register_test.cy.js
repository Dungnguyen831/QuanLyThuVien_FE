/// <reference types="cypress" />

describe('Test Suite: Chức năng Đăng ký - Hệ thống Quản Lý Thư Viện', () => {

  // Sửa lại URL này cho khớp với port chạy Live Server của bạn
  const registerUrl = 'http://127.0.0.1:5500/app/auth/views/register.html';

  beforeEach(() => {
    // Tiền điều kiện: Truy cập trang đăng ký trước mỗi Test Case
    cy.visit(registerUrl);
  });

  context('1. Kiểm thử Giao diện (UI Testing)', () => {
    it('TC01: Kiểm tra các thành phần giao diện hiển thị đầy đủ', () => {
      // Xác minh Tiêu đề
      cy.get('.form-title').should('contain', 'Tạo Tài Khoản');
      
      // Xác minh các ô nhập liệu tồn tại
      cy.get('input[name="fullName"]').should('be.visible');
      cy.get('input[name="email"]').should('be.visible');
      cy.get('input[name="phone"]').should('be.visible');
      cy.get('input[name="password"]').should('be.visible');
      cy.get('input[name="confirm_password"]').should('be.visible');
      
      // Xác minh nút Đăng ký và liên kết Đăng nhập
      cy.get('.submit-btn').should('be.visible').and('contain', 'Tạo Tài Khoản');
      cy.get('.login-prompt a').should('have.attr', 'href', '../../auth/views/login.html');
    });
  });

  context('2. Kiểm thử Validation Client-side (Frontend)', () => {
    it('TC02: Báo lỗi khi để trống tất cả các trường', () => {
      // Click nút submit ngay lập tức
      cy.get('.submit-btn').click();
      
      // Kỳ vọng script JS (registerValidation.js) của bạn sẽ điền text vào các thẻ lỗi
      // Lưu ý: Nếu validation của bạn dùng HTML5 'required', hãy dùng cách invoke('prop', 'validationMessage') như bài login
      cy.get('.error-message').first().should('not.be.empty'); 
    });

    it('TC03: Báo lỗi khi nhập sai định dạng Email', () => {
      cy.get('input[name="fullName"]').type('Nguyen Van A');
      cy.get('input[name="email"]').type('email_khong_hop_le');
      cy.get('.submit-btn').click();

      // Kỳ vọng báo lỗi ở ô email (ô input thứ 2)
      cy.get('.error-message').eq(1).should('not.be.empty');
    });

    it('TC04: Báo lỗi khi số điện thoại chứa chữ cái', () => {
      cy.get('input[name="phone"]').type('098abc1234');
      cy.get('.submit-btn').click();

      // Kỳ vọng báo lỗi ở ô phone (ô input thứ 3)
      cy.get('.error-message').eq(2).should('not.be.empty');
    });

    it('TC05: Báo lỗi khi "Xác nhận mật khẩu" không khớp với "Mật khẩu"', () => {
      cy.get('input[name="password"]').type('Admin@123');
      cy.get('input[name="confirm_password"]').type('Admin@123456'); // Cố tình gõ sai
      cy.get('.submit-btn').click();

      // Kỳ vọng báo lỗi ở ô confirm_password (ô input thứ 5)
      cy.get('.error-message').eq(4).should('not.be.empty');
    });
  });

  context('3. Kiểm thử Xác thực Server-side (Backend API)', () => {
    it('TC06: Từ chối đăng ký khi Email đã tồn tại trong hệ thống', () => {
      // Giả sử email 'admin@library.com' đã có trong Database
      cy.get('input[name="fullName"]').type('Người Dùng Test');
      cy.get('input[name="email"]').type('admin@library.com'); 
      cy.get('input[name="phone"]').type('0987654321');
      cy.get('input[name="password"]').type('Password123!');
      cy.get('input[name="confirm_password"]').type('Password123!');
      cy.get('.submit-btn').click();

      // Kỳ vọng Backend trả về lỗi và hiển thị lên UI
      // Bạn cần điều chỉnh selector này tùy theo cách Backend của bạn hiển thị lỗi trùng email
      cy.get('.error-message').eq(1).should('contain', 'đã tồn tại'); 
    });
  });

  context('4. Kiểm thử Chức năng & Luồng chính (Happy Path)', () => {
    it('TC07: Tính năng Ẩn/Hiện mật khẩu cho cả 2 ô', () => {
      cy.get('input[name="password"]').type('Secret123');
      cy.get('input[name="confirm_password"]').type('Secret123');
      
      // Trạng thái ban đầu phải là ẩn
      cy.get('input[name="password"]').should('have.attr', 'type', 'password');
      cy.get('input[name="confirm_password"]').should('have.attr', 'type', 'password');

      // Click icon mắt ở ô password
      cy.get('.toggle-password').first().click();
      cy.get('input[name="password"]').should('have.attr', 'type', 'text');
      
      // Click icon mắt ở ô confirm password
      cy.get('.toggle-password').last().click();
      cy.get('input[name="confirm_password"]').should('have.attr', 'type', 'text');
    });

    it('TC08: Đăng ký thành công với dữ liệu hợp lệ (Luồng chuẩn)', () => {
      // Tạo một email ngẫu nhiên để tránh bị trùng lặp khi chạy test nhiều lần
      const randomEmail = `testuser${Math.floor(Math.random() * 10000)}@utt.edu.vn`;

      cy.get('input[name="fullName"]').type('Sinh Viên Test');
      cy.get('input[name="email"]').type(randomEmail);
      cy.get('input[name="phone"]').type('0901234567');
      cy.get('input[name="password"]').type('StrongPass@2024');
      cy.get('input[name="confirm_password"]').type('StrongPass@2024');
      
      cy.get('.submit-btn').click();

      // Xác minh hệ thống chuyển hướng về trang Đăng nhập sau khi đăng ký thành công
      cy.url().should('include', 'login.html');
    });
  });

});