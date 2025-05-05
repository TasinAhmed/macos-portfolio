import { ReactNode } from "react";

export interface ItemType {
  id: string;
  src: string;
  iconSize?: number;
  name: string;
  disableFullscreen?: boolean;
  content?: ReactNode;
}

export const apps: Map<string, ItemType> = new Map([
  ["apps", { id: "apps", src: "apps.svg", name: "Launchpad" }],
  ["imessage", { id: "imessage", src: "message.svg", name: "iMessage" }],
  ["projects", { id: "projects", src: "notes.svg", name: "Projects" }],
  ["photos", { id: "photos", src: "photos.svg", name: "Photos" }],
  ["safari", { id: "safari", src: "safari.svg", name: "Safari" }],
  ["terminal", { id: "terminal", src: "terminal.png", name: "Terminal" }],
  ["mail", { id: "mail", src: "mail.svg", name: "Mail" }],
  ["settings", { id: "settings", src: "settings.svg", name: "Settings" }],
]);
