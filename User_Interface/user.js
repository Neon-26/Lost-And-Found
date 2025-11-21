function updateUserMenu() {
    console.log('Updating user menu...');
    const username = sessionStorage.getItem('userUsername');  
    const usernameSpan = document.getElementById('username');
    const dropdown = document.getElementById('userMenuDropdown');

    if (usernameSpan) {
        if (username) {
            usernameSpan.textContent = username;
            console.log('Username set:', username);
        } else {
            usernameSpan.textContent = 'Login';
            console.log('No username, redirecting to login');
            window.location.href = '../index.html';
        }
    } else {
        console.error('Username span (#username) not found in HTML!');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing dropdown...');

    const logoutLink = document.getElementById('logoutLink');
    if (logoutLink) {
        logoutLink.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Logout clicked');
            sessionStorage.removeItem('userUsername'); 
            updateUserMenu();
        });
    } else {
        console.error('Logout link (#logoutLink) not found!');
    }

    const userMenuButton = document.getElementById('userMenuButton');
    if (userMenuButton) {
        userMenuButton.addEventListener('click', function() {
            console.log('User menu button clicked');
            const username = sessionStorage.getItem('userUsername'); 
            const dropdown = document.getElementById('userMenuDropdown');
            if (username && dropdown) {
                dropdown.classList.toggle('show');
                console.log('Dropdown toggled, show class:', dropdown.classList.contains('show'));
            } else {
                console.log('No username or dropdown not found');
            }
        });
    } else {
        console.error('User menu button (#userMenuButton) not found!');
    }

    document.addEventListener('click', function(event) {
        const button = document.getElementById('userMenuButton');
        const dropdown = document.getElementById('userMenuDropdown');
        if (button && dropdown && !button.contains(event.target) && !dropdown.contains(event.target)) {
            dropdown.classList.remove('show');
            console.log('Dropdown closed via outside click');
        }
    });
});

updateUserMenu();

function loadFoundItems() {
    console.log('Loading found items...');
    const container = document.querySelector('.found-scroll-container');
    if (!container) {
        console.error('Error: .found-scroll-container not found in HTML.');
        return;
    }

    const foundItems = JSON.parse(localStorage.getItem('foundItems')) || [];
    console.log('Found items from localStorage:', foundItems);

    foundItems.forEach((item, index) => {
        console.log(`Appending found item ${index + 1}:`, item);
        const card = document.createElement('div');
        card.className = 'found-item-card';
        card.setAttribute('data-index', index);
        card.setAttribute('data-type', 'found');

        const imgSrc = item.image || 'logo.png';

        card.innerHTML = `
            <img src="${imgSrc}" alt="${item.itemName}" class="found-item-image" onerror="this.src='logo.png';" />
            <h2 class="found-item-title">${item.itemName || 'Unknown Item'}</h2>
            <p class="found-item-description">${item.description || 'No description provided.'}</p>
            <div class="found-item-buttons">
                <button class="view-btn">View</button>
                <button class="match-btn">Match</button>
            </div>
        `;

        container.appendChild(card);
    });

    addViewButtonListeners();
}

function loadLostItems() {
    console.log('Loading lost items...');
    const container = document.querySelector('.lost-scroll-container');
    if (!container) {
        console.error('Error: .lost-scroll-container not found in HTML.');
        return;
    }

    const lostItems = JSON.parse(localStorage.getItem('lostItems')) || [];
    console.log('Lost items from localStorage:', lostItems);

    lostItems.forEach((item, index) => {
        console.log(`Appending lost item ${index + 1}:`, item);
        const card = document.createElement('div');
        card.className = 'lost-item-card';
        card.setAttribute('data-index', index);
        card.setAttribute('data-type', 'lost');

        const imgSrc = item.image || 'logo.png';

        card.innerHTML = `
            <img src="${imgSrc}" alt="${item.itemName}" class="lost-item-image" onerror="this.src='logo.png';" />
            <h2 class="lost-item-title">${item.itemName || 'Unknown Item'}</h2>
            <p class="lost-item-description">${item.description || 'No description provided.'}</p>
            <div class="lost-item-buttons">
                <button class="view-btn">View</button>
                <button class="claim-btn">Claim</button>
            </div>
        `;

        container.appendChild(card);
    });

    addViewButtonListeners();
}

function addViewButtonListeners() {
    const viewButtons = document.querySelectorAll('.view-btn');
    viewButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const card = e.target.closest('.found-item-card, .lost-item-card');
            const type = card.classList.contains('found-item-card') ? 'found' : 'lost';
            let item = {};

            if (card.hasAttribute('data-index')) {
                const index = parseInt(card.getAttribute('data-index'));
                const items = JSON.parse(localStorage.getItem(type === 'found' ? 'foundItems' : 'lostItems')) || [];
                item = items[index] || {};
            } else {
                item = {
                    itemName: card.getAttribute('data-item-name') || 'Unknown Item',
                    description: card.getAttribute('data-description') || 'No description provided.',
                    image: card.querySelector('img').src || 'logo.png',
                    location: card.getAttribute('data-location') || 'Not specified',
                    date: card.getAttribute('data-date') || 'Not specified',
                    status: card.getAttribute('data-status') || 'Not specified'
                };
            }

            showItemModal(item, type);
        });
    });
}

function showItemModal(item, type) {
    document.getElementById('modalImage').src = item.image || 'logo.png';
    document.getElementById('modalTitle').textContent = item.itemName || 'Unknown Item';
    document.getElementById('modalDescription').textContent = `Description: ${item.description || 'No description provided.'}`;
    document.getElementById('modalLocation').textContent = `Location: ${item.location || 'No location provided.'}`;

    let formattedDate = 'No date provided.';
    if (item.date) {
        const dateObj = new Date(item.date);
        if (!isNaN(dateObj)) {
            const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
            const day = dateObj.getDate().toString().padStart(2, '0');
            const year = dateObj.getFullYear();
            formattedDate = `${month}/${day}/${year}`;
        }
    }
    document.getElementById('modalDate').textContent = `${type === 'found' ? 'Date Found' : 'Date Lost'}: ${formattedDate}`;
    
    document.getElementById('modalStatus').textContent = `Status: ${item.status || 'pending'}`; 

    document.getElementById('itemModal').style.display = 'block';
}

document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('itemModal');
    const closeBtn = document.querySelector('.close');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
});

function closePopup() {
    document.getElementById("itemModal").style.display = "none";
}

function updateDashboard() {
    const foundItemsCount = document.querySelectorAll('.found-item-card').length;
    const lostItemsCount = document.querySelectorAll('.lost-item-card').length;
    const totalReported = foundItemsCount + lostItemsCount;
    
    console.log('Updating dashboard: Found:', foundItemsCount, 'Lost:', lostItemsCount);
    document.getElementById('total-reported').textContent = totalReported;
    document.getElementById('items-found').textContent = foundItemsCount;
    document.getElementById('items-lost').textContent = lostItemsCount;

    document.getElementById('items-returned').textContent = '45';

    document.getElementById('pending-claims').textContent = foundItemsCount;

    document.getElementById('council-inquiries').textContent = '12';
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('Page loaded, calling loadFoundItems, loadLostItems, and updateDashboard');
    loadFoundItems();
    loadLostItems();
    updateDashboard();
    addViewButtonListeners();
});

function reloadLostItems() {
    console.log('Manually reloading lost items...');
    loadLostItems();
    updateDashboard();
}

function clearNewItems() {
    console.log('Clearing new added items from localStorage...');
    localStorage.removeItem('foundItems');
    localStorage.removeItem('lostItems');
    console.log('Cleared. Reloading page...');
    location.reload();
}

document.addEventListener('DOMContentLoaded', () => {
    const foundSearchBar = document.getElementById('found-search');
    if (foundSearchBar) {
        foundSearchBar.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const cards = document.querySelectorAll('.found-item-card');
            cards.forEach(card => {
                const title = card.querySelector('.found-item-title').textContent.toLowerCase();
                const description = card.querySelector('.found-item-description').textContent.toLowerCase();
                if (title.includes(searchTerm) || description.includes(searchTerm)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
            updateDashboard();
        });
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const lostSearchBar = document.getElementById('lost-search');
    if (lostSearchBar) {
        lostSearchBar.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const cards = document.querySelectorAll('.lost-item-card');
            cards.forEach(card => {
                const title = card.querySelector('.lost-item-title').textContent.toLowerCase();
                const description = card.querySelector('.lost-item-description').textContent.toLowerCase();
                if (title.includes(searchTerm) || description.includes(searchTerm)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
            updateDashboard();
        });
    }
});

const backToTopButton = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        backToTopButton.classList.add('show');
    } else {
        backToTopButton.classList.remove('show');
    }
});
backToTopButton.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
        }
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const scrollContainerFound = document.querySelector('.found-scroll-container');
    const leftArrowFound = document.querySelector('.found-arrow-btn.left-arrow');
    const rightArrowFound = document.querySelector('.found-arrow-btn.right-arrow');
    
    if (!scrollContainerFound) {
        console.error('Found scroll container not found!');
        return;
    }

    const cardWidthFound = 240;
    
    if (leftArrowFound) {
        leftArrowFound.addEventListener('click', () => {
            console.log('Left arrow clicked for found items');
            scrollContainerFound.scrollBy({ left: -cardWidthFound, behavior: 'smooth' });
        });
    } else {
        console.error('Left arrow for found items not found!');
    }
    
    if (rightArrowFound) {
        rightArrowFound.addEventListener('click', () => {
            console.log('Right arrow clicked for found items');
            scrollContainerFound.scrollBy({ left: cardWidthFound, behavior: 'smooth' });
        });
    } else {
        console.error('Right arrow for found items not found!');
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const scrollContainerLost = document.querySelector('.lost-scroll-container');
    const leftArrowLost = document.querySelector('.lost-arrow-btn.left-arrow');
    const rightArrowLost = document.querySelector('.lost-arrow-btn.right-arrow');
    
    if (!scrollContainerLost) {
        console.error('Lost scroll container not found!');
        return;
    }

    const cardWidthLost = 240; 
    
    if (leftArrowLost) {
        leftArrowLost.addEventListener('click', () => {
            console.log('Left arrow clicked for lost items');
            scrollContainerLost.scrollBy({ left: -cardWidthLost, behavior: 'smooth' });
        });
    } else {
        console.error('Left arrow for lost items not found!');
    }
    
    if (rightArrowLost) {
        rightArrowLost.addEventListener('click', () => {
            console.log('Right arrow clicked for lost items');
            scrollContainerLost.scrollBy({ left: cardWidthLost, behavior: 'smooth' });
        });
    } else {
        console.error('Right arrow for lost items not found!');
    }
});

let currentItem = null;

function openMatchModal(item) {
    console.log('Opening match modal for item:', item);
    currentItem = item;
    const modal = document.getElementById('itemModalMatch');
    if (modal) {
        modal.style.display = 'block';
        console.log('Modal opened');
    } else {
        console.error('Modal not found!');
    }
}

function attachMatchButtonListeners() {
    console.log('Attaching Match button listeners...');
    document.querySelectorAll('.match-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            console.log('Match button clicked');
            const card = e.target.closest('.found-item-card, .lost-item-card');
            const type = card.classList.contains('found-item-card') ? 'found' : 'lost';
            let item = {};

            if (card.hasAttribute('data-index')) {
                const index = parseInt(card.getAttribute('data-index'));
                const items = JSON.parse(localStorage.getItem(type === 'found' ? 'foundItems' : 'lostItems')) || [];
                item = items[index] || {};
            } else {
                item = {
                    itemName: card.getAttribute('data-item-name') || 'Unknown Item',
                    description: card.getAttribute('data-description') || 'No description provided.',
                    image: card.querySelector('img').src || 'logo.png',
                    location: card.getAttribute('data-location') || 'Not specified',
                    date: card.getAttribute('data-date') || 'Not specified',
                    status: card.getAttribute('data-status') || 'pending'
                };
            }

            item.type = type;
            openMatchModal(item);
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('Page loaded, attaching Match listeners');
    attachMatchButtonListeners();
});

document.addEventListener('DOMContentLoaded', () => {
    const submitBtn = document.querySelector('#itemModalMatch .Submit-btn');
    if (submitBtn) {
        submitBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Submit button clicked');
            
            const notes = document.getElementById('notes').value.trim();
            if (!notes) {
                alert('Please enter a description.');
                return;
            }
            
            const fileInput = document.getElementById('file');
            if (fileInput.files.length > 0) {
                const file = fileInput.files[0];
                if (!file.type.startsWith('image/')) {
                    alert('Please select a valid image file.');
                    return;
                }
                const reader = new FileReader();
                reader.onload = () => {
                    const image = reader.result;
                    saveMatchRequest(notes, image);
                };
                reader.readAsDataURL(file);
            } else {
                saveMatchRequest(notes, null);
            }
        });
    } else {
        console.error('Submit button not found!');
    }
});

function saveMatchRequest(notes, image) {
    console.log('Saving match request');
    if (!currentItem) {
        alert('No item selected for matching.');
        return;
    }
    
    const matchRequest = {
        itemName: currentItem.itemName,
        description: notes,
        location: currentItem.location,
        date: currentItem.date,
        type: currentItem.type,
        user: sessionStorage.getItem('userUsername') || 'Unknown User',
        status: 'Pending',
        image: image
    };
    
    const matchRequests = JSON.parse(localStorage.getItem('matchRequests')) || [];
    matchRequests.push(matchRequest);
    localStorage.setItem('matchRequests', JSON.stringify(matchRequests));
    
    alert('Match request submitted successfully!');
    document.getElementById('itemModalMatch').style.display = 'none';

    document.getElementById('notes').value = '';
    document.getElementById('file').value = '';
}

document.addEventListener('DOMContentLoaded', () => {
    const cancelBtn = document.getElementById('cancelBtn');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', function() {
            console.log('Cancel button clicked');
            document.getElementById('itemModalMatch').style.display = 'none';

            document.getElementById('notes').value = '';
            document.getElementById('file').value = '';
        });
    } else {
        console.error('Cancel button not found!');
    }
});

window.addEventListener('click', (event) => {
    const modal = document.getElementById('itemModalMatch');
    if (event.target === modal) {
        modal.style.display = 'none';

        document.getElementById('notes').value = '';
        document.getElementById('file').value = '';
    }
});

const form = document.getElementById('itemModalMatch');

const inputs = form.querySelectorAll('textarea');
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

let currentClaimItem = null;

function openClaimModal(item) {
    console.log('Opening claim modal for item:', item);
    currentClaimItem = item;
    const modal = document.getElementById('itemModalClaim');
    if (modal) {
        modal.style.display = 'block';
        console.log('Claim modal opened');
    } else {
        console.error('Claim modal not found!');
    }
}

function attachClaimButtonListeners() {
    console.log('Attaching Claim button listeners...');
    document.querySelectorAll('.claim-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            console.log('Claim button clicked');
            const card = e.target.closest('.found-item-card, .lost-item-card');
            const type = card.classList.contains('found-item-card') ? 'found' : 'lost';
            let item = {};

            if (card.hasAttribute('data-index')) {
                const index = parseInt(card.getAttribute('data-index'));
                const items = JSON.parse(localStorage.getItem(type === 'found' ? 'foundItems' : 'lostItems')) || [];
                item = items[index] || {};
            } else {
                item = {
                    itemName: card.getAttribute('data-item-name') || 'Unknown Item',
                    description: card.getAttribute('data-description') || 'No description provided.',
                    image: card.querySelector('img').src || 'logo.png',
                    location: card.getAttribute('data-location') || 'Not specified',
                    date: card.getAttribute('data-date') || 'Not specified',
                    status: card.getAttribute('data-status') || 'pending'
                };
            }

            item.type = type;
            openClaimModal(item);
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('Page loaded, attaching Claim listeners');
    attachClaimButtonListeners();
});

document.addEventListener('DOMContentLoaded', () => {
    const submitBtn = document.querySelector('#itemModalClaim .Submit-btn');
    if (submitBtn) {
        submitBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Claim submit button clicked');

            const notes = document.querySelector('#itemModalClaim #notes').value.trim();
            if (!notes) {
                alert('Please enter a description.');
                return;
            }

            const fileInput = document.querySelector('#itemModalClaim #file');
            if (fileInput.files.length > 0) {
                const file = fileInput.files[0];
                if (!file.type.startsWith('image/')) {
                    alert('Please select a valid image file.');
                    return;
                }
                const reader = new FileReader();
                reader.onload = () => {
                    const image = reader.result;
                    saveClaimRequest(notes, image);
                };
                reader.readAsDataURL(file);
            } else {
                saveClaimRequest(notes, null);
            }
        });
    } else {
        console.error('Claim submit button not found!');
    }
});

function saveClaimRequest(notes, image) {
    console.log('Saving claim request');
    if (!currentClaimItem) {
        alert('No item selected for claiming.');
        return;
    }
    
    const claimRequest = {
        itemName: currentClaimItem.itemName,
        description: notes,
        location: currentClaimItem.location,
        date: currentClaimItem.date,
        type: currentClaimItem.type,
        user: sessionStorage.getItem('userUsername') || 'Unknown User',
        status: 'Pending',
        image: image
    };
    
    const claimRequests = JSON.parse(localStorage.getItem('claimRequests')) || [];
    claimRequests.push(claimRequest);
    localStorage.setItem('claimRequests', JSON.stringify(claimRequests));
    
    alert('Claim request submitted successfully!');
    document.getElementById('itemModalClaim').style.display = 'none';

    document.querySelector('#itemModalClaim #notes').value = '';
    document.querySelector('#itemModalClaim #file').value = '';
}

document.addEventListener('DOMContentLoaded', () => {
    const cancelBtn = document.querySelector('#itemModalClaim #cancelBtn');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', function() {
            console.log('Claim cancel button clicked');
            document.getElementById('itemModalClaim').style.display = 'none';
            document.querySelector('#itemModalClaim #notes').value = '';
            document.querySelector('#itemModalClaim #file').value = '';
        });
    } else {
        console.error('Claim cancel button not found!');
    }
});

window.addEventListener('click', (event) => {
    const modal = document.getElementById('itemModalClaim');
    if (event.target === modal) {
        modal.style.display = 'none';
        document.querySelector('#itemModalClaim #notes').value = '';
        document.querySelector('#itemModalClaim #file').value = '';
    }
});

const forms = ['itemModalMatch', 'itemModalClaim'];

forms.forEach(formId => {
    const form = document.getElementById(formId);
    if (form) {
        const inputs = form.querySelectorAll('textarea');
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
    }
});