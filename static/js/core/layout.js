(function () {
  "use strict";

  const data = window.NIWASA_DATA;
  if (!data || !data.company || !Array.isArray(data.services)) return;

  const { company, services } = data;

  function currentPage() {
    return location.pathname.split("/").pop() || "index.html";
  }

  function active(paths) {
    const page = currentPage();
    const matches = Array.isArray(paths) ? paths : [paths];
    return matches.includes(page) ? "active" : "";
  }

  function serviceUrl(slug) {
    return "service.html?slug=" + encodeURIComponent(slug);
  }

  function serviceLinks(className) {
    return services
      .map((service) => `<a href="${serviceUrl(service.slug)}" class="${className}">${service.title}</a>`)
      .join("");
  }

  function renderHeader() {
    document.body.insertAdjacentHTML(
      "afterbegin",
      `
        <div class="preloader" id="preloader">
          <div class="preloader-inner">
            <div class="preloader-logo"><img src="${company.logo}" alt="${company.name}"></div>
            <div class="preloader-bar"><div class="preloader-bar-inner"></div></div>
          </div>
        </div>

        <header class="navbar" id="navbar">
          <div class="navbar-container">
            <a href="index.html" class="navbar-logo">
              <img src="${company.logo}" alt="${company.name}" class="logo-img">
            </a>
            <nav class="navbar-menu" id="navbarMenu">
              <a href="index.html" class="nav-link ${active("index.html")}">HOME</a>
              <a href="about.html" class="nav-link ${active("about.html")}">ABOUT</a>
              <div class="nav-dropdown">
                <a href="services.html" class="nav-link ${active(["services.html", "service.html"])}">SERVICES
                  <svg class="dropdown-arrow" width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 1L5 5L9 1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
                </a>
                <div class="dropdown-menu">${serviceLinks("dropdown-item")}</div>
              </div>
              <a href="our-work.html" class="nav-link ${active("our-work.html")}">OUR WORK</a>
              <a href="journal.html" class="nav-link ${active("journal.html")}">JOURNAL</a>
              <a href="contact.html" class="nav-link ${active("contact.html")}">CONTACT</a>
            </nav>
            <a href="contact.html#consultation" class="navbar-cta"><span>BOOK CONSULTATION</span></a>
            <button class="navbar-toggle" id="navbarToggle" aria-label="Toggle navigation">
              <span class="toggle-line"></span><span class="toggle-line"></span><span class="toggle-line"></span>
            </button>
          </div>
        </header>

        <div class="mobile-menu" id="mobileMenu">
          <div class="mobile-menu-overlay" id="mobileOverlay"></div>
          <div class="mobile-menu-panel">
            <div class="mobile-menu-header">
              <a href="index.html" class="mobile-logo"><img src="${company.logo}" alt="${company.name}"></a>
              <button class="mobile-close" id="mobileClose" aria-label="Close menu">x</button>
            </div>
            <nav class="mobile-menu-nav">
              <a href="index.html" class="mobile-nav-link">Home</a>
              <a href="about.html" class="mobile-nav-link">About</a>
              <div class="mobile-nav-dropdown">
                <button class="mobile-nav-link mobile-dropdown-toggle" type="button">Services</button>
                <div class="mobile-dropdown-content">${serviceLinks("")}</div>
              </div>
              <a href="our-work.html" class="mobile-nav-link">Our Work</a>
              <a href="journal.html" class="mobile-nav-link">Journal</a>
              <a href="contact.html" class="mobile-nav-link">Contact</a>
            </nav>
            <div class="mobile-menu-footer">
              <a href="contact.html#consultation" class="mobile-cta-btn">Book Free Consultation</a>
              <div class="mobile-contact-info">
                <a href="tel:${company.phone}">${company.phoneDisplay}</a>
                <a href="mailto:${company.email}">${company.email}</a>
              </div>
            </div>
          </div>
        </div>
      `
    );
  }

  function renderFooter() {
    document.body.insertAdjacentHTML(
      "beforeend",
      `
        <footer class="footer">
          <div class="footer-top">
            <div class="container">
              <div class="footer-grid">
                <div class="footer-col footer-brand-col">
                  <a href="index.html" class="footer-logo"><img src="${company.logo}" alt="${company.name}"></a>
                  <p class="footer-brand-desc">${company.description}</p>
                </div>
                <div class="footer-col">
                  <h4 class="footer-heading">Quick Links</h4>
                  <ul class="footer-links">
                    <li><a href="index.html">Home</a></li>
                    <li><a href="about.html">About</a></li>
                    <li><a href="services.html">Services</a></li>
                    <li><a href="our-work.html">Our Work</a></li>
                    <li><a href="journal.html">Journal</a></li>
                    <li><a href="contact.html">Contact</a></li>
                  </ul>
                </div>
                <div class="footer-col">
                  <h4 class="footer-heading">Services</h4>
                  <ul class="footer-links">
                    ${services.slice(0, 6).map((service) => `<li><a href="${serviceUrl(service.slug)}">${service.title}</a></li>`).join("")}
                  </ul>
                </div>
                <div class="footer-col">
                  <h4 class="footer-heading">Get In Touch</h4>
                  <div class="footer-contact-info">
                    <div class="footer-contact-item"><span>${company.address}</span></div>
                    <div class="footer-contact-item"><a href="tel:${company.phone}">${company.phoneDisplay}</a></div>
                    <div class="footer-contact-item"><a href="mailto:${company.email}">${company.email}</a></div>
                  </div>
                  <div class="footer-newsletter">
                    <h5 class="newsletter-title">Subscribe to Newsletter</h5>
                    <form class="newsletter-form" id="newsletterForm">
                      <input type="email" name="email" placeholder="Your email address" required class="newsletter-input">
                      <button type="submit" class="newsletter-btn" aria-label="Subscribe">&rarr;</button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="footer-bottom">
            <div class="container">
              <div class="footer-bottom-inner">
                <p class="copyright">&copy; ${new Date().getFullYear()} ${company.name}. All Rights Reserved.</p>
              </div>
            </div>
          </div>
        </footer>

        <div class="floating-buttons">
          <a href="https://wa.me/${company.whatsapp}?text=Hello%20NIWASA%20Interior,%20I%20would%20like%20to%20book%20a%20free%20consultation." target="_blank" rel="noopener" class="floating-btn whatsapp-btn" aria-label="Chat on WhatsApp">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12.04 2C6.58 2 2.14 6.35 2.14 11.7c0 1.86.54 3.6 1.48 5.08L2 22l5.37-1.56a10.15 10.15 0 0 0 4.67 1.14c5.46 0 9.9-4.35 9.9-9.7S17.5 2 12.04 2Zm5.76 13.64c-.25.69-1.46 1.31-2.04 1.36-.53.05-1.19.07-1.92-.12-.44-.12-1-.32-1.72-.62-3.03-1.28-5.01-4.26-5.16-4.46-.15-.2-1.23-1.61-1.23-3.07s.78-2.18 1.06-2.48c.28-.3.61-.37.82-.37h.59c.19.01.44-.07.69.52.25.6.84 2.06.92 2.2.07.15.12.32.02.52-.1.2-.15.32-.3.49-.15.17-.31.38-.44.51-.15.15-.3.31-.13.61.17.3.75 1.21 1.6 1.96 1.1.96 2.02 1.26 2.32 1.41.3.15.47.12.65-.07.17-.2.74-.84.94-1.13.2-.3.4-.25.67-.15.27.1 1.72.79 2.01.94.3.15.5.22.57.35.08.12.08.72-.17 1.41Z"/></svg>
            <span class="floating-btn-tooltip">Chat with us</span>
          </a>
        </div>
        <button class="scroll-top-btn" id="scrollTopBtn" aria-label="Scroll to top">&uarr;</button>
        <div class="toast-container" id="toastContainer"></div>
      `
    );
  }

  renderHeader();
  document.addEventListener("DOMContentLoaded", renderFooter);
}());
