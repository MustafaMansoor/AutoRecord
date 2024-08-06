const { addPurchaseToCompany } = require('../controller/PurchaseController');
const { addSaleToCompany } = require('../controller/SalesController');
const { addSupplierToCompany } = require('../controller/SupplierController');

const axios = require('axios').default;
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Replace with your actual API key
const apiKey = "AIzaSyDhigrbXtU8YxdedLYwyK09dkU_43ne9Ds";

// Function to describe the image using Google Generative AI
async function describeImage(imageUrl, prompt) {
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash-latest",
    });

    const response = await axios.get(imageUrl, {
      responseType: 'arraybuffer',
    });

    const imageData = {
      inlineData: {
        data: Buffer.from(response.data, 'binary').toString('base64'),
        mimeType: response.headers['content-type'],
      },
    };

    const result = await model.generateContent([prompt, imageData]);
    console.log("result is ",result);
    return result.response.text();
  } catch (error) {
    console.error("Error describing image:", error);
    throw new Error("Failed to describe image");
  }
}

function parseDescription(description) {
  // Remove any extraneous symbols and parse as JSON
  const cleanDescription = description
    .replace(/```json|```/g, '') // Remove ```json and ```
    .trim();

  // Attempt to parse the cleaned description as JSON
  try {
    const parsedData = JSON.parse(cleanDescription);
    return parsedData;
  } catch (error) {
    console.error("Error parsing JSON:", error);
  }

  // Fallback to manual parsing if JSON parsing fails
  const lines = cleanDescription.split('\n');
  const data = {};

  lines.forEach(line => {
    const match = line.match(/"([^"]+)"\s*:\s*(.*)/);
    if (match) {
      const key = match[1];
      let value = match[2].trim();

      // Remove surrounding quotes from the value if present
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1);
      }

      data[key] = value || '';
    }
  });

  return data;
}


function getPromptForCategory(category) {
  switch (category) {
    case 'purchase':
      return `
        Extract the following fields from the invoice image accurately:
        - Supplier Name = SupplierName
        - Supplier Account = SupplierAccount
        - Category = Category
        - Date = Date
        - Invoice Number = InvoiceNumber
        - Net Amount = Net
        - VAT Amount = VAT
        - Total Amount = Total
        - VAT Code = VATCode
        - Currency = Currency
      `;
    case 'sales':
      return `
        Extract the following fields from the sales invoice image accurately:
        - Customer Name = CustomerName
        - Customer Account = CustomerAccount
        - Category = Category
        - Date = Date
        - Invoice Number = InvoiceNumber
        - Net Amount = Net
        - VAT Amount = VAT
        - Total Amount = Total
        - VAT Code = VATCode
        - Currency = Currency
      `;
    case 'suppliers':
      return `
        Extract the following fields from the supplier statement image accurately:
        - Supplier Name = SupplierName
        - Supplier Account = SupplierAccount
        - Date = Date
        - Statement Number = StatementNumber
        - Currency = Currency
      `;
    default:
      throw new Error("Invalid category");
  }
}

const getData = async (req, res) => {
  const { imageUrl, company, category } = req.body;

  try {
    const prompt = getPromptForCategory(category);
    const description = await describeImage(imageUrl, prompt);
    console.log("description is ",description);
    const parsedData = parseDescription(description);
    console.log("after parsing the data ",parsedData);
    const status = "pending";
    const date = parsedData['Date'] ? new Date(parsedData['Date']) : null;
    const vat = parsedData['VAT Amount'] ? parseFloat(parsedData['VAT Amount'].replace(/,/g, '')) : null;
    const net = parsedData['Net Amount'] ? parseFloat(parsedData['Net Amount'].replace(/,/g, '')) : null;
    const total = parsedData['Total Amount'] ? parseFloat(parsedData['Total Amount'].replace(/,/g, '')) : null;
    const vatCode = parsedData['VAT Code'] || '';
    const currency = parsedData['Currency'] || '';
    console.log(total);

    if (category === 'purchase') {
      const purchaseData = {
        status,
        supplierName: parsedData['Supplier Name'] || '',
        supplierAccount: parsedData['Supplier Account'] || '',
        category: parsedData['Category'] || '',
        date,
        vatCode,
        currency,
        net,
        vat,
        total,
        imageURL: imageUrl,
      };

      await addPurchaseToCompany({ params: { companyId: company }, body: purchaseData }, res);
    }

    if (category === 'sales') {
      const saleData = {
        status,
        invoiceNumber: parsedData['Invoice Number'] || '',
        date,
        customerName: parsedData['Customer Name'] || '',
        customerAccount: parsedData['Customer Account'] || '',
        category: parsedData['Category'] || '',
        vatCode,
        currency,
        net,
        vat,
        total,
        imageURL: imageUrl,
        reason: "",
      };

      await addSaleToCompany({ params: { companyId: company }, body: saleData }, res);
    }

    if (category === 'suppliers') {
      const supplierData = {
        date,
        supplierName: parsedData['Supplier Name'] || '',
        supplierAccount: parsedData['Supplier Account'] || '',
        currency,
        dateRange: '',
        status,
        statementNumber: parsedData['Statement Number'] || '',
        imageURL: imageUrl,
        reason: "",
      };

      await addSupplierToCompany({ params: { companyId: company }, body: supplierData }, res);
    }

    res.status(200).send();
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};


module.exports = { getData };
