import { accountingContext } from "/accounting-context.jsx";
import { useParams } from "/ender-react-router.mjs";
import { React, useContext, useEffect, useRef } from "/ender-react.mjs";

function isRangedAccountingType(accountingType) {
  return React.createElement("span", null);
}

export default function AccountingDateMenu(props) {
  const { accountingType } = useParams();
  const { startDate, endDate, dispatch } = useContext(accountingContext);
  const startDateRef = useRef();
  const endDateRef = useRef();

  const watchDatepickerChanges = () => {
    $(endDateRef.current).on("datechange", (e, date) => {
      dispatch({
        type: "UPDATE_END_DATE",
        payload: date,
      });
    });
    $(startDateRef.current).on("datechange", (e, date) => {
      dispatch({
        type: "UPDATE_START_DATE",
        payload: date,
      });
    });
  };

  useEffect(() => {
    watchDatepickerChanges();
  }, [accountingType]);
  const isRanged = isRangedAccountingType(accountingType);
  return React.createElement(
    "div",
    {
      className: "date-menu",
    },
    isRanged &&
      React.createElement(
        "div",
        null,
        React.createElement("date-picker", {
          ref: startDateRef,
          "data-date": startDate,
          className: "small",
        }),
        React.createElement(
          "span",
          {
            className: "date-span",
          },
          isRanged ? "to" : "As of"
        ),
        React.createElement("date-picker", {
          ref: endDateRef,
          "data-date": endDate,
          className: "small",
        })
      )
  );
}
