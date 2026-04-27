/**
 * NavbarSearchController
 * Handles search functionality with autocomplete suggestions
 */
class NavbarSearchController {
    constructor() {
        this.apiUrl = 'http://localhost:8080/api/v1/books';
        this.allBooks = [];
        this.searchInput = document.getElementById('searchInput');
        this.suggestionsContainer = document.getElementById('searchSuggestions');
        this.debounceTimer = null;
        
        this.init();
    }

    /**
     * Initialize search functionality
     */
    init() {
        if (!this.searchInput || !this.suggestionsContainer) {
            console.warn('Search input or suggestions container not found');
            return;
        }

        // Load books on page load
        this.fetchAllBooks();

        // Add event listeners
        this.searchInput.addEventListener('input', (e) => this.handleInput(e));
        this.searchInput.addEventListener('focus', () => this.showSuggestions());
        document.addEventListener('click', (e) => this.handleDocumentClick(e));
    }

    /**
     * Fetch all books from API
     */
    async fetchAllBooks() {
        try {
            const response = await fetch(this.apiUrl, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                console.warn(`API Error: ${response.status}`);
                return;
            }

            const data = await response.json();
            this.allBooks = Array.isArray(data) ? data : (data.data || data.books || []);
            console.log('Books loaded:', this.allBooks.length);
        } catch (error) {
            console.error('Error fetching books:', error);
        }
    }

    /**
     * Handle input event with debouncing
     */
    handleInput(e) {
        clearTimeout(this.debounceTimer);
        
        this.debounceTimer = setTimeout(() => {
            const query = e.target.value.trim().toLowerCase();
            
            if (query.length === 0) {
                this.hideSuggestions();
                return;
            }

            this.showSuggestions(query);
        }, 300);
    }

    /**
     * Filter books based on search query
     */
    filterBooks(query) {
        if (!query) return [];

        return this.allBooks.filter(book => {
            const title = (book.title || '').toLowerCase();
            const author = (book.author || '').toLowerCase();
            const isbn = (book.isbn || '').toLowerCase();

            return title.includes(query) || 
                   author.includes(query) || 
                   isbn.includes(query);
        }).slice(0, 8); // Limit to 8 suggestions
    }

    /**
     * Display suggestions
     */
    showSuggestions(query = '') {
        const filteredBooks = query ? this.filterBooks(query) : [];

        if (filteredBooks.length === 0 && query) {
            this.suggestionsContainer.innerHTML = `
                <div class="suggestion-item no-results">
                    Không tìm thấy sách phù hợp
                </div>
            `;
            this.suggestionsContainer.style.display = 'block';
            return;
        }

        if (query.length === 0) {
            this.suggestionsContainer.style.display = 'none';
            return;
        }

        this.suggestionsContainer.innerHTML = filteredBooks.map((book, index) => `
            <div class="suggestion-item" data-index="${index}">
                <div class="suggestion-content">
                    <div class="suggestion-title">${this.highlightQuery(book.title, query)}</div>
                    <div class="suggestion-meta">
                        ${book.author ? `<span class="suggestion-author">Tác giả: ${book.author}</span>` : ''}
                        ${book.isbn ? `<span class="suggestion-isbn">ISBN: ${book.isbn}</span>` : ''}
                    </div>
                </div>
            </div>
        `).join('');

        this.suggestionsContainer.style.display = 'block';

        // Add click listeners to suggestions
        document.querySelectorAll('.suggestion-item').forEach(item => {
            item.addEventListener('click', (e) => this.handleSuggestionClick(e));
        });
    }

    /**
     * Highlight query in text
     */
    highlightQuery(text, query) {
        if (!query) return text;
        
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<strong>$1</strong>');
    }

    /**
     * Handle suggestion click
     */
    handleSuggestionClick(e) {
        const suggestionItem = e.currentTarget;
        const index = parseInt(suggestionItem.dataset.index);
        const query = this.searchInput.value.trim().toLowerCase();
        const filteredBooks = this.filterBooks(query);
        const selectedBook = filteredBooks[index];

        if (selectedBook) {
            // Store selected book and redirect
            sessionStorage.setItem('selectedBook', JSON.stringify(selectedBook));
            window.location.href = `/app/user/views/book/book_detail.html?bookId=${selectedBook.id}`;
        }

        this.hideSuggestions();
    }

    /**
     * Hide suggestions
     */
    hideSuggestions() {
        this.suggestionsContainer.style.display = 'none';
        this.suggestionsContainer.innerHTML = '';
    }

    /**
     * Handle click outside to close suggestions
     */
    handleDocumentClick(e) {
        if (!this.searchInput.contains(e.target) && 
            !this.suggestionsContainer.contains(e.target)) {
            this.hideSuggestions();
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new NavbarSearchController();
});
