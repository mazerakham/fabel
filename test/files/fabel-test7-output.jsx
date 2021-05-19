import { React } from "/ender-react.mjs";

function TestForStandaloneAttributes() {
  return React.createElement(
    "div",
    {
      "data-this-attribute-should-work": true,
      className: "blah",
    },
    React.createElement("input", {
      type: "text",
      required: true,
    })
  );
}

export default TestForStandaloneAttributes;
