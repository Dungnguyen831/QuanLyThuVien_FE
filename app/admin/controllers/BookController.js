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
            description: getV(isEdit ? 'editBookDescription' : 'bookDescription'),
            isbn: getV(isEdit ? "editBookIsbn" : "bookIsbn"),
            publishedYear: parseInt(getV(isEdit ? "editBookYear" : "bookYear")) || 2026,
            imageUrl: document.getElementById(isEdit ? 'editBookImageUrlHidden' : 'bookImageUrlHidden')?.value,
            categoryId: parseInt(getV(isEdit ? "editCategoryInput" : "categoryInput")) || null,
            authorId: parseInt(getV(isEdit ? "editAuthorInput" : "authorInput")) || null,
            publisherId: parseInt(getV(isEdit ? "editPublisherInput" : "publisherInput")) || null,
            totalQty: parseInt(getV(isEdit ? "editTotalQty" : "bookTotalQty")) || 0,
            availableQty: parseInt(getV(isEdit ? "editAvailableQty" : "bookAvailableQty")) || 0,
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
            this.currentPage = 1;
            this.filteredBooks = this.model.filterBooks(this.currentBooks, {
                query: searchInput?.value.toLowerCase().trim(),
                category: filterCat?.value,
                publisher: filterPub?.value,
                status: filterStat?.value,
            });
            this.renderCurrentPage();
        };
    
        searchInput?.addEventListener("input", applyFilters);
        [filterCat, filterPub, filterStat].forEach(el => el?.addEventListener("change", applyFilters));
    
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
    
            fileInput?.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    // Lưu file vào biến tạm (this.selectedFile cho Add, this.selectedEditFile cho Edit)
                    if (fileInputId === 'bookImageFile') this.selectedFile = file;
                    else this.selectedEditFile = file;
    
                    const reader = new FileReader();
                    reader.onload = (event) => { previewImg.src = event.target.result; };
                    reader.readAsDataURL(file);
                }
            });
        };
    
        // --- XỬ LÝ SUBMIT FORM ---
        
        // Nút mở modal thêm mới (Reset form)
        document.getElementById("btnAddNewBook")?.addEventListener("click", () => {
            const form = document.getElementById("addBookForm");
            form?.reset();
            this.selectedFile = null; // Xóa file cũ đã chọn trước đó
            document.getElementById("imagePreview").src = "/assets/img/default-book.jpg";
            bootstrap.Modal.getOrCreateInstance(document.getElementById("addBookModal")).show();
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
        setupUploadPreview('bookImageFile', 'imagePreview');
        setupUploadPreview('editBookImageFile', 'editImagePreview');
        // Danh sách các ID input cần đổ dữ liệu vào datalist khi người dùng tương tác
        const datalistConfigs = [
            { inputId: 'categoryInput', listId: 'categoryOptions', type: 'categories' },
            { inputId: 'authorInput', listId: 'authorOptions', type: 'authors' },
            { inputId: 'publisherInput', listId: 'publisherOptions', type: 'publishers' },
            // Đừng quên thêm các ID cho form Sửa (Edit) nếu bạn cũng dùng datalist ở đó
            { inputId: 'editCategoryInput', listId: 'editCategoryOptions', type: 'categories' },
            { inputId: 'editAuthorInput', listId: 'editAuthorOptions', type: 'authors' },
            { inputId: 'editPublisherInput', listId: 'editPublisherOptions', type: 'publishers' }
        ];

        datalistConfigs.forEach(({ inputId, listId, type }) => {
            const inputEl = document.getElementById(inputId);
            if (inputEl) {
                // Khi người dùng nhấn vào ô input, danh sách sẽ được làm mới
                inputEl.addEventListener('focus', () => this.populateDatalist(listId, type));
            }
        });
    }
    // Xử lý thêm mới sách với các bước kiểm tra dữ liệu đầu vào 
    async handleAddBook() {
        let finalImageUrl = "";

        // BƯỚC 1: CHỈ KHI BẤM LƯU MỚI UPLOAD ẢNH
        if (this.selectedFile) {
            // Gọi model để đẩy file thật lên server
            finalImageUrl = await this.model.uploadImage(this.selectedFile); 
        }
        const data = this.getFormData("book");
        data.imageUrl = finalImageUrl || "default-book.jpg"; // Gán tên file đã upload thành công
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
                errorMessages.push(`- Mã ISBN [${data.isbn}] đã tồn tại trong hệ thống.`);
            }
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
            this.closeModal("addBookModal");
            await this.loadBooks();
            alert("Thêm thành công!");
            window.location.href = 'inventory.html';
        } catch (err) {
            alert(err.message);
        }
    }

    // xử lý mở modal sửa sách và đổ dữ liệu vào form
    handleOpenEditModal(bookId) {
        const book = this.currentBooks.find((b) => b.id == bookId);
        if (!book) return;

        // Hàm gán giá trị an toàn
        const setV = (id, val) => {
            const el = document.getElementById(id);
            if (el) {
                el.value = (val !== null && val !== undefined) ? val : "";
            }
        };

        setV('editBookId', book.id);
        setV('editBookTitle', book.title);
        setV('editBookDescription', book.description);
        setV('editBookYear', book.publishedYear);
        setV('editTotalQty', book.totalQty);
        setV('editAvailableQty', book.availableQty);

        setV('editCategoryInput', book.categoryId || book.category_id);
        setV('editAuthorInput', book.authorId || book.author_id);
        setV('editPublisherInput', book.publisherId || book.publisher_id);
        
        // Hiển thị ảnh preview
        // 1. Hiển thị ảnh hiện tại lên khung Preview
        const editPreview = document.getElementById('editImagePreview');
        if (editPreview) {
            editPreview.src = book.imageUrl ? `/assets/img/${book.imageUrl}` : "/assets/img/default-book.jpg";
        }

        // 2. HIỂN THỊ TÊN FILE CŨ
        const fileNameDisplay = document.getElementById('currentFileNameDisplay');
        if (fileNameDisplay) {
            fileNameDisplay.innerText = book.imageUrl ? `${book.imageUrl}` : "Chưa có ảnh bìa";
        }

        // 3. Lưu vào hidden input
        setV('editBookImageUrl', book.imageUrl);

        // 4. Reset ô chọn file (luôn về rỗng để hiện "No file chosen")
        const fileInput = document.getElementById('editBookImageFile');
        if (fileInput) fileInput.value = "";
        this.selectedEditFile = null

        const isbnEl = document.getElementById('editBookIsbn');
        if (isbnEl) {
            isbnEl.value = book.isbn;
            isbnEl.readOnly = true;
            isbnEl.classList.add('bg-secondary-subtle');
        }

        bootstrap.Modal.getOrCreateInstance(
            document.getElementById("editBookModal"),
        ).show();
    }

    // Xử lý submit form sửa sách với các bước kiểm tra dữ liệu đầu vào tương tự như thêm mới
  // Xử lý submit form sửa sách
    async handleEditSubmit() {
        const id = document.getElementById("editBookId")?.value;
        const data = this.getFormData("edit");
        let errorMessages = [];

        try {
            // --- 1. XỬ LÝ UPLOAD ẢNH ---
            if (this.selectedEditFile) {
                // Chỉ upload nếu người dùng có chọn file mới
                try {
                    const uploadedFileName = await this.model.uploadImage(this.selectedEditFile);
                    data.imageUrl = uploadedFileName; 
                } catch (uploadError) {
                    throw new Error("Không thể upload ảnh mới. Vui lòng thử lại.");
                }
            } else {
                // Giữ lại ảnh cũ từ trường hidden nếu không đổi ảnh
                data.imageUrl = document.getElementById('editBookImageUrl')?.value || "default-book.jpg";
            }

            // --- 2. KIỂM TRA DỮ LIỆU (VALIDATION) ---
            const checkExist = (list, targetId) => list.some(item => String(item.id) === String(targetId));

            if (!data.title) errorMessages.push("- Tên sách không được để trống.");
            
            // Kiểm tra logic số lượng
            if (isNaN(data.totalQty) || data.totalQty < 0) errorMessages.push("- Tổng số lượng phải là số dương.");
            if (isNaN(data.availableQty) || data.availableQty < 0) errorMessages.push("- Số lượng sẵn có phải là số dương.");
            if (data.availableQty > data.totalQty) errorMessages.push("- Số lượng sẵn có không được lớn hơn tổng số lượng.");

            // Kiểm tra ràng buộc ID ngoại (Foreign Keys)
            if (!checkExist(this.authors, data.authorId)) errorMessages.push("- Tác giả không hợp lệ.");
            if (!checkExist(this.categories, data.categoryId)) errorMessages.push("- Thể loại không hợp lệ.");
            if (!checkExist(this.publishers, data.publisherId)) errorMessages.push("- Nhà xuất bản không hợp lệ.");

            if (errorMessages.length > 0) {
                alert("Dữ liệu không hợp lệ:\n" + errorMessages.join("\n"));
                return; // Dừng thực thi nếu có lỗi validate
            }

            // --- 3. GỌI API CẬP NHẬT ---
            await this.model.updateBook(id, data);

            // --- 4. HOÀN TẤT VÀ LÀM SẠCH UI ---
            this.selectedEditFile = null; // Xóa file tạm sau khi lưu thành công
            const fileInput = document.getElementById('editBookImageFile');
            if (fileInput) fileInput.value = ""; // Reset input file trên giao diện

            this.closeModal("editBookModal");
            await this.loadBooks(); // Tải lại danh sách
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
                await this.loadBooks(); // Tải lại danh sách sách
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

    // Hàm kiểm tra đuôi file
    isValidImageExtension(fileName) {
        if (!fileName) return true; // Cho phép để trống nếu không bắt buộc
        const allowedExtensions = /(\.jpg|\.png)$/i;
        return allowedExtensions.test(fileName);
    }

    populateDatalist(datalistId, type) {
        const datalist = document.getElementById(datalistId);
        if (!datalist) return;
    
        const data = this[type]; // Lấy authors, categories, hoặc publishers
        
        // Xóa danh sách cũ
        datalist.innerHTML = "";
    
        data.forEach(item => {
            const option = document.createElement("option");
            // Gán ID vào value để khi chọn, ID sẽ nhảy vào ô Input
            option.value = item.id; 
            
            // Hiển thị Tên bên cạnh ID để người dùng nhận diện
            option.innerText = `Tên: ${item.name || item.title}`;
            
            datalist.appendChild(option);
        });
    }
}