from fastapi import FastAPI
from pydantic import BaseModel
from main import ask_agent
from fastapi.middleware.cors import CORSMiddleware
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
    return {"response": ask_agent(query.prompt)}
