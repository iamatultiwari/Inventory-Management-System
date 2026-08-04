export default function ProductCard({ product }) {
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