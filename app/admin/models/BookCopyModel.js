class BookCopyModel {
    constructor() {
        this.apiUrl = 'http://localhost:8080/api/v1/book-copies';
    }

    // Hàm bổ trợ để lấy Header có chứa Token
    _getHeaders() {
        const token = localStorage.getItem("token");
        const headers = {
            'Content-Type': 'application/json'
        };
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        return headers;
    }

    async fetchCopiesByBookId(bookId) {
        try {
            const response = await fetch(`${this.apiUrl}/book/${bookId}`, {
                method: 'GET',
                headers: this._getHeaders() // Thêm token vào đây
            });
            
            if (!response.ok) {
                if (response.status === 401) throw new Error("Phiên đăng nhập hết hạn");
                throw new Error("Lỗi tải bản sao");
            }
            return await response.json();
        } catch (error) {
            console.error("Lỗi fetchCopiesByBookId:", error);
            return [];
        }
    }

    async createBulk(bookId, quantity) {
        try {
            const response = await fetch(`${this.apiUrl}/bulk?quantity=${quantity}`, {
                method: 'POST',
                headers: this._getHeaders(), // Thêm token vào đây
                body: JSON.stringify({ 
                    book: { id: parseInt(bookId) },
                    conditionStatus: "NEW",
                    availabilityStatus: "AVAILABLE"
                })
            });
            
            if (response.status === 401) {
                alert("Bạn không có quyền thực hiện thao tác này hoặc chưa đăng nhập.");
                return false;
            }
            
            return response.ok;
        } catch (error) {
            console.error("Lỗi createBulk:", error);
            return false;
        }
    }
}