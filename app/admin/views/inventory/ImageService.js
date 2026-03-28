class ImageService {
    static getImageUrl(url) {
        if (!url || url === 'null' || url.trim() === '') {
            return '/assets/img/default-book.jpg'; 
        }
        if (url.startsWith('http') || url.startsWith('data:image')) {
            return url;
        }
        // Nối với thư mục chứa ảnh của bạn (ví dụ assets/img/)
        return `/assets/img/${url}`; 
    }

    static display(elementId, url) {
        const imgElement = document.getElementById(elementId);
        if (imgElement) {
            imgElement.src = this.getImageUrl(url);
            imgElement.onerror = () => {
                imgElement.src = '/assets/img/default-book.jpg';
            };
        }
    }
}