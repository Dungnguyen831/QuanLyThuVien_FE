class BookCopyController {
    constructor(model, view, parentController) {
        this.model = model;
        this.view = view;
        this.parentController = parentController;
        this.currentBookId = null;
        this.allCopies = []; // <--- QUAN TRỌNG: Lưu dữ liệu để không bị undefined

        this.view.onDeleteCopy = (id) => this.handleDeleteCopy(id);
    }

    async openCopyModal(bookId) {
        this.currentBookId = bookId;
        const modalEl = document.getElementById('bookCopyModal');
        if (!modalEl) return;
        bootstrap.Modal.getOrCreateInstance(modalEl).show();

        try {
            const [bookRes, copiesRes] = await Promise.allSettled([
                this.parentController.model.fetchBookById(bookId),
                this.model.fetchCopiesByBookId(bookId)
            ]);

            const book = bookRes.status === 'fulfilled' ? bookRes.value : null;
            const copies = copiesRes.status === 'fulfilled' ? copiesRes.value : [];
            
            // Ghi nhớ bản sao để dùng cho hàm cập nhật kệ bên dưới
            this.allCopies = copies; 

            this.view.renderBookDetailToModal(book, this.parentController.authors, this.parentController.categories, this.parentController.publishers);
            this.view.renderCopiesToModal(copies, this.parentController.shelves || []);
            
            this.bindInternalEvents(); // Kích hoạt sự kiện đổi kệ
            this.view.setupCopySearch(copies);
        } catch (error) {
            console.error("Lỗi nạp dữ liệu:", error);
        }
    }

    /**
     * Hàm xử lý các sự kiện bên trong Modal
     */
    bindInternalEvents() {
        const tableBody = document.getElementById('copy-table-body');
        if (!tableBody) return;

        // Xử lý thay đổi kệ - Khớp chính xác với BookCopyRequestDTO
        tableBody.onchange = async (e) => {
            if (e.target.classList.contains('shelf-select')) {
                const copyId = e.target.dataset.copyId;
                const shelfId = e.target.value;

                // 1. Tìm lại dữ liệu cũ để tránh gửi null lên Server
                const currentCopy = this.allCopies.find(c => c.id == copyId);
                if (!currentCopy) return;

                // 2. Tạo Request Object phẳng đúng như DTO ở Backend yêu cầu
                const requestData = {
                    bookId: parseInt(this.currentBookId),
                    shelfId: shelfId ? parseInt(shelfId) : null,
                    barcode: currentCopy.barcode || currentCopy.copyBarcode,
                    conditionStatus: currentCopy.conditionStatus || currentCopy.copyCondition,
                    availabilityStatus: currentCopy.availabilityStatus || currentCopy.copyStatus
                };

                try {
                    // 3. Gọi Model để thực hiện PUT/PATCH
                    const success = await this.model.updateBookCopy(copyId, requestData);
                    if (success) {
                        console.log(`Bản sao ${copyId} cập nhật kệ ${shelfId} thành công.`);
                        // Cập nhật lại bộ nhớ tạm để tránh lỗi UI
                        currentCopy.shelfId = shelfId;
                    } else {
                        alert("Cập nhật kệ thất bại (Lỗi 400). Hãy kiểm tra Network tab!");
                    }
                } catch (err) {
                    console.error("Lỗi:", err);
                }
            }
        };

        // Xử lý Bulk Create
        const btnBulk = document.getElementById('btnBulkCreate');
        if (btnBulk) {
            btnBulk.onclick = async () => {
                const qty = document.getElementById('bulkQuantity').value;
                const success = await this.model.createBulk(this.currentBookId, qty);
                if (success) {
                    const updated = await this.model.fetchCopiesByBookId(this.currentBookId);
                    this.allCopies = updated;
                    this.view.renderCopiesToModal(updated, this.parentController.shelves);
                    if (this.parentController.loadBooks) this.parentController.loadBooks();
                }
            };
        }
    }

    async handleDeleteCopy(id) {
        if (!confirm(`Xác nhận xóa bản sao #${id}?`)) return;
        if (await this.model.deleteBookCopy(id)) {
            this.allCopies = this.allCopies.filter(c => c.id != id);
            this.view.renderCopiesToModal(this.allCopies, this.parentController.shelves);
            alert("Xóa thành công bản sao có id :" + id);
            if (this.parentController.loadBooks) this.parentController.loadBooks();
        } else {
            alert("Xóa bản sao thất bại!" + id);
        }
    }
}