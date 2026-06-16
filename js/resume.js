const DIFY_CONFIG = {

    API_URL:
    "https://api.dify.ai/v1/workflows/run",

    API_KEY:
    "app-dw3GZEmS4ixpfiJHmoST5Ev2"
};

const analyzeBtn =
document.getElementById(
    "analyzeBtn"
);

analyzeBtn.addEventListener(

    "click",

    analyzeResume
);

async function analyzeResume(){

    const fileInput =
    document.getElementById(
        "resumeFile"
    );

    const careerGoal =
    document.getElementById(
        "careerGoal"
    ).value;

    const jobDescription =
    document.getElementById(
        "jobDescription"
    ).value;

    if(
        !fileInput.files.length
    ){

        alert(
            "Please upload a resume PDF."
        );

        return;
    }

    analyzeBtn.disabled = true;

    analyzeBtn.innerHTML =
    "🤖 Analyzing...";

    try{

        const file =
        fileInput.files[0];

        const uploadResponse =
        await uploadFile(
            file
        );

        const fileId =
        uploadResponse.id;
        
        const response = await fetch(
  "https://api.dify.ai/v1/workflows/run",
  {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer app-dw3GZEmS4ixpfiJHmoST5Ev2"
      },
      body: JSON.stringify({
          inputs: {
              CareerGoal: careerGoal,
              jobDescription: jobDescription,
              resumeFile: {
                  type: "document",
                  transfer_method: "local_file",
                  upload_file_id: fileId
              }
          },
          response_mode: "blocking",
          user: "nexify-user"
      })
  }
);

        const data =
        await response.json();


        processAnalysis(
            data
        );

    }

    catch(error){

        console.error(
            error
        );

        alert(
            "Analysis failed."
        );
    }

    finally{

        analyzeBtn.disabled = false;

        analyzeBtn.innerHTML =
        "Analyze Resume";
    }
}

async function uploadFile(file){

    const formData =
    new FormData();

    formData.append(
        "file",
        file
    );

    formData.append(
        "user",
        "nexify-user"
    );

    const response =
    await fetch(

        "https://api.dify.ai/v1/files/upload",

        {

            method:"POST",

            headers:{

                "Authorization":
                "Bearer app-dw3GZEmS4ixpfiJHmoST5Ev2"
            },

            body:formData
        }
    );

    if(
        !response.ok
    ){

        throw new Error(
            "File upload failed"
        );
    }

    return await response.json();
}

function processAnalysis(data) {

    try {

        

        if (!data?.data?.outputs) {
            alert("Outputs not found.");
            return;
        }

        let result = data.data.outputs;

        // Dify returns { result: "```json ... ```" }
        if (result.result) {

            let jsonText = result.result
                .replace(/```json/g, "")
                .replace(/```/g, "")
                .trim();

            result = JSON.parse(jsonText);
        }


        updateUI(result);

    } catch (error) {

        console.error(error);
        alert("Invalid AI response.");
    }
}

function updateUI(result){

    document.getElementById("atsScore").textContent =
        (result.atsScore ?? 0) + "%";

    document.getElementById("matchPercentage").textContent =
        (result.matchPercentage ?? result.atsScore ?? 0) + "%";

    document.getElementById("resumeLevel").textContent =
        result.resumeLevel ?? "Junior";

    renderList(
        "strengthsList",
        result.strengths ?? []
    );

    renderList(
        "weakAreasList",
        result.weakAreas ?? []
    );

    const missingSkills = Array.isArray(result.missingSkills)
    ? result.missingSkills
    : [
        ...(result.missingSkills?.technical || []),
        ...(result.missingSkills?.soft || [])
      ];

    renderMissingSkills(missingSkills);

    renderOptimizedSkills(
        result.optimizedSkills ??
        result.recommendedSkills ??
        []
    );

    renderRoadmap(
        result.roadmap30Days ??
        []
    );

    document.getElementById("interviewReadiness").textContent =
        result.interviewReadiness ??
        "No interview analysis available.";

    document.getElementById("finalVerdict").textContent =
        result.finalVerdict ??
        "Resume needs improvement before applying.";
        
   createResumeChart(result);
}
function renderList(

    elementId,

    items

){

    const element =
    document.getElementById(
        elementId
    );

    element.innerHTML = "";

    if(
        !items ||
        items.length === 0
    ){

        element.innerHTML =

        "<li>No Data Found</li>";

        return;
    }

    items.forEach(

        item => {

            element.innerHTML +=

            `
            <li>
                ${item}
            </li>
            `;
        }
    );
}

function renderMissingSkills(skills) {

    const container =
        document.getElementById("missingSkills");

    if (!container) {
        console.error("missingSkills element not found");
        return;
    }

    container.innerHTML = skills
        .map(skill => `
            <span class="skill-tag">
                ${skill}
            </span>
        `)
        .join("");
}
function renderOptimizedSkills(
    skills
){

    const container =
    document.getElementById(
        "optimizedSkills"
    );

    container.innerHTML = "";

    if(
        !skills
    ) return;

    skills.forEach(

        skill => {

            container.innerHTML +=

            `
            <span
            class="optimized-tag">

                ${skill}

            </span>
            `;
        }
    );
}

function renderRoadmap(
    roadmap
){

    const container =
    document.getElementById(
        "roadmapContainer"
    );

    container.innerHTML = "";

    if(
        !roadmap
    ) return;

    roadmap.forEach(

        (
            step,
            index
        ) => {

            container.innerHTML +=

            `
            <div
            class="
            roadmap-card
            ">

                <h3>

                    Step
                    ${index + 1}

                </h3>

                <p>

                    ${step}

                </p>

            </div>
            `;
        }
    );
}

let resumeChart = null;

function createResumeChart(result){

    const chartCanvas =
    document.getElementById(
        "resumeChart"
    );

    if(!chartCanvas) return;

    if(resumeChart){

        resumeChart.destroy();
    }

    const ats =
    result.atsScore ?? 0;

    const skills =
    Math.min(
        ats + 10,
        100
    );

    const projects =
    Math.max(
        ats - 5,
        0
    );

    const keywords =
    result.matchPercentage ??
    ats;

    const experience =
    Math.max(
        ats - 20,
        0
    );

    const interview =
    Math.min(
        ats + 5,
        100
    );

    const education =
    Math.max(
        ats - 10,
        0
    );

    const scores = [

        ats,

        skills,

        projects,

        keywords,

        experience,

        interview,

        education
    ];

    const labels = [

        "ATS",

        "Skills",

        "Projects",

        "Keywords",

        "Experience",

        "Interview",

        "Education"
    ];

    resumeChart =
    new Chart(
        chartCanvas,
        {
            type:"line",

            data:{

                labels,

                datasets:[{

                    label:
                    "AI Analysis",

                    data:scores,

                    borderColor:
                    "#8b5cf6",

                    backgroundColor:
                    "rgba(139,92,246,.15)",

                    fill:true,

                    tension:0.45,

                    pointRadius:6,

                    pointHoverRadius:10,

                    pointBackgroundColor:[
                        "#06b6d4",
                        "#10b981",
                        "#f59e0b",
                        "#8b5cf6",
                        "#ef4444",
                        "#ec4899",
                        "#6366f1"
                    ],

                    pointBorderWidth:3,

                    pointBorderColor:
                    "#ffffff"
                }]
            },

            options:{

                responsive:true,

                maintainAspectRatio:false,

                interaction:{
                    intersect:false,
                    mode:"index"
                },

                plugins:{

                    legend:{
                        display:false
                    },

                    tooltip:{

                        backgroundColor:
                        "#0f172a",

                        borderColor:
                        "#8b5cf6",

                        borderWidth:1,

                        padding:12,

                        callbacks:{

                            label:function(context){

                                return (
                                    context.label +
                                    ": " +
                                    context.raw +
                                    "%"
                                );
                            }
                        }
                    }
                },

                scales:{

                    y:{

                        min:0,

                        max:100,

                        ticks:{
                            color:"#94a3b8"
                        },

                        grid:{
                            color:
                            "rgba(255,255,255,.05)"
                        }
                    },

                    x:{

                        ticks:{
                            color:"#94a3b8"
                        },

                        grid:{
                            display:false
                        }
                    }
                }
            }
        }
    );

    updateGraphSummary(
        labels,
        scores
    );
}

function updateGraphSummary(
    labels,
    scores
){

    const maxScore =
    Math.max(...scores);

    const minScore =
    Math.min(...scores);

    const strongest =
    labels[
        scores.indexOf(
            maxScore
        )
    ];

    const weakest =
    labels[
        scores.indexOf(
            minScore
        )
    ];

    document
    .getElementById(
        "strongestArea"
    )
    .textContent =
    strongest +
    " (" +
    maxScore +
    "%)";

    document
    .getElementById(
        "weakestArea"
    )
    .textContent =
    weakest +
    " (" +
    minScore +
    "%)";

    document
    .getElementById(
        "growthPotential"
    )
    .textContent =
    "+" +
    (100 - minScore) +
    " Points";
}
