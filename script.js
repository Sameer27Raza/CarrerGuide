// MOBILE MENU

const menuBtn = document.getElementById("menuBtn");
const nav = document.querySelector("nav");

menuBtn.addEventListener("click", function () {

    nav.classList.toggle("active");

});

// CLOSE MENU AFTER CLICKING A LINK

const navLinks = document.querySelectorAll("nav a");

navLinks.forEach(function(link) {

    link.addEventListener("click", function() {

        nav.classList.remove("active");

    });

});

// SIDEBAR ACTIVE LINK

const sections = document.querySelectorAll(
    ".article h2, .article h3"
);

const sidebarLinks = document.querySelectorAll(".sidebar a");

window.addEventListener("scroll", function() {

    let current = "";

    sections.forEach(function(section) {

        const sectionTop = section.offsetTop;

        if (window.scrollY >= sectionTop - 150) {

            current = section.getAttribute("id");

        }

    });

    sidebarLinks.forEach(function(link) {

        link.classList.remove("active");

        if (link.getAttribute("href") === "#" + current) {

            link.classList.add("active");

        }

    });

});

// =========================================================
// INTERACTIVE GRAMMAR NOTES FUNCTIONALITY
// =========================================================

document.addEventListener("DOMContentLoaded", function() {

    // 1. ACCORDION TOGGLE
    const chapterHeaders = document.querySelectorAll(".chapter-card-header");

    chapterHeaders.forEach(function(header) {
        header.addEventListener("click", function(e) {
            // Prevent double triggers if clicking directly on a button inside header
            const card = this.closest(".chapter-card");
            card.classList.toggle("open");

            const toggleText = card.querySelector(".toggle-text");
            if (toggleText) {
                toggleText.textContent = card.classList.contains("open") ? "Hide Notes" : "View Notes";
            }
        });
    });

    // 2. CATEGORY FILTER PILLS
    const filterPills = document.querySelectorAll("#filterPills .pill");
    const chapterCards = document.querySelectorAll(".chapter-card");

    filterPills.forEach(function(pill) {
        pill.addEventListener("click", function() {
            filterPills.forEach(p => p.classList.remove("active"));
            this.classList.add("active");

            const filterValue = this.getAttribute("data-filter");
            applyFilterAndSearch();
        });
    });

    // 3. SEARCH FILTER
    const searchInput = document.getElementById("notesSearch");
    const clearBtn = document.getElementById("clearSearch");

    if (searchInput) {
        searchInput.addEventListener("input", function() {
            if (clearBtn) {
                clearBtn.style.display = this.value.trim() ? "block" : "none";
            }
            applyFilterAndSearch();
        });
    }

    if (clearBtn) {
        clearBtn.addEventListener("click", function() {
            searchInput.value = "";
            clearBtn.style.display = "none";
            searchInput.focus();
            applyFilterAndSearch();
        });
    }

    // UNIFIED FILTER & SEARCH FUNCTION
    function applyFilterAndSearch() {
        const activePill = document.querySelector("#filterPills .pill.active");
        const category = activePill ? activePill.getAttribute("data-filter") : "all";
        const query = searchInput ? searchInput.value.toLowerCase().trim() : "";

        let visibleCount = 0;

        chapterCards.forEach(function(card) {
            const cardCat = card.getAttribute("data-category") || "";
            const cardText = card.textContent.toLowerCase();
            const keywords = (card.getAttribute("data-keywords") || "").toLowerCase();

            const matchesCategory = (category === "all") || (cardCat === category);
            const matchesQuery = !query || cardText.includes(query) || keywords.includes(query);

            if (matchesCategory && matchesQuery) {
                card.style.display = "block";
                visibleCount++;
                // If actively searching with query, auto-expand matching cards
                if (query.length >= 3) {
                    card.classList.add("open");
                    const toggleText = card.querySelector(".toggle-text");
                    if (toggleText) toggleText.textContent = "Hide Notes";
                }
            } else {
                card.style.display = "none";
            }
        });

        // Optional no-results handling
        let noResultsMsg = document.getElementById("noNotesResults");
        if (visibleCount === 0) {
            if (!noResultsMsg) {
                noResultsMsg = document.createElement("div");
                noResultsMsg.id = "noNotesResults";
                noResultsMsg.style.cssText = "text-align: center; padding: 40px; background: white; border-radius: 12px; margin-top: 15px; color: #64748b; font-size: 16px;";
                noResultsMsg.innerHTML = "<strong>No matching grammar topics found.</strong><br/>Try searching for words like 'Tense', 'Voice', 'Narration', 'Articles', or 'Concord'.";
                document.getElementById("chaptersGrid").appendChild(noResultsMsg);
            }
            noResultsMsg.style.display = "block";
        } else if (noResultsMsg) {
            noResultsMsg.style.display = "none";
        }
    }

});
