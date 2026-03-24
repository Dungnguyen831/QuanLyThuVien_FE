class BookCopyController {
    constructor(model, view, parentController) {
        this.model = model;
        this.view = view;
        this.parentController = parentController;
        this.currentBookId = null;
        const modalEl = document.getElementById('bookCopyModal');

        if (modalEl) {
            modalEl.addEventListener('hidden.bs.modal', () => {
                // 1. Tìm ô input tìm kiếm
                const searchInput = document.getElementById('copySearchInput');
                if (searchInput) {
                    searchInput.value = ''; // Xóa trắng nội dung
                }

                // 2. Reset lại bảng về danh sách đầy đủ (tránh trường hợp mở lại modal vẫn bị lọc)
                if (this.allCopies) {
                    this.view.renderCopiesToModal(this.allCopies);
                }
                
                console.log("Đã xóa ô tìm kiếm và reset bảng bản sao.");
            });
        }
    }

    async openCopyModal(bookId) {
        this.currentBookId = bookId;
    
        // BƯỚC 1: MỞ FORM TRƯỚC (QUAN TRỌNG NHẤT)
        const modalEl = document.getElementById('bookCopyModal');
        if (!modalEl) {
            alert("Không tìm thấy ID 'bookCopyModal' trong HTML. Kiểm tra lại ComponentLoader!");
            return;
        }
        const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
        modal.show(); // Lệnh này phải chạy đầu tiên!
    
        // BƯỚC 2: SAU ĐÓ MỚI ĐI LẤY DỮ LIỆU (LỖI CŨNG KHÔNG SAO)
        try {
            console.log("Đang lấy dữ liệu cho sách ID:", bookId);
            
            // Dùng Promise.allSettled để hễ một cái lỗi thì cái kia vẫn chạy
            const results = await Promise.allSettled([
                this.parentController.model.fetchBookById(bookId),
                this.model.fetchCopiesByBookId(bookId)
            ]);
    
            const book = results[0].status === 'fulfilled' ? results[0].value : null;
            const copies = results[1].status === 'fulfilled' ? results[1].value : [];
    
            // Đổ dữ liệu ban đầu
            this.view.renderBookDetailToModal(book, this.parentController.authors, this.parentController.categories, this.parentController.publishers);
            this.view.renderCopiesToModal(copies);
    
            // KÍCH HOẠT TÌM KIẾM: Truyền danh sách copies gốc vào để lọc
            this.view.setupCopySearch(copies);
    
        } catch (error) {
            console.error("Lỗi:", error);
        }
    
        this.bindInternalEvents();
    }

    bindInternalEvents() {
        const btnBulk = document.getElementById('btnBulkCreate');
        if (btnBulk) {
            btnBulk.onclick = async () => {
                const qty = document.getElementById('bulkQuantity').value;
                const success = await this.model.createBulk(this.currentBookId, qty);
                if (success) {
                    const updated = await this.model.fetchCopiesByBookId(this.currentBookId);
                    this.view.renderCopiesToModal(updated);
                    this.parentController.loadBooks(); // Cập nhật lại số lượng ở bảng chính
                }
            };
        }
    }
}