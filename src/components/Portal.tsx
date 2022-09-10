import { PropsWithChildren, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

export const Portal = ({ id, children }: PropsWithChildren<{ id: string }>) => {
  const container = useRef<HTMLDivElement>();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const found = document.getElementById(id) as HTMLDivElement;

    if (found) {
      container.current = found;
    } else {
      container.current = document.createElement("div");
      container.current.id = id;
      document.body.appendChild(container.current);
    }

    setReady(container.current != null);
  }, [id]);

  if (!ready) {
    return null;
  }

  return createPortal(children, container.current!, id);
};
