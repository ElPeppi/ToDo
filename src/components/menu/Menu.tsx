
import "./Menu.css"
import Item from "./item/Item";

function Menu() {
  return (<>
    <nav>
      <ul>
        <Item title="Tareas" route="/todo"  />
        <Item title="Grupo" route="/group" />
        <Item title="Calendario" route="/calendar" />
        <Item title="Perfil" route="/profile" />
        <Item title="Configuración" route="/settings" />
      </ul>
    </nav>
  </>);
}



export default Menu;