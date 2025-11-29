import { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE } from "./config";

function App() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    prodname: "",
    qty: "",
    price: "",
    status: "",
  });
  const [editingId, setEditingId] = useState(null);

  const fetchAll = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(`${API_BASE}/inventories`);
      setItems(res.data || []);
    } catch (e) {
      setError(e.message || "Failed to load");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const resetForm = () => {
    setForm({ prodname: "", qty: "", price: "", status: "" });
    setEditingId(null);
  };

  const createItem = async () => {
    setError("");
    try {
      const payload = {
        prodname: form.prodname.trim(),
        qty: Number(form.qty),
        price: Number(form.price),
        status: form.status.trim(),
      };
      await axios.post(`${API_BASE}/inventory`, payload);
      await fetchAll();
      resetForm();
    } catch (e) {
      setError(e.response?.data?.error || e.message);
    }
  };

  const startEdit = (item) => {
    setEditingId(item._id);
    setForm({
      prodname: item.prodname,
      qty: item.qty,
      price: item.price,
      status: item.status,
    });
  };

  const updateItem = async () => {
    if (!editingId) return;
    setError("");
    try {
      const payload = {
        _id: editingId,
        prodname: form.prodname.trim(),
        qty: Number(form.qty),
        price: Number(form.price),
        status: form.status.trim(),
      };
      await axios.put(`${API_BASE}/inventory`, payload);
      await fetchAll();
      resetForm();
    } catch (e) {
      setError(e.response?.data?.error || e.message);
    }
  };

  const deleteItem = async (id) => {
    setError("");
    try {
      await axios.delete(`${API_BASE}/inventory/${id}`);
      await fetchAll();
    } catch (e) {
      setError(e.response?.data?.error || e.message);
    }
  };

  return (
    <div
      style={{
        maxWidth: 900,
        margin: "20px auto",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <h1>Inventory Manager</h1>

      {error && (
        <div
          style={{
            color: "white",
            background: "#c33",
            padding: "8px",
            marginBottom: "10px",
          }}
        >
          {error}
        </div>
      )}

      <section
        style={{
          border: "1px solid #ddd",
          padding: "12px",
          borderRadius: 8,
          marginBottom: 20,
        }}
      >
        <h2>{editingId ? "Edit inventory" : "Create inventory"}</h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 10,
            marginBottom: 10,
          }}
        >
          <input
            name="prodname"
            placeholder="prodname"
            value={form.prodname}
            onChange={onChange}
          />
          <input
            name="qty"
            type="number"
            placeholder="qty"
            value={form.qty}
            onChange={onChange}
          />
          <input
            name="price"
            type="number"
            placeholder="price"
            value={form.price}
            onChange={onChange}
          />
          <input
            name="status"
            placeholder="status (S/T/R)"
            value={form.status}
            onChange={onChange}
          />
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          {!editingId ? (
            <button onClick={createItem}>Create</button>
          ) : (
            <>
              <button onClick={updateItem}>Update</button>
              <button onClick={resetForm} style={{ background: "#eee" }}>
                Cancel
              </button>
            </>
          )}
        </div>
      </section>

      <section>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h2>All inventories</h2>
          <button onClick={fetchAll} disabled={loading}>
            {loading ? "Loading…" : "Refresh"}
          </button>
        </div>

        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ borderBottom: "1px solid #ddd", textAlign: "left" }}>
                prodname
              </th>
              <th
                style={{ borderBottom: "1px solid #ddd", textAlign: "right" }}
              >
                qty
              </th>
              <th
                style={{ borderBottom: "1px solid #ddd", textAlign: "right" }}
              >
                price
              </th>
              <th style={{ borderBottom: "1px solid #ddd", textAlign: "left" }}>
                status
              </th>
              <th style={{ borderBottom: "1px solid #ddd" }}>actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((it) => (
              <tr key={it._id}>
                <td style={{ borderBottom: "1px solid #eee" }}>
                  {it.prodname}
                </td>
                <td
                  style={{ borderBottom: "1px solid #eee", textAlign: "right" }}
                >
                  {it.qty}
                </td>
                <td
                  style={{ borderBottom: "1px solid #eee", textAlign: "right" }}
                >
                  ${it.price}
                </td>
                <td style={{ borderBottom: "1px solid #eee" }}>{it.status}</td>
                <td style={{ borderBottom: "1px solid #eee" }}>
                  <button
                    onClick={() => startEdit(it)}
                    style={{ marginRight: 8 }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteItem(it._id)}
                    style={{ background: "#fce" }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td
                  colSpan="5"
                  style={{ padding: 12, textAlign: "center", color: "#777" }}
                >
                  No items found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}

export default App;
