class CategoryController {
    constructor(model, view) {
        this.model = model;
        this.view = view;
        this.allCategories = []; // Lưu danh sách gốc để search/filter local
    }

    async init() {
        // 1. Load dữ liệu ban đầu
        await this.loadCategories();

        // 2. Sự kiện nút Thêm mới (Khớp ID addCategoryBtn trong HTML của ông)
        if (this.view.addBtn) {
            this.view.addBtn.onclick = () => this.view.showAddModal ? this.view.showAddModal() : this.handleAddNew();
        }

        // 3. Bind các sự kiện từ View (Dùng đúng tên hàm bindSearch để hết lỗi đỏ)
        this.view.bindSearch((query) => this.handleSearch(query));
        
        // Kiểm tra nếu View có hàm bind cho Save/Edit/Delete thì gán vào
        if (this.view.bindSaveCategory) {
            this.view.bindSaveCategory((id, data) => this.handleSave(id, data));
        }
        
        if (this.view.bindEditCategory) {
            this.view.bindEditCategory((id) => this.handleEdit(id));
        }

        if (this.view.bindDeleteCategory) {
            this.view.bindDeleteCategory((id) => this.handleDelete(id));
        }
    }

    async loadCategories() {
        try {
            this.allCategories = await this.model.fetchCategories();
            console.log("Dữ liệu danh mục mới nhận về:", this.allCategories);
            this.view.renderCategories(this.allCategories);
        } catch (error) {
            console.error("Lỗi load dữ liệu:", error);
        }
    }

    // Tìm kiếm local như AuthorController để mượt mà hơn
    handleSearch(query) {
    const searchTerm = query.toLowerCase().trim();

    const filtered = this.allCategories.filter(c => {
        // 1. Tạo mã hiển thị ảo giống hệt lúc render (ví dụ: DM001)
        const virtualId = `DM${String(c.id).padStart(3, '0')}`.toLowerCase();
        
        // 2. Lấy ID thuần số (ví dụ: 1)
        const realId = String(c.id);

        // 3. So khớp: Tên chứa query HOẶC Mã ảo chứa query HOẶC ID thực chứa query
        return c.name.toLowerCase().includes(searchTerm) || 
               virtualId.includes(searchTerm) ||
               realId.includes(searchTerm);
    });

    this.view.renderCategories(filtered);
}

    async handleSave(id, data) {
    // 1. Làm sạch ID (Chuyển về số nguyên)
    const cleanId = (id && id !== "") ? parseInt(id) : null;

    // 2. CHỈ lấy những trường mà Backend cần (Name & Description)
    // Loại bỏ bookcount hoặc các trường rác khác
    const cleanData = {
        name: data.name,
        description: data.description
    };

    console.log("Dữ liệu thực tế gửi đi:", cleanData);

    const saveBtn = document.querySelector('#categoryForm button[type="submit"]');
    if (saveBtn) saveBtn.disabled = true;

    try {
        if (cleanId) { 
            console.log("Đang gọi API Update danh mục ID:", cleanId);
            await this.model.updateCategory(cleanId, cleanData);
        } else {
            console.log("Đang gọi API Create danh mục mới");
            await this.model.createCategory(cleanData);
        }

        if (this.view.modal) this.view.modal.hide();
        
        // Dùng async/await trực tiếp thay vì lồng setTimeout nếu có thể
        // Hoặc giữ nguyên nếu ông muốn tạo độ trễ cho mượt
        setTimeout(async () => {
            await this.loadCategories(); 
            alert("Thao tác thành công!");
        }, 500);

    } catch (error) {
        console.error("Lỗi API:", error);
        alert("Lỗi: " + error.message);
    } finally {
        if (saveBtn) saveBtn.disabled = false;
    }
    }

    async handleEdit(id) {
        const targetId = Number(id); 
        const category = this.allCategories.find(c => c.id === targetId); 
        
        if (category && this.view.showEditModal) {
            this.view.showEditModal(category);
        } else {
            // Nếu chưa có Modal thì dùng prompt tạm thời như code cũ của ông
            const newName = prompt("Nhập tên thể loại mới cho ID " + targetId + ":", category ? category.name : "");
            if (newName) {
                await this.model.updateCategory(targetId, { name: newName });
                await this.loadCategories();
            }
        }
    }

    async handleDelete(id) {
        const targetId = Number(id);
        if (confirm("Bạn có chắc muốn xóa thể loại này không?")) {
            try {
                await this.model.deleteCategory(targetId);
                await this.loadCategories();
                alert("Xóa danh mục thành công!");
            } catch (error) {
                console.error("Lỗi chi tiết:", error);
                alert(error.message); // Hiện lỗi ràng buộc khóa ngoại
            }
        }
    }
}