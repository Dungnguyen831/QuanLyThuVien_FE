class BookModel {
    constructor() {
        this.apiUrl = 'http://localhost:8080/api/v1/books';
    }

    async fetchBooks() {
        const res = await fetch(this.apiUrl);
        return res.json();
    }

    async createBook(bookData) {
        const res = await fetch(this.apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bookData)
        });
        return res.json();
    }

    async updateBook(id, bookData) {
        const res = await fetch(`${this.apiUrl}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bookData)
        });
        if (!res.ok) throw new Error("Lỗi khi cập nhật sách");
        return res.json();
    }

    async deleteBook(id) {
        const res = await fetch(`${this.apiUrl}/${id}`, {
            method: 'DELETE'
        });
        if (!res.ok) throw new Error("Lỗi khi xóa sách");
        return true;
    }
    // Các hàm lấy danh sách hỗ trợ hiển thị tên và datalist
    async fetchAuthors() { return fetch('http://localhost:8080/api/v1/authors').then(r => r.json()); }
    async fetchCategories() { return fetch('http://localhost:8080/api/v1/categories').then(r => r.json()); }
    async fetchPublishers() { return fetch('http://localhost:8080/api/v1/publishers').then(r => r.json()); }

    //xử lý ảnh
    async uploadImage(file) {
        const formData = new FormData();
        formData.append('file', file);
    
        const response = await fetch('http://localhost:8080/api/v1/upload', {
            method: 'POST',
            body: formData // Đừng set Header Content-Type ở đây
        });
    
        if (!response.ok) {
            // Nếu không ok, cố gắng đọc lỗi từ server
            const errorText = await response.text();
            throw new Error(errorText || "Server error");
        }
    
        const data = await response.json();
        return data.url; 
    }
}