// Magic 8-Ball answers array
const magic8Answers = [
	"It is certain",
	"It is decidedly so",
	"Without a doubt",
	"Yes definitely",
	"You may rely on it",
	"As I see it, yes",
	"Most likely",
	"Outlook good",
	"Yes",
	"Signs point to yes",
	"Reply hazy, try again",
	"Ask again later",
	"Better not tell you now",
	"Cannot predict now",
	"Concentrate and ask again",
	"Don't count on it",
	"My reply is no",
	"My sources say no",
	"Outlook not so good",
	"Very doubtful"
];

// Fortune Cookie sayings array
const fortuneCookieAnswers = [
	"A journey of a thousand miles begins with a single step",
	"You will receive a pleasant surprise",
	"Good things come to those who wait",
	"Your kindness will be rewarded",
	"Believe and achieve",
	"A smile is the best way to face difficult things",
	"Every moment is a fresh beginning",
	"Wisdom comes to those who seek it",
	"The best time to plant a tree was 20 years ago, the next best is now",
	"Success is just around the corner",
	"Your talents are about to be recognized",
	"A pleasant surprise is waiting for you",
	"Opportunity knocks softly, so listen",
	"You will soon embark on a new adventure",
	"Better days are ahead",
	"Your potential is limitless",
	"Help others achieve their dreams",
	"Dream big and work hard",
	"Fortune favors the bold",
	"The happiness of your life depends upon the quality of your thoughts"
];

// Function to get a random answer from a given array
function askQuestion() {
    // 1. Get Inputs (Question & Radio Type)
    const questionInput = document.getElementById("userQuestion").value.trim();
    const selectedType = document.querySelector('input[name="fortune-type"]:checked');
    // 2. Checkif user input question
    if (!questionInput){
        console.log("No question asked");
        alert("Please enter a question.");
        return;
    }
    // 3. Determine which type of fortune to provide
    let answerArray;
    if (selectedType) {
        if (selectedType.value === "magic8") {
            answerArray = magic8Answers;
        }else if (selectedType.value === "fortuneCookie") {
            answerArray = fortuneCookieAnswers;
        }
    } else {
        alert("Please select a fortune type.");
        return;
    }
    // 4. Get a Random answer
    const randomIndex = Math.floor(Math.random() * answerArray.length);
    const randomAnswer = answerArray[randomIndex];
    // 5. Display the answer
    const answerElement = document.getElementById("answer");
    answerElement.innerText = `Question: ${questionInput}\nAnswer: ${randomAnswer}`;
}