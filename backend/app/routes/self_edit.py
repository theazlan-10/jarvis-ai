from fastapi import APIRouter
from pydantic import BaseModel
import os
import re
import json
from datetime import datetime

router = APIRouter()

HTML_FILE = os.path.expanduser("~/jarvis.html")
EDIT_LOG = os.path.expanduser("~/jarvis-ai/backend/data/edit_log.json")

def load_log():
    if os.path.exists(EDIT_LOG):
        with open(EDIT_LOG) as f:
            return json.load(f)
    return []

def save_log(log):
    os.makedirs(os.path.dirname(EDIT_LOG), exist_ok=True)
    with open(EDIT_LOG, 'w') as f:
        json.dump(log, f, indent=2)

def read_html():
    with open(HTML_FILE, 'r') as f:
        return f.read()

def write_html(content):
    # Backup first
    backup = HTML_FILE + '.backup'
    with open(HTML_FILE, 'r') as f:
        old = f.read()
    with open(backup, 'w') as f:
        f.write(old)
    with open(HTML_FILE, 'w') as f:
        f.write(content)

class EditRequest(BaseModel):
    command: str
    value: str = ""

@router.post("/self/edit")
async def self_edit(req: EditRequest):
    try:
        html = read_html()
        original = html
        result = ""
        cmd = req.command.lower()
        val = req.value

        # THEME CHANGE
        if 'theme' in cmd or 'color' in cmd:
            if 'red' in cmd or 'red' in val:
                html = html.replace('--cyan:#00f2fe', '--cyan:#ff4444')
                html = html.replace('--cyan:#00ccff', '--cyan:#ff4444')
                html = html.replace('color:#00ccff', 'color:#ff4444')
                result = "Theme changed to RED"
            elif 'green' in cmd or 'green' in val:
                html = html.replace('--cyan:#00f2fe', '--cyan:#00ff88')
                html = html.replace('color:#00ccff', 'color:#00ff88')
                result = "Theme changed to GREEN"
            elif 'purple' in cmd or 'purple' in val:
                html = html.replace('--cyan:#00f2fe', '--cyan:#9d4edd')
                html = html.replace('color:#00ccff', 'color:#9d4edd')
                result = "Theme changed to PURPLE"
            elif 'gold' in cmd or 'gold' in val or 'yellow' in val:
                html = html.replace('--cyan:#00f2fe', '--cyan:#ffd700')
                html = html.replace('color:#00ccff', 'color:#ffd700')
                result = "Theme changed to GOLD"
            elif 'blue' in cmd or 'blue' in val or 'cyan' in val:
                html = html.replace('--cyan:#ff4444', '--cyan:#00f2fe')
                html = html.replace('--cyan:#00ff88', '--cyan:#00f2fe')
                html = html.replace('--cyan:#9d4edd', '--cyan:#00f2fe')
                html = html.replace('--cyan:#ffd700', '--cyan:#00f2fe')
                result = "Theme restored to CYAN/BLUE"
            else:
                result = "Unknown color. Try: red, green, purple, gold, blue"

        # TITLE CHANGE
        elif 'title' in cmd or 'name' in cmd:
            if val:
                html = re.sub(r'<title>.*?</title>', f'<title>{val}</title>', html)
                result = f"Title changed to: {val}"
            else:
                result = "Please provide a title value"

        # WELCOME MESSAGE
        elif 'welcome' in cmd or 'greeting' in cmd:
            if val:
                html = html.replace(
                    'Good to see you, <strong style="color:#00ddff;">Azlan</strong>. All systems fully operational.',
                    val
                )
                result = f"Welcome message updated"
            else:
                result = "Please provide a greeting value"

        # BACKGROUND
        elif 'background' in cmd or 'bg' in cmd:
            if 'dark' in val or 'black' in val:
                html = html.replace('--bg-void:#030712', '--bg-void:#000000')
                result = "Background set to pure black"
            elif 'space' in val:
                html = html.replace('--bg-void:#030712', '--bg-void:#050520')
                result = "Background set to deep space"
            else:
                result = "Try: dark/black or space"

        # ADD CHIP
        elif 'chip' in cmd or 'button' in cmd:
            if val:
                new_chip = f'<div class="chip" onclick="qs(\'{val}\')">{val}</div>'
                html = html.replace(
                    '<div class="chip" onclick="scanNet()"',
                    new_chip + '\n        <div class="chip" onclick="scanNet()"'
                )
                result = f"New chip added: {val}"
            else:
                result = "Please provide chip label"

        # FONT SIZE
        elif 'font' in cmd or 'text size' in cmd:
            if 'large' in val or 'big' in val:
                html = html.replace('font-size:13px;line-height:1.65', 'font-size:15px;line-height:1.7')
                result = "Font size increased"
            elif 'small' in val:
                html = html.replace('font-size:15px;line-height:1.7', 'font-size:13px;line-height:1.65')
                result = "Font size decreased"

        # RESTORE BACKUP
        elif 'restore' in cmd or 'undo' in cmd or 'revert' in cmd:
            backup = HTML_FILE + '.backup'
            if os.path.exists(backup):
                with open(backup) as f:
                    html = f.read()
                result = "Restored from backup"
            else:
                result = "No backup found"

        else:
            result = f"Unknown command: {cmd}. Available: theme, title, welcome, background, chip, font, restore"

        if html != original:
            write_html(html)
            log = load_log()
            log.append({
                "time": datetime.now().isoformat(),
                "command": req.command,
                "value": req.value,
                "result": result
            })
            save_log(log)

        return {"status": "success", "result": result, "changed": html != original}

    except Exception as e:
        return {"status": "error", "result": str(e), "changed": False}

@router.get("/self/log")
async def get_log():
    return {"log": load_log()}

@router.post("/self/restore")
async def restore():
    backup = HTML_FILE + '.backup'
    if os.path.exists(backup):
        with open(backup) as f:
            html = f.read()
        with open(HTML_FILE, 'w') as f:
            f.write(html)
        return {"status": "restored"}
    return {"status": "no backup"}
