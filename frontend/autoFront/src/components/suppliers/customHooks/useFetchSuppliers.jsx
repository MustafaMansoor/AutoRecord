import { useState, useEffect } from 'react';
import axios from 'axios';

const useFetchSuppliers = (companyId,) => {
  const [suppliers, setSuppliers] = useState([]);
 

  useEffect(() => {
    axios.get(`http://localhost:3000/api/companies/${companyId}/suppliers`)
      .then((response) => {
        setSuppliers(response.data.suppliers);
      }).catch((error) => {
       console.log(error);
      });
  }, [companyId]);

  return { suppliers };
};

export default useFetchSuppliers;
