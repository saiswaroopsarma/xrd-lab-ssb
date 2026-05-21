# XRD Lab Database — Complete Setup Guide

This guide takes you from zero to a live website your labmates can access.
No prior knowledge of GitHub or Railway needed.

---

## What you'll end up with

- A URL like `https://xrd-lab.up.railway.app` that anyone in your lab can open
- A real database (SQLite) that saves everything permanently
- Your labmates can add patterns, search, and view XRDs from any device

**Time needed:** about 30–45 minutes the first time.

---

## PART 1 — Install tools on your computer

You only do this once.

### Step 1 — Install Node.js

Node.js is the engine that runs the backend server.

1. Go to: https://nodejs.org
2. Download the **LTS** version (the green button, left side)
3. Run the installer — click Next through everything, keep all defaults
4. When done, open a terminal (see below) and type:
   ```
   node --version
   ```
   You should see something like `v20.11.0`. If yes, Node.js is installed.

**How to open a terminal:**
- **Windows:** Press `Win + R`, type `cmd`, press Enter
- **Mac:** Press `Cmd + Space`, type `Terminal`, press Enter

---

### Step 2 — Install Git

Git is how you send code to GitHub.

1. Go to: https://git-scm.com/downloads
2. Download for your OS and run the installer
3. Keep all defaults — just click Next
4. Check it worked:
   ```
   git --version
   ```
   Should show something like `git version 2.43.0`

---

## PART 2 — Set up GitHub (free code storage)

### Step 3 — Create a GitHub account

1. Go to: https://github.com
2. Click **Sign up** — use your email, create a username and password
3. Verify your email

### Step 4 — Create a new repository (project folder on GitHub)

1. After logging in, click the **+** button (top right) → **New repository**
2. Fill in:
   - **Repository name:** `xrd-lab`
   - **Description:** XRD Pattern Database for our lab
   - **Visibility:** Private ← important, keeps your data private
3. Do NOT tick any checkboxes (no README, no .gitignore)
4. Click **Create repository**
5. GitHub shows a page with commands. **Leave this page open** — you'll need it in a minute.

---

## PART 3 — Put the code on your computer

### Step 5 — Download the project files

You received a folder called `xrd-lab` containing these files:

```
xrd-lab/
  backend/
    src/
      index.js
      db.js
      routes/
        entries.js
    package.json
    .env.example
  frontend/
    src/
      App.jsx
      api.js
      index.js
    public/
      index.html
    package.json
  railway.toml
  package.json
  .gitignore
```

Save this folder somewhere easy to find, for example:
- **Windows:** `C:\Users\YourName\xrd-lab`
- **Mac:** `/Users/YourName/xrd-lab`

### Step 6 — Open a terminal inside the xrd-lab folder

**Windows:**
1. Open File Explorer and navigate to the `xrd-lab` folder
2. Click the address bar at the top, type `cmd`, press Enter
3. A terminal opens already inside the folder

**Mac:**
1. Open Terminal
2. Type `cd ` (with a space after), then drag the `xrd-lab` folder into the Terminal window
3. Press Enter

Confirm you're in the right place:
```
dir         ← Windows
ls          ← Mac
```
You should see `backend`, `frontend`, `railway.toml` listed.

### Step 7 — Upload code to GitHub

Type these commands one at a time, pressing Enter after each:

```bash
git init
git add .
git commit -m "first commit"
git branch -M main
```

Now go back to the GitHub page from Step 4. Copy the two lines that look like:
```
git remote add origin https://github.com/YOURNAME/xrd-lab.git
git push -u origin main
```
Paste them into your terminal and press Enter.

GitHub will ask for your username and password.
**Note for password:** GitHub doesn't accept your account password here — you need a token:
1. Go to: https://github.com/settings/tokens
2. Click **Generate new token (classic)**
3. Give it a name like "xrd-lab", tick the **repo** checkbox
4. Click **Generate token** at the bottom
5. Copy the token (starts with `ghp_...`) — use this as your password

After pushing, refresh GitHub — you'll see all your files there.

---

## PART 4 — Deploy on Railway (free hosting)

### Step 8 — Create a Railway account

1. Go to: https://railway.app
2. Click **Login** → **Login with GitHub**
3. Authorise Railway to access your GitHub

Railway's free tier gives you $5 of credit per month which is enough for a lab app with low traffic. If you need more, it's about $5/month.

### Step 9 — Create a new Railway project

1. In Railway, click **New Project**
2. Click **Deploy from GitHub repo**
3. If prompted, click **Configure GitHub App** and give Railway access to your `xrd-lab` repository
4. Select `xrd-lab` from the list
5. Railway starts building automatically

### Step 10 — Add a persistent volume (so data is saved permanently)

By default Railway's filesystem resets on redeploy. We need a volume so the database file survives.

1. In your Railway project, click on the service (the box that appeared)
2. Click **Volumes** in the left sidebar
3. Click **Add Volume**
4. Set **Mount Path** to `/data`
5. Click **Add**

### Step 11 — Set environment variables

1. In the service, click **Variables**
2. Click **New Variable** and add:

| Name | Value |
|------|-------|
| `NODE_ENV` | `production` |
| `DB_DIR` | `/data` |

3. Click **Add** after each one

Railway will automatically redeploy when you save variables.

### Step 12 — Get your public URL

1. Click **Settings** in the service
2. Under **Networking**, click **Generate Domain**
3. Railway gives you a URL like `https://xrd-lab-production.up.railway.app`
4. Click the URL — your XRD database is live!

Share this URL with your labmates. Everyone can access it from any browser.

---

## PART 5 — Running the app locally on your own computer (optional)

If you want to test changes before pushing to Railway, you can run the app on your own machine.

### Step 13 — Install dependencies

In your terminal (inside the `xrd-lab` folder):

```bash
cd backend
npm install
cd ../frontend
npm install
cd ..
```

This downloads all the required packages. Takes 2–3 minutes.

### Step 14 — Create the backend .env file

```bash
cd backend
```

**Windows:** `copy .env.example .env`
**Mac:** `cp .env.example .env`

Open `.env` in any text editor (Notepad is fine) and make sure it looks like:
```
PORT=3001
NODE_ENV=development
DB_DIR=./data
FRONTEND_URL=http://localhost:3000
```

### Step 15 — Start backend and frontend (two terminals)

**Terminal 1 — Backend:**
```bash
cd backend
node src/index.js
```
You'll see: `XRD Lab server running on port 3001`

**Terminal 2 — Frontend** (open a new terminal window):
```bash
cd frontend
npm start
```
A browser tab opens automatically at `http://localhost:3000`

The app is now running locally. Data is saved in `backend/data/xrd_lab.db`.

---

## PART 6 — Updating the app in the future

Whenever you change any code file and want to push it live:

```bash
git add .
git commit -m "describe what you changed"
git push
```

Railway detects the push and redeploys automatically within 2–3 minutes. No other steps needed.

---

## PART 7 — How to use the app

### Adding a single pattern

1. Click **+ Add Pattern**
2. Type the composition formula (e.g. `BaTiO3` or `La0.8Sr0.2FeO3`) — this is the only required field
3. Drag and drop your `.xy` file into the upload box
   - The app reads the file directly in the browser
   - It extracts 2θ peak positions automatically
4. Fill in any optional fields: phase, synthesis method, temperature, atmosphere, notes
5. Click **Save** — pattern is stored in the database immediately

### Bulk importing 50–100 patterns

1. Click **⬆ Bulk Import**
2. **Step ①:** Drop your `.xy` files (select all at once) or a `.zip` archive
3. **Step ②:** Drop your Excel or CSV file with metadata

**Your Excel should have these column headers** (exact names, lowercase):

| filename | composition | name | phase | synthesis | temperature | atmosphere | date | notes |
|----------|-------------|------|-------|-----------|-------------|------------|------|-------|
| BaTiO3_1200C.xy | BaTiO3 | BaTiO3 Tetragonal | Tetragonal P4mm | Solid-state, 4h | 1200 | Air | 2024-03-15 | Pure phase |
| LaFeO3_800C.xy | LaFeO3 | LaFeO3 | Orthorhombic | Sol-gel | 800 | Air | 2024-04-02 | |

- The `filename` column must match the actual `.xy` filenames exactly
- All columns except `composition` are optional
- Click **Import N Patterns** — all entries go into the database at once

### Searching by elements (Periodic Table)

1. Click **Periodic Table Selector** tab
2. Click any element — e.g. click **La**, then **Fe**, then **O**
3. The list updates to show:
   - ✅ **Exact matches** — compositions that are exactly La+Fe+O (like LaFeO₃)
   - 🟡 **Partial matches** — compositions sharing some of those elements
4. Click any result card to see the full pattern and details in the side panel
5. Click **Clear** to reset the selection

### Text search

Type anything in the search bar — composition, element symbol, phase name, synthesis method — results update as you type.

### Viewing a pattern

Click any card in the list. A panel opens on the right showing:
- The full XRD diffractogram (plotted from the real .xy data)
- All metadata (phase, synthesis, temperature, etc.)
- Detected peak positions

---

## Troubleshooting

**Railway build fails:**
- Click on the failed deployment in Railway, then **View Logs**
- The most common cause is a missing file — check all files were pushed to GitHub with `git status`

**"Cannot connect to server" in the app:**
- Check Railway → your service → **Logs** for error messages
- Make sure the `NODE_ENV=production` and `DB_DIR=/data` variables are set

**Data disappeared after redeploy:**
- This means the volume wasn't set up. Go back to Step 10 and add the `/data` volume.

**Port errors when running locally:**
- Make sure the backend terminal shows "running on port 3001" before opening the frontend
- Make sure nothing else is using port 3001 (close other development servers)

**"git push" asks for password every time:**
- Run: `git config --global credential.helper store`
- This saves your token so you don't have to type it again

---

## Backing up your data

The database is a single file. To download it:

1. In Railway, go to your service → **Volumes**
2. Click the volume → **Connect**
3. Railway shows SSH/SFTP connection details to download `/data/xrd_lab.db`

Alternatively, add a weekly reminder to run:
```bash
# from your local machine
scp <railway-ssh-details>:/data/xrd_lab.db ./backup_$(date +%Y%m%d).db
```

Or simply: periodically export your data from the app's search and copy it somewhere safe.

---

## Summary — the 5 commands you'll use regularly

```bash
# 1. First time only — install everything
cd backend && npm install && cd ../frontend && npm install && cd ..

# 2. Run locally (two terminals)
cd backend && node src/index.js          # terminal 1
cd frontend && npm start                 # terminal 2

# 3. Push changes to Railway (anytime you edit code)
git add . && git commit -m "your message" && git push

# 4. Check what files changed
git status

# 5. Pull latest code (if a labmate pushed changes)
git pull
```
