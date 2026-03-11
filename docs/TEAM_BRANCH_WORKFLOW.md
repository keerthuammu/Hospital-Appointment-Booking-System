# Team Branch Workflow Guide

This guide gives a simple, shared process for editing, committing, pushing, and creating pull requests.

## 1. Start of Day

```bash
cd "C:\AJCE PROJECTS\Hospital-Appointment-Booking-System"
git fetch origin
git checkout <your-branch>
git pull origin <your-branch>
```

If your team syncs from `develop`:

```bash
git merge origin/develop
```

If your team syncs from `main`:

```bash
git merge origin/main
```

## 2. Do Your Edits

- Work only on your assigned files.
- Keep changes small and focused.
- Save and test locally before committing.

## 3. Review Your Changes

```bash
git status
git diff
```

## 4. Commit Your Work

```bash
git add .
git commit -m "UI: update root theme variables and spacing"
```

Suggested commit style:

- `UI: ...`
- `HTML: ...`
- `JS: ...`
- `PHP: ...`
- `DB: ...`
- `Docs: ...`

## 5. Push to Remote

```bash
git push origin <your-branch>
```

## 6. Create Pull Request

- Open a PR from your branch to `develop` (or `main`, based on team flow).
- Add a clear title and summary of what changed.
- Ask reviewer(s) and wait for approval before merge.

## 7. Handle Merge Conflicts

```bash
git status
```

- Open conflicted files and keep the correct final code.

```bash
git add .
git commit -m "Resolve merge conflicts"
git push origin <your-branch>
```

## 8. Useful Commands

```bash
git log --oneline -10
git restore --staged <file>
git restore <file>
git branch
git branch -m <new-branch-name>
```

## 9. Team Rules

- Do not push directly to protected branch unless team allows it.
- Pull latest changes before starting new work.
- One task per PR when possible.
- Write meaningful commit messages.
- Resolve review comments before asking to merge.

## 10. Role Mapping Reminder

Use the roster in [TEAM_ROSTER.md](TEAM_ROSTER.md) for role-based task ownership.