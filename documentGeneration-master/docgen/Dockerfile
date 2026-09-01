FROM python:3.11-slim

RUN apt-get update && apt-get install -y --no-install-recommends \
    texlive-xetex \
    texlive-latex-recommended \
    texlive-latex-extra \
    texlive-fonts-recommended \
    tesseract-ocr \
    tesseract-ocr-eng \
    libgl1 \
    libglib2.0-0 \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

RUN mkdir -p generated_docs

EXPOSE 8000

CMD ["uvicorn", "api:app", "--host", "0.0.0.0", "--port", "8000"]
