#  MY-AI-SECOND-BRAIN

A personal memory & idea vault — your digital second brain built with **FastAPI**, **React**, **Tailwind CSS**, and **JSON storage**.

---

##  Features

-  **Memory Blocks** — Capture ideas, memories, quotes, learnings, tasks, dreams & insights
-  **Pin Important Memories** — Keep key thoughts at the top
-  **Tag System** — Organize with custom tags and explore via Tag Cloud
-  **8 Categories** — General, Ideas, Memories, Quotes, Learning, Tasks, Dreams, Insights
-  **Smart Search** — Full-text search across titles, content, and tags
-  **Analytics Dashboard** — Track memory stats, word counts, activity heatmap, category breakdown
-  **Accent Colors** — Personalize each memory with a color accent
-  **Relative Timestamps** — "just now", "2h ago", etc.
-  **View Counts** — Track which memories you revisit most
- **Responsive Layout** — Works on desktop and mobile

---

##  Project Structure

```
MY-AI-SECOND-BRAIN/
├── backend/
│   ├── main.py              # FastAPI app with all endpoints
│   ├── requirements.txt     # Python dependencies
│   └── data/
│       └── brain_data.json  # Auto-created JSON storage
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Sidebar.jsx
│   │   │   ├── MemoryCard.jsx
│   │   │   ├── MemoryModal.jsx
│   │   │   └── ViewMemoryModal.jsx
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── MemoriesPage.jsx
│   │   │   ├── SearchPage.jsx
│   │   │   ├── AnalyticsPage.jsx
│   │   │   └── TagsPage.jsx
│   │   ├── utils/
│   │   │   ├── api.js
│   │   │   └── helpers.js
│   │   ├── App.jsx
│   │   ├── index.js
│   │   └── index.css
│   ├── package.json
│   ├── tailwind.config.js
│   └── postcss.config.js
├── start.sh                 # Linux/Mac startup script
├── start.bat                # Windows startup script
└── README.md
```

---

##  Quick Start

### Prerequisites
- **Python 3.8+**
- **Node.js 16+** and **npm**

---

### Option 1: One-Command Start (Linux/Mac)

```bash
chmod +x start.sh
./start.sh
```

### Option 2: One-Command Start (Windows)

Double-click `start.bat` or run:
```cmd
start.bat
```

---

### Option 3: Manual Setup

#### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

#### Frontend (in a new terminal)
```bash
cd frontend
npm install
npm start
```

---

##  Access

| Service | URL |
|---------|-----|
| Frontend App | http://localhost:3000 |
| Backend API | http://localhost:8000 |
| API Docs (Swagger) | http://localhost:8000/docs |
| API Docs (ReDoc) | http://localhost:8000/redoc |

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/memories` | List all memories (filterable) |
| POST | `/memories` | Create a new memory |
| GET | `/memories/{id}` | Get a single memory |
| PUT | `/memories/{id}` | Update a memory |
| DELETE | `/memories/{id}` | Delete a memory |
| POST | `/memories/{id}/pin` | Toggle pin status |
| GET | `/stats` | Get brain statistics |
| GET | `/tags` | Get all tags |

### Query Parameters for GET /memories
- `search` — full-text search
- `category` — filter by category
- `tag` — filter by tag

---

##  Data Storage

All data is stored in `backend/data/brain_data.json`. This file is auto-created on first run.
Back it up regularly to preserve your memories!

---

##  Tech Stack

- **Backend**: FastAPI (Python) + JSON file storage
- **Frontend**: React 18 + Tailwind CSS + Lucide Icons
- **Fonts**: Playfair Display + DM Sans + JetBrains Mono
- **HTTP**: Axios

---

