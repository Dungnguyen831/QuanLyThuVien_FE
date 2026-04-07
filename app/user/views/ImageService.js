/**
 * ImageService for User Section
 * Handles image uploads and URL construction for displaying book covers
 * 
 * Backend API: POST /api/v1/upload
 * Upload response: { url: "fileName" }
 * Display URL: /api/v1/images/{fileName}
 */
class ImageService {
    constructor() {
        // Auto-detect API base URL
        this.apiBaseUrl = window.API_BASE_URL || this._getDefaultApiUrl();
        this.uploadEndpoint = `${this.apiBaseUrl}/upload`;
        this.imageBaseUrl = `${this.apiBaseUrl}/images`;
    }

    /**
     * Get default API URL based on current environment
     * @private
     * @returns {string} API base URL
     */
    _getDefaultApiUrl() {
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            return 'http://localhost:8080/api/v1';
        } else if (window.location.hostname !== '') {
            return `${window.location.protocol}//${window.location.hostname}:8080/api/v1`;
        } else {
            return '/api/v1';
        }
    }

    /**
     * Upload a single image file
     * @param {File} file - The file to upload
     * @returns {Promise<Object>} - { url: "fileName" }
     */
    async uploadImage(file) {
        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch(this.uploadEndpoint, {
                method: 'POST',
                body: formData
                // Don't set Content-Type header - browser will set it automatically with boundary
            });

            if (!response.ok) {
                throw new Error(`Upload failed: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            console.log('Image uploaded successfully:', data);
            return data; // Returns { url: "fileName" }
        } catch (error) {
            console.error('Error uploading image:', error);
            throw error;
        }
    }

    /**
     * Upload multiple images
     * @param {FileList|File[]} files - Files to upload
     * @returns {Promise<Array>} - Array of { url: "fileName" }
     */
    async uploadImages(files) {
        const uploads = [];
        for (const file of files) {
            uploads.push(this.uploadImage(file));
        }
        return Promise.all(uploads);
    }

    /**
     * Get full image URL for display
     * @param {string} fileName - The filename returned from upload
     * @returns {string} - Full image URL
     */
    getImageUrl(fileName) {
        if (!fileName) return this.getPlaceholderImage();

        // If it's already a full URL, return it
        if (fileName.startsWith('http://') || fileName.startsWith('https://')) {
            return fileName;
        }

        // Otherwise, construct the full URL
        return `${this.imageBaseUrl}/${encodeURIComponent(fileName)}`;
    }

    /**
     * Get placeholder image as data URL
     * @returns {string} - SVG data URL for placeholder
     */
    getPlaceholderImage() {
        return 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 200 300%22%3E%3Crect fill=%22%23e5e7eb%22 width=%22200%22 height=%22300%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 font-size=%2216%22 fill=%22%23999%22 font-family=%22Arial%22%3ENo Cover%3C/text%3E%3C/svg%3E';
    }

    /**
     * Get/construct image URL from book object (handles multiple field names)
     * @param {Object} book - Book object from API
     * @returns {string} - Image URL or placeholder
     */
    getBookImageUrl(book) {
        if (!book) return this.getPlaceholderImage();

        // Try multiple possible field names from backend
        const imageFileName =
            book.imageUrl ||
            book.cover ||
            book.image ||
            book.coverImage ||
            book.imageUri;

        return this.getImageUrl(imageFileName);
    }

    /**
     * Validate image file before upload
     * @param {File} file - File to validate
     * @param {Object} options - Validation options
     * @returns {Object} - { valid: boolean, error?: string }
     */
    validateImage(file, options = {}) {
        const {
            maxSize = 5 * 1024 * 1024, // 5MB default
            allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
        } = options;

        if (!file) {
            return { valid: false, error: 'No file selected' };
        }

        if (!allowedTypes.includes(file.type)) {
            return {
                valid: false,
                error: `Invalid file type. Allowed: ${allowedTypes.join(', ')}`
            };
        }

        if (file.size > maxSize) {
            return {
                valid: false,
                error: `File size exceeds ${maxSize / (1024 * 1024)}MB limit`
            };
        }

        return { valid: true };
    }

    /**
     * Create preview URL for file before upload (for UI preview)
     * @param {File} file - File to create preview from
     * @returns {Promise<string>} - Data URL for preview
     */
    createPreviewUrl(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }
}

// Make ImageService available globally
if (typeof window !== 'undefined') {
    window.ImageService = window.ImageService || ImageService;
}
