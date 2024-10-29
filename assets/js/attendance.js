// Fetch Attendance, and User Data from API on page load
document.addEventListener('DOMContentLoaded', fetchAttendanceData);
document.addEventListener('DOMContentLoaded', fetchUsersData);
// Add event listeners for the checkboxes
document.getElementById('isEvent').addEventListener('change', toggleFields);
document.getElementById('isWaived').addEventListener('change', toggleFields);



function fetchAttendanceData() {
    axios.get('http://localhost:3000/attendance')
        .then(response => {
            // Log the full response to inspect the data structure
            console.log('Full Response:', response.data);

            attendanceData = response.data.map(record => {
                console.log('Mapping Record:', record); // Log each record for debugging

                return {
                    id: record.id, // Include the attendance ID here
                    user: record.name || 'Unknown User', // Default to 'Unknown User' if null
                    date: record.training_date ? new Date(record.training_date).toLocaleString() : 'Date Not Available', // Format the date
                    trainingCategory: record.training_category || 'Unspecified', // Default if null
                    membership: record.membership || 'Not Specified', // Include membership
                    trainingFee: record.training_fee !== null ? record.training_fee : 0, // Default to 0 if null
                    modeOfPayment: record.mode_of_payment || 'Not Specified', // Default if null
                    paymentAmount: record.payment_amount !== null ? record.payment_amount : 0, // Default to 0 if null
                    paymentReceiver: record.payment_receiver || 'Not Specified', // Default if null
                    adminReceiver: record.admin_receiver || 'Not Specified', // Include admin_receiver
                    isEvent: record.is_event || false, // Include is_event
                    waived: record.waived || false, // Include waived
                    waivedAmount: record.waived_amount !== null ? record.waived_amount : 0, // Default to 0 if null
                    waivedDescription: record.waived_description || 'Not Specified' // Include waived_description
                };
            });

            console.log('Attendance Data:', attendanceData); // Log the final mapped data
            groupAttendanceByMonthAndDay(); // Group and display fetched data
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}

function fetchUsersData() {
    axios.get('http://localhost:3000/user')
        .then(response => {
            // Log the full response to inspect the data structure
            console.log('Full Response:', response.data);

            userData = response.data.map(record => {
                console.log('Mapping Record:', record); // Log each record for debugging

                return {
                    user: record.user_id,
                    name: record.name || 'Unknown User'
                };
            });

            console.log('User Data:', userData); // Log the final mapped data
            populateUsersDropdown(userData);
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}

// Function to post attendance data
async function postAttendance(data, userID, trainingCategoryId, adminReceiverId) {
    // Add event_training_fee as null directly in the function

    const attendanceData = {
        training_date: data.date,
        user_id: userID,
        event_training_fee: null,
        payment_amount: data.paymentAmount,
        mode_of_payment: data.modeOfPayment,
        payment_receiver: data.paymentReceiver,
        waived: data.isWaived ?? false,
        waived_amount: data.waivedAmount || 0,
        waived_description: data.waivedDescription ?? null,
        is_event: data.isEvent ?? false,
        training_category_id: trainingCategoryId,
        admin_id: adminReceiverId
    }

    try {
        const response = await axios.post('http://localhost:3000/attendance', attendanceData);
        console.log('Response:', response.data); // Handle the response data
        return response;
    } catch (error) {
        console.error('Error posting attendance data:', error);
        return false;
    }
}

function handleDeleteAttendance(event) {
    const attendanceId = event.target.getAttribute('data-id');

    axios.delete(`http://localhost:3000/attendance/${attendanceId}`)
        .then(response => {
            if (response.status === 200) {
                // Remove the record from the local attendanceData array
                attendanceData = attendanceData.filter(entry => entry.id !== parseInt(attendanceId));

                // Refresh the displayed attendance records
                groupAttendanceByMonthAndDay();
                console.log(`Attendance record with ID ${attendanceId} deleted successfully.`);
            } else {
                console.error(`Failed to delete attendance record with ID ${attendanceId}.`);
            }
        })
        .catch(error => {
            console.error('Error deleting attendance record:', error);
            alert('An error occurred while deleting the attendance record.');
        });
}


const sampleTrainingCategories = [
    { id: 1, name: 'Jiujitsu' },
    { id: 2, name: 'Judo' },
    { id: 3, name: 'Wrestling' },
    { id: 4, name: 'Open Mats' }
];

const sampleModeOfPayment = [
    { id: 1, name: 'Cash' },
    { id: 2, name: 'GCash' },
    { id: 3, name: 'BankTransfer' },
    { id: 4, name: 'Others' }
];

const sampleAdminReceiver = [
    { id: 1, name: 'Sachi' },
    { id: 2, name: 'CC' }
];

// Attendance Data
let attendanceData = [];

// Attendance Data
let userData = [];

let postAttendanceData = [];

// Elements
const attendanceFormContainer = document.getElementById('attendanceFormContainer');
const createAttendanceBtn = document.getElementById('createAttendanceBtn');
const selectUser = document.getElementById('selectUser');
const selectTrainingCategory = document.getElementById('selectTrainingCategory');
const attendanceDate = document.getElementById('attendanceDate');
const isPaidCheckbox = document.getElementById('isPaid');
const attendanceRecords = document.getElementById('attendanceRecords');
const selectAmountPaid = document.getElementById('amountPaid');
const selectPaymentReceiver = document.getElementById('paymentReceiver');
const selectAdminReceiver = document.getElementById('adminReceiver');
const selectModeOfPayment = document.getElementById('modeOfPayment');
const selectIsEvent = document.getElementById('isEvent');
const selectIsWaived = document.getElementById('isWaived');
const selectWaivedAmount = document.getElementById('waivedAmount');
const selectWaivedDescription = document.getElementById('waivedDescription');

// Display attendance form when "Create Attendance" is clicked
createAttendanceBtn.addEventListener('click', () => {
    populateUsersDropdown(userData);
    populateTrainingCategoriesDropdown();
    populateModeOfPaymentDropdown();
    populateAdminReceiverDropdown();
    attendanceDate.value = new Date().toISOString().split('T')[0];
    attendanceFormContainer.style.display = 'block'; // Show the form
});

// Cancel the attendance form
document.getElementById('cancelAttendanceBtn').addEventListener('click', () => {
    attendanceFormContainer.style.display = 'none'; // Hide the form
    resetForm();
});

// // Populate users dropdown
// function populateUsersDropdown() {
//     selectUser.innerHTML = '';
//     sampleUsers.forEach(user => {
//         const option = document.createElement('option');
//         option.value = user.id;
//         option.textContent = user.name;
//         selectUser.appendChild(option);
//     });
// }

// Populate users dropdown with dynamic data
function populateUsersDropdown(users) {
    selectUser.innerHTML = '';
    users.forEach(user => {
        const option = document.createElement('option');
        option.value = user.user;
        option.textContent = user.name;
        selectUser.appendChild(option);
    });
}

//populateModeOfPaymentDropdown
function populateModeOfPaymentDropdown() {
    selectModeOfPayment.innerHTML = '';
    sampleModeOfPayment.forEach(modeOfPayment => {
        const option = document.createElement('option');
        option.value = modeOfPayment.id;
        option.textContent = modeOfPayment.name;
        selectModeOfPayment.appendChild(option);
    });
}

// populateAdminReceiverDropdown
function populateAdminReceiverDropdown() {
    selectAdminReceiver.innerHTML = '';
    sampleAdminReceiver.forEach(receiver => {
        const option = document.createElement('option');
        option.value = receiver.id;
        option.textContent = receiver.name;
        selectAdminReceiver.appendChild(option);
    });
}


// Populate Training categories dropdown
function populateTrainingCategoriesDropdown() {
    selectTrainingCategory.innerHTML = '';
    sampleTrainingCategories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.id;
        option.textContent = category.name;
        selectTrainingCategory.appendChild(option);
    });
}


// Add Attendance Data
document.getElementById('attendanceForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const userId = selectUser.value;
    const user = userData.find(u => u.user == userId).name;
    const date = attendanceDate.value;
    const trainingCategoryId = selectTrainingCategory.value;
    const trainingCategory = sampleTrainingCategories.find(t => t.id == trainingCategoryId).name;
    const paymentAmount = selectAmountPaid.value;
    const modeOfPaymentId = selectModeOfPayment.value;
    const modeOfPayment = sampleModeOfPayment.find(m => m.id == modeOfPaymentId).name;
    const paymentReceiver = selectPaymentReceiver.value;
    const adminReceiverId = selectAdminReceiver.value;
    const adminReceiver = sampleAdminReceiver.find(p => p.id == adminReceiverId).name;
    const isEvent = selectIsEvent.checked;
    const isWaived = selectIsWaived.checked;
    const waivedAmount = selectWaivedAmount.value;
    const waivedDescription = selectWaivedDescription.value;

    const newAttendance = {
        user,
        date,
        trainingCategory,
        paymentAmount,
        modeOfPayment,
        paymentReceiver,
        adminReceiver,
        isEvent,
        isWaived,
        waivedAmount,
        waivedDescription
    };

    try {
        // Wait for postAttendance to complete
        const response = await postAttendance(newAttendance, userId, trainingCategoryId, adminReceiverId);

        // Check if the response was successful
        if (response.status === 201) {
            console.log('Attendance posted successfully:', response.data);

            // Proceed with the rest of the logic if successful
            attendanceData.push(newAttendance); // Add to the list
            groupAttendanceByMonthAndDay(); // Regroup data by month and day
            resetForm(); // Clear form inputs
            attendanceFormContainer.style.display = 'none'; // Hide the form
        } else {
            console.error('Failed to post attendance:', response);
            alert('Failed to post attendance. Please try again.');
        }
    } catch (error) {
        console.error('Error posting attendance:', error);
        alert('An error occurred while posting attendance. Please try again.');
    }
});


// Reset form inputs
function resetForm() {
    selectUser.value = '';
    attendanceDate.value = new Date().toISOString().split('T')[0];
    // isPaidCheckbox.checked = false;
}

// Group Attendance Data by Month and then by Day
function groupAttendanceByMonthAndDay() {
    const groupedData = {};

    attendanceData.forEach(entry => {
        const month = new Date(entry.date).toLocaleString('default', { month: 'long', year: 'numeric' });
        const day = new Date(entry.date).toLocaleDateString('default', { day: 'numeric', weekday: 'long' });

        if (!groupedData[month]) {
            groupedData[month] = {};
        }

        if (!groupedData[month][day]) {
            groupedData[month][day] = [];
        }

        groupedData[month][day].push(entry);
    });

    displayGroupedAttendance(groupedData);
}


// Display grouped attendance by month and day in table form
function displayGroupedAttendance(groupedData) {
    attendanceRecords.innerHTML = ''; // Clear existing records

    // Iterate through the months
    for (const [month, days] of Object.entries(groupedData)) {
        const monthSection = document.createElement('div');
        monthSection.innerHTML = `<h2>${month}</h2>`; // Add month header

        // Sort the days in descending order (latest day first)
        const sortedDays = Object.keys(days).sort((a, b) => new Date(b) - new Date(a));

        // Create a single table for the entire month
        const table = document.createElement('table');
        table.classList.add('attendance-table'); // Add class for styling

        // Create the table header
        const thead = document.createElement('thead');
        thead.innerHTML = `
            <tr>
                <th>Training Date</th>
                <th>User</th>
                <th>Training Category</th>
                <th>Membership</th>
                <th>Training Fee (PHP)</th>
                <th>Mode of Payment</th>
                <th>Payment Amount</th>
                <th>Payment Receiver</th>
                <th>Admin Receiver</th>
                <th>Is Event</th>
                <th>Waived</th>
                <th>Waived Amount</th>
                <th>Event / Waived Description</th>
                <th>Actions</th> <!-- New column for actions -->
            </tr>
        `;
        table.appendChild(thead);

        const tbody = document.createElement('tbody');

        // Iterate over sorted days and create rows for each entry
        sortedDays.forEach(day => {
            days[day].forEach(entry => {
                const row = document.createElement('tr');

                row.innerHTML = `
                    <td>${entry.date}</td>
                    <td>${entry.user}</td>
                    <td>${entry.trainingCategory}</td>
                    <td>${entry.membership}</td>
                    <td>${entry.trainingFee}</td>
                    <td>${entry.modeOfPayment}</td>
                    <td>${entry.paymentAmount}</td>
                    <td>${entry.paymentReceiver}</td>
                    <td>${entry.adminReceiver}</td>
                    <td>${entry.isEvent ? 'Yes' : 'No'}</td>
                    <td>${entry.waived ? 'Yes' : 'No'}</td>
                    <td>${entry.waivedAmount}</td>
                    <td>${entry.waivedDescription}</td>
                `;

                // Create the delete button for each row
                const actionCell = document.createElement('td');
                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Delete';
                deleteButton.setAttribute('data-id', entry.id); // Set data-id attribute with attendance ID
                deleteButton.addEventListener('click', handleDeleteAttendance); // Add click event to handle delete
                actionCell.appendChild(deleteButton);
                row.appendChild(actionCell);

                tbody.appendChild(row);
            });
        });

        table.appendChild(tbody);
        monthSection.appendChild(table);
        attendanceRecords.appendChild(monthSection);
    }
}





function applyDateFilter() {
    const startDate = new Date(document.getElementById('startDate').value);
    const endDate = new Date(document.getElementById('endDate').value);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        alert("Please select a valid date range.");
        return;
    }

    // Filter data based on the selected date range
    const filteredData = filterAttendanceByDateRange(groupedData, startDate, endDate);
    displayGroupedAttendance(filteredData); // Call the display function with filtered data
}

function filterAttendanceByDateRange(data, startDate, endDate) {
    const filteredData = {};

    // Iterate through each month
    for (const [month, days] of Object.entries(data)) {
        const filteredDays = {};

        // Filter days within the selected date range
        for (const [day, entries] of Object.entries(days)) {
            const dayDate = new Date(day);
            if (dayDate >= startDate && dayDate <= endDate) {
                filteredDays[day] = entries; // Keep entries within the date range
            }
        }

        // Only include the month if there are any days that match the date range
        if (Object.keys(filteredDays).length > 0) {
            filteredData[month] = filteredDays;
        }
    }

    return filteredData;
}


// Function to toggle visibility based on checkboxes
function toggleFields() {
    const isEventChecked = document.getElementById('isEvent').checked;
    const isWaivedChecked = document.getElementById('isWaived').checked;
    const waivedFields = document.getElementById('waivedFields');

    // Show fields if either checkbox is checked
    if (isEventChecked || isWaivedChecked) {
        waivedFields.style.display = 'block';
    } else {
        waivedFields.style.display = 'none';
    }
}

