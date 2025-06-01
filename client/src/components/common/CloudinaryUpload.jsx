import { useState } from 'react';
import { uploadImage } from '../../services/cloudinary';

export default function CloudinaryUpload({ onUpload }) {
  const [images, setImages] = useState([]);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    const result = await uploadImage(file);
    setImages([...images, result.secure_url]);
    onUpload(result.secure_url);
  };

  return (
    <div>
      <input type="file" onChange={handleUpload} accept="image/*" />
      <div className="preview-grid">
        {images.map(img => <img key={img} src={img} alt="Uploaded" />)}
      </div>
    </div>
  );
}