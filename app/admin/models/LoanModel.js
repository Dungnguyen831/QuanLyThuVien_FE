class AuthorModel {
    async fetchAuthors() {
        try {
            // Thay URL này bằng đường dẫn API thật của bạn (ví dụ: http://localhost:8080/api/v1/authors)
            const response = await fetch('http://localhost:8080/api/v1/authors'); 
            
            if (!response.ok) throw new Error('Lỗi kết nối API');
            return await response.json();
            
        } catch (error) {
            console.error("Không thể lấy dữ liệu tác giả:", error);
            // Trả về dữ liệu mẫu dựa trên file SQL library_db để test
            return [
                {
                    "id": 1, 
                    "name": "Nguyễn Văn A", 
                    "biography": "Tác giả chuyên viết sách về lập trình Java",
                    "createdAt": "2026-03-05 23:44:47"
                },
                {
                    "id": 2, 
                    "name": "Trần Văn B", 
                    "biography": "Giảng viên khoa Công nghệ thông tin",
                    "createdAt": "2026-03-05 23:44:47"
                }
            ];
        }
    }

    async createAuthor(authorData) {
        try {
            const response = await fetch('http://localhost:8080/api/v1/authors', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(authorData)
            });

<<<<<<< HEAD
            if (!response.ok) throw new Error('Lỗi khi thêm tác giả');
            return await response.json();
=======
            if (!response.ok) throw new Error('Lỗi khi tạo phiếu mượn');
            return await response.text();
>>>>>>> ba9c901ac6b6829e38c89a87240c275e04865773
        } catch (error) {
            console.error("Lỗi khi thêm tác giả:", error);
            throw error;
        }
    }
}