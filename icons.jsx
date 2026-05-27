// SNP AV — Icons (Lucide-style hand-tuned)
const Icon = ({ d, size = 16, stroke = 1.6, fill = "none", style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill}
       stroke="currentColor" strokeWidth={stroke}
       strokeLinecap="round" strokeLinejoin="round" style={style}>
    {d}
  </svg>
);

const I = {
  home:    (p) => <Icon {...p} d={<><path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/><path d="M9 20v-6h6v6"/></>} />,
  info:    (p) => <Icon {...p} d={<><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 9h10M7 13h10M7 17h6"/></>} />,
  cal:     (p) => <Icon {...p} d={<><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 9h18M8 3v4M16 3v4"/></>} />,
  users:   (p) => <Icon {...p} d={<><circle cx="9" cy="8" r="3"/><path d="M3 20c0-3 3-5 6-5s6 2 6 5"/><circle cx="17" cy="9" r="2.5"/><path d="M15 20c0-2.2 1.5-4 3-4"/></>} />,
  box:     (p) => <Icon {...p} d={<><path d="M3 7l9-4 9 4-9 4-9-4z"/><path d="M3 7v10l9 4 9-4V7"/><path d="M12 11v10"/></>} />,
  gallery: (p) => <Icon {...p} d={<><rect x="3" y="4" width="18" height="14" rx="2"/><circle cx="9" cy="10" r="1.6"/><path d="M3 16l5-4 5 4 3-2 5 4"/></>} />,
  bell:    (p) => <Icon {...p} d={<><path d="M6 16V11a6 6 0 1112 0v5l1.5 2H4.5z"/><path d="M10 20a2 2 0 004 0"/></>} />,
  search:  (p) => <Icon {...p} d={<><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.5-4.5"/></>} />,
  plus:    (p) => <Icon {...p} d={<><path d="M12 5v14M5 12h14"/></>} />,
  chevR:   (p) => <Icon {...p} d={<><path d="M9 6l6 6-6 6"/></>} />,
  chevL:   (p) => <Icon {...p} d={<><path d="M15 6l-6 6 6 6"/></>} />,
  chevD:   (p) => <Icon {...p} d={<><path d="M6 9l6 6 6-6"/></>} />,
  qr:      (p) => <Icon {...p} d={<><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><path d="M14 14h2v2M18 14v2M14 18h2v3M18 18v3M21 14v4M21 21h-3"/></>} />,
  cam:     (p) => <Icon {...p} d={<><path d="M4 8h4l2-2h4l2 2h4v12H4z"/><circle cx="12" cy="14" r="4"/></>} />,
  mic:     (p) => <Icon {...p} d={<><rect x="9" y="3" width="6" height="12" rx="3"/><path d="M5 12a7 7 0 0014 0M12 19v3M9 22h6"/></>} />,
  proj:    (p) => <Icon {...p} d={<><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="9" cy="12" r="3"/><circle cx="17" cy="10" r="1"/></>} />,
  light:   (p) => <Icon {...p} d={<><path d="M12 3v2M5 5l1.5 1.5M19 5l-1.5 1.5M3 12h2M19 12h2"/><path d="M9 18a3 3 0 006 0v-1a5 5 0 10-6 0z"/><path d="M10 22h4"/></>} />,
  speaker: (p) => <Icon {...p} d={<><rect x="6" y="3" width="12" height="18" rx="2"/><circle cx="12" cy="9" r="2"/><circle cx="12" cy="15" r="3"/></>} />,
  cable:   (p) => <Icon {...p} d={<><path d="M4 4v4a4 4 0 008 0V4"/><path d="M12 20v-4a4 4 0 018 0v4"/><path d="M4 4h2M6 4h2M16 20h2M18 20h2"/></>} />,
  film:    (p) => <Icon {...p} d={<><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 4v16M17 4v16M3 8h4M3 12h4M3 16h4M17 8h4M17 12h4M17 16h4"/></>} />,
  setting: (p) => <Icon {...p} d={<><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/></>} />,
  check:   (p) => <Icon {...p} d={<><path d="M5 12l4 4 10-10"/></>} />,
  x:       (p) => <Icon {...p} d={<><path d="M6 6l12 12M6 18L18 6"/></>} />,
  more:    (p) => <Icon {...p} d={<><circle cx="6" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="18" cy="12" r="1"/></>} />,
  pin:     (p) => <Icon {...p} d={<><path d="M12 2v6"/><path d="M5 8h14l-3 5v6l-4-3-4 3v-6z"/></>} />,
  clock:   (p) => <Icon {...p} d={<><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>} />,
  download:(p) => <Icon {...p} d={<><path d="M12 4v12"/><path d="M7 11l5 5 5-5"/><path d="M4 20h16"/></>} />,
  filter:  (p) => <Icon {...p} d={<><path d="M3 5h18M6 12h12M10 19h4"/></>} />,
  edit:    (p) => <Icon {...p} d={<><path d="M4 20l4-1 11-11-3-3L5 16z"/></>} />,
  in:      (p) => <Icon {...p} d={<><path d="M12 4v12M7 11l5 5 5-5"/><path d="M4 20h16"/></>} />,
  out:     (p) => <Icon {...p} d={<><path d="M12 20V8M7 13l5-5 5 5"/><path d="M4 4h16"/></>} />,
  trend:   (p) => <Icon {...p} d={<><path d="M3 17l6-6 4 4 8-8"/><path d="M15 7h6v6"/></>} />,
  bolt:    (p) => <Icon {...p} d={<><path d="M13 2L4 14h7l-1 8 9-12h-7z"/></>} />,
  star:    (p) => <Icon {...p} d={<><path d="M12 3l2.7 6 6.3.5-4.8 4 1.4 6.5L12 17l-5.6 3 1.4-6.5L3 9.5 9.3 9z"/></>} />,
  mail:    (p) => <Icon {...p} d={<><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></>} />,
  phone:   (p) => <Icon {...p} d={<><path d="M5 4h4l2 5-3 2a12 12 0 005 5l2-3 5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z"/></>} />,
  crown:   (p) => <Icon {...p} d={<><path d="M3 7l4 3 5-6 5 6 4-3v11H3z"/></>} />,
  flag:    (p) => <Icon {...p} d={<><path d="M5 3v18M5 4h12l-2 4 2 4H5"/></>} />,
};

window.I = I;
