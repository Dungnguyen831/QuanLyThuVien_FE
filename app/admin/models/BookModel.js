class BookModel {
    constructor() {
        this.apiUrl = 'http://localhost:8080/api/v1/books';
    }

    // Lấy danh sách toàn bộ sách
    async fetchBooks() {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(this.apiUrl, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) {
                throw new Error(`Lỗi Server: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error("Lỗi ở BookModel:", error);
            throw error;
        }
    }
}