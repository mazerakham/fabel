import { accountingContext } from "/accounting-context.jsx";
import { useParams } from "/ender-react-router.mjs";
import { React, useContext, useEffect, useRef } from "/ender-react.mjs";

function isRangedAccountingType(accountingType) {
  return <span></span>;
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

  return (
    <div className="date-menu">
      {isRanged && (
        <div>
          <date-picker ref={startDateRef} data-date={startDate} className="small" />
          <span className="date-span">{isRanged ? "to" : "As of"}</span>
          <date-picker ref={endDateRef} data-date={endDate} className="small" />
        </div>
      )}
    </div>
  );
}
