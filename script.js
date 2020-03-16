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

    caseInfo.append(
      `<h6>Source: ${res.results[0].source.url} <a href=${
        res.results[0].source.url
      }>Link</a></h6>
      <h3>Current Global Cases: ${res.results[0].total_cases}</h3>
      <h3>Current Total Recoveries: ${res.results[0].total_recovered}</h3>
      <h3>Current Total Deaths: ${res.results[0].total_deaths}</h3>
      <hr />
      <h3>Total New Cases Today (${new Date()}): ${
        res.results[0].total_new_cases_today
      }</h3>
      <h3>Total New Deaths Today: ${res.results[0].total_new_deaths_today}</h3>`
    );

    caseCreation.append(caseInfo);
    $('.global-facts').append(caseCreation);
  });
};

$(document).on('click', '.btn-dark', function(e) {
  e.preventDefault();
  searchStats();
});
