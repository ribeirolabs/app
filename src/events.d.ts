interface Events {
  toast: {
    id?: string;
    type: AlertType;
    message: string;
  };
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
