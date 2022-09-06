interface AppConfig {
  appName: string;
  defaultSettings: AppSettings;
  theme: {
    colors: {
      primary: string;
      secondary: string;
    };
  };
  errors: Record<import("@trpc/server/rpc").TRPC_ERROR_CODE_KEY, string>;
  translations: {
    [key: string]: string;
  };
}
