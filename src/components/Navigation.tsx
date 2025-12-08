import {
  FiSun,
  FiDatabase,
  FiShield,
  FiFileText,
} from "react-icons/fi";
import { RiRobot3Fill } from "react-icons/ri";
import { IoMenuSharp } from "react-icons/io5";

const Navigation = () => {

  const items = [
    { label: "Thème", icon: <FiSun /> },
    { label: "Gestion des données", icon: <FiDatabase /> },
    { label: "Confidentialité", icon: <FiShield /> },
    { label: "Mentions légales", icon: <FiFileText /> },
  ];

  return (
    <aside className="navigation" aria-label="Menu latéral">
      <div className="nav-header">
        <div className="logo" aria-hidden="true">
          <RiRobot3Fill />
        </div>
        <div className="menu-icon" aria-hidden="true">
          <IoMenuSharp />
        </div>
      </div>

      <nav>
        {items.map((item) => (
          <button
            key={item.label}
            type="button"
            className="nav-item"
            aria-label={item.label}
          >
            <span className="icon">{item.icon}</span>
            <span className="text">{item.label}</span>
          </button>
        ))}
      </nav>

    </aside>
  );
};

export default Navigation;
