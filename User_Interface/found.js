console.log('found.js loaded successfully.');

const dateInput = document.getElementById('date');
const form = document.getElementById('FoundItemform');
const successMessage = document.getElementById('successMessage');
const popup = document.getElementById('popupMessage');
const popupText = document.getElementById('popupText');
const popupOverlay = document.getElementById('popupOverlay');
const closePopupBtn = document.getElementById('closePopup');

console.log('Form element found:', form);
console.log('Popup elements found:', popup, popupOverlay, popupText, closePopupBtn);

if (!form) {
    console.error('Error: Form with ID "FoundItemform" not found. Check HTML.');
    alert('Form not found! Check console.');
}

const inputs = form ? form.querySelectorAll('input, textarea') : [];
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

form.addEventListener('submit', function(e) {
    e.preventDefault();
    console.log('Submit triggered.');

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

    const fileInput = document.getElementById('file');
    if (fileInput.files.length > 0) {
        const file = fileInput.files[0];
        if (!file.type.startsWith('image/')) {
            alert('Select a valid image.');
            return;
        }
        const reader = new FileReader();
        reader.onload = () => saveItem(formData, reader.result);
        reader.readAsDataURL(file);
    } else {
        saveItem(formData, null);
    }
});

function saveItem(data, image) {
    const foundItems = JSON.parse(localStorage.getItem('foundItems')) || [];
    foundItems.push({
        itemName: data.itemName,
        description: data.notes,
        location: data.location,
        date: data.date, 
        status: 'pending', 
        image: image
    });
    localStorage.setItem('foundItems', JSON.stringify(foundItems));
    console.log('Saved:', foundItems.length, 'items');

    form.reset();
    popupText.textContent = 'Found Item successfully reported.';
    popup.classList.remove('hidden');
    popupOverlay.classList.remove('hidden');
}

closePopupBtn.addEventListener('click', () => {
    popup.classList.add('hidden');
    popupOverlay.classList.add('hidden');
    window.location.href = 'user.html';
});

document.getElementById('cancelBtn').addEventListener('click', () => {
    window.location.href = 'user.html';
});