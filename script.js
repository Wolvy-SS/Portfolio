document.addEventListener("DOMContentLoaded", () => {

  // ======================
  // NAVBAR SELECT
  // ======================

  const sections = document.querySelectorAll("section, footer");
  const navLinks = document.querySelectorAll(".navbar a");

  window.addEventListener("scroll", () => {
    let current = "";

    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      if (scrollY >= sectionTop) {
        current = section.getAttribute("id");
      }
    });

    navLinks.forEach(link => {
      link.classList.remove("active");
      if (link.getAttribute("href") === "#" + current) {
        link.classList.add("active");
      }
    });
  });

  // ======================
  // THEME SWITCH
  // ======================

  const toggle = document.getElementById("theme-switch");

  if (localStorage.getItem("theme") === "light") {
    document.body.classList.add("light");
    toggle.checked = true;
  }

  toggle.addEventListener("change", () => {
    document.body.classList.toggle("light");

    if (document.body.classList.contains("light")) {
      localStorage.setItem("theme", "light");
    } else {
      localStorage.setItem("theme", "dark");
    }
  });

  // ======================
  // HAMBURGER MENU
  // ======================

  const hamburger = document.getElementById("hamburger");
  const navMenu = document.getElementById("nav-menu");

  hamburger.addEventListener("click", () => {
    navMenu.classList.toggle("active");

    if (navMenu.classList.contains("active")) {
      hamburger.textContent = "✕";
    } else {
      hamburger.textContent = "☰";
    }
  });

  // Auto-close menu when link clicked
  document.querySelectorAll(".nav-left a").forEach(link => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("active");
      hamburger.textContent = "☰";
    });
  });

  // ======================
  // PROJECT MODAL
  // ======================

  const modal = document.getElementById("project-modal");
  const closeModal = document.getElementById("close-modal");
  const titleEl = document.getElementById("modal-title");
  const descEl = document.getElementById("modal-description");
  const videoEl = document.getElementById("modal-video");
  const videoSource = document.getElementById("modal-video-source");
  const videoWrapper = document.getElementById("video-wrapper");
  const actionsEl = document.getElementById("modal-actions");

  // Video play analytics
  videoEl.addEventListener("play", () => {
    gtag("event", "project_video_play", {
      project_title: titleEl.textContent
    });
  });

  document.querySelectorAll(".open-project").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();

      // Google Analytics event
      gtag("event", "project_open", {
        project_title: btn.dataset.title
      });

      titleEl.textContent = btn.dataset.title;

      const descLines = btn.dataset.description.split("•").filter(line => line.trim() !== "");

      let listHTML = "<ul class='modal-points'>";

      descLines.forEach(line => {
        listHTML += `<li>${line.trim()}</li>`;
      });

      listHTML += "</ul>";

      descEl.innerHTML = listHTML;
      actionsEl.innerHTML = "";

      if (btn.dataset.video) {
        videoSource.src = btn.dataset.video;
        videoEl.load();
        videoWrapper.style.display = "block";
      } else {
        videoWrapper.style.display = "none";
      }

      if (btn.dataset.live) {
        actionsEl.innerHTML += `
    <a href="${btn.dataset.live}" target="_blank" class="live-link">Live Demo</a>
  `;

        const liveLink = actionsEl.querySelector(".live-link");

        liveLink.addEventListener("click", () => {
          gtag("event", "live_demo_click", {
            project_title: btn.dataset.title
          });
        });
      }

      modal.classList.add("active");
      document.body.style.overflow = "hidden";
    });
  });

  function closeProjectModal() {
    modal.classList.remove("active");
    document.body.style.overflow = "auto";

    videoEl.pause();
    videoEl.currentTime = 0;
    videoSource.src = "";
  }

  closeModal.addEventListener("click", closeProjectModal);

  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      closeProjectModal();
    }
  });

  // ======================
  // TIMELINE ITEM
  // ======================

  const timelineItems = document.querySelectorAll(".timeline-item");

  const revealTimeline = () => {
    const triggerBottom = window.innerHeight * 0.85;

    timelineItems.forEach(item => {
      const boxTop = item.getBoundingClientRect().top;

      if (boxTop < triggerBottom) {
        item.classList.add("visible");
      }
    });
  };

  window.addEventListener("scroll", revealTimeline);
  revealTimeline();

  // ======================
  // TIMELINE PROGRESS
  // ======================

  const timeline = document.querySelector(".timeline");
  const progress = document.getElementById("timeline-progress");

  function updateTimelineProgress() {
    const rect = timeline.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    const totalHeight = timeline.offsetHeight;
    const visible = windowHeight - rect.top;

    const percent = Math.min(Math.max(visible / totalHeight, 0), 1);

    progress.style.height = percent * 100 + "%";
  }

  window.addEventListener("scroll", updateTimelineProgress);
  updateTimelineProgress();

  // ======================
  // PLAYCARD
  // ======================

  const glowCard = document.querySelector(".play-card");

  glowCard.addEventListener("mousemove", (e) => {
    const rect = glowCard.getBoundingClientRect();
    glowCard.style.setProperty("--x", `${e.clientX - rect.left}px`);
    glowCard.style.setProperty("--y", `${e.clientY - rect.top}px`);

    glowCard.style.setProperty(
      "background",
      `radial-gradient(circle at ${e.clientX - rect.left}px ${e.clientY - rect.top}px,
      var(--shadow-glow), var(--bg-card))`
    );
  });

  // ======================
  // PIXELBOX
  // ======================

  const pixelBox = document.getElementById("pixel-box");

  const rows = 15;
  const cols = 20;

  // Create pixels
  for (let i = 0; i < rows * cols; i++) {
    const pixel = document.createElement("div");
    pixel.classList.add("pixel");

    pixel.addEventListener("mouseenter", () => {
      pixel.style.background = "var(--accent)";
      pixel.style.boxShadow = "0 0 8px var(--accent)";

      setTimeout(() => {
        pixel.style.background = "var(--bg-card)";
        pixel.style.boxShadow = "none";
      }, 500);
    });

    pixelBox.appendChild(pixel);
  }

});
