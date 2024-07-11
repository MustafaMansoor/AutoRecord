import { useState, useEffect } from 'react';
import axios from 'axios';

const useFetchSales = (companyId,) => {
  const [sales, setSales] = useState([]);
 

  useEffect(() => {
    axios.get(`http://localhost:3000/api/companies/${companyId}/sales`)
      .then((response) => {
        setSales(response.data.sales);
      }).catch((error) => {
       console.log(error);
      });
  }, [companyId]);

  return { sales };
};

export default useFetchSales;
