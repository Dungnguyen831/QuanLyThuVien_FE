const DashboardView = {
    renderStats(data) {
        document.getElementById('total-books-count').innerText = data.totalBooks.toLocaleString();
        document.getElementById('borrowed-books-count').innerText = data.borrowedBooks.toLocaleString();
        document.getElementById('new-readers-count').innerText = data.newReaders.toLocaleString();
        document.getElementById('overdue-books-count').innerText = data.overdueBooks.toLocaleString();
    },
    
    showError(message) {
        console.error(message);
        // Có thể thêm thông báo alert ở đây
    }
};