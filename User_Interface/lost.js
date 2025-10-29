const dateInput = document.getElementById('date');
const form = document.getElementById('LostItemform');
const successMessage = document.getElementById('successMessage');
const popup = document.getElementById('popupMessage');
const popupText = document.getElementById('popupText');
const popupOverlay = document.getElementById('popupOverlay');
const closePopupBtn = document.getElementById('closePopup');

const inputs = form.querySelectorAll('input, textarea');
inputs.forEach(input => {
    if (input.value) {
        input.classList.add('filled');
    }

    input.addEventListener('input', () => {
        if (input.value) {
            input.classList.add('filled');
        } else {
            input.classList.remove('filled');
        }
    });
});

form.addEventListener('submit', function (e) {
    e.preventDefault();

    successMessage.textContent = '';
    successMessage.style.color = '';

    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const formData = {
        itemName: form.itemName.value.trim(),
        location: form.location.value.trim(),
        date: form.date.value,
        notes: form.notes.value.trim()
    };

    const lostItems = JSON.parse(localStorage.getItem('lostItems')) || [];
    lostItems.push({
        itemName: formData.itemName,
        description: formData.notes,
        location: formData.location,
        dateAdded: formData.date,
        status: 'Not Matched' 
    });
    localStorage.setItem('lostItems', JSON.stringify(lostItems));

    popupText.textContent = `Lost Item successfully reported.`;
    popup.classList.remove('hidden');
    popupOverlay.classList.remove('hidden');

    form.querySelector('button[type="submit"]').disabled = true;
});

closePopupBtn.addEventListener('click', (e) => {
    e.preventDefault();
    popup.classList.add('hidden');
    popupOverlay.classList.add('hidden');
    window.location.href = 'user.html';
});