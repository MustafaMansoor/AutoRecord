import { useState, useEffect } from 'react';
import axios from 'axios';

const useFetchPurchases = (companyId) => {
  const [purchases, setPurchases] = useState([]);
 

  useEffect(() => {
    axios.get(`http://localhost:3000/api/companies/${companyId}/purchases`)
      .then((response) => {
        setPurchases(response.data.purchases);
        
      }).catch((error) => {
       console.log(error);
      });
  }, [companyId]);

  return { purchases };
};

export default useFetchPurchases;
