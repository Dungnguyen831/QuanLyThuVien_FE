class BookModel {
  constructor() {
    this.apiUrl = "http://localhost:8080/api/v1/books";
    this.allBooks = []; // Bộ nhớ đệm chứa toàn bộ sách từ Server
  }

  // --- HÀM LỌC DỮ LIỆU TẠI CHỖ (Xử lý cục bộ ) ---
  filterBooks(allBooks, { query, category, publisher, status }) {
    const q = query ? query.toLowerCase() : "";
    return allBooks.filter((book) => {
      // 1. Lọc theo từ khóa (Tiêu đề hoặc ID)
      const matchQuery = !q || 
        book.title.toLowerCase().includes(q) || 
        book.id.toString().includes(q);

      // 2. Lọc theo Thể loại 
      const bookCatId = book.categoryId || book.category_id;
      const matchCat = !category || String(bookCatId) === String(category);

      // 3. Lọc theo Nhà xuất bản
      const bookPubId = book.publisherId || book.publisher_id;
      const matchPub = !publisher || String(bookPubId) === String(publisher);

      // 4. Lọc theo Tình trạng tồn kho
      let matchStatus = true;
      if (status === "available") matchStatus = book.availableQty > 0;
      if (status === "out_of_stock") matchStatus = book.availableQty === 0;

      return matchQuery && matchCat && matchPub && matchStatus;
    });
  }

  // --- CÁC HÀM GỌI API ---

  // Helper hàm để lấy Headers (Tự động đính kèm Token)
  getHeaders(isUpload = false) {
    const token = localStorage.getItem("token");
    const headers = { "Authorization": `Bearer ${token}` };
    if (!isUpload) headers["Content-Type"] = "application/json";
    return headers;
  }

  // Hàm xử lý tập trung khi Token hết hạn (Lỗi 401)
  _handleUnauthorized(res) {
    if (res.status === 401) {
      alert("Phiên đăng nhập đã hết hạn hoặc bạn không có quyền. Vui lòng đăng nhập lại!");
      localStorage.removeItem("token");
      window.location.href = "/login.html"; // Chuyển hướng an toàn
      return true;
    }
    return false;
  }

  async fetchBooks() {
    // SỬA LỖI: Thay thế header hardcode bằng this.getHeaders() để truyền Token
    const res = await fetch(this.apiUrl, {
      method: "GET",
      headers: this.getHeaders(),
    });

    if (this._handleUnauthorized(res)) return [];
    if (!res.ok) throw new Error("Không thể lấy danh sách sách");

    this.allBooks = await res.json(); // Gán toàn bộ danh sách vào bộ nhớ đệm
    return this.allBooks;
  }

  async fetchBookById(id) {
    // SỬA LỖI: Thay thế header hardcode bằng this.getHeaders() để truyền Token
    const res = await fetch(`${this.apiUrl}/${id}`, {
      method: "GET",
      headers: this.getHeaders(),
    });

    if (this._handleUnauthorized(res)) return null;
    if (!res.ok) throw new Error("Không tìm thấy sách");
    return await res.json();
  }

  async createBook(bookData) {
    const res = await fetch(this.apiUrl, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(bookData),
    });

    if (this._handleUnauthorized(res)) return null;
    if (!res.ok) throw new Error("Lỗi khi thêm sách mới");
    return await res.json();
  }

  async updateBook(id, bookData) {
    const res = await fetch(`${this.apiUrl}/${id}`, {
      method: "PUT",
      headers: this.getHeaders(),
      body: JSON.stringify(bookData),
    });

    if (this._handleUnauthorized(res)) return null;
    if (!res.ok) throw new Error("Lỗi khi cập nhật sách");
    return await res.json();
  }

  async deleteBook(id) {
    const res = await fetch(`${this.apiUrl}/${id}`, {
      method: "DELETE",
      headers: this.getHeaders(),
    });

    if (this._handleUnauthorized(res)) return false;
    if (!res.ok) throw new Error("Lỗi khi xóa sách");
    return true;
  }

  // --- XỬ LÝ UPLOAD ẢNH ---
  async uploadImage(file) {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("http://localhost:8080/api/v1/upload", {
      method: "POST",
      headers: this.getHeaders(true), // isUpload = true để trình duyệt tự định nghĩa Content-Type Multipart
      body: formData,
    });

    if (this._handleUnauthorized(res)) return null;
    if (!res.ok) throw new Error("Không thể upload ảnh!");
    const result = await res.json();
    return result.url;
  }
}