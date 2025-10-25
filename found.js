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

        popupText.textContent = `Found Item successfully reported.`;
        popup.classList.remove('hidden');
        popupOverlay.classList.remove('hidden');

        form.querySelector('button[type="submit"]').disabled = true;
    });

    closePopupBtn.addEventListener('click', (e) => {
        e.preventDefault();
        popup.classList.add('hidden');
        popupOverlay.classList.add('hidden');
        window.location.href = 'site.html';
});