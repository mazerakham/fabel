import { React, ReactDOM, useEffect } from "ender-react.mjs";

function openModal(ModalInner, props) {
  const container = document.createElement("div");
  container.id = "modal";
  document.body.appendChild(container);
  ReactDOM.render(
    React.createElement(
      Modal,
      null,
      React.createElement(ModalInner, {
        closeModal: closeModal,
        ...props,
      })
    ),
    container
  );
}
