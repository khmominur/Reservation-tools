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

        document.getElementById('ait').innerText = "AIT (0.3%): " + AIT.toLocaleString();
        document.getElementById('iata').innerText = "IATA Commission: " + IATA_Commission.toLocaleString();
        document.getElementById('net').innerText = "Net Fare: " + net_fare.toLocaleString();

        document.getElementById('results').style.display = "block";
    }

    function resetForm() {
        // সব ইনপুট ক্লিয়ার করা
        document.getElementById('gross_fare').value = "";
        document.getElementById('base_fare').value = "";
        document.getElementById('iata_com').value = "";
        document.getElementById('markup_amount').value = "";
        
        // রেজাল্ট সেকশন হাইড করা
        document.getElementById('results').style.display = "none";
    }
