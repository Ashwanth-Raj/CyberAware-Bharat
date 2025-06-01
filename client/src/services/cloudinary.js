
// Placeholder for additional Cloudinary utilities if needed
export const getCloudinaryConfig = () => ({
  cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
  uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
});