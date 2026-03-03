import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import for routing
import "./UploadPage.css";

const UploadPage = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [userProfileDropdown, setUserProfileDropdown] = useState(false);
  const navigate = useNavigate();

  // Define allowed file types
  const allowedFileTypes = [".pdf", ".docx", ".txt", ".xlsx", ".jpg", ".jpeg", ".png"];

  // Process the uploaded folder's files and subfolders
  const processFiles = (fileList) => {
    const validFiles = [];
    for (const file of fileList) {
      const fileType = file.name.slice(file.name.lastIndexOf("."));
      if (allowedFileTypes.includes(fileType)) {
        validFiles.push(file);
      }
    }
    return validFiles;
  };

  // Handle file or folder selection
  const handleFileSelection = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = processFiles(files);

    if (validFiles.length === 0) {
      alert("No valid files found. Please ensure the files are in supported formats.");
      return;
    }

    setSelectedFiles((prevFiles) => [...prevFiles, ...validFiles]);
  };

  // Route to Results Page
  const handleClassify = () => {
    if (selectedFiles.length === 0) {
      alert("No files or folders uploaded for classification.");
      return;
    }
    navigate("/results"); // Navigate to the Results Page
  };

  // Handle user profile dropdown visibility toggle
  const toggleProfileDropdown = () => {
    setUserProfileDropdown(!userProfileDropdown);
  };

  return (
    <div className="upload-page">
      <div className="header">
        <div className="logo">
          <img src="path/to/logo.png" alt="DocSort Logo" />
          <span>DOCSORT</span>
        </div>

        {/* User Profile Section */}
        <div className="user-profile" onClick={toggleProfileDropdown}>
          <img src="path/to/profile-icon.png" alt="User Profile" className="profile-icon" />
          <span>John Doe</span>
          {userProfileDropdown && (
            <div className="dropdown-menu">
              <div className="dropdown-item">
                <i className="fas fa-user"></i> Profile
                <button className="edit-button">Edit</button>
              </div>
              <div className="dropdown-item">
                <i className="fas fa-cogs"></i> Settings
                <button className="settings-button">Change Password</button>
              </div>
              <div className="dropdown-item">
                <i className="fas fa-sign-out-alt"></i> Logout
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="upload-info">
        <h1>Upload Files or Folders for Classification</h1>
        <p>
          Upload multiple files or folders with subfolders for classification. Supported file formats include:
          <strong> PDFs, Word Documents (.docx), Text Files (.txt), Excel Files (.xlsx), and Images (.jpg, .jpeg, .png).</strong>
        </p>
      </div>

      <div className="upload-container">
        {/* Upload Buttons (Files & Folders) */}
        <div className="upload-buttons">
          {/* File Upload */}
          <label htmlFor="file-upload-input" className="upload-label">
            Choose Files
          </label>
          <input
            type="file"
            id="file-upload-input"
            multiple
            onChange={handleFileSelection}
          />

          {/* Folder Upload */}
          <label htmlFor="folder-upload-input" className="upload-label">
            Choose Folder
          </label>
          <input
            type="file"
            id="folder-upload-input"
            webkitdirectory="true"
            multiple
            onChange={handleFileSelection}
          />
        </div>

        {/* File Preview */}
        <div className="file-preview">
          {selectedFiles.length > 0 && (
            <>
              <h3>Selected Files and Folders to Classify:</h3>
              <div className="scrollable-preview">
                <ul>
                  {selectedFiles.map((file, index) => (
                    <li key={index}>
                      <div className="file-info">
                        <strong>{file.webkitRelativePath || file.name}</strong>
                        <span>({(file.size / 1024).toFixed(2)} KB)</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </div>

        {/* Classify Button */}
        {selectedFiles.length > 0 && (
          <button className="classify-button" onClick={handleClassify}>
            Classify Files
          </button>
        )}
      </div>
    </div>
  );
};

export default UploadPage;
