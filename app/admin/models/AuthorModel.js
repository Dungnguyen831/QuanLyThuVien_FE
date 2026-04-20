class AuthorModel {
    // Hàm phụ để lấy token từ localStorage
    getHeaders() {
        const token = localStorage.getItem('token');
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // Đính kèm token dạng Bearer
        };
    }

    async fetchAuthors() {
        try {
            // Thêm headers vào hàm GET
            const response = await fetch('http://localhost:8080/api/v1/authors', {
                method: 'GET',
                headers: this.getHeaders() 
            }); 
            
            if (!response.ok) throw new Error('Lỗi kết nối API hoặc Token hết hạn');
            return await response.json();
            
        } catch (error) {
            console.error("Không thể lấy dữ liệu tác giả:", error);
            // Dữ liệu mẫu để test khi lỗi
            return [
                {
                    "id": 1, 
                    "name": "Nguyễn Văn A", 
                    "biography": "Tác giả chuyên viết về lập trình Java và hệ thống.",
                    "avatarColor": "#0d6efd",
                    "createdAt": "2026-03-05 23:44:47"
                }
            ];
        }
    }

    async createAuthor(authorData) {
        const response = await fetch('http://localhost:8080/api/v1/authors', {
            method: 'POST',
            headers: this.getHeaders(), // Dùng hàm getHeaders để lấy cả Content-Type và Token
            body: JSON.stringify(authorData)
        });
        if (!response.ok) throw new Error('Không thể thêm tác giả. Kiểm tra quyền Admin!');
        return await response.json();
    }

    async updateAuthor(id, authorData) {
        const response = await fetch(`http://localhost:8080/api/v1/authors/${id}`, {
            method: 'PUT',
            headers: this.getHeaders(),
            body: JSON.stringify(authorData)
        });

        if (!response.ok) {
            throw new Error('Không thể cập nhật tác giả. Token có thể đã hết hạn!');
        }
        return await response.json();
    }

   async deleteAuthor(id) {
    const token = localStorage.getItem('token'); 
    
    const response = await fetch(`http://localhost:8080/api/v1/authors/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`, // Thêm dòng này
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        const errorData = await response.json(); // Backend trả về JSON nên dùng .json()
        throw new Error(errorData.message || "Lỗi không xác định");
    }
    return true;
}
}