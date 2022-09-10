interface AppConfig {
  appName: string;
  defaultSettings: AppSettings;
  theme: {
    colors: {
      primary: string;
      secondary: string;
    };
  };
  errors?: Record<import("@trpc/server/rpc").TRPC_ERROR_CODE_KEY, string>;
  translations: {
    sign_in: string;
    sign_out: string;
    back_homepage: string;
    [key: string]: string;
  };
}
