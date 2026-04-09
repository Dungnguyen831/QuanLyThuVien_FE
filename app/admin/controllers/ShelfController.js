class ShelfController {
    constructor(model, view) {
        this.model = model;
        this.view = view;
    }

    async init() {
        // 1. Gọi Model lấy danh sách từ API
        const shelves = await this.model.fetchShelves();
        
        // 2. Gọi View để in ra màn hình
        this.view.renderShelves(shelves);
    }
}