import { useState } from 'react';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../../config/firebase';

export default function FileUpload({ storagePath, onUploadComplete, accept = '.pdf', maxSizeMB = 10 }) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [fileName, setFileName] = useState('');

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`File size must be less than ${maxSizeMB}MB`);
      return;
    }

    setError('');
    setFileName(file.name);
    setUploading(true);

    const path = `${storagePath}/${Date.now()}-${file.name}`;
    const storageRef = ref(storage, path);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const pct = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        setProgress(pct);
      },
      (err) => {
        setError('Upload failed. Please try again.');
        setUploading(false);
        console.error(err);
      },
      async () => {
        const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
        setUploading(false);
        onUploadComplete({ downloadUrl, storagePath: path });
      }
    );
  };

  return (
    <div>
      <label className="block text-sm font-bold text-black mb-1">Signed MoU Copy (PDF)</label>
      <input
        type="file"
        accept={accept}
        onChange={handleUpload}
        disabled={uploading}
        className="block w-full text-sm text-black file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-2 file:border-black file:text-sm file:font-bold file:bg-brutal-primary file:text-black file:cursor-pointer hover:file:bg-brutal-primary/80 disabled:opacity-50"
      />
      {uploading && (
        <div className="mt-2">
          <div className="bg-gray-200 rounded-md h-3 border-2 border-black overflow-hidden">
            <div className="bg-brutal-primary h-full transition-all" style={{ width: `${progress}%` }}></div>
          </div>
          <p className="text-xs font-bold text-black mt-1">Uploading {fileName}... {progress}%</p>
        </div>
      )}
      {error && <p className="text-xs font-bold text-red-600 mt-1">{error}</p>}
      {!uploading && fileName && !error && (
        <p className="text-xs font-bold text-black mt-1">Uploaded: {fileName}</p>
      )}
    </div>
  );
}
