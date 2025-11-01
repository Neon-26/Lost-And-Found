const dateInput = document.getElementById('date');
const form = document.getElementById('FoundItemform');
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

    const fileInput = document.getElementById('file');
    let imageData = null;

    if (fileInput.files.length > 0) {
        const file = fileInput.files[0];

        if (!file.type.startsWith('image/')) {
            alert('Please select a valid image file.');
            return;
        }
        const reader = new FileReader();
        reader.onload = function(e) {
            imageData = e.target.result;
            saveItem(formData, imageData);
        };
        reader.onerror = function() {
            alert('Error reading the image file. Please try again.');
        };
        reader.readAsDataURL(file);
    } else {
        saveItem(formData, imageData);
    }

    function saveItem(data, image) {
        const foundItems = JSON.parse(localStorage.getItem('foundItems')) || [];
        foundItems.push({
            itemName: data.itemName,
            description: data.notes,
            location: data.location,
            dateAdded: data.date,
            status: 'Not Matched',
            image: image 
        });
        localStorage.setItem('foundItems', JSON.stringify(foundItems));

        form.reset();

        inputs.forEach(input => input.classList.remove('filled'));

        popupText.textContent = `Found Item successfully reported.`;
        popup.classList.remove('hidden');
        popupOverlay.classList.remove('hidden');

        form.querySelector('button[type="submit"]').disabled = true;
    }
});

closePopupBtn.addEventListener('click', (e) => {
    e.preventDefault();
    popup.classList.add('hidden');
    popupOverlay.classList.add('hidden');

    form.querySelector('button[type="submit"]').disabled = false;
    window.location.href = 'user.html';
});
