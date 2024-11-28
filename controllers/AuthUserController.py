from flask import Flask, request
from flask_restful import Resource
from models.Db import db
from models.User import User

app = Flask(__name__)

class AuthResource(Resource):
    @app.route('/api/auth/login', methods=['POST'])
    def post(self):
        #login
        data = request.get_json()
        username = data.get("username")
        password = data.get("password")

        user = User.query.filter_by(username=username).first()
        
        if user is None:
            return {"message": "Username is not found"}, 401

        if user.check_password(password):
            user.token = User.generate_token()
            db.session.commit()
            return {
                "data": {
                    "nama": user.nama,
                    "role": user.role,
                    "token": user.token
                }
            }, 200
        else:
            return {"message": "Login Failed"}, 401
    
    @app.route('/api/auth/edit', methods=['PUT'])
    def put(self):
        #edit
        token = request.headers.get("X-API-TOKEN")
        data = request.json
        username = data.get('username')
        nama = data.get('nama')
        password = data.get("password")

        user = User.query.filter_by(token = token).first()
        
        if user:
            if nama is not None:
                user.nama = nama
            if username is not None:
                user.username = username
            if password is not None:
                user.set_password(password)
            db.session.commit()
            return {"data": "User  updated successfully"}, 200
        
        return {"data": "Failed to Update User"}, 400

    @app.route('/api/auth/logout', methods=['DELETE'])
    def delete(self):
        # Logout User
        token = request.headers.get("X-API-TOKEN")
        user = User.query.filter_by(token=token).first()
        if user:
            user.token = None  
            db.session.commit()
            return {"data": "Logout Successfully"}, 200
        return {"data": "Logout Failed"}, 401
    
    @app.route('/api/auth/currentuser', methods=['GET'])
    def get(self):
        #Get current user data
        token = request.headers.get("X-API-TOKEN")
        user = User.query.filter_by(token=token).first()
        if user:
            username = user.username
            nama = user.nama
            return {
                "data": {
                    "username": str(username),
                    "nama": str(nama)
                }
            }
        
        return {"data": "Failed to get user data"}, 400
