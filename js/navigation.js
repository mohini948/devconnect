/**
 * DevConnect Navigation System
 * Handles page navigation and URL routing
 */

class NavigationManager {
    constructor() {
        this.currentPage = 'home';
        this.pages = ['home', 'feed', 'network', 'jobs', 'profile'];
        this.init();
    }

    init() {
        // Initialize navigation event listeners
        this.setupNavigationListeners();
        
        // Handle initial page load
        this.handleInitialLoad();
        
        // Handle browser back/forward buttons
        window.addEventListener('popstate', (event) => {
            const page = event.state?.page || 'home';
            this.showPage(page, false);
        });
    }

    setupNavigationListeners() {
        // Navigation links
        document.querySelectorAll('[data-page]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = e.currentTarget.getAttribute('data-page');
                this.showPage(page);
            });
        });

        // Mobile menu handling
        const navbarToggler = document.querySelector('.navbar-toggler');
        const navbarCollapse = document.querySelector('.navbar-collapse');
        
        if (navbarToggler && navbarCollapse) {
            // Close mobile menu when clicking on a nav link
            document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
                link.addEventListener('click', () => {
                    if (navbarCollapse.classList.contains('show')) {
                        navbarToggler.click();
                    }
                });
            });
        }
    }

    handleInitialLoad() {
        // Get page from URL hash or default to home
        const hash = window.location.hash.substring(1);
        const page = this.pages.includes(hash) ? hash : 'home';
        this.showPage(page, false);
    }

    showPage(pageId, updateHistory = true) {
        // Validate page ID
        if (!this.pages.includes(pageId)) {
            console.error(`Invalid page ID: ${pageId}`);
            return;
        }

        // Hide all pages
        document.querySelectorAll('.page-content').forEach(page => {
            page.classList.remove('active');
            page.style.display = 'none';
        });

        // Show target page
        const targetPage = document.getElementById(`${pageId}-page`);
        if (targetPage) {
            targetPage.classList.add('active');
            targetPage.style.display = 'block';
            
            // Add fade-in animation
            targetPage.classList.add('fade-in');
            setTimeout(() => {
                targetPage.classList.remove('fade-in');
            }, 600);
        }

        // Update navigation active states
        this.updateNavigationStates(pageId);

        // Update URL and browser history
        if (updateHistory) {
            const url = pageId === 'home' ? '#' : `#${pageId}`;
            window.history.pushState({ page: pageId }, '', url);
        }

        // Update current page
        this.currentPage = pageId;

        // Trigger page-specific initialization
        this.initializePage(pageId);

        // Update page title
        this.updatePageTitle(pageId);

        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    updateNavigationStates(activePageId) {
        // Update navbar links
        document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
            const page = link.getAttribute('data-page');
            if (page === activePageId) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });

        // Update dropdown links
        document.querySelectorAll('.dropdown-menu .dropdown-item[data-page]').forEach(link => {
            const page = link.getAttribute('data-page');
            if (page === activePageId) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    updatePageTitle(pageId) {
        const titles = {
            home: 'DevConnect - Professional Developer Network',
            feed: 'Feed - DevConnect',
            network: 'My Network - DevConnect',
            jobs: 'Jobs - DevConnect',
            profile: 'Profile - DevConnect'
        };

        document.title = titles[pageId] || titles.home;
    }

    initializePage(pageId) {
        switch (pageId) {
            case 'home':
                this.initializeHomePage();
                break;
            case 'feed':
                this.initializeFeedPage();
                break;
            case 'network':
                this.initializeNetworkPage();
                break;
            case 'jobs':
                this.initializeJobsPage();
                break;
            case 'profile':
                this.initializeProfilePage();
                break;
        }
    }

    initializeHomePage() {
        // Home page specific initialization
        console.log('Home page initialized');
        
        // Animate hero section elements
        const heroContent = document.querySelector('.hero-content');
        if (heroContent) {
            heroContent.classList.add('slide-up');
            setTimeout(() => {
                heroContent.classList.remove('slide-up');
            }, 600);
        }
    }

    initializeFeedPage() {
        // Feed page specific initialization
        console.log('Feed page initialized');
        
        // Initialize post interactions
        this.initializePostInteractions();
    }

    initializeNetworkPage() {
        // Network page specific initialization
        console.log('Network page initialized');
        
        // Initialize connection cards animations
        const connectionCards = document.querySelectorAll('.connection-card');
        connectionCards.forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('fade-in');
            }, index * 100);
        });
    }

    initializeJobsPage() {
        // Jobs page specific initialization
        console.log('Jobs page initialized');
        
        // Initialize job card animations
        const jobCards = document.querySelectorAll('.job-card');
        jobCards.forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('slide-up');
            }, index * 100);
        });
    }

    initializeProfilePage() {
        // Profile page specific initialization
        console.log('Profile page initialized');
        
        // Initialize skill progress bars animation
        this.animateSkillBars();
    }

    initializePostInteractions() {
        // Remove existing event listeners to prevent duplicates
        document.querySelectorAll('.like-btn').forEach(btn => {
            btn.removeEventListener('click', this.handleLikeClick);
        });

        // Add event listeners for post interactions
        document.querySelectorAll('.like-btn').forEach(btn => {
            btn.addEventListener('click', this.handleLikeClick);
        });
    }

    handleLikeClick = (e) => {
        const button = e.currentTarget;
        const countSpan = button.querySelector('.like-count');
        const icon = button.querySelector('i');
        
        if (button.classList.contains('liked')) {
            // Unlike
            button.classList.remove('liked');
            icon.className = 'far fa-thumbs-up me-1';
            const currentCount = parseInt(countSpan.textContent);
            countSpan.textContent = currentCount - 1;
        } else {
            // Like
            button.classList.add('liked');
            icon.className = 'fas fa-thumbs-up me-1';
            const currentCount = parseInt(countSpan.textContent);
            countSpan.textContent = currentCount + 1;
        }

        // Add animation
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
            button.style.transform = 'scale(1)';
        }, 150);
    }

    animateSkillBars() {
        const skillBars = document.querySelectorAll('.progress-bar');
        skillBars.forEach((bar, index) => {
            setTimeout(() => {
                const width = bar.style.width;
                bar.style.width = '0%';
                setTimeout(() => {
                    bar.style.width = width;
                    bar.style.transition = 'width 1s ease-in-out';
                }, 100);
            }, index * 200);
        });
    }

    getCurrentPage() {
        return this.currentPage;
    }

    // Public method to programmatically navigate
    navigateTo(pageId) {
        this.showPage(pageId);
    }
}

// Global navigation instance
let navigationManager;

// Initialize navigation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    navigationManager = new NavigationManager();
});

// Global function for external calls
function showPage(pageId) {
    if (navigationManager) {
        navigationManager.navigateTo(pageId);
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NavigationManager;
}
