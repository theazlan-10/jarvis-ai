import subprocess
import time
import requests
import os

BACKEND_URL = "http://localhost:8080/api/health"
RESTART_CMD = ["python", "run.py"]
LOG_FILE = os.path.expanduser("~/jarvis-ai/backend/data/watchdog.log")

def log(msg):
    os.makedirs(os.path.dirname(LOG_FILE), exist_ok=True)
    with open(LOG_FILE, 'a') as f:
        f.write(f"{time.strftime('%Y-%m-%d %H:%M:%S')} — {msg}\n")
    print(msg)

def check_health():
    try:
        r = requests.get(BACKEND_URL, timeout=5)
        return r.status_code == 200
    except:
        return False

process = None

def start_backend():
    global process
    log("Starting JARVIS backend...")
    process = subprocess.Popen(
        RESTART_CMD,
        cwd=os.path.expanduser("~/jarvis-ai/backend")
    )
    log(f"Backend started PID: {process.pid}")

start_backend()

while True:
    time.sleep(30)
    if not check_health():
        log("⚠️ Backend down! Restarting...")
        if process:
            process.terminate()
        time.sleep(3)
        start_backend()
    else:
        log("✅ Backend healthy")
