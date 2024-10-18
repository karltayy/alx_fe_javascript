// Initialize quotes array (if not present in localStorage, use default)
let quotes = JSON.parse(localStorage.getItem('quotes')) || [
    { text: "The greatest glory in living lies not in never falling, but in rising every time we fall.", category: "Motivation" },
    { text: "Life is what happens when you're busy making other plans.", category: "Life" },
    { text: "Get busy living or get busy dying.", category: "Motivation" },
    { text: "You only live once, but if you do it right, once is enough.", category: "Life" }
  ];
  
  // Initialize categories array from quotes
  let categories = [...new Set(quotes.map(quote => quote.category))];
  
  const serverUrl = 'https://jsonplaceholder.typicode.com/posts'; // Replace with your server URL
  
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
  async function addQuote() {
    const newQuoteText = document.getElementById("newQuoteText").value;
    const newQuoteCategory = document.getElementById("newQuoteCategory").value;
    
    if (newQuoteText && newQuoteCategory) {
      quotes.push({ text: newQuoteText, category: newQuoteCategory });
      
      // Update quotes in localStorage
      await saveQuotes();
  
      // Check if the new category needs to be added to the dropdown
      if (!categories.includes(newQuoteCategory)) {
        categories.push(newQuoteCategory);
        populateCategories(); // Update dropdown
      }
  
      // Post new quote to server
      await postQuoteToServer({ text: newQuoteText, category: newQuoteCategory });
  
      // Clear input fields after adding the quote
      document.getElementById("newQuoteText").value = "";
      document.getElementById("newQuoteCategory").value = "";
      
      alert("Quote added successfully!");
    } else {
      alert("Please fill out both fields.");
    }
  }
  
  // Function to save the quotes array to localStorage
  async function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
  }
  
  // Function to simulate posting data to the server
  async function postQuoteToServer(quote) {
    try {
      const response = await fetch(serverUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(quote),
      });
      
      const result = await response.json();
      console.log('Quote posted to server:', result);
    } catch (error) {
      console.error('Error posting quote to server:', error);
    }
  }
  
  // Function to simulate fetching data from the server
  async function fetchQuotesFromServer() {
    try {
      const response = await fetch(serverUrl);
      const serverQuotes = await response.json();
  
      // Assuming the server responds with an array of quotes
      handleServerSync(serverQuotes);
    } catch (error) {
      console.error('Error fetching quotes from server:', error);
    }
  }
  
  // Function to periodically fetch server updates
  function startServerSync() {
    setInterval(fetchQuotesFromServer, 30000); // Every 30 seconds
  }
  
  // Start sync when the page loads
  startServerSync();
  
  // Function to handle synchronization between local and server data
  function handleServerSync(serverQuotes) {
    const localQuotes = JSON.parse(localStorage.getItem('quotes')) || [];
    
    // Check for new or modified quotes
    const mergedQuotes = mergeQuotes(localQuotes, serverQuotes);
  
    // Save merged quotes back to local storage
    localStorage.setItem('quotes', JSON.stringify(mergedQuotes));
    
    // Re-populate categories and update the UI
    categories = [...new Set(mergedQuotes.map(quote => quote.category))];
    populateCategories();
    filterQuotes();
  }
  
  // Simple merging logic where server data takes precedence
  function mergeQuotes(localQuotes, serverQuotes) {
    const quoteMap = new Map();
    
    localQuotes.forEach(quote => {
      quoteMap.set(quote.text, quote); // Use text as the unique key
    });
    
    serverQuotes.forEach(quote => {
      quoteMap.set(quote.title, quote); // Server quotes take precedence (adjust if necessary)
    });
    
    return Array.from(quoteMap.values());
  }
  
  // Function to handle conflict resolution
  function handleConflictResolution(localQuote, serverQuote) {
    const userChoice = confirm(`Conflict detected between local and server versions of the quote: 
      "${localQuote.text}"
      - Server version: ${serverQuote.text} (Category: ${serverQuote.category})
      - Local version: ${localQuote.text} (Category: ${localQuote.category})
      Do you want to keep the server version?`);
    
    return userChoice ? serverQuote : localQuote;
  }
  
  // Enhanced merge function with manual conflict resolution
  function mergeQuotesWithConflicts(localQuotes, serverQuotes) {
    const quoteMap = new Map();
    
    localQuotes.forEach(quote => {
      quoteMap.set(quote.text, quote); // Use text as the unique key
    });
    
    serverQuotes.forEach(serverQuote => {
      if (quoteMap.has(serverQuote.title)) {
        const localQuote = quoteMap.get(serverQuote.title);
        
        // Resolve conflict manually if both local and server have the same quote text
        const resolvedQuote = handleConflictResolution(localQuote, serverQuote);
        quoteMap.set(serverQuote.title, resolvedQuote);
      } else {
        quoteMap.set(serverQuote.title, serverQuote); // No conflict, add server quote
      }
    });
    
    return Array.from(quoteMap.values());
  }
  
  // Function to show notifications to the user
  function showNotification(message) {
    const notificationElement = document.createElement('div');
    notificationElement.className = 'notification';
    notificationElement.innerHTML = message;
    document.body.appendChild(notificationElement);
  
    // Automatically hide after 5 seconds
    setTimeout(() => {
      notificationElement.remove();
    }, 5000);
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
  
  // Event listener for the 'Show New Quote' button
  document.getElementById("newQuote").addEventListener("click", filterQuotes);
  
  // Initialize the app by populating categories and creating the add quote form
  populateCategories();
  