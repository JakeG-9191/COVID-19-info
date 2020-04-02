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
  $('.clock').text(`Statistics Auto Updated In: ${currentTime}`);
}

searchNYTimes = newsCountry => {
  $('.nytimes').text('');
  let queryURL = `https://api.nytimes.com/svc/search/v2/articlesearch.json?q=coronavirus&fq=glocations:${newsCountry}&hits=3&api-key=GaDZeanPVCWoyZEde1NnRsJ2WzAvlfzQ`;
  $.ajax({
    url: queryURL,
    method: 'GET'
  })
    .then(function(res) {
      let articleCount;
      let articleResults = res;
      let articleCreation = $('<span>');
      let articleInfo = $('<div>');

      console.log(articleResults);

      if (articleResults.response.docs.length > 3) {
        articleCount = 3;
      } else if (articleResults.response.docs.length < 3) {
        articleCount = articleResults.response.docs.length;
      }

      for (let i = 0; i < articleCount; i++) {
        let datePublished = articleResults.response.docs[i].pub_date.substr(
          0,
          10
        );
        articleInfo.append(
          `<div class='articles'>
          <h3><a target='_blank' href='${articleResults.response.docs[i].web_url}'>${articleResults.response.docs[i].headline.main}</a></h3>
          <hr />
          <h4>${datePublished}</h4>
          <hr />
          <h5>${articleResults.response.docs[i].lead_paragraph}</h5>
          <p><a target='_blank' href='https://www.nytimes.com/'>Source: New York Times</a><p>
          </div>`
        );
      }

      articleCreation.append(articleInfo);
      $('.nytimes').append(articleCreation);
    })
    .catch(function(err) {
      console.log(`There has been an error with getting NYTimes Articles`);
      let articleCreation = $('<span>');
      let articleInfo = $('<div>');

      articleInfo.append(
        `<h3>There has been an issue gathering articles from the New York Times for ${
          newsCountry ? newsCountry : ''
        }, please check back later.</h3>`
      );

      articleCreation.append(articleInfo);
      $('.nytimes').append(articleCreation);
    });
};

refreshStats = () => {
  clearInterval(intervalId);
  searchNYTimes('United States');
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
        `<h2 class='title-stats'>Current Global Statistics</h2>
        <h3>${today.toLocaleDateString('en-us', options)}</h3>
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
        )}</h3>
        <h6><a target='_blank' href='${
          res.results[0].source.url
        }'>Powered By The Virus Tracker</a></h6>`
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
        `<h2 class='title-stats'>Current Statistics for <em>${title}</em></h2>
        <h3>${today.toLocaleDateString('en-us', options)}</h3>
        <hr />
        <h3 class='caseToday'>Current Cases: ${new Intl.NumberFormat().format(
          res.countrydata[0].total_cases
        )}</h3>
        <h3 class='caseDone'>Current Recoveries: ${new Intl.NumberFormat().format(
          res.countrydata[0].total_recovered
        )}</h3>
        <h3 class='caseOpen'>Current Deaths: ${new Intl.NumberFormat().format(
          res.countrydata[0].total_deaths
        )}</h3>
        <hr />
        <h3 class='caseToday'>Total New Cases Today: ${new Intl.NumberFormat().format(
          res.countrydata[0].total_new_cases_today
        )}</h3>
        <h3 class='caseOpen'>Total New Deaths Today: ${new Intl.NumberFormat().format(
          res.countrydata[0].total_new_deaths_today
        )}</h3>
        <h6><a target='_blank' href='${
          res.countrydata[0].info.source
        }'>Powered By The Virus Tracker</a></h6>`
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
  $('.global-facts').text('');
  e.preventDefault();
  searchStats();
});

$(document).on('click', '.btn-primary', function(e) {
  $('.global-facts').text('');
  country = $(this).attr('data-name');
  title = $(this).attr('data-title');
  searchLocalStats(country, title);
  newsCountry = [];
  newsCountry.unshift(title);
  console.log(newsCountry);
  searchNYTimes(newsCountry);
});

$(document).on('click', '.btn-danger', function(e) {
  e.preventDefault();
  $('.quasi-cookie').text('');
  $('.quasi-cookie').css('z-index', 5);
  $('.quasi-cookie').css('background', 'black');
  cookieInfo();
});

cookieInfo = () => {
  localStorage.setItem('confirmed', true);
};

isCookieConsented = () => {
  let checked = localStorage.getItem('confirmed');
  console.log(`has consented for cookie: ${checked}`);

  if (checked) {
    $('.quasi-cookie').text('');
    $('.quasi-cookie').css('z-index', 5);
    $('.quasi-cookie').css('background', 'black');
  } else {
    $('.quasi-cookie').append(
      `<h6>
    We use cookies and web analytics to help improve site performance and
    your experience, by continuing to use this website you consent to this
    policy.
    </h6>
    <button class="btn btn-danger">Accept</button>`
    );
  }
};

isCookieConsented();

searchStats();
