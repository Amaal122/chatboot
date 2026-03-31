# chatboot

pink-themed AI chat experience with a Vite + React front end and FastAPI backend. The UI has a session sidebar, gradient chat bubbles, and a typing indicator. Prompts are posted to the FastAPI `/ask` endpoint; the backend uses LangChain with Ollama for retrieval-augmented responses from local models.

## Stack
- Frontend: Vite + React, Tailwind styling, lucide-react icons.
- Backend: FastAPI, LangChain, Chroma vector store, Ollama LLMs (`llama2` for generation, `mxbai-embed-large` for embeddings).
- Data: `Mental_Health_Chatbot_Dataset.csv` ingested into Chroma on first run.

## Prerequisites
- Python venv in repo root at `.venv`.
- Ollama running locally with models pulled:
	- `ollama pull llama2`
	- `ollama pull mxbai-embed-large`

## Run backend
```
cd Local-AI-AGENT
../.venv/Scripts/Activate.ps1
uvicorn api:app --host 0.0.0.0 --port 8000 --reload
```
The `/ask` endpoint accepts POST JSON `{ "prompt": "your question" }` and returns `{ "response": "..." }`.

## Run frontend
```
cd reactapp/my-react-app
npm install
npm run dev
```
Open the shown localhost URL (default 5173). The frontend targets `http://127.0.0.1:8000/ask`; adjust the URL in `src/App.jsx` if you run the API on a different port.

## Notes
- If the vector DB directory `chrome_langchain_db` is absent, it will be created and populated from `amal.csv` on first backend start.
- `list_h5_datasets.py` and `openh5.py` are small utilities for inspecting H5 files (not used by the chat flow).
