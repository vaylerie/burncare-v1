from models.Db import db


class HasilUpload(db.Model):
    __tablename__ = 'hasil_upload'
    id = db.Column(db.Integer(), primary_key=True)
    derajat_klasifikasi = db.Column(db.Integer(), nullable=False)
    confidence_score = db.Column(db.Float, nullable=False)
    deskripsi = db.Column(db.String(255), nullable=False)
    result_path = db.Column(db.String(1000), nullable=True)
    upload_identifikasi_id = db.Column(db.Integer(), db.ForeignKey('upload_identifikasi.id'), nullable=True)
    histories = db.relationship('RiwayatIdentifikasi', backref='hasil_upload', lazy=True)
