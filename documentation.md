# CarePlus Hospital Booking System

A premium, responsive web application for booking doctor appointments.

## 🚀 Key Features
- **Dynamic Booking**: Real-time doctor and slot selection.
- **Fully Responsive**: Works perfectly on Mobile, Tablet, and Desktop.
- **Premium UI**: Modern glassmorphism design with smooth animations.
- **Instant Receipt**: Generates a digital booking ticket immediately.
- **Validation**: Smart checks for patient details and slot availability.

## 🛠️ Tech Stack
- **Frontend**: HTML5, Vanilla CSS3 (Custom Properties, Flexbox, Grid).
- **Logic**: jQuery (DOM manipulation, AJAX).
- **Data**: JSON (Mock database for doctors and bookings).

## 💡 How it Works
1. **Load Data**: On startup, the system fetches doctor details from `doctors.json`.
2. **Filter & Select**: Users filter doctors by specialty and select their preferred physician.
3. **Check Availability**: When a date is picked, the system checks `bookings.json` to hide/disable already booked slots.
4. **Validation**: The form ensures the name, phone, and time slot are provided before allowing a "Book Now" action.
5. **Confirmation**: A success modal (digital ticket) is generated with a unique reference ID and all booking details.

## 📂 Project Structure
- `index.html`: Homepage with specialties and feature highlights.
- `booking.html`: The main appointment booking interface.
- `style.css`: Unified styling for the entire application.
- `script.js`: Core logic for data handling and UI interactions.
- `doctors.json`: database of available doctors.
