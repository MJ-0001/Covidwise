$(document).ready(function () {
  // Get local storage
  $(function getLocal() {
    let searchCity = localStorage.getItem("city");
    searchHistory.unshift(searchCity);
    covidLocal();
    prevSession();
  })

  // Capitalise the first letter of each city
  function toCapitals(string) {
    string = string.split(" ");
      for (var i = 0; i < string.length; i++) {
        string[i] = string[i][0].toUpperCase() + string[i].substr(1);
      }
    return string.join(" ");
  }

  // Retrieve search item and store it in a variable
  function userSearch() {
    let city = $("#enter-city").val().trim();
    let search = toCapitals(city);
    if (utla.includes(search)) {
      return search;
    }
    else {
      showModal("modal-nodata");
      hideModal("modal-nodata");
    }
  }
  
  // used when a user clicks on search history
  function userHistorySearch() {
    let search = cityClicked;
    if (utla.includes(search)) {
      return search;
    }
    else {
      showModal("modal-nodata");
      hideModal("modal-nodata");
    }
  }


  // Shows modal when triggered
  function showModal(param) {
    $("#" + param + "").show();
  }

  // Hides modal when triggered 
  function hideModal(param) {
    $(".modal-close").click(function () {
      $("#" + param + "").hide();
    })
  }

  // On click event for submit button calls API
  $("#search-btn").click(function (e) {
    if ($("input").val() != "") {
      e.preventDefault();
      let searchItem = userSearch();
      localStorage.setItem("city", searchItem);
      if (searchItem === searchHistory[0]) {
        showModal("modal-data");
        hideModal("modal-data");
        $("#enter-city").val("");
      }
      searchHistory.unshift(searchItem);
      covidLocal();
      setSearchHistory();
      $("#enter-city").val("");
    }
    else if ($("input").val() === "") {
      showModal("modal-entercity");
      hideModal("modal-entercity");
      e.preventDefault();
    }
  })

  //sets search history list
  function setSearchHistory() {
    let city = $("input").val(); //gets user input
    let searchedCity = toCapitals(city);
    for (let j = 0; j < saveSearchHistory.length; j++) {
      if (searchedCity == saveSearchHistory[j]) {
        saveSearchHistory.splice(j, 1);
      }
    }

    if (saveSearchHistory.length == 3) {
      saveSearchHistory.shift(); // maintains length of history to 3 options
    }

    saveSearchHistory.push(searchedCity); //adds newest search to array

    lastSession = { // sets new object
      city: saveSearchHistory,
    }

    var searchString = JSON.stringify(lastSession);
    JSON.parse(searchString);
    localStorage.setItem("searchHistory", searchString);
    renderHistory();
  }


  // creates search history
  function renderHistory() {
    var citiesList = $("#history");
    var recentText = $("#recents");
    recentText.text("Your recent searches: ");
    citiesList.empty(); // resets to prevent duplicates

    for (var newCity = 0; newCity < saveSearchHistory.length; newCity++) {
      var indvCity = saveSearchHistory[newCity];

      if (saveSearchHistory.length == 1) {
        var li = $("<li><span class='hl'>" + indvCity + "</span>." + "</li>"); // sets list item
      }
      else if (saveSearchHistory.length == 2) {
        if (newCity == 0) {
          var li = $("<li><span class='hl'>" + indvCity + "</span>." + "</li>"); // sets list item
        }
        else if (newCity > 0) {
          var li = $("<li><span class='hl'>" + indvCity + "</span> and" + "</li>"); // sets list item
        }
      }
      else if (saveSearchHistory.length === 3) {
        if (newCity == 0) {
          var li = $("<li><span class='hl'>" + indvCity + "</span>." + "</li>"); // sets list item
        }
        else if (newCity == 1) {
          var li = $("<li><span class='hl'>" + indvCity + "</span> and " + "</li>"); // sets list item
        }
        else if (newCity == 2) {
          var li = $("<li><span class='hl'>" + indvCity + "</span>, " + "</li>"); // sets list item
        }
      }
      citiesList.prepend(li); // adds to top of list
    }
  }

  // searches on clicked search history
  $(document).on("click", ".hl", function(e) {
    cityClicked = $(this).text();
    $("input").val(cityClicked);
    let searchItem = userHistorySearch();
      localStorage.setItem("city", searchItem);
      if (searchItem === searchHistory[0]) {
        showModal("modal-data");
        hideModal("modal-data");
      }
      searchHistory.unshift(searchItem);
      covidLocal();
      setSearchHistory();
      $("#enter-city").val("");
  });

  // loads previous session search history
  function prevSession() {
    var ls = localStorage.getItem("searchHistory"); //sets variable that gets info from local storage
    if (ls) { // if previous search exists...
      restore = JSON.parse(ls); //makes info usable
      for (var i = 0; i < restore.city.length; i++) { // for all info in local storage...
        var current = restore.city[i];
        saveSearchHistory.push(current); // updates new session string
      }
      renderHistory();
    }
  }


  // Clear search results
  $("#clear-btn").click(function (e) {
    e.preventDefault();
    $("#results").html("").removeClass();
    $("#results2").html("").removeClass();
    $("#results3").html("").removeClass();
    $("input").val("");
    $("#recents").empty().text("");
    $("#history").empty().text("");
    localStorage.clear();
  })

  // Arrays to store searches
  var searchHistory = [];
  var saveSearchHistory = [];
  var restore = {};

  // Function to create url
  function urlLocal() {
    const parameters = {
      "date": "date",
      "areaName": "areaName",
      "newCasesBySpecimenDate": "newCasesBySpecimenDate",
      "cumDeaths28DaysByPublishDate": "cumDeaths28DaysByPublishDate",
      "cumCasesBySpecimenDate": "cumCasesBySpecimenDate"
    }
    let city = searchHistory[0];
    let url = 'https://api.coronavirus.data.gov.uk/v1/data?filters=areaType=utla;areaName=' +
      city + '&structure=' + JSON.stringify(parameters);
    return url;
  }

  function urlNational() {
    const parameters = {
      "date": "date",
      "hospitalCases": "hospitalCases",
      "newAdmissions": "newAdmissions",
      "covidOccupiedMVBeds": "covidOccupiedMVBeds",
      "newCasesByPublishDate": "newCasesByPublishDate",
      "cumCasesByPublishDate": "cumCasesByPublishDate",
      "cumDeaths28DaysByPublishDate": "cumDeaths28DaysByPublishDate",
      "covidOccupiedMVBeds": "covidOccupiedMVBeds"
    }
    let url = 'https://api.coronavirus.data.gov.uk/v1/data?filters=areaType=nation;areaName=england&structure=' +
      JSON.stringify(parameters);
    return url;
  }

  // Function and AJAX to call API
  function covidLocal() {
    let covidURL = urlLocal();
    console.log(covidURL);
    $.ajax({
      url: covidURL,
      type: "GET",
      success: function (response) {
        // Retrieve JSON response
        let area = response.data[2].areaName;
        let newCases = response.data[2].newCasesBySpecimenDate;
        let deaths = response.data[2].cumDeaths28DaysByPublishDate;
        let totalCases = response.data[2].cumCasesBySpecimenDate;

        // Dynamically add local stats
        $("#results").html("");
        $("#results").addClass("stats");
        $("#results").append("<div id='title1' class='row' style='text-align:center; padding-bottom:15px;'><h4>Displaying Figures for: " +
          area + "</h4><h5>Data last updated 48hrs ago</h5></div>");
        $("#title1").append("<div class='box-alt cases green darken-1 white-text z-depth-2 valign-wrapper' id='cases'>" +
          "New Cases: " + `<br> ${newCases}` + "</div>");
        $("#title1").append("<div class='box-alt hospital green darken-1 white-text z-depth-2 valign-wrapper' id='total'>" +
          "Total Cases: " + `<br> ${totalCases}` + "</div>");
        $("#title1").append("<div class='box-alt deaths green darken-1 white-text z-depth-2 valign-wrapper' id='deaths'>" +
          "Total Deaths: " + `<br> ${deaths}` + "</div>");

        // Make second API call
        covidNational();
      }
    })
  }

  function covidNational() {
    let covidURL = urlNational();
    console.log(covidURL);
    $.ajax({
      url: covidURL,
      type: "GET",
      success: function (response) {
        // Retrieve JSON response
        let casesNat = response.data[3].newCasesByPublishDate;
        let totalCasesNat = response.data[3].cumCasesByPublishDate;
        let deathsNat = response.data[2].cumDeaths28DaysByPublishDate;
        let hospital = response.data[3].hospitalCases;
        let admissions = response.data[3].newAdmissions;
        let beds = response.data[3].covidOccupiedMVBeds;

        // Dynamically add national stats
        $("#results2").html("");
        $("#results2").addClass("stats");
        $("#results2").append("<div id='title2' class='row' style='padding-bottom:15px; text-align:center'><h4>Comparison to National Figures</h4><h5>Data last updated 48hrs ago</h5></div>");
        $("#title2").append("<div class='box-alt hospital green darken-1 white-text z-depth-2 valign-wrapper' id='cases-national'>" +
          "New Cases: " + `<br> ${casesNat}` + " </div>");
        $("#title2").append("<div class='box-alt hospital green darken-1 white-text z-depth-2 valign-wrapper' id='total-national'>" +
          "Total Cases: " + `<br> ${totalCasesNat}` + "</div>");
        $("#title2").append("<div class='box-alt hospital green darken-1 white-text z-depth-2 valign-wrapper' id='deaths-national'>" +
          "Total Deaths: " + `<br> ${deathsNat}` + "</div>");

        // Dynamically add hospital stats
        $("#results3").html("");
        $("#results3").addClass("stats");
        $("#results3").append("<div id='title3' class='row' style='padding-bottom:15px; text-align:center'><h4>Current Hospital Data for England</h4><h5>Data last updated 48hrs ago</h5></div>");
        $("#title3").append("<div class='box hospital green darken-1 white-text z-depth-2 valign-wrapper' id='admissions'>" +
          "New Admissions: " + `<br> ${admissions}`  + "</div>");
        $("#title3").append("<div class='box hospital green darken-1 white-text z-depth-2 valign-wrapper' id='hospital'>" +
          "COVID Patients: " + `<br> ${hospital}` + "</div>");
        $("#title3").append("<div class='box hospital green darken-1 white-text z-depth-2 valign-wrapper' id='beds'>" +
          "Patients on Ventilators: " + `<br> ${beds}` + "</div>");
      }
    })
  }
})

var cityClicked = "";
var utla = [
  "Barking And Dagenham",
  "Barnet",
  "Barnsley",
  "Bath And North East Somerset",
  "Bedford",
  "Bexley",
  "Birmingham",
  "Blackburn With Darwen",
  "Blackpool",
  "Bolton",
  "Bournemouth, Christchurch And Poole",
  "Bracknell Forest",
  "Bradford",
  "Brent",
  "Brighton And Hove",
  "Bristol, City Of",
  "Bromley",
  "Buckinghamshire",
  "Bury",
  "Calderdale",
  "Cambridgeshire",
  "Camden",
  "Central Bedfordshire",
  "Cheshire East",
  "Cheshire West And Chester",
  "Cornwall And Isles Of Scilly",
  "County Durham",
  "Coventry",
  "Croydon",
  "Cumbria",
  "Darlington",
  "Derby",
  "Derbyshire",
  "Devon",
  "Doncaster",
  "Dorset",
  "Dudley",
  "Ealing",
  "East Riding Of Yorkshire",
  "East Sussex",
  "Enfield",
  "Essex",
  "Gateshead",
  "Gloucestershire",
  "Greenwich",
  "Hackney And City Of London",
  "Halton",
  "Hammersmith And Fulham",
  "Hampshire",
  "Haringey",
  "Harrow",
  "Hartlepool",
  "Havering",
  "Herefordshire, County Of",
  "Hertfordshire",
  "Hillingdon",
  "Hounslow",
  "Isle Of Wight",
  "Islington",
  "Kensington And Chelsea",
  "Kent",
  "Kingston Upon Hull, City Of",
  "Kingston Upon Thames",
  "Kirklees",
  "Knowsley",
  "Lambeth",
  "Lancashire",
  "Leeds",
  "Leicester",
  "Leicestershire",
  "Lewisham",
  "Lincolnshire",
  "Liverpool",
  "Luton",
  "Manchester",
  "Medway",
  "Merton",
  "Middlesbrough",
  "Milton Keynes",
  "Newcastle Upon Tyne",
  "Newham",
  "Norfolk",
  "North East Lincolnshire",
  "North Lincolnshire",
  "North Somerset",
  "North Tyneside",
  "North Yorkshire",
  "Northamptonshire",
  "Northumberland",
  "Nottingham",
  "Nottinghamshire",
  "Oldham",
  "Oxfordshire",
  "Peterborough",
  "Plymouth",
  "Portsmouth",
  "Reading",
  "Redbridge",
  "Redcar And Cleveland",
  "Richmond Upon Thames",
  "Rochdale",
  "Rotherham",
  "Rutland",
  "Salford",
  "Sandwell",
  "Sefton",
  "Sheffield",
  "Shropshire",
  "Slough",
  "Solihull",
  "Somerset",
  "South Gloucestershire",
  "South Tyneside",
  "Southampton",
  "Southend-On-Sea",
  "Southwark",
  "St. Helens",
  "Staffordshire",
  "Stockport",
  "Stockton-On-Tees",
  "Stoke-On-Trent",
  "Suffolk",
  "Sunderland",
  "Surrey",
  "Sutton",
  "Swindon",
  "Tameside",
  "Telford and Wrekin",
  "Thurrock",
  "Torbay",
  "Tower Hamlets",
  "Trafford",
  "Wakefield",
  "Walsall",
  "Waltham Forest",
  "Wandsworth",
  "Warrington",
  "Warwickshire",
  "West Berkshire",
  "West Sussex",
  "Westminster",
  "Wigan",
  "Wiltshire",
  "Windsor And Maidenhead",
  "Wirral",
  "Wokingham",
  "Wolverhampton",
  "Worcestershire",
  "York"
]
