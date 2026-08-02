(() => {
  const rows = document.querySelectorAll(".writing-row");
  if (!("IntersectionObserver" in window) || rows.length === 0) {
    rows.forEach((row) => row.classList.add("is-in"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          observer.unobserve(entry.target);
        }
      }
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.15 },
  );

  rows.forEach((row) => observer.observe(row));

  const topbar = document.querySelector(".topbar");
  if (topbar) {
    const onScroll = () => {
      topbar.style.borderBottomColor =
        window.scrollY > 12 ? "rgba(217, 226, 221, 0.14)" : "transparent";
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }
})();
