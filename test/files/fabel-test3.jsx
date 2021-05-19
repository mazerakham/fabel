import { fetchCategories } from "/accounting-api.mjs";
import { accountingContext } from "/accounting-context.jsx";
import "/bowser.js";
import CategoryTable from "/category-table-general-ledger.mjs";
import { React, useContext, useEffect, useState } from "/ender-react.mjs";

export default function GenerlLedger() {
  const [state, setState] = useState({
    isFetching: true,
    reports: [],
  });
  const { properties, endDate, startDate } = useContext(accountingContext);

  const fetchData = () => {
    const propertyIds = properties.map(({ id }) => id);
    fetchCategories({
      categoryTypeFilter: "GENERAL_LEDGER",
      propertyIds,
      timeInterval: {
        start: startDate,
        end: endDate,
      },
    }).then(({ reports }) => {
      setState({ ...state, isFetching: false, reports });
    });
  };

  useEffect(() => {
    document.title = "General Ledger - Ender";
    document.querySelector("[data-accounting-react]").setAttribute("data-report-type", "general-ledger");
  }, []);

  useEffect(() => {
    if (!properties.length) {
      setState({ ...state, isFetching: false, reports: [] });
      return;
    }
    fetchData();
  }, [properties, endDate, startDate]);

  const { reports, isFetching } = state;

  return isFetching ? (
    <div>Loading...</div>
  ) : (
    reports.map((propertyReport) => (
      <div key={propertyReport}>
        <h2 className="section">{propertyReport.propertyName}</h2>
        <div className="property section">
          {propertyReport.report.map((report) => (
            <CategoryTable key={report} report={report} depth={0} propertyId={propertyReport.propertyId} />
          ))}
        </div>
      </div>
    ))
  );
}
