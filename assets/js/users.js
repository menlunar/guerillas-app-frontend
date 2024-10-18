// Sample Users (for now, you can load this dynamically later)
const sampleUsers = [
    { id: 1, name: 'John Doe', membership: 'Member', startDate: '2024-01-01', expiryDate: '2025-01-01' },
    { id: 2, name: 'Jane Smith', membership: 'Non-Member', startDate: '', expiryDate: '' },
    { id: 3, name: 'Alice Johnson', membership: 'Member', startDate: '2024-06-01', expiryDate: '2025-06-01' }
];

//Sample Membership Categories
let sampleMembership = [
    { id: 1, name: 'Trial' },
    { id: 2, name: 'Non-Member' },
    { id: 3, name: 'Member' },
    { id: 4, name: 'Scholar/Free' }
];



// Populate Membership dropdown
const selectMembership = document.getElementById('selectMembership');
function populateMembershipDropdown() {
    selectMembership.innerHTML = '';
    sampleMembership.forEach(membership => {
        const option = document.createElement('option');
        option.value = membership.id;
        option.textContent = membership.name;
        selectMembership.appendChild(option);
    });
}


// Elements
const userTableBody = document.querySelector('#userTable tbody');
const userFormContainer = document.getElementById('userFormContainer');
const newUserButton = document.getElementById('newUserButton');
const createUserForm = document.getElementById('createUserForm');

// Display the form to create a new user
newUserButton.addEventListener('click', () => {
    userFormContainer.style.display = 'block';
    populateMembershipDropdown();
    createUserForm.reset(); // Clear the form
});

// Cancel button event listener to hide the form
document.getElementById('cancelBtn').addEventListener('click', () => {
    userFormContainer.style.display = 'none'; // Hide form
});

// Populate the user table with sample users
function populateUserTable() {
    userTableBody.innerHTML = ''; // Clear the table body

    sampleUsers.forEach(user => {
        const row = document.createElement('tr');

        // Add table data for each user
        row.innerHTML = `
            <td>${user.name}</td>
            <td>${user.membership}</td>
            <td>${user.startDate ? user.startDate : 'N/A'}</td>
            <td>${user.expiryDate ? user.expiryDate : 'N/A'}</td>
            <td>
                <button class="editBtn">Edit</button>
                <button class="deleteBtn">Delete</button>
            </td>
        `;

        // Append row to the table body
        userTableBody.appendChild(row);
    });
}

// Call function to initially populate the table
populateUserTable();

// Edit and Delete button event handlers (for example purposes)
document.addEventListener('click', function(e) {
    if (e.target && e.target.classList.contains('editBtn')) {
        const row = e.target.closest('tr');
        const name = row.querySelector('td:nth-child(1)').textContent;
        alert(`Editing user: ${name}`);
    }

    if (e.target && e.target.classList.contains('deleteBtn')) {
        const row = e.target.closest('tr');
        const name = row.querySelector('td:nth-child(1)').textContent;
        alert(`Deleting user: ${name}`);
        row.remove(); // Remove the row
    }
});
