import "banking/banking.scss";
import { React } from "ender-react.mjs";

function getFieldProps() {}

function renderBankAccounts() {
  return React.createElement("textarea", {
    className: "small",
    autoComplete: "off",
    placeholder: "Enter Description for Billback",
    ...getFieldProps("description"),
  });
}

renderBankAccounts();
