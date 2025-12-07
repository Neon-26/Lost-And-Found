console.log('found.js loaded successfully.');

document.addEventListener('DOMContentLoaded', function() {
    const dateInput = document.getElementById('date');
    const form = document.getElementById('FoundItemform');
    const successMessage = document.getElementById('successMessage');
    const popup = document.getElementById('popupMessage');
    const popupText = document.getElementById('popupText');
    const popupOverlay = document.getElementById('popupOverlay');
    const closePopupBtn = document.getElementById('closePopup');

    if (!form) {
        console.error('Error: Form with ID "FoundItemform" not found. Check HTML.');
        return;
    }

    console.log('Form found:', form);

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
        console.log('Submit event triggered for found item.');

        if (!form.checkValidity()) {
            console.log('Form validation failed. Reporting validity.');
            form.reportValidity();
            return;
        }

        console.log('Form validation passed. Processing data.');

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
                console.error('Invalid file type selected.');
                alert('Select a valid image.');
                return;
            }
            console.log('Processing image file.');
            const reader = new FileReader();
            reader.onload = () => saveItem(formData, reader.result);
            reader.readAsDataURL(file);
        } else {
            console.log('No image selected.');
            saveItem(formData, null);
        }
    });

function saveItem(data, image) {
    try {
        if (typeof Storage === 'undefined') {
            throw new Error('localStorage is not supported in this browser.');
        }

        if (image && image.length > 1024 * 1024) { 
            console.warn('Image is large (>1MB). This may cause localStorage issues.');
        }

        const foundRequests = JSON.parse(localStorage.getItem('foundRequests')) || [];
        const user = sessionStorage.getItem('userUsername') || 'Unknown User';
        const newItem = {
            id: Date.now(),
            itemName: data.itemName,
            description: data.notes,
            location: data.location,
            date: data.date,
            status: 'pending',
            image: image,
            user: user
        };
        foundRequests.push(newItem);
        localStorage.setItem('foundRequests', JSON.stringify(foundRequests));
        console.log('Found item saved to localStorage:', newItem);

        addAdminNotification(`A new found item "${data.itemName}" has been submitted by ${user}.`, 'info');
        addNotification(`Your found item "${data.itemName}" has been submitted and is pending approval.`, 'info');

        form.reset();
        popupText.textContent = 'Found Item successfully reported.';
        popup.classList.remove('hidden');
        popupOverlay.classList.remove('hidden');
    } catch (error) {
        console.error('Detailed error saving found item:', error.message, error.stack);
        alert(`An error occurred while saving: ${error.message}. Please try again or contact support.`);
    }
}

    closePopupBtn.addEventListener('click', () => {
        console.log('Popup closed.');
        popup.classList.add('hidden');
        popupOverlay.classList.add('hidden');
        window.location.href = 'user.html';
    });

    document.getElementById('cancelBtn').addEventListener('click', () => {
        console.log('Cancel clicked.');
        window.location.href = 'user.html';
    });

    function addNotification(message, type = 'info') {
        const username = sessionStorage.getItem('userUsername');
        if (!username) return;
        const key = `notifications_${username}`;
        const notifications = JSON.parse(localStorage.getItem(key)) || [];
        notifications.unshift({
            id: Date.now(),
            message,
            type,
            timestamp: new Date().toISOString(),
            read: false
        });
        localStorage.setItem(key, JSON.stringify(notifications));
        console.log('User notification added:', message);
    }

    function addAdminNotification(message, type = 'info') {
        const key = 'notifications_admin';
        const notifications = JSON.parse(localStorage.getItem(key)) || [];
        notifications.unshift({
            id: Date.now(),
            message,
            type,
            timestamp: new Date().toISOString(),
            read: false
        });
        localStorage.setItem(key, JSON.stringify(notifications));
        console.log('Admin notification added:', message);
    }
});