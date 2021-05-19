import { React, useCallback } from "/ender-react.mjs";

const VALID_FIRST = /^[1-9]{1}$/;
const VALID_NEXT = /^[0-9]{1}$/;
const DELETE_KEY_CODE = 8;

const CurrencyInput = ({ name = "", className = "", max = Number.MAX_SAFE_INTEGER, style = {}, fieldProps }) => {
  const val = Math.round(Number(fieldProps.value.replace(/[^0-9.-]+/g, "")) * 100);
  const valueAbsTrunc = Math.trunc(Math.abs(val));

  if (val !== valueAbsTrunc || !Number.isFinite(val / 100) || Number.isNaN(val)) {
    throw new Error(`invalid value property`);
  }

  const handleKeyDown = useCallback(
    (e) => {
      let val = fieldProps.value;

      if (typeof val === "string") {
        val = Number(val.replace(/[^0-9-]+/g, ""));
      }

      const { key, keyCode } = e;

      if (
        (val === 0 && !VALID_FIRST.test(key)) ||
        (val !== 0 && !VALID_NEXT.test(key) && keyCode !== DELETE_KEY_CODE)
      ) {
        return;
      }

      const valueString = val.toString();
      let nextValue;

      if (keyCode !== DELETE_KEY_CODE) {
        const nextValueString = val === 0 ? key : `${valueString}${key}`;
        nextValue = Number.parseInt(nextValueString, 10);
      } else {
        const nextValueString = valueString.slice(0, -1);
        nextValue = nextValueString === "" ? 0 : Number.parseInt(nextValueString, 10);
      }

      if (nextValue > max) {
        return;
      }

      const stringValue = (nextValue / 100).toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });
      const eventForValidation = {
        target: {
          value: stringValue,
        },
      };
      fieldProps.onChange(eventForValidation);
    },
    [max, fieldProps.onChange, fieldProps.value]
  );
  const inputPropsFromFieldProps = { ...fieldProps, onChange: useCallback(() => {}, []) };
  return React.createElement("input", {
    name: name,
    className: className,
    inputMode: "numeric",
    autoComplete: "off",
    onKeyDown: handleKeyDown,
    style: style,
    ...inputPropsFromFieldProps,
  });
};

export default CurrencyInput;
