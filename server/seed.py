#!/usr/bin/env python3

# Standard library imports
from random import randint, choice as rc

# Remote library imports
from faker import Faker

# Local imports
from app import app
from models import db

if __name__ == '__main__':
    fake = Faker()
    with app.app_context():
        print("Starting seed...")
        # Seed code goes here!



{
    "brand": "Shoe Zero",
    "name": "Flex Control ",
    "color": "Black",
    "description": "Size-11, EVA Flexibility soles with cross performance design for sneaker shoes. Mesh -knit fabric upper lining construction with EVA padded insoles. Complete with 4 eyelets and a lace up closure for a classic look.Perfect for every season, wear them all year round.",
    "price": 100,
    "image": "https://shoezero.com/cdn/shop/products/20210629100671FtDWpeiiw3JEmiz5M7kANiYGRpWsmF_5168b25d-3a2f-4fb4-98b1-de0e5e2d6801.jpg?v=1701192769&width=700",
    "link": "https://shoezero.com/products/customizablesf_k14-flex-control-sneaker-black?variant=42069029355691&currency=USD&utm_medium=product_sync&utm_source=google&utm_content=sag_organic&utm_campaign=sag_organic&gad_source=1&gclid=Cj0KCQiAy9msBhD0ARIsANbk0A-wfipJGsqQfHTBIOQOR79DcZSqzmVybtoTofc3k1d4YqVWOMXX0rwaAkfBEALw_wcB"
}
{
    "brand": "Nike",
    "name": "Air Jordan 1 Low OG  ",
    "color": "White/University Red",
    "description": "Size-11, From hoops to fashion, the AJ1 forever changed the footwear game. Building upon its legacy, this striking edition pairs premium White leather with bright hits of University Red for an ultra-clean finish. Nike Air branding on the tongue is complemented by the embroidered Wings logo on the heel. Step into a fresh pair and change your game.",
    "price": 100,
    "image": "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco,u_126ab356-44d8-4a06-89b4-fcdcc8df0245,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/367b8bf4-5f4b-4914-941e-aae922ce6d8c/air-jordan-1-low-og-white-red-mens-shoes-v0FbJt.png",
    "link": "https://www.nike.com/t/air-jordan-1-low-og-white-red-mens-shoes-v0FbJt/CZ0790-161"
}
{
    "brand": "Nike",
    "name": "Nike Alphafly 2",
    "color": "Luminous Green/Crimson Tint/Volt/Black",
    "description": "Size-11, Look fast, feel fast in this ultrabright edition of the Nike Air Zoom Alphafly NEXT% 2. These rocket ships are made to help shave precious time off your personal records without surrendering the foundation you need to go the full distance. A thick, lightweight support system marries the 2 worlds of comfort and speed in holy running matrimony. Enjoy the greatest energy return of all our racing shoes while you chase your personal bests.",
    "price": 100,
    "image": "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/95111562-fdf1-41b2-8981-486fb00cd060/alphafly-2-mens-road-racing-shoes-Bstm8X.png",
    "link": "https://www.nike.com/t/alphafly-2-mens-road-racing-shoes-Bstm8X/FQ8110-331"
}
{
    "brand": "Nike",
    "name": "Air Force 1 High By You",
    "color": "Luminous Green/Crimson Tint/Volt/Black",
    "description": "Size-11, Let your design shine in satin, keep it classic in canvas, and get luxe with leather. No matter what you choose, these AF1s are all about you. 12 classic color choices and an additional gum option for the sole mean your shoe is destined to be one of a kind, just like you.",
    "price": 100,
    "image": "https://static.nike.com/a/images/t_PDP_864_v1/f_auto,b_rgb:f5f5f5/67031162-9cc5-481d-8ffe-7ada8f3d78bd/custom-nike-air-force-1-high-by-you-shoes.png",
    "link": "https://www.nike.com/u/custom-nike-air-force-1-high-by-you-shoes-10001372/4964465859"
}
{
    "brand": "Jordan",
    "name": "Air Jordan 1",
    "color": "Turbo Green",
    "description": "Size-11, Taking inspiration from the 90s and Charlotte Hornets, the Air Jordan I “Flight Nostalgia” pays tribute to the city for hosting its first NBA All Star game. Delivering a vintage aesthetic, this Air Jordan I arrives in a suede and leather upper, with the text “SP 19 AIR JORDAN 1 HIGH OG” engraved below the swoosh.",
    "price": 100,
    "image": "https://static.nike.com/a/images/t_prod_ss/w_640,c_limit,f_auto/renl4oohpqduft3vccwf/air-jordan-1-turbo-green-white-light-smoke-grey-release-date.jpg",
    "link": "https://www.nike.com/launch/t/air-jordan-1-turbo-green-white-light-smoke-grey"
}