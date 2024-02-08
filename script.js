// JavaScript code to handle form submission and display shortened URL
document.addEventListener('DOMContentLoaded', () => {
    const shortenForm = document.querySelector('form'); // Select the form element
    const shortUrlContainer = document.getElementById('shortUrlContainer'); // Select the container to display shortened URL
    
    // Event listener for form submission
    shortenForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Prevent default form submission
        
        const originalUrlInput = document.getElementById('originalurl'); // Select input field for original URL
        const originalUrl = originalUrlInput.value.trim(); // Get the value of the input field
        
        // Check if the input field is not empty
        if (originalUrl) {
            try {
                // Send a POST request to the server to shorten the URL
                const response = await fetch('/shorten', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ originalurl: originalUrl })
                });

                // If response is successful, extract JSON data
                if (response.ok) {
                    const data = await response.json();
                    // Display the shortened URL in the container
                    shortUrlContainer.innerHTML = `<p>Shortened URL: <a href="${data.shorturl}" target="_blank">${data.shorturl}</a></p>`;
                } else {
                    throw new Error('Failed to shorten URL');
                }
            } catch (error) {
                console.error('Error:', error);
            }
        } else {
            alert('Please enter a valid URL');
        }
    });
});
