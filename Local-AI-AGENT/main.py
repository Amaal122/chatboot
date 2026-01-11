from langchain_ollama.llms import OllamaLLM
from langchain_core.prompts import ChatPromptTemplate
from vector import retriever

model = OllamaLLM(model="llama2")

template = """
You are an expert in answering questions about mental health apps based on user reviews.
use the reviews given:{reviews}
Answer the question clearly and format your answer in short paragraphs, bullet points, or numbered lists when appropriate.
Here is the question to answer: {question}
"""
prompt = ChatPromptTemplate.from_template(template)

def format_answer(answer: str) -> str:
    import re
    sentences = re.split(r'(?<=[.!?])\s+', answer)
    return "\n".join(sentences)
def ask_agent(question: str) -> str:
    """
    Given a user question, retrieve relevant documents and
     return the model's answer as a string.
    """
    reviews_docs = retriever.invoke(question)
    reviews = "\n".join([doc.page_content for doc in reviews_docs])
    prompt_value = prompt.format_prompt(question=question, reviews=reviews)
    result = model.invoke(prompt_value)
    raw_result = result if isinstance(result, str) else str(result)
    points = raw_result.split(". ")
    formatted = "\n- ".join(points)
    formatted = "- " + formatted
    return formatted
    