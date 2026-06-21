class BookController {
  constructor(model, view) {
    this.model = model;
    this.view = view;
    this.authors = [];
    this.categories = [];
    this.publishers = [];
    this.shelfModel = [];
    this.currentBooks = []; // Danh sách gốc từ server
    this.filteredBooks = []; // Danh sách sau khi lọc/tìm kiếm
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
      this.renderBooksList(); // Vẽ lại giao diện với toàn bộ dữ liệu
    } catch (error) {
      console.error("Lỗi tải sách:", error);
    }
  }

  // Tải và làm mới các danh sách (author, category, publisher) cho các bộ lọc
  async refreshAllDatalists() {
    try {
      const authorModel = new AuthorModel();
      const categoryModel = new CategoryModel();
      const publisherModel = new PublisherModel();
      const shelfModel = new ShelfModel();

      const [authors, categories, publishers, shelves] = await Promise.all([
        authorModel.fetchAuthors(),
        categoryModel.fetchCategories(),
        publisherModel.fetchPublishers(),
        shelfModel.fetchShelves(),
      ]);

      this.authors = authors;
      this.categories = categories;
      this.publishers = publishers;
      this.shelves = shelves;

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

  // Hàm điều khiển hiển thị toàn bộ danh sách sách ra bảng
  renderBooksList() {
    this.view.renderBooks(
      this.filteredBooks,
      this.authors,
      this.categories,
      this.publishers
    );
  }

  // Thu thập dữ liệu từ Form (Add/Edit)
  getFormData(prefix) {
    const getV = (id) => document.getElementById(id)?.value.trim() || "";
    const isEdit = prefix === "edit";
    return {
      title: getV(isEdit ? "editBookTitle" : "bookTitle"),
      description: getV(isEdit ? "editBookDescription" : "bookDescription"),
      isbn: getV(isEdit ? "editBookIsbn" : "bookIsbn"),
      publishedYear:
        parseInt(getV(isEdit ? "editBookYear" : "bookYear")) || 2026,
      imageUrl: document.getElementById(
        isEdit ? "editBookImageUrlHidden" : "bookImageUrlHidden",
      )?.value,
      categoryId:
        parseInt(getV(isEdit ? "editCategoryInput" : "categoryInput")) || null,
      authorId:
        parseInt(getV(isEdit ? "editAuthorInput" : "authorInput")) || null,
      publisherId:
        parseInt(getV(isEdit ? "editPublisherInput" : "publisherInput")) ||
        null,
      totalQty: parseInt(getV(isEdit ? "editTotalQty" : "bookTotalQty")) || 0,
      availableQty:
        parseInt(getV(isEdit ? "editAvailableQty" : "bookAvailableQty")) || 0,
    };
  }

  // Gán các sự kiện tương tác
  bindEvents() {
    // --- BỘ LỌC VÀ TÌM KIẾM ---
    const searchInput = document.getElementById("searchInput");
    const filterCat = document.getElementById("filterCategory");
    const filterPub = document.getElementById("filterPublisher");
    const filterStat = document.getElementById("filterStatus");

    const applyFilters = () => {
      this.filteredBooks = this.model.filterBooks(this.currentBooks, {
        query: searchInput?.value.toLowerCase().trim(),
        category: filterCat?.value,
        publisher: filterPub?.value,
        status: filterStat?.value,
      });
      this.renderBooksList();
    };

    searchInput?.addEventListener("input", applyFilters);
    [filterCat, filterPub, filterStat].forEach((el) =>
      el?.addEventListener("change", applyFilters),
    );

    // --- SỰ KIỆN TRÊN BẢNG (Sửa/Xóa/Double Click) ---
    this.view.tableBody.addEventListener("click", (e) => {
      const btnEdit = e.target.closest(".btn-edit-book");
      const btnDelete = e.target.closest(".btn-delete-book");
      if (btnEdit) this.handleOpenEditModal(btnEdit.dataset.id);
      if (btnDelete) this.handleDeleteBook(btnDelete.dataset.id);
    });

    this.view.tableBody.addEventListener("dblclick", (e) => {
      const tr = e.target.closest("tr");
      const bookId = tr?.getAttribute("data-id");
      if (bookId && bookId !== "null") {
        this.copyController.openCopyModal(bookId);
      }
    });

    // --- LOGIC UPLOAD ẢNH (Dùng chung cho Add và Edit) ---
    const setupUploadPreview = (fileInputId, previewImgId) => {
      const fileInput = document.getElementById(fileInputId);
      const previewImg = document.getElementById(previewImgId);

      fileInput?.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (file) {
          if (fileInputId === "bookImageFile") this.selectedFile = file;
          else this.selectedEditFile = file;

          const reader = new FileReader();
          reader.onload = (event) => {
            previewImg.src = event.target.result;
          };
          reader.readAsDataURL(file);
        }
      });
    };

    // --- XỬ LÝ SUBMIT FORM ---

    // Nút mở modal thêm mới (Reset form)
    document.getElementById("btnAddNewBook")?.addEventListener("click", () => {
      const form = document.getElementById("addBookForm");
      form?.reset();
      this.selectedFile = null; 
      document.getElementById("imagePreview").src =
        "/assets/img/default-book.jpg";
      bootstrap.Modal.getOrCreateInstance(
        document.getElementById("addBookModal"),
      ).show();
    });

    // Form Thêm
    document.getElementById("addBookForm")?.addEventListener("submit", (e) => {
      e.preventDefault();
      this.handleAddBook();
    });

    // Form Sửa
    document.getElementById("editBookForm")?.addEventListener("submit", (e) => {
      e.preventDefault();
      this.handleEditSubmit();
    });
    setupUploadPreview("bookImageFile", "imagePreview");
    setupUploadPreview("editBookImageFile", "editImagePreview");

    const datalistConfigs = [
      {
        inputId: "categoryInput",
        listId: "categoryOptions",
        type: "categories",
      },
      { inputId: "authorInput", listId: "authorOptions", type: "authors" },
      {
        inputId: "publisherInput",
        listId: "publisherOptions",
        type: "publishers",
      },
      {
        inputId: "editCategoryInput",
        listId: "editCategoryOptions",
        type: "categories",
      },
      {
        inputId: "editAuthorInput",
        listId: "editAuthorOptions",
        type: "authors",
      },
      {
        inputId: "editPublisherInput",
        listId: "editPublisherOptions",
        type: "publishers",
      },
    ];

    datalistConfigs.forEach(({ inputId, listId, type }) => {
      const inputEl = document.getElementById(inputId);
      if (inputEl) {
        inputEl.addEventListener("focus", () =>
          this.populateDatalist(listId, type),
        );
      }
    });
  }

  // Xử lý thêm mới sách với các bước kiểm tra dữ liệu đầu vào
  async handleAddBook() {
    let finalImageUrl = "";

    if (this.selectedFile) {
      const fileName = this.selectedFile.name;
      const isFileExists = this.currentBooks.some(
        (b) => b.imageUrl === fileName,
      );

      if (isFileExists) {
        finalImageUrl = fileName;
      } else {
        try {
          finalImageUrl = await this.model.uploadImage(this.selectedFile);
        } catch (err) {
          console.error("Lỗi upload ảnh", err);
          finalImageUrl = fileName;
        }
      }
    }
    const data = this.getFormData("book");
    data.imageUrl = finalImageUrl || "default-book.jpg"; 
    
    const checkExist = (list, id) =>
      list.some((item) => String(item.id) === String(id));
    let errorMessages = [];

    if (!data.title) {
      errorMessages.push("- Tên sách không được để trống.");
    }

    if (data.isbn) {
      const isDuplicateIsbn = this.currentBooks.some(
        (b) => b.isbn === data.isbn,
      );
      if (isDuplicateIsbn) {
        errorMessages.push(
          `- Mã ISBN [${data.isbn}] đã tồn tại trong hệ thống.`,
        );
      }
    } else {
      errorMessages.push("- Mã ISBN không được để trống.");
    }

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
      errorMessages.push(
        "- Tên ảnh phải có đuôi .jpg hoặc .png (Ví dụ: book.jpg)",
      );
    }
    if (isNaN(data.publishedYear) || data.publishedYear < 0) {
      errorMessages.push("- Năm xuất bản phải là số dương.");
    }

    if (errorMessages.length > 0) {
      alert(
        "Lỗi dữ liệu nhập vào:\n" +
          errorMessages.join("\n") +
          "\nVui lòng kiểm tra lại.",
      );
      return;
    }

    try {
      await this.model.createBook(data);
      this.closeModal("addBookModal");
      await this.loadBooks();
      alert("Thêm thành công!");
      window.location.href = "inventory.html";
    } catch (err) {
      alert(err.message);
    }
  }

  // xử lý mở modal sửa sách và đổ dữ liệu vào form
  handleOpenEditModal(bookId) {
    const book = this.currentBooks.find((b) => b.id == bookId);
    if (!book) return;

    const setV = (id, val) => {
      const el = document.getElementById(id);
      if (el) {
        el.value = val !== null && val !== undefined ? val : "";
      }
    };

    setV("editBookId", book.id);
    setV("editBookTitle", book.title);
    setV("editBookDescription", book.description);
    setV("editBookYear", book.publishedYear);
    setV("editTotalQty", book.totalQty);
    setV("editAvailableQty", book.availableQty);

    setV("editCategoryInput", book.categoryId || book.category_id);
    setV("editAuthorInput", book.authorId || book.author_id);
    setV("editPublisherInput", book.publisherId || book.publisher_id);

    const editPreview = document.getElementById("editImagePreview");
    if (editPreview) {
      editPreview.src = book.imageUrl
        ? `/assets/img/${book.imageUrl}`
        : "/assets/img/default-book.jpg";
    }

    const fileNameDisplay = document.getElementById("currentFileNameDisplay");
    if (fileNameDisplay) {
      fileNameDisplay.innerText = book.imageUrl
        ? `${book.imageUrl}`
        : "Chưa có ảnh bìa";
    }

    setV("editBookImageUrl", book.imageUrl);

    const fileInput = document.getElementById("editBookImageFile");
    if (fileInput) fileInput.value = "";
    this.selectedEditFile = null;

    const isbnEl = document.getElementById("editBookIsbn");
    if (isbnEl) {
      isbnEl.value = book.isbn;
      isbnEl.readOnly = true;
      isbnEl.classList.add("bg-secondary-subtle");
    }

    bootstrap.Modal.getOrCreateInstance(
      document.getElementById("editBookModal"),
    ).show();
  }

  // Xử lý submit form sửa sách với các bước kiểm tra dữ liệu đầu vào
  async handleEditSubmit() {
    const id = document.getElementById("editBookId")?.value;
    const data = this.getFormData("edit");
    let errorMessages = [];

    try {
      const currentImageUrl =
        document.getElementById("editBookImageUrl")?.value || "";

      if (this.selectedEditFile) {
        const selectedFileName = this.selectedEditFile.name;

        const isNameExists =
          selectedFileName === currentImageUrl ||
          this.currentBooks.some((b) => b.imageUrl === selectedFileName);

        if (isNameExists) {
          data.imageUrl = selectedFileName;
        } else {
          try {
            const uploadedFileName = await this.model.uploadImage(
              this.selectedEditFile,
            );
            data.imageUrl = uploadedFileName;
          } catch (uploadError) {
            data.imageUrl = selectedFileName;
          }
        }
      } else {
        data.imageUrl = currentImageUrl || "default-book.jpg";
      }

      const checkExist = (list, targetId) =>
        list.some((item) => String(item.id) === String(targetId));

      if (!data.title) errorMessages.push("- Tên sách không được để trống.");

      if (isNaN(data.totalQty) || data.totalQty < 0)
        errorMessages.push("- Tổng số lượng phải là số dương.");
      if (isNaN(data.availableQty) || data.availableQty < 0)
        errorMessages.push("- Số lượng sẵn có phải là số dương.");
      if (data.availableQty > data.totalQty)
        errorMessages.push(
          "- Số lượng sẵn có không được lớn hơn tổng số lượng.",
        );

      if (!checkExist(this.authors, data.authorId))
        errorMessages.push("- Tác giả không hợp lệ.");
      if (!checkExist(this.categories, data.categoryId))
        errorMessages.push("- Thể loại không hợp lệ.");
      if (!checkExist(this.publishers, data.publisherId))
        errorMessages.push("- Nhà xuất bản không hợp lệ.");

      if (errorMessages.length > 0) {
        alert("Dữ liệu không hợp lệ:\n" + errorMessages.join("\n"));
        return; 
      }

      await this.model.updateBook(id, data);

      this.selectedEditFile = null; 
      const fileInput = document.getElementById("editBookImageFile");
      if (fileInput) fileInput.value = ""; 

      this.closeModal("editBookModal");
      await this.loadBooks(); 
      alert("Cập nhật sách thành công!");
    } catch (err) {
      console.error("Lỗi hệ thống:", err);
      alert(err.message || "Đã có lỗi xảy ra trong quá trình cập nhật.");
    }
  }

  async handleDeleteBook(id) {
    if (confirm(`Xác nhận xóa sách ID: ${id}?`)) {
      try {
        await this.model.deleteBook(id);
        await this.loadBooks(); 
        alert("Xóa thành công!");
      } catch (err) {
        alert(err.message);
      }
    }
  }

  closeModal(id) {
    const modalElement = document.getElementById(id);
    if (modalElement) {
      const m = bootstrap.Modal.getInstance(modalElement);
      if (m) m.hide();
    }
  }

  isValidImageExtension(fileName) {
    if (!fileName) return true; 
    const allowedExtensions = /(\.jpg|\.png)$/i;
    return allowedExtensions.test(fileName);
  }

  populateDatalist(datalistId, type) {
    const datalist = document.getElementById(datalistId);
    if (!datalist) return;

    const data = this[type]; 

    datalist.innerHTML = "";

    data.forEach((item) => {
      const option = document.createElement("option");
      option.value = item.id;
      option.innerText = `Tên: ${item.name || item.title}`;
      datalist.appendChild(option);
    });
  }
}