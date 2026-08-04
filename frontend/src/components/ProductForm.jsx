import { useState } from 'react';

export default function ProductForm({ onAddProduct }) {
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    price: '',
    quantity: '',
    category: 'Electronics'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddProduct(formData);
    setFormData({ name: '', sku: '', price: '', quantity: '', category: 'Electronics' });
  };

  return (
    <section>
      <h3>Add New Product</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <input 
            type="text" 
            placeholder="Name" 
            value={formData.name} 
            onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
            required 
          />
        </div>
        <div>
          <input 
            type="text" 
            placeholder="SKU" 
            value={formData.sku} 
            onChange={(e) => setFormData({ ...formData, sku: e.target.value })} 
            required 
          />
        </div>
        <div>
          <input 
            type="number" 
            step="0.01" 
            placeholder="Price" 
            value={formData.price} 
            onChange={(e) => setFormData({ ...formData, price: e.target.value })} 
            required 
          />
        </div>
        <div>
          <input 
            type="number" 
            placeholder="Quantity" 
            value={formData.quantity} 
            onChange={(e) => setFormData({ ...formData, quantity: e.target.value })} 
            required 
          />
        </div>
        <div>
          <select 
            value={formData.category} 
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          >
            <option value="Electronics">Electronics</option>
            <option value="Grocery">Grocery</option>
            <option value="Clothing">Clothing</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <button type="submit">Add Product</button>
      </form>
    </section>
  );
}