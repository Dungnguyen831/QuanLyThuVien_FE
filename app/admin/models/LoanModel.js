class LoanModel {
  async fetchLoans() {
    try {
      // Thay URL này bằng đường dẫn API thật của bạn (ví dụ: http://localhost:8080/api/v1/loans)
      //   const response = await fetch("http://localhost:8080/api/v1/loans");
      const token =
        "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbjIzQGxpYnJhcnkuY29tIiwiaWF0IjoxNzc0MTkyNDg0LCJleHAiOjE3NzQyNzg4ODR9.WzWc_Et3w4bIjRX3TC2eSFc7NEM-GMrt-Dp5BOJk3Ho";
      const response = await fetch("http://localhost:8080/api/v1/loans", {
        method: "GET", // hoặc 'POST', 'PUT', ...
        headers: {
          "Content-Type": "application/json",
          // Thêm token vào header Authorization
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Lỗi kết nối API");
      return await response.json();
    } catch (error) {
      console.error("Không thể lấy dữ liệu:", error);
      // Tạm thời trả về dữ liệu mẫu của bạn để test nếu API chưa chạy
      return [
        {
          id: "MP001",
          userName: "Mẫu",
          userAvatarColor: "#0d6efd",
          bookName: "Lập trình Python Cơ bản",
          borrowDate: "10/10/2023",
          dueDate: "25/10/2023",
          returnDate: "-",
          status: "borrowing",
        },
      ];
    }
  }

  async createLoan(loanData) {
    try {
      const response = await fetch("http://localhost:8080/api/v1/loans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loanData),
      });

      if (!response.ok) throw new Error("Lỗi khi tạo phiếu mượn");
      return await response.json();
    } catch (error) {
      console.error("Lỗi khi tạo phiếu mượn:", error);
      throw error;
    }
  }
}
