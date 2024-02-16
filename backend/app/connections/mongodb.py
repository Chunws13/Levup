from pymongo import MongoClient
from dotenv import load_dotenv
import certifi, os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ca = certifi.where()

def MongodbConntect(collection):
    try:
        client = MongoClient(os.environ["db_address"], tlsCAFile=ca)
        db = client[collection]

    except Exception as error:
        print(error) 

    else:
        return db