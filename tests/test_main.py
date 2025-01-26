import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

import unittest
from unittest.mock import patch
from PIL import Image
import numpy as np
from utils.ProcessingImage import resize, process

class TestGradCAM(unittest.TestCase):
    
    def setUp(self):
        """Setup sebelum setiap test dijalankan."""
        self.sample_image_path = "tests/sample.jpg"
        self.sample_image = Image.new('RGB', (500, 500)) 
        self.labels = [1, 2, 3]
    
    def test_resize(self):
        """Test fungsi resize menghasilkan ukuran (224, 224)."""
        resized_img = resize(self.sample_image)
        self.assertEqual(resized_img.size, (224, 224)) 
    
    def test_process_valid_path(self):
        """Test fungsi process dengan input berupa path valid."""
        with patch("utils.ProcessingImage.model.predict") as mock_predict:
            mock_predict.return_value = np.array([[0.1, 0.7, 0.2]])
            result = process(self.sample_image_path)
            self.assertEqual(result[0], 2) 
            self.assertTrue(result[1].endswith(".jpg")) 
            self.assertAlmostEqual(result[2], 0.7) 
    
    def test_process_invalid_input(self):
        """Test fungsi process dengan input yang salah."""
        with self.assertRaises(ValueError):
            process(123) 
    
    def test_gradcam_output(self):
        """Test Grad-CAM menghasilkan heatmap dengan dimensi sesuai."""
        with patch("utils.ProcessingImage.model.predict") as mock_predict:
            mock_predict.return_value = np.array([[0.3, 0.5, 0.2]])  
            gradcam_result = process(self.sample_image) 
            self.assertTrue(gradcam_result[1].endswith(".jpg")) 
    
    def test_save_image(self):
        """Test gambar hasil Grad-CAM disimpan di direktori yang benar."""
        with patch("os.path.join", return_value="static/img/result_img/test.jpg"):
            _, result_path, _ = process(self.sample_image_path)
            self.assertEqual(result_path, "static/img/result_img/test.jpg")
    
    def test_model_prediction(self):
        """Test prediksi model menghasilkan hasil dengan dimensi sesuai."""
        with patch("os.path.join", return_value="static/img/result_img/test.jpg"):
            with patch("utils.ProcessingImage.model.predict") as mock_predict:
                mock_predict.return_value = np.array([[0.2, 0.6, 0.2]])  
                result = process(self.sample_image)
                self.assertEqual(result[0], 2)

if __name__ == "__main__":
    unittest.main()