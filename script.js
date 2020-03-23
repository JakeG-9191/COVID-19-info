var myTimer;
var time = 180;
var intervalId = setInterval(count, 1000);

function timeConverter(t) {
  var minutes = Math.floor(t / 60);
  var seconds = t - minutes * 60;

  if (seconds < 10) {
    seconds = '0' + seconds;
  }

  if (minutes === 0) {
    minutes = '00';
  } else if (minutes < 10) {
    minutes = '0' + minutes;
  }

  return minutes + ':' + seconds;
}

function count() {
  if (time === 0) {
    time = 180;
  }
  time--;
  var currentTime = timeConverter(time);
  $('.clock').text(`Auto Refresh: ${currentTime}`);
}

refreshStats = () => {
  clearInterval(intervalId);
  let today = new Date();
  let options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
  };
  console.log(`Live reload on ${today.toLocaleDateString('en-us', options)}`);
  myTimer = setTimeout(searchStats, 1000 * time);
  intervalId = setInterval(count, 1000);
};

searchStats = () => {
  clearInterval(intervalId);
  clearTimeout(myTimer);
  time = 180;
  let queryURL = 'https://thevirustracker.com/free-api?global=stats';
  $.ajax({
    url: queryURL,
    method: 'GET'
  })
    .then(function(res) {
      console.log(res);
      console.log(res.results[0].total_cases);
      console.log(
        `Current Mortality Rate: ${(
          (res.results[0].total_deaths / res.results[0].total_cases) *
          100
        ).toFixed(
          2
        )}% - Based on Known Cases, Actual Mortality Rate Likely Much Lower!`
      );

      let caseCreation = $('<span>');
      let caseInfo = $('<div>');

      let options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric'
      };
      let today = new Date();

      caseInfo.append(
        `<h6><a target='_blank' href='${
          res.results[0].source.url
        }'>Source: The Virus Tracker</a></h6>
        <h2>Today's Date: ${today.toLocaleDateString('en-us', options)}</h2>
        <hr />
        <h3 class='caseToday'>Current Global Cases: ${new Intl.NumberFormat().format(
          res.results[0].total_cases
        )}</h3>
        <h3 class='caseDone'>Current Global Total Recoveries: ${new Intl.NumberFormat().format(
          res.results[0].total_recovered
        )}</h3>
        <h3 class='caseOpen'>Current Global Total Deaths: ${new Intl.NumberFormat().format(
          res.results[0].total_deaths
        )}</h3>
        <hr />
        <h3 class='caseToday'>Total New Global Cases Today: ${new Intl.NumberFormat().format(
          res.results[0].total_new_cases_today
        )}</h3>
        <h3 class='caseOpen'>Total New Global Deaths Today: ${new Intl.NumberFormat().format(
          res.results[0].total_new_deaths_today
        )}</h3>`
      );
      $('.global-facts').text('');

      caseCreation.append(caseInfo);
      $('.global-facts').append(caseCreation);
    })
    .catch(function(err) {
      console.log(`There has been an error with getting statistics`);
      let caseCreation = $('<span>');
      let caseInfo = $('<div>');

      caseInfo.append(
        `<h4>Global Statistics are not currently available, please check back later.</h4>`
      );

      caseCreation.append(caseInfo);
      $('.global-facts').append(caseCreation);
    });
  refreshStats();
};

searchLocalStats = (country, title) => {
  clearTimeout(myTimer);
  clearInterval(intervalId);
  $('.clock').text('Auto Refresh Paused');
  let queryURL = `https://thevirustracker.com/free-api?countryTotal=${country}`;
  $.ajax({
    url: queryURL,
    method: 'GET'
  })
    .then(function(res) {
      console.log(res);
      console.log(res.countrydata[0].total_cases);

      let caseCreation = $('<span>');
      let caseInfo = $('<div>');

      let options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric'
      };
      let today = new Date();

      caseInfo.append(
        `<h6><a target='_blank' href='${
          res.countrydata[0].info.source
        }'>Source: The Virus Tracker</a></h6>
        <h2>Today's Date: ${today.toLocaleDateString('en-us', options)}</h2>
        <hr />
        <h3 class='caseToday'>Current ${title} Cases: ${new Intl.NumberFormat().format(
          res.countrydata[0].total_cases
        )}</h3>
        <h3 class='caseDone'>Current ${title} Recoveries: ${new Intl.NumberFormat().format(
          res.countrydata[0].total_recovered
        )}</h3>
        <h3 class='caseOpen'>Current ${title} Deaths: ${new Intl.NumberFormat().format(
          res.countrydata[0].total_deaths
        )}</h3>
        <hr />
        <h3 class='caseToday'>Total New Cases Today (${title}): ${new Intl.NumberFormat().format(
          res.countrydata[0].total_new_cases_today
        )}</h3>
        <h3 class='caseOpen'>Total New Deaths Today (${title}): ${new Intl.NumberFormat().format(
          res.countrydata[0].total_new_deaths_today
        )}</h3>`
      );
      $('.global-facts').text('');

      caseCreation.append(caseInfo);
      $('.global-facts').append(caseCreation);
    })
    .catch(function(err) {
      console.log(`There has been an error with getting statistics`);
      let caseCreation = $('<span>');
      let caseInfo = $('<div>');

      caseInfo.append(
        `<h4>Country Statistics for ${title} are not currently available, please check back later.</h4>`
      );

      caseCreation.append(caseInfo);
      $('.global-facts').append(caseCreation);
    });
};

$(document).on('click', '.btn-dark', function(e) {
  e.preventDefault();
  searchStats();
});

$(document).on('click', '.btn-primary', function(e) {
  e.preventDefault();
  country = $(this).attr('data-name');
  title = $(this).attr('data-title');
  searchLocalStats(country, title);
});

$(document).on('click', '.btn-danger', function(e) {
  e.preventDefault();
  $('.quasi-cookie').text('');
  $('.quasi-cookie').css('z-index', 5);
  $('.quasi-cookie').css('background', 'black');
});

searchStats();
