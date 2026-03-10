class ComponentLoader {
    // Hàm nhận vào ID của thẻ div chứa và đường dẫn file HTML
    static async load(containerId, componentUrl) {
        try {
            const response = await fetch(componentUrl);
            if (!response.ok) throw new Error(`Không thể load ${componentUrl}`);
            
            const html = await response.text();
            document.getElementById(containerId).innerHTML = html;
        } catch (error) {
            console.error("Lỗi ComponentLoader:", error);
        }
    }

    // Hàm gọi tất cả các thành phần chung
    static async initAdminLayout() {
        await Promise.all([
            this.load('sidebar-container', 'app/admin/components/sidebar.html'),
            this.load('header-container', 'app/admin/components/header.html')
        ]);

        // KÍCH HOẠT HIỆU ỨNG JS NGAY SAU KHI HTML ĐÃ CÓ MẶT TRÊN TRANG
        if (typeof AdminEffects !== 'undefined') {
            AdminEffects.init();
        }
    }
}