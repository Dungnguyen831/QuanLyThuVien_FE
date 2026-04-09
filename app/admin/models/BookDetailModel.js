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
        
        // Lấy token từ localStorage (giống bên CategoryModel ông đã làm)
        const token = localStorage.getItem('token');

        const response = await fetch(`${this.apiUrl}/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                // Chèn Token vào đây để vượt qua lớp bảo mật JWT của Spring Boot
                'Authorization': `Bearer ${token}` 
            }
        });

        // Nếu Token hết hạn hoặc không có Token, server sẽ trả về 401 hoặc 403
        if (response.status === 401 || response.status === 403) {
            console.error("Token hết hạn hoặc không hợp lệ!");
            // Có thể điều hướng người dùng về trang login nếu cần
            // window.location.href = '/login.html';
            return null;
        }

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `Lỗi HTTP! Trạng thái: ${response.status}`);
        }

        const bookData = await response.json();
        console.log('[Model] Dữ liệu nhận được:', bookData);
        return bookData;

    } catch (error) {
        console.error('[Model Error] Lỗi khi lấy chi tiết sách:', error.message);
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