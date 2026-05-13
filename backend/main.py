from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
import json
import os
from datetime import datetime
import uuid

app = FastAPI(title="MY-AI-SECOND-BRAIN API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DATA_FILE = "data/brain_data.json"

def ensure_data_file():
    os.makedirs("data", exist_ok=True)
    if not os.path.exists(DATA_FILE):
        with open(DATA_FILE, "w") as f:
            json.dump({"memories": [], "tags": [], "stats": {"total_entries": 0, "total_tags": 0}}, f, indent=2)

def load_data():
    ensure_data_file()
    with open(DATA_FILE, "r") as f:
        return json.load(f)

def save_data(data):
    ensure_data_file()
    with open(DATA_FILE, "w") as f:
        json.dump(data, f, indent=2)

class Memory(BaseModel):
    title: str
    content: str
    tags: List[str] = []
    category: str = "general"
    is_pinned: bool = False
    color: Optional[str] = "#6366f1"

class MemoryUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    tags: Optional[List[str]] = None
    category: Optional[str] = None
    is_pinned: Optional[bool] = None
    color: Optional[str] = None

@app.get("/")
def root():
    return {"message": "MY-AI-SECOND-BRAIN API is running 🧠"}

@app.get("/memories")
def get_memories(search: Optional[str] = None, category: Optional[str] = None, tag: Optional[str] = None):
    data = load_data()
    memories = data["memories"]
    if search:
        memories = [m for m in memories if search.lower() in m["title"].lower() or search.lower() in m["content"].lower()]
    if category and category != "all":
        memories = [m for m in memories if m.get("category") == category]
    if tag:
        memories = [m for m in memories if tag in m.get("tags", [])]
    pinned = [m for m in memories if m.get("is_pinned")]
    unpinned = [m for m in memories if not m.get("is_pinned")]
    pinned.sort(key=lambda x: x["created_at"], reverse=True)
    unpinned.sort(key=lambda x: x["created_at"], reverse=True)
    return {"memories": pinned + unpinned, "total": len(memories)}

@app.post("/memories")
def create_memory(memory: Memory):
    data = load_data()
    new_memory = {
        "id": str(uuid.uuid4()),
        "title": memory.title,
        "content": memory.content,
        "tags": memory.tags,
        "category": memory.category,
        "is_pinned": memory.is_pinned,
        "color": memory.color,
        "created_at": datetime.now().isoformat(),
        "updated_at": datetime.now().isoformat(),
        "word_count": len(memory.content.split()),
        "views": 0
    }
    data["memories"].append(new_memory)
    all_tags = set(data.get("tags", []))
    all_tags.update(memory.tags)
    data["tags"] = list(all_tags)
    data["stats"]["total_entries"] = len(data["memories"])
    data["stats"]["total_tags"] = len(data["tags"])
    save_data(data)
    return new_memory

@app.get("/memories/{memory_id}")
def get_memory(memory_id: str):
    data = load_data()
    for m in data["memories"]:
        if m["id"] == memory_id:
            m["views"] = m.get("views", 0) + 1
            save_data(data)
            return m
    raise HTTPException(status_code=404, detail="Memory not found")

@app.put("/memories/{memory_id}")
def update_memory(memory_id: str, update: MemoryUpdate):
    data = load_data()
    for m in data["memories"]:
        if m["id"] == memory_id:
            if update.title is not None: m["title"] = update.title
            if update.content is not None:
                m["content"] = update.content
                m["word_count"] = len(update.content.split())
            if update.tags is not None:
                m["tags"] = update.tags
                all_tags = set(data.get("tags", []))
                all_tags.update(update.tags)
                data["tags"] = list(all_tags)
            if update.category is not None: m["category"] = update.category
            if update.is_pinned is not None: m["is_pinned"] = update.is_pinned
            if update.color is not None: m["color"] = update.color
            m["updated_at"] = datetime.now().isoformat()
            save_data(data)
            return m
    raise HTTPException(status_code=404, detail="Memory not found")

@app.delete("/memories/{memory_id}")
def delete_memory(memory_id: str):
    data = load_data()
    original_len = len(data["memories"])
    data["memories"] = [m for m in data["memories"] if m["id"] != memory_id]
    if len(data["memories"]) == original_len:
        raise HTTPException(status_code=404, detail="Memory not found")
    data["stats"]["total_entries"] = len(data["memories"])
    save_data(data)
    return {"message": "Memory deleted successfully"}

@app.get("/stats")
def get_stats():
    data = load_data()
    memories = data["memories"]
    categories = {}
    for m in memories:
        cat = m.get("category", "general")
        categories[cat] = categories.get(cat, 0) + 1
    total_words = sum(m.get("word_count", 0) for m in memories)
    pinned_count = sum(1 for m in memories if m.get("is_pinned"))
    recent = sorted(memories, key=lambda x: x["created_at"], reverse=True)[:5]
    return {
        "total_memories": len(memories),
        "total_tags": len(data.get("tags", [])),
        "total_words": total_words,
        "pinned_count": pinned_count,
        "categories": categories,
        "tags": data.get("tags", []),
        "recent_memories": recent
    }

@app.get("/tags")
def get_tags():
    data = load_data()
    return {"tags": data.get("tags", [])}

@app.post("/memories/{memory_id}/pin")
def toggle_pin(memory_id: str):
    data = load_data()
    for m in data["memories"]:
        if m["id"] == memory_id:
            m["is_pinned"] = not m.get("is_pinned", False)
            m["updated_at"] = datetime.now().isoformat()
            save_data(data)
            return {"is_pinned": m["is_pinned"]}
    raise HTTPException(status_code=404, detail="Memory not found")
