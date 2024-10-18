// Initialize quotes array (if not present in localStorage, use default)
let quotes = JSON.parse(localStorage.getItem('quotes')) || [
    { text: "The greatest glory in living lies not in never falling, but in rising every time we fall.", category: "Motivation" },
    { text: "Life is what happens when you're busy making other plans.", category: "Life" },
    { text: "Get busy living or get busy dying.", category: "Motivation" },
    { text: "You only live once, but if you do it right, once is enough.", category: "Life" }
  ];
  
  // Function to display a random quote
  function showRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex];
  
    // Use sessionStorage to store the last viewed quote
    sessionStorage.setItem('lastQuote', JSON.stringify(quote));
  
    document.getElementById("quoteDisplay").innerHTML = `<p>"${quote.text}" - <em>Category: ${quote.category}</em></p>`;
  }
  
  // Function to add a new quote
  function addQuote() {
    const newQuoteText = document.getElementById("newQuoteText").value;
    const newQuoteCategory = document.getElementById("newQuoteCategory").value;
    
    if (newQuoteText && newQuoteCategory) {
      quotes.push({ text: newQuoteText, category: newQuoteCategory });
      
      // Save quotes array to localStorage
      saveQuotes();
  
      // Update the quote display to show the new quote
      document.getElementById("quoteDisplay").innerHTML = `<p>"${newQuoteText}" - <em>Category: ${newQuoteCategory}</em></p>`;
      
      alert("Quote added successfully!");
  
      // Clear input fields after adding the quote
      document.getElementById("newQuoteText").value = "";
      document.getElementById("newQuoteCategory").value = "";
    } else {
      alert("Please fill out both fields.");
    }
  }
  
  // Function to save the quotes array to localStorage
  function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
  }
  
  // Function to export quotes as a JSON file
  function exportQuotesToJson() {
    const dataStr = JSON.stringify(quotes, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
  
    const a = document.createElement('a');
    a.href = url;
    a.download = "quotes.json";
    a.click();
  
    URL.revokeObjectURL(url);
  }
  
  // Function to import quotes from a JSON file
  function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function(event) {
      const importedQuotes = JSON.parse(event.target.result);
      quotes.push(...importedQuotes); // Merge imported quotes with existing ones
  
      // Save the merged quotes array to localStorage
      saveQuotes();
  
      alert('Quotes imported successfully!');
    };
    fileReader.readAsText(event.target.files[0]);
  }
  
  // Function to create the form for adding quotes and buttons for export/import
  function createAddQuoteForm() {
    const formContainer = document.createElement('div');
    formContainer.innerHTML = `
      <input id="newQuoteText" type="text" placeholder="Enter a new quote" />
      <input id="newQuoteCategory" type="text" placeholder="Enter quote category" />
      <button id="addQuoteButton">Add Quote</button>
      <button id="exportButton">Export Quotes to JSON</button>
      <input type="file" id="importFile" accept=".json" />
    `;
    document.body.appendChild(formContainer);
  
    // Add event listener to the new quote button
    document.getElementById("addQuoteButton").addEventListener("click", addQuote);
  
    // Add event listener for the export button
    document.getElementById("exportButton").addEventListener("click", exportQuotesToJson);
  
    // Add event listener for the import file input
    document.getElementById("importFile").addEventListener("change", importFromJsonFile);
  }
  
  // Event listener for the 'Show New Quote' button
  document.getElementById("newQuote").addEventListener("click", showRandomQuote);
  
  // Initialize the app by displaying a random quote and creating the add quote form
  showRandomQuote();
  createAddQuoteForm();
  
  // Optionally, restore the last viewed quote from sessionStorage (if available)
  if (sessionStorage.getItem('lastQuote')) {
    const lastQuote = JSON.parse(sessionStorage.getItem('lastQuote'));
    document.getElementById("quoteDisplay").innerHTML = `<p>"${lastQuote.text}" - <em>Category: ${lastQuote.category}</em></p>`;
  }
  