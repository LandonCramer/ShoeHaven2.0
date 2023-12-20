from flask import Flask, request, jsonify, make_response
from config import DevConfig
from models import Sneaker, User
from exts import db
from flask_migrate import Migrate
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import (
    JWTManager, create_access_token, create_refresh_token, get_jwt_identity, jwt_required
)
from flask_cors import CORS
import stripe
import os

# creating Flask instance
app = Flask(__name__)
app.config.from_object(DevConfig)

CORS(app)
db.init_app(app)
migrate = Migrate(app, db)
JWTManager(app)

# Route definitions

@app.route('/hello', methods=['GET'])
def hello():
    return {"message": "Hello World"}

@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    username = data.get('username')

    db_user = User.query.filter_by(username=username).first()
    if db_user is not None:
        return jsonify({"message": f"User with username {username} already exists"}), 409

    new_user = User(
        username=username,
        email=data.get('email'),
        password=generate_password_hash(data.get('password'))
    )
    db.session.add(new_user)
    db.session.commit()

    access_token = create_access_token(identity=username, expires_delta=False)
    refresh_token = create_refresh_token(identity=username, expires_delta=False)

    return jsonify({"access_token": access_token, "refresh_token": refresh_token, "user_id": new_user.id}), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    db_user = User.query.filter_by(username=username).first()
    if db_user and check_password_hash(db_user.password, password):
        access_token = create_access_token(identity=username, expires_delta=False)
        refresh_token = create_refresh_token(identity=username, expires_delta=False)
        return jsonify({"access_token": access_token, "refresh_token": refresh_token})

    return jsonify({'message': "Invalid credentials"}), 401

@app.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    current_user = get_jwt_identity()
    new_access_token = create_access_token(identity=current_user)
    return jsonify({"access_token": new_access_token}), 200

# Add other routes here...

if __name__ == "__main__":
    app.run(port=5555, debug=True)
