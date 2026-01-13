import { useEffect, useState } from "react";
import { fetchWithAuth } from "../../services/authService";
import type { GroupInterface } from "../../interface/GroupInterface";
import { handleLogout } from "../../utils/HandelLogout";
//import GroupCard from "../../components/group/GroupCard";


function Groups({ setPopup }: { setPopup: Function }) {
  const [groups, setGroups] = useState<GroupInterface[]>([]);

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
      handleLogout();
    }
  };
  return (<>
    <div className="groups-page">
      <h1>Grupos</h1>
      <div className="groups-list">
        {groups.length === 0 ? ( <p>No hay grupos disponibles.</p> ) : (
          //groups.map((group) => (
            //<GroupCard key={group.id} task={group} groups={groups} />
          //))
          <p> debugin</p>
        )}
      </div>
    </div>
  </>);
}
export default Groups;