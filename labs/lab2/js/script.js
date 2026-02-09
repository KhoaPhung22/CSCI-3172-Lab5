const studentNames = ["Alice", "Pedro", "Jeff", "Laura", "Sam", "Maria", "Chris", "Pat"];
const courseGrades = [
    [89, 79, 94, 90], // Alice
    [77, 81, 89, null], // Pedro (Missing one grade) 
    [73, null, 71, 85], // Jeff (Missing one grade) 
    [80, 91, 63, 78], // Laura
    [92, 88, 95, 91], // Sam
    [70, 72, 68, 75], // Maria
    [85, 80, 82, 88], // Chris
    [60, 65, 58, 62]  // Pat
];
function calculateAvegGrade(grades) {
    let total = 0;
    let count = 0;
    for(let i =0; i<grades.length; i++) {
        if(grades[i] !== null) {
            total += grades[i];
            count++;
        }
    }
    if(count === 0) return 0; // Avoid division by zero
    return Math.round(total / count);
}
function getLetterGrade(average) {
    if (average >= 90) return "A+";
    if (average >= 85) return "A";
    if (average >= 80) return "A-";
    if (average >= 77) return "B+";
    if (average >= 73) return "B";
    if (average >= 70) return "B-";
    if (average >= 65) return "C+";
    if (average >= 60) return "C";
    if (average >= 55) return "C-";
    if (average >= 50) return "D";
    else return "F";
}
function displayStudentGrades() {
    const tableBody =document.getElementById('student-data');
    for(let i = 0; i < studentNames.length; i++) {
        const average = calculateAvegGrade(courseGrades[i]);
        const letterGrade = getLetterGrade(average);
        console.log(`Student: ${studentNames[i]}, Avg: ${average}, Grade: ${letterGrade}`);
        let row = `<tr>`;
        if (i < 3) {
            row += `<td><a href="details.html?id=${i}">${studentNames[i]}</a></td>`;
        } else {
            row += `<td>${studentNames[i]}</td>`;
        }
        for (let j = 0; j < 4; j++) {
            row += `<td>${courseGrades[i][j] ?? "N/A"}</td>`;
        }

        row += `<td>${average}</td><td>${letterGrade}</td></tr>`;
        tableBody.innerHTML += row;
    }
}
displayStudentGrades();
