// Sample Users
let sampleUsers = [
    { id: 1, name: 'John Doe', isMember: true, startDate: '2024-01-01', expiryDate: '2025-01-01' },
    { id: 2, name: 'Jane Smith', isMember: false, startDate: null, expiryDate: null },
    { id: 3, name: 'Alice Johnson', isMember: true, startDate: '2024-06-01', expiryDate: '2025-06-01' }
];

// Current Edit Mode (null when not editing a user)
let editUserId = null;

// Populate User List
const userList = document.getElementById('userList');
function renderUsers() {
    userList.innerHTML = '';
    sampleUsers.forEach(user => {
        const li = document.createElement('li');
        li.innerHTML = `
            ${user.name} - ${user.isMember ? 'Member' : 'Non-Member'}
            ${user.isMember ? ` (Start Date: ${user.startDate}, Expiry Date: ${user.expiryDate})` : ''}
            <button onclick="editUser(${user.id})">Edit</button>
            <button onclick="deleteUser(${user.id})">Delete</button>
        `;
        userList.appendChild(li);
    });
}

renderUsers();

// Show Form for New User
const userFormContainer = document.getElementById('userFormContainer');
const newUserButton = document.getElementById('newUserButton');
newUserButton.addEventListener('click', () => {
    resetForm();
    userFormContainer.style.display = 'block'; // Show the form
});

// Add New User or Edit Existing User
const createUserForm = document.getElementById('createUserForm');
const submitBtn = document.getElementById('submitBtn');
createUserForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const isMember = document.getElementById('isMember').checked;
    const startDate = document.getElementById('startDate').value;
    const expiryDate = isMember ? calculateExpiryDate(startDate) : null; // Calculate expiry date if member
    const userId = document.getElementById('userId').value;

    if (editUserId) {
        // Edit Existing User
        const userIndex = sampleUsers.findIndex(user => user.id === editUserId);
        if (userIndex !== -1) {
            sampleUsers[userIndex] = { id: editUserId, name: username, isMember, startDate, expiryDate };
            renderUsers(); // Re-render list with updated data
            resetForm(); // Reset the form to create mode
        }
    } else {
        // Add New User
        const newUserId = sampleUsers.length + 1;
        sampleUsers.push({ id: newUserId, name: username, isMember, startDate, expiryDate });
        renderUsers();  // Re-render list with new user
    }
});

// Edit User Function
function editUser(id) {
    const user = sampleUsers.find(user => user.id === id);
    if (user) {
        document.getElementById('username').value = user.name;
        document.getElementById('isMember').checked = user.isMember;
        document.getElementById('startDate').value = user.startDate || '';
        document.getElementById('expiryDate').value = user.expiryDate || '';
        document.getElementById('userId').value = user.id;
        editUserId = id;
        submitBtn.textContent = "Update User"; // Change button text
        userFormContainer.style.display = 'block'; // Show the form
        toggleMemberDetails(user.isMember); // Show member details if necessary
    }
}

// Delete User Function
function deleteUser(id) {
    sampleUsers = sampleUsers.filter(user => user.id !== id);
    renderUsers(); // Re-render list after deleting user
}

// Reset Form to Create Mode
function resetForm() {
    document.getElementById('username').value = '';
    document.getElementById('isMember').checked = false;
    document.getElementById('startDate').value = '';
    document.getElementById('expiryDate').value = '';
    document.getElementById('userId').value = '';
    editUserId = null;
    submitBtn.textContent = "Create User"; // Reset button text
    userFormContainer.style.display = 'none'; // Hide the form
}

// Toggle Member Details
document.getElementById('isMember').addEventListener('change', function () {
    toggleMemberDetails(this.checked);
});

// Show/Hide Member Details
function toggleMemberDetails(isMember) {
    document.getElementById('memberDetails').style.display = isMember ? 'block' : 'none';
    if (!isMember) {
        document.getElementById('startDate').value = '';
        document.getElementById('expiryDate').value = '';
    }
}

// Calculate Expiry Date (1 year after start date)
function calculateExpiryDate(startDate) {
    const date = new Date(startDate);
    date.setFullYear(date.getFullYear() + 1); // Set expiry to one year later
    return date.toISOString().split('T')[0]; // Return in YYYY-MM-DD format
}
