// NEXIFY DASHBOARD


document.addEventListener(
    "DOMContentLoaded",
    initializeDashboard
);

// =====================================
// MAIN FUNCTION
// =====================================

function initializeDashboard() {

    const profile =
        JSON.parse(
            localStorage.getItem(
                "nexifyProfile"
            )
        );

    if (!profile) {

        alert(
            "Please complete profile setup first."
        );

        window.location.href =
            "profile.html";

        return;
    }
    
    displayUser(profile);

    const scores =
        calculateScores(profile);

    displayScores(scores);

    generatePredictions(profile);

    initializeChart(profile);
}

// =====================================
// USER INFO
// =====================================

function displayUser(profile) {

    document.getElementById(
        "welcomeName"
    ).textContent =
        `Hello ${profile.name} 👋`;
}

// =====================================
// SCORE ENGINE
// =====================================

function calculateScores(profile) {

    const skillCount =
        profile.skills.length;

    const skillScore =
        Math.min(
            skillCount * 15,
            100
        );

    const projectScore =
        Math.min(
            profile.projects * 20,
            100
        );

    const consistencyScore =
        Math.min(
            profile.studyHours * 12,
            100
        );

    const readinessScore =
        Math.round(
            skillScore * 0.4 +
            projectScore * 0.3 +
            consistencyScore * 0.3
        );

    const growthScore =
        Math.round(
            (skillScore +
             projectScore +
             consistencyScore) / 3
        );

    return {

        skillScore,
        projectScore,
        consistencyScore,
        readinessScore,
        growthScore
    };
}

// =====================================
// DISPLAY SCORES
// =====================================

function displayScores(scores) {

    document.getElementById(
        "skillScore"
    ).textContent =
        scores.skillScore + "%";

    document.getElementById(
        "projectScore"
    ).textContent =
        scores.projectScore + "%";

    document.getElementById(
        "consistencyScore"
    ).textContent =
        scores.consistencyScore + "%";

    document.getElementById(
        "growthScore"
    ).textContent =
        scores.growthScore + "%";

    document.getElementById(
        "readinessScore"
    ).textContent =
        scores.readinessScore + "%";
}

// =====================================
// FUTURE PREDICTIONS
// =====================================

function generatePredictions(profile) {

    const study =
        profile.studyHours;

    const projects =
        profile.projects;

    let currentPath =
        `Continue current pace.
Expected growth: Moderate.`;

    let improvedPath =
        `+1 study hour daily and
+2 projects can significantly
improve your opportunities.`;

    let bestPath =
        `Consistent study,
strong portfolio and
hackathon participation
can place you among
top candidates.`;

    if (
        study >= 6 &&
        projects >= 3
    ) {

        currentPath =
            "You are already on a strong growth path.";

        improvedPath =
            "Continue building projects and networking.";

        bestPath =
            "High placement and internship potential.";
    }

    document.getElementById(
        "currentPath"
    ).textContent =
        currentPath;

    document.getElementById(
        "improvedPath"
    ).textContent =
        improvedPath;

    document.getElementById(
        "bestPath"
    ).textContent =
        bestPath;
}

// =====================================
// DSA SECTION
// =====================================

// Arrays

const studyHoursArray =
[
    2, 4, 3, 5, 6, 4, 7
];

// Prefix Sum

function buildPrefixSum(arr) {

    let prefix =
    [arr[0]];

    for (
        let i = 1;
        i < arr.length;
        i++
    ) {

        prefix[i] =
            prefix[i - 1]
            + arr[i];
    }

    return prefix;
}

const prefixHours =
    buildPrefixSum(
        studyHoursArray
    );

console.log(
    "Prefix Sum:",
    prefixHours
);

// Sliding Window

function last7DayAverage(arr) {

    let total = 0;

    for (
        let i = 0;
        i < arr.length;
        i++
    ) {

        total += arr[i];
    }

    return (
        total /
        arr.length
    );
}

console.log(
    "Average Hours:",
    last7DayAverage(
        studyHoursArray
    )
);

// Variable Sliding Window

function minDaysForTarget(
    arr,
    target
) {

    let left = 0;

    let sum = 0;

    let minLength =
        Infinity;

    for (
        let right = 0;
        right < arr.length;
        right++
    ) {

        sum += arr[right];

        while (
            sum >= target
        ) {

            minLength =
                Math.min(
                    minLength,
                    right - left + 1
                );

            sum -= arr[left];

            left++;
        }
    }

    return minLength === Infinity
        ? 0
        : minLength;
}

console.log(
    "Min Days For 20 Hours:",
    minDaysForTarget(
        studyHoursArray,
        20
    )
);

console.log(
    "🚀 Nexify Dashboard Loaded"
);
