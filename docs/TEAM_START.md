# 🚀 Team Starter Guide (12 Members)

## 1. Get Started (Git)
```bash
# Clone & Enter
git clone <repo_url>
cd hospital-booking-system

# Switch to your branch
git checkout <your-branch-name>

# Update & Push
git pull origin develop
git add .
git commit -m "Describe work"
git push origin <your-branch-name>
```

## 2. Role Instructions
| Role | Action | File |
| :--- | :--- | :--- |
| **Design/HTML** | Stylize cards & semantic tags | `style.css`, `index.html` |
| **Bootstrap** | Add modals & layout | `booking.html`, `index.html` |
| **JS/jQuery** | Validation & UI Logic | `script.js` |
| **AJAX** | Connect APIs | `script.js` (see comments) |
| **PHP/DB** | SQL & API Logic | `backend/`, `database/` |
| **Tester** | Check mobile & bugs | `TESTING.md` |

## 3. Workflow
- Create PR to **`develop`** branch.
- Use CSS variables from `:root` for colors.
- Follow comments in `js/script.js` marked for your role.

---
**Need help running the project?** Check the [RUN_GUIDE.md](RUN_GUIDE.md)
