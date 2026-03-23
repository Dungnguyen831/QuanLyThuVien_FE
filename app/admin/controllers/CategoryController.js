class CategoryController {
    constructor(model, view) {
        this.model = model;
        this.view = view;
    }

    async init() {
        // 1. Gọi Model lấy danh sách từ API
        const categories = await this.model.fetchCategories();
        
        // 2. Gọi View để in ra màn hình
        this.view.renderCategories(categories);
    }
}