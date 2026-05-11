let calculatedNetFare = 0;
let calculatedGrossFare = 0;

function calculateFare() {
    let gross_fare = parseFloat(document.getElementById('gross_fare').value);
    let base_fare = parseFloat(document.getElementById('base_fare').value);
    let iata_com = parseFloat(document.getElementById('iata_com').value);
    
    let markup_input = document.getElementById('markup_amount').value;
    let markup = markup_input === "" ? 0 : parseFloat(markup_input);

    if (isNaN(gross_fare) || isNaN(base_fare) || isNaN(iata_com)) {
        alert("Please enter Gross Fare, Base Fare and Commission.");
        return;
    }

    let AIT = (gross_fare * 0.3) / 100;
    let IATA_Commission = (base_fare * iata_com) / 100;
    let net_fare = (gross_fare + AIT - IATA_Commission) + markup;

    calculatedNetFare = Math.round(net_fare) + 1;
    calculatedGrossFare = gross_fare;

    document.getElementById('ait').innerText = "AIT (0.3%): " + AIT.toLocaleString();
    document.getElementById('iata').innerText = "IATA Commission: " + IATA_Commission.toLocaleString();
    document.getElementById('net').innerText = "Net Fare: " + net_fare.toLocaleString();

    document.getElementById('results').style.display = "block";
    document.getElementById('ticket-btn-container').style.display = "block";
}

function resetForm() {
    document.getElementById('gross_fare').value = "";
    document.getElementById('base_fare').value = "";
    document.getElementById('iata_com').value = "";
    document.getElementById('markup_amount').value = "";

    // Ticket Information inputs reset
    document.getElementById('segment_input').value = "";
    document.getElementById('baggage_input').value = "";
    document.getElementById('pax_count').value = "1";

    // Output hide
    document.getElementById('results').style.display = "none";
    document.getElementById('ticket-btn-container').style.display = "none";
    document.getElementById('ticket_output').style.display = "none";

    calculatedNetFare = 0;
    calculatedGrossFare = 0;
}

function openTicketModal() {
    document.getElementById('ticketModal').style.display = "flex";
    document.getElementById('ticket_output').style.display = "none";
    document.getElementById('pax_count').value = "1";
    document.getElementById('show_gross_fare').checked = false;
}

function closeTicketModal() {
    document.getElementById('ticketModal').style.display = "none";
}

function generateTicketInfo() {
    let segment = document.getElementById('segment_input').value.trim();
    let baggage = document.getElementById('baggage_input').value.trim();
    let pax = parseInt(document.getElementById('pax_count').value) || 1;
    let showGrossFare = document.getElementById('show_gross_fare').checked;

    if (!segment || !baggage) {
        alert("Please enter Segment & Baggage.");
        return;
    }

    let netFormatted = calculatedNetFare.toLocaleString('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    });

    let grossFormatted = calculatedGrossFare.toLocaleString('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    });

    let output = segment;

    // Gross Fare selected থাকলে Net Fare এর আগে দেখাবে
    if (showGrossFare) {
        output += "\n\nGross Fare: " + grossFormatted + ".00 (Per Pax)";
        if (pax > 1) {
            let totalGross = calculatedGrossFare * pax;
            let totalGrossFormatted = totalGross.toLocaleString('en-US', {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            });
            output += "\nTotal Gross: " + totalGrossFormatted + ".00 (" + pax + " Pax)";
        }
    }

    output += (showGrossFare ? "\n" : "\n\n") + "Net Fare: " + netFormatted + ".00 (Per Pax)";

    // ১ এর বেশি pax হলে total fare আলাদা লাইনে
    if (pax > 1) {
        let totalFare = calculatedNetFare * pax;
        let totalFormatted = totalFare.toLocaleString('en-US', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        });
        output += "\nTotal Fare: " + totalFormatted + ".00 (" + pax + " Pax)";
    }

    let baggageLines = baggage.split('\n').filter(l => l.trim() !== '');
    if (baggageLines.length === 1) {
        output += "\nBAG: " + baggageLines[0];
    } else {
        output += "\n" + baggageLines.join('\n');
    }

    document.getElementById('ticket_text').innerText = output;
    document.getElementById('ticket_output').style.display = "block";
}

function copyTicketInfo() {
    let text = document.getElementById('ticket_text').innerText;
    navigator.clipboard.writeText(text).then(() => {
        let btn = document.querySelector('.btn-copy');
        btn.innerHTML = '<i class="fa-solid fa-check"></i> Copied!';
        setTimeout(() => {
            btn.innerHTML = '<i class="fa-solid fa-copy"></i> Copy';
        }, 2000);
    });
}

// window.addEventListener('click', function(e) {
//     let modal = document.getElementById('ticketModal');
//     if (e.target === modal) closeTicketModal();
// });

// ===== PRANK FUNCTIONS =====
function openPrankModal() {
    document.getElementById('prankModal').style.display = "flex";
    startCountdown();
}

function closePrankModal() {
    document.getElementById('prankModal').style.display = "none";
}

function startCountdown() {
    let timeLeft = 300; // 5 minutes in seconds
    const countdownEl = document.getElementById('countdown');
    
    const interval = setInterval(() => {
        timeLeft--;
        let mins = Math.floor(timeLeft / 60);
        let secs = timeLeft % 60;
        countdownEl.textContent = `0${mins}:${secs.toString().padStart(2, '0')}`;
        
        if (timeLeft <= 0) {
            clearInterval(interval);
            countdownEl.textContent = "00:00";
        }
    }, 1000);
}

function prankPaymentFlow(method) {
    let methodNames = {
        'card': 'Credit Card Payment',
        'paypal': 'PayPal Payment',
        'apple': 'Apple Pay',
        'google': 'Google Pay'
    };
    
    document.getElementById('paymentTitle').textContent = methodNames[method];
    document.getElementById('prankModal').style.display = "none";
    document.getElementById('paymentModal').style.display = "flex";
}

function closePaymentModal() {
    document.getElementById('paymentModal').style.display = "none";
    document.getElementById('prankModal').style.display = "flex";
}

function processPayment(event) {
    event.preventDefault();
    
    // Simulate payment processing
    let btn = event.target.querySelector('button[type="submit"]');
    let originalText = btn.innerHTML;
    
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Processing...';
    
    // Simulate loading
    setTimeout(() => {
        btn.innerHTML = '<i class="fa-solid fa-check"></i> Verifying...';
    }, 1500);
    
    setTimeout(() => {
        document.getElementById('paymentModal').style.display = "none";
        showPrankMessage('success');
    }, 3000);
}

function showPrankMessage(type) {
    let icon, title, text;
    
    if (type === 'success') {
        icon = '<i class="fa-solid fa-circle-check success-icon"></i>';
        title = '✨ Payment Successful!';
        text = 'Congratulations! You\'ve been pranked! 😂<br>There is no premium version. Enjoy the free calculator! 🎉';
    } else {
        icon = '<i class="fa-solid fa-circle-xmark error-icon"></i>';
        title = 'Payment Failed!';
        text = 'Just kidding! This was all a harmless prank. 😄';
    }
    
    let messageContent = document.getElementById('messageContent');
    messageContent.innerHTML = icon + '<h3 id="messageTitle">' + title + '</h3><p id="messageText">' + text + '</p><button class="btn" onclick="closeMessageModal()" style="margin-top: 15px;"><i class="fa-solid fa-face-laughing"></i> Haha, Good One!</button>';
    
    document.getElementById('messageModal').style.display = "flex";
}

function closeMessageModal() {
    document.getElementById('messageModal').style.display = "none";
    closePrankModal();
}
