# ShoeHaven2.0

![Animated GIF](client/public/ezgif.com-crop.gif)
# Introduction

This full-stack web application allows users to track and manage their sneaker collection, purchase shoes, and add personal notes about each pair they have added to their collection.

This project was made to complete the assignment Phase 5 Capstone Project for the SE-West-091123 class for the Flatiron Software Engineering Boot Camp.

## Starting the Application

1. Fork and clone this repository from Github to your local environment.
2. Navigate into your local directory and open the contents using your preferred code editor.
3. Run `pipenv install` to install the dependencies.
4. Run `pipenv shell` to create a virtual environment.

## .env Set Up

### STRIPE_SECRET_KEY and JWT_SECRET_KEY

1. Inside your main directory, create a file and name it `.env` by running `touch .env` in your terminal.
2. Inside the `.env` file, add two variables: `STRIPE_SECRET_KEY =` and `JWT_SECRET_KEY=`.
3. In your terminal, run `python -c 'import secrets; print(secrets.token_hex())'` to generate your own JWT secret key.
4. Copy the string and paste it after the `=`. It should look something like `JWT_SECRET_KEY='f550a395314e01d80d85c94c4d711cc8ddbbb8073e0e5e9541c005045fc75ef8'`.

# Setting up Stripe

*Note: In your `.gitignore` file, make sure you add this line somewhere: `.env`. This will keep your secret key on your local computer.*

1. Visit the [Stripe website](https://stripe.com/).
2. Sign up as a developer.
3. Initially, you'll be given a test account.

### Access API Keys:

1. Navigate to the Developers tab on Stripe's dashboard.
2. Find your API keys, particularly the Stripe secret key (important for later steps).

### Install Stripe:

- In your project's backend, run the command `pip install stripe` in your CLI to install Stripe.

### Creating the Product:

1. Define a product in your project, linking it with a Stripe-specific product ID and price ID.
2. For instance, create an `Sneaker` model with attributes including `stripe_product_id` and `stripe_price_id`.
3. Implement a function to automatically sync each product instance with your Stripe account, creating corresponding entries in your Stripe product catalog.

### Secure Your API Key:

- Store your Stripe secret key in the private `.env` file for security under JWT_SECRET_KEY.

### Switching from Test to Live Mode:

1. Initially, you'll use a test API key for development and testing.
2. To handle real transactions, activate your Stripe account and obtain a live API key.

### Setting Up the Checkout Process:

1. Create a route for checkout in your backend, for example, "create-checkout-session".
2. The route should initiate a Stripe checkout session with the necessary line items and payment details.
3. Redirect users to Stripe’s hosted checkout page or your custom checkout page.
4. Include success and cancellation URLs for redirection post-payment.

### Add a Checkout Button:

- Implement a button on your site that directs users to the checkout route.

### Testing:

- Before going live, thoroughly test the payment system using Stripe's test mode and fake payment data.

# Initialize the Database

1. In your terminal, navigate into the server directory using `cd server/`.
2. Run these lines of code in your terminal in the order they are presented:
   - `export FLASK_APP=app.py`
   - `export FLASK_RUN_PORT=5555`
3. Execute the following commands to set up the database:
   - `flask db init`
   - `flask db migrate -m 'initial migration'`
   - `flask db upgrade head`

# Starting the Server

1. Run `python app.py` within the server directory to start the server.

# Starting the Client

1. In a separate terminal, enter the virtual environment by running `pipenv shell`.
2. Run `npm install --prefix client` to install dependencies.
3. Run `npm start --prefix client` to open the application in your browser.

# License

This project is made in conjunction with the standard MIT license provided by GitHub upon creation of a new repository. A copy of the license is included with this project in a file named: `LICENSE`.

# Attributions

The project was authored by Landon Cramer.