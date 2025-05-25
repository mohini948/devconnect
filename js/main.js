/**
 * DevConnect Main Application
 * Handles interactive features and utilities
 */

class DevConnectApp {
    constructor() {
        this.isInitialized = false;
        this.notifications = [];
        this.searchCache = new Map();
        this.init();
    }

    init() {
        if (this.isInitialized) return;
        
        // Wait for DOM to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeApp());
        } else {
            this.initializeApp();
        }
    }

    initializeApp() {
        console.log('DevConnect App initializing...');
        
        // Initialize core features
        this.initializeInteractions();
        this.initializeSearch();
        this.initializeForms();
        this.initializeTooltips();
        this.initializeImageLoading();
        this.initializeTheme();
        
        // Set up periodic updates
        this.setupPeriodicUpdates();
        
        this.isInitialized = true;
        console.log('DevConnect App initialized successfully');
    }

    initializeInteractions() {
        // Like button functionality (enhanced)
        this.setupLikeButtons();
        
        // Comment functionality
        this.setupCommentButtons();
        
        // Share functionality
        this.setupShareButtons();
        
        // Connection requests
        this.setupConnectionButtons();
        
        // Follow/Unfollow functionality
        this.setupFollowButtons();
        
        // Save posts functionality
        this.setupSaveButtons();
    }

    setupLikeButtons() {
        document.addEventListener('click', (e) => {
            if (e.target.closest('.like-btn')) {
                e.preventDefault();
                const button = e.target.closest('.like-btn');
                this.toggleLike(button);
            }
        });
    }

    toggleLike(button) {
        if (!button) return;
        
        const countSpan = button.querySelector('.like-count');
        const icon = button.querySelector('i');
        const isLiked = button.classList.contains('liked');
        
        // Animate button
        button.style.transform = 'scale(0.9)';
        setTimeout(() => {
            button.style.transform = 'scale(1)';
        }, 100);
        
        if (isLiked) {
            // Unlike
            button.classList.remove('liked');
            button.classList.remove('btn-primary');
            button.classList.add('btn-outline-primary');
            icon.className = 'far fa-thumbs-up me-1';
            
            if (countSpan) {
                const currentCount = parseInt(countSpan.textContent) || 0;
                countSpan.textContent = Math.max(0, currentCount - 1);
            }
            
            this.showNotification('Post unliked', 'info');
        } else {
            // Like
            button.classList.add('liked');
            button.classList.remove('btn-outline-primary');
            button.classList.add('btn-primary');
            icon.className = 'fas fa-thumbs-up me-1';
            
            if (countSpan) {
                const currentCount = parseInt(countSpan.textContent) || 0;
                countSpan.textContent = currentCount + 1;
            }
            
            this.showNotification('Post liked!', 'success');
            
            // Add celebration effect
            this.addCelebrationEffect(button);
        }
    }

    setupCommentButtons() {
        document.addEventListener('click', (e) => {
            if (e.target.closest('.btn') && e.target.closest('.btn').textContent.includes('Comment')) {
                e.preventDefault();
                this.showNotification('Comment feature coming soon!', 'info');
            }
        });
    }

    setupShareButtons() {
        document.addEventListener('click', (e) => {
            if (e.target.closest('.btn') && e.target.closest('.btn').textContent.includes('Share')) {
                e.preventDefault();
                this.handleShare();
            }
        });
    }

    setupConnectionButtons() {
        document.addEventListener('click', (e) => {
            if (e.target.closest('.btn') && e.target.closest('.btn').textContent.includes('Connect')) {
                e.preventDefault();
                const button = e.target.closest('.btn');
                this.handleConnection(button);
            }
        });
    }

    setupFollowButtons() {
        document.addEventListener('click', (e) => {
            if (e.target.closest('.btn') && e.target.closest('.btn').textContent.includes('Follow')) {
                e.preventDefault();
                const button = e.target.closest('.btn');
                this.toggleFollow(button);
            }
        });
    }

    setupSaveButtons() {
        document.addEventListener('click', (e) => {
            if (e.target.closest('.btn') && e.target.closest('.btn').textContent.includes('Save')) {
                e.preventDefault();
                const button = e.target.closest('.btn');
                this.toggleSave(button);
            }
        });
    }

    handleConnection(button) {
        if (!button) return;
        
        // Animate button
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
            button.style.transform = 'scale(1)';
        }, 150);
        
        if (button.textContent.includes('Connect')) {
            button.innerHTML = '<i class="fas fa-clock me-1"></i>Pending';
            button.classList.remove('btn-primary');
            button.classList.add('btn-outline-secondary');
            button.disabled = true;
            
            this.showNotification('Connection request sent!', 'success');
        }
    }

    toggleFollow(button) {
        if (!button) return;
        
        const isFollowing = button.textContent.includes('Unfollow');
        
        if (isFollowing) {
            button.innerHTML = '<i class="fas fa-user-plus me-1"></i>Follow';
            button.classList.remove('btn-outline-secondary');
            button.classList.add('btn-primary');
            this.showNotification('Unfollowed successfully', 'info');
        } else {
            button.innerHTML = '<i class="fas fa-user-check me-1"></i>Unfollow';
            button.classList.remove('btn-primary');
            button.classList.add('btn-outline-secondary');
            this.showNotification('Now following!', 'success');
        }
    }

    toggleSave(button) {
        if (!button) return;
        
        const isSaved = button.classList.contains('saved');
        
        if (isSaved) {
            button.classList.remove('saved');
            button.innerHTML = '<i class="far fa-bookmark me-1"></i>Save';
            this.showNotification('Post removed from saved', 'info');
        } else {
            button.classList.add('saved');
            button.innerHTML = '<i class="fas fa-bookmark me-1"></i>Saved';
            this.showNotification('Post saved!', 'success');
        }
    }

    handleShare() {
        if (navigator.share) {
            navigator.share({
                title: 'DevConnect - Professional Developer Network',
                text: 'Check out this amazing developer network!',
                url: window.location.href
            }).then(() => {
                this.showNotification('Shared successfully!', 'success');
            }).catch(() => {
                this.fallbackShare();
            });
        } else {
            this.fallbackShare();
        }
    }

    fallbackShare() {
        // Copy URL to clipboard
        navigator.clipboard.writeText(window.location.href).then(() => {
            this.showNotification('Link copied to clipboard!', 'success');
        }).catch(() => {
            this.showNotification('Unable to share at this time', 'error');
        });
    }

    initializeSearch() {
        const searchInputs = document.querySelectorAll('input[placeholder*="Search"], input[placeholder*="search"]');
        
        searchInputs.forEach(input => {
            let searchTimeout;
            
            input.addEventListener('input', (e) => {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    this.performSearch(e.target.value, e.target);
                }, 300);
            });
        });
    }

    performSearch(query, inputElement) {
        if (!query || query.length < 2) return;
        
        // Simulate search functionality
        console.log(`Searching for: ${query}`);
        
        // Add search suggestions dropdown (simplified)
        this.showSearchSuggestions(inputElement, query);
    }

    showSearchSuggestions(inputElement, query) {
        // Remove existing suggestions
        const existingSuggestions = document.querySelector('.search-suggestions');
        if (existingSuggestions) {
            existingSuggestions.remove();
        }
        
        // Create suggestions dropdown
        const suggestions = document.createElement('div');
        suggestions.className = 'search-suggestions position-absolute bg-white border rounded shadow-sm';
        suggestions.style.cssText = 'top: 100%; left: 0; right: 0; z-index: 1000; max-height: 200px; overflow-y: auto;';
        
        // Add sample suggestions
        const sampleSuggestions = [
            'React Developer',
            'JavaScript',
            'Frontend Engineer',
            'Full Stack Developer',
            'Node.js',
            'Python Developer'
        ].filter(item => item.toLowerCase().includes(query.toLowerCase()));
        
        if (sampleSuggestions.length > 0) {
            sampleSuggestions.forEach(suggestion => {
                const item = document.createElement('div');
                item.className = 'p-2 border-bottom cursor-pointer';
                item.style.cursor = 'pointer';
                item.textContent = suggestion;
                
                item.addEventListener('click', () => {
                    inputElement.value = suggestion;
                    suggestions.remove();
                    this.showNotification(`Searching for: ${suggestion}`, 'info');
                });
                
                item.addEventListener('mouseenter', () => {
                    item.style.backgroundColor = '#f8f9fa';
                });
                
                item.addEventListener('mouseleave', () => {
                    item.style.backgroundColor = 'white';
                });
                
                suggestions.appendChild(item);
            });
            
            // Position suggestions
            const inputContainer = inputElement.parentElement;
            inputContainer.style.position = 'relative';
            inputContainer.appendChild(suggestions);
            
            // Remove suggestions when clicking outside
            setTimeout(() => {
                document.addEventListener('click', function removeSuggestions(e) {
                    if (!inputContainer.contains(e.target)) {
                        suggestions.remove();
                        document.removeEventListener('click', removeSuggestions);
                    }
                }, { once: true });
            }, 100);
        }
    }

    initializeForms() {
        // Form validation and submission
        const forms = document.querySelectorAll('form');
        
        forms.forEach(form => {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFormSubmission(form);
            });
        });
        
        // Textarea auto-resize
        const textareas = document.querySelectorAll('textarea');
        textareas.forEach(textarea => {
            textarea.addEventListener('input', () => {
                this.autoResizeTextarea(textarea);
            });
        });

        // Initialize auth forms
        this.initializeAuthForms();
    }

    initializeAuthForms() {
        // Login form handling
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin(loginForm);
            });
        }

        // Signup form handling
        const signupForm = document.getElementById('signupForm');
        if (signupForm) {
            signupForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleSignup(signupForm);
            });
        }

        // Password confirmation validation
        const confirmPassword = document.getElementById('confirmPassword');
        const signupPassword = document.getElementById('signupPassword');
        
        if (confirmPassword && signupPassword) {
            confirmPassword.addEventListener('input', () => {
                this.validatePasswordMatch(signupPassword.value, confirmPassword.value);
            });
        }
    }

    handleLogin(form) {
        const formData = new FormData(form);
        const email = formData.get('loginEmail') || formData.get('email');
        const password = formData.get('loginPassword') || formData.get('password');

        if (!email || !password) {
            this.showNotification('Please fill in all required fields', 'error');
            return;
        }

        // Show loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Logging in...';
        submitBtn.disabled = true;

        // Simulate login process
        setTimeout(() => {
            // Reset button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;

            // Close modal and show success
            const modal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
            if (modal) modal.hide();
            
            this.showNotification(`Welcome back! Logged in as ${email}`, 'success');
            
            // Navigate to feed page
            setTimeout(() => {
                showPage('feed');
            }, 1500);
        }, 2000);
    }

    handleSignup(form) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        // Validate required fields
        const requiredFields = ['firstName', 'lastName', 'signupEmail', 'jobTitle', 'experience', 'primarySkills', 'signupPassword', 'confirmPassword'];
        const missingFields = requiredFields.filter(field => !data[field]);

        if (missingFields.length > 0) {
            this.showNotification('Please fill in all required fields', 'error');
            return;
        }

        // Validate password match
        if (data.signupPassword !== data.confirmPassword) {
            this.showNotification('Passwords do not match', 'error');
            return;
        }

        // Validate terms agreement
        if (!data.agreeTerms) {
            this.showNotification('Please agree to the terms and conditions', 'error');
            return;
        }

        // Show loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Creating Account...';
        submitBtn.disabled = true;

        // Simulate signup process
        setTimeout(() => {
            // Reset button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;

            // Close modal and show success
            const modal = bootstrap.Modal.getInstance(document.getElementById('signupModal'));
            if (modal) modal.hide();
            
            this.showNotification(`Welcome to DevConnect, ${data.firstName}! Your account has been created.`, 'success');
            
            // Navigate to profile page
            setTimeout(() => {
                showPage('profile');
            }, 1500);
        }, 2500);
    }

    validatePasswordMatch(password, confirmPassword) {
        const confirmField = document.getElementById('confirmPassword');
        
        if (confirmPassword && password !== confirmPassword) {
            confirmField.classList.add('is-invalid');
            if (!confirmField.nextElementSibling || !confirmField.nextElementSibling.classList.contains('invalid-feedback')) {
                const feedback = document.createElement('div');
                feedback.className = 'invalid-feedback';
                feedback.textContent = 'Passwords do not match';
                confirmField.parentNode.insertBefore(feedback, confirmField.nextSibling);
            }
        } else {
            confirmField.classList.remove('is-invalid');
            const feedback = confirmField.parentNode.querySelector('.invalid-feedback');
            if (feedback) feedback.remove();
        }
    }

    handleFormSubmission(form) {
        // Handle other forms (not login/signup)
        if (form.id === 'loginForm' || form.id === 'signupForm') {
            return; // These are handled by specific methods
        }

        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        console.log('Form submitted:', data);
        this.showNotification('Form submitted successfully!', 'success');
        
        // Reset form
        form.reset();
    }

    autoResizeTextarea(textarea) {
        textarea.style.height = 'auto';
        textarea.style.height = textarea.scrollHeight + 'px';
    }

    initializeTooltips() {
        // Initialize Bootstrap tooltips
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });
    }

    initializeImageLoading() {
        // Lazy loading for images
        const images = document.querySelectorAll('img[data-src]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });
            
            images.forEach(img => imageObserver.observe(img));
        } else {
            // Fallback for browsers without IntersectionObserver
            images.forEach(img => {
                img.src = img.dataset.src;
            });
        }
        
        // Image error handling
        document.addEventListener('error', (e) => {
            if (e.target.tagName === 'IMG') {
                e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" fill="%23f8f9fa"/><text x="50" y="50" text-anchor="middle" dy=".3em" fill="%236c757d">Image</text></svg>';
            }
        }, true);
    }

    initializeTheme() {
        // Theme switching (if needed in future)
        const savedTheme = localStorage.getItem('devconnect-theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
    }

    addCelebrationEffect(element) {
        // Create celebration particles
        for (let i = 0; i < 6; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: fixed;
                width: 6px;
                height: 6px;
                background: #0066ff;
                border-radius: 50%;
                pointer-events: none;
                z-index: 9999;
                animation: celebrate 0.6s ease-out forwards;
            `;
            
            const rect = element.getBoundingClientRect();
            const x = rect.left + rect.width / 2;
            const y = rect.top + rect.height / 2;
            
            particle.style.left = x + 'px';
            particle.style.top = y + 'px';
            
            // Random direction
            const angle = (i * 60) * Math.PI / 180;
            const distance = 30 + Math.random() * 20;
            const endX = x + Math.cos(angle) * distance;
            const endY = y + Math.sin(angle) * distance;
            
            particle.style.setProperty('--end-x', endX + 'px');
            particle.style.setProperty('--end-y', endY + 'px');
            
            document.body.appendChild(particle);
            
            setTimeout(() => {
                particle.remove();
            }, 600);
        }
        
        // Add CSS animation if not exists
        if (!document.getElementById('celebration-styles')) {
            const style = document.createElement('style');
            style.id = 'celebration-styles';
            style.textContent = `
                @keyframes celebrate {
                    0% {
                        transform: translate(0, 0) scale(1);
                        opacity: 1;
                    }
                    100% {
                        transform: translate(calc(var(--end-x) - 50vw), calc(var(--end-y) - 50vh)) scale(0);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `alert alert-${type === 'error' ? 'danger' : type} alert-dismissible fade show position-fixed`;
        notification.style.cssText = 'top: 80px; right: 20px; z-index: 9999; min-width: 300px;';
        
        notification.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        document.body.appendChild(notification);
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 3000);
        
        // Add to notifications array
        this.notifications.push({
            message,
            type,
            timestamp: new Date()
        });
        
        // Keep only last 10 notifications
        if (this.notifications.length > 10) {
            this.notifications = this.notifications.slice(-10);
        }
    }

    setupPeriodicUpdates() {
        // Simulate real-time updates
        setInterval(() => {
            this.updateOnlineStatus();
        }, 30000); // Every 30 seconds
        
        // Update timestamps
        setInterval(() => {
            this.updateTimestamps();
        }, 60000); // Every minute
    }

    updateOnlineStatus() {
        // Simulate online status updates
        const statusIndicators = document.querySelectorAll('.online-status');
        statusIndicators.forEach(indicator => {
            // Randomly update status
            if (Math.random() > 0.8) {
                indicator.classList.toggle('online');
            }
        });
    }

    updateTimestamps() {
        // Update relative timestamps
        const timestamps = document.querySelectorAll('[data-timestamp]');
        timestamps.forEach(element => {
            const timestamp = new Date(element.dataset.timestamp);
            element.textContent = this.getRelativeTime(timestamp);
        });
    }

    getRelativeTime(date) {
        const now = new Date();
        const diff = now - date;
        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        
        if (days > 0) return `${days}d ago`;
        if (hours > 0) return `${hours}h ago`;
        if (minutes > 0) return `${minutes}m ago`;
        return 'Just now';
    }

    // Utility methods
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // Public API methods
    getNotifications() {
        return [...this.notifications];
    }

    clearNotifications() {
        this.notifications = [];
    }

    isReady() {
        return this.isInitialized;
    }
}

// Global app instance
let devConnectApp;

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    devConnectApp = new DevConnectApp();
});

// Global utility functions
function toggleLike(button) {
    if (devConnectApp) {
        devConnectApp.toggleLike(button);
    }
}

function showNotification(message, type = 'info') {
    if (devConnectApp) {
        devConnectApp.showNotification(message, type);
    }
}

function togglePassword(passwordFieldId) {
    const passwordField = document.getElementById(passwordFieldId);
    const toggleButton = passwordField.parentNode.querySelector('button');
    const icon = toggleButton.querySelector('i');
    
    if (passwordField.type === 'password') {
        passwordField.type = 'text';
        icon.className = 'fas fa-eye-slash';
    } else {
        passwordField.type = 'password';
        icon.className = 'fas fa-eye';
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DevConnectApp;
}
