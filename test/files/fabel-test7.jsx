import { React } from "/ender-react.mjs";

function TestForStandaloneAttributes() {
  return (
    <div data-this-attribute-should-work className="blah">
      <input type="text" required />
    </div>
  );
}

export default TestForStandaloneAttributes;
