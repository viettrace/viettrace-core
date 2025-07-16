# viettrace-core

**viettrace-core** is the core open-source project of the “viettrace” ecosystem, providing a platform for Vietnam's administrative maps to serve various social applications such as environmental protection, volunteer work, tourism, education, and heritage preservation.

The project enables users to search for current locations and compare them with old or new administrative information based on administrative data before and after mergers.

---

## Objectives

- Provide administrative maps of Vietnam at the provincial/district/commune level
- Compare administrative changes over time
- Integrate with multiple social applications (charity, environment, education, etc.)
- Support multiple platforms: Web, Android, iOS
- Synchronize the interface and user experience across platforms

---

## Installation and development

- Install packages
```bash
pnpm install
```

- Start app
```bash
pnpm start:dev
```

---

## Administrative data

- Full GeoJSON file of administrative levels is located in `data/geojson/`
- Collected from OpenStreetMap + processed with QGIS/scripts
- Can be imported into PostGIS for query optimization

---

## Development Roadmap

- [x] Build core logic
- [ ] Display administrative maps on web/mobile
- [ ] Click on a location to display old/new administrative information
- [ ] API for querying place names by coordinates
- [ ] Provide Map SDK for integration into other apps

---

## Contributions

We welcome pull requests, issues, suggestions, discussions, and translations!

- Check out the `CONTRIBUTING.md` file to get started
- The project uses Vietnamese and English as its primary languages

---

## License

MIT © viettrace.org
