interface Events {
  toast: {
    id?: string;
    type: AlertType;
    message: string;
  };
  sidebar: "open" | "close";
  modal:
    | {
        id: string;
        action: "open";
        data?: any;
      }
    | {
        id: string;
        action: "close";
      };
}
