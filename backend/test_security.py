import os
import sys

print("\n" + "="*50)
print("  JARVIS SECURITY AUDIT v1.0")
print("="*50)

passed = 0
failed = 0
warnings = 0

def check(name, result, level="critical"):
    global passed, failed, warnings
    if result:
        print(f"  ✅ PASS  — {name}")
        passed += 1
    else:
        if level == "warning":
            print(f"  ⚠️  WARN  — {name}")
            warnings += 1
        else:
            print(f"  ❌ FAIL  — {name}")
            failed += 1

print("\n[ 1 ] ENVIRONMENT FILE CHECKS")
print("-"*50)

# Check .env exists
env_exists = os.path.exists(".env")
check(".env file exists", env_exists)

# Check .env has API key
if env_exists:
    with open(".env") as f:
        env_content = f.read()
    has_key = "ANTHROPIC_API_KEY" in env_content
    key_not_empty = "your_key_here" not in env_content
    check("API key is defined in .env", has_key)
    check("API key is not placeholder", key_not_empty)
else:
    check("API key is defined in .env", False)
    check("API key is not placeholder", False)

print("\n[ 2 ] API KEY EXPOSURE CHECKS")
print("-"*50)

# Check key is not hardcoded in source files
exposed = False
risky_files = [
    "app/main.py",
    "app/config.py", 
    "app/services/ai_service.py",
    "run.py",
]
for filepath in risky_files:
    if os.path.exists(filepath):
        with open(filepath) as f:
            content = f.read()
        if "sk-ant-" in content or "sk-proj-" in content:
            print(f"  ❌ FAIL  — API key hardcoded in {filepath}")
            exposed = True
            failed += 1

if not exposed:
    check("No API keys hardcoded in source files", True)

print("\n[ 3 ] GITIGNORE CHECKS")
print("-"*50)

gitignore_exists = os.path.exists(".gitignore")
check(".gitignore file exists", gitignore_exists, level="warning")

if gitignore_exists:
    with open(".gitignore") as f:
        gi = f.read()
    check(".env is in .gitignore", ".env" in gi)
    check("venv is in .gitignore", "venv" in gi)
    check("database is in .gitignore", ".db" in gi or "data/" in gi)
else:
    # Create gitignore automatically
    with open(".gitignore", "w") as f:
        f.write(".env\nvenv/\n*.db\ndata/\nlogs/\n__pycache__/\n*.pyc\n")
    print("  🔧 AUTO-FIXED — .gitignore created for you")
    passed += 1

print("\n[ 4 ] CORS SECURITY CHECKS")
print("-"*50)

if env_exists:
    cors_ok = "ALLOWED_ORIGINS" in env_content
    check("CORS origins configured", cors_ok)
    wildcard = 'allow_origins=["*"]' 
    if os.path.exists("app/main.py"):
        with open("app/main.py") as f:
            main_content = f.read()
        check("CORS not wildcard in production", 
              wildcard not in main_content, 
              level="warning")

print("\n[ 5 ] FILE PERMISSION CHECKS")
print("-"*50)

if env_exists:
    import stat
    env_stat = os.stat(".env")
    mode = oct(env_stat.st_mode)[-3:]
    check(f".env permissions are safe (mode={mode})", 
          mode in ["600", "644", "640"])

print("\n[ 6 ] DATABASE CHECKS")
print("-"*50)

check("data/ directory exists", os.path.exists("data"))
check("logs/ directory exists", os.path.exists("logs"))

print("\n[ 7 ] PACKAGE INTEGRITY CHECKS")
print("-"*50)

packages = [
    "fastapi", "uvicorn", "sqlalchemy", 
    "anthropic", "dotenv", "pydantic"
]
for pkg in packages:
    try:
        __import__(pkg if pkg != "dotenv" else "dotenv")
        check(f"{pkg} is installed", True)
    except ImportError:
        check(f"{pkg} is installed", False)

print("\n" + "="*50)
print("  AUDIT COMPLETE")
print("="*50)
print(f"  ✅ Passed   : {passed}")
print(f"  ❌ Failed   : {failed}")
print(f"  ⚠️  Warnings : {warnings}")
print("="*50)

if failed == 0:
    print("\n  🟢 JARVIS SECURITY STATUS: CLEARED")
    print("  Safe to proceed to frontend build.\n")
elif failed <= 2:
    print("\n  🟡 JARVIS SECURITY STATUS: MOSTLY SECURE")
    print("  Fix the failed items above before deploying.\n")
else:
    print("\n  🔴 JARVIS SECURITY STATUS: AT RISK")
    print("  Fix all failed items before proceeding.\n")
