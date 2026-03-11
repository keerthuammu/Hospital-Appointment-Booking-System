# 🏥 CarePlus Hospital System
**Project Overview for 12-Member Team**

## 📝 Abstract
A web-based platform for medical scheduling. Features a Glassmorphism UI, AJAX slot loading, and a PHP/MySQL backend.
# 🏥 CarePlus Hospital System
**Project Overview for 12-Member Team**

## 📝 Abstract
A web-based platform for medical scheduling. Features a Glassmorphism UI, AJAX slot loading, and a PHP/MySQL backend.

## 🛠️ Tech Stack
- **Frontend**: HTML5, CSS3, Bootstrap 5, jQuery, AJAX.
- **Backend**: PHP 8.x.
- **Database**: MySQL.

## 📁 5. Project Structure
```text
hospital-booking-system/
├── assets/             # Images and Icons
├── css/                # style.css
├── js/                 # script.js
├── docs/               # Team Resources (Setup, Roster, Testing)
├── backend/
│   ├── api/            # API Endpoints
│   ├── includes/       # config.php
│   └── TEAM_GUIDE.md   # Backend Instructions
├── database/           # MySQL Schema (.sql)
├── index.html          # Homepage
├── booking.html        # Booking Form
└── README.md           # Master Guide
```

## 💡 Workflow
1. **Load**: AJAX fetches doctors.
2. **Book**: jQuery validates inputs -> PHP saves to MySQL.
3. **Cancel**: Real-time cancellation via "My Bookings".

---
*For setup instructions, see [docs/TEAM_START.md](docs/TEAM_START.md)*
