// put all infromation in the form in an array to loop through it and add event listener to each element in the array
const inputIds = [
    firstName = document.getElementById('firstName'), 
    lastName = document.getElementById('lastName'), 
    email = document.getElementById('email')];

    //Function to handle focus event change color to orange while focusing on the input field and log to console
function handleFocus(event) {
    for (let i = 0; i < inputIds.length; i++) {
        if (event.target === inputIds[i]) {
            inputIds[i].style.backgroundColor = '#ea8622';
            // Log to console when the input field is focused
            console.log('Input field focused');
}
}
}
// Function to handle blur event change color to light gray while blurring on the input field and log to console
function handleBlur(event) {
     for (let i = 0; i < inputIds.length; i++) {
        if (event.target === inputIds[i]) {
            inputIds[i].style.backgroundColor = '';
            // Log to console when the input field is blurred
            console.log('Input field blurred');
}
}
}

//Add Event listener for focus event
for (let i = 0; i < inputIds.length; i++) {
    inputIds[i].addEventListener('focus', handleFocus);
}

//Add Event listener for blur event
for (let i = 0; i < inputIds.length; i++) {
    inputIds[i].addEventListener('blur', handleBlur);
}


