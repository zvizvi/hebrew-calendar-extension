var moment = window.moment;
var Hebcal = window.Hebcal;
moment.locale('he');

$(document).ready(() => {
  var month = new Hebcal.HDate(new Date()).getMonthObject();

  function createMonthHtml (month) {
    month.setCity('jerusalem');

    var week = 0;
    var weekDay = month.days[0].getDay();
    var html = '';

    // prevMonth days
    if (weekDay > 0) {
      html += '<div class="week">';
      var prevMonthDays = month.prev().days.slice('-' + (weekDay));
      prevMonthDays.forEach((item, index) => {
        html += `
  <div class="day prev-day">
    <span class="heb-date">${Hebcal.gematriya(item.day)}</span>
    <span class="greg-date">${item.greg().getDate()}<span>
  </div>`;
      });
    }

    // current month
    month.days.forEach((item, index) => {
      if (weekDay === 0) {
        html += '<div class="week">';
      }
      html += `
  <div class="day${item.isSameDate(Hebcal.HDate(new Date())) ? ' today' : ''}">
    <span class="heb-date">${Hebcal.gematriya(item.day)}</span>
    <span class="greg-date">${item.greg().getDate()}</span>
  </div>`;

      if ((weekDay + 1) % 7 === 0) {
        week++;
        weekDay = 0;

        html += `
</div>
`;
      } else {
        weekDay++;
      }
    });

    // next month days
    if (weekDay > 0) {
      var nextMonthDays = month.next().days.slice(0, (7 - weekDay));
      nextMonthDays.forEach((item, index) => {
        html += `
  <div class="day next-day">
    <span class="heb-date">${Hebcal.gematriya(item.day)}</span>
    <span class="greg-date">${item.greg().getDate()}</span>
  </div>`;
      });

      html += `
</div>`;
    }

    $('.calendar').html(html);
    return html;

    // console.log(new Hebcal.HDate(1, Number(month), Number(year)).getYearObject().months[month + 1]);

    // Hebcal.HDate(moment('12/12/2002', 'DD/MM/YYYY').toDate()).getYearObject()
    // var month = Hebcal.HDate(new Date(date));
    // console.log(date.toISOString());
    // console.log(Hebcal.HDate(new Date(date)));
  }

  selectMonth(month);

  function getMonthByNumber (monthNumber, yearNumber) {
    var month = new Hebcal.HDate(1, Number(monthNumber), Number(yearNumber)).getMonthObject();
    return month;
  }

  function setTitle (monthHDate) {
    var title = '<div>' + monthHDate.getName('h') + ' ' + Hebcal.gematriya(monthHDate.year, 3) + '</div>';

    var startGregMonth = moment(monthHDate.days[0].greg()).format('MMMM');
    var endGregMonth = moment(monthHDate.days[monthHDate.days.length - 1].greg()).format('MMMM');
    var gregYear = moment(monthHDate.days[0].greg()).format('YYYY');

    title += ' ' + startGregMonth;
    if (startGregMonth !== endGregMonth) {
      title += ' - ' + endGregMonth;
    }
    title += ' ' + gregYear;

    $('.title').html(title);
  }

  function selectMonth (monthHDate) {
    month = monthHDate;
    createMonthHtml(month);
    setTitle(month);
  }

  function nextMonth () {
    selectMonth(month.next());
  }

  function prevMonth () {
    selectMonth(month.prev());
  }

  $('.next-month').click(() => {
    nextMonth();
  });
  $('.prev-month').click(() => {
    prevMonth();
  });
});
