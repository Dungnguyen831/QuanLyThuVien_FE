class BookDetailView {
    constructor() {
        this.dom = {
            title: document.getElementById('book-title'),
            titlePath: document.getElementById('title-path'),
            categoryPath: document.getElementById('category-path'),
            categoryLabel: document.getElementById('category-label'),
            authorYear: document.getElementById('book-author-year'),
            img: document.getElementById('book-img'),
            isbn: document.getElementById('book-isbn'),
            year: document.getElementById('book-year'),
            qty: document.getElementById('book-qty'),
            available: document.getElementById('availability-label'),
            desc: document.getElementById('book-desc')
        };
    }

    renderBookDetail(book) {
    if (!book) {
        console.error("Dữ liệu sách bị trống!");
        return;
    }

    const { dom } = this;

    // 1. Cập nhật Tiêu đề
    dom.title.innerText = book.title || 'Không rõ tiêu đề';
    dom.titlePath.innerText = book.title || '';

    // 2. XỬ LÝ DANH MỤC (Xóa chữ "Category ID: 1" theo ý ông)
    // Nếu có tên danh mục thì hiện, không thì để trống chứ không hiện ID nữa
    const catName = book.categoryName || ''; 
    dom.categoryPath.innerText = catName;
    dom.categoryLabel.innerText = catName;

    // Nếu không có tên danh mục thì ẩn cái nhãn màu đi cho đẹp
    if (!catName) {
        dom.categoryLabel.style.display = 'none';
    } else {
        dom.categoryLabel.style.display = 'inline-block';
    }

    // 3. XỬ LÝ TÁC GIẢ (Fix lỗi mất dữ liệu tại đây)
    const author = book.authorName || book.author_name || '';
    dom.authorYear.innerText = `${author} • Năm tái bản ${book.publishedYear || 'N/A'}`;

    // 4. XỬ LÝ ẢNH
    dom.img.onerror = function () {
        this.onerror = null; 
        this.src = "../../../../assets/img/default-book.jpg";
    };

    if (book.imageUrl) {
        const fileName = book.imageUrl.split('/').pop();
        dom.img.src = `../../../../assets/img/${fileName}`;
    } else {
        dom.img.src = "../../../../assets/img/default-book.jpg";
    }

    // 5. THÔNG SỐ KỸ THUẬT
    dom.isbn.innerText = book.isbn || 'N/A';
    dom.year.innerText = book.publishedYear || 'N/A';
    dom.qty.innerText = book.totalQty || 0;
    dom.desc.innerText = book.description || 'Chưa có mô tả.';

    // 6. TRẠNG THÁI MƯỢN
    const stock = book.availableQty ?? 0;
    const btnBorrow = document.getElementById('btn-borrow');

    if (stock > 0) {
        dom.available.innerText = `● AVAILABLE: ${stock} BOOKS`;
        dom.available.className = 'lbl available';
        if (btnBorrow) btnBorrow.disabled = false;
    } else {
        dom.available.innerText = `● OUT OF STOCK`;
        dom.available.className = 'lbl text-danger bg-danger-subtle';
        if (btnBorrow) {
            btnBorrow.disabled = true;
            btnBorrow.innerText = "❌ Out of Stock";
        }
    }
}
}