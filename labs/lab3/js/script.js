const inventory = [
    { name: "Phoenix Wand", type: "wand", price: 50, quantity: 5, description: "Core of phoenix feather." },
    { name: "Phoenix Wand", type: "wand", price: 50, quantity: 5, description: "Core of phoenix feather." },
    { name: "Renela's Wand", type: "wand", price: 250, quantity: 5, description: "Wand of the window women." },
    { name: "Dragon Scale Armor", type: "armor", price: 120, quantity: 3, description: "Lightweight armor made from dragon scales." },
    { name: "Goblin Staff", type: "staff", price: 30, quantity: 10, description: "A simple staff used by goblins." },
    { name: "Unicorn Horn", type: "artifact", price: 200, quantity: 2, description: "A magical horn from a unicorn." },
    { name: "Fireball Scroll", type: "scroll", price: 15, quantity: 25, description: "A scroll that casts a fireball spell." },
    { name: "Healing Potion", type: "potion", price: 25, quantity: 30, description: "Restores health when consumed." },
    { name: "Invisibility Cloak", type: "clothing", price: 80, quantity: 4, description: "Makes the wearer invisible for a short time." },
    { name: "Magic Ring of Strength", type:"ring", price :75 ,quantity :6 ,description:"Increases the wearer's strength by 2 points."},
];
// Create fuction to add new items to the inventory
function addItem(name, type, price, quantity, description) {
    const newItem = { name, type, price, quantity, description };
    inventory.push(newItem);
    console.log(`Added ${name} to inventory.`);
    calculateTotalValue();
}
// Event to add new item to inventory
document.getElementById("addBtn").addEventListener("click", function(event) {
    event.preventDefault();
    const name = document.getElementById("newName").value;
    const type = document.getElementById("newType").value;
    const price = parseFloat(document.getElementById("newPrice").value);
    const quantity = parseInt(document.getElementById("newQuantity").value);
    const description = document.getElementById("newDescription").value;
    addItem(name, type, price, quantity, description);
    listItems();
    // Clear form fields after submission
    // Manual clear since we are using a section, not a form
    document.getElementById("newName").value = '';
    document.getElementById("newType").value = '';
    document.getElementById("newPrice").value = '';
    document.getElementById("newQuantity").value = '';
    document.getElementById("newDescription").value = '';
});

function listItems() {
    const inventoryList = document.getElementById("displayArea");
    inventoryList.innerHTML = "";
    inventory.forEach(item => {
        const itemElement = document.createElement("div");
        itemElement.classList.add("inventory-item");
        itemElement.innerHTML = `<h4>${item.name}</h4><p><strong>Type:</strong> ${item.type}</p><p><strong>Price:</strong> <span class="price">${item.price} gold</span></p><p><strong>Quantity:</strong> <span class="quantity">${item.quantity}</span></p><p><strong>Description:</strong> ${item.description}</p>`;
        
        //Adding the remove button for each element
        const removeBtn = document.createElement("button");
        removeBtn.textContent = "Remove Item";
        removeBtn.classList.add("remove-btn");
        removeBtn.addEventListener("click", function() {
            removeItem(item.name);
            listItems();
        });
        itemElement.appendChild(removeBtn);
        inventoryList.appendChild(itemElement);
    });
}
// Display inventory on page load
listItems();

//remove Item from inventory
function removeItem(name){
    const index =inventory.findIndex(item => item.name === name);
    if(index !==-1){
        inventory.splice(index,1);
        console.log(`Removed ${name} from inventory.`);
    }
    calculateTotalValue();
}
//get Item function
function getItem(itemName) {
    const foundItem = inventory.find(item => 
        item.name.toLowerCase() === itemName.toLowerCase()
    );

    // Return the object if found, otherwise it returns undefined 
    return foundItem;
}
// Seaarch item based on name or type
function searchItems(name) {
    const foundItems = inventory.filter(item => 
        item.name.toLowerCase().includes(name.toLowerCase()) ||
        item.type.toLowerCase().includes(name.toLowerCase())
    );
    return foundItems;
}
// Event listener for search button
document.getElementById("searchBtn").addEventListener("click", function() {
    const searchTerm = document.getElementById("searchInput").value;
    const results = searchItems(searchTerm);
    const inventoryList = document.getElementById("displayArea");
    inventoryList.innerHTML = "";
    if (searchTerm === "") {
        alert("Please enter a name or type to search."); // Error handling 
        return; // Stops the function from running further
    }
    if(results.length > 0){
        results.forEach(item => {
            const itemElement = document.createElement("div");  
            itemElement.classList.add("inventory-item");
            itemElement.innerHTML = `<h4>${item.name}</h4><p><strong>Type:</strong> ${item.type}</p><p><strong>Price:</strong> <span class="price">${item.price} gold</span></p><p><strong>Quantity:</strong> <span class="quantity">${item.quantity}</span></p><p><strong>Description:</strong> ${item.description}</p>`;
            
            // Add remove button for search results
            const removeBtn = document.createElement("button");
            removeBtn.textContent = "Remove Item";
            removeBtn.classList.add("remove-btn");
            removeBtn.addEventListener("click", function() {
                removeItem(item.name);
                // Re-run search to update display
                document.getElementById("searchBtn").click();
            });
            itemElement.appendChild(removeBtn);
            
            inventoryList.appendChild(itemElement);
            console.log(`Found item: ${item.name}`);
        });
    } else {
        inventoryList.innerHTML = "<p>No items found.</p>";
    }
});

// Event listener for Show All Items button
document.getElementById("showAllBtn").addEventListener("click", function() {
    document.getElementById("searchInput").value = "";
    listItems();
});

//function to calculate the total value
function calculateTotalValue(){
    const totalValue = inventory.reduce((total,item) => total + (item.price * item.quantity), 0);
    console.log(`Total inventory value: ${totalValue} gold`);
    document.getElementById("totalValue").textContent = totalValue.toFixed(2);
}
calculateTotalValue();

// Groups items by their type and displays the result on the page.
function groupByCategory(){
    const groupedMap = new Map();
    inventory.forEach(item => {
        if(!groupedMap.has(item.type)){
            groupedMap.set(item.type, []);
        }
        groupedMap.get(item.type).push(item);
    });
    displayGroupedInventory(groupedMap);
    return groupedMap;
}
// Function to display the grouped inventory on the page
function displayGroupedInventory(groupedData) {
    const displayArea = document.getElementById("groupedDisplayArea");
    displayArea.innerHTML = "<h2>Inventory by Category</h2>";

    // Iterate through the Map (key = type, value = items array)
    groupedData.forEach((items, type) => {
        // Create a container for the category
        const categorySection = document.createElement("div");
        categorySection.classList.add("category-group");
        
        categorySection.innerHTML = `<h3>Category: ${type}</h3>`;
        
        // Use your existing renderItems logic or build a simple list
        const itemList = document.createElement("ul");
        items.forEach(item => {
            const li = document.createElement("li");
            li.textContent = `${item.name} - $${item.price} (${item.quantity} in stock)`;
            itemList.appendChild(li);
        });

        categorySection.appendChild(itemList);
        displayArea.appendChild(categorySection);
    });
}
// Event listener for Group by Category button
document.getElementById("groupBtn").addEventListener("click", groupByCategory);

// FInd Duplicate items based on name and type
function findDuplicates() {
    const seen = new Set();
    const duplicates = new Set();
    inventory.forEach(item => {
        const identifier = `${item.name.toLowerCase()}-${item.type.toLowerCase()}`;
        if (seen.has(identifier)) {
            duplicates.add(identifier);
        } else {
            seen.add(identifier);
        }  
    });
    return Array.from(duplicates).map(id => {
        const [name, type] = id.split("-");
        return inventory.find(item => item.name.toLowerCase() === name && item.type.toLowerCase() === type);
    });
}
// Any duplicate items will be logged to the console, and if no duplicates are found, a message will indicate that as well.
const duplicateItems = findDuplicates();
if (duplicateItems.length > 0) {
    console.log("Duplicate items found:");
    duplicateItems.forEach(item => console.log(`- ${item.name} (${item.type})`));
} else {
    console.log("No duplicate items found.");
}