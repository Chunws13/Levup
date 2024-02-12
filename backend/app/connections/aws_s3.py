import boto3, os
from dotenv import load_dotenv

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
load_dotenv(os.path.join(BASE_DIR, ".env"))

def aws_s3_connection():
    try:
        s3 = boto3.client(
            service_name = "s3",
            region_name = "ap-northeast-2",
            aws_access_key_id = os.environ["aws_s3_bucket_access_key"],
            aws_secret_access_key = os.environ["aws_s3_bucket_sccret_key"]
        )
        
    except Exception as error:
        print(error)
        
    else:
        return s3