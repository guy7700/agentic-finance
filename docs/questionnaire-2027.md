# "Where will you be in 2027?" questionnaire

The campaign page is `agentic-finance.live/2027`. It follows Tal's flow:

1. Email 1 (day 0, everyone) links to the page with `utm_content=email_1`.
2. Email 2 (24 hours later, only people who did not click) uses the same link with `utm_content=email_2`. Still no click: stop and tag them in the CRM.
3. The page opens with name, email and company already filled in. They pick cities, regions or events (or write where they are going), then who they want to meet, and submit.
4. They see a thank-you screen with Tal's 30-minute booking link, and receive the thank-you email.
5. Their answers land in the Sheet, which is the CRM for this campaign, and a message is posted to the Chat space.

The emails themselves go out from the CRM or mail tool, which also knows who clicked. The site only receives the answers.

## The event menu

One file, `src/config/events-2027.ts`, feeds both the questionnaire and the home page calendar. Add, remove or edit an event there. Events with exact days have `start` and `end`; anything else goes to the "Dates to be confirmed" strip. City photos live in `public/assets/events/<city-slug>.jpg` (landscape 16:9, at least 1600px wide). An event without a photo shows a placeholder with its city name.

## Personal link

```
https://agentic-finance.live/2027?first_name={{first_name}}&last_name={{last_name}}&email={{email}}&company={{company}}&utm_source=crm&utm_medium=email&utm_campaign=calendar_2027&utm_content=email_1&channel=email
```

For Email 2, change `utm_content=email_1` to `utm_content=email_2`. Your mail tool must URL-encode the values (most do). Other channels: set `utm_medium` and `channel` to `dm`, `whatsapp`, `luma` or `social`. A link without personal fields still works; people fill them in by hand. Add `&event=<id>` to preselect an event (the ids are in the events file).

## Where the answers go

Same pattern as the site's other forms: the browser posts to a Google Apps Script web app. The script:

- adds one row per person to the Sheet. If the same email answers again, it updates that row instead of adding a new one, and never touches `status`, `owner` or `notes`;
- posts one message per answer to the Google Chat space, with a link to the row;
- sends the thank-you email from Guy, offering a call with Tal (at most one per address every 10 minutes);
- ignores bot submissions (honeypot field) and limits repeated submissions (5 per address per 10 minutes, 60 per minute overall). The page also blocks a second send from the same browser within a minute.

The Sheet: **Agentic Finance Questionnaire 2027 Responses**, https://docs.google.com/spreadsheets/d/1KANs6Dn1epSSSVjfbA9j48wfpBAzS4V7ekweR2TYHUA/edit

## One-time setup

### 1. Google Chat space and webhook (needs you)

1. In Google Chat, create a space named **Questionnaire 2027 Tracker** and add the team.
2. Open the space name at the top, then **Apps & integrations**, then **Webhooks** (or **Add webhooks**).
3. Name it "Questionnaire 2027", save, and copy the webhook URL.

If Webhooks is missing, your Google Workspace admin has to allow incoming webhooks for Chat.

### 2. Apps Script (needs you, about 5 minutes)

1. Open the Sheet, then **Extensions > Apps Script**.
2. Replace the editor's contents with `apps-script/questionnaire-2027.gs` from this repo and save.
3. **Project Settings > Script properties**, add:
   - `CHAT_WEBHOOK_URL`: the webhook URL from step 1
   - `SENDER_NAME`: `Guy Kaufman` (the default; it also signs the email)
   - `REPLY_TO`: only if replies should go somewhere other than the sending account
4. Back in the editor, choose the `setup` function and **Run**. Approve the permissions. This writes the header row and the status dropdown (new, contacted, meeting booked).
5. **Deploy > New deployment**, type **Web app**, execute as **Me**, access **Anyone**. Deploy and copy the web app URL.

The thank-you email is sent from the account that deploys the script (Guy's), signed by `SENDER_NAME`, and offers a 30-minute call with our founder, Tal Mor, through Tal's booking page. Gmail allows about 1,500 emails a day on Google Workspace.

### 3. Connect the site

The live script URL is already in `src/config/forms.ts`, the same way the site's other forms are wired, so the live build sends answers to it. If the script is ever deployed under a new URL, update it there.

For the pixel, in GitHub go to **Settings > Secrets and variables > Actions > Variables** and add `META_PIXEL_ID` (only the number). The next deploy picks it up.

For a local test, put `NEXT_PUBLIC_Q2027_WEBHOOK_URL` (and `NEXT_PUBLIC_META_PIXEL_ID`) in `.env.local`.

### 4. Test

Open the personal link with your own email, submit, then check: the row in the Sheet, the Chat message, the thank-you email, the pixel (Meta Events Manager > Test events, or the Meta Pixel Helper extension), and that submitting again with the same email updates the same row.

## Privacy

The consent box links to https://mnm.live/privacy. The Meta pixel runs only on `/2027` and `/2027/thanks`. Visitors in the EU and UK normally have to agree to marketing cookies before a pixel loads; the site has no cookie banner yet.

## City photo credits

Free licences that allow commercial use (https://unsplash.com/license, https://www.pexels.com/license/). Credit is not required but appreciated. Cropped to 16:9, 1600 x 900.

| File | Photographer | Source |
| --- | --- | --- |
| miami.jpg | Alejandro Luengo | [Unsplash](https://unsplash.com/photos/city-skyline-between-sky-and-body-of-water-Ev0Vj_0PPck) |
| new-york.jpg | Patrick Tomasso | [Unsplash](https://unsplash.com/photos/manhattan-skyline-and-brooklyn-bridge-SVVTZtTGyaU) |
| cannes.jpg | Zaki | [Unsplash](https://unsplash.com/photos/coastal-city-with-yachts-in-the-harbor-and-flowers-IzhyByN7ITw) |
| nashville.jpg | Peter Muniz | [Unsplash](https://unsplash.com/photos/nashville-tennessee-skyline-showcases-city-architecture-Yk7787AuVRc) |
| uae.jpg (Dubai, provisional until AIBC's city is confirmed) | Ansub Khan | [Unsplash](https://unsplash.com/photos/dubai-city-skyline-illuminated-at-night-with-burj-khalifa-zCYVd3IN6l8) |
| seoul.jpg | Yohan Cho | [Unsplash](https://unsplash.com/photos/lighted-city-skyline-at-night-Mwvhyd22Lyw) |
| bangkok.jpg | allPhoto Bangkok | [Unsplash](https://unsplash.com/photos/a-view-of-a-city-at-night-from-across-the-water-cj7KG6jjaaA) |
| amsterdam.jpg | Denis | [Unsplash](https://unsplash.com/photos/bicycles-parked-on-a-bridge-over-a-canal-in-amsterdam-f7xGAjyXehU) |
| riyadh.jpg | Ibrahim Abdullah | [Unsplash](https://unsplash.com/photos/kingdom-centre-skyscraper-in-riyadh-_UxsPARhtOg) |
| las-vegas.jpg | Parsa Mahmoudi | [Unsplash](https://unsplash.com/photos/the-las-vegas-strip-at-night-with-the-eiffel-tower-in-the-background-PYaP4awj9Uc) |
| barcelona.jpg | Salma Abdelnaby | [Unsplash](https://unsplash.com/photos/barcelona-cityscape-with-sagrada-familia-at-sunset-u5DXeHhcQUc) |
| rome.jpg | Cristina Gottardi | [Unsplash](https://unsplash.com/photos/coliseum-rome-italy-VhlLC2eNSuo) |
| washington-dc.jpg | Macarena Ollarzú | [Unsplash](https://unsplash.com/photos/united-states-capitol-building-in-washington-tth5ovaGliI) |
| san-francisco.jpg | Denys Nevozhai | [Unsplash](https://unsplash.com/photos/golden-gate-bridge-san-francisco-ts-CYh3wUE4) |
| lisbon.jpg | Timur Seyfelmlyukov | [Unsplash](https://unsplash.com/photos/lisbon-cityscape-with-castle-and-rooftops-YhxF9dkf7-Y) |
| davos.jpg | Ollie Craig | [Pexels](https://www.pexels.com/photo/scenic-winter-landscape-of-davos-switzerland-30131133/) |

Dubai, Hong Kong, Singapore, Abu Dhabi and Paris reuse the site's existing edition photography.
