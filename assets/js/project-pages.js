(function () {
  const images = Array.from(document.querySelectorAll(".paper-page figure img")).filter(
    (image) => !image.classList.contains("lighting-inset")
  );
  if (!images.length) return;

  const overlay = document.createElement("div");
  overlay.className = "figure-lightbox";
  const placeholderImage =
    "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
  overlay.innerHTML = `
    <button class="figure-lightbox-close" type="button" aria-label="Close figure">&times;</button>
    <img src="${placeholderImage}" alt="" />
    <p></p>
  `;
  document.body.appendChild(overlay);

  const overlayImage = overlay.querySelector("img");
  const overlayCaption = overlay.querySelector("p");
  const closeButton = overlay.querySelector("button");

  function openFigure(image) {
    const caption = image.closest("figure")?.querySelector("figcaption")?.textContent?.trim() || image.alt || "";
    overlayImage.src = image.currentSrc || image.src;
    overlayImage.alt = image.alt || caption;
    overlayCaption.textContent = caption;
    overlay.classList.add("is-open");
    closeButton.focus();
  }

  function closeFigure() {
    overlay.classList.remove("is-open");
    overlayImage.src = placeholderImage;
  }

  images.forEach((image) => {
    image.tabIndex = 0;
    image.setAttribute("role", "button");
    image.setAttribute("aria-label", `Open figure: ${image.alt || "project figure"}`);
    image.addEventListener("click", () => openFigure(image));
    image.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openFigure(image);
      }
    });
  });

  overlay.addEventListener("click", (event) => {
    if (event.target === overlay || event.target === closeButton) closeFigure();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && overlay.classList.contains("is-open")) closeFigure();
  });

  document.querySelectorAll(".copy-bibtex").forEach((button) => {
    function fallbackCopy(text) {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.setAttribute("readonly", "");
      textarea.style.position = "fixed";
      textarea.style.top = "-9999px";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      textarea.remove();
    }

    button.addEventListener("click", async () => {
      const code = button.closest(".bibtex-card")?.querySelector("code")?.textContent?.trim();
      if (!code) return;

      try {
        if (navigator.clipboard && window.isSecureContext) {
          try {
            await navigator.clipboard.writeText(code);
          } catch (error) {
            fallbackCopy(code);
          }
        } else {
          fallbackCopy(code);
        }

        const originalText = button.innerHTML;
        button.innerHTML = '<i class="fas fa-check" aria-hidden="true"></i> Copied';
        window.setTimeout(() => {
          button.innerHTML = originalText;
        }, 1600);
      } catch (error) {
        button.textContent = "Copy failed";
      }
    });
  });
})();
