// script.js

// সবচেয়ে জরুরি কাজ: এখানে তোমার সেই যাদুকরী দূতের ঠিকানাটা বসাও।
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbye2HChy4pAKR7ATaIAYTVm7h_LUAiTLaVZK36vWGTG1FaJ6iozxNJIDwprF-DjETcduQ/exec"; 

document.addEventListener("DOMContentLoaded", () => {
    fetch(`${SCRIPT_URL}?function=getInitialData`)
        .then(response => response.json())
        .then(data => setupInitialPage(data))
        .catch(error => console.error('Error fetching initial data:', error));
});

function setupInitialPage(data) {
    document.getElementById('institution-name').textContent = data.institutionName;
    document.getElementById('institution-slogan').textContent = data.institutionSlogan;
    const examDropdown = document.getElementById('examination');
    data.exams.forEach(exam => {
        const option = document.createElement('option');
        option.value = exam;
        option.textContent = exam;
        examDropdown.appendChild(option);
    });
}

document.getElementById('result-form').addEventListener('submit', function(e) {
    e.preventDefault();
    document.getElementById('loader').classList.remove('hidden');
    document.getElementById('result-display').classList.add('hidden');
    document.getElementById('error-message').classList.add('hidden');

    const roll = document.getElementById('roll-number').value;
    const exam = document.getElementById('examination').value;

    fetch(`${SCRIPT_URL}?function=getStudentResult&roll=${roll}&exam=${exam}`)
        .then(response => response.json())
        .then(data => displayResult(data))
        .catch(error => showError({ message: 'Could not connect to server.' }));
});

function displayResult(result) {
    document.getElementById('loader').classList.add('hidden');
    if (result.error) {
        showError({ message: result.error });
        return;
    }
    document.getElementById('res-student-name').textContent = result.studentName;
    document.getElementById('res-roll-number').textContent = result.rollNumber;
    document.getElementById('res-class').textContent = result.class;
    document.getElementById('res-section').textContent = result.section;

    const subjectsDiv = document.getElementById('subject-marks');
    while (subjectsDiv.children.length > 2) {
         subjectsDiv.removeChild(subjectsDiv.lastChild);
    }

    for (const subject in result.subjects) {
        subjectsDiv.innerHTML += `<span>${subject}</span><span>${result.subjects[subject]}</span>`;
    }

    document.getElementById('res-total-marks').textContent = result.totalMarks;
    document.getElementById('res-percentage').textContent = result.percentage;
    document.getElementById('res-grade').textContent = result.grade;

    document.getElementById('result-display').classList.remove('hidden');
}

function showError(error) {
    document.getElementById('loader').classList.add('hidden');
    const errorDiv = document.getElementById('error-message');
    errorDiv.textContent = 'Error: ' + error.message;
    errorDiv.classList.remove('hidden');
}
