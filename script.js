searchStats = () => {
  let queryURL = 'https://thevirustracker.com/free-api?global=stats';
  $.ajax({
    url: queryURL,
    method: 'GET'
  }).then(function(res) {
    console.log(res);
    console.log(res.results[0].total_cases);

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

    caseCreation.append(caseInfo);
    $('.global-facts').append(caseCreation);
  });
};

searchLocalStats = (country, title) => {
  let queryURL = `https://thevirustracker.com/free-api?countryTotal=${country}`;
  $.ajax({
    url: queryURL,
    method: 'GET'
  }).then(function(res) {
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

    caseCreation.append(caseInfo);
    $('.global-facts').append(caseCreation);
  });
};

$(document).on('click', '.btn-dark', function(e) {
  e.preventDefault();
  $('.global-facts').text('');
  searchStats();
});

$(document).on('click', '.btn-primary', function(e) {
  e.preventDefault();
  $('.global-facts').text('');
  country = $(this).attr('data-name');
  title = $(this).attr('data-title');
  searchLocalStats(country, title);
});

searchStats();
