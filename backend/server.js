require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const companyRoutes = require("./routes/CompanyRoutes"); // Adjust the path as necessary

const purchaseRoutes = require("./routes/PurchaseRoutes"); // Adjust the path as necessary

const salesRoutes = require("./routes/SalesRoutes");

const supplierRoutes = require("./routes/SupplierRoutes"); // Adjust the path as necessary
require("./connection"); // Import the connection setup file

const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json()); // To parse JSON bodies

app.get("/", (req, res) => {
  res.send("Hello World!!!!");
});

// Use company routes
app.use("/api/companies", companyRoutes);
app.use("/api/purchases", purchaseRoutes);
app.use("/api/sales", salesRoutes);
app.use("/api/suppliers", supplierRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
