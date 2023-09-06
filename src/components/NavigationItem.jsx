import { NavLink, useMatch } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function NavigationItem({ to, icon, children }) {
  let match = useMatch(to);
  let isActive = !!match;

  return (
    <li>
      <NavLink to={to} className={`nav-link ${isActive ? "active-link" : ""}`}>
        <div className="icon">
          <FontAwesomeIcon icon={icon} />
        </div>
        <span>{children}</span>
      </NavLink>
    </li>
  );
}

export default NavigationItem;
