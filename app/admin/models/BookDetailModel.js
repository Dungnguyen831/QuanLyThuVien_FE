class BookDetailModel {
    async fetchBookDetail(bookId) {
        try {
            // Thay URL này bằng đường dẫn API thật của bạn (ví dụ: http://localhost:8080/api/v1/books/7)
            const response = await fetch(`http://localhost:8080/api/v1/books/${bookId}`); 
            
            if (!response.ok) throw new Error('Lỗi khi lấy chi tiết sách');
            return await response.json();
            
        } catch (error) {
            console.error("Không thể lấy dữ liệu chi tiết sách:", error);
            // Trả về dữ liệu mẫu khớp với database library_db để ông test giao diện
            return {
                "id": bookId || 7,
                "title": "Java Programming Basics",
                "authorName": "Nguyễn Văn A",
                "categoryName": "Lập trình",
                "publishedYear": 2020,
                "isbn": "978604000001",
                "totalQty": 10,
                "availableQty": 10,
                "description": "Cuốn sách chuyên sâu về ngôn ngữ lập trình Java, cung cấp kiến thức nền tảng vững chắc cho người mới bắt đầu.",
                "imageUrl": "https://via.placeholder.com/300x450/007bff/ffffff?text=Java+Programming",
                "rating": 4.8,
                "reviewsCount": 1240
            };
        }
    }

    async updateBookDetail(bookId, updateData) {
        try {
            const response = await fetch(`http://localhost:8080/api/v1/books/${bookId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updateData)
            });

            if (!response.ok) throw new Error('Lỗi khi cập nhật thông tin sách');
            return await response.json();
        } catch (error) {
            console.error("Lỗi khi cập nhật sách:", error);
            throw error;
        }
    }
}