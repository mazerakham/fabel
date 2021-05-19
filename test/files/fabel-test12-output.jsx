React.createElement(Fragment, null, property.name, unit.isOnAirbnb && React.createElement("img", {
  width: "16",
  height: "16",
  src: "/airbnb-logo.svg",
  className: "airbnb",
  title: "Airbnb"
}), React.createElement("span", null, unit.name), React.createElement("span", {
  className: "city"
}, address.city, ", ", address.state, " ", address.zipcode));

