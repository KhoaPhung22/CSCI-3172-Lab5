//1. Create the variables for fictional person
let age= 30
let personName ="Christopher Columbis"
let isStudent =true
if(isStudent =true){
    console.log(personName + "is currently enrolled as a student");
} else{
    console.log(personName + "is not an erolled student");
}
let futureAge = age +8
let message = personName+ " is "+ age+ " years old, after 8 years, he will be "+ futureAge;
document.getElementById("output").innerText =message;