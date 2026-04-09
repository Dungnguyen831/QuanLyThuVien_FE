class CategoryModel {
    constructor() {
        this.apiUrl = 'http://localhost:8080/api/v1/categories';
    }

    // Hàm phụ để lấy token từ localStorage 
    getHeaders() {
        const token = localStorage.getItem('token'); 
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
        };
    }

    async fetchCategories() {
        try {
            const response = await fetch(this.apiUrl, {
                method: 'GET',
                headers: this.getHeaders() 
            }); 
            
            // Xử lý lỗi 401 hoặc 500 từ server
            if (!response.ok) throw new Error('Lỗi kết nối API hoặc Token hết hạn');
            return await response.json();
            
        } catch (error) {
            console.error("Không thể lấy dữ liệu danh mục:", error);
            // Trả về mảng rỗng để tránh lỗi "undefined" ở View
            return [];
        }
    }

    async searchCategories(name) {
        try {
            // Sửa lỗi 401 khi tìm kiếm bằng cách đính kèm Header
            const response = await fetch(`${this.apiUrl}?name=${encodeURIComponent(name)}`, {
                method: 'GET',
                headers: this.getHeaders()
            });
            
            if (!response.ok) throw new Error('Lỗi khi tìm kiếm hoặc không có quyền');
            return await response.json();
        } catch (error) {
            console.error("Lỗi tìm kiếm:", error);
            throw error;
        }
    }

    async createCategory(categoryData) {
        const response = await fetch(this.apiUrl, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify(categoryData)
        });
        if (!response.ok) throw new Error('Không thể thêm danh mục. Kiểm tra quyền Admin!');
        return await response.json();
    }

    async updateCategory(id, categoryData) {
        const response = await fetch(`${this.apiUrl}/${id}`, {
            method: 'PUT',
            headers: this.getHeaders(),
            body: JSON.stringify(categoryData)
        });

        if (!response.ok) {
            throw new Error('Không thể cập nhật danh mục. Token có thể đã hết hạn!');
        }
        return await response.json();
    }

    async deleteCategory(id) {
        const response = await fetch(`${this.apiUrl}/${id}`, {
            method: 'DELETE',
            headers: this.getHeaders()
        });

        if (!response.ok) {
            // Xử lý lỗi trả về từ Backend
            try {
                const errorData = await response.json();
                throw new Error(errorData.message || "Lỗi không xác định");
            } catch (e) {
                throw new Error("Không thể xóa danh mục này!");
            }
        }
        return true;
    }
}