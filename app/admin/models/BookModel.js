class BookModel {
  constructor() {
    this.apiUrl = "http://localhost:8080/api/v1/books";
    this.allBooks = []; // Bộ nhớ đệm chứa toàn bộ sách từ Server để phân trang/lọc cục bộ
  }

  // [MỚI] Hàm cắt dữ liệu theo trang phục vụ hiển thị
  getBooksByPage(filteredList, page, itemsPerPage) {
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredList.slice(start, end);
  }

  // [MỚI] Hàm lọc dữ liệu tổng hợp dựa trên Search và 3 thanh Select
  filterBooks(allBooks, { query, category, publisher, status }) {
    return allBooks.filter((book) => {
      // 1. Lọc theo từ khóa (Tên hoặc ID)
      const matchQuery =
        !query ||
        book.title.toLowerCase().includes(query) ||
        book.id.toString().includes(query);

      // 2. Lọc theo ID Thể loại (Ép về String để so sánh an toàn)
      const matchCat =
        !category ||
        String(book.categoryId || book.category_id) === String(category);

      // 3. Lọc theo ID Nhà xuất bản
      const matchPub =
        !publisher ||
        String(book.publisherId || book.publisher_id) === String(publisher);

      // 4. Lọc theo Tình trạng
      // Lưu ý: value của option phải là 'available' hoặc 'out_of_stock' để tránh lỗi tiếng Việt
      let matchStatus = true;
      if (status === "available") matchStatus = book.availableQty > 0;
      if (status === "out_of_stock") matchStatus = book.availableQty === 0;

      return matchQuery && matchCat && matchPub && matchStatus;
    });
  }

  // Các hàm Fetch dữ liệu từ API
  // async fetchBooks() {
  //   const res = await fetch(this.apiUrl);
  //   return res.json();
  // }
  // Cập nhật hàm fetchBooks gửi kèm Token
  async fetchBooks() {
    const token = localStorage.getItem("token"); // Lấy token từ local storage

    const res = await fetch(this.apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Thêm dòng này để gửi token lên BE
      },
    });

    if (!res.ok) {
      if (res.status === 401 || res.status === 403) {
        throw new Error("Phiên đăng nhập hết hạn hoặc không có quyền!");
      }
      throw new Error("Lỗi khi lấy danh sách sách");
    }

    return await res.json();
  }
  async fetchBookById(id) {
    const response = await fetch(`${this.apiUrl}/${id}`);
    if (!response.ok) throw new Error("Không tìm thấy sách");
    return await response.json();
  }

  // Các hàm CRUD (Thêm, Sửa, Xóa)
  async createBook(bookData) {
    const res = await fetch(this.apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bookData),
    });
    return res.json();
  }

  async updateBook(id, bookData) {
    const res = await fetch(`${this.apiUrl}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bookData),
    });
    if (!res.ok) throw new Error("Lỗi khi cập nhật sách");
    return res.json();
  }

  async deleteBook(id) {
    const res = await fetch(`${this.apiUrl}/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Lỗi khi xóa sách");
    return true;
  }

  // Các hàm lấy danh sách danh mục hỗ trợ
  async fetchAuthors() {
    return fetch("http://localhost:8080/api/v1/authors").then((r) => r.json());
  }
  async fetchCategories() {
    return fetch("http://localhost:8080/api/v1/categories").then((r) =>
      r.json(),
    );
  }
  async fetchPublishers() {
    return fetch("http://localhost:8080/api/v1/publishers").then((r) =>
      r.json(),
    );
  }

  // Xử lý Upload ảnh lên Server
  async uploadImage(file) {
    const formData = new FormData();
    formData.append("file", file);
    const response = await fetch("http://localhost:8080/api/v1/upload", {
      method: "POST",
      body: formData,
    });
    if (!response.ok) throw new Error("Lỗi upload ảnh");
    const data = await response.json();
    return data.url;
  }
}
