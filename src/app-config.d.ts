interface AppConfig {
  appName: string;
  defaultSettings: AppSettings;
  theme: {
    colors: {
      primary: string;
      secondary: string;
    };
  };
}
