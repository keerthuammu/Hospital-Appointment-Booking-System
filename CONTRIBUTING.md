# Project Contribution Guide 🤝
-- For: The whole Team

## 🌿 Branching Strategy
1. **Never** work directly on `master`.
2. Work on your assigned branch: `${your-role-name}`.
3. Once a feature is done, create a Pull Request to `develop`.
4. **Keerthana** will review and merge into `master`.

## 💻 Git Quick Reference (Cheat Sheet)

### 1. Get the Code
```bash
# Clone the project for the first time
git clone <repository_url>
cd hospital-booking-system
```

### 2. Prepare Your Branch
```bash
# Create and switch to your specific branch
git checkout -b <your-branch-name>

# Verify which branch you are on
git branch
```

### 3. Update Your Work
```bash
# Get the latest changes from the team
git pull origin develop

# Save your current progress
git add .
git commit -m "Brief summary of what you did"
```

### 4. Share Your Code
```bash
# Push your branch to GitHub
git push origin <your-branch-name>
```

## 📋 Coding Standards
- **HTML**: Use semantic tags (`<section>`, `<article>`). - Jidhin
- **CSS**: Use variables from `:root` for colors. - Liya
- **JS/jQuery**: Keep functions modular. - Krishna/Joseph
- **PHP**: Use prepared statements for SQL. - Jobin
