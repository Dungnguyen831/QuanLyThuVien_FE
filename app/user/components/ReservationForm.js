/**
 * Reservation Form Component
 * Handles creating and editing reservations via modal form
 * Reusable for both CREATE (new) and UPDATE (edit) modes
 * 
 * Architecture:
 * - ReservationForm.html: Template structure (cached after first load)
 * - ReservationForm.js: Form logic and event handling (this file)
 * - ReservationController.js: Business logic (API calls, form submission)
 * 
 * Features:
 * - Template caching for performance
 * - Dynamic mode switching (CREATE vs UPDATE)
 * - Form validation
 * - Modal overlay with close button
 * - Configurable callbacks
 */
class ReservationForm {
    static templateCache = null; // Cache template after first load
    static defaultTodayDate = new Date().toISOString().split('T')[0]; // Today's date in YYYY-MM-DD

    /**
     * Load and cache template from ReservationForm.html
     * @private
     * @static
     * @returns {Promise<string>} - Template HTML string
     */
    static async _loadTemplate() {
        if (ReservationForm.templateCache) {
            return ReservationForm.templateCache;
        }

        try {
            const response = await fetch('/app/user/components/ReservationForm.html');
            const html = await response.text();

            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const template = doc.querySelector('#reservation-form-template');

            if (template) {
                ReservationForm.templateCache = template.innerHTML;
                return ReservationForm.templateCache;
            } else {
                console.warn('Template element not found in ReservationForm.html');
                return '';
            }
        } catch (error) {
            console.error('Failed to load ReservationForm template:', error);
            return '';
        }
    }

    /**
     * Create a reservation form modal
     * @static
     * @param {Object} options - Configuration options
     * @param {Object} options.reservation - Reservation object (null for CREATE, object for UPDATE)
     * @param {Array} options.availableBooks - Array of books for selection dropdown (for CREATE mode)
     * @returns {Promise<HTMLElement>} - Modal form DOM element
     */
    static async create(options = {}) {
        // Parse options
        const { reservation = null, availableBooks = [] } = options;

        // Load template (cached after first load)
        const template = await ReservationForm._loadTemplate();

        // Determine mode: CREATE (reservation = null) or UPDATE (reservation = object)
        const isCreateMode = !reservation;

        // Populate template with data
        const modal = ReservationForm._populateTemplate(template, {
            isCreateMode,
            reservation,
            availableBooks
        });

        // Setup event listeners
        ReservationForm._setupEventListeners(modal, isCreateMode);

        return modal;
    }

    /**
     * Populate template with form data
     * @private
     * @static
     * @param {string} template - Template HTML string
     * @param {Object} data - Data object with isCreateMode, reservation, availableBooks
     * @returns {HTMLElement} - Populated modal element
     */
    static _populateTemplate(template, data) {
        const { isCreateMode, reservation, availableBooks } = data;

        // Prepare modal title and button text
        const modalTitle = isCreateMode ? 'New Reservation' : 'Edit Reservation';
        const submitButtonText = isCreateMode ? '+ Create Reservation' : 'Update Reservation';

        // Prepare book selector (only for CREATE mode)
        let bookSelector = '';
        if (isCreateMode) {
            bookSelector = ReservationForm._createBookSelector(availableBooks);
        }

        // Get pickup date (extract date part from reservationDate LocalDateTime)
        let pickupDate = ReservationForm.defaultTodayDate;
        if (!isCreateMode && reservation) {
            // reservationDate format: "2026-04-10T09:00:00" or "2026-04-10T09:00:00.000+07:00"
            const reservationDateStr = reservation.reservationDate || '';
            pickupDate = reservationDateStr.split('T')[0] || ReservationForm.defaultTodayDate;
        }

        // Replace all placeholders
        let html = template
            .replace('{modalTitle}', modalTitle)
            .replace('{bookSelector}', bookSelector)
            .replace('{pickupDate}', pickupDate)
            .replace('{submitButtonText}', submitButtonText);

        // Convert HTML string to DOM element
        const wrapper = document.createElement('div');
        wrapper.innerHTML = html;
        return wrapper.firstElementChild;
    }

    /**
     * Create book selector search input with autocomplete
     * @private
     * @static
     * @param {Array} books - Available books array
     * @returns {string} - Book selector HTML or empty string if no books
     */
    static _createBookSelector(books = []) {
        if (!books || books.length === 0) {
            return '';
        }

        // Store books data in a data attribute for filtering
        // Note: Using single quotes for JSON to avoid conflicts with HTML attribute quotes
        const booksJson = JSON.stringify(books).replace(/"/g, '&quot;');

        return `
            <div class="form-group">
                <label for="book-search">Select Book <span class="required">*</span></label>
                <div class="book-search-wrapper">
                    <input 
                        type="text" 
                        id="book-search" 
                        class="form-control book-search-input" 
                        placeholder="Type book name or author..."
                        autocomplete="off"
                        required
                        data-books="${booksJson}"
                    >
                    <input type="hidden" id="selected-book-id" name="bookId" value="">
                    <div class="book-suggestions-dropdown"></div>
                </div>
                <small class="form-text">Search and select a book from the list</small>
            </div>
        `;
    }

    /**
     * Create status selector dropdown HTML (for UPDATE mode)
     * @private
     * @static
     * @param {string} currentStatus - Current reservation status
     * @returns {string} - Status selector HTML
     */

    /**
     * Setup all event listeners for the form
     * @private
     * @static
     * @param {HTMLElement} modal - Modal element
     * @param {boolean} isCreateMode - Whether in CREATE mode
     */
    static _setupEventListeners(modal, isCreateMode) {
        // Close button
        const closeBtn = modal.querySelector('.modal-close-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                ReservationForm._closeModal(modal);
            });
        }

        // Cancel button
        const cancelBtn = modal.querySelector('.close-modal-btn');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', (e) => {
                e.preventDefault();
                ReservationForm._closeModal(modal);
            });
        }

        // Close on overlay click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                ReservationForm._closeModal(modal);
            }
        });

        // Setup book search autocomplete (for CREATE mode)
        if (isCreateMode) {
            ReservationForm._setupBookSearch(modal);
        }

        // Form submit will be handled by ReservationController
        // Store mode on form for later reference
        const form = modal.querySelector('#reservation-form');
        if (form) {
            form.dataset.mode = isCreateMode ? 'create' : 'update';
        }
    }

    /**
     * Close modal by removing it from DOM
     * @private
     * @static
     * @param {HTMLElement} modal - Modal element
     */
    static _closeModal(modal) {
        if (modal && modal.parentNode) {
            modal.remove();
        }
    }

    /**
     * Get form data as object
     * Maps form fields to ReservationRequestDTO format
     * @static
     * @param {HTMLElement} modal - Modal element
     * @param {boolean} isCreateMode - Whether in CREATE mode
     * @returns {Object} Form data object ready for API
     */
    static getFormData(modal, isCreateMode = true) {
        const form = modal.querySelector('#reservation-form');
        if (!form) return null;

        const formData = new FormData(form);
        const pickupDateStr = formData.get('pickupDate'); // YYYY-MM-DD format

        // Convert date to LocalDateTime format (YYYY-MM-DDTHH:mm:ss)
        // Default time: 09:00:00 (9 AM)
        const reservationDate = pickupDateStr ? `${pickupDateStr}T09:00:00` : null;

        const data = {
            bookId: parseInt(formData.get('bookId')),
            reservationDate: reservationDate
        };

        // For UPDATE mode, include status
        if (!isCreateMode) {
            data.status = formData.get('status') || 'PENDING';
        } else {
            // For CREATE mode, default status is PENDING
            data.status = 'PENDING';
        }

        // Note: userId is extracted from JWT on backend, no need to send
        // Note: notes field is not in ReservationRequestDTO, removed

        return data;
    }

    /**
     * Validate form data
     * @static
     * @param {Object} data - Form data object
     * @param {boolean} isCreateMode - Whether in CREATE mode
     * @returns {Object} - { isValid: boolean, errors: string[] }
     */
    static validateFormData(data, isCreateMode) {
        const errors = [];

        if (isCreateMode && !data.bookId) {
            errors.push('Please select a book');
        }

        if (!data.reservationDate) {
            errors.push('Please select a pickup date');
        } else {
            // Check if date is in the past
            const selectedDate = new Date(data.reservationDate.split('T')[0]);
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (selectedDate < today) {
                errors.push('Pickup date must be today or in the future');
            }
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    /**
     * Setup book search input with autocomplete suggestions
     * @private
     * @static
     * @param {HTMLElement} modal - Modal element
     */
    static _setupBookSearch(modal) {
        const searchInput = modal.querySelector('#book-search');
        const suggestionsDropdown = modal.querySelector('.book-suggestions-dropdown');

        if (!searchInput) return;

        // Parse available books from data attribute
        let availableBooks = [];
        try {
            let booksJson = searchInput.dataset.books;
            if (booksJson) {
                // Decode HTML entities back to quotes
                booksJson = booksJson.replace(/&quot;/g, '"');
                availableBooks = JSON.parse(booksJson);
            }
        } catch (error) {
            console.error('Failed to parse books data:', error);
            return;
        }

        // Event: User types in search input
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.trim();

            if (searchTerm.length === 0) {
                // Hide suggestions if input is empty
                suggestionsDropdown.innerHTML = '';
                suggestionsDropdown.style.display = 'none';
                return;
            }

            // Filter and display suggestions
            const filtered = ReservationForm._filterBooks(availableBooks, searchTerm);
            ReservationForm._showSuggestions(modal, filtered, availableBooks);
        });

        // Event: Focus on input to show suggestions if any
        searchInput.addEventListener('focus', (e) => {
            if (e.target.value.trim().length > 0) {
                const searchTerm = e.target.value.trim();
                const filtered = ReservationForm._filterBooks(availableBooks, searchTerm);
                ReservationForm._showSuggestions(modal, filtered, availableBooks);
            }
        });

        // Event: Hide suggestions when clicking outside
        document.addEventListener('click', (e) => {
            if (!searchInput.contains(e.target) && !suggestionsDropdown.contains(e.target)) {
                suggestionsDropdown.style.display = 'none';
            }
        });
    }

    /**
     * Filter books based on search term
     * Searches in book title and author
     * @private
     * @static
     * @param {Array} books - Available books array
     * @param {string} searchTerm - Search term (case-insensitive)
     * @returns {Array} - Filtered books array (max 8 results)
     */
    static _filterBooks(books, searchTerm) {
        if (!searchTerm) return [];

        const lowerSearch = searchTerm.toLowerCase();
        const filtered = books.filter(book => {
            const title = (book.title || '').toLowerCase();
            const author = (book.author || '').toLowerCase();
            return title.includes(lowerSearch) || author.includes(lowerSearch);
        });

        // Return maximum 8 suggestions
        return filtered.slice(0, 8);
    }

    /**
     * Display suggestions dropdown
     * @private
     * @static
     * @param {HTMLElement} modal - Modal element
     * @param {Array} filteredBooks - Filtered books to display
     * @param {Array} allBooks - All available books (for reference)
     */
    static _showSuggestions(modal, filteredBooks, allBooks) {
        const suggestionsDropdown = modal.querySelector('.book-suggestions-dropdown');
        const searchInput = modal.querySelector('#book-search');

        if (!suggestionsDropdown) return;

        // Clear previous suggestions
        suggestionsDropdown.innerHTML = '';

        if (filteredBooks.length === 0) {
            suggestionsDropdown.innerHTML = '<div class="suggestion-item no-results">No books found</div>';
            suggestionsDropdown.style.display = 'block';
            return;
        }

        // Create suggestion items
        filteredBooks.forEach(book => {
            const suggestionItem = document.createElement('div');
            suggestionItem.className = 'suggestion-item';

            const bookTitle = ReservationForm._escapeHtml(book.title || 'Unknown Title');
            const bookAuthor = ReservationForm._escapeHtml(book.author || 'Unknown Author');
            const bookId = book.id;

            suggestionItem.innerHTML = `
                <div class="suggestion-title">${bookTitle}</div>
                <div class="suggestion-author">${bookAuthor}</div>
            `;

            suggestionItem.addEventListener('click', () => {
                ReservationForm._selectBook(modal, bookId, bookTitle, bookAuthor);
            });

            suggestionsDropdown.appendChild(suggestionItem);
        });

        suggestionsDropdown.style.display = 'block';
    }

    /**
     * Handle book selection from suggestions
     * @private
     * @static
     * @param {HTMLElement} modal - Modal element
     * @param {number} bookId - Selected book ID
     * @param {string} bookTitle - Selected book title
     * @param {string} bookAuthor - Selected book author
     */
    static _selectBook(modal, bookId, bookTitle, bookAuthor) {
        const searchInput = modal.querySelector('#book-search');
        const bookIdInput = modal.querySelector('#selected-book-id');
        const suggestionsDropdown = modal.querySelector('.book-suggestions-dropdown');

        if (searchInput && bookIdInput) {
            // Update search input to show selected book
            searchInput.value = `${bookTitle} - ${bookAuthor}`;

            // Store book ID in hidden input
            bookIdInput.value = bookId;

            // Hide suggestions
            suggestionsDropdown.style.display = 'none';
        }
    }

    /**
     * Escape HTML to prevent XSS
     * @private
     * @static
     * @param {string} text - Text to escape
     * @returns {string} - Escaped text
     */
    static _escapeHtml(text) {
        if (!text) return '';
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return String(text).replace(/[&<>"']/g, (char) => map[char]);
    }
}
