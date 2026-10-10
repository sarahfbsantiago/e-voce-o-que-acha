/** Ícones desenhados em traço (estilo simples, mesma espessura), no lugar de emojis. */
const P: Record<string, string> = {
  compass: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z M15.5 8.5l-2 5-5 2 2-5 5-2Z",
  pin: "M12 21s-6-5.3-6-11a6 6 0 1 1 12 0c0 5.7-6 11-6 11Z M12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z",
  star: "M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.3-4.1 5.9-.9L12 3.5Z",
  palette: "M12 3a9 9 0 0 0 0 18c1 0 1.6-.8 1.6-1.6 0-1.2-1-1.6-1-2.6 0-.9.7-1.6 1.6-1.6H16a5 5 0 0 0 5-5C21 6.6 17 3 12 3Z M7.5 11.5h.01 M10 7.5h.01 M14.5 7.5h.01",
  ruler: "M3 12h18 M7 8l-4 4 4 4 M17 8l4 4-4 4",
  list: "M8 6h13 M8 12h13 M8 18h13 M3.5 6h.01 M3.5 12h.01 M3.5 18h.01",
  text: "M4 6h16 M4 10h16 M4 14h10 M4 18h7",
  upload: "M12 16V4 M7 9l5-5 5 5 M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3",
  chart: "M4 20V10 M10 20V4 M16 20v-7 M3 20h18",
  history: "M3 12a9 9 0 1 0 3-6.7L3 8 M3 3v5h5 M12 7v5l3 2",
  pencil: "M15 4l5 5L9 20H4v-5L15 4Z M13 6l5 5",
  lock: "M6 11h12v9H6z M8.5 11V8a3.5 3.5 0 0 1 7 0v3 M12 15v2",
  help: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6v.3 M12 17h.01",
  key: "M14.5 9.5a4.5 4.5 0 1 1-1.3-3.2 M14 10l7 7v3h-3v-2h-2v-2h-2l-1.3-1.3 M8 9h.01",
  save: "M5 4h11l3 3v13H5z M8 4v5h7V4 M8 20v-6h8v6",
  send: "M21 3L10 14 M21 3l-7 18-4-7-7-4 18-7Z",
  eye: "M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z",
  eyeOff: "M3 3l18 18 M10.6 5.1A10 10 0 0 1 12 5c6.5 0 10 7 10 7a17 17 0 0 1-3 3.8 M6.6 6.6C3.9 8.4 2 12 2 12s3.5 7 10 7c1.7 0 3.2-.5 4.4-1.2 M9.9 9.9a3 3 0 0 0 4.2 4.2",
  copy: "M9 9h11v11H9z M5 15H4V4h11v1",
  rocket: "M5 15c-1.5 1.5-2 5-2 5s3.5-.5 5-2 M9 18l-3-3 M14.5 4.5C17 3 21 3 21 3s0 4-1.5 6.5L13 16l-5-5 6.5-6.5Z M15 9h.01",
  archive: "M3 5h18v4H3z M5 9v11h14V9 M10 13h4",
  link: "M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1 M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1",
  check: "M4 12.5l5 5L20 6.5",
  data: "M4 6c0-1.7 3.6-3 8-3s8 1.3 8 3-3.6 3-8 3-8-1.3-8-3Z M4 6v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6 M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3",
  shield: "M12 3l8 3v6c0 4.5-3.5 8-8 9-4.5-1-8-4.5-8-9V6l8-3Z M9 12l2 2 4-4",
  external: "M14 4h6v6 M20 4l-9 9 M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5",
  phone: "M8 2h8a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Z M11 18h2",
};

export type IconName = keyof typeof P;

export function Icon({ name, className = "h-5 w-5", strokeWidth = 1.9 }: { name: IconName; className?: string; strokeWidth?: number }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
      {P[name].split(" M").map((d, i) => <path key={i} d={i ? `M${d}` : d} />)}
    </svg>
  );
}
