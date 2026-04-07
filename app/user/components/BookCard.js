/**
 * Reusable BookCard Component
 * Renders a book card with image, title, author, and optional actions
 * Works across Home, Reservation, and Wishlist pages
 * 
 * Architecture:
 * - BookCard.html: Template structure (cached after first load)
 * - BookCard.js: Event handling and DOM creation (this file)
 * - BookCardController.js: Data processing, utilities, logic
 * 
 * Features:
 * - Responsive image with object-fit: cover
 * - Default placeholder for missing images
 * - Flexible data field names (imageUri, cover, imageUrl)
 * - Optional favorite button
 * - Configurable callbacks for actions
 * - Cached template for performance
 */
class BookCard {
    static templateCache = null; // Cache template after first load

    /**
     * Load and cache template from BookCard.html
     * @private
     * @static
     * @returns {Promise<string>} - Template HTML string
     */
    static async _loadTemplate() {
        if (BookCard.templateCache) {
            return BookCard.templateCache;
        }

        try {
            // Fetch the template HTML file using absolute path from server root
            const response = await fetch('/app/user/components/BookCard.html');
            const html = await response.text();

            // Extract template content
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const template = doc.querySelector('#book-card-template');

            if (template) {
                BookCard.templateCache = template.innerHTML;
                return BookCard.templateCache;
            } else {
                console.warn('Template element not found in BookCard.html');
                return '';
            }
        } catch (error) {
            console.error('Failed to load BookCard template:', error);
            return '';
        }
    }

    /**
     * Create a book card element
     * @param {Object} book - Book data object
     * @param {Object} options - Configuration options
     * @returns {HTMLElement|Promise<HTMLElement>} - Book card DOM element
     */
    static async create(book, options = {}) {
        // Step 1: Parse options
        const config = BookCard._parseOptions(options);

        // Step 2: Load template (cached after first load)
        const template = await BookCard._loadTemplate();

        // Step 3: Populate template with book data and event handlers
        const col = BookCard._populateTemplate(template, book, config);

        // Step 4: Setup event listeners
        BookCard._setupEventListeners(col, book, config);

        // Step 5: Return populated element
        return col;
    }

    /**
     * Parse and validate options with defaults
     * @private
     * @static
     * @param {Object} options - Raw options object
     * @returns {Object} - Parsed configuration object
     */
    static _parseOptions(options) {
        return {
            showFavoriteBtn: options.showFavoriteBtn ?? false,
            onFavoriteClick: options.onFavoriteClick ?? null,
            onCardClick: options.onCardClick ?? null,
            imageField: options.imageField ?? null,
            wishlistModel: options.wishlistModel ?? null,
            isInWishlist: options.isInWishlist ?? false,
            onWishlistChange: options.onWishlistChange ?? null
        };
    }

    /**
     * Populate template with book data
     * @private
     * @static
     * @param {string} template - Template HTML string
     * @param {Object} book - Book data
     * @param {Object} config - Configuration object
     * @returns {HTMLElement} - Populated column element
     */
    static _populateTemplate(template, book, config) {
        // Get processed data from BookCardController
        const imageUrl = BookCardController.getImageUrl(book, config.imageField);
        const authorDisplay = BookCardController.getAuthorDisplay(book);
        const availabilityBadge = BookCardController.getAvailabilityBadge(book);
        const categoryDisplay = BookCardController.getCategoryDisplay(book);

        // Create image HTML with fallback
        const defaultImage = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 200 300%22%3E%3Crect fill=%22%23e5e7eb%22 width=%22200%22 height=%22300%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 font-size=%2216%22 fill=%22%23999%22 font-family=%22Arial%22%3ENo Cover%3C/text%3E%3C/svg%3E';
        const imageElement = `<img src="${BookCardController.escapeHtml(imageUrl)}" alt="${BookCardController.escapeHtml(book.title || 'Book')}" class="book-card-image" loading="lazy" onerror="this.src='${defaultImage}'">`;

        // Create favorite button HTML (if enabled)
        const isInWishlistClass = config.isInWishlist ? 'in-wishlist' : '';
        const btnTitle = config.isInWishlist ? 'Remove from wishlist' : 'Add to wishlist';
        const favoriteButton = config.showFavoriteBtn ?
            `<button class="book-card-favorite-btn ${isInWishlistClass}" title="${btnTitle}" data-book-id="${book.id}"><i class="fas fa-heart"></i></button>` : '';

        // Replace placeholders in template
        let html = template
            .replace('{bookId}', book.id)
            .replace('{imageElement}', imageElement)
            .replace('{favoriteButton}', favoriteButton)
            .replace('{bookTitle}', BookCardController.escapeHtml(book.title || 'Unknown Title'))
            .replace('{authorDisplay}', BookCardController.escapeHtml(authorDisplay))
            .replace('{availabilityBadge}', availabilityBadge) // Badge already has HTML
            .replace('{categoryDisplay}', BookCardController.escapeHtml(categoryDisplay));

        // Convert HTML string to DOM element
        const wrapper = document.createElement('div');
        wrapper.innerHTML = html;
        return wrapper.firstElementChild;
    }

    /**
     * Setup all event listeners for the card
     * @private
     * @static
     * @param {HTMLElement} col - Column wrapper element
     * @param {Object} book - Book data
     * @param {Object} config - Configuration object
     */
    static _setupEventListeners(col, book, config) {
        const card = col.querySelector('.book-card');

        // Setup card click listener
        if (config.onCardClick) {
            BookCard._attachCardClickListener(card, book, config.onCardClick);
        }

        // Setup favorite button listener
        if (config.showFavoriteBtn) {
            const favoriteBtn = col.querySelector('.book-card-favorite-btn');
            if (favoriteBtn) {
                BookCard._attachFavoriteBtnListener(favoriteBtn, book, config);
            }
        }
    }

    /**
     * Attach click listener to card
     * @private
     * @static
     * @param {HTMLElement} card - Card element
     * @param {Object} book - Book data
     * @param {Function} onCardClick - Callback function
     */
    static _attachCardClickListener(card, book, onCardClick) {
        card.addEventListener('click', (e) => {
            if (!e.target.closest('.book-card-favorite-btn')) {
                onCardClick(book);
            }
        });
        card.style.cursor = 'pointer';
    }

    /**
     * Attach listener to favorite button
     * @private
     * @static
     * @param {HTMLElement} favoriteBtn - Button element
     * @param {Object} book - Book data
     * @param {Object} config - Configuration object
     */
    static _attachFavoriteBtnListener(favoriteBtn, book, config) {
        const { onFavoriteClick, wishlistModel, onWishlistChange } = config;

        // Determine handler based on available callbacks
        if (wishlistModel) {
            // Wishlist handler (with or without callback)
            favoriteBtn.addEventListener('click', async (e) => {
                e.stopPropagation();
                await BookCard._handleWishlistToggle(favoriteBtn, book, wishlistModel, onWishlistChange);
                if (onFavoriteClick) onFavoriteClick(book);
            });
        } else if (onFavoriteClick) {
            // Simple callback only
            favoriteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                onFavoriteClick(book);
            });
        }
    }

    /**
     * Handle wishlist toggle (add/remove)
     * @private
     * @static
     * @param {HTMLElement} btn - Button element
     * @param {Object} book - Book data
     * @param {Object} model - WishlistModel instance
     * @param {Function} callback - onWishlistChange callback
     */
    static async _handleWishlistToggle(btn, book, model, callback) {
        try {
            const isInWishlist = btn.classList.contains('in-wishlist');
            const action = isInWishlist ? 'remove' : 'add';

            // Call API
            if (action === 'add') {
                await model.addToWishlist(book.id);
                BookCard._updateButtonState(btn, true);
                if (callback) callback(book, true);
            } else {
                await model.removeFromWishlist(book.id);
                BookCard._updateButtonState(btn, false);
                if (callback) callback(book, false);
            }

            // Notify other pages
            window.dispatchEvent(new CustomEvent('wishlistChanged', {
                detail: { bookId: book.id, inWishlist: action === 'add' }
            }));
        } catch (error) {
            console.error('Wishlist update failed:', error);
            alert('Failed to update wishlist. Please try again.');
        }
    }

    /**
     * Update button visual state
     * @private
     * @static
     * @param {HTMLElement} btn - Button element
     * @param {boolean} inWishlist - Is in wishlist
     */
    static _updateButtonState(btn, inWishlist) {
        if (inWishlist) {
            btn.classList.add('in-wishlist');
            btn.title = 'Remove from wishlist';
            btn.classList.add('bookcard-favorite-added');
            setTimeout(() => btn.classList.remove('bookcard-favorite-added'), 600);
        } else {
            btn.classList.remove('in-wishlist');
            btn.title = 'Add to wishlist';
            btn.classList.add('bookcard-favorite-removed');
            setTimeout(() => btn.classList.remove('bookcard-favorite-removed'), 600);
        }
    }
}
