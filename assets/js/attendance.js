// Fetch Attendance Data from API on page load
document.addEventListener('DOMContentLoaded', fetchAttendanceData);

function fetchAttendanceData() {
    axios.get('http://localhost:3000/attendance')
        .then(response => {
            // Log the full response to inspect the data structure
            console.log('Full Response:', response.data);

            attendanceData = response.data.map(record => {
                console.log('Mapping Record:', record); // Log each record for debugging

                return {
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


// Sample Users (for now, you can load this dynamically later)
const sampleUsers = [
    { id: 1, name: 'John Doe' },
    { id: 2, name: 'Jane Smith' },
    { id: 3, name: 'Alice Johnson' }
];

const sampleTrainingCategories = [
    { id: 1, name: 'Jiujitsu' },
    { id: 2, name: 'Wrestling' },
    { id: 3, name: 'Judo' },
    { id: 4, name: 'Others' }
];

const sampleModeOfPayment = [
    { id: 1, name: 'Cash' },
    { id: 2, name: 'GCash' },
    { id: 3, name: 'BankTransfer' },
    { id: 4, name: 'Others' }
];

const samplePaymentReceiver = [
    { id: 1, name: 'Sachi' },
    { id: 2, name: 'CC' },
    { id: 3, name: 'Menric' }
];

// Attendance Data
let attendanceData = [];

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
const selectModeOfPayment = document.getElementById('modeOfPayment');



// Display attendance form when "Create Attendance" is clicked
createAttendanceBtn.addEventListener('click', () => {
    populateUsersDropdown();
    populateTrainingCategoriesDropdown();
    populateModeOfPaymentDropdown();
    populatePaymentReceiverDropdown();
    attendanceDate.value = new Date().toISOString().split('T')[0];
    attendanceFormContainer.style.display = 'block'; // Show the form
});

// Cancel the attendance form
document.getElementById('cancelAttendanceBtn').addEventListener('click', () => {
    attendanceFormContainer.style.display = 'none'; // Hide the form
    resetForm();
});

// Populate users dropdown
function populateUsersDropdown() {
    selectUser.innerHTML = '';
    sampleUsers.forEach(user => {
        const option = document.createElement('option');
        option.value = user.id;
        option.textContent = user.name;
        selectUser.appendChild(option);
    });
}

// Populate Training categories dropdown
function populateModeOfPaymentDropdown() {
    selectModeOfPayment.innerHTML = '';
    sampleModeOfPayment.forEach(modeOfPayment => {
        const option = document.createElement('option');
        option.value = modeOfPayment.id;
        option.textContent = modeOfPayment.name;
        selectModeOfPayment.appendChild(option);
    });
}

// Populate Training categories dropdown
function populatePaymentReceiverDropdown() {
    selectPaymentReceiver.innerHTML = '';
    samplePaymentReceiver.forEach(receiver => {
        const option = document.createElement('option');
        option.value = receiver.id;
        option.textContent = receiver.name;
        selectPaymentReceiver.appendChild(option);
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
document.getElementById('attendanceForm').addEventListener('submit', (e) => {
    e.preventDefault();

    const userId = selectUser.value;
    const user = sampleUsers.find(u => u.id == userId).name;
    const date = attendanceDate.value;
    // const isPaid = isPaidCheckbox.checked;
    const trainingCategoryId = selectTrainingCategory.value;
    const trainingCategory = sampleTrainingCategories.find(t => t.id == trainingCategoryId).name;
    const amountPaid = selectAmountPaid.value;
    const modeOfPaymentId = selectModeOfPayment.value;
    const modeOfPayment = sampleModeOfPayment.find(m => m.id == modeOfPaymentId).name;
    const paymentReceiverId = selectPaymentReceiver.value;
    const paymentReceiver = samplePaymentReceiver.find(p => p.id == paymentReceiverId).name;

    const newAttendance = { user, date, trainingCategory, amountPaid, modeOfPayment, paymentReceiver };

    attendanceData.push(newAttendance); // Add to the list
    groupAttendanceByMonthAndDay(); // Regroup data by month and day
    resetForm(); // Clear form inputs
    attendanceFormContainer.style.display = 'none'; // Hide the form
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
                <th>Waived Description</th>
            </tr>
        `;
        table.appendChild(thead);

        const tbody = document.createElement('tbody');

        // Iterate over the sorted days and add entries for each day
        sortedDays.forEach(day => {
            // Add rows for each entry in the current day
            days[day].forEach(entry => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${entry.date ? new Date(entry.date).toISOString().split('T')[0] : 'Date Not Available'}</td>
                    <td>${entry.user || 'Unknown User'}</td>
                    <td>${entry.trainingCategory || 'Unspecified'}</td>
                    <td>${entry.membership || 'Not Specified'}</td>
                    <td>${entry.trainingFee !== null ? entry.trainingFee : 0}</td>
                    <td>${entry.modeOfPayment || 'N/A'}</td>
                    <td>${entry.paymentAmount !== null ? entry.paymentAmount : 0}</td>
                    <td>${entry.paymentReceiver || 'N/A'}</td>
                    <td>${entry.adminReceiver || 'N/A'}</td>
                    <td>${entry.isEvent ? 'Yes' : 'No'}</td>
                    <td>${entry.waived ? 'Yes' : 'No'}</td>
                    <td>${entry.waivedAmount !== null ? entry.waived_amount : 0}</td>
                    <td>${entry.waivedDescription || 'N/A'}</td>
                `;
                tbody.appendChild(row);
            });
        });


        /*  sortedDays.forEach(day => {
             if (!Array.isArray(days[day])) {
                 console.error(`Expected an array for ${day}, but found:`, days[day]);
                 return; // Skip this day if it's not an array
             }
 
             days[day].forEach(entry => {
                 const row = document.createElement('tr');
                 row.innerHTML = `
                     <td>${entry.date ? new Date(entry.date).toLocaleString() : 'Date Not Available'}</td>
                     <td>${entry.user || 'Unknown User'}</td>
                     <td>${entry.trainingCategory || 'Unspecified'}</td>
                     <td>${entry.membership || 'Not Specified'}</td>
                     <td>${entry.trainingFee !== null ? entry.trainingFee : 0}</td>
                     <td>${entry.modeOfPayment || 'N/A'}</td>
                     <td>${entry.paymentAmount !== null ? entry.paymentAmount : 0}</td>
                     <td>${entry.paymentReceiver || 'N/A'}</td>
                     <td>${entry.adminReceiver || 'N/A'}</td>
                     <td>${entry.isEvent ? 'Yes' : 'No'}</td>
                     <td>${entry.waived ? 'Yes' : 'No'}</td>
                     <td>${entry.waivedAmount !== null ? entry.waived_amount : 0}</td>
                     <td>${entry.waivedDescription || 'N/A'}</td>
                 `;
                 tbody.appendChild(row);
             });
         }); */


        table.appendChild(tbody);
        monthSection.appendChild(table); // Append the table to the month section
        attendanceRecords.appendChild(monthSection); // Append the month section to the main container
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
