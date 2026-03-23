class PublisherController {
    constructor(model, view) {
        this.model = model;
        this.view = view;
    }

    async init() {
        // 1. Gọi Model lấy danh sách từ API
        const publishers = await this.model.fetchPublishers();
        
        // 2. Gọi View để in ra màn hình
        this.view.renderPublishers(publishers);
    }
}