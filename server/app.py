from flask import Flask, request, jsonify, make_response
from flask_restful import Resource
from config import app, db, api #importing app and db from config

from models import Sneaker, User, UserSneaker, Cart, CartSneaker
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
BASE_DIR = os.path.abspath(os.path.dirname(__file__))

CORS(app)
migrate = Migrate(app, db)
JWTManager(app)

# Views go here!

@app.route('/hello', methods=['GET'])
def hello():
    return jsonify({"message": "Hello World"})


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

# @app.route('/login', methods=['POST'])
# def login():
#     data = request.get_json()
#     username = data.get('username')
#     password = data.get('password')

#     db_user = User.query.filter_by(username=username).first()
#     if db_user and check_password_hash(db_user.password, password):
#         access_token = create_access_token(identity=username, expires_delta=False)
#         refresh_token = create_refresh_token(identity=username, expires_delta=False)
#         return jsonify({"access_token": access_token, "refresh_token": refresh_token})

#     return jsonify({'message': "Invalid credentials"}), 401

# @app.route('/refresh', methods=['POST'])
# @jwt_required(refresh=True)
# def refresh():
#     current_user = get_jwt_identity()
#     new_access_token = create_access_token(identity=current_user)
#     return jsonify({"access_token": new_access_token}), 200

# @app.route("/sneakers", methods=['GET'])
# def get_sneakers():
#     """Get all sneakers"""
#     sneakers = Sneaker.query.all()
#     return jsonify([sneaker.to_dict() for sneaker in sneakers])

# @app.route("/sneakers", methods=['POST'])
# @jwt_required()
# def create_sneaker():
#     """Create a new sneaker"""
#     data = request.get_json()

#     new_sneaker = Sneaker(
#         brand=data.get("brand"),
#         name=data.get("name"),
#         color=data.get("color"),
#         description=data.get("description"),
#         price=data.get("price"),
#         image=data.get("image"),
#         link=data.get("link"),
#     )
#     new_sneaker.save()

#     return jsonify(new_sneaker.to_dict()), 201

# @app.route("/sneaker/<int:id>", methods=['GET'])
# def get_sneaker(id):
#     """Get shoe by id"""
#     sneaker = Sneaker.query.get_or_404(id)
#     return jsonify(sneaker.to_dict())

# @app.route("/sneaker/<int:id>", methods=['PUT'])
# @jwt_required()
# def update_sneaker(id):
#     """Update shoe by id"""
#     sneaker_to_update = Sneaker.query.get_or_404(id)
#     data = request.get_json()

#     sneaker_to_update.update(
#         brand=data.get("brand"),
#         name=data.get("name"),
#         color=data.get("color"),
#         description=data.get("description"),
#         price=data.get("price"),
#         image=data.get("image"),
#         link=data.get("link"),
#     )

#     return jsonify(sneaker_to_update.to_dict())

# @app.route("/sneaker/<int:id>", methods=['DELETE'])
# @jwt_required()
# def delete_sneaker(id):
#     """Delete shoe by id"""
#     sneaker_to_delete = Sneaker.query.get_or_404(id)
#     sneaker_to_delete.delete()

#     return jsonify({'message': 'Sneaker deleted successfully'}), 200

if __name__ == "__main__":
    app.run(port=5555, debug=True)
