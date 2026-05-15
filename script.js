/**
 * Windows Phone Store (2013) - Complete JavaScript Behaviors
 * Includes: Dropdown menus, search suggestions, animations, hover effects
 */

(function() {
    'use strict';

    // ============================================
    // DOM Ready
    // ============================================
    document.addEventListener('DOMContentLoaded', function() {
        initUserAreaDropdown();
        initSearchSuggestions();
        initSpotlightAnimations();
        initRatingHoverEffects();
        initFeedbackDialog();
        initPromoModules();
        initNavigationHighlight();
    });

    // ============================================
    // User Area Dropdown Menu
    // ============================================
    function initUserAreaDropdown() {
        const explore = document.getElementById('explore');
        const dropmenu = document.querySelector('#userArea .dropmenu');
        
        if (!explore || !dropmenu) return;
        
        let isOpen = false;
        let timeoutId = null;
        
        function openMenu() {
            if (timeoutId) clearTimeout(timeoutId);
            dropmenu.classList.add('visible');
            isOpen = true;
        }
        
        function closeMenu() {
            timeoutId = setTimeout(function() {
                dropmenu.classList.remove('visible');
                isOpen = false;
            }, 300);
        }
        
        explore.addEventListener('mouseenter', openMenu);
        explore.addEventListener('mouseleave', closeMenu);
        dropmenu.addEventListener('mouseenter', openMenu);
        dropmenu.addEventListener('mouseleave', closeMenu);
        
        // Toggle on click for mobile/touch
        explore.addEventListener('click', function(e) {
            e.preventDefault();
            if (isOpen) {
                dropmenu.classList.remove('visible');
                isOpen = false;
            } else {
                dropmenu.classList.add('visible');
                isOpen = true;
            }
        });
    }

    // ============================================
    // Search Suggestions (simulated)
    // ============================================
    function initSearchSuggestions() {
        const searchInput = document.getElementById('searchInput');
        if (!searchInput) return;
        
        const suggestions = ['angry birds', 'facebook', 'twitter', 'whatsapp', 'instagram', 'spotify', 'netflix', 'youtube'];
        let suggestionBox = null;
        
        // Create suggestion box
        suggestionBox = document.createElement('div');
        suggestionBox.className = 'searchSuggestions';
        suggestionBox.style.cssText = 'position:absolute; background:#fff; border:1px solid #eee; display:none; width:228px; z-index:160;';
        searchInput.parentNode.style.position = 'relative';
        searchInput.parentNode.appendChild(suggestionBox);
        
        searchInput.addEventListener('input', function() {
            const query = this.value.toLowerCase();
            if (query.length < 2) {
                suggestionBox.style.display = 'none';
                return;
            }
            
            const matches = suggestions.filter(function(s) {
                return s.indexOf(query) !== -1;
            }).slice(0, 5);
            
            if (matches.length === 0) {
                suggestionBox.style.display = 'none';
                return;
            }
            
            suggestionBox.innerHTML = '<ul>' + matches.map(function(m) {
                return '<li style="padding:5px; cursor:pointer;">' + m + '</li>';
            }).join('') + '</ul>';
            suggestionBox.style.display = 'block';
            
            // Add click handlers
            suggestionBox.querySelectorAll('li').forEach(function(li) {
                li.addEventListener('click', function() {
                    searchInput.value = this.textContent;
                    suggestionBox.style.display = 'none';
                    searchInput.parentNode.querySelector('form').submit();
                });
            });
        });
        
        document.addEventListener('click', function(e) {
            if (e.target !== searchInput && !suggestionBox.contains(e.target)) {
                suggestionBox.style.display = 'none';
            }
        });
        
        // Placeholder text
        searchInput.placeholder = 'Search apps and how-to';
    }

    // ============================================
    // Spotlight Tile Animations
    // ============================================
    function initSpotlightAnimations() {
        const tiles = document.querySelectorAll('.appContainer');
        
        tiles.forEach(function(tile) {
            tile.addEventListener('mouseenter', function() {
                this.style.transition = 'transform 0.2s ease';
                this.style.transform = 'scale(1.02)';
            });
            
            tile.addEventListener('mouseleave', function() {
                this.style.transform = 'scale(1)';
            });
        });
    }

    // ============================================
    // Rating Stars Hover Effects
    // ============================================
    function initRatingHoverEffects() {
        const ratings = document.querySelectorAll('.ratingLandingLarge, .ratingLandingXXLarge');
        
        ratings.forEach(function(rating) {
            rating.addEventListener('mouseenter', function() {
                this.style.opacity = '0.8';
                this.style.cursor = 'pointer';
            });
            
            rating.addEventListener('mouseleave', function() {
                this.style.opacity = '1';
            });
            
            rating.addEventListener('click', function() {
                console.log('Rating clicked - would show rating modal');
                // In original, this would open a rating dialog
            });
        });
    }

    // ============================================
    // Feedback Dialog (simulated)
    // ============================================
    function initFeedbackDialog() {
        const feedbackLink = document.getElementById('feedbackLink');
        if (!feedbackLink) return;
        
        let dialog = null;
        
        function createDialog() {
            dialog = document.createElement('div');
            dialog.className = 'ui-dialog ui-widget ui-widget-content ui-corner-all';
            dialog.style.cssText = 'position:fixed; background:#fff; border:1px solid #d6d6d6; padding:15px 30px; width:650px; top:24%; left:50%; margin-left:-325px; z-index:10000; display:none;';
            
            dialog.innerHTML = `
                <div class="ui-dialog-titlebar" style="display:none;"></div>
                <div id="feedbackContentDiv">
                    <h2>Send Feedback</h2>
                    <textarea rows="5" style="width:100%; margin:10px 0; padding:8px;"></textarea>
                    <button class="button3" id="feedbackSubmit">Submit</button>
                    <button class="button4" id="feedbackCancel">Cancel</button>
                </div>
                <div id="feedbackCloseButton" style="position:absolute; top:-35px; right:0; cursor:pointer;">✕</div>
            `;
            
            document.body.appendChild(dialog);
            
            document.getElementById('feedbackCancel').addEventListener('click', closeDialog);
            document.getElementById('feedbackCloseButton').addEventListener('click', closeDialog);
            document.getElementById('feedbackSubmit').addEventListener('click', function() {
                alert('Thank you for your feedback!');
                closeDialog();
            });
        }
        
        function closeDialog() {
            if (dialog) dialog.style.display = 'none';
            document.body.style.overflow = '';
        }
        
        feedbackLink.addEventListener('click', function(e) {
            e.preventDefault();
            if (!dialog) createDialog();
            dialog.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });
        
        // Close on overlay click
        document.addEventListener('click', function(e) {
            if (dialog && dialog.style.display === 'block' && !dialog.contains(e.target) && e.target !== feedbackLink) {
                closeDialog();
            }
        });
    }

    // ============================================
    // Promo Modules Hover Effects
    // ============================================
    function initPromoModules() {
        const modules = document.querySelectorAll('#promoModules li');
        
        modules.forEach(function(module) {
            const img = module.querySelector('.promoImg');
            if (img) {
                module.addEventListener('mouseenter', function() {
                    img.style.transition = 'opacity 0.2s ease';
                    img.style.opacity = '0.85';
                });
                
                module.addEventListener('mouseleave', function() {
                    img.style.opacity = '1';
                });
            }
        });
    }

    // ============================================
    // Navigation Highlight
    // ============================================
    function initNavigationHighlight() {
        const currentPath = window.location.pathname;
        const navLinks = {
            'store': document.getElementById('store_landing'),
            'apps': document.getElementById('store_apps'),
            'games': document.getElementById('store_games')
        };
        
        // Highlight current section (simulated)
        if (navLinks.store) {
            navLinks.store.style.color = '#9B4F96';
        }
    }

    // ============================================
    // Additional Behaviors from original site
    // ============================================
    
    // Simulate "Explore" phone selection
    const phoneImages = ['default_phone_mango.png', 'phone_lumia.png', 'phone_samsung.png'];
    let phoneIndex = 0;
    
    function rotatePhoneImage() {
        const phoneImg = document.querySelector('#explore .phone');
        if (!phoneImg) return;
        
        phoneIndex = (phoneIndex + 1) % phoneImages.length;
        // In original, this would change based on connected phone
        // phoneImg.src = 'images/' + phoneImages[phoneIndex];
    }
    
    setInterval(rotatePhoneImage, 5000);
    
    // Track clicks for analytics (simulated)
    function trackClick(category, action, label) {
        console.log(`[Analytics] ${category} | ${action} | ${label}`);
        // In original, this would send to Microsoft analytics
    }
    
    // Add click tracking to all links
    document.addEventListener('click', function(e) {
        let target = e.target;
        while (target && target.tagName !== 'A') {
            target = target.parentElement;
        }
        
        if (target && target.href) {
            const text = target.innerText || target.querySelector('span')?.innerText || '';
            trackClick('Navigation', 'Click', text.substring(0, 100));
        }
    });
    
    // Simulate "Connected Phone" feature
    function updateConnectedPhone() {
        const exploreTitle = document.querySelector('#exploreTitle');
        const exploreDiv = document.querySelector('#explore > a > div > span');
        
        if (exploreTitle && exploreDiv) {
            // Simulate that a phone is connected
            // exploreTitle.innerText = 'Nokia Lumia 920';
            // exploreDiv.innerText = 'Connected';
        }
    }
    
    // Initialize everything
    console.log('Windows Phone Store (2013) - Fully restored');
})();