
import "./Menu.css"
import Item from "./item/Item";

function Menu() {
  return (<>
    <nav>
      <ul>
        <Item title="Tareas" route="/todo"  />
        <Item title="Grupo" route="/groups" />
        <Item title="Calendario" route="/calendar" />
        <Item title="Perfil" route="/porfile" />
        <Item title="Configuración" route="/settings" />
      </ul>
    </nav>
  </>);
}



export default Menu;