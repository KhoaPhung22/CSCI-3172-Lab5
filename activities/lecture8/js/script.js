// In this example, I want to create an interactive form that allows Newt Scamander create a sort of inventory of the Fantastic Beasts he's rescuing
// Here's what we'll need to do:
// 1. Grab the input a user enters into our form
const addForm = document.querySelector('#addCreatureForm');
const searchForm = document.getElementById('searchCreatureForm');
const searchInput = document.getElementById('creatureSearch');

const creatureName = document.getElementById('creatureName');
const creatureType = document.getElementById('creatureType');
const creatureHabitat = document.getElementById('creatureHabitat');

const creatureNotes = document.getElementById('creatureNotes');
//Function to display
function renderSanctuary(listToDisplay) {
    const sanctuary = document.getElementById('creatureSanctuary');
    sanctuary.innerHTML = `
        <h2>Creature Sanctuary</h2>
        <ul>
            ${listToDisplay.map(creature => `
                <li>
                    <strong>${creature.name}</strong> - a ${creature.type} 
                    (Lives in: ${creature.habitat})
                    <br><em>Notes: ${creature.notes ? creature.notes : "No notes added."}</em>
                </li>
            `).join('')}
        </ul>
    `;
}
let creaturesList = [];
addForm.addEventListener('submit', function(event) {
    event.preventDefault()
// 2. Represent this input in a meaningful way, let's say an Object
    let userNote = prompt(`Any special behavior notes for the ${name}?`, "Friendly but shy");
    const creatures = {
        name: creatureName.value,
        type: creatureType.value,
        habitat: creatureHabitat.value,
        notes: userNote
}
// 3. Push the contents of that Object into an Array 
    creaturesList.push(creatures);
// 4. Reset our form so that the user can add a new creature if they want without having to manually delete the previous input
    addForm.reset();
// 5. Display the new creature in our Array back to the user on our page
    renderSanctuary(creaturesList);
});
// Extend the functionality of our script, here are some ideas but do feel free to explore options:
// Add a "Remove Creature" feature.
addForm.removeCreatureBtn.addEventListener('click', function() {
    creaturesList.pop();
    renderSanctuary(creaturesList);
});

// Add a search functionality to find creatures by name or type.

function searchCreatures(query) {
    const lowerQuery = query.toLowerCase();
    return creaturesList.filter(creature => 
        creature.name.toLowerCase().includes(lowerQuery) || 
        creature.type.toLowerCase().includes(lowerQuery) ||
        creature.notes.toLowerCase().includes(lowerQuery)
    );
}
searchForm.addEventListener('input', function(event) {
    // We don't need preventDefault on 'input'
    const query = searchInput.value;
    const results = searchCreatures(query);
    renderSanctuary(results);
});

// // 3. Prevent Search Form from refreshing on Enter key
searchForm.addEventListener('submit', function(event) {
    event.preventDefault();
});
// Allow users to add "notes" about each creature.
