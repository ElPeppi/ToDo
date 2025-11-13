import { useState } from "react";
import "./UserSelector.css";

interface User {
  id: number;
  name: string;
  email: string;
}

export default function UserSelector({
  users,
  selected,
  setSelected
}: {
  users: User[];
  selected: User[];
  setSelected: (users: User[]) => void;
}) {
  const [query, setQuery] = useState("");

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(query.toLowerCase()) ||
      u.email.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (user: User) => {
    if (!selected.find((s) => s.id === user.id)) {
      setSelected([...selected, user]);
    }
    setQuery("");
  };

  const handleRemove = (id: number) => {
    setSelected(selected.filter((u) => u.id !== id));
  };

  return (
    <div className="user-selector">
      {/* TAGS DE SELECCIONADOS */}
      <div className="selected-tags">
        {selected.map((u) => (
          <span key={u.id} className="tag">
            {u.name}
            <button onClick={() => handleRemove(u.id)}>×</button>
          </span>
        ))}
      </div>

      {/* INPUT */}
      <input
        className="user-input"
        type="text"
        placeholder="Buscar persona por nombre o correo..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {/* RESULTADOS */}
      {query.length > 0 && (
        <div className="dropdown">
          {filtered.length === 0 ? (
            <p className="no-results">No hay coincidencias</p>
          ) : (
            filtered.slice(0, 20).map((u) => (
              <div
                key={u.id}
                className="dropdown-item"
                onClick={() => handleSelect(u)}
              >
                <strong>{u.name}</strong>
                <br />
                <span className="email">{u.email}</span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
