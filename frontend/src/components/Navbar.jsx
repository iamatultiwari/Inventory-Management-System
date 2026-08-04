export default function Navbar({ onLogout }) {
  return (
    <header>
      <h2>Inventory System</h2>
      <button onClick={onLogout}>Logout</button>
    </header>
  );
}