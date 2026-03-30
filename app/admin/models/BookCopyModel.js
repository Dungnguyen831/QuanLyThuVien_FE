class BookCopyModel {
    constructor() {
        this.apiUrl = 'http://localhost:8080/api/v1/book-copies';
    }

    async fetchCopiesByBookId(bookId) {
        try {
            const response = await fetch(`${this.apiUrl}/book/${bookId}`);
            if (!response.ok) throw new Error("Lỗi tải bản sao");
            return await response.json();
        } catch (error) {
            console.error(error);
            return [];
        }
    }

    async createBulk(bookId, quantity) {
        try {
            const response = await fetch(`${this.apiUrl}/bulk?quantity=${quantity}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                // Sửa lại cục body gửi lên cho khớp Entity
                body: JSON.stringify({ 
                    book: { id: parseInt(bookId) },
                    conditionStatus: "NEW",
                    availabilityStatus: "AVAILABLE"
                })
            });
            return response.ok;
        } catch (error) {
            return false;
        }
    }
    
}