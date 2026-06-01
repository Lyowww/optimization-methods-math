"""
Vercel serverless entrypoint — exports the FastAPI ASGI app from python-api/.
All /api/* requests are rewritten here via vercel.json.
"""
import os
import sys
from pathlib import Path

# Writable config dir on Vercel's read-only filesystem
os.environ.setdefault("MPLCONFIGDIR", "/tmp/matplotlib")
os.environ.setdefault("MPLBACKEND", "Agg")

_API_ROOT = Path(__file__).resolve().parent.parent / "python-api"
if str(_API_ROOT) not in sys.path:
    sys.path.insert(0, str(_API_ROOT))

from main import app  # noqa: E402
