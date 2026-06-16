// ===============================
// NEXIFY APP.JS
// ===============================

// Wait for page load

document.addEventListener("DOMContentLoaded", () => {

    initializeChart();
    animateCounters();
    revealOnScroll();

});

// ===============================
// GROWTH ANALYTICS CHART
// ===============================

function initializeChart() {

    const chartCanvas =
        document.getElementById("growthChart");

    if (!chartCanvas) return;

    new Chart(chartCanvas, {

        type: "line",

        data: {

            labels: [
                "Mon",
                "Tue",
                "Wed",
                "Thu",
                "Fri",
                "Sat",
                "Sun"
            ],

            datasets: [

                {
                    label: "Study Hours",

                    data: [2, 4, 3, 5, 6, 4, 7],

                    borderColor: "#7c3aed",

                    backgroundColor:
                        "rgba(124,58,237,0.15)",

                    fill: true,

                    tension: 0.4,

                    borderWidth: 3,

                    pointRadius: 5,

                    pointHoverRadius: 8
                }

            ]
        },

        options: {

            responsive: true,

            plugins: {

                legend: {
                    labels: {
                        color: "#f8fafc"
                    }
                }
            },

            scales: {

                x: {
                    ticks: {
                        color: "#94a3b8"
                    },

                    grid: {
                        color: "rgba(255,255,255,.05)"
                    }
                },

                y: {
                    beginAtZero: true,

                    ticks: {
                        color: "#94a3b8"
                    },

                    grid: {
                        color: "rgba(255,255,255,.05)"
                    }
                }
            }
        }
    });

}

// ===============================
// COUNTER ANIMATION
// ===============================

function animateCounters() {

    const counters =
        document.querySelectorAll(".stat-card h2");

    counters.forEach(counter => {

        const targetText =
            counter.innerText;

        const numericValue =
            parseInt(targetText);

        if (isNaN(numericValue))
            return;

        let current = 0;

        const increment =
            numericValue / 80;

        const updateCounter = () => {

            if (current < numericValue) {

                current += increment;

                counter.innerText =
                    Math.floor(current) +
                    (targetText.includes("%")
                        ? "%"
                        : "+");

                requestAnimationFrame(
                    updateCounter
                );

            } else {

                counter.innerText =
                    targetText;
            }
        };

        updateCounter();

    });

}

// ===============================
// REVEAL ANIMATION
// ===============================

function revealOnScroll() {

    const revealElements =
        document.querySelectorAll(
            ".feature-card, .stat-card, .timeline-card, .glass"
        );

    const observer =
        new IntersectionObserver(

            entries => {

                entries.forEach(entry => {

                    if (entry.isIntersecting) {

                        entry.target.classList.add(
                            "show"
                        );
                    }
                });

            },

            {
                threshold: 0.15
            }

        );

    revealElements.forEach(element => {

        element.classList.add("hidden");

        observer.observe(element);

    });

}

// ===============================
// SMOOTH NAVIGATION
// ===============================

document
    .querySelectorAll('a[href^="#"]')
    .forEach(anchor => {

        anchor.addEventListener(
            "click",
            function (e) {

                e.preventDefault();

                const target =
                    document.querySelector(
                        this.getAttribute("href")
                    );

                if (!target) return;

                target.scrollIntoView({
                    behavior: "smooth"
                });

            }
        );

    });

// ===============================
// NAVBAR EFFECT
// ===============================

window.addEventListener("scroll", () => {

    const navbar =
        document.querySelector(".navbar");

    if (!navbar) return;

    if (window.scrollY > 50) {

        navbar.style.boxShadow =
            "0 10px 30px rgba(0,0,0,.3)";

    } else {

        navbar.style.boxShadow = "none";
    }

});

// ===============================
// FLOATING EFFECT
// ===============================

const cards =
    document.querySelectorAll(".feature-card");

cards.forEach(card => {

    card.addEventListener("mousemove", e => {

        const rect =
            card.getBoundingClientRect();

        const x =
            e.clientX - rect.left;

        const y =
            e.clientY - rect.top;

        const rotateY =
            ((x / rect.width) - 0.5) * 10;

        const rotateX =
            ((y / rect.height) - 0.5) * -10;

        card.style.transform =
            `perspective(1000px)
            rotateX(${rotateX}deg)
            rotateY(${rotateY}deg)
            translateY(-5px)`;

    });

    card.addEventListener("mouseleave", () => {

        card.style.transform =
            "perspective(1000px) rotateX(0deg) rotateY(0deg)";
    });

});

// ===============================
// CONSOLE MESSAGE
// ===============================

console.log(
    "%c🚀 Nexify Loaded Successfully",
    "color:#7c3aed;font-size:18px;font-weight:bold"
);
