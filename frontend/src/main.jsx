import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';

const API_BASE = 'http://localhost:5000/api';

function Navbar({ onLogout }) {
  return (
    <header>
      <h2>Inventory System</h2>
      <button onClick={onLogout}>Logout</button>
    </header>
  );
}

function LoginForm({ onLogin, error }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(username, password);
  };

  return (
    <div>
      <h2>Login</h2>
      {error && <p>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username: </label>
          <input 
            type="text" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            required 
          />
        </div>
        <div>
          <label>Password: </label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
        </div>
        <button type="submit">Sign In</button>
      </form>
    </div>
  );
}

function ProductForm({ onAddProduct }) {
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

function ProductCard({ product }) {
  const isLowStock = product.quantity < 10;

  return (
    <div>
      {isLowStock && <span>[LOW STOCK] </span>}
      <h4>{product.name}</h4>
      <p>SKU: {product.sku}</p>
      <p>Category: {product.category}</p>
      <p>Price: ${product.price}</p>
      <p>Quantity: {product.quantity}</p>
    </div>
  );
}

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [products, setProducts] = useState([]);
  const [filterLowStock, setFilterLowStock] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  useEffect(() => {
    if (token) fetchProducts();
  }, [token, filterLowStock]);

  const handleLogin = async (username, password) => {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.token);
        setToken(data.token);
        setFeedback({ type: '', message: '' });
      } else {
        setFeedback({ type: 'error', message: data.message });
      }
    } catch {
      setFeedback({ type: 'error', message: 'Failed to connect to server' });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken('');
    setProducts([]);
  };

  const fetchProducts = async () => {
    const endpoint = filterLowStock ? '/products/low-stock' : '/products';
    try {
      const res = await fetch(`${API_BASE}${endpoint}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setProducts(data);
    } catch (err) {
      console.error('Fetch error:', err);
    }
  };

  const handleAddProduct = async (formData) => {
    setFeedback({ type: '', message: '' });
    try {
      const res = await fetch(`${API_BASE}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          price: Number(formData.price),
          quantity: Number(formData.quantity)
        })
      });
      const data = await res.json();
      if (res.ok) {
        setFeedback({ type: 'success', message: 'Product created successfully!' });
        fetchProducts();
      } else {
        setFeedback({ type: 'error', message: data.message || 'Creation failed' });
      }
    } catch {
      setFeedback({ type: 'error', message: 'Error adding product' });
    }
  };

  if (!token) return <LoginForm onLogin={handleLogin} error={feedback.message} />;

  return (
    <div>
      <Navbar onLogout={handleLogout} />

      {feedback.message && <p>{feedback.message}</p>}

      <ProductForm onAddProduct={handleAddProduct} />

      <hr />

      <section>
        <div>
          <h3>Inventory ({products.length})</h3>
          <button onClick={() => setFilterLowStock(!filterLowStock)}>
            {filterLowStock ? 'Show All Products' : 'Filter Low Stock (<10)'}
          </button>
        </div>

        <div>
          {products.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}