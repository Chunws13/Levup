from sqlalchemy import create_engine, inspect
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv
import os, psycopg2

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
load_dotenv(os.path.join(BASE_DIR, ".env"))

SQL_ADDRESS = f'postgresql+psycopg2://{os.environ["sql_db_user"]}:{os.environ["sql_db_password"]}@{os.environ["sql_db_address"]}:{os.environ["sql_db_port"]}/{os.environ["sql_db_connect"]}'

engine = create_engine(SQL_ADDRESS)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()