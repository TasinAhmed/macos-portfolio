import SystemPreferences from "@/components/SystemPreferences";

export interface ItemType {
  id: string;
  src: string;
  iconSize?: number;
  name: string;
  disableFullscreen?: boolean;
  minWidth?: number;
  minHeight?: number;
  Content?: () => React.JSX.Element;
}

export const apps: Map<string, ItemType> = new Map([
  ["apps", { id: "apps", src: "apps.svg", name: "Launchpad" }],
  ["imessage", { id: "imessage", src: "message.svg", name: "iMessage" }],
  ["projects", { id: "projects", src: "notes.svg", name: "Projects" }],
  ["photos", { id: "photos", src: "photos.svg", name: "Photos" }],
  ["safari", { id: "safari", src: "safari.svg", name: "Safari" }],
  ["terminal", { id: "terminal", src: "terminal.png", name: "Terminal" }],
  ["mail", { id: "mail", src: "mail.svg", name: "Mail" }],
  [
    "settings",
    {
      id: "settings",
      src: "settings.svg",
      name: "System Settings",
      Content: SystemPreferences,
      minWidth: 600,
      minHeight: 500,
    },
  ],
]);
