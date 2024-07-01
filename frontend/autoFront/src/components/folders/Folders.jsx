import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Card, CardContent, Typography, Grid } from "@mui/material";

const Folders = () => {
  const { companyId } = useParams();
  const [counts, setCounts] = useState({
    purchases: { inbox: 0, rejected: 0, processing: 0 },
    sales: { inbox: 0, rejected: 0, processing: 0 },
    suppliers: { inbox: 0, rejected: 0, processing: 0 },
  });

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [purchasesRes, salesRes, suppliersRes] = await Promise.all([
          axios.get(
            `http://localhost:3000/api/companies/${companyId}/purchases`
          ),
          axios.get(`http://localhost:3000/api/companies/${companyId}/sales`),
          axios.get(
            `http://localhost:3000/api/companies/${companyId}/suppliers`
          ),
        ]);

        const calculateCounts = (items) => {
          const inbox = items.filter((item) => item.status === "inbox").length;
          const rejected = items.filter((item) => item.status === "rejected")
            .length;
          const processing = items.filter((item) => item.status === "pending")
            .length;
          return { inbox, rejected, processing };
        };

        setCounts({
          purchases: calculateCounts(purchasesRes.data.purchases),
          sales: calculateCounts(salesRes.data.sales),
          suppliers: calculateCounts(suppliersRes.data.suppliers),
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchCounts();
  }, [companyId]);

  const renderCard = (title, data) => (
    <Card sx={{ minWidth: 275, margin: 2 }}>
      <CardContent>
        <Typography variant="h5" component="div">
          {title}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          Inbox: {data.inbox}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          Rejected: {data.rejected}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          Processing: {data.processing}
        </Typography>
      </CardContent>
    </Card>
  );

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6} md={4}>
        {renderCard("Purchases", counts.purchases)}
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        {renderCard("Sales", counts.sales)}
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        {renderCard("Suppliers", counts.suppliers)}
      </Grid>
    </Grid>
  );
};

export default Folders;
