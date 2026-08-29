import SITE_CONFIG from "./config.js";
import { initSite } from "./site.js";

initSite("booking.html");

const bookingLink = document.getElementById("booking-link");
const setupNote = document.getElementById("booking-setup");

if (SITE_CONFIG.links.booking) {
  bookingLink.href = SITE_CONFIG.links.booking;
  bookingLink.target = "_blank";
  bookingLink.rel = "noreferrer";
} else {
  bookingLink.remove();
  setupNote.classList.remove("is-hidden");
}
