import "./FlightInfo.css"
import { useState, useEffect } from "react";
import Papa from "papaparse";
import FileUploader from "../../components/FileUploader/FileUploader.jsx";
import TabularView from "../../components/TabularView/TabularView.jsx";
import FlightDataForm from "../../components/FlightDataForm/FlightDataForm.jsx";

const FlightInfo = () => {
  const [tableData, setTableData] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);


  // useEffect(() => {
  //   console.log("Updated Table Data:", tableData);  
  // }, [tableData]);  

const loadDataIntoDatabase = async () => {

  console.log('load data into database function!')

  try {
    if (!tableData || !Array.isArray(tableData) || tableData.length === 0) {
      throw new Error('No valid table data to upload');
    }

    const res = await fetch('http://localhost:5000/api/upload/excel-upload', {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        flightsData: tableData
      })
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    
    console.log('Data uploaded successfully:', data);
    
    return {
      success: true,
      data: data
    };

  } catch (error) {
    console.error('Error uploading data to database:', error);
    
   
    return {
      success: false,
      error: error.message
    };
  }
};

  useEffect(() => {
    if (tableData.length > 0) {
      loadDataIntoDatabase();
    }
  }, [isLoaded])

  const handleFileSelect = (file) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        console.log("Parsed Data:", results.data);
        setTableData(results.data);
        setIsLoaded(true)
      },
      error: (err) => {
        alert("Failed to parse CSV: " + err.message);
      }
    });
  };

  return (
    <section id="flight-info">
      <div style={{ display: "flex", padding: "20px", gap: "32px", alignItems: "flex-start" }}>
        <div style={{ flexShrink: 0, minWidth: 320 }}>
          <FileUploader onFileSelect={handleFileSelect} />
        </div>
        <div style={{ flexShrink: 0, minWidth: 420 }}>
          <FlightDataForm onAddFlight={(flight) => setTableData((prev) => [...prev, flight])} />
        </div>
      </div>
      <TabularView data={tableData} onUpdate={setTableData} />
    </section>
  );
};

export default FlightInfo;
