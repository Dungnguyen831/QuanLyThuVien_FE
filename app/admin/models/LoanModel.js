class LoanModel {
  
  // ==========================================
  // 1. LẤY DANH SÁCH PHIẾU MƯỢN
  // ==========================================
  async fetchLoans() {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:8080/api/v1/loans", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, // Có Token
        },
      });
      if (!response.ok) throw new Error("Lỗi kết nối API lấy danh sách");
      return await response.json();
    } catch (error) {
      console.error("Không thể lấy dữ liệu:", error);
      // Tạm thời trả về mảng rỗng để bảng không bị sập nếu lỗi API
      return []; 
    }
  }

  // ==========================================
  // 2. TẠO PHIẾU MƯỢN MỚI
  // ==========================================
  async createLoan(loanData) {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:8080/api/v1/loans", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` // ĐÃ THÊM TOKEN CHO AN TOÀN
        },
        body: JSON.stringify(loanData),
      });

      if (!response.ok) {
         // Lấy câu thông báo lỗi từ Backend (Ví dụ: "Độc giả đang nợ phạt")
         const errorMsg = await response.text(); 
         throw new Error(errorMsg);
      }
      return await response.text();
    } catch (error) {
      console.error("Lỗi khi tạo phiếu mượn:", error);
      throw error;
    }
  }

  // ==========================================
  // 3. XÓA PHIẾU MƯỢN
  // ==========================================
  async deleteLoan(loanId) {
    try {
        const token = localStorage.getItem("token");
        const response = await fetch(`http://localhost:8080/api/v1/loans/${loanId}`, {
            method: 'DELETE',
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        
        if (!response.ok) {
            const errorMsg = await response.text();
            throw new Error(errorMsg);
        }
        return await response.text();
    } catch (error) {
        console.error("Lỗi khi xóa phiếu mượn:", error);
        throw error;
    }
  }

  // ==========================================
  // 4. GIA HẠN SÁCH
  // ==========================================
  async renewBook(detailId, newDateData) {
    try {
        const token = localStorage.getItem("token");
        const response = await fetch(`http://localhost:8080/api/v1/loans/details/${detailId}/renew`, {
            method: 'PUT',
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(newDateData)
        });
        
        if (!response.ok) {
            const errorMsg = await response.text();
            throw new Error(errorMsg);
        }
        return await response.text();
    } catch (error) {
        console.error("Lỗi khi gia hạn sách:", error);
        throw error;
    }
  }

  // ==========================================
  // 5. TRẢ SÁCH
  // ==========================================
  async returnBook(detailId, conditionData) {
    try {
        const token = localStorage.getItem("token");
        const response = await fetch(`http://localhost:8080/api/v1/loans/details/${detailId}/return`, {
            method: 'PUT',
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(conditionData)
        });
        
        if (!response.ok) {
            const errorMsg = await response.text();
            throw new Error(errorMsg);
        }
        return await response.text();
    } catch (error) {
        console.error("Lỗi khi trả sách:", error);
        throw error;
    }
  }


// ==========================================
// 6. HỖ TRỢ LẤY DANH SÁCH ĐỘC GIẢ VÀ SÁCH (DÙNG CHO THÊM PHIẾU MƯỢN)
// ==========================================
  // Lấy danh sách tất cả độc giả
  async fetchAllUsers() {
    try {
      const token = localStorage.getItem("token");
      // Sửa lại URL cho đúng với API của bạn
      const res = await fetch("http://localhost:8080/api/v1/users", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (!res.ok) return [];
      return await res.json();
    } catch (error) {
      console.error("Lỗi tải danh sách độc giả:", error);
      return [];
    }
  }

  // Lấy danh sách tất cả sách
  async fetchAllBooks() {
    try {
      const token = localStorage.getItem("token");
      // Sửa lại URL cho đúng với API của bạn
      const res = await fetch("http://localhost:8080/api/v1/books", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (!res.ok) return [];
      return await res.json();
    } catch (error) {
      console.error("Lỗi tải danh sách sách:", error);
      return [];
    }
  }
}