from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
load_dotenv(os.path.join(BASE_DIR, ".env"))

# SQLALCHEMY_DATABASE_URL = "sqlite:///./sql_app.db"
SQL_ADDRESS = f'mysql+pymysql://{os.environ["sql_db_user"]}:{os.environ["sql_db_password"]}@{os.environ["sql_db_address"]}:{os.environ["sql_db_port"]}/{os.environ["sql_db_connect"]}'

engine = create_engine(
    SQL_ADDRESS
    # SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()