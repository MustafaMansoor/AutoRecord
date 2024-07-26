require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const companyRoutes = require("./routes/CompanyRoutes"); 
const purchaseRoutes = require("./routes/PurchaseRoutes"); 
const saleRoutes = require("./routes/SaleRoutes");
const supplierRoutes = require("./routes/supplierRoutes");
const UserRoutes = require("./routes/UserRoutes");

const ImageRoute = require("./routes/UploadImage");
require("./connection"); // Import the connection setup file

const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json()); // To parse JSON bodies

app.get("/", (req, res) => {
  res.send("Hello World!!!!");
});

app.use("/api/user",UserRoutes);

// Use company routes
app.use("/api/companies", companyRoutes);


// Use purchase routes
app.use("/api/companies/:companyId/purchases", purchaseRoutes);

// Use sale routes
app.use("/api/companies/:companyId/sales", saleRoutes);

// Use supplier routes
app.use("/api/companies/:companyId/suppliers", supplierRoutes);

app.use("/api/upload", ImageRoute);


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
