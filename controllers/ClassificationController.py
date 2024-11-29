from flask import Flask, request
from flask_restful import Resource
from models.User import User
from models.UploadIdentifikasi import UploadIdentifikasi
from models.HasilUpload import HasilUpload
from models.Db import db
from models.RiwayatIdentifkasi import RiwayatIdentifikasi
import os
import logging
from utils.ProcessingImage import process, resize

app = Flask(__name__)

class ClassifyResource(Resource):
    @app.route('/api/upload', methods=['POST'])
    def post(self):
        token = request.headers.get("X-API-TOKEN")
        if not token:
            return {"data": "Unauthorized"}, 401
        user = User.query.filter_by(token=token).first()
        user_id = user.id

        if 'image' not in request.files:
            return {"data": "Failed to upload image"}, 400

        file = request.files['image']
        if file.filename == '':
            return {"data": "Failed to upload image"}, 400

        try:
            file_path = os.path.join('static/img/predict_img/', file.filename)
            image = resize(file)
            image.save(file_path)

            upload_record = UploadIdentifikasi(file_path=file_path,
                                               user_id=user_id)
            db.session.add(upload_record)
            db.session.commit()

            upload_identifikasi_id = upload_record.id
            derajat_klasifikasi, gradcam_path, confidence_score = process(file_path)

            if derajat_klasifikasi == 1:
                deskripsi = "Luka Bakar Derajat Pertama (Superficial) adalah cedera yang hanya mengenai lapisan epidermis, yaitu lapisan kulit paling luar. Karakteristiknya meliputi kemerahan, nyeri ringan, dan sedikit bengkak. Biasanya disebabkan oleh sengatan matahari atau kontak singkat dengan benda panas. Proses penyembuhan berlangsung dalam waktu 3-7 hari tanpa meninggalkan bekas luka. Penanganannya dilakukan dengan pendinginan menggunakan air bersih mengalir bersuhu 10-20 derajat Celsius dan dapat diberikan obat pereda nyeri seperti ibuprofen atau paracetamol untuk meredakan rasa sakit."
            elif derajat_klasifikasi == 2:
                deskripsi = "Luka Bakar Derajat Kedua (Partial Thickness) merupakan cedera yang lebih serius yang merusak lapisan epidermis dan sebagian lapisan dermis. Pada derajat ini, muncul lepuhan berisi cairan bening atau kekuningan dengan nyeri yang cukup intens. Kulit di sekitar area luka akan tampak merah, meradang, dan membengkak. Penanganannya membutuhkan perhatian medis lebih intensif. Awalnya dilakukan pendinginan dengan air dingin, kemudian pembersihan menggunakan larutan antiseptik. Luka ditutup dengan perban steril dan diberikan antibiotik topikal atau oral untuk mencegah infeksi. Pada kasus dengan area luka yang luas, mungkin diperlukan terapi cairan intravena dan bahkan prosedur cangkok kulit untuk mempercepat proses penyembuhan."
            elif derajat_klasifikasi == 3:
                deskripsi = "Luka Bakar Derajat Tiga (Full Thickness) adalah jenis cedera paling serius yang merusak seluruh lapisan kulit hingga mencapai jaringan lemak di bawahnya. Area yang terbakar tampak pucat, cokelat tua, atau hitam seperti arang. Ciri khasnya adalah hilangnya fungsi pelindung kulit dan tidak adanya rasa nyeri karena kerusakan saraf sensorik. Jaringan mengalami nekrosis dan akan mengelupas. Penyebab utamanya adalah paparan panas tinggi dalam waktu lama, seperti api terbuka, cairan panas, atau bahan kimia korosif. Penanganannya memerlukan tindakan medis segera dan intensif di rumah sakit. Prosedur meliputi pendinginan area luka, pembersihan dengan cairan steril, debridemen untuk menghilangkan jaringan mati, terapi cairan intravena, dan cangkok kulit. Antibiotik diberikan untuk mencegah infeksi, sementara obat pereda nyeri digunakan untuk mengatasi rasa sakit di area sekitar luka."
            else:
                deskripsi = "-"
            

            hasil_record = HasilUpload(derajat_klasifikasi=derajat_klasifikasi, 
                                       confidence_score=confidence_score,
                                       deskripsi=deskripsi,
                                       upload_identifikasi_id=upload_identifikasi_id,
                                       result_path=gradcam_path)
            db.session.add(hasil_record)
            db.session.commit()

            history_record = RiwayatIdentifikasi(user_id=user_id,
                                                 hasil_upload_id=hasil_record.id)
            db.session.add(history_record)
            db.session.commit()

            return {"data": 
                    {"derajat_klasifikasi": str(derajat_klasifikasi),
                    "confidence_score": str(confidence_score),
                    "file_path": str(file_path),
                    "result_path": str(gradcam_path),
                    "deskripsi": deskripsi
                    }
            }, 200

        except Exception as e:
            logging.error(f"Error occurred: {e}")
            return {"data": "Failed to upload image"}, 500