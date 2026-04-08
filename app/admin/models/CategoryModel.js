class CategoryModel {
    async fetchCategories() {
        try {
            // Thay URL này bằng đường dẫn API thật của bạn (ví dụ: http://localhost:8080/api/v1/categories)
            const response = await fetch('http://localhost:8080/api/v1/categories'); 
            
            if (!response.ok) throw new Error('Lỗi kết nối API');
            return await response.json();
            
        } catch (error) {
            console.error("Không thể lấy dữ liệu danh mục:", error);
            // Trả về dữ liệu mẫu dựa trên file SQL library_db để test
            return [
                {
                    "id": 1, 
                    "name": "Lập trình", 
                    "description": "Sách về lập trình và phát triển phần mềm",
                    "createdAt": "2026-03-05 23:44:35"
                },
                {
                    "id": 2, 
                    "name": "Khoa học máy tính", 
                    "description": "Sách về thuật toán, cấu trúc dữ liệu",
                    "createdAt": "2026-03-05 23:44:35"
                },
                {
                    "id": 3, 
                    "name": "Trí tuệ nhân tạo", 
                    "description": "Sách về AI, Machine Learning, Deep Learning",
                    "createdAt": "2026-03-05 23:44:35"
                }
            ];
        }
    }

    async createCategory(categoryData) {
        try {
            const response = await fetch('http://localhost:8080/api/v1/categories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(categoryData)
            });

            if (!response.ok) throw new Error('Lỗi khi tạo danh mục');
            return await response.json();
        } catch (error) {
            console.error("Lỗi khi tạo danh mục:", error);
            throw error;
        }
    }
}