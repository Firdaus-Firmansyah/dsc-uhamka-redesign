# Content and asset provenance

Source pages read on 13 November 2026:

- https://dscuhamka.my.id — metrics, logos, division copy, partner identities, community links.
- https://dscuhamka.my.id/team — member names, roles, biographies, image filenames, existing public social URLs.
- https://dscuhamka.my.id/faq — ten question/answer pairs.
- https://dscuhamka.my.id/events — two published sessions.
- https://dscuhamka.my.id/event/detail — Kretya title, speakers, preparation, registration URL and calendar timestamps.
- https://dscuhamka.my.id/event/gallery/crash-course-uiux — gallery filenames.

The July 18, 2026 event is in the past, even though the old site still displays Open Registration. Registration is disabled after its end date. The agenda’s AM/PM labels conflict with its 09:00–11:00 WIB header and Google Calendar link. The redesign follows the header/calendar morning interval and groups the final Q&A/closing entry without claiming a new exact closing sub-time.

The May 30, 2025 archive confirms a date but no machine-readable time. It uses a date-only calendar entry rather than an invented schedule.

Local assets recovered from Downloads:

- `Logo Dsc Uhamka HD.png` → `public/images/Logo-Dsc-Uhamka-HD.png`
- `Logo Uhamka HD.png` → `public/images/Logo-Uhamka-HD.png`
- `DSC UHAMKA - The Pixels 2/Background-Thumbnail dsc x kretya studio 1x.png` → `public/images/ThePixels.png`
- `DSC UHAMKA - The Pixels 2/Logo Kretya Hitam.png` → `public/images/kretya.png`

Successfully downloaded before the origin stopped accepting connections: `Ahmad.png`, `CC1.png`, `CC2.png`.

The remaining photographs, Crash Course poster, gallery and partner marks were recovered from the user's Figma file on 13 November 2026 using Desktop Bridge exports. All image references used by the site now resolve to optimized local files. Original design imagery is preserved, including retouched portraits already present in Figma; no replacement portraits were generated.

The user confirmed that the profile using `deta.webp` is **Deeta Zamel Aulia**. The `regis.webp` profile remains **Regissya Anfieldasari F. A.**. The social links previously attached to Deeta's mislabeled card were removed because they belonged to Regissya. Salvalynda Riana Putri and Fayza Nadya Ulya follow the final team frame's text. No management-period dates are invented. Settings/edit URLs were removed from public profile links.

## Figma import and retouch

File: https://www.figma.com/design/rRXumL03b7XEVWd58bej59/The-Pixels-DSC-Uhamka-25-26

Inspected the `Web Final` section, desktop Team/FAQ/Home frames, and the dedicated `Event-The Pixels`, `Event-The Vectors`, and `Event-The Cyphers` sections. Figma itself was read and exported, not modified.

- Imported 21 team portraits, missing partner marks, speaker images, Crash Course poster and gallery.
- Added Data Storytelling with Tableau (27 June 2026, 13:00–16:00 WIB, online) and Beyond the Surface (23 May 2026, 13:00–16:00 WIB, Lab 1 FTII UHAMKA) from their dedicated detail sections. Both are archived, with no invented registration links.
- Used the sharp Tableau image layer; the design also contains a blurred background copy.
- Updated FAQ eligibility, peer learning, division descriptions and certificate steps. Retained the existing scheduling answer because Figma repeats the Core Team answer in that slot. Used the verified Instagram handle and email rather than the inconsistent placeholder contact copy.
- Generic template events and unconfirmed certificate-recognition claims were not imported.
- Replaced the homepage code-window illustration with real community photography; increased reading sizes and improved event, team, and mobile styling in `src/app/retouch.css`.

Image/contact-sheet inspection passed. Full browser screenshots and interaction QA remain unverified because the computer/browser host is unavailable in this session.

Design references: https://blog.google/, https://antigravity.google/, https://gdg.community.dev/. Framework references: https://nextjs.org/docs/app/guides/static-exports and https://tailwindcss.com/docs/installation/using-postcss.
