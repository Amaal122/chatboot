from fastapi import FastAPI
from pydantic import BaseModel
from main import ask_agent
from fastapi.middleware.cors import CORSMiddleware
import logging
import traceback
import uvicorn
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Query(BaseModel):
    prompt: str

@app.post("/ask")
async def ask(query: Query):
    try:
        return {"response": ask_agent(query.prompt)}
    except Exception as exc:  # log and surface a minimal error
        logging.error("/ask failed: %s", exc)
        traceback.print_exc()
        return {"response": "Backend error"}


if __name__ == "__main__":
    # Run with `python api.py` for local development
    uvicorn.run("api:app", host="0.0.0.0", port=8000, reload=True)
