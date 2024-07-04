import React from 'react';

function EditPage({ data }) {
  return (
    <div className="edit-page">
      <form>
        <div>
          <label>Supplier Name</label>
          <input type="text" value={data.supplierName}  />
        </div>
        <div>
          <label>Supplier A/C</label>
          <input type="text" value={data.supplierAccount}  />
        </div>
        <div>
          <label>Category</label>
          <input type="text" value={data.category}  />
        </div>
        <div>
          <label>Date</label>
          <input type="date" value={new Date(data.date).toISOString().substr(0, 10)}  />
        </div>
        <div>
          <label>Due Date</label>
          <input type="date" value={new Date(data.date).toISOString().substr(0, 10)}  />
        </div>
        <div>
          <label>Description</label>
          <input type="text" value={data.reason} />
        </div>
        <div>
          <label>Net</label>
          <input type="number" value={data.net}  />
        </div>
        <div>
          <label>VAT</label>
          <input type="number" value={data.vat}  />
        </div>
        <div>
          <label>VAT Code</label>
          <input type="text" value={data.vatCode}  />
        </div>
        <div>
          <label>Total</label>
          <input type="number" value={data.total}  />
        </div>
      </form>
      <div className="buttons">
        <button>Processing</button>
        <button>Reject</button>
        <button>Inbox </button>
      </div>
    </div>
  );
}

export default EditPage;
