console.log('lost.js loaded successfully.');

document.addEventListener('DOMContentLoaded', function() {
    const dateInput = document.getElementById('date');
    const form = document.getElementById('LostItemform');
    const successMessage = document.getElementById('successMessage');
    const popup = document.getElementById('popupMessage');
    const popupText = document.getElementById('popupText');
    const popupOverlay = document.getElementById('popupOverlay');
    const closePopupBtn = document.getElementById('closePopup');

    if (!form) {
        console.error('Error: Form with ID "LostItemform" not found. Check HTML.');
        return;
    }

    console.log('Form found:', form);

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

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        console.log('Submit event triggered for lost item.');

        successMessage.textContent = '';
        successMessage.style.color = '';

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
                alert('Please select a valid image file.');
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

        const lostRequests = JSON.parse(localStorage.getItem('lostRequests')) || [];
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
        lostRequests.push(newItem);
        localStorage.setItem('lostRequests', JSON.stringify(lostRequests));
        console.log('Lost item saved to localStorage:', newItem);

        addNotification(`Your lost item "${data.itemName}" has been submitted and is pending approval.`, 'info');
        addAdminNotification(`A new lost item "${data.itemName}" has been submitted by ${user}.`, 'info');

        form.reset();
        inputs.forEach(input => input.classList.remove('filled'));

        popupText.textContent = `Lost Item successfully reported.`;
        popup.classList.remove('hidden');
        popupOverlay.classList.remove('hidden');

        form.querySelector('button[type="submit"]').disabled = true;
    } catch (error) {
        console.error('Detailed error saving lost item:', error.message, error.stack);
        alert(`An error occurred while saving: ${error.message}. Please try again or contact support.`);
    }
}

    closePopupBtn.addEventListener('click', (e) => {
        e.preventDefault();
        console.log('Popup closed.');
        popup.classList.add('hidden');
        popupOverlay.classList.add('hidden');
        form.querySelector('button[type="submit"]').disabled = false;
        window.location.href = 'user.html';
    });

    document.getElementById('cancelBtn').addEventListener('click', function() {
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