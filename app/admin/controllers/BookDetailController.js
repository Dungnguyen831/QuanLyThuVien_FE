class BookDetailController {
    constructor(model, view) {
        this.model = model;
        this.view = view;
        this.wishlistModel = new WishlistModel();
        this.reservationModel = new ReservationModel();
        this.currentBook = null;
        this.wishlistBookIds = [];
    }

    async init() {
        try {
            // 1. Lấy chuỗi query từ URL (ví dụ: "?id=10")
            const queryString = window.location.search;

            // 2. Dùng URLSearchParams để tách lấy giá trị của 'id'
            const urlParams = new URLSearchParams(queryString);
            const bookId = urlParams.get('id');

            // 3. Kiểm tra xem có ID không
            if (!bookId) {
                console.error("Không tìm thấy ID nào trên thanh địa chỉ!");
                document.getElementById('book-title').innerText = "Vui lòng chọn sách từ danh sách!";
                return;
            }

            console.log("Đang nhận biết ID sách từ URL là:", bookId);

            // 4. Load current book data
            const book = await this.model.fetchBookDetail(bookId);

            if (book) {
                this.currentBook = book;
                // Đổ dữ liệu vào View
                this.view.renderBookDetail(book);

                // 5. Load wishlist status
                await this.loadWishlistStatus();

                // 6. Setup button event listeners
                this.setupEventListeners(bookId);
            } else {
                document.getElementById('book-title').innerText = "Sách không tồn tại!";
            }
        } catch (e) {
            console.error("Lỗi khi load chi tiết sách:", e);
        }
    }

    async loadWishlistStatus() {
        try {
            // Fix: use getWishlist() instead of fetchWishlist()
            const wishlistData = await this.wishlistModel.getWishlist();
            console.log('Wishlist data:', wishlistData);

            // Handle both array and nested response formats
            let books = wishlistData;
            if (wishlistData && wishlistData.books) {
                books = wishlistData.books;
            } else if (wishlistData && wishlistData.data) {
                books = wishlistData.data;
            }

            if (Array.isArray(books)) {
                this.wishlistBookIds = books.map(book => {
                    // Ensure ID is converted to number for comparison
                    return parseInt(book.id) || parseInt(book.bookId) || 0;
                });
                console.log('Wishlist book IDs:', this.wishlistBookIds);
            }

            this.updateWishlistButton();
        } catch (error) {
            console.warn("Could not load wishlist status:", error);
            this.updateWishlistButton(); // Still update button even if error
        }
    }

    updateWishlistButton() {
        const wishlistBtn = document.querySelector('.btn-wishlist');
        if (this.currentBook && wishlistBtn) {
            // Ensure we're comparing same types
            const currentBookId = parseInt(this.currentBook.id) || 0;
            const isInWishlist = this.wishlistBookIds.includes(currentBookId);

            console.log('Checking wishlist - currentBookId:', currentBookId, 'in list:', isInWishlist);

            if (isInWishlist) {
                wishlistBtn.classList.add('in-wishlist');
                wishlistBtn.innerHTML = '❤️ Xóa khỏi danh sách yêu thích';
            } else {
                wishlistBtn.classList.remove('in-wishlist');
                wishlistBtn.innerHTML = '❤️ Thêm vào danh sách yêu thích';
            }
        }
    }

    setupEventListeners(bookId) {
        // Borrow Now button
        const btnBorrow = document.getElementById('btn-borrow');
        if (btnBorrow) {
            btnBorrow.addEventListener('click', () => this.handleBorrowClick());
        }

        // Add to Wishlist button
        const wishlistBtn = document.querySelector('.btn-wishlist');
        if (wishlistBtn) {
            wishlistBtn.addEventListener('click', () => this.handleWishlistClick());
        }
    }

    async handleBorrowClick() {
        if (!this.currentBook) {
            alert('Sách không tìm thấy!');
            return;
        }

        try {
            console.log('Opening borrow form for book:', this.currentBook);

            // Create borrow form modal in single-book mode
            const modal = await BorrowForm.create({
                book: this.currentBook,
                mode: 'single',
                onSubmit: async (formData) => {
                    try {
                        console.log('Borrow form submitted:', formData);

                        // Validate pickup date with business rules
                        const dateValidation = BorrowForm.validatePickupDate(formData.pickupDate);
                        if (!dateValidation.valid) {
                            alert(dateValidation.message);
                            return; // Stay on form, don't close
                        }

                        // Format date to LocalDateTime format (YYYY-MM-DDTHH:mm:ss)
                        const formattedDate = BorrowForm.formatPickupDate(formData.pickupDate);

                        // Submit reservation using reservationModel
                        const result = await this.reservationModel.createReservation(
                            formData.bookId,
                            formattedDate
                        );

                        console.log('Reservation created:', result);

                        // Extract barcode from result if available
                        const barcode = result?.bookCopyBarcode || result?.barcode || 'N/A';
                        const successMessage = barcode && barcode !== 'N/A'
                            ? `✅ Yêu cầu mượn sách thành công!\n\n📦 Mã barcode: ${barcode}\n\nVui lòng chờ xác nhận từ thư viện.`
                            : '✅ Yêu cầu mượn sách thành công!\n\nVui lòng chờ xác nhận từ thư viện.';

                        alert(successMessage);
                    } catch (error) {
                        console.error('Error in form submission:', error);
                        alert('Lỗi: ' + (error.message || 'Không thể tạo yêu cầu mượn sách'));
                    }
                }
            });

            // Add modal to page
            document.body.appendChild(modal);

        } catch (error) {
            console.error('Error opening borrow form:', error);
            alert('Lỗi: ' + error.message);
        }
    }

    async handleWishlistClick() {
        if (!this.currentBook) {
            alert('Sách không tìm thấy!');
            return;
        }

        try {
            // Ensure we're comparing same types
            const currentBookId = parseInt(this.currentBook.id) || 0;
            const isCurrentlyInWishlist = this.wishlistBookIds.includes(currentBookId);

            console.log('Wishlist click - Book ID:', currentBookId, 'currently in wishlist:', isCurrentlyInWishlist);

            if (isCurrentlyInWishlist) {
                // Remove from wishlist
                console.log('Removing book from wishlist...');
                await this.wishlistModel.removeFromWishlist(currentBookId);
                this.wishlistBookIds = this.wishlistBookIds.filter(id => id !== currentBookId);
                console.log('Removed from wishlist:', currentBookId);
            } else {
                // Add to wishlist
                console.log('Adding book to wishlist with ID:', currentBookId);
                await this.wishlistModel.addToWishlist(currentBookId);
                this.wishlistBookIds.push(currentBookId);
                console.log('Added to wishlist:', currentBookId, 'New list:', this.wishlistBookIds);
            }

            // Update button UI and show feedback
            this.updateWishlistButton();

            // Show success message
            const message = isCurrentlyInWishlist
                ? '❌ Đã xoá khỏi danh sách yêu thích'
                : '✅ Đã thêm vào danh sách yêu thích';
            console.log(message);

        } catch (error) {
            console.error('Error updating wishlist:', error);
            console.error('Error details:', {
                status: error.status,
                message: error.message,
                bookId: this.currentBook?.id
            });
            alert('Lỗi: ' + error.message);
        }
    }
}