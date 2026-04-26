  function parse(s) {
    s = s.trim();
    var day = 0;
    var m = s.match(/\+(\d)$/);
    if (m) { day = parseInt(m[1]); s = s.slice(0, -2); }
    s = s.replace(/\D/g, '');
    if (s.length === 3) s = '0' + s;
    if (s.length !== 4) return null;
    var h = parseInt(s.slice(0, 2)), min = parseInt(s.slice(2, 4));
    if (h > 23 || min > 59) return null;
    return {
      h: h, m: min,
      total: day * 1440 + h * 60 + min,
      raw: s.slice(0, 2) + ':' + s.slice(2, 4) + (day ? ' +' + day : '')
    };
  }

  function showErr(msg) {
    var e = document.getElementById('errMsg');
    e.textContent = msg;
    e.classList.add('show');
    document.getElementById('resultBox').classList.remove('show');
  }

  function clearRes() {
    document.getElementById('errMsg').classList.remove('show');
    document.getElementById('resultBox').classList.remove('show');
    document.getElementById('arr').classList.remove('err');
    document.getElementById('dep').classList.remove('err');
  }

  function calc() {
    clearRes();
    var av = document.getElementById('arr').value;
    var dv = document.getElementById('dep').value;
    var a = parse(av), d = parse(dv);

    if (!a) { document.getElementById('arr').classList.add('err'); showErr('Arrival time ঠিক নেই। HHMM ফরম্যাটে লিখুন।'); return; }
    if (!d) { document.getElementById('dep').classList.add('err'); showErr('Departure time ঠিক নেই। HHMM ফরম্যাটে লিখুন।'); return; }

    var diff = d.total - a.total;
    if (diff <= 0) diff += 1440;
    if (diff > 1440 * 3) { showErr('Layover 3 দিনের বেশি? সময় চেক করুন।'); return; }

    var h = Math.floor(diff / 60), m = diff % 60;

    document.getElementById('bigTime').textContent = h + 'h ' + String(m).padStart(2, '0') + 'm';
    document.getElementById('subTime').textContent = diff + ' minutes total';
    document.getElementById('dArrival').textContent = a.raw;
    document.getElementById('dDeparture').textContent = d.raw;
    document.getElementById('dMins').textContent = diff + ' min';

    var pill = document.getElementById('statusPill');
    var cls, label;
    if (diff < 45)        { cls = 'pill-danger'; label = 'MCT ঝুঁকি'; }
    else if (diff < 90)   { cls = 'pill-warn';   label = 'টাইট কানেকশন'; }
    else if (diff <= 480) { cls = 'pill-ok';     label = 'নরমাল লেওভার'; }
    else                  { cls = 'pill-warn';   label = 'লম্বা লেওভার'; }

    pill.innerHTML = '<span class="status-pill ' + cls + '"><span class="dot"></span>' + label + '</span>';
    document.getElementById('resultBox').classList.add('show');
  }

  document.addEventListener('keydown', function(e) { if (e.key === 'Enter') calc(); });
