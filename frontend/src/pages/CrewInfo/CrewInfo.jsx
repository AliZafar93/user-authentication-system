import "./CrewInfo.css";
import FileUploader from "../../components/FileUploader/FileUploader.jsx";
import TabularView from "../../components/TabularView/TabularView.jsx";

const CrewInfo = () => {
    return (
        <>
            <h1>Crew Information</h1>
            <FileUploader />
            <TabularView />
        </>
    );
}

export default CrewInfo;