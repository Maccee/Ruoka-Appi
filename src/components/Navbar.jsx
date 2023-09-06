import React from "react";
import NavigationItem from "./NavigationItem";

function Navbar() {
  return (
    <nav>
      <ul>
        <NavigationItem to="/" icon="fa-solid fa-utensils">
          Ruuat
        </NavigationItem>
        <NavigationItem to="/stock" icon="fa-solid fa-cubes-stacked">
          Ainekset
        </NavigationItem>
        <NavigationItem to="/recipes" icon="fa-solid fa-book">
          Reseptit
        </NavigationItem>
      </ul>
    </nav>
  );
}

export default Navbar;
