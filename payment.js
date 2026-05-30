const cardNumber = document.getElementById('cardNumber');
const expiry = document.getElementById('expiry');
const cvv = document.getElementById('cvv');
const payButton = document.getElementById('payButton');

function formatCardNumber(value) {
    return value.replace(/\D/g, '').match(/.{1,4}/g)?.join(' ') || value;
}

cardNumber.addEventListener('input', function(e) {
    e.target.value = formatCardNumber(e.target.value);
    checkFormCompletion();
});

expiry.addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 3) {
        value = value.slice(0, 2) + '/' + value.slice(2, 4);
    }
    e.target.value = value;
    checkFormCompletion();
});

cvv.addEventListener('input', function(e) {
    e.target.value = e.target.value.replace(/\D/g, '');
    checkFormCompletion();
});

function checkFormCompletion() {
    const cardValue = cardNumber.value.replace(/\s/g, '');
    const expiryValue = expiry.value;
    const cvvValue = cvv.value;
    const isComplete = cardValue.length === 16 && expiryValue.length === 5 && cvvValue.length === 3;
    payButton.disabled = !isComplete;
}

function validatePayment() {
    const cardValue = cardNumber.value.replace(/\s/g, '');
    const expiryValue = expiry.value;
    const cvvValue = cvv.value;

    if (cardValue.length !== 16) {
        alert('Zəhmət olmasa düzgün kart nömrəsi daxil edin');
        return false;
    }

    if (expiryValue.length !== 5 || !expiryValue.includes('/')) {
        alert('Zəhmət olmasa düzgün bitmə tarixi daxil edin');
        return false;
    }

    const [month, year] = expiryValue.split('/').map(Number);
    const currentYear = new Date().getFullYear() % 100;
    const currentMonth = new Date().getMonth() + 1;

    if (month < 1 || month > 12 || year < currentYear || (year === currentYear && month < currentMonth)) {
        alert('Zəhmət olmasa etibarlı bitmə tarixi daxil edin');
        return false;
    }

    if (cvvValue.length !== 3) {
        alert('Zəhmət olmasa düzgün CVV daxil edin');
        return false;
    }

    return true;
}

document.getElementById('paymentForm').addEventListener('submit', function(e) {
    e.preventDefault();
    if (!validatePayment()) return;
    alert('Ödəniş uğurla tamamlandı!');
    window.location.href = 'index.html';
});
