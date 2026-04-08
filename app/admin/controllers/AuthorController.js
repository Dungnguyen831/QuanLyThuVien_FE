class AuthorController {
    constructor(model, view) {
        this.model = model;
        this.view = view;
        this.init();
    }

    async init() {
        // 1. Gọi Model lấy danh sách từ API
        const authors = await this.model.fetchAuthors();
        
        
        // 2. Gọi View để in ra màn hình
        this.view.renderAuthors(authors);
    }
    // Hàm này gọi khi  nhấn nút "Xác nhận thêm" trên Modal
    async handleAddAuthor(authorData) {
        try {
            await this.model.createAuthor(authorData); // Gửi data lên server
            
            // SAU KHI THÊM THÀNH CÔNG:
            await this.init(); // Gọi lại hàm load danh sách để vẽ lại bảng
            
            alert("Thêm tác giả thành công!");
            // Nếu dùng Bootstrap Modal thì đóng nó lại ở đây
        } catch (error) {
            alert("Lỗi khi thêm: " + error.message);
        }
    }
}