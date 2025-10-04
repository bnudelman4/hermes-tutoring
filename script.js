// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    // Add smooth scrolling to all anchor links
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Mobile menu toggle (for responsive design)
    const nav = document.querySelector('.nav');
    const header = document.querySelector('.header');
    
    // Add mobile menu functionality if needed
    if (window.innerWidth <= 768) {
        // Mobile-specific functionality can be added here
        console.log('Mobile view detected');
    }

    // Form validation and submission
    const contactForm = document.querySelector('form[name="contact"]');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            // Basic form validation
            const requiredFields = this.querySelectorAll('[required]');
            let isValid = true;
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.style.borderColor = '#ff6b35';
                } else {
                    field.style.borderColor = '#e9ecef';
                }
            });
            
            if (!isValid) {
                e.preventDefault();
                alert('Please fill in all required fields.');
            }
        });
    }

    // Add hover effects to service cards
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Add click tracking for CTA buttons
    const ctaButtons = document.querySelectorAll('.cta-button, .service-button');
    ctaButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Track button clicks (can be integrated with analytics)
            console.log('CTA button clicked:', this.textContent);
        });
    });

    // Pause testimonials scroll on hover
    const testimonialsScroll = document.querySelector('.testimonials-scroll');
    if (testimonialsScroll) {
        testimonialsScroll.addEventListener('mouseenter', function() {
            this.style.animationPlayState = 'paused';
        });
        
        testimonialsScroll.addEventListener('mouseleave', function() {
            this.style.animationPlayState = 'running';
        });
    }

    // Add loading animation for form submission
    const submitButton = document.querySelector('.submit-button');
    if (submitButton) {
        submitButton.addEventListener('click', function() {
            const originalText = this.textContent;
            this.textContent = 'Sending...';
            this.disabled = true;
            
            // Re-enable button after 3 seconds (in case of form errors)
            setTimeout(() => {
                this.textContent = originalText;
                this.disabled = false;
            }, 3000);
        });
    }
});

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            
            // Add animation class for service showcase cards
            if (entry.target.classList.contains('service-showcase-card')) {
                entry.target.classList.add('animate');
            }
        }
    });
}, observerOptions);

// Observe elements for scroll animations
document.addEventListener('DOMContentLoaded', function() {
    const animatedElements = document.querySelectorAll('.service-card, .tutor-card, .testimonial-card, .service-image, .contact-item, .form-group-new, .guarantee-content, .description-text, .section-title, .service-showcase-card, .intro-text, .showcase-content, .service-package');
    animatedElements.forEach((el, index) => {
        // Only hide elements that aren't service packages, as they should be visible by default
        if (!el.classList.contains('service-package')) {
            el.style.opacity = '0';
            el.style.transform = 'translateY(40px)';
        }
        el.style.transition = `opacity 0.5s ease ${index * 0.05}s, transform 0.5s ease ${index * 0.05}s`;
        observer.observe(el);
    });

        // Shopping Cart Functionality
        // Check if this is a hard reload (Ctrl+F5, Cmd+Shift+R, or browser refresh)
        const isHardReload = performance.navigation.type === performance.navigation.TYPE_RELOAD ||
                           performance.getEntriesByType('navigation')[0]?.type === 'reload';
        
        if (isHardReload) {
            console.log('Hard reload detected, clearing cart');
            localStorage.removeItem('hermesCart');
            localStorage.removeItem('hermesCartCount');
        }
        
        let cart = JSON.parse(localStorage.getItem('hermesCart')) || [];
        let cartCount = parseInt(localStorage.getItem('hermesCartCount')) || 0;
        
        console.log('Loaded cart from localStorage:', cart);
        console.log('Cart items types:', cart.map(item => ({
            name: item.name,
            price: typeof item.price,
            quantity: typeof item.quantity
        })));
        
        // Ensure cart count is accurate on load
        const actualCount = cart.reduce((total, item) => total + item.quantity, 0);
        if (cartCount !== actualCount) {
            console.log('Cart count mismatch detected. Stored:', cartCount, 'Actual:', actualCount);
            cartCount = actualCount;
        }

    // Get DOM elements first
    const cartIcon = document.getElementById('cartIcon');
    const cartPopup = document.getElementById('cartPopup');
    const cartCountElement = document.getElementById('cartCount');
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    const closeCart = document.getElementById('closeCart');

    // Buy now popup elements
    const buyNowPopup = document.getElementById('buyNowPopup');
    const buyNowItem = document.getElementById('buyNowItem');
    const buyNowTotal = document.getElementById('buyNowTotal');
    const closeBuyNow = document.getElementById('closeBuyNow');
    const completePurchaseBtn = document.getElementById('completePurchaseBtn');

    // Initialize cart display on page load
    if (cartCountElement) {
        updateCartCount();
        updateCartDisplay();
    }

    // Service type selection popup elements
    const serviceTypePopup = document.getElementById('serviceTypePopup');
    const closeServiceType = document.getElementById('closeServiceType');
    const cancelServiceType = document.getElementById('cancelServiceType');
    const virtualPrice = document.getElementById('virtualPrice');
    const inPersonPrice = document.getElementById('inPersonPrice');
    const virtualBtn = document.querySelector('.virtual-btn');
    const inPersonBtn = document.querySelector('.in-person-btn');

    // In-person pricing data (virtual price + $15/hour increase)
    const inPersonPricing = {
        'elite': { price: 3749.99, hourly: '$75/hour' }, // 50 hours × $75 = $3,750 → $3,749.99
        'sat-act-elite': { price: 3119.99, hourly: '$78/hour' }, // 40 hours × $78 = $3,120 → $3,119.99
        'college-readiness': { price: 1349.99, hourly: '$90/hour' }, // 15 hours × $90 = $1,350 → $1,349.99
        'standard': { price: 1699.99, hourly: '$85/hour' }, // 20 hours × $85 = $1,700 → $1,699.99
        'starter': { price: 439.99, hourly: '$88/hour' }, // 5 hours × $88 = $440 → $439.99
        'individual': { price: 89.95, hourly: '$89.95/hour' }, // $74.95 + $15 = $89.95
        'college-individual': { price: 109.95, hourly: '$109.95/hour' } // $94.95 + $15 = $109.95
    };

    // Store pending cart item
    let pendingCartItem = null;

    // Show service type popup
    function showServiceTypePopup(packageId, name, virtualPriceValue, action = null) {
        // Preserve existing action if provided, otherwise create new item
        if (pendingCartItem && action === null) {
            // Preserve the existing action from pendingCartItem
            pendingCartItem = { ...pendingCartItem, packageId, name, virtualPrice: virtualPriceValue };
        } else {
            // Create new item with specified action
            pendingCartItem = { packageId, name, virtualPrice: virtualPriceValue, action };
        }
        
        // Update popup with pricing
        virtualPrice.textContent = `$${virtualPriceValue.toFixed(2)}`;
        const inPersonData = inPersonPricing[packageId];
        if (inPersonData) {
            inPersonPrice.textContent = `$${inPersonData.price.toFixed(2)}`;
        }
        
        // Hide discount popup if it's showing
        if (discountPopup && discountPopup.classList.contains('show')) {
            discountPopup.classList.remove('show');
        }
        
        serviceTypePopup.classList.add('show');
    }

    // Hide service type popup
    function hideServiceTypePopup() {
        serviceTypePopup.classList.remove('show');
        pendingCartItem = null;
    }

    // Add to cart with service type
    function addToCartWithType(serviceType) {
        if (!pendingCartItem) return;
        
        const { packageId, name, virtualPrice } = pendingCartItem;
        let finalPrice = virtualPrice;
        let displayName = name;
        
        // Create unique ID that includes service type
        const uniqueId = `${packageId}-${serviceType}`;
        
        if (serviceType === 'in-person') {
            const inPersonData = inPersonPricing[packageId];
            if (inPersonData) {
                finalPrice = inPersonData.price;
                displayName = `${name} (In-Person)`;
            }
        } else {
            displayName = `${name} (Virtual)`;
        }
        
        addToCart(uniqueId, displayName, finalPrice);
        hideServiceTypePopup();
    }

    // Service type popup event listeners
    if (closeServiceType) {
        closeServiceType.addEventListener('click', hideServiceTypePopup);
    }
    
    if (cancelServiceType) {
        cancelServiceType.addEventListener('click', hideServiceTypePopup);
    }

    // Close popup when clicking outside
    if (serviceTypePopup) {
        serviceTypePopup.addEventListener('click', function(e) {
            if (e.target === serviceTypePopup) {
                hideServiceTypePopup();
            }
        });
    }

    // Add to cart button handlers
    const addToCartBtns = document.querySelectorAll('.add-to-cart-btn');
    console.log('Found add to cart buttons:', addToCartBtns.length);
    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Add to cart clicked');
            const packageId = this.getAttribute('data-package');
            const price = parseFloat(this.getAttribute('data-price'));
            const name = this.getAttribute('data-name');
            
            console.log('Adding to cart:', packageId, name, price);
            try {
                showServiceTypePopup(packageId, name, price, null);
            } catch (error) {
                console.error('Error showing service type popup:', error);
            }
        });
    });

    // Buy now with service type
    function buyNowWithType(serviceType) {
        if (!pendingCartItem) return;
        
        const { packageId, name, virtualPrice } = pendingCartItem;
        let finalPrice = virtualPrice;
        let displayName = name;
        
        // Create unique ID that includes service type
        const uniqueId = `${packageId}-${serviceType}`;
        
        if (serviceType === 'in-person') {
            const inPersonData = inPersonPricing[packageId];
            if (inPersonData) {
                finalPrice = inPersonData.price;
                displayName = `${name} (In-Person)`;
            }
        } else {
            displayName = `${name} (Virtual)`;
        }
        
        showBuyNowPopup(uniqueId, displayName, finalPrice);
        hideServiceTypePopup();
    }

    // Update service type buttons for buy now
    if (virtualBtn) {
        virtualBtn.addEventListener('click', () => {
            if (pendingCartItem && pendingCartItem.action === 'buy-now') {
                buyNowWithType('virtual');
            } else {
                addToCartWithType('virtual');
            }
        });
    }
    
    if (inPersonBtn) {
        inPersonBtn.addEventListener('click', () => {
            if (pendingCartItem && pendingCartItem.action === 'buy-now') {
                buyNowWithType('in-person');
            } else {
                addToCartWithType('in-person');
            }
        });
    }

    // Buy now button handlers
    const buyNowBtns = document.querySelectorAll('.buy-now-btn');
    console.log('Found buy now buttons:', buyNowBtns.length);
    buyNowBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Buy now clicked');
            const packageId = this.getAttribute('data-package');
            const price = parseFloat(this.getAttribute('data-price'));
            const name = this.getAttribute('data-name');
            
            console.log('Buy now:', packageId, name, price);
            try {
                showServiceTypePopup(packageId, name, price, 'buy-now');
            } catch (error) {
                console.error('Error showing service type popup for buy now:', error);
            }
        });
    });

    // Cart icon click handler
    if (cartIcon && cartPopup) {
        cartIcon.addEventListener('click', function() {
            cartPopup.classList.add('show');
            updateCartDisplay();
            
            // Hide discount popup if it's showing when cart opens
            if (discountPopup && discountPopup.classList.contains('show')) {
                discountPopup.classList.remove('show');
            }
        });
    }

    // Close cart popup
    if (closeCart && cartPopup) {
        closeCart.addEventListener('click', function() {
            cartPopup.classList.remove('show');
        });
    }

    // Close buy now popup
    if (closeBuyNow && buyNowPopup) {
        closeBuyNow.addEventListener('click', function() {
            buyNowPopup.classList.remove('show');
        });
    }

    // Complete purchase handler
    if (completePurchaseBtn && buyNowPopup) {
        completePurchaseBtn.addEventListener('click', function() {
            const buyNowItem = document.querySelector('#buyNowItem .item-details');
            if (buyNowItem) {
                const packageName = buyNowItem.querySelector('h4').textContent;
                const price = parseFloat(buyNowItem.querySelector('.item-price').textContent.replace('$', '').replace(',', ''));
                
                // Mark that user has made a purchase to prevent popup
                localStorage.setItem('hermesHasPurchased', 'true');
                
                const singleItem = [{
                    id: Date.now().toString(),
                    name: packageName,
                    price: price,
                    quantity: 1
                }];
                
                initiateStripeCheckout(singleItem);
                buyNowPopup.classList.remove('show');
            }
        });
    }

    // Stripe configuration
    const STRIPE_PUBLISHABLE_KEY = 'pk_live_51S98k6DeNDEl0L4PlVBeDcHIhLFhW3Q4nLOnCCYVaNO6e3J5ZRn9yRXDSbd5NSURiDeZJY7d783PK7oTlGssibx800AWTmgtM3'; // Live Stripe publishable key
    let stripe;
    
    // Initialize Stripe when available
    function initializeStripe() {
        if (typeof Stripe !== 'undefined') {
            stripe = Stripe(STRIPE_PUBLISHABLE_KEY);
            console.log('Stripe initialized successfully');
        } else {
            // Retry after a short delay if Stripe isn't loaded yet
            setTimeout(initializeStripe, 100);
        }
    }
    
    // Start initialization
    initializeStripe();

    // Checkout handler
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            console.log('Cart checkout button clicked');
            console.log('Current cart:', cart);
            console.log('Cart length:', cart.length);
            
            if (cart.length === 0) {
                alert('Your cart is empty!');
                return;
            }
            
            // Mark that user has made a purchase to prevent popup
            localStorage.setItem('hermesHasPurchased', 'true');
            
            console.log('Calling initiateStripeCheckout with cart:', cart);
            initiateStripeCheckout(cart);
            cartPopup.classList.remove('show');
        });
    }


    function initiateStripeCheckout(items) {
        console.log('initiateStripeCheckout called with items:', items);
        
        // Calculate total
        const total = items.reduce((sum, item) => {
            const itemTotal = Math.round((item.price * item.quantity) * 100) / 100;
            return Math.round((sum + itemTotal) * 100) / 100;
        }, 0);
        
        console.log('Calculated total:', total);
        
        // Create line items for Stripe
        const lineItems = items.map(item => {
            console.log('Processing item:', item);
            console.log('Item price type:', typeof item.price, 'Value:', item.price);
            console.log('Item quantity type:', typeof item.quantity, 'Value:', item.quantity);
            
            // Ensure price is a number
            const price = parseFloat(item.price);
            const quantity = parseInt(item.quantity);
            
            if (isNaN(price) || isNaN(quantity)) {
                console.error('Invalid price or quantity:', { price: item.price, quantity: item.quantity });
                throw new Error(`Invalid price or quantity: price=${item.price}, quantity=${item.quantity}`);
            }
            
            return {
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: item.name,
                    },
                    unit_amount: Math.round(price * 100), // Stripe expects cents, ensure it's an integer
                },
                quantity: quantity,
            };
        });

        console.log('Created line items for Stripe:', lineItems);
        
        // This is where you would call your backend to create a Stripe checkout session
        createStripeCheckoutSession(lineItems);
    }

    async function createStripeCheckoutSession(lineItems) {
        try {
            // Save purchase data to localStorage before checkout
            const purchaseData = {
                items: lineItems.map(item => ({
                    name: item.price_data.product_data.name,
                    price: item.price_data.unit_amount / 100, // Convert from cents
                    quantity: item.quantity
                })),
                timestamp: new Date().toISOString()
            };
            localStorage.setItem('hermesPurchaseData', JSON.stringify(purchaseData));
            console.log('Saved purchase data:', purchaseData);
            
            // Determine the API URL based on environment
            const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
            const apiUrl = isLocal 
                ? 'http://localhost:3000/create-checkout-session'
                : '/.netlify/functions/create-checkout-session';
            
            console.log('Environment check:', { 
                hostname: window.location.hostname, 
                isLocal, 
                apiUrl 
            });
            
            // Call your backend API to create a Stripe checkout session
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ items: lineItems }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const session = await response.json();
            console.log('Received session from backend:', session);
            
            // Get sessionId from either format (local backend uses 'id', Netlify uses 'sessionId')
            const sessionId = session.sessionId || session.id;
            console.log('Using sessionId:', sessionId);
            
            if (!sessionId) {
                throw new Error('No session ID received from backend');
            }
            
            // Redirect to Stripe checkout
            if (stripe) {
                const result = await stripe.redirectToCheckout({
                    sessionId: sessionId,
                });
                
                if (result.error) {
                    alert(result.error.message);
                }
            } else {
                alert('Stripe is not loaded. Please refresh the page and try again.');
            }
            
        } catch (error) {
            console.error('Error creating checkout session:', error);
            console.error('Full error details:', {
                message: error.message,
                stack: error.stack,
                hostname: window.location.hostname
            });
            alert(`There was an error processing your request: ${error.message}. Check console for details.`);
        }
    }

    // Close popups when clicking outside
    if (cartPopup) {
        cartPopup.addEventListener('click', function(e) {
            if (e.target === cartPopup) {
                cartPopup.classList.remove('show');
            }
        });
    }

    if (buyNowPopup) {
        buyNowPopup.addEventListener('click', function(e) {
            if (e.target === buyNowPopup) {
                buyNowPopup.classList.remove('show');
            }
        });
    }

    function addToCart(packageId, name, price) {
        console.log('addToCart called with:', { packageId, name, price, priceType: typeof price });
        
        // Ensure price is a number
        const numericPrice = parseFloat(price);
        if (isNaN(numericPrice)) {
            console.error('Invalid price passed to addToCart:', price);
            return;
        }
        
        const existingItem = cart.find(item => item.id === packageId);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                id: packageId,
                name: name,
                price: numericPrice, // Store as number
                quantity: 1
            });
        }
        
        cartCount++;
        updateCartCount();
        updateCartDisplay();
        saveCartToStorage();
        showCartNotification();
    }

    function showBuyNowPopup(packageId, name, price) {
        // Format price to ensure it shows decimal places
        const formattedPrice = price.toFixed(2);
        
        buyNowItem.innerHTML = `
            <div class="item-details">
                <h4>${name}</h4>
                <p>One-time purchase</p>
                <div class="item-price">$${formattedPrice}</div>
            </div>
        `;
        
        buyNowTotal.querySelector('.total-price').textContent = `$${formattedPrice}`;
        
        // Hide discount popup if it's showing
        if (discountPopup && discountPopup.classList.contains('show')) {
            discountPopup.classList.remove('show');
        }
        
        buyNowPopup.classList.add('show');
    }

    function saveCartToStorage() {
        localStorage.setItem('hermesCart', JSON.stringify(cart));
        localStorage.setItem('hermesCartCount', cartCount.toString());
    }

    function recalculateCartCount() {
        // Recalculate cart count from actual cart items
        cartCount = cart.reduce((total, item) => total + item.quantity, 0);
        console.log('Recalculated cart count:', cartCount);
        return cartCount;
    }

    function updateCartCount() {
        // Always recalculate to ensure accuracy
        recalculateCartCount();
        console.log('Updating cart count to:', cartCount);
        if (cartCountElement) {
            cartCountElement.textContent = cartCount;
        } else {
            console.log('Cart count element not found');
        }
        saveCartToStorage();
    }

    function updateCartDisplay() {
        console.log('Updating cart display, cart length:', cart.length);
        if (!cartItems || !cartTotal) {
            console.log('Cart display elements not found');
            return;
        }
        
        if (cart.length === 0) {
            cartItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
            cartTotal.querySelector('.total-price').textContent = '$0';
            return;
        }

        let cartHTML = '';
        let total = 0;

        cart.forEach(item => {
            const itemTotal = Math.round((item.price * item.quantity) * 100) / 100;
            total = Math.round((total + itemTotal) * 100) / 100;
            
            cartHTML += `
                <div class="cart-item">
                    <div class="item-info">
                        <h4>${item.name}</h4>
                        <p>$${item.price.toFixed(2)} each</p>
                    </div>
                    <div class="item-quantity">
                        <button class="quantity-btn" onclick="updateQuantity('${item.id}', -1)">-</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn" onclick="updateQuantity('${item.id}', 1)">+</button>
                    </div>
                    <div class="item-price">$${itemTotal.toFixed(2)}</div>
                    <button class="remove-item" onclick="removeFromCart('${item.id}')">Remove</button>
                </div>
            `;
        });

        cartItems.innerHTML = cartHTML;
        cartTotal.querySelector('.total-price').textContent = `$${total.toFixed(2)}`;
    }

    function updateQuantity(packageId, change) {
        const item = cart.find(item => item.id === packageId);
        if (item) {
            item.quantity += change;
            if (item.quantity <= 0) {
                removeFromCart(packageId);
            } else {
                cartCount += change;
                updateCartCount();
                updateCartDisplay();
            }
        }
    }

    function removeFromCart(packageId) {
        console.log('Removing item from cart:', packageId);
        const itemIndex = cart.findIndex(item => item.id === packageId);
        if (itemIndex !== -1) {
            const removedQuantity = cart[itemIndex].quantity;
            console.log('Removing quantity:', removedQuantity, 'Current cart count:', cartCount);
            cartCount -= removedQuantity;
            cart.splice(itemIndex, 1);
            console.log('New cart count after removal:', cartCount);
            updateCartCount();
            updateCartDisplay();
            saveCartToStorage();
        }
    }

    function showCartNotification() {
        // Simple notification - could be enhanced with a toast notification
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: #2c5aa0;
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            z-index: 1001;
            font-weight: 600;
        `;
        notification.textContent = 'Added to cart!';
        document.body.appendChild(notification);
        
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 2000);
    }

    // Counter animation for student count
    const studentCounter = document.getElementById('studentCounter');
    if (studentCounter) {
        const targetCount = 200;
        const duration = 2000; // 2 seconds
        const increment = targetCount / (duration / 16); // 60fps
        let currentCount = 0;
        
        const counterInterval = setInterval(() => {
            currentCount += increment;
            if (currentCount >= targetCount) {
                currentCount = targetCount;
                clearInterval(counterInterval);
            }
            studentCounter.textContent = Math.floor(currentCount) + '+';
        }, 16);
    }

    // Mobile menu toggle functionality
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const mainNav = document.getElementById('mainNav');
    const mobileMenuClose = document.getElementById('mobileMenuClose');

    // Discount popup functionality
    const discountPopup = document.getElementById('discountPopup');
    const closeDiscount = document.getElementById('closeDiscount');
    const copyCodeBtn = document.getElementById('copyCodeBtn');
    const discountCode = document.getElementById('discountCode');
    const viewServicesBtn = document.getElementById('viewServicesBtn');
    
    console.log('Mobile menu elements:', { 
        toggle: mobileMenuToggle ? 'found' : 'not found',
        nav: mainNav ? 'found' : 'not found',
        close: mobileMenuClose ? 'found' : 'not found'
    });
    
    // Reset mobile menu state on page load
    if (mobileMenuToggle) {
        mobileMenuToggle.classList.remove('active');
    }
    if (mainNav) {
        mainNav.classList.remove('mobile-open');
    }
    
    if (mobileMenuToggle && mainNav) {
        mobileMenuToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Hamburger menu clicked');
            this.classList.toggle('active');
            mainNav.classList.toggle('mobile-open');
        });
        
        // Close button functionality
        if (mobileMenuClose) {
            mobileMenuClose.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('Close button clicked');
                mobileMenuToggle.classList.remove('active');
                mainNav.classList.remove('mobile-open');
            });
        }
        
        // Close mobile menu when clicking on a nav link
        const navLinks = mainNav.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenuToggle.classList.remove('active');
                mainNav.classList.remove('mobile-open');
            });
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!mobileMenuToggle.contains(e.target) && !mainNav.contains(e.target) && !mobileMenuClose.contains(e.target)) {
                mobileMenuToggle.classList.remove('active');
                mainNav.classList.remove('mobile-open');
            }
        });
    }

    // Make functions globally available for onclick handlers
    window.updateQuantity = updateQuantity;
    window.removeFromCart = removeFromCart;

    // Discount popup functionality
    if (discountPopup && closeDiscount && copyCodeBtn && discountCode) {
        // Check if this is a hard reload (performance.navigation.type === 1)
        const isHardReload = performance.navigation && performance.navigation.type === 1;
        
        // Reset time tracking and popup state on hard reload
        if (isHardReload) {
            localStorage.removeItem('hermesTotalTime');
            localStorage.removeItem('hermesPopupDismissed');
            localStorage.removeItem('hermesHasPurchased');
        }
        
        // Check if popup was already dismissed or if user has made a purchase
        const popupDismissed = localStorage.getItem('hermesPopupDismissed') === 'true';
        const hasPurchased = localStorage.getItem('hermesHasPurchased') === 'true';
        
        // Track total time spent on website
        let totalTimeSpent = parseInt(localStorage.getItem('hermesTotalTime') || '0');
        let startTime = Date.now();
        let popupShown = false;
        
        // Show popup after 40 seconds total time spent (only if not dismissed, no purchase, and no other popups are open)
        setTimeout(() => {
            const isCartOpen = cartPopup && cartPopup.classList.contains('show');
            const isBuyNowOpen = buyNowPopup && buyNowPopup.classList.contains('show');
            const isServiceTypeOpen = serviceTypePopup && serviceTypePopup.classList.contains('show');
            
            if (!popupShown && !popupDismissed && !hasPurchased && !isCartOpen && !isBuyNowOpen && !isServiceTypeOpen) {
                discountPopup.classList.add('show');
                popupShown = true;
            }
        }, Math.max(0, 40000 - totalTimeSpent));
        
        // Update total time when user leaves the page
        window.addEventListener('beforeunload', () => {
            const timeOnPage = Date.now() - startTime;
            const newTotalTime = totalTimeSpent + timeOnPage;
            localStorage.setItem('hermesTotalTime', newTotalTime.toString());
        });
        
        // Update total time every 5 seconds while on page
        const timeTracker = setInterval(() => {
            const timeOnPage = Date.now() - startTime;
            const newTotalTime = totalTimeSpent + timeOnPage;
            localStorage.setItem('hermesTotalTime', newTotalTime.toString());
        }, 5000);

        // Close popup functionality
        closeDiscount.addEventListener('click', () => {
            discountPopup.classList.remove('show');
            // Mark popup as dismissed so it won't show again
            localStorage.setItem('hermesPopupDismissed', 'true');
        });

        // Close popup when clicking outside
        discountPopup.addEventListener('click', (e) => {
            if (e.target === discountPopup) {
                discountPopup.classList.remove('show');
                // Mark popup as dismissed so it won't show again
                localStorage.setItem('hermesPopupDismissed', 'true');
            }
        });

        // Close popup when clicking "View Services" button
        if (viewServicesBtn) {
            viewServicesBtn.addEventListener('click', () => {
                discountPopup.classList.remove('show');
                // Mark popup as dismissed so it won't show again
                localStorage.setItem('hermesPopupDismissed', 'true');
            });
        }

        // Copy code functionality
        copyCodeBtn.addEventListener('click', async () => {
            try {
                await navigator.clipboard.writeText(discountCode.textContent);
                copyCodeBtn.textContent = 'Copied!';
                copyCodeBtn.classList.add('copied');
                
                // Reset button after 2 seconds
                setTimeout(() => {
                    copyCodeBtn.textContent = 'Copy';
                    copyCodeBtn.classList.remove('copied');
                }, 2000);
            } catch (err) {
                // Fallback for older browsers
                const textArea = document.createElement('textarea');
                textArea.value = discountCode.textContent;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                
                copyCodeBtn.textContent = 'Copied!';
                copyCodeBtn.classList.add('copied');
                
                setTimeout(() => {
                    copyCodeBtn.textContent = 'Copy';
                    copyCodeBtn.classList.remove('copied');
                }, 2000);
            }
        });
    }
});

// Handle window resize for responsive design
window.addEventListener('resize', function() {
    const nav = document.querySelector('.nav');
    
    if (window.innerWidth <= 768) {
        // Mobile-specific adjustments
        console.log('Switched to mobile view');
    } else {
        // Desktop-specific adjustments
        console.log('Switched to desktop view');
    }
});
