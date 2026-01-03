import { useEffect, useState } from "react";
import { fetchWithAuth } from "../../services/authService";
import type { Group } from "../../interface/GroupInterface";

function Groups({ setPopup }: { setPopup: Function }) {
  const [groups, setGroups] = useState<Group[]>([]);

  useEffect(() => {
    document.documentElement.setAttribute("data-page", "groups");
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const response = await fetchWithAuth("/api/groups");
      const data = await response.json();

      if (response.ok) {
        setGroups(data);
      } else {
        setPopup({ message: "Error al cargar grupos", type: "error" });
      }
    } catch (e) {
      console.error(e);
      setPopup({ message: "Sesión expirada", type: "info" });
    }
  };
  return (<>
    <div className="groups-page">
      <h1>Grupos</h1>
      <div className="groups-list">
        {groups.length === 0 ? ( <p>No hay grupos disponibles.</p> ) : (
          groups.map((group) => (
            <div key={group.id} className="group-item">
              <h2>{group.name}</h2>
              <p>{group.description}</p>
            </div>
          ))
        )}
      </div>
    </div>
  </>);
}
export default Groups;