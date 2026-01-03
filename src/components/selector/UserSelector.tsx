import { useState, useEffect, useRef } from "react";
import "./userSelector.css";
import { fetchWithAuth } from "../../services/authService";
import type { User } from "../../interface/UserInterface";

export default function UserSelector({
  selected,
  setSelected
}: {
  selected: User[];
  setSelected: (users: User[]) => void;
}) {
  const [query, setQuery] = useState("");
  const [remoteUsers, setRemoteUsers] = useState<User[]>([]);
  const lastInitial = useRef("");

  // 🔵 Pedir usuarios SOLO cuando se escribe la primera letra
  useEffect(() => {
    const initial = query.trim().charAt(0)?.toLowerCase();

    if (query.length === 1) {
      // Si se cambió la primera letra → nueva consulta
      if (initial !== lastInitial.current) {
        fetchUsers(initial);
        lastInitial.current = initial;
      }
    }
  }, [query]);

  // 🔵 Función que consulta al backend
  const fetchUsers = async (initial: string) => {
  if (!initial) return;

  try {
    const response = await fetchWithAuth(
      `/api/users/search?startsWith=${encodeURIComponent(initial)}`,
      { method: "GET" }
    );
    
    const data = await response.json();
    setRemoteUsers(data);
  } catch (e) {
    console.error(e);
    setRemoteUsers([]);
  }
};


  // 🔵 Filtrado local sobre remoteUsers
  const filtered = remoteUsers.filter(
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

      {/* TAGS */}
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
        placeholder="Buscar persona..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {/* DROPDOWN */}
      {query.length > 0 && (
        <div className="dropdown">
          {filtered.length === 0 ? (
            <p className="no-results">No hay coincidencias</p>
          ) : (
            filtered.slice(0, 7).map((u) => (
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
