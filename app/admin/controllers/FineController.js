class FineController {
    constructor(model, view) {
        this.model = model;
        this.view = view;
        this.allFines = [];

        // Lắng nghe sự kiện bấm nút Thu tiền từ View
        this.view.bindPayAction(this.handlePayFine.bind(this));
        this.view.bindCreateFine(this.handleCreateFine.bind(this));
    }

    async init() {
        await this.loadFines();
        this.setupFilters(); 
    }

    async loadFines() {
        try {
            // Gọi Model lấy dữ liệu (API hoặc Mock)
            this.allFines = await this.model.fetchFines();
            // Đưa dữ liệu sang View để vẽ bảng
            this.view.renderFines(this.allFines);
        } catch (error) {
            console.error("Lỗi khi tải danh sách phạt:", error);
        }
    }

    async handlePayFine(fineId) {
        try {
            // Báo Model gọi API thu tiền
            await this.model.payFine(fineId);
            alert("Đã thu tiền phạt thành công!");
            
            await this.loadFines();

            document.getElementById('search-fine-input').value = '';
            document.querySelector('.filter-select').value = '';
        } catch (error) {
            // Nếu dùng Mock Data và chưa có API thật, nó sẽ văng lỗi vào đây
            alert("Lỗi thu tiền (Hoặc do bạn đang dùng Mock Data nên không thể sửa DB): " + error.message);
        }
    }

    setupFilters() {
        const searchInput = document.getElementById('search-fine-input');
        const statusSelect = document.querySelector('.filter-select'); // Lấy cái thẻ select trạng thái

        // Hàm gộp chung để chạy mỗi khi người dùng gõ chữ hoặc chọn dropdown
        const applyFilters = () => {
            const keyword = searchInput ? searchInput.value.toLowerCase().trim() : '';
            const status = statusSelect ? statusSelect.value : '';
            this.processFilter(keyword, status);
        };

        // Bắt sự kiện 'input' (khi gõ phím) và 'change' (khi chọn dropdown)
        if (searchInput) searchInput.addEventListener('input', applyFilters);
        if (statusSelect) statusSelect.addEventListener('change', applyFilters);
    }

    processFilter(keyword, status) {
        let filteredData = this.allFines;

        // 1. Xử lý Lọc theo Từ khóa
        if (keyword) {
            filteredData = filteredData.filter(fine => {
                // Tạo ra các chuỗi giống hệt trên giao diện để so sánh (Ví dụ: "f001", "mp042")
                const idText = `f${String(fine.id).padStart(3, '0')}`;
                const loanIdText = `mp${String(fine.loanDetailId).padStart(3, '0')}`;
                const nameText = fine.userName ? fine.userName.toLowerCase() : "";

                // Trả về true nếu từ khóa nằm trong Mã phạt, Mã phiếu, hoặc Tên độc giả
                return idText.includes(keyword) || 
                       loanIdText.includes(keyword) || 
                       nameText.includes(keyword);
            });
        }

        // 2. Xử lý Lọc theo Trạng thái (Đã đóng / Chưa đóng)
        if (status === 'paid') {
            filteredData = filteredData.filter(fine => fine.isPaid === true);
        } else if (status === 'unpaid') {
            filteredData = filteredData.filter(fine => fine.isPaid === false);
        }

        // 3. Đưa mảng dữ liệu đã lọc qua cho View vẽ lại bảng
        this.view.renderFines(filteredData);
    }

    async handleCreateFine(fineData) {
        try {
            await this.model.createManualFine(fineData);
            alert("Đã tạo biên bản phạt thành công!");
            
            this.view.closeCreateModal(); // Tắt popup
            await this.loadFines();       // Tải lại bảng ngay lập tức
        } catch (error) {
            alert("Lỗi tạo biên bản phạt (Hoặc do dùng Mock Data): " + error.message);
        }
    }
}