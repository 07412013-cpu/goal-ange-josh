# Ange & Josh — Shared Savings Tracker
Monitoring tool only. It does not store, move or process real money.

## Structure
```
ange-josh/
├── index.html            Page shell
├── assets/
│   ├── css/style.css     Styles (light/dark themes, print rules)
│   └── js/               Loaded in this order:
│       ├── config.js     Helpers, formatting, shared state, lists
│       ├── storage.js    Load/save (PHP server or this device), login
│       ├── calc.js       Totals, goal budget and reserve formulas, audit log
│       ├── ui.js         Toasts, modals, forms, theme toggle, navigation
│       ├── pages.js      All pages
│       ├── actions.js    Save, edit, delete, restore, CSV export, backup
│       └── app.js        Starts the app
├── api/
│   ├── api.php           PHP + SQLite storage, shared password
│   └── data/             Created automatically (not in Git)
├── .gitignore
└── README.md
```

## Setup
- GitHub Pages: upload everything and enable Pages. PHP does not run there, so data is saved on each device. Use Settings → Download backup.
- PHP host: needs PHP 7.4+ with pdo_sqlite. The first password you enter becomes the shared login. Data is shared across devices.

## Theme
Follows your device setting by default. The button in the header switches between light and dark and remembers the choice.
