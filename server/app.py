from flask import Flask, request, jsonify, make_response
from flask_restful import Resource, reqparse
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

BASE_DIR = os.path.abspath(os.path.dirname(__file__))

# Views go here!

@app.route('/hello', methods=['GET'])
def hello():
    return jsonify({"message": "Hello World"})


class Signup(Resource):
    def post(self):
        try:
            data = request.get_json()
            username = data.get('username')

            db_user = User.query.filter_by(username=username).first()
            if db_user:
                return {"message": f"User with username {username} already exists"}, 409

            new_user = User(
                username=username,
                email=data.get('email'),
                password=generate_password_hash(data.get('password'))
            )
            db.session.add(new_user)
            db.session.commit()

            access_token = create_access_token(identity=username, expires_delta=False)
            refresh_token = create_refresh_token(identity=username, expires_delta=False)
            
            return {"access_token": access_token, "refresh_token": refresh_token, "user_id": new_user.id}, 201

        except Exception as e:
            return {'message': str(e)}, 500

api.add_resource(Signup, '/signup')



class Login(Resource):
    def post(self):
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')

        db_user = User.query.filter_by(username=username).first()
        if db_user and check_password_hash(db_user.password, password):
            access_token = create_access_token(identity=username, expires_delta=False)
            refresh_token = create_refresh_token(identity=username, expires_delta=False)
            return {"access_token": access_token, "refresh_token": refresh_token}, 200

        return {'message': "Invalid credentials"}, 401

api.add_resource(Login, '/login')

class RefreshToken(Resource):
    @jwt_required(refresh=True)
    def post(self):
        current_user = get_jwt_identity()
        new_access_token = create_access_token(identity=current_user)
        return {"access_token": new_access_token}, 200

api.add_resource(RefreshToken, '/refresh')

class CurrentUser(Resource):
    @jwt_required()
    def get(self):
        try:
            current_id = get_jwt_identity()
            return {'current_user_id': current_id}, 200
        except Exception as e:
            return {'error': str(e)}, 500

api.add_resource(CurrentUser, '/currentuser')

class Sneakers(Resource):
    def get(self):
        """Get all sneakers"""
        sneakers = Sneaker.query.all()
        sneakers_list = [{
            'id': sneaker.id,
            'brand': sneaker.brand,
            'name': sneaker.name,
            'color':sneaker.color,
            'description':sneaker.description,
            'price':sneaker.price,
            'image':sneaker.image,
            'link':sneaker.link
        } for sneaker in sneakers]
        return sneakers_list, 200

api.add_resource(Sneakers, '/sneakers')

class CreateSneaker(Resource):
    @jwt_required()
    def post(self):
        """Create a new sneaker"""
        #validate data sent in request
        parser = reqparse.RequestParser()
        parser.add_argument('brand', required=True, help="Brand cannot be blank!")
        parser.add_argument('name', required=True)
        parser.add_argument('color')
        parser.add_argument('description')
        parser.add_argument('price', type=float)
        parser.add_argument('image')
        parser.add_argument('link')
        data = parser.parse_args()

        new_sneaker = Sneaker(
            brand=data['brand'],
            name=data['name'],
            color=data.get('color'),
            description=data.get('description'),
            price=data.get('price'),
            image=data.get('image'),
            link=data.get('link')
        )
        db.session.add(new_sneaker)
        db.session.commit()
        
        # Convert the new_sneaker object to a dictionary before returning
        sneaker_dict = {
            'id': new_sneaker.id,  
            'brand': new_sneaker.brand,
            'name': new_sneaker.name,
            'color': new_sneaker.color,
            'description': new_sneaker.description,
            'price': new_sneaker.price,
            'image': new_sneaker.image,
            'link': new_sneaker.link
        }
        return sneaker_dict, 201


api.add_resource(CreateSneaker, '/sneakers')

class SneakerResource(Resource):
    def get(self, id):
        """Get sneaker by id"""
        sneaker = Sneaker.query.get_or_404(id)
        sneaker_dict = {
            'id': sneaker.id, 
            'brand': sneaker.brand,  
            'name': sneaker.name, 
            'color':sneaker.color,
            'description':sneaker.description,
            'price':sneaker.price,
            'image':sneaker.image,
            'link':sneaker.link
        }

        return sneaker_dict, 200

api.add_resource(SneakerResource, '/sneaker/<int:id>')

class UpdateSneaker(Resource):
    @jwt_required()
    def patch(self, id):
        """Update sneaker by id"""
        sneaker_to_update = Sneaker.query.get_or_404(id)
        
        parser = reqparse.RequestParser()
        parser.add_argument('brand', required=False)
        parser.add_argument('name', required=False)
        parser.add_argument('color', required=False)
        parser.add_argument('description', required=False)
        parser.add_argument('price', type=float, required=False)
        parser.add_argument('image', required=False)
        parser.add_argument('link', required=False)
        data = parser.parse_args()

        for key, value in data.items():
            if value is not None:
                setattr(sneaker_to_update, key, value)

        db.session.commit()

         # Convert the sneaker_to_update object to a dictionary
        sneaker_dict = {
            'id': sneaker_to_update.id,
            'brand': sneaker_to_update.brand,
            'name': sneaker_to_update.name,
            'color': sneaker_to_update.color,
            'description': sneaker_to_update.description,
            'price': sneaker_to_update.price,
            'image': sneaker_to_update.image,
            'link': sneaker_to_update.link
        }
        return sneaker_dict, 200

# Add the UpdateSneaker resource to the API
api.add_resource(UpdateSneaker, '/sneaker/<int:id>')



# When the user clicks add to Collection we are adding this to the UserSneaker table
class AddToCollection(Resource):
    def post(self):
        try:
            data = request.json
            print('ADD TO COLLECTION', data)
            user_id = data['userID']
            sneaker_id = data['sneakerID']

            # Check if the user already has this sneaker in their collection
            existing_record = UserSneaker.query.filter_by(user_id=user_id, sneakerid=sneaker_id).first()
            if existing_record:
                return {'message': 'Sneaker already in collection'}, 400

            # Add new record to UserSneaker table
            new_user_sneaker = UserSneaker(user_id=user_id, sneakerid=sneaker_id)
            db.session.add(new_user_sneaker)
            db.session.commit()

            return {'message': 'Sneaker added to collection'}, 200

        except Exception as e:
            return {'error': str(e)}, 500

api.add_resource(AddToCollection, '/add-to-collection')

# getting all the sneakers from user to display on their page.
class UserSneakers(Resource):
    def get(self, user_id):
        print('THE USER', user_id)
        try:
            user_sneakers = UserSneaker.query.filter_by(user_id=user_id).all()

            sneakers = []
            for user_sneaker in user_sneakers:
                sneaker = Sneaker.query.get(user_sneaker.sneakerid)
                if sneaker:
                    sneakers.append({
                        'id': sneaker.id,
                        'brand': sneaker.brand,
                        'name': sneaker.name,
                        'color': sneaker.color,
                        'description': sneaker.description,
                        'price': sneaker.price,
                        'image': sneaker.image,
                        'link': sneaker.link
                        # Add any other fields to include
                    })

            return {'sneakers': sneakers}, 200
        except Exception as e:
            print(f"Error: {e}")
            import traceback
            traceback.print_exc()  # This will print the full traceback
            return {"message": "An error occurred while fetching sneakers."}, 500
api.add_resource(UserSneakers, '/user-sneakers/<string:user_id>')



class DeleteSneaker(Resource):
    @jwt_required()
    def delete(self, id):
        """Delete sneaker by id"""
        sneaker_to_delete = Sneaker.query.get_or_404(id)
        
        db.session.delete(sneaker_to_delete)
        db.session.commit()

        return {'message': 'Sneaker deleted successfully'}, 200

api.add_resource(DeleteSneaker, '/sneaker/<int:id>')

if __name__ == "__main__":
    app.run(port=5555, debug=True)
