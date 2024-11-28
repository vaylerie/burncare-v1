from models.Db import db
from werkzeug.security import generate_password_hash, check_password_hash
import uuid


class User(db.Model):
    __tablename__ = 'user'
    id = db.Column(db.Integer(), primary_key=True)
    username = db.Column(db.String(80), nullable=False)
    nama = db.Column(db.String(120), nullable=False)
    role = db.Column(db.String(50), nullable=False)
    password = db.Column(db.String(128), nullable=False)
    token = db.Column(db.String(128), nullable=True)
    uploads = db.relationship('UploadIdentifikasi', backref='user', lazy=True)

    def set_password(self, password):
        self.password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)
    
    def generate_token():
        return str(uuid.uuid4())