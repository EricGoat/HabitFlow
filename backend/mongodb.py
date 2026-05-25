import os

import certifi
from dotenv import load_dotenv
from pymongo import MongoClient
from pymongo.server_api import ServerApi
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
load_dotenv(BASE_DIR / ".env")

MONGO_USER = os.getenv('MONGO_USER')
MONGO_PASSWORD = os.getenv('MONGO_PASSWORD')

uri = f"mongodb+srv://{MONGO_USER}:{MONGO_PASSWORD}@habitflow.lr2z4ud.mongodb.net/?appName=HabitFlow"

# Create a new client and connect to the server
client = MongoClient(uri,
                     tlsCAFile=certifi.where(),
                     server_api=ServerApi('1'))
# Send a ping to confirm a successful connection
try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(e)