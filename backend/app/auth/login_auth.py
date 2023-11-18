from pymongo import MongoClient
import certifi, hashlib, datetime, jwt

ca = certifi.where()
client = MongoClient("mongodb+srv://chunws:1q2w3e@chunws.w8zkw9b.mongodb.net/?retryWrites=true&w=majority", tlsCAFile=ca)
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
                return {"status" : "success", "data" : user_id}

            except jwt.ExpiredSignatureError:
                message = "로그인 시간 만료"
                return {"status" : "fail", "data" : message}
            
            except jwt.InvalidTokenError:
                message = "토큰 에러"
                return {"status" : "fail", "data" : message}
            
            except:
                message = "예기치 못한 에러가 발생했습니다."
                return {"status" : "fail", "data" : message}
