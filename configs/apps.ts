export interface ItemType {
  id: string;
  src: string;
  iconSize?: number;
  name: string;
  disableFullscreen?: boolean;
}

export const apps: Map<string, ItemType> = new Map([
  ["apps", { id: "apps", src: "apps.svg", name: "Launchpad" }],
  ["2048", { id: "2048", src: "2048.png", name: "2048" }],
  ["imessage", { id: "imessage", src: "message.svg", name: "iMessage" }],
  ["notes", { id: "notes", src: "notes.svg", name: "Notes" }],
  ["photos", { id: "photos", src: "photos.svg", name: "Photos" }],
  [
    "calculator",
    {
      id: "calculator",
      src: "calculator.png",
      iconSize: 84,
      name: "Calculator",
      disableFullScreen: true,
    },
  ],
  ["safari", { id: "safari", src: "safari.svg", name: "Safari" }],
  ["terminal", { id: "terminal", src: "terminal.png", name: "Terminal" }],
  ["mail", { id: "mail", src: "mail.svg", name: "Mail" }],
  ["settings", { id: "settings", src: "settings.svg", name: "Settings" }],
  [
    "trash",
    { id: "trash", src: "trash-light.svg", iconSize: 86, name: "Trash" },
  ],
]);
