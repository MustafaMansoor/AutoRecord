import "./EditAndViewPage.css";
import { useLocation } from "react-router-dom";
import ViewImage from "./ViewImage";
import EditImageDetails from "./EditImageDetails";

function EditAndViewPage() {
  const location = useLocation();
  const { purchase } = location.state || {};

  if (!purchase) {
    return <div>No purchase data available</div>;
  }

  return (
    <div className="EditAndView-container">
      <div className="EditAndView-container-first">
        <EditImageDetails data={purchase} />
      </div>
      <div className="EditAndView-container-second">
        <ViewImage URL={purchase.imageURL} />
      </div>
    </div>
  );
}

export default EditAndViewPage;
