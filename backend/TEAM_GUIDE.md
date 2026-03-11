# Backend Team Guide 🚀

This folder contains the scaffolding for the CarePlus backend.

## 👥 Roles & Responsibilities
- **Jobin (PHP Backend)**: Complete the logic in `backend/api/*.php` and handle server-side validation.
- **Lamees (Database Designer)**: Refine `database/schema.sql`, set up MySQL, and optimize queries.
- **Josekutty (AJAX Developer)**: Update `script.js` to point to these PHP endpoints instead of JSON files.
- **Mahi (Integration)**: Ensure frontend data matches the SQL schema and handle error responses.

## 📂 Structure
- `/database/schema.sql`: MySQL table definitions.
- `/backend/config.php`: Central DB connection file.
- `/backend/api/get_doctors.php`: Endpoint to fetch doctors.
- `/backend/api/book_appointment.php`: Endpoint to save appointments.

## 🛠️ Getting Started
1. Import `database/schema.sql` into your local MySQL server.
2. Update `backend/config.php` with your local DB credentials.
3. Test the APIs using Postman or a browser.
