import { fetchAllProperties } from "/accounting-api.mjs";
import { accountingContext } from "/accounting-context.jsx";
import { React, useContext } from "/ender-react.mjs";
import EnderSearch from "/ender-search.jsx";

function PropertySearchResultAppend(props) {
  return <span>{props.result.type}</span>;
}

export default function AccountingPropertiesMenu(props) {
  const { properties, dispatch } = useContext(accountingContext);
  const handleClick = (id) => {
    dispatch({
      type: "REMOVE_PROPERTY",
      payload: id,
    });
  };

  const handleResultSelect = (result) => {
    dispatch({
      type: "ADD_PROPERTIES",
      payload: [
        {
          id: result.id,
          name: result.name,
        },
      ],
    });
  };

  const selectAllProperties = () => {
    fetchAllProperties().then((properties) => {
      dispatch({
        type: "UPDATE_PROPERTIES",
        payload: properties,
      });
    });
  };

  const deselectAllProperties = () => {
    dispatch({
      type: "UPDATE_PROPERTIES",
      payload: [],
    });
  };

  const propertyIds = properties.map(({ id }) => id);
  const propertySearchParams = {
    excludeIds: propertyIds,
    resultsOnEmpty: true,
    types: ["property"],
  };

  return (
    <div className="properties-menu">
      <div className="section property-select-menu">
        <EnderSearch
          route="/search"
          placeholder="Choose properties"
          requestParams={propertySearchParams}
          onResultSelect={handleResultSelect}
          resultAppend={PropertySearchResultAppend}
        />
        <div className="property-selection">
          <button className="property-selection__btn" onClick={selectAllProperties}>
            Select All Properties
          </button>
          <span className="property-selection__slash">/</span>
          <button className="property-selection__btn" onClick={deselectAllProperties}>
            Select None
          </button>
        </div>
      </div>
      <div className="property-tag-list section menu-wrap">
        {properties.map(({ id, name }) => (
          <div key={id} className="property-tag">
            <span className="property-tag__name">{name}</span>
            <button className="property-tag__x-btn" onClick={() => handleClick(id)}>
              <img className="x-img" src={"/x.svg"} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
