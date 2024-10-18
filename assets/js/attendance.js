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

// Display grouped attendance by month and day
function displayGroupedAttendance(groupedData) {
    attendanceRecords.innerHTML = '';

    for (const [month, days] of Object.entries(groupedData)) {
        const monthSection = document.createElement('div');
        monthSection.innerHTML = `<h3>${month}</h3>`;

        for (const [day, entries] of Object.entries(days)) {
            const daySection = document.createElement('div');
            daySection.innerHTML = `<h4>${day}</h4>`;

            const ul = document.createElement('ul');
            entries.forEach(entry => {
                const li = document.createElement('li');
                li.textContent = `${entry.user} - ${entry.trainingCategory} - Amount Paid : ${entry.amountPaid != '' ? entry.amountPaid : 0} php - ${entry.modeOfPayment} - Receiver : ${entry.paymentReceiver} `;
                ul.appendChild(li);
            });

            daySection.appendChild(ul);
            monthSection.appendChild(daySection);
        }

        attendanceRecords.appendChild(monthSection);
    }
}
