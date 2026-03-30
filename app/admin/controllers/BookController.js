

class BookController {
  constructor(model, view) {
    this.model = model;
    this.view = view;
    this.authors = [];
    this.categories = [];
    this.publishers = [];
    this.currentBooks = []; // Danh sách gốc từ server
    this.filteredBooks = []; // Danh sách sau khi lọc/tìm kiếm
    this.currentPage = 1; // Trang hiện tại
    this.itemsPerPage = 10; // Số bản ghi mỗi trang
    this.copyController = null; // Kết nối với Modal chi tiết bản sao
  }

  // Khởi tạo hệ thống
  async init() {
    this.view.setupUIState();
    try {
      await this.refreshAllDatalists();
      await this.loadBooks();
      this.bindEvents();
    } catch (error) {
      console.error("Lỗi khởi tạo:", error);
    }
  }

  // Tải lại toàn bộ danh sách sách từ server
  async loadBooks() {
    try {
      this.currentBooks = await this.model.fetchBooks();
      this.filteredBooks = this.currentBooks; // Ban đầu, hiển thị tất cả
      this.currentPage = 1; // Reset về trang đầu
      this.renderCurrentPage(); // Vẽ lại giao diện
    } catch (error) {
      console.error("Lỗi tải sách:", error);
    }
  }

  // Tải và làm mới các danh sách (author, category, publisher) cho các bộ lọc
  async refreshAllDatalists() {
    try {
      const [authors, categories, publishers] = await Promise.all([
        this.model.fetchAuthors(),
        this.model.fetchCategories(),
        this.model.fetchPublishers(),
      ]);
      this.authors = authors;
      this.categories = categories;
      this.publishers = publishers;

      // Đổ dữ liệu vào các ô Select lọc ở thanh tìm kiếm
      const filterCat = document.getElementById("filterCategory");
      const filterPub = document.getElementById("filterPublisher");

      if (filterCat) {
        filterCat.innerHTML =
          '<option value="">Thể loại</option>' +
          this.categories
            .map((c) => `<option value="${c.id}">${c.name || c.title}</option>`)
            .join("");
      }
      if (filterPub) {
        filterPub.innerHTML =
          '<option value="">Nhà xuất bản</option>' +
          this.publishers
            .map((p) => `<option value="${p.id}">${p.name || p.title}</option>`)
            .join("");
      }
    } catch (error) {
      console.error("Lỗi làm mới danh sách dữ liệu:", error);
    }
  }

  // Hàm trung tâm điều khiển việc hiển thị bảng theo trang
  renderCurrentPage() {
    const total = this.filteredBooks.length;
    const booksToShow = this.model.getBooksByPage(
      this.filteredBooks,
      this.currentPage,
      this.itemsPerPage,
    );

    this.view.renderBooks(
      booksToShow,
      this.authors,
      this.categories,
      this.publishers,
    );

    this.view.renderPagination(
      total,
      this.currentPage,
      this.itemsPerPage,
      (page) => {
        this.currentPage = page;
        this.renderCurrentPage();
      },
    );
    this.view.updatePaginationText(total, this.currentPage, this.itemsPerPage);
  }

  // Thu thập dữ liệu từ Form (Add/Edit)
  getFormData(prefix) {
    const getV = (id) => document.getElementById(id)?.value.trim() || "";
    const isEdit = prefix === "edit";
    return {
      title: getV(isEdit ? "editBookTitle" : "bookTitle"),
      isbn: getV(isEdit ? "editBookIsbn" : "bookIsbn"),
      publishedYear:
        parseInt(getV(isEdit ? "editBookYear" : "bookYear")) || 2026,
      imageUrl: getV(isEdit ? "editBookImageUrlHidden" : "bookImageUrlHidden"),
      categoryId:
        parseInt(getV(isEdit ? "editCategoryInput" : "categoryInput")) || null,
      authorId:
        parseInt(getV(isEdit ? "editAuthorInput" : "authorInput")) || null,
      publisherId:
        parseInt(getV(isEdit ? "editPublisherInput" : "publisherInput")) ||
        null,
      totalQty:
        parseInt(getV(isEdit ? "editBookTotalQty" : "bookTotalQty")) || 0,
      availableQty:
        parseInt(getV(isEdit ? "editBookAvailableQty" : "bookAvailableQty")) ||
        0,
    };
  }

  // Gán các sự kiện tương tác
  bindEvents() {
    const searchInput = document.getElementById("searchInput");
    const filterCat = document.getElementById("filterCategory");
    const filterPub = document.getElementById("filterPublisher");
    const filterStat = document.getElementById("filterStatus");

    const applyFilters = () => {
      this.currentPage = 1; // Reset về trang 1 khi lọc
      this.filteredBooks = this.model.filterBooks(this.currentBooks, {
        query: searchInput?.value.toLowerCase().trim(),
        category: filterCat?.value,
        publisher: filterPub?.value,
        status: filterStat?.value,
      });
      this.renderCurrentPage();
    };

    searchInput?.addEventListener("input", applyFilters);
    [filterCat, filterPub, filterStat].forEach((el) => {
      el?.addEventListener("change", applyFilters);
    });

    this.view.tableBody.addEventListener("click", (e) => {
      const btnEdit = e.target.closest(".btn-edit-book");
      const btnDelete = e.target.closest(".btn-delete-book");
      if (btnEdit) this.handleOpenEditModal(btnEdit.dataset.id);
      if (btnDelete) this.handleDeleteBook(btnDelete.dataset.id);
    });

    this.view.tableBody.addEventListener("dblclick", (e) => {
      const tr = e.target.closest("tr");
      if (tr) {
        const bookId = tr.getAttribute("data-id");
        if (bookId && bookId !== "null" && bookId !== "undefined") {
          this.copyController.openCopyModal(bookId);
        } else {
          console.error("Lỗi: Không tìm thấy ID sách trên dòng này!", tr);
          alert("Không tìm thấy mã sách. Hãy thử tải lại trang.");
        }
      }
    });

    document.getElementById("btnAddNewBook")?.addEventListener("click", () => {
      document.getElementById("addBookForm")?.reset();
      const preview = document.getElementById("imagePreview");
      if (preview)
        preview.src = "https://via.placeholder.com/70x90?text=No+Img";
      bootstrap.Modal.getOrCreateInstance(
        document.getElementById("addBookModal"),
      ).show();
    });

    document.getElementById("addBookForm")?.addEventListener("submit", (e) => {
      e.preventDefault();
      this.handleAddBook();
    });

    document.getElementById("editBookForm")?.addEventListener("submit", (e) => {
      e.preventDefault();
      this.handleEditSubmit();
    });

    const setupUpload = (fileId, hiddenId, previewId) => {
      document.getElementById(fileId)?.addEventListener("change", async (e) => {
        const file = e.target.files[0];
        if (file) {
          try {
            const url = await this.model.uploadImage(file);
            document.getElementById(hiddenId).value = url;
            document.getElementById(previewId).src = url;
          } catch (err) {
            alert(err.message);
          }
        }
      });
    };
    setupUpload("bookImageFile", "bookImageUrlHidden", "imagePreview");
    setupUpload(
      "editBookImageFile",
      "editBookImageUrlHidden",
      "editImagePreview",
    );
  }

  // Xử lý nghiệp vụ (Add/Edit/Delete)
 
    // Thu thập dữ liệu từ Form (Add/Edit)
    getFormData(prefix) {
        const getV = (id) => document.getElementById(id)?.value.trim() || "";
        const isEdit = prefix === 'edit';
        return {
            title: getV(isEdit ? 'editBookTitle' : 'bookTitle'),
            description: getV(isEdit ? 'editBookDescription' : 'bookDescription'), 
            isbn: getV(isEdit ? 'editBookIsbn' : 'bookIsbn'),
            publishedYear: parseInt(getV(isEdit ? 'editBookYear' : 'bookYear')) || 2026,
            imageUrl: getV(isEdit ? 'editBookImageUrl' : 'bookImageUrl'),
            categoryId: parseInt(getV(isEdit ? 'editCategoryInput' : 'categoryInput')) || null,
            authorId: parseInt(getV(isEdit ? 'editAuthorInput' : 'authorInput')) || null,
            publisherId: parseInt(getV(isEdit ? 'editPublisherInput' : 'publisherInput')) || null,
            totalQty: parseInt(getV(isEdit ? 'editTotalQty' : 'bookTotalQty')) || 0,
            availableQty: parseInt(getV(isEdit ? 'editAvailableQty' : 'bookAvailableQty')) || 0
        };
   }

    // Gán các sự kiện tương tác
    bindEvents() {
        const searchInput = document.getElementById('searchInput');
        const filterCat = document.getElementById('filterCategory');
        const filterPub = document.getElementById('filterPublisher');
        const filterStat = document.getElementById('filterStatus');
    
        // Hàm thực thi lọc
        const applyFilters = () => {
            console.log("Đang lọc với:", filterCat?.value, filterPub?.value, filterStat?.value);
            
            this.currentPage = 1; // Reset về trang 1 khi lọc
            this.filteredBooks = this.model.filterBooks(this.currentBooks, {
                query: searchInput?.value.toLowerCase().trim(),
                category: filterCat?.value,
                publisher: filterPub?.value,
                status: filterStat?.value
            });
            this.renderCurrentPage();
        };
    
        // 1. Gán sự kiện cho bộ lọc (Sửa lỗi filterSelects is not defined)
        searchInput?.addEventListener('input', applyFilters);
        [filterCat, filterPub, filterStat].forEach(el => {
            el?.addEventListener('change', applyFilters);
        });
    
        // 2. Click trong bảng (Sửa/Xóa)
        this.view.tableBody.addEventListener('click', (e) => {
            const btnEdit = e.target.closest('.btn-edit-book');
            const btnDelete = e.target.closest('.btn-delete-book');
            
            if (btnEdit) this.handleOpenEditModal(btnEdit.dataset.id);
            if (btnDelete) this.handleDeleteBook(btnDelete.dataset.id);
        });
    
        // 3. Nháy đúp mở Modal bản sao (Dùng data-id đã thêm ở renderBooks)
        this.view.tableBody.addEventListener('dblclick', (e) => {
            const tr = e.target.closest('tr');
            if (tr) {
                const bookId = tr.getAttribute('data-id'); 
                
                // Kiểm tra nếu ID hợp lệ mới gọi Controller
                if (bookId && bookId !== "null" && bookId !== "undefined") {
                    console.log("Đang mở bản sao cho sách ID:", bookId);
                    this.copyController.openCopyModal(bookId);
                } else {
                    console.error("Lỗi: Không tìm thấy ID sách trên dòng này!", tr);
                    alert("Không tìm thấy mã sách. Hãy thử tải lại trang.");
                }
            }
        });
    
        // 4. Modal Thêm mới và Submit Form
        document.getElementById('btnAddNewBook')?.addEventListener('click', () => {
            document.getElementById('addBookForm')?.reset();
            const preview = document.getElementById('imagePreview');
            if (preview) preview.src = 'https://via.placeholder.com/70x90?text=No+Img';
            bootstrap.Modal.getOrCreateInstance(document.getElementById('addBookModal')).show();
        });
    
        document.getElementById('addBookForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleAddBook();
        });
    
        document.getElementById('editBookForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleEditSubmit();
        });
    
        
    }

    // Xử lý thêm mới sách với các bước kiểm tra dữ liệu đầu vào 
    async handleAddBook() {
        const data = this.getFormData('book');
        // 1. Hàm hỗ trợ check tồn tại (ép kiểu về String để so sánh chuẩn nhất)
        const checkExist = (list, id) => list.some(item => String(item.id) === String(id));
        let errorMessages = [];
        // 2. Check trống tên sách (Cơ bản nhất)
        if (!data.title) {
            errorMessages.push("- Tên sách không được để trống.");
        }
        // 3. Check trùng ISBN (Chỉ check nếu ISBN có nhập dữ liệu)
        if (data.isbn) {
            const isDuplicateIsbn = this.currentBooks.some(b => b.isbn === data.isbn);
            if (isDuplicateIsbn) {
                errorMessages.push(`- Mã ISBN [${data.isbn}] đã tồn tại trong hệ thống.`);}
        } else {
            errorMessages.push("- Mã ISBN không được để trống.");
        }
        // 4. Check tồn tại các ID ngoại lai
        if (!checkExist(this.authors, data.authorId)) {
            errorMessages.push("- ID Tác giả không tồn tại.");
        }
        if (!checkExist(this.categories, data.categoryId)) {
            errorMessages.push("- ID Thể loại không tồn tại.");
        }
        if (!checkExist(this.publishers, data.publisherId)) {
            errorMessages.push("- ID Nhà xuất bản không tồn tại.");
        }
        if (data.imageUrl && !this.isValidImageExtension(data.imageUrl)) {
            errorMessages.push("- Tên ảnh phải có đuôi .jpg hoặc .png (Ví dụ: book.jpg)");
        }
        if (isNaN(data.publishedYear) || data.publishedYear < 0) {
            errorMessages.push("- Năm xuất bản phải là số dương.");
        }
        // 5. Nếu có bất kỳ lỗi nào thì hiện Alert và dừng xử lý
        if (errorMessages.length > 0) {
            alert("Lỗi dữ liệu nhập vào:\n" + errorMessages.join("\n") + "\nVui lòng kiểm tra lại.");
            return;
        }

        // 6. Tiến hành lưu nếu mọi thứ OK
        try {
            await this.model.createBook(data);
            this.closeModal('addBookModal');
            await this.loadBooks();
            alert("Thêm thành công!");
        } catch (err) { alert(err.message); }
    }
    //xử lý mở modal sửa sách và đổ dữ liệu vào form
    handleOpenEditModal(bookId) {
        const book = this.currentBooks.find(b => b.id == bookId);
        if (!book) return;
          // Hàm gán giá trị an toàn
        const setV = (id, val) => {
            const el = document.getElementById(id);
            if (el) {
                // Logic: Nếu val có giá trị thì lấy val, nếu không (null/undefined) thì lấy 0
                el.value = (val !== null && val !== undefined) ? val : 0;
            }
        };
        setV('editBookId', book.id);
        setV('editBookTitle', book.title);
        setV('editBookDescription', book.description);
        setV('editBookYear', book.publishedYear);
        setV('editTotalQty', book.totalQty);
        setV('editAvailableQty', book.availableQty);
        ImageService.display('editImagePreview', book.imageUrl);
        setV('editBookImageUrl', book.imageUrl); 
        setV('editCategoryInput', book.categoryId || book.category_id);
        setV('editAuthorInput', book.authorId || book.author_id);
        setV('editPublisherInput', book.publisherId || book.publisher_id);
        const isbnEl = document.getElementById('editBookIsbn');
        if (isbnEl) {
            isbnEl.value = book.isbn;
            isbnEl.readOnly = true;
            isbnEl.classList.add('bg-secondary-subtle');
        }

        bootstrap.Modal.getOrCreateInstance(document.getElementById('editBookModal')).show();
    }
    // Xử lý submit form sửa sách với các bước kiểm tra dữ liệu đầu vào tương tự như thêm mới
    async handleEditSubmit() {
        const id = document.getElementById('editBookId')?.value;
        const data = this.getFormData('edit');
        
        // 1. Hàm hỗ trợ check tồn tại (ép kiểu về String để so sánh chuẩn nhất)
        const checkExist = (list, id) => list.some(item => String(item.id) === String(id));
        let errorMessages = [];
    
        // 2. Validate Tên sách
        if (!data.title) {
            errorMessages.push("- Tên sách không được để trống.");
        }
        // 3. Validate ID ngoại lai (Tác giả, Thể loại, NXB)
        if (!checkExist(this.authors, data.authorId)) {
            errorMessages.push("- ID Tác giả không tồn tại.");
        }
        if (!checkExist(this.categories, data.categoryId)) {
            errorMessages.push("- ID Thể loại không tồn tại.");
        }
        if (!checkExist(this.publishers, data.publisherId)) {
            errorMessages.push("- ID Nhà xuất bản không tồn tại.");
        }
        if (data.imageUrl && !this.isValidImageExtension(data.imageUrl)) {
            errorMessages.push("- Tên ảnh phải có đuôi .jpg hoặc .png (Ví dụ: book.jpg)");
        }
        if (isNaN(data.publishedYear) || data.publishedYear < 0) {
            errorMessages.push("- Năm xuất bản phải là số dương.");
        }
        if (isNaN(data.totalQty) || data.totalQty < 0) {
            errorMessages.push("- Tổng số lượng phải là số dương.");
        }
        if (isNaN(data.availableQty) || data.availableQty < 0) {
            errorMessages.push("- Số lượng sẵn có phải là số dương.");
        }
        if (data.availableQty > data.totalQty) {
            errorMessages.push("- Số lượng sẵn có không thể lớn hơn tổng số lượng.");
        }
        // 5. Nếu có lỗi thì hiện thông báo và DỪNG xử lý (không gửi lên server)
        if (errorMessages.length > 0) {
            alert("Lỗi dữ liệu khi chỉnh sửa:\n" + errorMessages.join("\n") + "\nVui lòng kiểm tra lại.");
            return;
        }
    
        // 6. Nếu dữ liệu sạch thì mới tiến hành gửi Update
        try {
            await this.model.updateBook(id, data);
            this.closeModal('editBookModal');
            await this.loadBooks();
            alert("Đã cập nhật thành công!");
        } catch (err) { 
            console.error("Lỗi khi update:", err);
            alert("Lỗi hệ thống: " + err.message); 
        }
    }

    async handleDeleteBook(id) {
            if (confirm(`Xác nhận xóa sách ID: ${id}?`)) {
                try {
                    await this.model.deleteBook(id);
                    await this.loadBooks();
                    alert("Đã xóa!");
                } catch (err) { alert(err.message); }
            }
    }

    closeModal(id) {
        const modalInstance = bootstrap.Modal.getInstance(
        document.getElementById(id),
        );
        if (modalInstance) {
        modalInstance.hide();
        }

        
    }
}
