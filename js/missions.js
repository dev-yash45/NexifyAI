
// NEXIFY AI DAILY GROWTH ENGINE
// PART 1 - CORE SETUP
// ======================================

document.addEventListener(
    "DOMContentLoaded",
    initializeMissionEngine
);

// ======================================
// DIFY CONFIG
// ======================================

// ======================================
// STORAGE KEYS
// ======================================

const STORAGE_KEYS = {

    profile:
    "nexifyProfile",

    xp:
    "nexifyXP",

    completed:
    "nexifyCompletedMissions",

    missions:
    "nexifyDailyMissions",

    lastDate:
    "nexifyMissionDate"
};

// ======================================
// GLOBAL STATE
// ======================================

let currentProfile = null;

let currentMissions = [];

let totalXP = 0;

// ======================================
// INIT
// ======================================

function initializeMissionEngine(){

    loadProfile();

    loadXP();

    setupCareerSelector();

    checkNewDay();

    updateXPUI();

    loadSavedMissions();
}

// ======================================
// PROFILE
// ======================================

function loadProfile(){

    currentProfile =
    JSON.parse(
        localStorage.getItem(
            STORAGE_KEYS.profile
        )
    );

    if(!currentProfile){

        alert(
            "Complete profile setup first."
        );

        window.location.href =
        "profile.html";

        return;
    }

    document.getElementById(
        "targetCareer"
    ).textContent =
    currentProfile.goal;
}

// ======================================
// XP
// ======================================

function loadXP(){

    totalXP =
    Number(

        localStorage.getItem(
            STORAGE_KEYS.xp
        )

    ) || 0;
}

function saveXP(){

    localStorage.setItem(

        STORAGE_KEYS.xp,

        totalXP
    );
}

function updateXPUI(){

    document.getElementById(
        "xpPoints"
    ).textContent =

    totalXP + " XP";
}

// ======================================
// CAREER DROPDOWN
// ======================================

function setupCareerSelector(){

    const selector =
    document.getElementById(
        "careerTrack"
    );

    if(currentProfile.goal){

        selector.value =
        currentProfile.goal;
    }
}

// ======================================
// DATE SYSTEM
// ======================================

function getTodayDate(){

    return new Date()

    .toISOString()

    .split("T")[0];
}

function checkNewDay(){

    const today =
    getTodayDate();

    const savedDate =
    localStorage.getItem(
        STORAGE_KEYS.lastDate
    );

    if(savedDate !== today){

        localStorage.removeItem(
            STORAGE_KEYS.missions
        );

        localStorage.removeItem(
            STORAGE_KEYS.completed
        );

        localStorage.setItem(

            STORAGE_KEYS.lastDate,

            today
        );
    }
}

// ======================================
// LOAD SAVED MISSIONS
// ======================================

function loadSavedMissions(){

    const saved =
    JSON.parse(

        localStorage.getItem(
            STORAGE_KEYS.missions
        )

    );

    if(!saved){

        return;
    }

    currentMissions =
    saved;

    renderMissions();

    updateProgress();
}

// ======================================
// STATUS
// ======================================

function setAIStatus(message){

    document.getElementById(
        "aiStatus"
    ).textContent =
    message;
}

// ======================================
// PART 2 - DIFY API
// ======================================
const targetCareer =
document.getElementById(
"targetCareer"
);
document
.getElementById(
    "generateMissionBtn"
)
.addEventListener(
    "click",
    generateAIMissions
);

// ======================================
// GENERATE MISSIONS
// ======================================

async function generateAIMissions(){

    try{

        setAIStatus(
            "🤖 AI is analyzing your profile..."
        );

        document
        .getElementById(
            "generateMissionBtn"
        )
        .disabled = true;

        const completed =
        JSON.parse(

            localStorage.getItem(
                STORAGE_KEYS.completed
            )

        ) || [];

        const selectedCareer =
        document
        .getElementById(
            "careerTrack"
        )
        .value;
    
        const previousCareer =
        localStorage.getItem("selectedCareer");

        if(previousCareer !== selectedCareer){

            localStorage.removeItem(
             STORAGE_KEYS.completed
             );

            localStorage.setItem(
            "selectedCareer",
            selectedCareer
            );
        }
        
        document.getElementById(
        "targetCareer"
        ).textContent =
        selectedCareer;
        
        const response =
        await fetch(

            DIFY_CONFIG.API_URL,

            {

                method:"POST",

                headers:{

                    "Content-Type":
                    "application/json",

                    "Authorization":
                    `Bearer ${DIFY_CONFIG.API_KEY}`
                },

                body:JSON.stringify({

                    inputs:{

                        career:
                        selectedCareer,

                        skills:
                        currentProfile.skills.join(
                            ", "
                        ),

                        projects:
                        currentProfile.projects,

                        studyHours:
                        currentProfile.studyHours,

                        xp:
                        totalXP,

                        completedMissions:
                        completed.join(
                            ", "
                        )
                    },

                    response_mode:
                    "blocking",

                    user:
                    "nexify-user"
                })
            }
        );

        if(
            !response.ok
        ){

            throw new Error(
                "API Request Failed"
            );
        }

        const data =
        await response.json();

        console.log(
            "Dify Response:",
            data
        );

        processAIResponse(
            data
        );

    }

    catch(error){

        console.error(
            error
        );

        setAIStatus(
            "❌ Failed to generate missions"
        );

        alert(
            "Unable to connect with AI."
        );
    }

    finally{

        document
        .getElementById(
            "generateMissionBtn"
        )
        .disabled = false;
    }
}

// ======================================
// PROCESS RESPONSE
// ======================================

function processAIResponse(
    response
){

    const result =

    response.data?.outputs?.result ||

    response.outputs?.result ||

    response.result ||

    response.data ||

    response;

    console.log(
        "Processed Result:",
        result
    );

    updateAnalysis(
        result
    );

    currentMissions =
    result.missions || [];

    localStorage.setItem(

        STORAGE_KEYS.missions,

        JSON.stringify(
            currentMissions
        )
    );

    renderMissions();

    updateProgress();

    setAIStatus(
        "✅ AI missions generated successfully"
    );
}

// ======================================
// ANALYSIS UI
// ======================================

function updateAnalysis(
    data
){

    document.getElementById(
        "userLevel"
    ).textContent =
    data.level || "--";

    document.getElementById(
        "careerMatch"
    ).textContent =
    (data.careerMatch || 0)
    + "%";

    document.getElementById(
        "focusArea"
    ).textContent =
    data.focusArea || "--";

    document.getElementById(
        "weakestSkill"
    ).textContent =
    data.weakestSkill || "--";

    document.getElementById(
        "aiInsight"
    ).textContent =
    data.insight ||

    "No AI insight available.";

    updateReadiness(
        data
    );
}

// ======================================
// READINESS SCORE
// ======================================

function updateReadiness(
    data
){

    const careerMatch =
    Number(
        data.careerMatch
    ) || 0;

    const readiness =

        careerMatch * 0.5 +

        Math.min(
            currentProfile.projects * 10,
            25
        ) +

        Math.min(
            currentProfile.studyHours * 5,
            25
        );

    document.getElementById(
        "readinessScore"
    ).textContent =

    Math.round(
        readiness
    ) + "%";

    document.getElementById(
        "nextLevel"
    ).textContent =

        getNextLevel();
}

// ======================================
// PART 3 - RENDER MISSIONS
// ======================================

function renderMissions(){

    const container =
    document.getElementById(
        "missionContainer"
    );

    container.innerHTML = "";

    if(
        !currentMissions ||
        currentMissions.length === 0
    ){

        container.innerHTML = `

        <div class="glass mission-card">

            <h3>
                No Missions Found
            </h3>

            <p>
                Generate AI missions first.
            </p>

        </div>

        `;

        return;
    }

    const selectedCareer =
    document.getElementById(
    "careerTrack"
    ).value;

    const storageKey =
    `completed_${selectedCareer}`;

    const completed =
    JSON.parse(

        localStorage.getItem(
        storageKey
    )

    ) || [];

    let totalTime = 0;
    let totalReward = 0;

    currentMissions.forEach(

        (
            mission,
            index
        ) => {

            totalTime +=
            Number(
                mission.duration
            ) || 0;

            totalReward +=
            Number(
                mission.xpReward
            ) || 0;

            const missionId =
            String(index);

            const isCompleted =

            completed.includes(
                missionId
            );

            container.innerHTML += `

            <div class="
                mission-card
                glass
                ${
                    isCompleted
                    ? "completed"
                    : ""
                }
            ">

                <h3>

                    Step ${index + 1}

                    <br><br>

                    ${mission.title}

                </h3>

                <p>

                    ${mission.description}

                </p>

                <div
                    class="badge-container">

                    <span
                    class="
                    badge
                    ${getDifficultyClass(
                        mission.difficulty
                    )}
                    ">

                    ${mission.difficulty}

                    </span>

                    <span
                    class="badge">

                    ⏱
                    ${mission.duration}
                    min

                    </span>

                    <span
                    class="badge">

                    ⚡
                    +${mission.xpReward}
                    XP

                    </span>

                </div>

                <p>

                    <strong>
                    Why?
                    </strong>

                    ${mission.reason}

                </p>

                ${
                    isCompleted

                    ?

                    `
                    <button
                    disabled
                    class="
                    complete-btn
                    ">

                    Completed

                    </button>
                    `

                    :

                    `
                    <button

                    class="
                    complete-btn
                    "

                    onclick=
                    "completeMission(
                    '${missionId}',
                    ${mission.xpReward}
                    )">

                    Mark Complete

                    </button>
                    `
                }

            </div>

            `;
        }
    );

    updateSummary(

        totalTime,

        totalReward
    );

    updateFutureProjection();
}

// ======================================
// BADGE COLOR
// ======================================

function getDifficultyClass(
    difficulty
){

    if(
        !difficulty
    ){

        return "easy";
    }

    difficulty =
    difficulty.toLowerCase();

    if(
        difficulty.includes(
            "beginner"
        )
    ){

        return "easy";
    }

    if(
        difficulty.includes(
            "intermediate"
        )
    ){

        return "medium";
    }

    return "hard";
}

// ======================================
// SUMMARY
// ======================================

function updateSummary(

    totalTime,

    totalReward
){

    document
    .getElementById(
        "estimatedTime"
    )
    .textContent =

    totalTime + " Min";

    document
    .getElementById(
        "rewardPoints"
    )
    .textContent =

    "+" +

    totalReward +

    " XP";
}

// ======================================
// FUTURE PROJECTION
// ======================================

function updateFutureProjection(){

    const level =
    document
    .getElementById(
        "userLevel"
    )
    .textContent;

    let prediction = "";

    if(
        level ===
        "Beginner"
    ){

        prediction =

        "Continue completing missions daily and you can reach Intermediate level within a few weeks.";
    }

    else if(
        level ===
        "Intermediate"
    ){

        prediction =

        "Your skills are growing steadily. Consistency can make you job-ready much faster.";
    }

    else{

        prediction =

        "You are approaching professional-level capability. Focus on portfolio projects and real-world experience.";
    }

    document
    .getElementById(
        "futureProjection"
    )
    .textContent =

    prediction;
}

// ======================================
// PART 4 - XP SYSTEM
// ======================================

function completeMission(

    missionId,

    reward

){

    const selectedCareer =
    document.getElementById(
        "careerTrack"
    ).value;

    const storageKey =
    `completed_${selectedCareer}`;

    let completed =
    JSON.parse(

        localStorage.getItem(
            storageKey
        )

    ) || [];

    if(

        completed.includes(
            missionId
        )

    ){

        return;
    }

    completed.push(
        missionId
    );

    localStorage.setItem(

        storageKey,

        JSON.stringify(
            completed
        )
    );

    totalXP +=
    Number(reward);

    saveXP();

    updateXPUI();

    updateProgress();

    renderMissions();
}

// ======================================
// PROGRESS SYSTEM
// ======================================

function updateProgress(){

    const selectedCareer =
    document.getElementById(
        "careerTrack"
    ).value;

    const storageKey =
    `completed_${selectedCareer}`;

    const completed =
    JSON.parse(

        localStorage.getItem(
            storageKey
        )

    ) || [];

    const total =
    currentMissions.length;

    const done =
    completed.length;

    const progress =

    total === 0

    ? 0

    : Math.round(

        (
            done / total
        ) * 100

    );

    document
    .getElementById(
        "progressText"
    )
    .textContent =

    `${done} / ${total} Completed`;

    document
    .getElementById(
        "progressFill"
    )
    .style.width =

    progress + "%";

    checkCompletion(
        done,
        total
    );
}
// ======================================
// ALL MISSIONS COMPLETED
// ======================================

function checkCompletion(

    done,

    total

){

    const section =
    document.getElementById(
        "completionSection"
    );

    if(

        total > 0 &&

        done === total

    ){

        section.style.display =
        "block";

        setAIStatus(
            "🎉 All missions completed!"
        );
    }

    else{

        section.style.display =
        "none";
    }
}

// ======================================
// LEVEL SYSTEM
// ======================================

function getCurrentLevel(){

    if(totalXP < 100){

        return "Beginner";
    }

    if(totalXP < 300){

        return "Intermediate";
    }

    if(totalXP < 700){

        return "Advanced";
    }

    return "Expert";
}

// ======================================
// NEXT LEVEL
// ======================================

function getNextLevel(){

    if(totalXP < 100){

        return (

            100 - totalXP

        ) + " XP Left";
    }

    if(totalXP < 300){

        return (

            300 - totalXP

        ) + " XP Left";
    }

    if(totalXP < 700){

        return (

            700 - totalXP

        ) + " XP Left";
    }

    return "MAX LEVEL";
}

// ======================================
// XP UI
// ======================================

function updateXPUI(){

    document
    .getElementById(
        "xpPoints"
    )
    .textContent =

    totalXP + " XP";

    document
    .getElementById(
        "nextLevel"
    )
    .textContent =

    getNextLevel();
}

// ======================================
// DAILY RESET CHECK
// ======================================

function resetDailyProgress(){

    localStorage.removeItem(
        STORAGE_KEYS.completed
    );

    localStorage.removeItem(
        STORAGE_KEYS.missions
    );

    document
    .getElementById(
        "completionSection"
    )
    .style.display =
    "none";
}

// ======================================
// AUTO LOAD PROGRESS
// ======================================

window.addEventListener(

    "load",

    () => {

        updateXPUI();

        updateProgress();
    }
);

// ======================================
// DEBUG
// ======================================

console.log(
    "🚀 Nexify Mission Engine Loaded"
);
