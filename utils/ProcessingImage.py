from keras.preprocessing.image import img_to_array #type: ignore
from keras.models import load_model #type: ignore
from tf_keras_vis.gradcam import Gradcam
from tf_keras_vis.utils.scores import CategoricalScore
from matplotlib import cm
import os
from PIL import Image
import numpy as np

model = load_model('utils/model.h5', compile=False, custom_objects={})
save_dir='static/img/result_img'
labels = [1, 2, 3]

def resize(img, target_size=(224, 224)):
    img = img.resize(target_size)
    return img

def process(file_path, target_size=(224, 224)):
    if isinstance(file_path, Image.Image):  
        img = file_path.resize(target_size)
    elif isinstance(file_path, str): 
        img = Image.open(file_path).resize(target_size)
    else:
        raise ValueError("Input harus berupa path string atau objek PIL.Image.Image")

    img_copy = img.copy()
    img_array = img_to_array(img) / 255.  
    img_array = np.expand_dims(img_array, axis=0)  


    y = model.predict(img_array)
    confidence_score = np.max(y)
    class_index = np.argmax(y)
    derajat_klasifikasi = labels[class_index]

    gradcam = Gradcam(model, clone=True)
    cam = gradcam(CategoricalScore([class_index]), img_array, penultimate_layer=-1)
    heatmap = np.uint8(cm.jet(cam[0])[..., :3] * 255)
    heatmap_img = Image.fromarray(heatmap).resize((img_copy.size[0], img_copy.size[1]))
    if img_copy.mode != 'RGB':
        img_copy = img_copy.convert('RGB')
    gradcam_overlay = Image.blend(img_copy, heatmap_img, alpha=0.5)
    result_filename = f"gradcam_{os.path.basename(file_path) if isinstance(file_path, str) else 'image'}.jpg"
    result_path = os.path.join(save_dir, result_filename)
    gradcam_overlay.save(result_path, format='JPEG')

    return derajat_klasifikasi, result_path, confidence_score
