class AuthorController {
    constructor(model, view) {
        this.model = model;
        this.view = view;
        this.editingId = null;
    }

    init() {
        this.view.renderTable(this.model.authors);
        this.initEvents();
    }

    initEvents() {
        // 1. Tìm kiếm & Lọc
        document.getElementById('authorSearch').oninput = () => this.refresh();
        document.querySelectorAll('.dropdown-item').forEach(item => {
            item.onclick = (e) => {
                e.preventDefault();
                // Logic đổi class active và text dropdown...
                this.refresh();
            };
        });

        // 2. Thêm mới
        document.getElementById('btnAddAuthor').onclick = () => {
            this.editingId = null;
            this.view.showModal("Thêm tác giả mới");
        };

        // 3. Lưu Form (Thêm/Sửa)
        this.view.form.onsubmit = (e) => {
            e.preventDefault();
            const formData = {
                name: document.getElementById('authorName').value,
                role: document.getElementById('authorRole').value,
                // ... lấy các input khác
            };

            if (this.editingId) this.model.updateAuthor(this.editingId, formData);
            else this.model.addAuthor(formData);

            this.view.modal.hide();
            this.refresh();
        };

        // 4. Xóa
        this.view.tableBody.onclick = (e) => {
            const btnDelete = e.target.closest('.btn-delete');
            if (btnDelete) {
                const id = btnDelete.closest('tr').dataset.id;
                if (confirm(`Xóa ${id}?`)) {
                    this.model.deleteAuthor(id);
                    this.refresh();
                }
            }
        };
    }

    refresh() {
        const filters = {
            keyword: document.getElementById('authorSearch').value.toLowerCase(),
            genre: document.querySelector('#filterGenre .dropdown-item.active')?.dataset.value || 'all',
            status: document.querySelector('#filterStatus .dropdown-item.active')?.dataset.value || 'all'
        };
        this.view.renderTable(this.model.getFilteredAuthors(filters));
    }
}