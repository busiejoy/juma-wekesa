// Pick every section except the hero
const sections = document.querySelectorAll("main section:not(#home)");

// The observer watches for sections entering the screen
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target); // animate only once
      }
    });
  },
  { threshold: 0.15 }
);

// Prepare each section and start watching it
sections.forEach((section) => {
  section.classList.add("fade-in");
  observer.observe(section);
});

// Highlight the nav link for the section currently on screen
const allSections = document.querySelectorAll("main section");
const navLinks = document.querySelectorAll("nav ul a");

const navObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navLinks.forEach((link) => {
          link.classList.toggle(
            "active",
            link.getAttribute("href") === "#" + entry.target.id
          );
        });
      }
    });
  },
  { rootMargin: "-40% 0px -55% 0px" }
);

allSections.forEach((section) => navObserver.observe(section));

// Hamburger menu
const menuToggle = document.getElementById("menu-toggle");
const navMenu = document.getElementById("nav-menu");

menuToggle.addEventListener("click", () => {
  const isOpen = navMenu.classList.toggle("open");
  menuToggle.textContent = isOpen ? "✕" : "☰";
  menuToggle.setAttribute("aria-expanded", isOpen);
});

// Close the menu after tapping a link
navMenu.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navMenu.classList.remove("open");
    menuToggle.textContent = "☰";
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

// Back to top button
const backToTop = document.getElementById("back-to-top");

window.addEventListener("scroll", () => {
  backToTop.classList.toggle("show", window.scrollY > 500);
});

backToTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// Open the privacy notice when its link is tapped
document.querySelectorAll('a[href="#privacy"]').forEach((link) => {
  link.addEventListener("click", () => {
    document.querySelector("#privacy details").open = true;
  });
});

// Contact form: send in the background and show a message on the page
const contactForm = document.getElementById("contact-form");
const formStatus = document.getElementById("form-status");

contactForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const button = contactForm.querySelector("button[type='submit']");
  const originalText = button.textContent;
  button.disabled = true;
  button.textContent = "Sending...";
  formStatus.className = "form-status";
  formStatus.textContent = "";

  try {
    const response = await fetch(contactForm.action, {
      method: "POST",
      body: new FormData(contactForm),
      headers: { Accept: "application/json" }
    });

    if (!response.ok) throw new Error("Send failed");

    contactForm.reset();
    formStatus.textContent =
      "Thank you! Your message has been sent. Juma will get back to you soon.";
    formStatus.classList.add("success");
  } catch (error) {
    formStatus.textContent =
      "Sorry, something went wrong. Please try again, or message Juma on WhatsApp.";
    formStatus.classList.add("error");
  } finally {
    button.disabled = false;
    button.textContent = originalText;
    formStatus.scrollIntoView({ behavior: "smooth", block: "center" });
  }
});