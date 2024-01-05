from flask import Flask, request, jsonify, make_response, redirect
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
            
            return {"access_token": access_token, "refresh_token": refresh_token, "user": new_user.to_dict()}, 201

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
            
            new_user = User(
                username=username,
                password=generate_password_hash(data.get('password'))
            )

            access_token = create_access_token(identity=username, expires_delta=False)
            refresh_token = create_refresh_token(identity=username, expires_delta=False)
            return {"access_token": access_token, "refresh_token": refresh_token, "user": new_user.to_dict()}, 200

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
        # Access JSON data directly from the request
        data = request.get_json()

        # Validation or further processing can go here

        new_sneaker = Sneaker(
            brand=data.get('brand'),
            name=data.get('name'),
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

api.add_resource(UpdateSneaker, '/sneaker/<int:id>')



# When the user clicks add to Collection, we are adding this to the UserSneaker table
class AddToCollection(Resource):
    @jwt_required()
    def post(self):
        try:
            data = request.json
            print('ADD TO COLLECTION', data)
            user_id = get_jwt_identity()
            sneaker_id = data['sneakerID']


            # Check if the user already has this sneaker in their collection
            existing_record = UserSneaker.query.filter_by(user_id=user_id, sneakerid=sneaker_id).first()
            if existing_record:
                return {'message': 'Sneaker already in collection'}, 400

            # Add new record to UserSneaker table
            new_user_sneaker = UserSneaker(user_id=user_id, sneakerid=sneaker_id)
            db.session.add(new_user_sneaker)
            db.session.commit()

            return {'message': 'Sneaker added to collection'}, 201

        except Exception as e:
            return {'error': str(e)}, 401

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
                        'link': sneaker.link,
                        'note': user_sneaker.note
                        # Add any other fields to include
                    })

            return {'sneakers': sneakers}, 200
        except Exception as e:
            print(f"Error: {e}")
            import traceback
            traceback.print_exc()  # This will print the full traceback
            return {"message": "An error occurred while fetching sneakers."}, 500
api.add_resource(UserSneakers, '/user-sneakers/<string:user_id>')


class AddNoteToUserSneaker(Resource):
    @jwt_required()
    def patch(self, sneakerid):
        current_user_id = get_jwt_identity() # Extracting user ID from the JWT token

        # Fetch the user_sneaker relationship using the user ID and sneaker ID
        user_sneaker = UserSneaker.query.filter_by(user_id=current_user_id, sneakerid=sneakerid).first_or_404()

        parser = reqparse.RequestParser()
        parser.add_argument('note', required=True) 
        data = parser.parse_args()

        user_sneaker.note = data['note'] # Update the note field
        db.session.commit()

        # Manually create a dictionary to send back
        updated_user_sneaker = {
            'sneakerid': user_sneaker.sneakerid,
            'user_id': user_sneaker.user_id,
            'note': user_sneaker.note
        }

        return {'message': 'Note added to sneaker successfully', 'updatedUserSneaker': updated_user_sneaker}, 200

api.add_resource(AddNoteToUserSneaker, '/add-note-to-user-sneaker/<int:sneakerid>')


class AddToWishList(Resource):
    @jwt_required()
    def post(self):
        user_id = get_jwt_identity()
        data = request.get_json()
        sneaker_id = data.get('sneaker_id')
        quantity = data.get('quantity', 1)
        print('TESTTEST AddToWishList:', user_id, sneaker_id)
        # Fetch the user using filter_by
        user = User.query.filter_by(username=user_id).first()
        if not user:
            return {'error': 'User not found'}, 404

        # Check if user has a cart, if not, create one
        cart = Cart.query.filter_by(user_id=user_id).first()
        if not cart:
            cart = Cart(user_id=user_id)
            db.session.add(cart)
            db.session.commit()

        # Check if sneaker is already in the cart
        cart_sneaker = CartSneaker.query.filter_by(cart_id=cart.id, sneaker_id=sneaker_id).first()
        if cart_sneaker:
            # Increment quantity
            cart_sneaker.quantity += quantity
        else:
            # Add new sneaker to cart
            new_cart_sneaker = CartSneaker(cart_id=cart.id, sneaker_id=sneaker_id, quantity=quantity)
            db.session.add(new_cart_sneaker)

        db.session.commit()
        return {'message': 'Sneaker added to wish list'}, 200

api.add_resource(AddToWishList, '/add-to-wish-list')



YOUR_DOMAIN = 'http://localhost:3000'
stripe.api_key = os.environ.get("STRIPE_SECRET_KEY")
# class CreateCheckoutSession(Resource):
@app.route('/create-checkout-session/<int:id>',methods=["POST"])
def post(id):

    sneaker_to_purchase = Sneaker.query.get(id)

    # if sneaker_to_purchase is None:
    #     return {'error': 'Sneaker not found'}, 404

    checkout_session = stripe.checkout.Session.create(
        line_items=[
            {
                'price': sneaker_to_purchase.stripe_price_id,
                'quantity': 1
            }
        ],
        mode='payment',
        success_url=YOUR_DOMAIN + '/success',
        cancel_url=YOUR_DOMAIN + '/cancelled',
    )
    return redirect(checkout_session.url, code=303)

# Add the resource to the API and define the route
# api.add_resource(CreateCheckoutSession, '/create-checkout-session/<int:id>')


class DeleteUserSneaker(Resource):
    @jwt_required()
    def delete(self):
        data = request.get_json()
        user_id = data.get('userId')
        sneakerid = data.get('sneakerId')

        # Check if the sneaker exists in the UserSneaker table
        user_sneaker_to_delete = UserSneaker.query.filter_by(user_id=user_id, sneakerid=sneakerid).first()

        if user_sneaker_to_delete:
            db.session.delete(user_sneaker_to_delete)
            db.session.commit()
            return {'message': 'Sneaker removed from collection successfully'}, 200
        else:
            return {'message': 'Sneaker not found in collection'}, 404

# Add the resource to the API
api.add_resource(DeleteUserSneaker, '/delete-sneaker')

if __name__ == "__main__":
    app.run(port=5555, debug=True)
