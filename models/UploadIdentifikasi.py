from models.Db import db


class UploadIdentifikasi(db.Model):
    __tablename__ = 'upload_identifikasi'
    id = db.Column(db.Integer(), primary_key=True)
    file_path = db.Column(db.String(1000), nullable=False)
    waktu_upload = db.Column(db.DateTime, nullable=False)
    user_id = db.Column(db.Integer(), db.ForeignKey('user.id'), nullable=True)
    results = db.relationship('HasilUpload', backref='upload_identifikasi', lazy=True)