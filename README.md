# GGUI Documentation Site

A simple static documentation site for the GGUI library.

## Getting Started

Open `index.html` in a modern browser. The site uses ES modules, so if serving from the filesystem causes CORS issues, use a static server.

### Quick serve (PowerShell)

```powershell
# Python 3
python -m http.server 8080
# or Node
npx serve . -l 8080
```

Then navigate to http://localhost:8080.

## Features
- Modular JS (ES modules) for menu, navigation, search, and scroll indicators
- Client-side search over sections
- Fetch caching and image lazy-loading
- Accessibility improvements (roles, keyboard nav)
- Dark theme (toggle in menu)
- Code highlighting via highlight.js

## Development
- Main entry: `js/main.js`
- Data sources: `js/data.js`
- Menu rendering: `js/menu.js`
- Navigation + fetch cache: `js/navigation.js`
- Scroll indicators: `js/scrollIndicators.js`
- Link auto-highlighting: `js/highlightLinks.js`
- Search: `js/search.js`
- Theme: `js/theme.js`

## Contributing
- Use descriptive commit messages (e.g., "feat(search): add typeahead for headers").
- Prefer feature branches (e.g., `feat/search`, `fix/scroll-lag`).
- Keep PRs focused and small when possible.

## Testing (optional)
You can add Jest + jsdom for unit tests. A suggested setup is:
- `package.json` with jest, @jest-environment/jsdom
- Tests for `Highlight_Links` and navigation caching.

## License
See `LICENSE`.
