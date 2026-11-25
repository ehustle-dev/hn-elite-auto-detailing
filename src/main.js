import "./styles.css";

const header = document.querySelector(".site-header");
const toggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".nav");

const onScroll = () => {
  if (!header) return;
  header.classList.toggle("is-scrolled", window.scrollY > 24);
};

onScroll();
window.addEventListener("scroll", onScroll, { passive: true });

if (toggle && nav) {
  toggle.addEventListener("click", () => {
    const open = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!open));
    nav.classList.toggle("is-open", !open);
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      toggle.setAttribute("aria-expanded", "false");
      nav.classList.remove("is-open");
    });
  });
}

const reveals = document.querySelectorAll(".reveal");
if (reveals.length && "IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16, rootMargin: "0px 0px -8% 0px" }
  );
  reveals.forEach((el) => observer.observe(el));
} else {
  reveals.forEach((el) => el.classList.add("is-visible"));
}

const form = document.querySelector("form[name='contact']");
const status = document.querySelector(".form-status");

if (form) {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (status) {
      status.textContent = "Sending…";
      status.className = "form-status";
    }

    const data = new FormData(form);

    // GitHub Pages can't receive form posts. Set FORM_ENDPOINT to a form service URL
    // (e.g. Formspree) to post there; until then the form opens a pre-filled email.
    const FORM_ENDPOINT = "";

    if (!FORM_ENDPOINT) {
      const lines = [];
      data.forEach((value, key) => {
        if (key !== "bot-field" && key !== "form-name" && String(value).trim()) lines.push(key + ": " + value);
      });
      window.location.href = "mailto:hnelitedetail@gmail.com?subject=" + encodeURIComponent("Quote request from website") + "&body=" + encodeURIComponent(lines.join("\n"));
      if (status) {
        status.textContent = "Your email app should open with your details. If not, call 0457 068 310 or email hnelitedetail@gmail.com.";
        status.className = "form-status ok";
      }
      return;
    }

    try {
      const response = await fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: data,
      });

      if (!response.ok) throw new Error("Request failed");

      form.reset();
      if (status) {
        status.textContent = "Thanks - we’ll get back to you shortly.";
        status.className = "form-status ok";
      }
    } catch {
      if (status) {
        status.textContent =
          "Couldn’t send right now. Call 0457 068 310 or email hnelitedetail@gmail.com.";
        status.className = "form-status err";
      }
    }
  });
}
