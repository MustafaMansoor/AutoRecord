const Sales = require('../model/SalesModel'); // Adjust the path as necessary

const createSale = async (req, res) => {
  try {
    const {
      status,
      invoiceNumber,
      date,
      customerName,
      customerAccount,
      category,
      vatCode,
      currency,
      net,
      vat,
      total,
      imageLink,
      reason
    } = req.body;

    const newSale = await Sales.create({
      status,
      invoiceNumber,
      date,
      customerName,
      customerAccount,
      category,
      vatCode,
      currency,
      net,
      vat,
      total,
      imageLink,
      reason
    });

    res.status(201).json({ sale: newSale });
  } catch (error) {
    console.error('Error creating sale:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getAllSales = async (req, res) => {
  try {
    const sales = await Sales.find({});
    res.json({ sales });
  } catch (error) {
    console.error('Error fetching sales:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getSaleById = async (req, res) => {
  try {
    const saleId = req.params.id;
    const sale = await Sales.findById(saleId);

    if (!sale) {
      return res.status(404).json({ error: 'Sale not found' });
    }

    res.json({ sale });
  } catch (error) {
    console.error('Error fetching sale:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const updateSale = async (req, res) => {
  try {
    const saleId = req.params.id;
    const {
      status,
      invoiceNumber,
      date,
      customerName,
      customerAccount,
      category,
      vatCode,
      currency,
      net,
      vat,
      total,
      imageLink,
      reason
    } = req.body;

    const sale = await Sales.findByIdAndUpdate(saleId, {
      status,
      invoiceNumber,
      date,
      customerName,
      customerAccount,
      category,
      vatCode,
      currency,
      net,
      vat,
      total,
      imageLink,
      reason
    }, { new: true });

    if (!sale) {
      return res.status(404).json({ error: 'Sale not found' });
    }

    res.json({ sale });
  } catch (error) {
    console.error('Error updating sale:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const deleteSale = async (req, res) => {
  try {
    const saleId = req.params.id;
    const sale = await Sales.findByIdAndDelete(saleId);

    if (!sale) {
      return res.status(404).json({ error: 'Sale not found' });
    }

    res.json({ message: 'Sale deleted successfully' });
  } catch (error) {
    console.error('Error deleting sale:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  createSale,
  getAllSales,
  getSaleById,
  updateSale,
  deleteSale,
};
