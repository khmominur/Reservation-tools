let calculatedNetFare = 0;

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

    calculatedNetFare = Math.round(net_fare) + 2;

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
    document.getElementById('results').style.display = "none";
    document.getElementById('ticket-btn-container').style.display = "none";
    document.getElementById('ticket_output').style.display = "none";
    calculatedNetFare = 0;
}

function openTicketModal() {
    document.getElementById('ticketModal').style.display = "flex";
    document.getElementById('ticket_output').style.display = "none";
    document.getElementById('pax_count').value = "1";
}

function closeTicketModal() {
    document.getElementById('ticketModal').style.display = "none";
}

function generateTicketInfo() {
    let segment = document.getElementById('segment_input').value.trim();
    let baggage = document.getElementById('baggage_input').value.trim();
    let pax = parseInt(document.getElementById('pax_count').value) || 1;

    if (!segment || !baggage) {
        alert("Please enter Segment & Baggage.");
        return;
    }

    let netFormatted = calculatedNetFare.toLocaleString('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    });

    let output = segment;
    output += "\n\nNet Fare: " + netFormatted + ".00(Per Pax)";

    // ১ এর বেশি pax হলে total fare আলাদা লাইনে
    if (pax > 1) {
        let totalFare = calculatedNetFare * pax;
        let totalFormatted = totalFare.toLocaleString('en-US', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        });
        output += "\nTotal Fare: " + totalFormatted + ".00(" + pax + " Pax)";
    }

    output += "\nBAG: " + baggage;

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

window.addEventListener('click', function(e) {
    let modal = document.getElementById('ticketModal');
    if (e.target === modal) closeTicketModal();
});
