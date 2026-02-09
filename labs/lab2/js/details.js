// All the grade for each is randm
const allAssignments = [
    [[90, 85, 95], [88, 80, 90], [70, 85, 90], [100, 95, 90]], // Alice (4 courses)
    [[70, 80, null], [60, 70, 75], [80, 85, 90], [null, 90, 95]], // Pedro (Missing grades in Course 1 & 4)
    [[null, 75, 80], [70, 70, 70], [null, 60, 65], [85, 80, 90]]  // Jeff (Missing grades in Course 1 & 3)
];

const allQuizzes = [
    [[88, 92], [90, 85], [80, 80], [95, 100]], // Alice
    [[75, 70], [60, 65], [70, null], [80, 85]], // Pedro
    [[60, null], [70, 75], [50, 55], [80, 80]]  // Jeff
];

const allExams = [
    [[95, 90], [88, 85], [90, 92], [95, 95]], // Alice
    [[80, 85], [70, 75], [80, 80], [90, null]], // Pedro
    [[70, 75], [60, 65], [70, 75], [80, 85]]  // Jeff
];

const urlParams = new URLSearchParams(window.location.search);
const studentId = urlParams.get('id');

function calculateWeighted(scores, weightPercentage) {
    let sum = 0;
    let count = 0;
    for (let score of scores) {
        if (score !== null) {
            sum += score;
            count++;
        }
    }
    const avg = count > 0 ? (sum / count) : 0;
    const weighted = (avg * (weightPercentage / 100));
    return { avg: Math.round(avg), weighted: weighted.toFixed(2) };
}

function displayDetailedGrades() {
    const container = document.getElementById('details-container');
    const id = parseInt(studentId);

    if (isNaN(id) || id >= allAssignments.length) {
        container.innerHTML = "<h2>Student data not found.</h2>";
        return;
    }

    let htmlOutput = `<h2>Detailed Assessment for Student ID: ${id}</h2>`;

    
    for (let courseIdx = 0; courseIdx < 4; courseIdx++) {
        const assignData = calculateWeighted(allAssignments[id][courseIdx], 30);
        const quizData = calculateWeighted(allQuizzes[id][courseIdx], 20);
        const examData = calculateWeighted(allExams[id][courseIdx], 50);

        const totalWeighted = (parseFloat(assignData.weighted) + parseFloat(quizData.weighted) + parseFloat(examData.weighted)).toFixed(2);

        // Console Log per course as required
        console.log(`Student ${id}, Course ${courseIdx + 1}: Total Weighted ${totalWeighted}%`);

        htmlOutput += `
            <h3>Course ${courseIdx + 1}</h3>
            <table class="details-table">
                <tr><th>Type</th><th>Grades</th><th>Avg</th><th>Weighted (Contribution)</th></tr>
                <tr><td>Assignments (30%)</td><td>${allAssignments[id][courseIdx].join(", ")}</td><td>${assignData.avg}</td><td>${assignData.weighted}%</td></tr>
                <tr><td>Quizzes (20%)</td><td>${allQuizzes[id][courseIdx].join(", ")}</td><td>${quizData.avg}</td><td>${quizData.weighted}%</td></tr>
                <tr><td>Exams (50%)</td><td>${allExams[id][courseIdx].join(", ")}</td><td>${examData.avg}</td><td>${examData.weighted}%</td></tr>
                <tr class="total-row"><td><strong>Course Total</strong></td><td colspan="3"><strong>${totalWeighted}%</strong></td></tr>
            </table>
            <br>`;
    }

    container.innerHTML = htmlOutput;
}

displayDetailedGrades();