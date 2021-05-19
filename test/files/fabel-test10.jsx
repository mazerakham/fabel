import "banking/banking.scss";
import { React } from "ender-react.mjs";

function getFieldProps() {}

function renderBankAccounts() {
  return (
    <textarea
      className="small"
      autoComplete="off"
      placeholder="Enter Description for Billback"
      {...getFieldProps("description")}></textarea>
  );
}
renderBankAccounts();
