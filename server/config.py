# Standard library imports

# Remote library imports
from flask import Flask
from flask_cors import CORS
from flask_migrate import Migrate
from flask_restful import Api
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData
from flask_jwt_extended import JWTManager
from dotenv import load_dotenv
import os

load_dotenv()  # take environment variables from .env.
# Local imports

# Instantiate app, set attributes
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY')
app.json.compact = False

# Define metadata, instantiate db
metadata = MetaData(naming_convention={
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
})
#! flask-sqlalchemy setup
db = SQLAlchemy(metadata=metadata)
db.init_app(app)
#! flask-migrate setup
migrate = Migrate(app, db)

#! flask-restful setup
api = Api(app)

# Instantiate CORS
CORS(app)
#! flask-jwt-extended setup
jwt = JWTManager(app)
