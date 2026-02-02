import { useEffect, useState } from "react";
import { fetchWithAuth } from "../../services/authService";
import type { GroupInterface } from "../../interface/GroupInterface";
import { handleLogout } from "../../utils/HandelLogout";
import GroupCard from "../../components/group/GroupCard";
import "./groups.css";
import PopupEditGroup from "../../components/pop-ups/group/editGorup/PopupEditGroup";

function Groups({ setPopup }: { setPopup: Function }) {
  const [groups, setGroups] = useState<GroupInterface[]>([]);
  const [showEditGroup, setShowEditGroup] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<GroupInterface | null>(null);

  useEffect(() => {
    document.documentElement.setAttribute("data-page", "groups");
    fetchGroups();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchGroups = async () => {
    try {
      const response = await fetchWithAuth("/api/groups");
      const data = await response.json();

      console.log("Fetched groups:", data);

      if (!response.ok) {
        setPopup({ message: "Error al cargar grupos", type: "error" });
        return;
      }

      const groupsFromApi: GroupInterface[] = data.groups ?? [];
      const tasksFromApi: any[] = data.tasks ?? [];

      // ✅ Calcular task_count SIN mutar y usando data.groups (no el estado viejo)
      const groupsWithCount: GroupInterface[] = groupsFromApi.map((g) => {
        const count = tasksFromApi.filter((t) => t.group_id === g.id).length;
        console.log(`Group ${g.name} has ${count} tasks.`);
        return { ...g, task_count: count };
      });

      setGroups(groupsWithCount);

      // ✅ Si tenías un grupo seleccionado, lo refrescamos con la versión nueva
      if (selectedGroup) {
        const updatedSelected =
          groupsWithCount.find((g) => g.id === selectedGroup.id) ?? null;
        setSelectedGroup(updatedSelected);
      }
    } catch (e) {
      console.error(e);
      setPopup({ message: "Sesión expirada", type: "info" });
      handleLogout();
    }
  };

  const removeGroup = async (groupId: number) => {
    try {
      const response = await fetchWithAuth(`/api/groups/${groupId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setPopup({ message: "Grupo eliminado", type: "success" });
        fetchGroups();
      } else {
        setPopup({ message: "Error al eliminar grupo", type: "error" });
      }
    } catch (e) {
      console.error(e);
      setPopup({ message: "Sesión expirada", type: "info" });
      handleLogout();
    }
  };

  const openEdit = (group: GroupInterface) => {
    setSelectedGroup(group);
    setShowEditGroup(true);
  };

  return (
    <div className="groups-page">
      <h1>Grupos</h1>

      {showEditGroup && selectedGroup && (
        <PopupEditGroup
          onClose={() => {
            setShowEditGroup(false);
            setSelectedGroup(null);
          }}
          setPopup={setPopup}
          onGroupUpdated={fetchGroups}
          group={selectedGroup}
        />
      )}

      <div className="groups-list">
        {groups.length === 0 ? (
          <p>No hay grupos disponibles.</p>
        ) : (
          groups.map((group) => (
            <li key={group.id} className="group-item">
              <GroupCard
              group={group}
              onEdit={() => openEdit(group)}
              onDelete={() => removeGroup(group.id)}
              onAddMembers={() => {
                setPopup({ message: `Add members: ${group.name}`, type: "info" });
              }}
              onDeleteMembers={() => {
                setPopup({
                  message: `Delete members: ${group.name}`,
                  type: "info",
                });
              }}
            />
            </li>
          ))
        )}
      </div>
    </div>
  );
}

export default Groups;
