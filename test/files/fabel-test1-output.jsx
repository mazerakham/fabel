import BalanceSheet from "/accounting-balance-sheet.mjs";
import { AccountingProvider } from "/accounting-context.jsx";
import GeneralLedger from "/accounting-general-ledger.mjs";
import AccountingHeader from "/accounting-header-react.mjs";
import { Route, Router, Switch } from "/ender-react-router.mjs";
import { React, ReactDOM } from "/ender-react.mjs";

function AccountingApp() {
  return React.createElement(
    AccountingProvider,
    null,
    React.createElement(
      Router,
      null,
      React.createElement(
        Switch,
        null,
        React.createElement(
          Route,
          {
            path: "/accounting/:accountingType",
          },
          React.createElement(AccountingHeader, null)
        )
      ),
      React.createElement(
        Switch,
        null,
        React.createElement(
          Route,
          {
            path: "/accounting/balance-sheet",
          },
          React.createElement(BalanceSheet, null)
        ),
        React.createElement(
          Route,
          {
            path: "/accounting/general-ledger",
          },
          React.createElement(GeneralLedger, null)
        )
      )
    )
  );
}

ReactDOM.render(React.createElement(AccountingApp, null), document.querySelector("[data-accounting-react]"));
