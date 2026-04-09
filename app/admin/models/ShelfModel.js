class ShelfModel {
    async fetchShelves() {
        try {
            // Thay URL này bằng đường dẫn API thật của bạn (ví dụ: http://localhost:8080/api/v1/shelves)
            const response = await fetch('http://localhost:8080/api/v1/shelves'); 
            
            if (!response.ok) throw new Error('Lỗi kết nối API');
            return await response.json();
            
        } catch (error) {
            console.error("Không thể lấy dữ liệu kệ sách:", error);
            // Trả về dữ liệu mẫu dựa trên file SQL library_db để test
            return [
                {
                    "id": 1, "name": "Chưa có", "location": "Tầng 1, khu vực A", 
                    "capacity": 65, "createdAt": "2026-03-05 23:44:55"
                },
                {
                    "id": 2, "name": "ĐÉo có", "location": "Tầng 2, khu vực B", 
                    "capacity": 150, "createdAt": "2026-03-05 23:44:55"
                }
            ];
        }
    }

    async createShelf(shelfData) {
        try {
            const response = await fetch('http://localhost:8080/api/v1/shelves', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(shelfData)
            });

            if (!response.ok) throw new Error('Lỗi khi thêm kệ sách');
            return await response.json();
        } catch (error) {
            console.error("Lỗi khi thêm kệ sách:", error);
            throw error;
        }
    }
}