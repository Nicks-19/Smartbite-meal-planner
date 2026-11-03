import os
import sys

# Add project root to sys.path so 'backend' can be imported by Vercel
root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if root_dir not in sys.path:
    sys.path.insert(0, root_dir)

from backend.app.main import app
from backend.app.database import init_db
from backend.app.seed_data import seed_database

# Initialize database schema and initial recipes in serverless environment
try:
    init_db()
    seed_database()
except Exception as e:
    print(f"[Vercel Init Warning]: {e}")
