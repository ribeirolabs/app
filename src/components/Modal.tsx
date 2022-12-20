import { translations } from "@/app.config";
import { dispatchCustomEvent } from "@ribeirolabs/events";
import { useEvent } from "@ribeirolabs/events/react";
import { useState, useCallback, PropsWithChildren, useEffect } from "react";
import { Portal } from "./Portal";

export const Modal = ({
  id,
  children,
  onEvent = () => void {},
}: PropsWithChildren<{
  id: string;
  onEvent?: (detail: Events["modal"]) => void;
}>) => {
  const [opened, setOpened] = useState(false);

  useModalEvent(
    id,
    useCallback(
      (detail) => {
        const isOpen = detail.action === "open";

        setOpened(isOpen);
        onEvent(detail);
      },
      [onEvent]
    )
  );

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.code === "Escape") {
        setOpened(false);
      }
    }

    if (opened) {
      window.addEventListener("keydown", onKeyDown);
    } else {
      window.removeEventListener("keydown", onKeyDown);
    }
  }, [opened]);

  return (
    <Portal id={id}>
      <div role="dialog" className="modal" data-open={opened}>
        <div
          className="fixed top-0 left-0 w-full h-full cursor-pointer"
          onClick={() => closeModal(id)}
        ></div>
        <div className="modal-box md:max-w-2xl">{opened ? children : null}</div>
      </div>
    </Portal>
  );
};

export const ModalCancelButton = ({
  modalId,
  label,
  className,
}: {
  modalId: string;
  label?: string;
  className?: string;
}) => {
  return (
    <button
      className={`btn btn-ghost ${className}`}
      onClick={() => closeModal(modalId)}
      type="button"
    >
      {label ?? translations.cancel ?? "cancel"}
    </button>
  );
};

export const useModalEvent = (
  id: string,
  onEvent: (detail: Events["modal"]) => void
) => {
  useEvent(
    "modal",
    useCallback(
      (e) => {
        if (e.detail.id !== id) {
          return;
        }

        onEvent(e.detail);
      },
      [id, onEvent]
    )
  );
};

export const openModal = (id: string, data?: any) =>
  dispatchCustomEvent("modal", {
    id,
    action: "open",
    data,
  });

export const closeModal = (id: string) =>
  dispatchCustomEvent("modal", {
    id,
    action: "close",
  });
