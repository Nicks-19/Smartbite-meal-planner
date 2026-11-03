import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

from .database import init_db
from .seed_data import seed_database
from .routes import recipes, meal_planner, pantry, grocery, analytics

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Ensure database schema is ready and seed recipes exist
    init_db()
    seed_database()
    yield

app = FastAPI(
    title="SmartBite Leftover Meal Planner API",
    description="Full-stack API for leftover ingredient matching, weekly meal planning, pantry tracking, and food waste reduction.",
    version="1.0.0",
    lifespan=lifespan
)

# Enable CORS for React Frontend dev server (allows localhost:5173, etc.)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register Sub-routers
app.include_router(recipes.router)
app.include_router(meal_planner.router)
app.include_router(pantry.router)
app.include_router(grocery.router)
app.include_router(analytics.router)

@app.get("/api/health", tags=["Health"])
def health_check():
    return {
        "status": "online",
        "project": "SmartBite — Leftover Meal Planner & Zero-Waste Kitchen",
        "developer": {
            "name": "Nikita Sharad Pawar",
            "prn": "202401100018"
        },
        "docs_url": "/docs"
    }

# Mount static frontend build if present
frontend_dist = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "frontend", "dist"))
if os.path.exists(frontend_dist):
    app.mount("/assets", StaticFiles(directory=os.path.join(frontend_dist, "assets")), name="assets")

    @app.get("/{full_path:path}", include_in_schema=False)
    async def serve_spa(full_path: str):
        # Don't intercept API routes or Swagger docs
        if full_path.startswith("api") or full_path.startswith("docs") or full_path.startswith("openapi.json"):
            return None
        index_file = os.path.join(frontend_dist, "index.html")
        return FileResponse(index_file)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.app.main:app", host="127.0.0.1", port=8000, reload=True)
