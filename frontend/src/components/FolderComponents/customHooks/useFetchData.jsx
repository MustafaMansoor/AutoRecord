import { useState, useEffect } from 'react';
import axios from 'axios';

const useFetchData = (companyId, value) => {
  const [data, setData] = useState([]);
 

  useEffect(() => {
    axios.get(`http://localhost:3000/api/companies/${companyId}/${value}`)
      .then((response) => {
        setData(response.data[value]);
      }).catch((error) => {
       console.log(error);
      });
  }, [companyId, value]);

  return { data };
};

export default useFetchData;
