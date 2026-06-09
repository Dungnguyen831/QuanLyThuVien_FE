/// <reference types="cypress" />

describe('Test Suite: Chức năng Đăng nhập - Hệ thống Quản Lý Thư Viện', () => {

  const loginUrl = 'http://127.0.0.1:5500/app/auth/views/login.html';

  beforeEach(() => {
    // Tiền điều kiện (Pre-condition): Truy cập trang đăng nhập trước mỗi Test Case
    cy.visit(loginUrl);
  });

  context('1. Kiểm thử Giao diện (UI Testing)', () => {
    it('TC01: Kiểm tra các thành phần giao diện hiển thị đầy đủ', () => {
      // Xác minh Logo và Tiêu đề
      cy.get('.logo-text').should('contain', 'QUẢN LÝ THƯ VIỆN');
      cy.get('.auth-welcome h2').should('contain', 'Chào Mừng Trở Lại');
      
      // Xác minh các ô nhập liệu và placeholder có tồn tại
      cy.get('#email').should('be.visible').and('have.attr', 'placeholder', 'name@institution.edu');
      cy.get('#password').should('be.visible').and('have.attr', 'placeholder', '••••••••••');
      
      // Xác minh nút Đăng nhập bị vô hiệu hóa (disabled) hoặc sẵn sàng click
      cy.get('.btn-login').should('be.visible').and('contain', 'Đăng Nhập');
    });

    it('TC02: Kiểm tra liên kết "Chuyển sang trang Đăng ký"', () => {
      cy.get('.forgot-password')
        .should('have.attr', 'href', '../../auth/views/register.html')
        .and('contain', 'Chưa có tài khoản?');
    });
  });

  context('2. Kiểm thử Validation Client-side (Frontend)', () => {
    it('TC03: Báo lỗi HTML5 khi để trống tài khoản và mật khẩu', () => {
      // Bấm nút đăng nhập ngay mà không nhập gì
      cy.get('.btn-login').click();
      
      // Kiểm tra thuộc tính validation mặc định của trình duyệt (required)
      cy.get('#email').invoke('prop', 'validationMessage').should('not.be.empty');
    });

    it('TC04: Báo lỗi HTML5 khi nhập sai định dạng Email (thiếu @)', () => {
      cy.get('#email').type('nguyenanhdung831gmail.com'); // Cố tình bỏ chữ @
      cy.get('.btn-login').click();
      
      // Trình duyệt phải báo lỗi yêu cầu có ký tự @
      cy.get('#email').invoke('prop', 'validationMessage').should('include', '@');
    });
  });

  context('3. Kiểm thử Xác thực Server-side (Backend)', () => {
    it('TC05: Hiển thị lỗi khi nhập sai mật khẩu', () => {
      cy.get('#email').type('nguyenanhdung831@gmail.com');
      cy.get('#password').type('SaiMatKhau123!@#');
      cy.get('.btn-login').click();

      // Vùng hiển thị lỗi phải xuất hiện và có text (phụ thuộc vào Backend trả về)
      cy.get('#auth-error-message')
        .should('be.visible')
        .and('not.be.empty');
    });

    it('TC06: Hiển thị lỗi khi nhập Email chưa được đăng ký', () => {
      cy.get('#email').type('taikhoankhongtontai@utt.edu.vn');
      cy.get('#password').type('admin123456');
      cy.get('.btn-login').click();

      cy.get('#auth-error-message').should('be.visible');
    });
  });

  context('4. Kiểm thử Chức năng & Luồng chính (Functional & Happy Path)', () => {
    it('TC07: Tính năng Ẩn/Hiện mật khẩu (Toggle Password View)', () => {
      cy.get('#password').type('admin123456');
      cy.get('#password').should('have.attr', 'type', 'password'); // Đang ẩn
      
      cy.get('.toggle-password').click();
      cy.get('#password').should('have.attr', 'type', 'text'); // Đã hiện
      
      cy.get('.toggle-password').click();
      cy.get('#password').should('have.attr', 'type', 'password'); // Ẩn lại
    });

    it('TC08: Đăng nhập thành công bằng cách nhấn phím Enter (Keyboard Interaction)', () => {
      cy.get('#email').type('nguyenanhdung831@gmail.com');
      // Thêm {enter} vào cuối chuỗi type để giả lập người dùng ấn phím Enter
      cy.get('#password').type('admin123456{enter}'); 

      // Xác minh chuyển hướng thành công
      cy.url().should('include', 'home.html');
      
      // Xác minh form đăng nhập không còn trên màn hình
      cy.get('.auth-form').should('not.exist');
    });

    it('TC09: Đăng nhập thành công bằng cách click chuột vào nút (Chuẩn Happy Path)', () => {
      cy.get('#email').type('nguyenanhdung831@gmail.com');
      cy.get('#password').type('admin123456');
      cy.get('.btn-login').click();

      cy.url().should('include', 'home.html');
    });
  });

});