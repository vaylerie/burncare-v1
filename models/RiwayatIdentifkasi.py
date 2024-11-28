from models.Db import db


class RiwayatIdentifikasi(db.Model):
    __tablename__ = 'riwayat_identifikasi'
    id = db.Column(db.Integer(), primary_key=True)
    user_id = db.Column(db.Integer(), db.ForeignKey('user.id'), nullable=True)
    hasil_upload_id = db.Column(db.Integer(), db.ForeignKey('hasil_upload.id'), nullable=True)
