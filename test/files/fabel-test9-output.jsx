import { getSelectedProperties, initAccountingHeader } from "accounting-header.mjs";
import "banking/banking.scss";
import { React, ReactDOM } from "ender-react.mjs";
import { fail } from "ender.mjs";

$(`a[href="/accounting/banking"]`).addClass("selected");

if (window.location.pathname === "/accounting/banking") {
  initAccountingHeader(renderBankAccounts);
} else {
  initAccountingHeader(() => window.reload);
}

function renderBankAccounts() {
  const $template = $("#t-bank-account");
  $template.siblings().empty();
  $.post(
    "/getBankAccounts",
    JSON.stringify({
      propertyIds: getSelectedProperties(),
    })
  )
    .done((json) => {
      ReactDOM.render(
        React.createElement(
          "div",
          {
            className: "menu-wrap",
          },
          json.accounts.map((account) =>
            React.createElement(
              "a",
              {
                href: "/accounting/bank-accounts/" + account.id,
                className: "bank-account",
                key: account.id,
              },
              "hi"
            )
          )
        ),
        document.querySelector("bank-accounts")
      );
    })
    .fail(fail);
}
