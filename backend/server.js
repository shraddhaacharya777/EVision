const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = 5000;

const stations=[
    {
        id:1,
        name:"Greencharge Mangalore",
        location:"Mangalore",
        address:"MG Road,Mangalore",
        chargerType:"DC Fast",
        totalSlots:10,
        availableSlots:6,
        operatingHours:"24/7",
        contact: "9876543210"
    },
    {
        id:2,
        name:"Coastal EV Hub",
        location:"Udupi",
        address:"Main Road,Udupi",
        chargerType:"AC",
        totalSlots:8,
        availableSlots:3,
        operatingHours:"6 AM to 11 PM",
        contact: "9876543210"
    },
    {
        id:3,
        name:"Mysore Chargepoint",
        location:"Mysore",
        address:"Bannur Road,Mysore",
        chargerType:"DC Ultra Fast",
        totalSlots:12,
        availableSlots:12,
        operatingHours:"24/7",
        contact: "9876543210"
    },
    {
        id: 4,
        name: "Bangalore EV Point",
        location: "Bangalore",
        address: "MG Road, Bangalore",
        chargerType: "DC Fast",
        totalSlots: 15,
        availableSlots: 8,
        operatingHours: "24/7",
        contact: "9876543210"
    },
    {
        id: 5,
        name: "Hubli Green Charge",
        location: "Hubli",
        address: "Gokul Road, Hubli",
        chargerType: "AC",
        totalSlots: 10,
        availableSlots: 4,
        operatingHours: "6 AM to 10 PM",
        contact: "9876543210"
    },
    {
        id: 6,
        name: "Belgaum EV Station",
        location: "Belgaum",
        address: "College Road, Belgaum",
        chargerType: "DC Ultra Fast",
        totalSlots: 12,
        availableSlots: 9,
        operatingHours: "24/7",
        contact: "9876543210"
    },
    {
    id: 7,
    name: "Tumkur Charge Hub",
    location: "Tumkur",
    address: "Bangalore Road, Tumkur",
    chargerType: "DC Fast",
    totalSlots: 8,
    availableSlots: 2,
    operatingHours: "7 AM to 11 PM",
    contact: "9876543210"
    },
    {
    id: 8,
    name: "Shimoga EV Point",
    location: "Shimoga",
    address: "BH Road, Shimoga",
    chargerType: "AC",

    totalSlots: 10,
    availableSlots: 7,
    operatingHours: "6 AM to 10 PM",
    contact: "9876543210"
    },
    {
    id: 9,
    name: "Davangere Fast Charge",
    location: "Davangere",
    address: "PB Road, Davangere",
    chargerType: "DC Ultra Fast",
    totalSlots: 14,
    availableSlots: 11,
    operatingHours: "24/7",
    contact: "9876543210"
    }

];

app.get("/", (req, res) => {
    res.send("EVision Backend Server is running!");
});

app.get("/api/stations",(req,res) => {
    res.json(stations);
});

const bookings = [];

app.post("/api/bookings", (req, res) => {
    const booking = {
        id: bookings.length + 1,
        ...req.body
    };

    console.log(booking);

    bookings.push(booking);

    res.status(201).json({
        message: "Booking created successfully",
        booking: booking
    });
});

app.put("/api/bookings/:id", (req, res) => {
    const id = parseInt(req.params.id);

    const booking = bookings.find(b => b.id === id);

    if (!booking) {
        return res.status(404).json({
            message: "Booking not found"
        });
    }

    booking.date = req.body.date || booking.date;
    booking.time = req.body.time || booking.time;

    res.json({
        message: "Booking updated successfully",
        booking: booking
    });
});

app.delete("/api/bookings/:id", (req, res) => {
    const id = parseInt(req.params.id);

    const index = bookings.findIndex(b => b.id === id);

    if (index === -1) {
        return res.status(404).json({
            message: "Booking not found"
        });
    }

    bookings[index].status = "Cancelled";

    res.json({
        message: "Booking cancelled successfully",
        booking: bookings[index]
    });
});

app.get("/api/bookings", (req, res) => {
    res.json(bookings);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});