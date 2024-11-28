from flask import Flask, request
from flask_restful import Resource
from models.User import User
from models.Db import db
import uuid

app = Flask(__name__)

class AdminResource(Resource):
    @app.route('/api/admin/login', methods=['POST'])
    def post(self):
        #login
        data = request.get_json()
        username = data.get("username")
        password = data.get("password")

        user = User.query.filter_by(username=username).first()
        
        if user is None:
            return {"message": "User not found. Login failed."}, 401
        
        if user.role != 'Admin':
            return {"message": "Login Failed"}, 401


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
            return {"message": "Wrong password. Login Failed."}, 401
