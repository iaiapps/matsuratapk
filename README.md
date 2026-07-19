# Al-Ma'tsurat — Morning & Evening Dhikr

A Cordova Android app for reading morning and evening dhikr (Al-Ma'tsurat) with a modern, minimalist UI.

## Features

- Complete morning & evening dhikr with Arabic text, transliteration, and translation
- Light/dark mode toggle
- Arabic fonts (LPMQ IsepMisbah + Amiri)
- Custom splash screen
- Lightweight & fully offline

## Screenshots

| Home | Morning Dhikr | About |
|------|---------------|-------|
| ![Home](www/img/sc1.png) | ![Morning Dhikr](www/img/sc2.png) | ![About](www/img/sc3.png) |

## Structure

```
├── www/              # Frontend (HTML, CSS, JS, assets)
│   ├── index.html    # Home
│   ├── dzikirpagi.html
│   ├── dzikirpetang.html
│   ├── about.html
│   ├── source/       # Dhikr data (JSON)
│   └── img/          # Screenshots, logo, favicon
├── assets/           # Icon & splash screen
├── platforms/        # Android platform
├── plugins/          # Cordova plugins
└── config.xml        # Cordova config
```

## License

Apache-2.0 © [Lontarnesia / iairydev](https://github.com/iairydev)
