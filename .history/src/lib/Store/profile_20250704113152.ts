export interface EditResult {
  property: string;
  value: string;
}

export interface SettingsPage {
  [key: string]: boolean | string | number;
}
export const settingsStore = writable<SettingsPage>({});
