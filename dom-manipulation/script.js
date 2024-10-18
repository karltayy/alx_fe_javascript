// Initialize quotes array (if not present in localStorage, use default)
let quotes = JSON.parse(localStorage.getItem('quotes')) || [
    { text: "The greatest glory in living lies not in never falling, but in rising every time we fall.", category: "Motivation" },
    { text: "Life is what happens when you're busy making other plans.", category: "Life" },
    { text: "Get busy living or get busy dying.", category: "Motivation" },
    { text: "You only live once, but if you do it right, once is enough.", category: "Life" }
  ];
  
  // Initialize categories array from quotes
  let categories = [...new Set(quotes.map(quote => quote.category))];
  
  // Function to populate categories in the dropdown
  function populateCategories() {
    const categoryFilter = document.getElementById("categoryFilter");
    
    // Clear existing options
    categoryFilter.innerHTML = '<option value="all">All Categories</option>';
    
    // Add categories to the dropdown
    categories.forEach(category => {
      const option = document.createElement('option');
      option.value = category;
      option.textContent = category;
      categoryFilter.appendChild(option);
    });
  
    // Restore the last selected category from localStorage
    const savedCategory = localStorage.getItem('selectedCategory');
    if (savedCategory) {
      categoryFilter.value = savedCategory;
      filterQuotes(); // Apply the filter immediately
    }
  }
  
  // Function to filter quotes based on selected category
  function filterQuotes() {
    const selectedCategory = document.getElementById("categoryFilter").value;
    
    // Save the selected category in localStorage
    localStorage.setItem('selectedCategory', selectedCategory);
  
    let filteredQuotes = quotes;
  
    // Filter quotes based on the selected category, unless 'all' is selected
    if (selectedCategory !== 'all') {
      filteredQuotes = quotes.filter(quote => quote.category === selectedCategory);
    }
  
    // Display a random quote from the filtered list
    if (filteredQuotes.length > 0) {
      const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
      const quote = filteredQuotes[randomIndex];
      document.getElementById("quoteDisplay").innerHTML = `<p>"${quote.text}" - <em>Category: ${quote.category}</em></p>`;
    } else {
      document.getElementById("quoteDisplay").innerHTML = "<p>No quotes available in this category.</p>";
    }
  }
  
  // Function to add a new quote and update categories dynamically
  function addQuote() {
    const newQuoteText = document.getElementById("newQuoteText").value;
    const newQuoteCategory = document.getElementById("newQuoteCategory").value;
    
    if (newQuoteText && newQuoteCategory) {
      quotes.push({ text: newQuoteText, category: newQuoteCategory });
      
      // Update quotes in localStorage
      saveQuotes();
  
      // Check if the new category needs to be added to the dropdown
      if (!categories.includes(newQuoteCategory)) {
        categories.push(newQuoteCategory);
        populateCategories(); // Update dropdown
      }
  
      // Clear input fields after adding the quote
      document.getElementById("newQuoteText").value = "";
      document.getElementById("newQuoteCategory").value = "";
      
      alert("Quote added successfully!");
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
  
      // Update quotes and categories
      saveQuotes();
      categories = [...new Set(quotes.map(quote => quote.category))]; // Update categories
      populateCategories();
  
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
  document.getElementById("newQuote").addEventListener("click", filterQuotes);
  
  // Initialize the app by populating categories and creating the add quote form
  populateCategories();
  createAddQuoteForm();
  