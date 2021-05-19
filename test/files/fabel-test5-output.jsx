import CurrencyInput from "/components/currency-input.jsx";
import { useValidation } from "/ender-custom-hooks.mjs";
import { React } from "/ender-react.mjs";
import { depositCheck, fetchLedgerByLeaseId } from "/ledger-api.mjs";

export default function DepositCheckModal(props) {
  const { leaseId, closeModal, dispatch } = props;
  const { getFieldProps, getFormProps, errors } = useValidation({
    fields: {
      date: {
        isRequired: "Date is required",
      },
      checkNumber: {
        isRequired: "Check number is required",
      },
      amount: {
        isGreaterThan: {
          value: 0,
          message: "Amount must be greater than 0",
        },
        initialValue: "$0.00",
      },
      memo: {
        isRequired: "Memo is required",
      },
    },
    onSubmit: (state) => {
      if (state.hasErrors) {
        return;
      }

      depositCheck({
        leaseId,
        data: state.values,
      })
        .then(() => {
          return fetchLedgerByLeaseId(leaseId);
        })
        .then((data) => {
          dispatch({
            type: "SET_LEDGER",
            payload: data,
          });
          closeModal();
        });
    },
  });
  return React.createElement(
    "div",
    null,
    React.createElement("h2", null, "Deposit Check"),
    React.createElement(
      "form",
      { ...getFormProps() },
      React.createElement("label", null, "Date"),
      React.createElement("input", {
        type: "date",
        ...getFieldProps("date"),
      }),
      errors.date &&
        React.createElement(
          "div",
          {
            className: "error-message",
          },
          errors.date
        ),
      React.createElement("label", null, "Check Number"),
      React.createElement("input", {
        type: "number",
        autoComplete: "off",
        ...getFieldProps("checkNumber"),
      }),
      errors.checkNumber &&
        React.createElement(
          "div",
          {
            className: "error-message",
          },
          errors.checkNumber
        ),
      React.createElement("label", null, "Amount"),
      React.createElement(CurrencyInput, {
        autoComplete: "off",
        fieldProps: getFieldProps("amount"),
      }),
      errors.amount &&
        React.createElement(
          "div",
          {
            className: "error-message",
          },
          errors.amount
        ),
      React.createElement("label", null, "Memo"),
      React.createElement("input", {
        type: "text",
        autoComplete: "off",
        ...getFieldProps("memo"),
      }),
      errors.memo &&
        React.createElement(
          "div",
          {
            className: "error-message",
          },
          errors.memo
        ),
      React.createElement(
        "button",
        {
          type: "submit",
        },
        "Deposit Check"
      )
    )
  );
}
