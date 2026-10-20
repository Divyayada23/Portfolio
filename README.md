# Portfolio

Plain HTML, CSS and JavaScript. No build step.

## Preview locally
Open `index.html` in a browser.

## Put it on GitHub Pages
1. Create a repo (name it `<your-username>.github.io` for the main address, or any name for a project address).
2. Upload everything in this folder to the repo root.
3. Repo Settings > Pages > Source: "Deploy from a branch" > `main` / root > Save.
4. The site goes live at the address Pages shows (usually within a minute or two).

## The pages (all on one 16:9 stage)
| Address ending | What you see |
|---|---|
| (nothing) | The forest: both houses, Cocori, the rose bush |
| `#fun` | The fun house: night party, dancing animals |
| `#jobs` | The job board: signpost with one arrow per company, notes on the cork board |
| `#jobs/allmax` | A company's cave: banner and wooden boards. One per company in `js/jobs-data.js` |

## Filling in the companies
Open `js/jobs-data.js`. Each company has: `industry`, `about`, `role`, `managed` (people managed),
`tools`, `achievements`, `built` (tools you built). Anything left empty shows "Coming soon" on the boards.
To add a company, copy one line and change the `slug` and `name`; its arrow appears on the signpost automatically.

## What is where
- `index.html`: the markup for every scene
- `css/style.css`: the forest, the fun house and all the dance moves
- `css/jobs.css`: the job board, the signpost, the wooden boards (positions are in "u" = pixels of a 1920 x 1080 canvas)
- `js/nav.js`: moving between scenes (clicks, Back buttons, Escape, browser back, direct links)
- `js/fun.js`, `js/fun-data.js`: the party lights and fireflies
- `js/jobs-data.js`: the company details
- `assets/`: art. `assets/jobs/` has the board and cave backgrounds, `assets/fun/` the night party, `assets/fonts/` the sign font (Fredoka, SIL Open Font License)

## Tweaking the party
- **Tempo:** `--beat` at the top of `css/style.css` (0.5s = 120 BPM). Smaller is faster.
- **Fireflies:** the count is the `26` in the loop in `js/fun.js`.
- **Dance moves:** each animal has its own `@keyframes` block in `css/style.css`.


## Company scene (js/jobs-data.js)
Banner = name, sector (`industry`), description (`about`) and an optional link. Left: My role + Tools, then Highlights (`achievements`, optional `photos`). Right: Projects.
Each project is one line that drops down on click, with labelled sections (Challenge / Solution / Result...), an optional `status` chip and an optional YouTube `video` link.
The video shows as a "Watch the demo on YouTube" button that opens YouTube in a new tab, so there is no embedded preview. Paste the link into the project's `video: ''`.
Optional still images: `screenshots: [{ src: 'assets/jobs/screens/x.png', alt: '...' }]` (click to enlarge).

## Forest page text (js/site-data.js)
The artwork credit (rose bush) and the contact bottle read from `js/site-data.js`. Empty fields show "coming soon".
The About me text is in `index.html` (`#about-bubble`).

## Contact form (the bottle)
The form needs a service to deliver the message to your inbox, because GitHub Pages has no server. Easiest: **Web3Forms** (free, no account password, just your email).
1. Go to web3forms.com, enter your email, and they send you an *access key*.
2. Paste it into `js/site-data.js`: `accessKey: 'your-key'`.
That's it: visitors fill in "email or phone" and "message", and it lands in your inbox. Until the key is set, the form falls back to opening the visitor's email app if `email` is filled in.
(Formspree works too: set `endpoint` to your Formspree form URL and leave `accessKey` empty.)

## Fun projects and Swish Signs
The fun house board is built from `window.FUN_PROJECTS` in `js/fun-data.js` (same format as the company projects).
To make the **Play Swish Signs** button work, put your game's HTML file at `assets/swish/index.html` and set `play: 'assets/swish/index.html'` on the Swish Signs entry (or paste its GitHub Pages address). It opens inside the site.

## Frog cursor
`assets/cursor/frog.svg` is the normal cursor and `frog-hop.svg` shows on anything clickable (swap the files to change it).

## Fun scene: coconut disco balls + Swish Signs
- Each fun project is a small wooden coconut disco ball floating in the party scene, with glowing holes and its name underneath. Edit projects in `js/fun-data.js` (`FUN_PROJECTS`; ball size and positions in `FUN_BALL`).
- Project cards only have Problem, Solution and Built with. Clicking a ball opens its card; Escape or the x closes it.
- Swish Signs has no card: its ball opens the game page directly (`#fun/swish`, on `assets/game/bg.webp`). The game is one self-contained file, `assets/swish/index.html`. To use your original version, replace that file (keep the page background transparent).

## Ready to deploy (GitHub Pages)
1. Create a repo and upload everything in this folder (keep the `.nojekyll` file).
2. Settings > Pages > Deploy from a branch > `main` / root. The site appears at `https://<you>.github.io/<repo>/`.
3. Before going live, fill in `js/site-data.js` (contact email/links and the Web3Forms access key).
4. After you edit files later, bump the `?v=4` in `index.html` (to `?v=5`...) so visitors do not see cached copies.
5. Test on your phone too: the mobile layout is still a to-do.

## Cocori
`js/cocori-data.js` holds her greeting, suggested questions, topic search buttons and answers. Typing a word (for example "dashboard" or "inventory") also searches every project, and tapping a result opens it.

## Contact form with Google Forms
1. Make a Google Form with two "Short answer"/"Paragraph" questions: "Your email or phone" and "Message".
2. In the form: Responses tab > turn on "Get email notifications for new responses".
3. Form menu (3 dots) > "Get pre-filled link". Type "a" in the first box and "b" in the second, click "Get link", open it. The address contains `entry.123456=a&entry.789012=b`. Those two `entry.` numbers are your field names.
4. Copy the form's normal link (https://docs.google.com/forms/d/e/XXXX/viewform) and change the end `viewform` to `formResponse`.
5. In `js/site-data.js`:
   googleForm: { url: 'https://docs.google.com/forms/d/e/XXXX/formResponse', contactField: 'entry.123456', messageField: 'entry.789012' }
6. Send yourself a test message from the bottle and check the Responses tab.
