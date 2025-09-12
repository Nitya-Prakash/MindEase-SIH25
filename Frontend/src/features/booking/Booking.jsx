import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import api from "../../services/api";

export default function Booking() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [counselors, setCounselors] = useState([]);
  const [selectedCounselor, setSelectedCounselor] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(true);

  // Fetch available counselors
  useEffect(() => {
    async function fetchCounselors() {
      try {
        const res = await api.get("/users/counselors");
        console.log("Counselors API response:", res.data);
        
        // Handle different response formats
        const counselorsArray = res.data?.success ? res.data.data : (Array.isArray(res.data) ? res.data : res.data?.data || []);
        
        setCounselors(counselorsArray);
        if (counselorsArray.length > 0) {
          setSelectedCounselor(counselorsArray[0]._id);
        } else {
          setMessage("No counselors available at the moment.");
        }
      } catch (err) {
        console.error("Failed to fetch counselors:", err);
        setMessage("Failed to load counselors. Please refresh the page.");
      }
    }
    fetchCounselors();
  }, []);

  // Fetch logged-in user's bookings
  useEffect(() => {
    async function fetchBookings() {
      try {
        setLoadingBookings(true);
        const res = await api.get("/bookings");
        console.log("Bookings API response:", res.data);
        
        // Handle different response formats
        const bookingsArray = res.data?.success ? res.data.data : (Array.isArray(res.data) ? res.data : res.data?.data || []);
        
        setBookings(bookingsArray);
      } catch (err) {
        console.error("Failed to fetch bookings:", err);
        setMessage("Failed to load your bookings.");
      } finally {
        setLoadingBookings(false);
      }
    }
    fetchBookings();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDate) {
      setMessage("Please select a date and time.");
      return;
    }
    if (!selectedCounselor) {
      setMessage("Please select a counselor.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const payload = {
        datetime: selectedDate.toISOString(),
        counselorId: selectedCounselor,
      };
      
      console.log("Creating booking with payload:", payload);
      const response = await api.post("/api/bookings", payload);
      console.log("Booking creation response:", response.data);
      
      // Extract the booking from the response
      const newBooking = response.data.booking || response.data.data || response.data;
      
      if (newBooking) {
        // Add the new booking to the list
        setBookings((prev) => [...prev, newBooking]);
        setMessage("Booking created successfully!");
        setSelectedDate(null);
      } else {
        console.error("No booking data in response:", response.data);
        setMessage("Booking created but there was an issue displaying it. Please refresh the page.");
      }
    } catch (err) {
      console.error("Booking creation error:", err);
      setMessage(err.response?.data?.message || "Booking failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (bookingId, newStatus) => {
    try {
      const response = await api.put(`/bookings/${bookingId}/status`, { status: newStatus });
      const updatedBooking = response.data;
      
      // Update the booking in the state
      setBookings(prev => prev.map(booking => 
        booking._id === bookingId ? updatedBooking : booking
      ));
      
      setMessage(`Booking ${newStatus.toLowerCase()} successfully!`);
    } catch (err) {
      console.error("Status update error:", err);
      setMessage(err.response?.data?.message || "Failed to update booking status.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
      <div className="w-full max-w-4xl bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Book a Counseling Session
        </h2>

        {message && (
          <div
            className={`mb-4 p-3 rounded border text-center ${
              message.toLowerCase().includes("success")
                ? "bg-green-100 border-green-400 text-green-700"
                : "bg-red-100 border-red-400 text-red-700"
            }`}
          >
            {message}
          </div>
        )}

        {/* Booking Form */}
        <form onSubmit={handleSubmit} className="space-y-5 mb-8">
          <div>
            <label className="block mb-2 font-semibold">Select Counselor</label>
            {counselors.length > 0 ? (
              <select
                className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedCounselor}
                onChange={(e) => setSelectedCounselor(e.target.value)}
                required
              >
                {counselors.map((counselor) => (
                  <option key={counselor._id} value={counselor._id}>
                    {counselor.name} ({counselor.email})
                  </option>
                ))}
              </select>
            ) : (
              <p className="text-gray-500 italic">Loading counselors...</p>
            )}
          </div>

          <div>
            <label className="block mb-2 font-semibold">Select Date & Time</label>
            <DatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              showTimeSelect
              timeIntervals={30}
              minDate={new Date()}
              dateFormat="Pp"
              className="w-full border p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholderText="Click to select date and time"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading || counselors.length === 0}
            className={`w-full p-3 rounded text-white font-semibold transition ${
              loading || counselors.length === 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Booking..." : "Book Session"}
          </button>
        </form>

        {/* Bookings Table */}
        <h3 className="mt-10 text-xl font-semibold border-b pb-2 mb-4 text-center">
          Your Bookings
        </h3>

        {loadingBookings ? (
          <p className="text-center text-gray-500">Loading your bookings...</p>
        ) : bookings.length === 0 ? (
          <p className="text-center text-gray-500">
            You have no bookings yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm sm:text-base shadow-md">
              <thead>
                <tr className="bg-blue-600 text-white">
                  <th className="p-3 text-left">Date</th>
                  <th className="p-3 text-left">Time</th>
                  <th className="p-3 text-left">Counselor</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => {
                  const dateObj = new Date(booking.datetime);
                  const date = dateObj.toLocaleDateString(undefined, {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  });
                  const time = dateObj.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  });
                  
                  return (
                    <tr
                      key={booking._id}
                      className="border-b hover:bg-blue-50 transition"
                    >
                      <td className="p-3 font-medium">{date}</td>
                      <td className="p-3">{time}</td>
                      <td className="p-3">
                        {booking.counselor?.name || "Loading..."}
                        {booking.counselor?.email && (
                          <div className="text-xs text-gray-500">
                            {booking.counselor.email}
                          </div>
                        )}
                      </td>
                      <td className="p-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            booking.status === "Confirmed"
                              ? "bg-green-100 text-green-800"
                              : booking.status === "Pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : booking.status === "Cancelled"
                              ? "bg-red-100 text-red-800"
                              : booking.status === "Completed"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {booking.status}
                        </span>
                      </td>
                      <td className="p-3">
                        {booking.status === "Pending" && (
                          <button
                            onClick={() => handleStatusUpdate(booking._id, "Cancelled")}
                            className="text-red-600 hover:text-red-800 text-xs font-semibold"
                          >
                            Cancel
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}