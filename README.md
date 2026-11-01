# Guy Haik Portfolio

A static portfolio for Guy Haik, ready to deploy on GitHub Pages.

## Set up Guy's links

Open `scripts/config.js` and add the public values for `booking`, `email`, `linkedin`, and (optionally) YouTube. The résumé link is already set to `Guy Haik CV.pdf`.

### WhatsApp booking

The booking page opens a WhatsApp chat with Guy at `+972 54-976-1580`, with a prefilled request for a coaching conversation. Visitors send the message and arrange a time directly with Guy.

Update `links.booking` in `scripts/config.js` to change the number or message. The `wa.me` URL uses the full international number with digits only and a URL-encoded `text` parameter.

## Local preview

```bash
npm install
npm run build:posts
python3 -m http.server 8000
```

## Deploy to GitHub Pages

The included GitHub Actions workflow deploys pushes to `main`. After creating the repository, push the project, then select **GitHub Actions** under **Settings → Pages**. If TinaCMS is wanted for publishing notes, connect the new repository in TinaCloud and add `TINA_PUBLIC_CLIENT_ID` and `TINA_TOKEN` as GitHub repository secrets.
