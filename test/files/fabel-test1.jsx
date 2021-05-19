import BalanceSheet from "/accounting-balance-sheet.mjs";
import { AccountingProvider } from "/accounting-context.jsx";
import GeneralLedger from "/accounting-general-ledger.mjs";
import AccountingHeader from "/accounting-header-react.mjs";
import { Route, Router, Switch } from "/ender-react-router.mjs";
import { React, ReactDOM } from "/ender-react.mjs";

function AccountingApp() {
  return (
    <AccountingProvider>
      <Router>
        <Switch>
          <Route path="/accounting/:accountingType">
            <AccountingHeader />
          </Route>
        </Switch>
        <Switch>
          <Route path="/accounting/balance-sheet">
            <BalanceSheet />
          </Route>
          <Route path="/accounting/general-ledger">
            <GeneralLedger />
          </Route>
        </Switch>
      </Router>
    </AccountingProvider>
  );
}

ReactDOM.render(<AccountingApp />, document.querySelector("[data-accounting-react]"));
