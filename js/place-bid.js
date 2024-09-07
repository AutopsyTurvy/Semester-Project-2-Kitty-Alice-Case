




// Start of "bid" button-




document.querySelector('.bid-button').addEventListener('click', function() {
    const bidAmount = document.querySelector('#bid-amount').value;
    if (bidAmount) {
       
        console.log('Bid submitted:', bidAmount);
       
    } else {
        alert('Please enter a valid bid amount.');
    }
});