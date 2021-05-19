<Fragment>
  {property.name}
  {unit.isOnAirbnb && <img width="16" height="16" src="/airbnb-logo.svg" className="airbnb" title="Airbnb" />}
  <span>{unit.name}</span>
  <span className="city">
    {address.city}, {address.state} {address.zipcode}
  </span>
</Fragment>