/**
 * BookDetailModel.js
 * Chịu trách nhiệm quản lý dữ liệu cho trang chi tiết sách
 */
class BookDetailModel {
    constructor() {
        // Cấu hình URL cơ sở của API Spring Boot
        this.apiUrl = 'http://localhost:8080/api/v1/books';
    }

    /**
     * Lấy thông tin chi tiết của một cuốn sách theo ID
     * @param {number|string} id - ID của cuốn sách cần lấy
     * @returns {Promise<Object|null>} - Trả về object sách hoặc null nếu lỗi
     */
    async fetchBookDetail(id) {
        try {
            console.log(`[Model] Đang gọi API lấy chi tiết sách ID: ${id}...`);
            
            const response = await fetch(`${this.apiUrl}/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    // Nếu sau này ông làm chức năng đăng nhập, thêm Token ở đây:
                    // 'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            // Kiểm tra nếu phản hồi không thành công (ví dụ lỗi 404, 500)
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Lỗi HTTP! Trạng thái: ${response.status}`);
            }

            // Chuyển đổi dữ liệu JSON từ server
            const bookData = await response.json();
            
            console.log('[Model] Dữ liệu nhận được:', bookData);
            return bookData;

        } catch (error) {
            console.error('[Model Error] Lỗi khi lấy chi tiết sách:', error.message);
            // Ông có thể bắn thông báo ra UI hoặc trả về null để Controller xử lý
            return null;
        }
    }

    /**
     * (Tùy chọn) Gửi yêu cầu mượn sách
     * @param {Object} borrowData - Thông tin phiếu mượn
     */
    async sendBorrowRequest(borrowData) {
        try {
            const response = await fetch('http://localhost:8080/api/borrows', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(borrowData)
            });
            return await response.json();
        } catch (error) {
            console.error('[Model Error] Lỗi mượn sách:', error);
            return { success: false, message: "Lỗi kết nối server" };
        }
    }
}