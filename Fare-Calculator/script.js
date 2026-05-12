// ===== STATE =====
let calculatedNetFare = 0;
let calculatedGrossFare = 0;
let multiPaxResults = [];
let currentModalMode = 'single';
let paxRowCount = 0;

// ===== TAB SWITCHING =====
function switchTab(tab) {
    document.getElementById('tab-single').style.display = tab === 'single' ? 'block' : 'none';
    document.getElementById('tab-multi').style.display = tab === 'multi' ? 'block' : 'none';
    document.querySelectorAll('.tab-btn').forEach((btn, i) => {
        btn.classList.toggle('active', (tab === 'single' && i === 0) || (tab === 'multi' && i === 1));
    });
}

// ===== SINGLE PAX =====
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
    document.getElementById('segment_input').value = "";
    document.getElementById('baggage_input').value = "";
    document.getElementById('pax_count').value = "1";
    document.getElementById('results').style.display = "none";
    document.getElementById('ticket-btn-container').style.display = "none";
    document.getElementById('ticket_output').style.display = "none";
    calculatedNetFare = 0;
    calculatedGrossFare = 0;
}

// ===== MULTI-PAX =====
const PAX_TYPES = ['ADT', 'CHD', 'INF'];

function addPaxRow() {
    paxRowCount++;
    const container = document.getElementById('pax-rows-container');
    const div = document.createElement('div');
    div.className = 'pax-row';
    div.id = 'pax-row-' + paxRowCount;

    let typeOptions = PAX_TYPES.map(t => `<option value="${t}">${t}</option>`).join('');

    div.innerHTML = `
        <div class="pax-row-header">
            <select class="pax-type-select">${typeOptions}</select>
            <button class="btn-remove-pax" onclick="removePaxRow(${paxRowCount})" title="Remove">
                <i class="fa-solid fa-xmark"></i>
            </button>
        </div>
        <div class="pax-row-fields">
            <input type="number" class="pax-field" placeholder="Count" min="1" value="1">
            <input type="number" class="pax-field" placeholder="Gross Fare">
            <input type="number" class="pax-field" placeholder="Base Fare">
            <input type="number" class="pax-field" placeholder="Markup (opt)">
        </div>
        <div class="pax-row-labels">
            <span>Pax</span><span>Gross</span><span>Base</span><span>Markup</span>
        </div>
    `;
    container.appendChild(div);
}

function removePaxRow(id) {
    const el = document.getElementById('pax-row-' + id);
    if (el) el.remove();
}

function resetMulti() {
    document.getElementById('mp_iata_com').value = "";
    document.getElementById('pax-rows-container').innerHTML = "";
    document.getElementById('mp-results').style.display = "none";
    document.getElementById('mp-results').innerHTML = "";
    document.getElementById('mp-ticket-btn-container').style.display = "none";
    document.getElementById('ticket_output').style.display = "none";
    multiPaxResults = [];
    paxRowCount = 0;
}

function calculateMulti() {
    let iata_com = parseFloat(document.getElementById('mp_iata_com').value);
    if (isNaN(iata_com)) {
        alert("Please enter IATA Commission.");
        return;
    }

    const rows = document.querySelectorAll('.pax-row');
    if (rows.length === 0) {
        alert("Please add at least one pax type.");
        return;
    }

    multiPaxResults = [];
    let grandNetTotal = 0;
    let grandGrossTotal = 0;
    let totalPax = 0;
    let valid = true;

    rows.forEach(row => {
        const type = row.querySelector('.pax-type-select').value;
        const fields = row.querySelectorAll('.pax-field');
        const count = parseInt(fields[0].value) || 1;
        const gross = parseFloat(fields[1].value);
        const base = parseFloat(fields[2].value);
        const markup = fields[3].value === "" ? 0 : parseFloat(fields[3].value);

        if (isNaN(gross) || isNaN(base)) {
            alert(`Please enter Gross Fare and Base Fare for ${type}.`);
            valid = false;
            return;
        }

        const AIT = (gross * 0.3) / 100;
        const commission = (base * iata_com) / 100;
        const originalNet = gross + AIT - commission + markup;
        const net = originalNet + 2;

        multiPaxResults.push({ type, count, gross, net, originalNet });
        grandNetTotal += originalNet * count;
        grandGrossTotal += gross * count;
        totalPax += count;
    });

    if (!valid) return;

    // Show results
    const resultsDiv = document.getElementById('mp-results');
    let html = '';
    multiPaxResults.forEach(r => {
        let netTotal = r.originalNet * r.count;
        html += `<p><b>${r.count} ${r.type}</b> — Net: ${r.originalNet.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} × ${r.count} = <b>${netTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</b></p>`;
    });
    html += `<hr style="margin:10px 0; border-color:#ccc;">`;
    html += `<p style="color:var(--primary)"><b>Grand Total: ${grandNetTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</b> (${totalPax} Pax)</p>`;

    resultsDiv.innerHTML = html;
    resultsDiv.style.display = "block";
    document.getElementById('mp-ticket-btn-container').style.display = "block";
}

// ===== TICKET MODAL =====
function openTicketModal(mode) {
    currentModalMode = mode;
    document.getElementById('ticketModal').style.display = "flex";
    document.getElementById('ticket_output').style.display = "none";
    document.getElementById('modal-single-options').style.display = mode === 'single' ? 'block' : 'none';
    document.getElementById('modal-multi-options').style.display = mode === 'multi' ? 'block' : 'none';
    if (mode === 'single') {
        document.getElementById('pax_count').value = "1";
        document.getElementById('show_gross_fare').checked = false;
    } else {
        document.getElementById('show_gross_fare_multi').checked = false;
    }
}

function closeTicketModal() {
    document.getElementById('ticketModal').style.display = "none";
}

function generateTicketInfo() {
    let segment = document.getElementById('segment_input').value.trim();
    let baggage = document.getElementById('baggage_input').value.trim();

    if (!segment || !baggage) {
        alert("Please enter Segment & Baggage.");
        return;
    }

    let output = segment + "\n";

    if (currentModalMode === 'single') {
        let pax = parseInt(document.getElementById('pax_count').value) || 1;
        let showGross = document.getElementById('show_gross_fare').checked;

        let netFmt = fmt(calculatedNetFare);
        let grossFmt = fmt(calculatedGrossFare);

        if (showGross) {
            output += "\nGross Fare: " + grossFmt + ".00 (Per Pax)";
            if (pax > 1) output += "\nTotal Gross: " + fmt(calculatedGrossFare * pax) + ".00 (" + pax + " Pax)";
        }
        output += (showGross ? "\n" : "\n\n") + "Net Fare: " + netFmt + ".00 (Per Pax)";
        if (pax > 1) output += "\nTotal Fare: " + fmt(calculatedNetFare * pax) + ".00 (" + pax + " Pax)";

    } else {
        // Multi-pax mode
        let showGross = document.getElementById('show_gross_fare_multi').checked;
        let grandNet = 0;
        let grandGross = 0;
        let totalPax = 0;

        multiPaxResults.forEach(r => {
            grandNet += r.net * r.count;
            grandGross += r.gross * r.count;
            totalPax += r.count;
        });

        output += "\n";
        multiPaxResults.forEach(r => {
            if (showGross) {
                output += "\nGross Fare: " + fmt(r.gross) + ".00 (Per " + r.type + ")";
                if (r.count > 1) output += "\nTotal Gross: " + fmt(r.gross * r.count) + ".00 (" + r.count + " " + r.type + ")";
            }
            output += "\nNet Fare: " + fmt(r.net) + ".00 (Per " + r.type + ")";
            if (r.count > 1) output += "\nTotal: " + fmt(r.net * r.count) + ".00 (" + r.count + " " + r.type + ")";
        });

        if (multiPaxResults.length > 1) {
            if (showGross) output += "\nGrand Gross: " + fmt(grandGross) + ".00 (All Pax)";
            output += "\n\nGrand Total: " + fmt(grandNet) + ".00 (All Pax)";
        }
    }

    // Baggage
    let baggageLines = baggage.split('\n').filter(l => l.trim() !== '');
    if (baggageLines.length === 1) {
        output += "\nBAG: " + baggageLines[0];
    } else {
        output += "\n" + baggageLines.join('\n');
    }

    document.getElementById('ticket_text').innerText = output;
    document.getElementById('ticket_output').style.display = "block";
}

function fmt(n) {
    return Math.round(n).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

function copyTicketInfo() {
    let text = document.getElementById('ticket_text').innerText;
    navigator.clipboard.writeText(text).then(() => {
        let btn = document.querySelector('.btn-copy');
        btn.innerHTML = '<i class="fa-solid fa-check"></i> Copied!';
        setTimeout(() => { btn.innerHTML = '<i class="fa-solid fa-copy"></i> Copy'; }, 2000);
    });
}

// Init: add one pax row by default in multi tab
window.addEventListener('DOMContentLoaded', () => {
    addPaxRow();
});