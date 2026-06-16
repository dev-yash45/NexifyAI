// ======================================
// NEXIFY PROFILE SYSTEM
// ======================================

const profileForm =
document.getElementById("profileForm");

// ======================================
// FORM SUBMIT
// ======================================

profileForm.addEventListener(
"submit",
function(event){

    event.preventDefault();

    saveProfile();

}
);

// ======================================
// SAVE PROFILE
// ======================================

function saveProfile(){

    const userProfile = {

        name:
        document
        .getElementById("name")
        .value
        .trim(),

        year:
        document
        .getElementById("year")
        .value,

        branch:
        document
        .getElementById("branch")
        .value,

        skills:
        document
        .getElementById("skills")
        .value
        .split(",")
        .map(skill => skill.trim()),

        studyHours:
        Number(
            document
            .getElementById("studyHours")
            .value
        ),

        projects:
        Number(
            document
            .getElementById("projects")
            .value
        ),

        goal:
        document
        .getElementById("goal")
        .value,

        createdAt:
        new Date().toISOString()
    };

    // Validation

    if(
        userProfile.name === "" ||
        userProfile.studyHours <= 0
    ){
        alert(
        "Please fill all required fields."
        );
        return;
    }

    // Save to Local Storage

    localStorage.setItem(
        "nexifyProfile",
        JSON.stringify(userProfile)
    );

    // Success Message

    alert(
        "Profile Saved Successfully 🚀"
    );

    // Redirect

    window.location.href =
    "dashboard.html";
}

// ======================================
// LOAD EXISTING PROFILE
// ======================================

window.addEventListener(
"DOMContentLoaded",
loadProfile
);

function loadProfile(){

    const savedProfile =
    JSON.parse(
        localStorage.getItem(
            "nexifyProfile"
        )
    );

    if(!savedProfile)
    return;

    document
    .getElementById("name")
    .value =
    savedProfile.name || "";

    document
    .getElementById("year")
    .value =
    savedProfile.year || "";

    document
    .getElementById("branch")
    .value =
    savedProfile.branch || "";

    document
    .getElementById("skills")
    .value =
    savedProfile.skills
    ? savedProfile.skills.join(", ")
    : "";

    document
    .getElementById("studyHours")
    .value =
    savedProfile.studyHours || "";

    document
    .getElementById("projects")
    .value =
    savedProfile.projects || "";

    document
    .getElementById("goal")
    .value =
    savedProfile.goal || "";
}

// ======================================
// DEBUG
// ======================================

console.log(
"🚀 Nexify Profile System Loaded"
);
