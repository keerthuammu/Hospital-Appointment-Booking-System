# 🚀 How to Run the Project (Local Setup)

Since this project uses **PHP** and **MySQL**, it cannot be opened by just double-clicking the HTML files. You need a local server.

---

### 1️⃣ Install a Local Server
Download and install one of these:
- **XAMPP** (Recommended for Windows/Mac/Linux) -> [Download XAMPP](https://www.apachefriends.org/download.html)
- **WAMP** (Windows only)
- **MAMP** (Mac only)

---

### 2️⃣ Move the Project Folder
1. Copy your entire `hospital-booking-system` folder.
2. Paste it into the server's public directory:
   - **XAMPP**: `C:\xampp\htdocs\`
   - **WAMP**: `C:\wamp64\www\`

---

### 3️⃣ Start the Server
1. Open the **XAMPP Control Panel**.
2. Click **Start** for **Apache** (the web server).
3. Click **Start** for **MySQL** (the database).

---

### 4️⃣ Setup the Database
1. Open your browser and go to: `http://localhost/phpmyadmin/`
2. Click **New** on the left menu.
3. Name the database: **`hospital_booking_system`** and click **Create**.
4. Click the **Import** tab at the top.
5. Click **Choose File** and select: 
   `database/schema.sql` (inside your project folder).
6. Click **Go** at the bottom.

---

### 5️⃣ Run the Application
1. In your browser, go to:
   `http://localhost/hospital-booking-system/`
2. You should see the homepage! Try clicking **"Book Now"**.

---

### 💡 Troubleshooting
- **Database Connection Error**: Open `backend/includes/config.php` and check if the `db_name`, `db_user`, and `db_pass` match your local settings.
- **Port Busy**: If Apache doesn't start, make sure Skype or another web server isn't using port 80.
