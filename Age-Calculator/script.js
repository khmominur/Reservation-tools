const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    let useCustomDate = false;

    const today = new Date();
    document.getElementById('todayStr').textContent = today.getDate() + ' ' + MONTHS[today.getMonth()] + ' ' + today.getFullYear();

    function toggleCustomDate() {
      useCustomDate = !useCustomDate;
      document.getElementById('customDateWrap').style.display = useCustomDate ? 'block' : 'none';
      document.getElementById('toggleDot').className = useCustomDate ? 'toggle-dot active' : 'toggle-dot';
      document.getElementById('customToggle').className = useCustomDate ? 'toggle-btn active' : 'toggle-btn';
    }

    function daysInMonth(year, month) {
      return new Date(year, month, 0).getDate();
    }

    function isValidDate(d, m, y) {
      if (!d || !m || !y || isNaN(d) || isNaN(m) || isNaN(y)) return false;
      if (y < 1 || y > 9999) return false;
      if (m < 1 || m > 12) return false;
      if (d < 1 || d > daysInMonth(y, m)) return false;
      return true;
    }

    function exactAge(dob, ref) {
      let years  = ref.getFullYear() - dob.getFullYear();
      let months = ref.getMonth()    - dob.getMonth();
      let days   = ref.getDate()     - dob.getDate();

      if (days < 0) {
        months--;
        days += new Date(ref.getFullYear(), ref.getMonth(), 0).getDate();
      }
      if (months < 0) {
        years--;
        months += 12;
      }
      return { years, months, days };
    }

    function totalDaysBetween(dob, ref) {
      return Math.floor((ref - dob) / 86400000);
    }

    function fmt(n) { return n.toLocaleString('en-US'); }

    function calculateAge() {
      const errEl = document.getElementById('errMsg');
      errEl.style.display = 'none';

      const dd = parseInt(document.getElementById('dobDay').value);
      const dm = parseInt(document.getElementById('dobMonth').value);
      const dy = parseInt(document.getElementById('dobYear').value);

      if (!isValidDate(dd, dm, dy)) {
        errEl.style.display = 'block';
        errEl.textContent = 'Please enter a valid date of birth.';
        return;
      }

      const dobMidnight = new Date(dy, dm - 1, dd);

      let refMidnight;
      if (useCustomDate) {
        const rd = parseInt(document.getElementById('refDay').value);
        const rm = parseInt(document.getElementById('refMonth').value);
        const ry = parseInt(document.getElementById('refYear').value);
        if (!isValidDate(rd, rm, ry)) {
          errEl.style.display = 'block';
          errEl.textContent = 'Please enter a valid reference date.';
          return;
        }
        refMidnight = new Date(ry, rm - 1, rd);
      } else {
        const n = new Date();
        refMidnight = new Date(n.getFullYear(), n.getMonth(), n.getDate());
      }

      if (dobMidnight > refMidnight) {
        errEl.style.display = 'block';
        errEl.textContent = 'Date of birth cannot be after the reference date.';
        return;
      }

      const age       = exactAge(dobMidnight, refMidnight);
      const totalDays = totalDaysBetween(dobMidnight, refMidnight);
      const totMonths = age.years * 12 + age.months;
      const totWeeks  = Math.floor(totalDays / 7);

      document.getElementById('bigAgeNums').innerHTML =
        '<span class="age-num">' + age.years  + '</span><span class="age-unit">yr</span>' +
        '<span class="age-num">' + age.months + '</span><span class="age-unit">mo</span>' +
        '<span class="age-num">' + age.days   + '</span><span class="age-unit">d</span>';

      document.getElementById('totalMonths').textContent = fmt(totMonths);
      document.getElementById('totalWeeks').textContent  = fmt(totWeeks);
      document.getElementById('totalDays').textContent   = fmt(totalDays);

      // document.getElementById('inputCard').style.display = 'none';
      // document.getElementById('calcBtn').style.display   = 'none';
      const res = document.getElementById('results');
      res.classList.remove('visible');
      void res.offsetWidth;
      res.classList.add('visible');
    }

    function resetCalc() {
      // document.getElementById('inputCard').style.display = 'block';
      // document.getElementById('calcBtn').style.display   = 'block';
      document.getElementById('results').classList.remove('visible');
      ['dobDay','dobMonth','dobYear','refDay','refMonth','refYear'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
      });
      document.getElementById('errMsg').style.display = 'none';
    }

    document.getElementById('footerYear').textContent = new Date().getFullYear();
    document.addEventListener('keydown', e => { if (e.key === 'Enter') calculateAge(); });