from fastapi import APIRouter
from pydantic import BaseModel
import json
import os
from datetime import datetime

router = APIRouter()

MEMORY_FILE = "./data/memory.json"

def load_memory():
    if os.path.exists(MEMORY_FILE):
        with open(MEMORY_FILE, 'r') as f:
            return json.load(f)
    return {
        "user": {"name": "Azlan", "preferences": []},
        "topics": [],
        "sessions": [],
        "facts": [],
        "last_seen": None
    }

def save_memory(data):
    os.makedirs("./data", exist_ok=True)
    with open(MEMORY_FILE, 'w') as f:
        json.dump(data, f, indent=2)

@router.get("/memory")
async def get_memory():
    return load_memory()

@router.post("/memory/fact")
async def save_fact(data: dict):
    mem = load_memory()
    fact = data.get("fact", "")
    if fact and fact not in mem["facts"]:
        mem["facts"].append(fact)
    save_memory(mem)
    return {"status": "saved"}

@router.post("/memory/session")
async def save_session(data: dict):
    mem = load_memory()
    session = {
        "date": datetime.now().isoformat(),
        "topics": data.get("topics", []),
        "summary": data.get("summary", "")
    }
    mem["sessions"].append(session)
    mem["last_seen"] = datetime.now().isoformat()
    # Keep only last 10 sessions
    mem["sessions"] = mem["sessions"][-10:]
    save_memory(mem)
    return {"status": "saved"}

@router.post("/memory/topic")
async def add_topic(data: dict):
    mem = load_memory()
    topic = data.get("topic", "")
    if topic and topic not in mem["topics"]:
        mem["topics"].append(topic)
        mem["topics"] = mem["topics"][-20:]
    save_memory(mem)
    return {"status": "saved"}

@router.get("/memory/context")
async def get_context():
    mem = load_memory()
    context = f"User name: {mem['user']['name']}\n"
    if mem["last_seen"]:
        last = datetime.fromisoformat(mem["last_seen"])
        context += f"Last session: {last.strftime('%B %d, %Y')}\n"
    if mem["topics"]:
        context += f"Recent topics: {', '.join(mem['topics'][-5:])}\n"
    if mem["facts"]:
        context += f"Known facts: {', '.join(mem['facts'][-5:])}\n"
    return {"context": context}
