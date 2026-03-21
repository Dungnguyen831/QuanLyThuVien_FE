class BookController {
    constructor(model, view) {
        this.model = model;
        this.view = view;
        this.authors = [];
        this.categories = [];
        this.publishers = [];
        this.currentBooks = [];     // Danh sách gốc từ server
        this.filteredBooks = [];    // Danh sách sau khi lọc/tìm kiếm
        this.currentPage = 1;       // Trang hiện tại
        this.itemsPerPage = 10;     // Số bản ghi mỗi trang
        this.copyController = null; // Kết nối với Modal chi tiết bản sao
    }

    // Khởi tạo hệ thống
    async init() {
        this.view.setupUIState();
        try {
            const [authors, categories, publishers] = await Promise.all([
                this.model.fetchAuthors(),
                this.model.fetchCategories(),
                this.model.fetchPublishers()
            ]);
            this.authors = authors;
            this.categories = categories;
            this.publishers = publishers;

            this.refreshAllDatalists();
            await this.loadBooks();
            this.bindEvents(); 
        } catch (error) {
            console.error("Lỗi khởi tạo:", error);
        }
    }

    // Tải dữ liệu lần đầu
    async loadBooks() {
        try {
            this.view.tableBody.innerHTML = '<tr><td colspan="8" class="text-center">Đang tải...</td></tr>';
            const books = await this.model.fetchBooks();
            this.currentBooks = books;
            this.filteredBooks = books; // Ban đầu hiển thị tất cả
            this.renderCurrentPage(); 
        } catch (err) {
            console.error("Lỗi load sách:", err);
        }
    }

    // [MỚI] Hàm trung tâm điều khiển việc hiển thị bảng theo trang
    renderCurrentPage() {
        const total = this.filteredBooks.length;
        // Lấy lát cắt dữ liệu cho trang hiện tại
        const booksToShow = this.model.getBooksByPage(this.filteredBooks, this.currentPage, this.itemsPerPage);
        
        // Vẽ lại bảng dữ liệu
        this.view.renderBooks(booksToShow, this.authors, this.categories, this.publishers);
        
        // Vẽ thanh phân trang và cập nhật dòng text thông báo
        this.view.renderPagination(total, this.currentPage, this.itemsPerPage, (page) => {
            this.currentPage = page;
            this.renderCurrentPage();
        });
        this.view.updatePaginationText(total, this.currentPage, this.itemsPerPage);
    }

    // Thu thập dữ liệu từ Form (Add/Edit)
    getFormData(prefix) {
        const getV = (id) => document.getElementById(id)?.value.trim() || "";
        const isEdit = prefix === 'edit';
        return {
            title: getV(isEdit ? 'editBookTitle' : 'bookTitle'),
            isbn: getV(isEdit ? 'editBookIsbn' : 'bookIsbn'),
            publishedYear: parseInt(getV(isEdit ? 'editBookYear' : 'bookYear')) || 2026,
            imageUrl: getV(isEdit ? 'editBookImageUrlHidden' : 'bookImageUrlHidden'),
            categoryId: parseInt(getV(isEdit ? 'editCategoryInput' : 'categoryInput')) || null,
            authorId: parseInt(getV(isEdit ? 'editAuthorInput' : 'authorInput')) || null,
            publisherId: parseInt(getV(isEdit ? 'editPublisherInput' : 'publisherInput')) || null,
            totalQty: parseInt(getV(isEdit ? 'editBookTotalQty' : 'bookTotalQty')) || 0,
            availableQty: parseInt(getV(isEdit ? 'editBookAvailableQty' : 'bookAvailableQty')) || 0
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
    
        // 5. Logic Upload ảnh
        const setupUpload = (fileId, hiddenId, previewId) => {
            document.getElementById(fileId)?.addEventListener('change', async (e) => {
                const file = e.target.files[0];
                if (file) {
                    try {
                        const url = await this.model.uploadImage(file);
                        document.getElementById(hiddenId).value = url;
                        document.getElementById(previewId).src = url;
                    } catch (err) { alert(err.message); }
                }
            });
        };
        setupUpload('bookImageFile', 'bookImageUrlHidden', 'imagePreview');
        setupUpload('editBookImageFile', 'editBookImageUrlHidden', 'editImagePreview');
    }

    // Xử lý nghiệp vụ (Add/Edit/Delete) - Giữ nguyên logic kiểm tra dữ liệu của ông
    async handleAddBook() {
        const data = this.getFormData('book');
        // ... (Logic checkExist và errorMessages của ông giữ nguyên ở đây) ...
        try {
            await this.model.createBook(data);
            this.closeModal('addBookModal');
            await this.loadBooks();
            alert("Thêm thành công!");
        } catch (err) { alert(err.message); }
    }

    handleOpenEditModal(bookId) {
        const book = this.currentBooks.find(b => b.id == bookId);
        if (!book) return;
        // Điền dữ liệu vào form sửa (giữ nguyên logic setV của ông)
        // ...
        bootstrap.Modal.getOrCreateInstance(document.getElementById('editBookModal')).show();
    }

    async handleEditSubmit() {
        const id = document.getElementById('editBookId')?.value;
        const data = this.getFormData('edit');
        try {
            await this.model.updateBook(id, data);
            this.closeModal('editBookModal');
            await this.loadBooks();
            alert("Đã cập nhật!");
        } catch (err) { alert(err.message); }
    }

    async handleDeleteBook(id) {
        if (confirm(`Xác nhận xóa sách ID: ${id}?`)) {
            try {
                await this.model.deleteBook(id);
                await this.loadBooks();
            } catch (err) { alert(err.message); }
        }
    }

    // Các hàm bổ trợ UI
    refreshAllDatalists() {
        // 1. Đổ dữ liệu vào Datalist (cho việc nhập ID ở Modal)
        const configs = [
            { id: 'authorOptions', data: this.authors }, { id: 'editAuthorOptions', data: this.authors },
            { id: 'categoryOptions', data: this.categories }, { id: 'editCategoryOptions', data: this.categories },
            { id: 'publisherOptions', data: this.publishers }, { id: 'editPublisherOptions', data: this.publishers }
        ];
        configs.forEach(c => {
            const el = document.getElementById(c.id);
            if (el) el.innerHTML = c.data.map(i => `<option value="${i.id}">${i.id} - ${i.name || i.title}</option>`).join('');
        });
    
        // 2. [MỚI] Đổ dữ liệu vào các ô Select lọc ở thanh tìm kiếm
        const filterCat = document.getElementById('filterCategory'); // Đặt ID này cho ô Select Thể loại
        const filterPub = document.getElementById('filterPublisher'); // Đặt ID này cho ô Select NXB
    
        if (filterCat) {
            filterCat.innerHTML = '<option value="">Thể loại</option>' + 
                this.categories.map(c => `<option value="${c.id}">${c.name || c.title}</option>`).join('');
        }
        if (filterPub) {
            filterPub.innerHTML = '<option value="">Nhà xuất bản</option>' + 
                this.publishers.map(p => `<option value="${p.id}">${p.name || p.title}</option>`).join('');
        }
    }

    closeModal(id) {
        const m = bootstrap.Modal.getInstance(document.getElementById(id));
        if (m) m.hide();
    }
}