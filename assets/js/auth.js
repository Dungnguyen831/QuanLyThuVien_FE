function checkAuth() {
  const token = localStorage.getItem("token");
  if (!token) {
    // Nếu không có token, chuyển hướng đến trang đăng nhập
    alert("Vui lòng đăng nhập để thực hiện chức năng này.");
    window.location.href = "/app/auth/views/login.html"; // Cập nhật đường dẫn tuyệt đối nếu cần
    return false;
  }
  return true;
}
