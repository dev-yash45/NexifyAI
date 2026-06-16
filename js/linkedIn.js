const DIFY_CONFIG = {

    API_URL:
    "https://api.dify.ai/v1/workflows/run",

    API_KEY:
    "app-eFmoNsjwcBM6z28DkrreKfOb"
};

const analyzeBtn =
document.getElementById(
    "analyzeLinkedInBtn"
);

analyzeBtn.addEventListener(

    "click",

    analyzeLinkedIn
);

async function analyzeLinkedIn(){

    const fileInput =
    document.getElementById(
        "linkedinFile"
    );

    if(
        !fileInput.files.length
    ){

        alert(
            "Please upload a LinkedIn PDF."
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
        await uploadFile(file);

        const fileId =
        uploadResponse.id;

        const response =
        await fetch(

            "https://api.dify.ai/v1/workflows/run",

            {

                method:"POST",

                headers:{

                    "Content-Type":
                    "application/json",

                    "Authorization":
                    "Bearer app-eFmoNsjwcBM6z28DkrreKfOb"
                },

                body:JSON.stringify({

                   inputs:{
    linkedInPdf:{
        type:"document",
        transfer_method:"local_file",
        upload_file_id:fileId
    }
},

                    response_mode:
                    "blocking",

                    user:
                    "nexify-user"
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
            "Analysis Failed"
        );
    }

    finally{

        analyzeBtn.disabled =
        false;

        analyzeBtn.innerHTML =
        "Analyze LinkedIn Profile";
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
                "Bearer app-eFmoNsjwcBM6z28DkrreKfOb"
            },

            body:formData
        }
    );

    if(
        !response.ok
    ){

        throw new Error(
            "File Upload Failed"
        );
    }

    return await response.json();
}

function processAnalysis(data){

    try{

        let result =
            data.data?.outputs?.text ||
            data.data?.outputs?.result ||
            data.data?.outputs?.answer ||
            data.data?.outputs;

        if(typeof result === "object"){

            result =
                result.Result ||
                result.result ||
                result.answer;
        }

        const cleanOutput =
            result
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();

        const analysis =
            JSON.parse(cleanOutput);


        updateLinkedInUI(
            analysis
        );

    }

    catch(error){

        console.error(error);

        alert(
            "Invalid AI Response"
        );
    }
}

function updateLinkedInUI(result){

    document
    .getElementById(
        "profileScore"
    )
    .textContent =

    (result.profileScore ?? 0)
    + "%";

    document
    .getElementById(
        "headlineScore"
    )
    .textContent =

    (result.headlineScore ?? 0)
    + "%";

    document
    .getElementById(
        "keywordScore"
    )
    .textContent =

    (result.keywordOptimization ?? 0)
    + "%";

    document
    .getElementById(
        "networkStrength"
    )
    .textContent =

    (result.networkStrength ?? 0)
    + "%";

    document
    .getElementById(
        "profileLevel"
    )
    .textContent =

    result.profileLevel ??
    "Unknown";

    document
    .getElementById(
        "aboutSectionScore"
    )
    .textContent =

    (result.aboutSectionScore ?? 0)
    + "%";

    renderList(
        "strengthsList",
        result.strengths ?? []
    );

    renderList(
        "weakAreasList",
        result.weakAreas ?? []
    );

    renderList(
        "improvementsList",
        result.improvements ?? []
    );

    renderKeywordTags(
        result.keywordSuggestions ?? []
    );

    document
    .getElementById(
        "optimizedHeadline"
    )
    .textContent =

    result.optimizedHeadline ??
    "No headline generated.";

    document
    .getElementById(
        "optimizedAbout"
    )
    .textContent =

    result.optimizedAbout ??
    "No about section generated.";

    document
    .getElementById(
        "finalVerdict"
    )
    .textContent =

    result.finalVerdict ??
    "No verdict available.";
    
    updateLinkedInGraph(result);
}

function renderList(

    elementId,

    items

){

    const element =
    document.getElementById(
        elementId
    );

    if(
        !element
    ) return;

    element.innerHTML = "";

    if(
        !items.length
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

function renderKeywordTags(
    keywords
){

    const container =
    document.getElementById(
        "keywordSuggestions"
    );

    if(
        !container
    ) return;

    container.innerHTML = "";

    keywords.forEach(

        keyword => {

            container.innerHTML +=

            `
            <span
            class="keyword-tag">

                ${keyword}

            </span>
            `;
        }
    );
}

let linkedInChart = null;

function updateLinkedInGraph(result){

    const labels = [
        "Profile",
        "Headline",
        "Keywords",
        "Network",
        "About",
        "Visibility",
        "Engagement"
    ];

    const scores = [
        result.profileScore || 0,
        result.headlineScore || 0,
        result.keywordOptimization || 0,
        result.networkStrength || 0,
        result.aboutSectionScore || 0,
        result.visibilityScore || 40,
        result.engagementScore || 35
    ];

    const strongestIndex =
    scores.indexOf(
        Math.max(...scores)
    );

    const weakestIndex =
    scores.indexOf(
        Math.min(...scores)
    );

    document.getElementById(
        "linkedinStrongest"
    ).textContent =
    `${labels[strongestIndex]} (${scores[strongestIndex]}%)`;

    document.getElementById(
        "linkedinWeakest"
    ).textContent =
    `${labels[weakestIndex]} (${scores[weakestIndex]}%)`;

    document.getElementById(
        "linkedinPotential"
    ).textContent =
    `+${100 - result.profileScore} Points`;



    const ctx =
    document
    .getElementById(
        "linkedinChart"
    )
    .getContext("2d");



    if(linkedInChart){
        linkedInChart.destroy();
    }



    linkedInChart =
    new Chart(ctx,{

        type:"line",

        data:{

            labels,

            datasets:[{

                label:
                "LinkedIn Analysis",

                data:scores,

                borderColor:
                "#00c6ff",

                borderWidth:4,

                fill:true,

                tension:0.45,

                pointRadius:8,

                pointHoverRadius:12,

                pointBorderWidth:3,

                pointBackgroundColor:[
                    "#00c6ff",
                    "#22c55e",
                    "#f59e0b",
                    "#8b5cf6",
                    "#ef4444",
                    "#ec4899",
                    "#ffffff"
                ],

                pointBorderColor:
                "#ffffff",

                backgroundColor:
                (context)=>{

                    const chart =
                    context.chart;

                    const {
                        ctx,
                        chartArea
                    } = chart;

                    if(
                        !chartArea
                    ){
                        return null;
                    }

                    const gradient =
                    ctx.createLinearGradient(
                        0,
                        0,
                        0,
                        chartArea.bottom
                    );

                    gradient.addColorStop(
                        0,
                        "rgba(0,198,255,.35)"
                    );

                    gradient.addColorStop(
                        1,
                        "rgba(0,198,255,.02)"
                    );

                    return gradient;
                }

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
                    "#00c6ff",

                    borderWidth:1,

                    padding:14,

                    displayColors:true,

                    callbacks:{

                        label:function(context){

                            return `${context.label}: ${context.parsed.y}%`;
                        }
                    }
                }
            },

            scales:{

                y:{

                    beginAtZero:true,

                    max:100,

                    ticks:{
                        color:"#94a3b8"
                    },

                    grid:{
                        color:"rgba(255,255,255,.05)"
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
    });
}
