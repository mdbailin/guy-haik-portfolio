# Guy Haik Portfolio

A static portfolio for Guy Haik, ready to deploy on GitHub Pages.

## Set up Guy's links

Open `scripts/config.js` and add the public values for `booking`, `email`, `linkedin`, and (optionally) YouTube. The résumé link is already set to `Guy Haik CV.pdf`.

### Google Calendar booking

1. In Guy's Google Calendar, create an **Appointment schedule** and set its availability, duration, location, and invitee questions.
2. In the schedule settings, enable email confirmations and calendar invitations for booked appointments.
3. Copy the schedule's public booking-page URL into `links.booking` in `scripts/config.js`.

Google Calendar then checks Guy's availability, creates the event, and emails confirmations to both the guest and Guy. No separate scheduling backend or email service is needed.

## Local preview

```bash
npm install
npm run build:posts
python3 -m http.server 8000
```

## Deploy to GitHub Pages

The included GitHub Actions workflow deploys pushes to `main`. After creating the repository, push the project, then select **GitHub Actions** under **Settings → Pages**. If TinaCMS is wanted for publishing notes, connect the new repository in TinaCloud and add `TINA_PUBLIC_CLIENT_ID` and `TINA_TOKEN` as GitHub repository secrets.
