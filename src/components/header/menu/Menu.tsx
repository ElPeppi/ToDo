import styles from "./menu.module.css";
import Item from "./item/Item";
import ThemeToggle from "../ThemeToggle";

function Menu() {
  return (
    <header className={styles.header}>
      <nav className={styles.menu}>
        <ul className={styles.list}>
          <Item title="Tareas" route="/todo" />
          <Item title="Grupos" route="/groups" />
          <Item title="Calendario" route="/calendar" />
        </ul>

        <div className={styles.right}>
          <ThemeToggle />
        </div>

        <div className={styles.profileButton}>
          <div className={styles.profilePic}>
      
          </div>
          <div className={styles.profileOptions}>
            <Item title="Perfil" route="/profile" />
            <Item title="Configuración" route="/settings" />
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Menu;
