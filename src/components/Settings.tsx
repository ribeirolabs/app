import { defaultSettings } from "@/app.config";
import { setCookie } from "nookies";
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from "react";

export const SETTINGS_KEY = "@ribeirolabs:settings";

const isDev = process.env.NODE_ENV === "development";

declare global {
  interface AppSettings {}
}

type ValueOrSetter<Key extends keyof AppSettings = keyof AppSettings> =
  | AppSettings[Key]
  | ((current: AppSettings[Key]) => AppSettings[Key]);

type SettingsSetter<Key extends keyof AppSettings = keyof AppSettings> = (
  key: Key,
  value: ValueOrSetter<Key>
) => void;

const SettingsValueContext = createContext<AppSettings>({} as AppSettings);
const SettingsSetContext = createContext<SettingsSetter>(() => void {});

type Action<Key extends keyof AppSettings = keyof AppSettings> = {
  type: "SET";
  key: Key;
  value: ValueOrSetter<Key>;
};

function settingsReducer(settings: AppSettings, action: Action) {
  if (action.type === "SET") {
    const value =
      typeof action.value === "function"
        ? action.value(settings[action.key])
        : action.value;

    return {
      ...settings,
      [action.key]: value,
    };
  }

  return settings;
}

export const SettingsProvider = ({
  children,
  initial,
}: PropsWithChildren<{ initial: AppSettings }>) => {
  const [settings, send] = useReducer(settingsReducer, initial);

  useEffect(() => {
    setCookie(null, SETTINGS_KEY, JSON.stringify(settings));
  }, [settings]);

  const set = useCallback<SettingsSetter>((key, value) => {
    send({
      type: "SET",
      key,
      value,
    });
  }, []);

  return (
    <SettingsValueContext.Provider value={settings}>
      <SettingsSetContext.Provider value={set}>
        {children}
      </SettingsSetContext.Provider>
    </SettingsValueContext.Provider>
  );
};

export function useSettingsValue(key: keyof AppSettings) {
  const settings = useContext(SettingsValueContext);

  if (defaultSettings == null && isDev) {
    throw new Error('Missing "defaultSettings" at src/app.config.js');
  }

  if (key in defaultSettings === false && isDev) {
    throw new Error(`Missing "defaultSettings.${key}" in src/app.config.js`);
  }

  const fallback = defaultSettings[key];
  return settings[key] ?? fallback;
}

export function useSettings(key: keyof AppSettings) {
  const value = useSettingsValue(key);
  const set = useSetSettings(key);

  return [value, set] as const;
}

export function useSetSettings<
  Key extends keyof AppSettings = keyof AppSettings
>(key: Key) {
  const setter = useContext(SettingsSetContext);

  const set = useCallback(
    (value: ValueOrSetter<Key>) => setter(key, value),
    [key, setter]
  );

  return set;
}
