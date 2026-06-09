// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
// Tạo một lệnh mới tên là cy.loginByApi()
Cypress.Commands.add('loginByApi', (email, password) => {
  // Gửi request thẳng xuống API Spring Boot của bạn
  cy.request({
    method: 'POST',
    url: 'http://localhost:8080/api/v1/auth/login', 
    body: {
      email: email,
      password: password
    }
  }).then((response) => {
    // Đảm bảo API trả về 200 OK
    expect(response.status).to.eq(200);
    
    // Lấy JWT Token từ response và lưu vào LocalStorage của trình duyệt.
    // LƯU Ý: Thay 'token' bằng đúng cái tên (key) mà Frontend của bạn đang dùng để lưu JWT
    window.localStorage.setItem('token', response.body.token); 
    
    // Nếu dự án lưu thêm thông tin user, bạn cũng có thể set luôn ở đây
    // window.localStorage.setItem('user_info', JSON.stringify(response.body.user));
  });
});