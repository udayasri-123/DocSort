import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { Button, Menu, MenuItem, Typography, Avatar, Divider, ListItemIcon } from "@mui/material";
import { Person, Settings, Logout } from "@mui/icons-material";
import "./UploadPage.css";
import Logo from "../assets/logonew4.jpg";

const UploadPage = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [profileMenuAnchor, setProfileMenuAnchor] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(auth.currentUser?.displayName || "User");
  const [email, setEmail] = useState(auth.currentUser?.email || "user@example.com");
  const navigate = useNavigate();

  const currentUser = auth.currentUser;
  const displayName = currentUser?.displayName || "User";
  const allowedFileTypes = [".pdf", ".docx", ".txt", ".xlsx", ".jpg", ".jpeg", ".png"];

  const handleFileSelection = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter((file) => {
      const fileType = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
      return allowedFileTypes.includes(fileType);
    });

    if (validFiles.length === 0) {
      alert("No valid files found. Please upload supported file formats.");
      return;
    }

    setSelectedFiles((prevFiles) => {
      const existingFiles = new Set(prevFiles.map((file) => file.webkitRelativePath || file.name));
      const uniqueFiles = validFiles.filter(
        (file) => !existingFiles.has(file.webkitRelativePath || file.name)
      );
      return [...prevFiles, ...uniqueFiles];
    });
  };

  const simulateUpload = () => {
    let progress = 0;
    const interval = setInterval(() => {
      if (progress < 100) {
        progress += 10;
        setUploadProgress(progress);
      } else {
        clearInterval(interval);
      }
    }, 500);
  };

  const handleClassify = async () => {
    if (selectedFiles.length === 0) {
      alert("No files or folders uploaded for classification.");
      return;
    }

    const formData = new FormData();
    selectedFiles.forEach((file) => {
      formData.append("file", file);
    });

    try {
      simulateUpload();

      const response = await axios.post("http://127.0.0.1:5000/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.status === "success") {
        navigate("/results", { state: { classificationData: response.data.results } });
      } else {
        alert("An error occurred during classification. Please try again.");
      }
    } catch (error) {
      alert("An error occurred while uploading or classifying the files.");
    }
  };

  const handleProfileMenuOpen = (event) => {
    setProfileMenuAnchor(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setProfileMenuAnchor(null);
  };

  const handleLogout = () => {
    auth.signOut().then(() => {
      alert("Logged out successfully!");
      navigate("/login");
    });
  };

  // New handle view history function
  const handleViewHistory = () => {
    navigate("/history");  // This will redirect to the History page
  };

  return (
    <div className="upload-page">
      <header className="header">
        <div className="logo">
          <img src={Logo} alt="DOCSORT Logo" style={{ height: "70px", marginRight: "8px" }} />
          <Typography variant="h4" style={{ fontWeight: "bold" }}>
            DOCSORT
          </Typography>
        </div>
        <div className="profile-section">
          <Avatar onClick={handleProfileMenuOpen} className="avatar-brown" style={{ cursor: "pointer", bgcolor: "#8a5e3b", color: "#ffffff" }}>
            {displayName.charAt(0).toUpperCase()}
          </Avatar>
          <Menu anchorEl={profileMenuAnchor} open={Boolean(profileMenuAnchor)} onClose={handleProfileMenuClose}>
            <div className="user-details">
              <Typography variant="h6" align="center" gutterBottom>{displayName}</Typography>
              <Typography variant="body2" color="textSecondary" align="center">{email}</Typography>
            </div>

            <MenuItem onClick={() => navigate("/settings")}>
              <ListItemIcon><Settings fontSize="small" /></ListItemIcon> Settings
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout}>
              <ListItemIcon><Logout fontSize="small" /></ListItemIcon> Sign Out
            </MenuItem>
          </Menu>
        </div>
      </header>

      <div className="upload-header">
        <Typography variant="h4" align="center" style={{ marginBottom: "20px" }}>
          Upload Files
        </Typography>
        <Typography
          variant="body1"
          align="center"
          style={{ marginBottom: "20px", color: "white" }}
        >
          Use the buttons below to select files or folders.
        </Typography>
      </div>

      <div className="upload-container">
        <div className="upload-buttons">
          <input type="file" id="file-upload-input" multiple onChange={handleFileSelection} style={{ display: "none" }} />
          <label htmlFor="file-upload-input">
            <Button variant="contained" component="span" startIcon={<CloudUploadIcon />} sx={{ backgroundColor: '#355c7d', width: '200px', height: '40px' }}>
              Choose Files
            </Button>
          </label>

          <input type="file" id="folder-upload-input" webkitdirectory="true" multiple onChange={handleFileSelection} style={{ display: "none" }} />
          <label htmlFor="folder-upload-input">
            <Button variant="contained" component="span" startIcon={<CloudUploadIcon />} sx={{ backgroundColor: '#355c7d', width: '200px', height: '40px' }}>
              Choose Folder
            </Button>
          </label>
        </div>

        <div className="file-preview">
          {selectedFiles.length > 0 && (
            <>
              <Typography variant="h6" align="center" style={{ color: '#355c7d', marginBottom: '10px' }}>
                Selected Files and Folders to Classify:
              </Typography>
              <div className="scrollable-preview" >
                <ul>
                  {selectedFiles.map((file, index) => (
                    <li key={index}>
                      <Typography variant="body1">
                        {file.webkitRelativePath || file.name} ({(file.size / 1024).toFixed(2)} KB)
                      </Typography>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </div>

        {uploadProgress > 0 && (
          <div className="progress-bar-container">
            <div className="progress-bar" style={{ width: `${uploadProgress}%` }}>
              {uploadProgress}%
            </div>
          </div>
        )}

        {selectedFiles.length > 0 && (
         <Button
         variant="contained"
         onClick={handleClassify}
         className="classify-button"
         sx={{ backgroundColor: "#355c7d" }}>

            Classify Files
          </Button>
        )}
      </div>

      {/* New "View History" Button */}
      <Button variant="contained" onClick={handleViewHistory} sx={{ backgroundColor: '#355c7d', width: '200px', marginTop: '20px' }}>
        View History
      </Button>
    </div>
  );
};

export default UploadPage;
