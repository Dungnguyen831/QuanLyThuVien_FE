class AuthorController {
    constructor(model, view) {
        this.model = model;
        this.view = view;
        this.init();
        this.allAuthors = []; // Lưu danh sách gốc để tìm kiếm local nếu cần
        this.view.bindFilters((filters) => this.handleFilters(filters));
    }

    async init() {
    // 1. Load dữ liệu ban đầu
    await this.loadAuthors();
    
    // 2. Sự kiện nút Thêm mới
    const addBtn = document.querySelector('.btn-primary');
    if (addBtn) {
        addBtn.onclick = () => this.view.showAddModal();
    }

    // 3. Bind các sự kiện từ View (Dùng mấy hàm này thay cho cái đoạn 'click' ông định bỏ)
    this.view.bindSearch((query) => this.handleSearch(query));
    this.view.bindSaveAuthor((id, data) => this.handleSave(id, data));
    
    // ĐÃ THAY THẾ CHO ĐOẠN ADD EVENT LISTENER CŨ:
    this.view.bindEditAuthor((id) => this.handleEdit(id));
    this.view.bindDeleteAuthor((id) => this.handleDelete(id));
    }

    async loadAuthors() {
        this.allAuthors = await this.model.fetchAuthors();
        console.log("Dữ liệu mới nhận về:", this.allAuthors);
        this.view.renderAuthors(this.allAuthors);
    }

    handleSearch(query) {
        const filtered = this.allAuthors.filter(a => 
            a.name.toLowerCase().includes(query.toLowerCase()) || 
            String(a.id).includes(query)
        );
        this.view.renderAuthors(filtered);
    }

    async handleSave(id, data) {
    const saveBtn = document.querySelector('#btnSaveAuthor');
    if (saveBtn) saveBtn.disabled = true;

    try {
        if (id && id !== "") { 
            console.log("Đang gọi API Update cho ID:", id);
            await this.model.updateAuthor(id, data);
        } else {
            console.log("Đang gọi API Create mới");
            await this.model.createAuthor(data);
        }

        // QUAN TRỌNG: Đóng modal và load lại
        this.view.modal.hide();
        
        // Thêm một khoảng nghỉ nhỏ 500ms để BE kịp commit DB nếu máy yếu
        setTimeout(async () => {
            await this.loadAuthors(); 
            alert("Thao tác thành công!");
        }, 500);

    } catch (error) {
        alert("Lỗi: " + error.message);
    } finally {
        if (saveBtn) saveBtn.disabled = false;
    }
    }
    async handleEdit(id) {
    // Ép kiểu id về Number để so sánh chính xác với data từ API
    const targetId = Number(id); 
    console.log("ID nhận từ nút bấm:", targetId);

    const author = this.allAuthors.find(a => a.id === targetId); 
    
    if (author) {
        console.log("Tìm thấy tác giả để sửa:", author);
        this.view.showEditModal(author);
    } else {
        // Nếu nó nhảy vào đây là do ID trên nút bấm và ID trong mảng allAuthors không khớp
        console.error("LỖI: Không tìm thấy tác giả ID " + targetId + " trong mảng local!", this.allAuthors);
        alert("Lỗi dữ liệu: Không tìm thấy tác giả này.");
    }
    }
   async handleDelete(id) {
    const targetId = Number(id);
    try {
        await this.model.deleteAuthor(targetId);
        await this.loadAuthors();
        alert("Xóa tác giả thành công!");
    } catch (error) {
        // Sửa dòng này để nó hiện nội dung lỗi từ Backend trả về
        console.error("Lỗi chi tiết:", error);
        alert(error.message); // Thay vì alert("Không thể xóa...") cố định
    }
    }
}