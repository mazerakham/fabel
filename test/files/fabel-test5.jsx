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

      depositCheck({ leaseId, data: state.values })
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

  return (
    <div>
      <h2>Deposit Check</h2>
      <form {...getFormProps()}>
        <label>Date</label>
        <input type="date" {...getFieldProps("date")} />
        {errors.date && <div className="error-message">{errors.date}</div>}
        <label>Check Number</label>
        <input type="number" autoComplete="off" {...getFieldProps("checkNumber")} />
        {errors.checkNumber && <div className="error-message">{errors.checkNumber}</div>}
        <label>Amount</label>
        <CurrencyInput autoComplete="off" fieldProps={getFieldProps("amount")} />
        {errors.amount && <div className="error-message">{errors.amount}</div>}
        <label>Memo</label>
        <input type="text" autoComplete="off" {...getFieldProps("memo")} />
        {errors.memo && <div className="error-message">{errors.memo}</div>}
        <button type="submit">Deposit Check</button>
      </form>
    </div>
  );
}
