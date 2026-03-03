// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import './ResultsPage.css';
// import axios from 'axios'; // Import axios for API requests

// const ResultsPage = () => {
//   const [categorizedFiles, setCategorizedFiles] = useState({
//     legal: [],
//     finance: [],
//     technology: [],
//     business: [],
//     sports: [],
//     others: [],
//   });
//   const [error, setError] = useState(null);

//   // Fetch the categorized files from your backend
//   useEffect(() => {
//     // Assuming the backend returns the categorized files in this format
//     axios.get('http://127.0.0.1:5000/get-classified-files') // Ensure your backend endpoint matches
//       .then((response) => {
//         setCategorizedFiles(response.data); // Assuming the backend sends the categorized files in the response
//       })
//       .catch((err) => {
//         setError('An error occurred while fetching classified files.');
//       });
//   }, []);

//   return (
//     <div className="results-container">
//       <h2>Results: Categorized Files</h2>

//       {/* Categories List */}
//       <div className="categories-list">
//         {Object.keys(categorizedFiles).map((category) => (
//           <div className="category" key={category}>
//             <h3>{category.charAt(0).toUpperCase() + category.slice(1)}</h3>
//             <ul>
//               {categorizedFiles[category].length ? (
//                 categorizedFiles[category].map((file, index) => (
//                   <li key={index}>
//                     <Link to={`/category/${category}`}>{file}</Link>
//                   </li>
//                 ))
//               ) : (
//                 <p>No files in this category</p>
//               )}
//             </ul>
//           </div>
//         ))}
//       </div>

//       {/* Error Message Section */}
//       {error && (
//         <div className="error-section">
//           <h3>Error: Some files were not classified correctly.</h3>
//           <Link to="/unclassified">Click here to view unclassified files</Link>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ResultsPage;
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent, Typography, Button } from "@mui/material";
import axios from "axios";  // To make API calls
import "./ResultsPage.css";

const ResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const classificationData = location.state?.classificationData || [];

  const categories = ["Science & Technology", "Business & Marketing", "Sports", "Legal", "Finance"];
  

  const categoryMapping = {
    "Science/Technology": "Science & Technology",
    "Business/Marketing": "Business & Marketing",
    "Sports": "Sports",
    "Legal": "Legal",
    "Finance": "Finance",
  };

  const groupedFiles = categories.reduce((acc, category) => {
    acc[category] = classificationData.filter((file) => {
      const normalizedCategory = categoryMapping[file.category] || null;
      return normalizedCategory === category;
    });
    return acc;
  }, {});

  const [saveStatus, setSaveStatus] = useState(null); // State for save status

  const handleCategoryClick = (category) => {
    navigate(`/category/${category}`, {
      state: { files: groupedFiles[category] || [] },
    });
  };

  const handleSaveReport = async () => {
    const username = localStorage.getItem("username");  // Get the username from localStorage
  
    if (!username) {
      setSaveStatus("Error: No username found.");
      return;
    }
  
    try {
      const response = await axios.post("http://localhost:5000/save_report", {
        username: username,  // Use the username from localStorage
        results: classificationData,
      });
  
      if (response.status === 200) {
        setSaveStatus("Report saved successfully!");
      } else {
        setSaveStatus("Error saving the report.");
      }
    } catch (error) {
      setSaveStatus("Error saving the report.");
    }
  };
  

  return (
    <div className="results-page">
      <h1>Classification Results</h1>

      <div className="card-container">
        {categories.map((category) => {
          const filesInCategory = groupedFiles[category];
          return (
            <Card key={category} className="result-card" onClick={() => handleCategoryClick(category)}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {filesInCategory.length} files
                </Typography>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {classificationData.length === 0 && (
        <p>No files were classified. Please try uploading files again.</p>
      )}

      {/* Save Report Button */}
      <Button
        variant="contained"
        color="#355c7d"
        onClick={handleSaveReport}
        style={{ marginTop: "20px" }}
      >
        Save Report
      </Button>

      {/* Save Report Status */}
      {saveStatus && (
        <Typography variant="body1" color={saveStatus.includes("success") ? "green" : "red"}>
          {saveStatus}
        </Typography>
      )}
    </div>
  );
};

export default ResultsPage;
