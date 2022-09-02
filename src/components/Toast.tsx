import { PropsWithChildren, useCallback, useState } from "react";
import { useEvent } from "@ribeirolabs/events/react";
import { Alert, AlertProps } from "./Alert";
import { dispatchCustomEvent } from "@ribeirolabs/events";

type ToastWithId = Pick<AlertProps, "type"> & { id: string; message: string };

const TOAST_TIMEOUT = 3000;

export const addToast = (message: string, type: AlertType, id?: string) => {
  dispatchCustomEvent("toast", {
    id,
    message,
    type,
  });
};

const randomId = () => crypto.randomUUID();

export const ToastProvider = ({ children }: PropsWithChildren) => {
  const [toasts, setToasts] = useState<ToastWithId[]>([]);

  const remove = useCallback((id: string) => {
    setToasts((toasts) => toasts.filter((toast) => toast.id !== id));
  }, []);

  const add = useCallback(
    (toast: ToastWithId) => {
      remove(toast.id);

      setToasts((toasts) => toasts.concat(toast));
    },
    [remove]
  );

  useEvent(
    "toast",
    useCallback(
      (e) => {
        const id = e.detail.id ?? randomId();

        setTimeout(() => remove(id), TOAST_TIMEOUT);

        add({
          ...e.detail,
          id,
        });
      },
      [remove, add]
    )
  );

  return (
    <>
      {children}

      <div className="toast top-0 left-0 md:top-auto md:left-auto pointer-events-none">
        {toasts.map(({ id, ...props }) => (
          <Alert key={id} type={props.type} onClick={() => remove(id)}>
            {props.message}
          </Alert>
        ))}
      </div>
    </>
  );
};
