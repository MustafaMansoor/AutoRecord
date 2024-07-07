import { useState, useEffect } from 'react';
import axios from 'axios';

const useFetchPurchases = (companyId) => {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    axios.get(`http://localhost:3000/api/companies/${companyId}/purchases`)
      .then((response) => {
        setPurchases(response.data.purchases);
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  }, [companyId]);

  return { purchases, loading, error };
};

export default useFetchPurchases;
