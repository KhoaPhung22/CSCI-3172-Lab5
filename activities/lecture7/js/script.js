// Get the current time and hour
// HINT: you will have to first get the full date and then get the time and hour of the day
// You may explore the use of JS built-in functions

// Compute the current date/time and extract the hour
const now = new Date();
const hours = now.getHours();
const minutes = now.getMinutes();
var ampm = ""; 
// Check the time is AM or PM
if (hours >= 12) {
  ampm = "PM";
} else {
  ampm = "AM";
}
var displayHour = 0; // Initialize a variable for the 12-hour clock

if (hours % 12 === 0) {
  displayHour = 12; // Handle midnight or noon
} else {
  displayHour = hours % 12;
}
const timeString = `${displayHour}:${minutes.toString().padStart(2, '0')} ${ampm}`;

// Create a variable to store your greeting message
let greeting = 'Welcome';

// say 'Good Morning' if it is earlier than 12PM
if (hours < 12) {
  greeting = 'Good Morning';
}
// than 3PM and let the visitor know
// 'Hey! I think we are in class!'
else if (hours < 15) {
  greeting = "Hey! I think we are in class!";
}
// For any other time (i.e., later than 3PM, we just want to say 'Welcome'
else {
  greeting = 'Welcome';
}

// Update the DOM to show the message and current time
const greetingEl = document.getElementById('greeting');
greetingEl.innerHTML = `${greeting} — It's ${timeString}.`;





// Create a variable to store your greeting message 



// Based on the hour you get, you need to set the conditions you want your script to check
// in order to render a specific message
// for now we want to say 'Good Morning' if it is earlier than 12PM



// otherwise we want to check if it is earlier than 3PM and let the visitor know
// 'Hey! I think we are in class!'



// For any other time (i.e., later than 3PM, we just want to say 'Welcome'




// This is an example of an if statement, or a conditional statement
// the JS interpreter checks if a conditions is true, if it is then it executes the code
// If the condition is FALSE, then it skips the code and moves onto the next one (i.e., our else if conditional)
// If that second condition is also FALSE then it moves to our last conditional, our else statement
// IF statements always end in an ELSE statement, if you want to give options in-between we always use ELSE IF



// Then, we use the DOM, and calling the 'getElementById( )' method and its innerHTML property to add some HTML for us onto our webpage
// we basically want to show the return result in <h2 id="greeting"></h2>




// In this section of our script, we want to access the values the user entered into our form
// and add them together
// First we declare our variables for the two values
let num1;
let nume2;


// Now, let's use the DOM now to access a value in our form and show it back to us in an alert( ) box
// First, we'll creatr a function to store the input values into the variables we declared
// We'll enclose that code block in a function, getNumbers( )

    // Store the values from the form into the variables we declared above
function getNumbers() {
  num1 = parseFloat(document.getElementById('number1').value);
  num2 = parseFloat(document.getElementById('number2').value);
} 
 

	// Call the getNumbers() function to import the values the user enteres into the form into 
	// this function
	
	// We perform our addition on the two values
	function calculate(op) {
    getNumbers(); // Ensure we have the latest numbers
    if (isNaN(num1) || isNaN(num2)) {
      alert('Please enter valid numbers in both fields.');
      return;
    }
    let result =0;
    if (op === 'add') {
      result = num1 + num2;
    } else if (op === 'subtract') {
      result = num1 - num2;
    } else if (op === 'multiply') {
      result = num1 * num2;
    } else if (op === 'divide') {
      if (num2 === 0) {
        alert('Cannot divide by zero.');
        return;
      } else {
        result = num1 / num2;
      }
    }
    showResult('Result: ' + result);
  }
    // Display the result of the calculation
   

	// Display the result of the calculation
function showResult(message) {
  var el = document.getElementById('calcResult');
  el.textContent = message;
}
document.getElementById('addBtn').onclick = function() { calculate('add'); };
document.getElementById('subtractBtn').onclick = function() { calculate('subtract'); };
document.getElementById('multiplyBtn').onclick = function() { calculate('multiply'); };
document.getElementById('divideBtn').onclick = function() { calculate('divide'); };

function evenOddArray() {
  var input = document.getElementById('arrayInput').value;
  var items = input.split(',');
  var numbers = [];
  
  for (var i = 0; i < items.length; i++) {
    var clean = items[i].trim();
    if (clean != "") {
      numbers.push(Number(clean));
    }
  }
  if (numbers.length == 0) {
    showArrayResult('Please enter a comma-separated list of numbers.', true);
  } else {
    if (numbers.length % 2 == 0) {
      showArrayResult('even', false);
    } else {
      showArrayResult('odd', false);
    }
  }
}
function showArrayResult(message, isError) {
  var el = document.getElementById('arrayResult');
  el.textContent = message;
  
  if (isError == true) {
    el.className = 'error';
  } else {
    el.className = '';
  }
}
document.getElementById('arrayCountBtn').onclick = evenOddArray;
//Count even odd items in array
function evenOddArrayItems() {
  var input = document.getElementById('arrayInput').value;
  var items = input.split(',');
  var resultsArray = [];    
  
  for (var i = 0; i < items.length; i++) {
    var item = items[i].trim();
    if(item%2===0){
      resultsArray.push('even');
    }else{
      resultsArray.push('odd');
    }
  }
  showArrayResult(resultsArray.join(', '), false);
}
document.getElementById('arrayItemsBtn').onclick = evenOddArrayItems;





