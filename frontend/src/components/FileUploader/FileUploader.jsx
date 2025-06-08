import "./FileUploader.css";
import { useRef, useState } from "react";

const FileUploader = ({ onFileSelect }) => {  // Accepting onFileSelect as a prop
    const fileInputRef = useRef(null);
    const [fileName, setFileName] = useState("");

    const handleFileChange = (e) => {
      const file = e.target.files[0];
      setFileName(file ? file.name : "");
      if (onFileSelect && file) {
        onFileSelect(file);  // Passing the selected file to parent component
      }
    };

    const handleChooseFile = () => {
      fileInputRef.current.click();
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      if (!fileName) {
        alert("Please select a file first.");
      }
    };

    return (
        <form onSubmit={handleSubmit} className="file-uploader-form">
            <h2 className="file-uploader-title">Upload New File</h2>
            <div>
                <div onClick={handleChooseFile} className="file-uploader-choose">
                  {fileName || "Choose a file"}
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                />
            </div>
            <button type="submit" className="file-uploader-submit">
                Submit
            </button>
        </form>
    );
}

export default FileUploader;