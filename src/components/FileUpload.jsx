import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File, X } from 'lucide-react';

const FileUpload = ({ onFileUpload, onCodeChange }) => {
  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();
      
      reader.onload = () => {
        const content = reader.result;
        const fileName = file.name;
        
        // If it's App.js or similar main file, update the main code
        if (fileName.toLowerCase().includes('app.') || acceptedFiles.length === 1) {
          onCodeChange(content);
        }
        
        // Also upload the file to Snack
        onFileUpload(fileName, content);
      };
      
      reader.readAsText(file);
    });
  }, [onFileUpload, onCodeChange]);

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    acceptedFiles,
    fileRejections
  } = useDropzone({
    onDrop,
    accept: {
      'text/javascript': ['.js', '.jsx'],
      'text/typescript': ['.ts', '.tsx'],
      'text/plain': ['.txt']
    },
    maxFiles: 10,
    maxSize: 1024 * 1024 // 1MB
  });

  const removeFile = (fileName) => {
    // This would need to be implemented to remove files from Snack
    console.log('Remove file:', fileName);
  };

  return (
    <div className="file-upload-section">
      <div
        {...getRootProps()}
        className={`dropzone ${isDragActive ? 'active' : ''}`}
      >
        <input {...getInputProps()} />
        <div className="dropzone-content">
          <Upload size={32} />
          {isDragActive ? (
            <p>Drop the files here...</p>
          ) : (
            <div>
              <p>Drag & drop React Native files here</p>
              <p className="dropzone-hint">or click to select files</p>
              <p className="dropzone-formats">Supports: .js, .jsx, .ts, .tsx</p>
            </div>
          )}
        </div>
      </div>

      {acceptedFiles.length > 0 && (
        <div className="uploaded-files">
          <h4>Uploaded Files:</h4>
          <ul>
            {acceptedFiles.map((file) => (
              <li key={file.path} className="file-item">
                <File size={16} />
                <span className="file-name">{file.name}</span>
                <span className="file-size">({(file.size / 1024).toFixed(1)} KB)</span>
                <button
                  className="remove-file"
                  onClick={() => removeFile(file.name)}
                  title="Remove file"
                >
                  <X size={14} />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {fileRejections.length > 0 && (
        <div className="file-errors">
          <h4>Rejected Files:</h4>
          <ul>
            {fileRejections.map(({ file, errors }) => (
              <li key={file.path} className="error-item">
                <span>{file.name}</span>
                <ul>
                  {errors.map((error) => (
                    <li key={error.code} className="error-message">
                      {error.message}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
