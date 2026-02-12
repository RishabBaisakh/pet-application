# Use official Python image
FROM python:3.12-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set working directory
WORKDIR /app

# Copy only requirements first for caching
COPY requirements.txt .

# Install dependencies
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

# Copy the entire service
COPY . .

# Expose port
EXPOSE 8000

# Run migrations & start server (development)
CMD ["python", "manage.py", "runserver", "0.0.0.0:8001"]
