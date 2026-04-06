import { createContext, useState, useEffect } from "react";

export const AppContext = createContext();

const AppContextProvider = (props) => {
    // Persistent state initialization for Car Rental (IdleWheels)
    const [rides, setRides] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [messages, setMessages] = useState([]);

    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('idle_user');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const [dashboardData, setDashboardData] = useState({
        totalCars: 0,
        totalBookings: 0,
        recentBookings: [],
        monthlyRevenue: 0
    });

    const currency = import.meta.env.VITE_CURRENCY || "₹";
    const DB_URL = "/api";

    // Fetch initial data from DB
    useEffect(() => {
        fetch(`${DB_URL}/rides`)
            .then(res => res.json())
            .then(data => setRides(data))
            .catch(err => console.error("Error fetching rides:", err));

        fetch(`${DB_URL}/bookings`)
            .then(res => res.json())
            .then(data => setBookings(data))
            .catch(err => console.error("Error fetching bookings:", err));

        fetch(`${DB_URL}/messages`)
            .then(res => res.json())
            .then(data => setMessages(data))
            .catch(err => console.error("Error fetching messages:", err));
    }, []);

    // Sync only user to localStorage
    useEffect(() => {
        if (user) {
            localStorage.setItem('idle_user', JSON.stringify(user));
        } else {
            localStorage.removeItem('idle_user');
        }
    }, [user]);

    // Authentication functions
    const login = (userData) => {
        setUser(userData);
    };

    const logout = () => {
        setUser(null);
    };

    // Car Management
    const addRide = async (newCar) => {
        newCar.id = newCar._id; // json-server requirement
        try {
            await fetch(`${DB_URL}/rides`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newCar)
            });
            setRides((prev) => [newCar, ...prev]);
        } catch(e) { console.error(e); }
    };

    const deleteRide = async (carId) => {
        try {
            await fetch(`${DB_URL}/rides/${carId}`, { method: "DELETE" });
            setRides((prev) => prev.filter((car) => car._id !== carId));
        } catch(e) { console.error(e); }
    };

    // Booking Management
    const addBooking = async (newBooking) => {
        newBooking.id = newBooking._id;
        try {
            await fetch(`${DB_URL}/bookings`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newBooking)
            });
            setBookings((prev) => [newBooking, ...prev]);
        } catch(e) { console.error(e); }
    };

    const updateBookingStatus = async (bookingId, status) => {
        try {
            await fetch(`${DB_URL}/bookings/${bookingId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status })
            });
            setBookings((prev) =>
                prev.map((booking) =>
                    booking._id === bookingId ? { ...booking, status } : booking
                )
            );
        } catch(e) { console.error(e); }
    };

    // Messaging Management
    const sendMessage = async (messageData) => {
        messageData.id = messageData._id || `m${Date.now()}`;
        messageData.timestamp = new Date().toISOString();
        messageData.isRead = false;
        
        try {
            await fetch(`${DB_URL}/messages`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(messageData)
            });
            setMessages((prev) => [...prev, messageData]);
        } catch(e) { console.error(e); }
    };

    const markMessageRead = async (messageId) => {
        try {
            await fetch(`${DB_URL}/messages/${messageId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isRead: true })
            });
            setMessages((prev) =>
                prev.map((msg) =>
                    msg._id === messageId ? { ...msg, isRead: true } : msg
                )
            );
        } catch(e) { console.error(e); }
    };

    // Update Dashboard Data
    useEffect(() => {
        const myCars = user ? rides.filter(r => r.ownerId === user.email || r.ownerId === user._id) : [];
        const myBookings = user ? bookings.filter(b => b.ownerId === user.email || b.ownerId === user._id) : [];
        
        const revenue = myBookings.reduce((acc, curr) => acc + (curr.totalPrice || 0), 0);
        const recent = myBookings.slice(0, 5);

        setDashboardData({
            totalCars: myCars.length,
            totalBookings: myBookings.length,
            recentBookings: recent,
            monthlyRevenue: revenue
        });
    }, [rides, bookings, user]);

    const value = {
        rides,
        setRides,
        bookings,
        setBookings,
        messages,
        setMessages,
        dashboardData,
        user,
        login,
        logout,
        addRide,
        deleteRide,
        addBooking,
        updateBookingStatus,
        sendMessage,
        markMessageRead,
        currency
    };

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
};

export default AppContextProvider;
