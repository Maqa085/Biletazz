document.addEventListener('DOMContentLoaded', function() {
    // Get concert info from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const concertName = urlParams.get('concert') || 'Röya - Yeni İl Konserti 2025';
    
    // Concert data
    const concertData = {
        'Röya - Yeni İl Konserti 2025': {
            image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop&crop=center',
            category: 'Pop Konsert',
            venue: 'Heydər Əliyev Sarayı',
            date: '31 Dekabr 2024, 20:00',
            price: '25 AZN-dən',
            badge: 'Populyar',
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
            image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&h=300&fit=crop&crop=center',
            category: 'Pop Konsert',
            venue: 'Bakı Kristal Zalı',
            date: '14 Fevral 2025, 20:00',
            price: '40 AZN-dən',
            badge: 'Yeni',
            description: 'Məşhur müğənni Emin Ağalarov sevgi mövzusunda ən gözəl mahnıları ilə sizinlə! Romantik gecə və unudulmaz melodiyalar.',
            features: [
                { icon: 'fas fa-heart', text: 'Romantik atmosfer' },
                { icon: 'fas fa-music', text: 'Canlı orkestr' },
                { icon: 'fas fa-rose', text: 'Gül hədiyyəsi' },
                { icon: 'fas fa-camera', text: 'Professional foto' }
            ],
            venueAddress: 'Kristal Zalı, 28 May küç., Bakı',
            venueCapacity: '1500 nəfər'
        }
    };

    // Load concert data
    const concert = concertData[concertName] || concertData['Röya - Yeni İl Konserti 2025'];
    
    // Update page content
    document.getElementById('concertImage').src = concert.image;
    document.getElementById('concertBadge').textContent = concert.badge;
    document.getElementById('concertCategory').textContent = concert.category;
    document.getElementById('concertTitle').textContent = concertName;
    document.getElementById('concertVenue').textContent = concert.venue;
    document.getElementById('concertDate').textContent = concert.date;
    document.getElementById('concertPrice').textContent = concert.price;
    document.getElementById('concertDescription').textContent = concert.description;
    document.getElementById('venueAddress').textContent = concert.venueAddress;
    document.getElementById('venueCapacity').textContent = concert.venueCapacity;

    // Update features
    const featuresContainer = document.getElementById('concertFeatures');
    featuresContainer.innerHTML = concert.features.map(feature => `
        <div class="feature-item">
            <i class="${feature.icon}"></i>
            <span>${feature.text}</span>
        </div>
    `).join('');

    // Cart functionality
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let cartCount = cart.length;
    
    function updateCartUI() {
        document.getElementById('cartCount').textContent = cartCount;
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

    // Add to cart
    document.querySelector('.add-to-cart-detail').addEventListener('click', function() {
        const item = {
            id: Date.now(),
            title: concertName,
            venue: concert.venue,
            date: concert.date,
            price: concert.price,
            image: concert.image,
            numericPrice: parseInt(concert.price.match(/\d+/)[0])
        };

        cart.push(item);
        cartCount++;
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartUI();
        showNotification('Konsert səbətə əlavə edildi!');
    });

    // Buy now
    document.querySelector('.buy-now-detail').addEventListener('click', function() {
        // Redirect to ticket selection page
        window.location.href = `ticket-selection.html?concert=${encodeURIComponent(concertName)}`;
    });

    // Initialize cart count
    updateCartUI();

    // Login dropdown
    const loginBtn = document.getElementById('loginBtn');
    const dropdownMenu = document.getElementById('dropdownMenu');

    loginBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        dropdownMenu.classList.toggle('show');
    });

    document.addEventListener('click', function(e) {
        if (!loginBtn.contains(e.target) && !dropdownMenu.contains(e.target)) {
            dropdownMenu.classList.remove('show');
        }
    });
});