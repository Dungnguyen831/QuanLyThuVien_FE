class AdminEffects {
    static init() {
        this.initSidebarToggle();
        this.initTooltip(); // Nếu dùng tooltip của Bootstrap
    }

    static initSidebarToggle() {
        // Lắng nghe click trên toàn bộ trang (Event Delegation)
        document.addEventListener('click', function (e) {
            
            // Tìm xem người dùng có bấm trúng cái nút có id="menu-toggle" không
            const toggleBtn = e.target.closest('#menu-toggle');
            
            if (toggleBtn) {
                e.preventDefault(); // Chặn hành vi mặc định của thẻ
                
                // Tìm cái khung chứa toàn bộ web
                const wrapper = document.getElementById('wrapper');
                
                // Bật/tắt class 'toggled'. 
                // Có class này -> CSS margin-left: -250px sẽ chạy (ẩn Sidebar)
                // Mất class này -> CSS trở lại bình thường (hiện Sidebar)
                wrapper.classList.toggle('toggled');
            }
        });
    }

    // Hàm tạo hiệu ứng load mượt mà cho các bảng dữ liệu
    static fadeIn(elementId) {
        const el = document.getElementById(elementId);
        if (el) {
            el.style.opacity = 0;
            let opacity = 0;
            const timer = setInterval(function () {
                if (opacity >= 1) {
                    clearInterval(timer);
                }
                el.style.opacity = opacity;
                opacity += 0.1;
            }, 30);
        }
    }
}