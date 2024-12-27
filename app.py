from flask import Flask, render_template, request, session, redirect, url_for
from flask_restful import Api
from controllers.AuthUserController import AuthResource
from controllers.RegisterUserController import UserResource
from controllers.ClassificationController import ClassifyResource
from controllers.HistoryController import HistoryResource
from controllers.AdminController import AdminResource
from controllers.UserDataController import UserDataResource
from controllers.AdminHistory import AdminHistory
from models.Db import db
import pymysql
pymysql.install_as_MySQLdb()

app = Flask(__name__, template_folder="templates")

app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:@localhost/burncare?ssl_disabled=1'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

api = Api(app)

# Define API resources
api.add_resource(UserResource, '/api/users')
api.add_resource(AuthResource, '/api/auth/login', '/api/auth/edit', '/api/auth/logout', '/api/auth/currentuser')
api.add_resource(ClassifyResource, '/api/upload')
api.add_resource(HistoryResource, '/api/history')
api.add_resource(AdminResource, '/api/admin/login')
api.add_resource(UserDataResource, '/api/admin/userdata')
api.add_resource(AdminHistory, '/api/admin/history')

@app.route("/")
def index():
	return render_template("index.html")

@app.route("/login")
def login():
    return render_template("login.html")

@app.route("/user")
def user():
    return render_template("user/index.html")

@app.route("/riwayat")
def history():
    return render_template("user/history.html")

@app.route("/hasil")
def hasil():
     return render_template("user/result.html")

@app.route("/profil")
def profil():
     return render_template("user/profile.html")

@app.route("/admin")
def admin():
    return render_template("admin/index.html")

@app.route("/admin-riwayat")
def admin_history():
     return render_template("admin/history.html")

@app.route("/daftar-pengguna")
def admin_user():
     return render_template("admin/user.html")

if __name__ == '__main__':
    app.run(debug=True)