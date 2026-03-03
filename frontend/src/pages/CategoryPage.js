import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { Typography, Button, Card, CardContent } from "@mui/material";
import "./CategoryPage.css";


const CategoryPage = () => {
  const location = useLocation();
  const { files } = location.state || { files: [] };

  // State to manage which file's analysis is expanded
  const [expandedFileIndex, setExpandedFileIndex] = useState(null);

  // Toggle the expanded state of the file
  const toggleAnalysis = (index) => {
    setExpandedFileIndex(expandedFileIndex === index ? null : index);
  };

  // Backend folder URL
  const backendUploadsFolder = "http://localhost:5000/uploads";

  return (
    <div className="category-page">
      <h1 className="page-title">
        {decodeURIComponent(location.pathname.split("/").pop())} Files
      </h1>

      {files.length > 0 ? (
        <div className="file-list">
          {files.map((file, index) => (
            <Card
              key={index}
              className={`file-container ${expandedFileIndex === index ? "expanded" : ""}`}
            >
              <CardContent>
                <div className="file-header">
                  <Typography variant="h6" className="file-title">
                    <a
                      href={`${backendUploadsFolder}/${file.filename}`}  // Corrected dynamic URL
                      target="_blank"
                      rel="noopener noreferrer"
                      className="file-link"
                    >
                      {file.filename}
                    </a>
                  </Typography>
                  <Button
                    className="analysis-button"
                    variant="contained"
                    size="small"
                    color="#355c7d"  // Fixed color attribute
                    onClick={() => toggleAnalysis(index)}
                  >
                    {expandedFileIndex === index
                      ? "Collapse Analysis"
                      : "View Analysis"}
                  </Button>
                </div>

                {expandedFileIndex === index && (
                  <div className="file-analysis">
                    <Typography variant="body2">
                      <strong>Category:</strong> {file.category}
                    </Typography>
                    <div className="analysis-section">
                      <div>
                        <Typography variant="body2">
                          <strong>Word Count:</strong> {file.analysis.word_count}
                        </Typography>
                      </div>
                      <div>
                        <Typography variant="body2">
                          <strong>Character Count:</strong> {file.analysis.char_count}
                        </Typography>
                      </div>
                      <div>
                        <Typography variant="body2">
                          <strong>Sentence Count:</strong> {file.analysis.sentence_count}
                        </Typography>
                      </div>
                      <div>
                        <Typography variant="body2">
                          <strong>Language:</strong> {file.analysis.language}
                        </Typography>
                      </div>
                    </div>
                    <div className="keywords-section">
                      <Typography variant="body2">
                        <strong>Top Keywords:</strong>
                        <ol className="keywords-list">
                          {file.analysis.top_keywords.map(([word, count], idx) => (
                            <li key={idx}>
                              {word} - {count}
                            </li>
                          ))}
                        </ol>
                      </Typography>
                    </div>
                    <div className="metric-card">
                      <Typography variant="h6" className="metric-title">
                        Metrics Overview
                      </Typography>
                      <div className="metric-grid">
                        <div className="metric-item">
                          <span className="metric-icon">📖</span>
                          <Typography variant="body1">
                            <strong>Readability Score:</strong> {file.analysis.readability_score}
                          </Typography>
                        </div>
                        <div className="metric-item">
                          <span className="metric-icon">✍</span>
                          <Typography variant="body1">
                            <strong>Average Sentence Length:</strong> {file.analysis.avg_sentence_length}
                          </Typography>
                        </div>
                        <div className="metric-item">
                          <span className="metric-icon">📊</span>
                          <Typography variant="body1">
                            <strong>Sentiment Polarity:</strong> {file.analysis.sentiment.polarity}
                          </Typography>
                        </div>
                        <div className="metric-item">
                          <span className="metric-icon">💡</span>
                          <Typography variant="body1">
                            <strong>Sentiment Subjectivity:</strong> {file.analysis.sentiment.subjectivity}
                          </Typography>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Typography variant="h6" className="no-files-message">
          No files found for this category.
        </Typography>
      )}
    </div>
  );
};

export default CategoryPage;