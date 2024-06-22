const Purchase = require('../model/PurchaseModel.js'); // Adjust the path as necessary

const createPurchase = async (req, res) => {
  try {
    

    const newPurchase = await Purchase.create(req.body);

    res.json({ purchase: newPurchase });
  } catch (error) {
    console.error('Error creating purchase:', error);
    res.json({ error: 'Internal Server Error' });
  }
};

const getAllPurchases = async (req, res) => {
  try {
    const purchases = await Purchase.find({});
    res.json({ purchases });
  } catch (error) {
    console.error('Error fetching purchases:', error);
    res.json({ error: 'Internal Server Error' });
  }
};

const getPurchaseById = async (req, res) => {
  try {
    const purchaseId = req.params.id;
    const purchase = await Purchase.findById(purchaseId);

    if (!purchase) {
      return res.json({ error: 'Purchase not found' });
    }

    res.json({ purchase });
  } catch (error) {
    console.error('Error fetching purchase:', error);
    res.json({ error: 'Internal Server Error' });
  }
};

const updatePurchase = async (req, res) => {
  try {
    const purchaseId = req.params.id;
    const {
      status,
      invoiceNumber,
      date,
      supplierName,
      supplierAccount,
      category,
      vatCode,
      currency,
      net,
      vat,
      total,
      imageURL,
      reason
    } = req.body;

    const purchase = await Purchase.findById(purchaseId);
    if (!purchase) {
      return res.json({ error: 'Purchase not found' });
    }

    purchase.status = status;
    purchase.invoiceNumber = invoiceNumber;
    purchase.date = date;
    purchase.supplierName = supplierName;
    
    purchase.supplierAccount = supplierAccount;
    purchase.category = category;
    purchase.vatCode = vatCode;
    purchase.currency = currency;
    purchase.net = net;
    purchase.vat = vat;
    purchase.total = total;
    purchase.imageURL = imageURL;
    purchase.reason = reason;

    await purchase.save();

    res.status(StatusCodes.OK).json({ purchase });
  } catch (error) {
    console.error('Error updating purchase:', error);
    res.json({ error: 'Internal Server Error' });
  }
};

const deletePurchase = async (req, res) => {
  try {
    const purchaseId = req.params.id;
    const purchase = await Purchase.findByIdAndDelete(purchaseId);

    if (!purchase) {
      return res.json({ error: 'Purchase not found' });
    }

    res.json({ message: 'Purchase deleted successfully' });
  } catch (error) {
    console.error('Error deleting purchase:', error);
    res.json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  createPurchase,
  getAllPurchases,
  getPurchaseById,
  updatePurchase,
  deletePurchase,
};
