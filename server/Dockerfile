FROM python:3.10.6-slim
RUN apt-get -y update
RUN apt-get -y install git

WORKDIR /server

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

ENV PYTHONPATH "${PYTHONPATH}:/server/"
ENV PYTHONPATH "${PYTHONPATH}:/server/app/"
ENV PYTHONPATH "${PYTHONPATH}:/server/data/"

EXPOSE 8000