import { fetchAllProperties } from "/accounting-api.mjs";
import { accountingContext } from "/accounting-context.jsx";
import { React, useContext } from "/ender-react.mjs";
import EnderSearch from "/ender-search.jsx";

function PropertySearchResultAppend(props) {
  return React.createElement("span", null, props.result.type);
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
  return React.createElement(
    "div",
    {
      className: "properties-menu",
    },
    React.createElement(
      "div",
      {
        className: "section property-select-menu",
      },
      React.createElement(EnderSearch, {
        route: "/search",
        placeholder: "Choose properties",
        requestParams: propertySearchParams,
        onResultSelect: handleResultSelect,
        resultAppend: PropertySearchResultAppend,
      }),
      React.createElement(
        "div",
        {
          className: "property-selection",
        },
        React.createElement(
          "button",
          {
            className: "property-selection__btn",
            onClick: selectAllProperties,
          },
          "Select All Properties"
        ),
        React.createElement(
          "span",
          {
            className: "property-selection__slash",
          },
          "/"
        ),
        React.createElement(
          "button",
          {
            className: "property-selection__btn",
            onClick: deselectAllProperties,
          },
          "Select None"
        )
      )
    ),
    React.createElement(
      "div",
      {
        className: "property-tag-list section menu-wrap",
      },
      properties.map(({ id, name }) =>
        React.createElement(
          "div",
          {
            key: id,
            className: "property-tag",
          },
          React.createElement(
            "span",
            {
              className: "property-tag__name",
            },
            name
          ),
          React.createElement(
            "button",
            {
              className: "property-tag__x-btn",
              onClick: () => handleClick(id),
            },
            React.createElement("img", {
              className: "x-img",
              src: "/x.svg",
            })
          )
        )
      )
    )
  );
}
