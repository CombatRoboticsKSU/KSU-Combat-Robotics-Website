import React from 'react';
import './PhotoCropper.css';

interface PhotoCropperProps {
  src: string;
  height: number; // Add height as a prop
}

const PhotoCropper: React.FC<PhotoCropperProps> = ({ src, height }) => {
  return (
    <div className="photo-cropper">
      <img src={src} alt="Cropped" style={{ width: '100%', height: `${height}px`, objectFit: 'cover' }} />
    </div>
  );
};

export default PhotoCropper;
