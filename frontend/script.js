const stationContainer = document.getElementById("stationContainer");
const loadMoreBtn = document.getElementById("loadMoreBtn");
let visibleStations = 3;
const searchInput = document.getElementById("searchInput");
const chargerFilter = document.getElementById("chargerFilter");
const bookingFormContainer = document.getElementById("bookingFormContainer");
const findStationBtn = document.getElementById("findStationBtn");
findStationBtn.addEventListener("click", function() {
    document.getElementById("stations").scrollIntoView({
        behavior: "smooth"
    });
});
let allStations = [];

async function loadStations() {
    try {
        const response = await fetch("http://localhost:5000/api/stations");
        const stations = await response.json();
        allStations = stations;
        displayStations(stations);
    } catch(error) {
        console.error("Error Loading stations:", error);
        stationContainer.innerHTML = `<p>Unable to load charging stations.</p>`;
    }
}

function filterStations() {
    const searchTerm = searchInput.value.toLowerCase();
    const filterType = chargerFilter.value;
    
    const filtered = allStations.filter(station => {
        const matchesSearch = station.name.toLowerCase().includes(searchTerm) || 
                             station.location.toLowerCase().includes(searchTerm);
        const matchesFilter = filterType === "all" || station.chargerType === filterType;
        return matchesSearch && matchesFilter;
    });
    
    displayStations(filtered);
}

function bookStation(stationId) {
    const station = allStations.find(station => station.id === stationId);

    bookingFormContainer.innerHTML = `
        <div class="booking-form">
            <h3>Book: ${station.name}</h3>

            <input type="text" id="userName" placeholder="Your Name">

            <input type="text" id="vehicleNumber" placeholder="Vehicle Number">

            <input type="date" id="bookingDate">

            <input type="time" id="bookingTime">

            <button id="confirmBooking" onclick="confirmBooking(${station.id})">Confirm Booking</button>
        </div>
    `;
}

async function confirmBooking(stationId) {
    const name = document.getElementById("userName").value;
    const vehicle = document.getElementById("vehicleNumber").value;
    const date = document.getElementById("bookingDate").value;
    const time = document.getElementById("bookingTime").value;

    if (name === "" || vehicle === "" || date === "" || time === "") {
        alert("Please fill all the fields.");
        return;
    }

    const station = allStations.find(station => station.id === stationId);

    const booking = {
        name: name,
        vehicle: vehicle,
        stationId: station.id,
        stationName: station.name,
        date: date,
        time: time,
        status: "Confirmed"
    };

    try {
        const response = await fetch("http://localhost:5000/api/bookings", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(booking)
        });

        const data = await response.json();

        document.getElementById("bookingContainer").innerHTML = `
            <h3>Booking Confirmed ✅</h3>
            <p>Name: ${data.booking.name}</p>
            <p>Vehicle: ${data.booking.vehicle}</p>
            <p>Station: ${data.booking.stationName}</p>
            <p>Date: ${data.booking.date}</p>
            <p>Time: ${data.booking.time}</p>
            <p>Status: ${data.booking.status}</p>
        `;

        alert("Booking confirmed!");
        loadBookings();

    } catch (error) {
        console.error("Booking error:", error);
        alert("Unable to save booking.");
    }
}

function viewDetails(stationId) {
    const station = allStations.find(station => station.id === stationId);

    alert(
        `Station: ${station.name}\n` +
        `Location: ${station.location}\n` +
        `Address: ${station.address}\n` +
        `Charger: ${station.chargerType}\n` +
        `Operating Hours: ${station.operatingHours}\n` +
        `Available Slots: ${station.availableSlots}/${station.totalSlots}`
    );
}

function displayStations(stations) {
    stationContainer.innerHTML = "";

    const stationsToShow = stations.slice(0, visibleStations);

    stationsToShow.forEach((station) => {
        const card = document.createElement("div");
        card.className = "station-card";

        card.innerHTML = `
            <h3>${station.name}</h3>
            <p>${station.location}</p>
            <p>Charger: ${station.chargerType}</p>
            <p>${station.operatingHours}</p>
            <p>Available slots: ${station.availableSlots}/${station.totalSlots}</p>

            <button class="view-details" onclick="viewDetails(${station.id})">View Details</button>
            <button class="book-now" onclick="bookStation(${station.id})">Book Now</button>
        `;

        stationContainer.appendChild(card);
    });

    if (visibleStations >= stations.length) {
        loadMoreBtn.style.display = "none";
    } else {
        loadMoreBtn.style.display = "block";
    }
}

searchInput.addEventListener("input", filterStations);
chargerFilter.addEventListener("change", filterStations);

loadMoreBtn.addEventListener("click", function() {
    visibleStations += 3;
    displayStations(allStations);
});

async function loadBookings() {
    try {
        const response = await fetch("http://localhost:5000/api/bookings");
        const bookings = await response.json();

        const bookingContainer = document.getElementById("bookingContainer");

        if (bookings.length === 0) {
            bookingContainer.innerHTML = "<p>No bookings yet.</p>";
            return;
        }

        bookingContainer.innerHTML = "";

        bookings.forEach((booking) => {
            bookingContainer.innerHTML += `
                <div class="booking-card">
                    <h3>Booking Details</h3>
                    <p>Name: ${booking.name}</p>
                    <p>Vehicle: ${booking.vehicle}</p>
                    <p>Station: ${booking.stationName}</p>
                    <p>Date: ${booking.date}</p>
                    <p>Time: ${booking.time}</p>
                    <p>Status: ${booking.status}</p>

                    ${
                        booking.status !== "Cancelled"
                        ? `
                            <button onclick="updateBooking(${booking.id})">
                                Update
                            </button>

                            <button onclick="cancelBooking(${booking.id})">
                                Cancel
                            </button>
                          `
                        : ""
                    }
                </div>
            `;
        });

    } catch (error) {
        console.error("Error loading bookings:", error);

        document.getElementById("bookingContainer").innerHTML =
            "<p>Unable to load bookings.</p>";
    }
}

async function updateBooking(id) {
    const newDate = prompt("Enter new date (YYYY-MM-DD):");
    const newTime = prompt("Enter new time:");

    if (!newDate || !newTime) {
        return;
    }

    const response = await fetch(`http://localhost:5000/api/bookings/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            date: newDate,
            time: newTime
        })
    });

    const data = await response.json();

    alert(data.message);

    loadBookings();
}

async function cancelBooking(id) {
    const response = await fetch(`http://localhost:5000/api/bookings/${id}`, {
        method: "DELETE"
    });

    const data = await response.json();

    alert(data.message);

    loadBookings();
}

loadStations();
loadBookings();