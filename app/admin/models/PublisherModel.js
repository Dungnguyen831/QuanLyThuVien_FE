class PublisherModel {
    async fetchPublishers() {
        try {
            // Thay URL này bằng đường dẫn API thật của bạn (ví dụ: http://localhost:8080/api/v1/publishers)
            const response = await fetch('http://localhost:8080/api/v1/publishers'); 
            
            if (!response.ok) throw new Error('Lỗi kết nối API');
            return await response.json();
            
        } catch (error) {
            console.error("Không thể lấy dữ liệu nhà xuất bản:", error);
            // Trả về dữ liệu mẫu dựa trên file SQL library_db để test
            return [
                {
                    "id": 1, "name": "NXB Giáo Dục", "address": "Hà Nội, Việt Nam", 
                    "email": "contact@giaoduc.vn", "createdAt": "2026-03-05 23:44:55"
                },
                {
                    "id": 2, "name": "NXB Công Nghệ", "address": "TP Hồ Chí Minh, Việt Nam", 
                    "email": "info@congnghe.vn", "createdAt": "2026-03-05 23:44:55"
                }
            ];
        }
    }

    async createPublisher(publisherData) {
        try {
            const response = await fetch('http://localhost:8080/api/v1/publishers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(publisherData)
            });

            if (!response.ok) throw new Error('Lỗi khi thêm nhà xuất bản');
            return await response.json();
        } catch (error) {
            console.error("Lỗi khi thêm nhà xuất bản:", error);
            throw error;
        }
    }
}