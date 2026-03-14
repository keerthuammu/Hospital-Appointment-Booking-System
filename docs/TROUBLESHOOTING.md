# 🛠️ Troubleshooting Guide

If you are seeing a **"Server Error"** or the page isn't loading correctly, follow these steps to fix common setup issues.

---

### 1️⃣ Database Password Issues
By default, XAMPP uses user `root` with **no password**. If you have set a password for your local MySQL, the connection will fail.

**How to fix:**
1.  Open `backend/includes/config.php`.
2.  Find line 9: `$pass = '';`
3.  Change it to your actual password: `$pass = 'your_password_here';`
4.  Save the file and refresh the page.

---

### 2️⃣ Incorrect URL Path
The project expects to be in a folder named exactly `Hospital-Appointment-Booking-System` inside your `htdocs` folder.

**Verify your path:**
- **Correct Path**: `C:\xampp\htdocs\Hospital-Appointment-Booking-System\`
- **Correct URL**: `http://localhost/Hospital-Appointment-Booking-System/`

> [!IMPORTANT]
> If you renamed the folder (e.g., to just `careplus`), your URL must match: `http://localhost/careplus/`.

---

### 3️⃣ MySQL Port Conflicts (3306 vs 3307)
If your XAMPP MySQL is running on a port other than **3306** (e.g., 3307), you must tell the code.

**How to fix:**
1.  Open `backend/includes/config.php`.
2.  Change line 12 from:
    `$dsn = "mysql:host=$host;dbname=$db;charset=$charset";`
    to:
    `$dsn = "mysql:host=$host;port=3307;dbname=$db;charset=$charset";`
3.  Replace `3307` with the port shown in your XAMPP Control Panel.

---

### 4️⃣ Debugging with Browser Console
If the error still persists, the browser can tell you exactly what is wrong.
1.  Open the login page in Chrome/Edge.
2.  Press **F12** (or Right-click -> **Inspect**).
3.  Click the **Console** tab.
4.  Look for **Red text**. It will often say "Connection refused" or "Access denied for user".

---
*For general setup, refer to [docs/SETUP_QUICKSTART.md](SETUP_QUICKSTART.md).*
