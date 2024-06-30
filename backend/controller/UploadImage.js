
const {addPurchaseToCompany,addSaleToCompany,addSupplierToCompany} = require('../controller/CompanyController')
const axios = require('axios').default; // Import Axios for HTTP requests
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Replace with your actual API key
const apiKey = "AIzaSyDhigrbXtU8YxdedLYwyK09dkU_43ne9Ds";

// Function to describe the image using Google Generative AI
async function describeImage(imageUrl) {
  try {
    // Initialize GoogleGenerativeAI with your API key.
    const genAI = new GoogleGenerativeAI(apiKey);

    // Get the generative model (gemini-1.5-flash-latest)
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash-latest",
    });

    // Fetch image data from URL
    const response = await axios.get(imageUrl, {
      responseType: 'arraybuffer', // Ensure response is treated as binary data
    });

    // Encode image data to base64
    const imageData = {
      inlineData: {
        data: Buffer.from(response.data, 'binary').toString('base64'),
        mimeType: response.headers['content-type'], // Use content-type from response headers
      },
    };

    // Define the prompt for the AI to generate text from
    const prompt = `
      Supplier Name = SupplierAName 
      Supplier A/C = SupplierACNumber 
      Category = CategoryType 
      Date = InvoiceDate 
      DueDate = InvoiceDueDate 
      Description = ItemDescription 
      Invoice # = InvoiceNumber 
      Reference # = ReferenceNumber 
      Net = NetAmount 
      VAT = VATAmount 
      Total = TotalAmount 
      VAT Code = VATCode 
      Currency = CurrencyType
    `;

    // Generate content using prompt and image data
    const result = await model.generateContent([prompt, imageData]);

    return result.response.text();
  } catch (error) {
    console.error("Error describing image:", error);
    throw new Error("Failed to describe image");
  }
}
function parseDescription(description) {
    const lines = description.split('\n');
    const data = {};
  
    lines.forEach(line => {
      const [key, value] = line.split('=').map(str => str.trim());
      data[key] = value || '';
    });
  
    return data;
  }

  const getData = async (req, res) => {
    const { imageUrl, company, category } = req.body;
    console.log(imageUrl, company, category);
  
    try {
      const description = await describeImage(imageUrl);
      const parsedData = parseDescription(description);
  
      const status = "pending";
      const supplierName = parsedData['Supplier Name'] || '';
      const supplierAccount = parsedData['Supplier A/C'] || '';
      const invoiceCategory = parsedData['Category'] || '';
      const invoiceDate = parsedData['Date'] ? new Date(parsedData['Date']) : null;
      const dueDate = parsedData['DueDate'] ? new Date(parsedData['DueDate']) : null;
      const itemDescription = parsedData['Description'] || '';
      const invoiceNumber = parsedData['Invoice #'] || '';
      const referenceNumber = parsedData['Reference #'] || '';
      const netAmount = parsedData['Net'] ? parseFloat(parsedData['Net']) : null;
      const vatAmount = parsedData['VAT'] ? parseFloat(parsedData['VAT']) : null;
      const totalAmount = parsedData['Total'] ? parseFloat(parsedData['Total']) : null;
      const vatCode = parsedData['VAT Code'] || '';
      const currencyType = parsedData['Currency'] || '';
        
      if (category === 'purchase') {
        const purchaseData = {
          status,
          supplierName,
          supplierAccount,
          category: invoiceCategory,
          date: invoiceDate,
          vatCode,
          currency: currencyType,
          net: netAmount,
          vat: vatAmount,
          total: totalAmount,
          imageURL: imageUrl,
        };
  
        await addPurchaseToCompany({ params: { companyId: company }, body: purchaseData }, res);
      }
  
      if (category === 'sales') {
        const saleData = {
          status,
          invoiceNumber,
          date: invoiceDate,
          customerName: supplierName, // Assuming customerName is equivalent to supplierName in sales
          customerAccount: supplierAccount, // Assuming customerAccount is equivalent to supplierAccount in sales
          category: invoiceCategory,
          vatCode,
          currency: currencyType,
          net: netAmount,
          vat: vatAmount,
          total: totalAmount,
          imageURL: imageUrl,
          reason: "", 
        };
        await addSaleToCompany({ params: { companyId: company }, body: saleData }, res);
      }
  
      if (category === 'suppliers') {
        const supplierData = {
          date: invoiceDate,
          supplierName,
          supplierAccount,
          currency: currencyType,
          dateRange: '', 
          status,
          statementNumber: invoiceNumber, // Assuming invoiceNumber should be saved as statementNumber in supplier
          imageURL: imageUrl,
          reason: "", 
        };
        await addSupplierToCompany({ params: { companyId: company }, body: supplierData }, res)
      }
  
      res.status(200).send();
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  };
  


module.exports = { getData };
