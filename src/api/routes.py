"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, Users
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required
from werkzeug.security import generate_password_hash, check_password_hash

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route('/users', methods=['GET'])
def get_users():
   data = Users.query.all()
   users = [users.serialize() for users in data]
   return jsonify ({"msg":"Ok", "data":users}), 200


@api.route('/users', methods=['POST'])
def create_user():
   email = request.json.get('email', None)
   password = request.json.get('password', None)
   if not email or not password:
      return jsonify ({"msg":"All fields is required"}), 400
   check = Users.query.filter_by(email=email).first()
   if check:
      return jsonify ({"msg":"User already exist"}), 400
   new_user = Users(email=email, password=password, is_active=True)
   db.session.add(new_user)
   db.session.commit()
   return jsonify({"msg": "OK", "data": new_user.serialize()}), 201


@api.route('/user', methods=['GET'])
@jwt_required()
def one_user():
   email = get_jwt_identity()
   exist = Users.query.filter_by(email=email).first()
   if exist is None:
        return jsonify({"msg": f"No user found with email {exist.email}, the database might be empty"}), 404
   return jsonify({"msg": "one user with email:" + str(email), "user": exist.serialize()}), 200





@api.route('/register', methods=['POST'])
def register():
    try:
        email = request.json.get('email', None)
        password = request.json.get('password', None)
        is_active = request.json.get('is_active', True)

        if not email or not password:
            return jsonify({"msg": "missing data"}), 400
        
        exist = Users.query.filter_by(email=email).first()
        if exist:
            return jsonify({"msg": "email taken"}), 400
        
        # Hash de la contraseña
        hashed_password = generate_password_hash(password)
        new_user = Users(email=email, password=hashed_password, is_active=is_active)

        db.session.add(new_user)
        db.session.commit()

       
        return jsonify({"msg": 'user created', 'id': new_user.id}), 201
    
    except Exception as e:
        db.session.rollback()
        print("Error during registration:", str(e)) #add print to help you debug
        return jsonify({"msg": "Internal server error", "error": str(e)}), 500



@api.route('/login', methods=['POST'])
def login():
    email = request.json.get('email', None)
    password = request.json.get('password', None)
    if not email or not password:
        return jsonify({"msg": "missing data"}), 400
    
    exist = Users.query.filter_by(email=email).first()
    if not exist:
        return jsonify({"msg": "user doesnt exist"}), 400

    if not check_password_hash(exist.password, password):
        return jsonify({"msg": "Incorrect password"}), 400

    token = create_access_token(identity=exist.email)
    return jsonify({"msg": 'ok', 'token': token, "user": exist.serialize()})
