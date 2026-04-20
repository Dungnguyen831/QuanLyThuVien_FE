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

// File: auth.js

// 1. Hàm xử lý logic ẩn/hiện Avatar (như cũ)
function checkAuthAndUpdateNavbar() {
  const token = localStorage.getItem("token");
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch (e) {}

  const guestView = document.getElementById("guest-view");
  const userView = document.getElementById("user-view");
  const nameDisplay = document.getElementById("user-display-name");
  const avatarText = document.getElementById("user-avatar-text");

  if (!guestView || !userView) return;

  if (token && user) {
    guestView.style.display = "none";
    userView.style.display = "flex";
    if (user.fullName) {
      nameDisplay.textContent = user.fullName;
      avatarText.textContent = user.fullName.charAt(0).toUpperCase();
    }
  } else {
    guestView.style.display = "flex";
    userView.style.display = "none";
  }
}

// Hàm đăng xuất
window.handleLogout = function () {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "/app/user/views/home/home.html";
};

// ========================================================
// 2. LÍNH CANH (MUTATION OBSERVER) - ĐIỂM MẤU CHỐT LÀ ĐÂY
// ========================================================
document.addEventListener("DOMContentLoaded", function () {
  // Tạo một lính canh
  const observer = new MutationObserver(function (mutations, obs) {
    // Liên tục kiểm tra xem phần tử 'guest-view' của Navbar đã có mặt trên trang chưa
    const guestView = document.getElementById("guest-view");

    if (guestView) {
      // Ngay khi thấy Navbar xuất hiện, lập tức chạy hàm cập nhật
      checkAuthAndUpdateNavbar();

      // Chạy xong thì cho lính canh nghỉ việc luôn để nhẹ trình duyệt
      obs.disconnect();
    }
  });

  // Bắt đầu canh gác phần #navbar-container (hoặc toàn bộ body)
  const targetNode =
    document.getElementById("navbar-container") || document.body;
  observer.observe(targetNode, { childList: true, subtree: true });
});
