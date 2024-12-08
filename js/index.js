"use strict";
const searchInput = document.getElementById("search");
const searchButton = document.getElementById("search-button");
const form = document.querySelector("form");
// Sample data
const sampleForecastData = [
  {
    date: "2023-10-10",
    day: {
      avgtemp_c: 20,
      condition: {
        text: "Sunny",
        icon: "//cdn.weatherapi.com/weather/64x64/day/113.png",
      },
    },
  },
  {
    date: "2023-10-11",
    day: {
      avgtemp_c: 22,
      condition: {
        text: "Partly Cloudy",
        icon: "//cdn.weatherapi.com/weather/64x64/day/116.png",
      },
    },
  },
  {
    date: "2023-10-12",
    day: {
      avgtemp_c: 19,
      condition: {
        text: "Rainy",
        icon: "//cdn.weatherapi.com/weather/64x64/day/176.png",
      },
    },
  },
];

// Call displayData with the sample data
displayData(sampleForecastData, "Sample Location");

//prevent the action of form submission
form.addEventListener("submit", function (e) {
  e.preventDefault();
  const location = searchInput.value;
  getData(location);
});

// getData()
async function getData(location) {
  try {
    let x = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=fb4dd72272f24631b0b210615240712&q=${location}&days=3`
    );
    let data = await x.json();

    if (x.ok == false) {
      throw new Error("there is no results");
    }

// Call displayData with the forecast data and location
    displayData(data.forecast.forecastday, location);
  } catch (error) {
    console.error("Error fetching data:", error.message);
  }
}

//getUserLocation() using geolocation
function getUserLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        getData(`${latitude},${longitude}`); 
      },
      (error) => {
        console.error("Error getting location:", error.message);
        getData("New York");
      }
    );
  } else {
    console.error("Geolocation is not supported by this browser.");
    getData("New York");
  }
}

getUserLocation();

// Add an event listener to the search button 
searchButton.addEventListener("click", () => {
  const location = searchInput.value;
  getData(location);
});
//displayData()
function displayData(forecastData, location) {
  const weatherCardsContainer = document.querySelector(".displaydata");

  weatherCardsContainer.innerHTML = "";

  weatherCardsContainer.classList.add("d-flex", "row", "g-3"); 

  forecastData.forEach((day, index) => {
    const card = document.createElement("div");
    card.classList.add("weather-card", "col-lg-4", "px-0", "pb-5", "rounded"); 

    if (index === 0 || index === 2) {
      card.style.backgroundColor = "#323544";
    } else if (index === 1) {
      card.style.backgroundColor = "#262936";
    }

    const dayDate = new Date(day.date); 
    const formattedDate = dayDate.toLocaleString("en-US", {
      day: "numeric",
      month: "long",
    }); 
    const dayName = dayDate.toLocaleString("en-US", { weekday: "long" }); 

    let iconHtml = "";
    const hour = dayDate.getHours(); 

    if (hour >= 6 && hour < 18) {

      iconHtml =
        '<i class="fa-solid fa-sun fa-rotate-270" style="color: #FFD43B;"></i>';
    } else {

      iconHtml = '<i class="fa-regular fa-moon" style="color: #74C0FC;"></i>'; 
    }

    if (index === 0) {
      card.innerHTML = `
        <div class="card-header d-flex justify-content-between align-items-center"> <!-- Flex container -->
            <span class="day-name fs-6">${dayName}</span> <!-- Day name on the left -->
            <span class="formatted-date fs-6">${formattedDate}</span> <!-- Date on the right -->
        </div>
                <h6 class="p-4">${location}</h6> <!-- Add the location name in the first card -->
                <h2 class="text-white display-2 fw-bold px-4">${day.day.avgtemp_c}°C <span class="fs-3"> ${iconHtml} </span></h2>
                <p class="p-4">${day.day.condition.text}</p>
                <!-- Add the icon based on the time of day -->
     <div class="weather-details px-3">
                <span class="text-white pe-3"><i class="fa-solid fa-umbrella pe-2 fs-5"></i>20%</span>
                <span class="text-white pe-3"> <i class="fa-solid fa-wind pe-2 fs-5"></i>18 km/h</span>
                <span class="text-white"> <i class="fa-regular fa-compass pe-2 fs-5"></i>East</span>
              </div>
            `;
    } else {
      card.innerHTML = `
                <div class="card-header text-center">
                   <span> ${dayName}</span> <!-- Display only the day name in the subsequent cards -->
                </div>
                <div class="card-body pb-5 text-center">
                <img class="pt-4" src="https:${day.day.condition.icon}" alt="${day.day.condition.text}">
              <h2 class="text-white fw-bold px-4">${day.day.avgtemp_c}°C</h2>
                <p class="text-white">${day.day.mintemp_c}°C</p>
                <p class="pb-3">${day.day.condition.text}</p>
                </div>



            `;
    }

    weatherCardsContainer.appendChild(card);
  });
}
