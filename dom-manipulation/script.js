// Array to store quotes
let quotes = [
    { text: "The greatest glory in living lies not in never falling, but in rising every time we fall.", category: "Motivation" },
    { text: "Life is what happens when you're busy making other plans.", category: "Life" },
    { text: "Get busy living or get busy dying.", category: "Motivation" },
    { text: "You only live once, but if you do it right, once is enough.", category: "Life" }
  ];
  
  // Function to display a random quote
  function showRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex];
    document.getElementById("quoteDisplay").innerHTML = `<p>"${quote.text}" - <em>Category: ${quote.category}</em></p>`;
  }
  
  // Function to add a new quote
  function addQuote() {
    const newQuoteText = document.getElementById("newQuoteText").value;
    const newQuoteCategory = document.getElementById("newQuoteCategory").value;
    
    if (newQuoteText && newQuoteCategory) {
      quotes.push({ text: newQuoteText, category: newQuoteCategory });
      
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
  
  // Event listener for the 'Show New Quote' button
  document.getElementById("newQuote").addEventListener("click", showRandomQuote);
  
  // Initial display of a random quote
  showRandomQuote();
  