
// NEXIFY SKILL GAP ANALYZER


const careerSkills = {

"Frontend Developer":[
{skill:"HTML",importance:100},
{skill:"CSS",importance:95},
{skill:"JavaScript",importance:100},
{skill:"React",importance:95},
{skill:"Git",importance:85},
{skill:"Responsive Design",importance:90},
{skill:"Tailwind CSS",importance:80}
],

"Backend Developer":[
{skill:"Node.js",importance:100},
{skill:"Express.js",importance:95},
{skill:"MongoDB",importance:90},
{skill:"SQL",importance:90},
{skill:"REST APIs",importance:100},
{skill:"Authentication",importance:85},
{skill:"Git",importance:80}
],

"Full Stack Developer":[
{skill:"HTML",importance:100},
{skill:"CSS",importance:95},
{skill:"JavaScript",importance:100},
{skill:"React",importance:95},
{skill:"Node.js",importance:95},
{skill:"MongoDB",importance:90},
{skill:"Git",importance:85},
{skill:"REST APIs",importance:90}
],

"AI Engineer":[
{skill:"Python",importance:100},
{skill:"Machine Learning",importance:100},
{skill:"Deep Learning",importance:95},
{skill:"TensorFlow",importance:90},
{skill:"PyTorch",importance:90},
{skill:"Statistics",importance:90},
{skill:"Data Analysis",importance:85}
],

"Data Scientist":[
{skill:"Python",importance:100},
{skill:"Pandas",importance:95},
{skill:"NumPy",importance:95},
{skill:"Machine Learning",importance:90},
{skill:"Statistics",importance:100},
{skill:"Data Visualization",importance:85},
{skill:"SQL",importance:90}
],

"Cyber Security Expert":[
{skill:"Networking",importance:100},
{skill:"Linux",importance:95},
{skill:"Ethical Hacking",importance:100},
{skill:"Cryptography",importance:90},
{skill:"Penetration Testing",importance:90},
{skill:"Security Tools",importance:85},
{skill:"OWASP",importance:80}
],

};

// =====================================
// CAREER DROPDOWN AUTO FILL
// =====================================

const careerSelect =
document.getElementById("careerSelect");

Object.keys(careerSkills).forEach(career => {

    const option =
    document.createElement("option");

    option.value = career;
    option.textContent = career;

    careerSelect.appendChild(option);

});

// =====================================
// BUTTON EVENT
// =====================================

document
.getElementById("analyzeBtn")
.addEventListener(
"click",
analyzeSkills
);

// =====================================
// ANALYZE
// =====================================

function analyzeSkills(){

    const profile =
    JSON.parse(
        localStorage.getItem(
            "nexifyProfile"
        )
    );

    if(!profile){

        alert(
        "Please complete profile setup first."
        );

        return;
    }

    const targetCareer =
    careerSelect.value;

    const requiredSkills =
    careerSkills[targetCareer];

    const userSkills =
    profile.skills.map(
        skill =>
        skill.trim().toLowerCase()
    );

    const matchedSkills =
    requiredSkills.filter(item =>
        userSkills.includes(
            item.skill.toLowerCase()
        )
    );

    const missingSkills =
    requiredSkills.filter(item =>
        !userSkills.includes(
            item.skill.toLowerCase()
        )
    );

    const matchScore =
    Math.round(
        (
            matchedSkills.length /
            requiredSkills.length
        ) * 100
    );

    displayResults(
        targetCareer,
        matchScore,
        matchedSkills,
        missingSkills
    );
}

// =====================================
// DISPLAY RESULTS
// =====================================

function displayResults(
targetCareer,
matchScore,
matchedSkills,
missingSkills
){

    const resultSection =
    document.getElementById(
        "resultSection"
    );

    resultSection.innerHTML = `
    
    <div class="glass skill-card">

        <h3>Career Match Score</h3>

        <div class="skill-score">
            ${matchScore}%
        </div>

        <p>
            Matched Skills:
            ${matchedSkills.length}
        </p>

        <p>
            Missing Skills:
            ${missingSkills.length}
        </p>

    </div>

    <div class="glass skill-card">

        <h3>Matched Skills</h3>

        <p>
            ${
                matchedSkills.length
                ?
                matchedSkills
                .map(item => item.skill)
                .join(", ")
                :
                "No matching skills found."
            }
        </p>

    </div>

    `;

    missingSkills.forEach(item => {

        resultSection.innerHTML += `
        
        <div class="glass skill-card">

            <h3>
                ${item.skill}
            </h3>

            <p>
                Required for becoming a
                ${targetCareer}
            </p>

            <div class="skill-score">
                ${item.importance}%
            </div>

        </div>

        `;
    });
}

console.log(
"🚀 Nexify Skill Gap Analyzer Loaded"
);
