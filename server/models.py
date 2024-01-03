from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy

from sqlalchemy.orm import validates
from sqlalchemy.ext.hybrid import hybrid_property
from flask_migrate import Migrate

from config import db
import stripe
import os

class User(db.Model, SerializerMixin):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(25), nullable=False, unique=True)
    email = db.Column(db.String(80), nullable=False)
    password = db.Column(db.String(), nullable=False)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, onupdate=db.func.now())

    user_sneakers = db.relationship("UserSneaker", back_populates="user")

    def __repr__(self):
        """
        returns string rep of object

        """
        return f"<User {self.username}>"

    def save(self):
        db.session.add(self)
        db.session.commit()

    




class Sneaker(db.Model):
    __tablename__ = 'sneakers'
    
    id = db.Column(db.Integer, primary_key=True)
    brand = db.Column(db.String)
    name= db.Column(db.String)
    color = db.Column(db.String)
    description = db.Column(db.String)
    price = db.Column(db.Float)
    image = db.Column(db.String)
    link = db.Column(db.String)
    stripe_product_id = db.Column(db.String)
    stripe_price_id = db.Column(db.String)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, onupdate=db.func.now())

    user_sneakers = db.relationship("UserSneaker", back_populates="sneaker")
    cart_sneakers = db.relationship("CartSneaker", back_populates="sneaker")

    def __init__(self, *args, **kwargs):
        super(Sneaker, self).__init__(*args, **kwargs)
        self.create_stripe_product_and_price() 
    
    def create_stripe_product_and_price(self):
        stripe.api_key = os.environ.get("STRIPE_SECRET_KEY")

        # Check if Stripe IDs already exist
        if not self.stripe_product_id or not self.stripe_price_id:
            # Create product on Stripe
            stripe_product = stripe.Product.create(
                name=self.name,
                description=self.description,
                type="service",
            )

            # Create price on Stripe
            stripe_price = stripe.Price.create(
                product=stripe_product.id,
                unit_amount=int(self.price * 100),  # Convert to cents
                currency="usd",
            )

            # Update sneakeer record with Stripe IDs
            self.stripe_product_id = stripe_product.id
            self.stripe_price_id = stripe_price.id

            db.session.commit()

    def __repr__(self):
        return f"<Sneaker {self.name} >"

    def save(self):
        """
        The save function is used to save the changes made to a model instance.
        It takes in no arguments and returns nothing.

        :param self: Refer to the current instance of the class
        :return: The object that was just saved
       
        """
        db.session.add(self)
        db.session.commit()

    def delete(self):
        """
        The delete function is used to delete a specific row in the database. It takes no parameters and returns nothing.

        :param self: Refer to the current instance of the class, and is used to access variables that belongs to the class
        :return: Nothing
        
        """
        db.session.delete(self)
        db.session.commit()

    def update(self, brand, name, color, description, price, image, link):
        """
        The update function updates the title and description of a sneaker.
        It takes fice parameters.

        :param self: Access variables that belongs to the class
        :param name: Update the name of the shoe
        :param color: Update color of shoe
        :param price: Update price of shoe
        :param description: Update the description of the shoe 
        :param link: Update link
        :return: A dictionary with the updated values of brand, model, size, description and price of given shoe.
        
        """
        self.brand = brand
        self.name = name
        self.color = color
        self.description = description
        self.price = price
        self.image = image
        self.link = link

        db.session.commit()



#create add to cart button on shoe
#post request to backend with info of shoe
#get by id request to my shoe table
#check if sneaker is in cart
#if it is increment quantity by 1
#else
#get cartid update cart_item
#update the cart_item table with sneaker
#and update the updated_at in the cart
#







class UserSneaker(db.Model):
    __tablename__ = 'user_sneakers'

    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), primary_key=True)
    sneakerid = db.Column(db.Integer, db.ForeignKey('sneakers.id'), primary_key=True)
    note = db.Column(db.String(1000)) # New column for user's note about the sneaker
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, onupdate=db.func.now())

    user = db.relationship("User", back_populates="user_sneakers")
    sneaker = db.relationship("Sneaker", back_populates="user_sneakers")








class Cart(db.Model):
    __tablename__ = 'carts'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, onupdate=db.func.now())

    cart_sneakers = db.relationship("CartSneaker", back_populates="cart")

class CartSneaker(db.Model):
    __tablename__ = 'cart_sneakers'

    id = db.Column(db.Integer, primary_key=True)
    cart_id = db.Column(db.Integer, db.ForeignKey('carts.id'))
    sneaker_id = db.Column(db.Integer, db.ForeignKey('sneakers.id'))
    quantity = db.Column(db.Integer)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, onupdate=db.func.now())

    cart = db.relationship("Cart", back_populates="cart_sneakers")
    sneaker = db.relationship('Sneaker', back_populates='cart_sneakers')