class BookController {
    constructor(model, view) {
        this.model = model;
        this.view = view;
        this.authors = [];
        this.categories = [];
        this.publishers = [];
        this.currentBooks = [];
    }

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

    async loadBooks() {
        try {
            this.view.tableBody.innerHTML = '<tr><td colspan="8" class="text-center">Đang tải...</td></tr>';
            const books = await this.model.fetchBooks();
            this.currentBooks = books;
            this.view.renderBooks(books, this.authors, this.categories, this.publishers);
        } catch (err) {
            console.error("Lỗi load sách:", err);
        }
    }

    // --- LẤY DATA FORM (Fix ID linh hoạt theo prefix) ---
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

    // --- GÁN SỰ KIỆN THEO PHONG CÁCH "CLOSEST" ---
    bindEvents() {
        // 1. Sự kiện Click trong bảng (Sửa/Xóa) - Giữ nguyên mẫu ông thích
        this.view.tableBody.addEventListener('click', (e) => {
            const id = e.target.closest('[data-id]')?.getAttribute('data-id');
            if (e.target.closest('.btn-delete-book')) this.handleDeleteBook(id);
            if (e.target.closest('.btn-edit-book')) this.handleOpenEditModal(id);
        });
    
        // 2. Nút mở Modal Thêm (Nằm ngoài bảng nên phải gán trực tiếp)
        const btnAdd = document.getElementById('btnAddNewBook');
        if (btnAdd) {
            btnAdd.addEventListener('click', () => {
                document.getElementById('addBookForm')?.reset();
                document.getElementById('imagePreview').src = 'https://via.placeholder.com/70x90?text=No+Img';
                bootstrap.Modal.getOrCreateInstance(document.getElementById('addBookModal')).show();
            });
        }
    
        // 3. Submit 2 Form
        document.getElementById('addBookForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleAddBook();
        });
    
        document.getElementById('editBookForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleEditSubmit();
        });
    
        // 4. KHÔI PHỤC LOGIC LƯU ẢNH (Upload & Preview)
        const setupUpload = (fileId, hiddenId, previewId) => {
            const fileInput = document.getElementById(fileId);
            if (fileInput) {
                fileInput.addEventListener('change', async (e) => {
                    const file = e.target.files[0];
                    if (file) {
                        try {
                            const url = await this.model.uploadImage(file);
                            document.getElementById(hiddenId).value = url; // Lưu URL vào hidden input để submit
                            document.getElementById(previewId).src = url;   // Hiển thị ảnh vừa upload
                        } catch (err) {
                            alert("Lỗi upload ảnh: " + err.message);
                        }
                    }
                });
            }
        };
    
        // Áp dụng cho cả form Thêm và form Sửa
        setupUpload('bookImageFile', 'bookImageUrlHidden', 'imagePreview');
        setupUpload('editBookImageFile', 'editBookImageUrlHidden', 'editImagePreview');
    }

    // --- xử lý thêm sách ---
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
    
        // 5. Nếu có bất kỳ lỗi nào thì hiện Alert và dừng xử lý
        if (errorMessages.length > 0) {
            alert("Lỗi dữ liệu nhập vào:\n" + errorMessages.join("\n") + "\nVui lòng kiểm tra lại.");
            return; 
        }
    
        // 6. Tiến hành lưu nếu mọi thứ OK
        try {
            await this.model.createBook(data);
            this.closeModal('addBookModal');
            
            // Reset form và ảnh sau khi thêm thành công
            document.getElementById('addBookForm')?.reset();
            const preview = document.getElementById('imagePreview');
            if (preview) preview.src = 'https://via.placeholder.com/70x90?text=No+Img';
            
            await this.loadBooks();
            alert("Thêm sách mới thành công!");
        } catch (err) { 
            alert("Lỗi Server: " + err.message); 
        }
    }

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
        setV('editBookYear', book.publishedYear);
        setV('editTotalQty', book.totalQty);
        setV('editAvailableQty', book.availableQty);
        setV('editBookImageUrlHidden', book.imageUrl);
        setV('editCategoryInput', book.categoryId || book.category_id);
        setV('editAuthorInput', book.authorId || book.author_id);
        setV('editPublisherInput', book.publisherId || book.publisher_id);

        const isbnEl = document.getElementById('editBookIsbn');
        if (isbnEl) {
            isbnEl.value = book.isbn;
            isbnEl.readOnly = true;
            isbnEl.classList.add('bg-secondary-subtle');
        }

        document.getElementById('editImagePreview').src = book.imageUrl || 'https://via.placeholder.com/70x90?text=No+Img';
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

    refreshAllDatalists() {
        const configs = [
            { id: 'authorOptions', data: this.authors }, { id: 'editAuthorOptions', data: this.authors },
            { id: 'categoryOptions', data: this.categories }, { id: 'editCategoryOptions', data: this.categories },
            { id: 'publisherOptions', data: this.publishers }, { id: 'editPublisherOptions', data: this.publishers }
        ];
        configs.forEach(c => {
            const el = document.getElementById(c.id);
            if (el) el.innerHTML = c.data.map(i => `<option value="${i.id}">${i.id} - ${i.name || i.title}</option>`).join('');
        });
    }

    closeModal(id) {
        const m = bootstrap.Modal.getInstance(document.getElementById(id));
        if (m) m.hide();
    }
    async handleDeleteBook(id) {
        if (!id) return;
    
        // 1. Hỏi xác nhận (Tránh bấm nhầm mất dữ liệu)
        const isConfirmed = confirm(`Bạn có chắc chắn muốn xóa sách có ID: ${id} không?`);
        
        if (isConfirmed) {
            try {
                // 2. Gọi Model để xóa dưới Database/API
                await this.model.deleteBook(id);
                
                // 3. Load lại danh sách mới để cập nhật giao diện
                await this.loadBooks();
                
                // 4. Thông báo (Tùy chọn)
                console.log(`Đã xóa thành công sách ID: ${id}`);
            } catch (err) {
                alert("Lỗi khi xóa sách: " + err.message);
            }
        }
    }
}