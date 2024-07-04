import './Index.css';
import { useLocation } from 'react-router-dom';
import ViewImage from './ViewImage';
import EditPage from './EditPage';

function Index() {
  const location = useLocation();
  const { purchase } = location.state || {};

  if (!purchase) {
    return <div>No purchase data available</div>;
  }

  return (
    <div className="index-container">
      <div className="view-image">
        <ViewImage URL={purchase.imageURL} />
      </div>
      <div className="edit-page">
        <EditPage data={purchase} />
      </div>
    </div>
  );
}

export default Index;
