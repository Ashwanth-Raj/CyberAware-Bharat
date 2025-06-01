export const validateUpload = (file) => {
  const maxSize = 5 * 1024 * 1024; // 5MB
  const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'Invalid file type. Use JPEG, PNG, or PDF.' };
  }
  if (file.size > maxSize) {
    return { valid: false, error: 'File size exceeds 5MB.' };
  }
  return { valid: true };
};