from pymongo import MongoClient
import certifi, hashlib, datetime, jwt
from dotenv import load_dotenv
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
load_dotenv(os.path.join(BASE_DIR, ".env"))

ca = certifi.where()
client = MongoClient(os.environ["db_address"], tlsCAFile=ca)
db = client.chunws

class User_Auth:
    def __init__(self, token):
        self.token = token
    
    def check_auth(self):
        if self.token is not None:
            try:
                payload = jwt.decode(self.token, "1234", algorithms="HS256")
                user = db.users.find_one({"id" : payload["id"]}, {"_id" : False})
                user_id = user["id"]
                return {"status" : True, "data" : user_id}

            except jwt.ExpiredSignatureError:
                message = "로그인 시간 만료"
                return {"status" : False, "data" : message}
            
            except jwt.InvalidTokenError:
                message = "토큰 에러"
                return {"status" : False, "data" : message}
            
            except:
                message = "예기치 못한 에러가 발생했습니다."
                return {"status" : False, "data" : message}
        
        else:
            return {"status": False, "data" : "로그인이 필요한 서비스입니다."}
