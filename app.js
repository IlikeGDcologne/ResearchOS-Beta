const palette = document.getElementById("commandPalette");
const commandInput = document.getElementById("commandInput");

const topicInput = document.getElementById("topicInput");
const notes = document.getElementById("notes");

const summaryOutput =
    document.getElementById("summaryOutput");

const commands = document.querySelectorAll(".commandItem");

commandInput.addEventListener("input",()=>{

    const value = commandInput.value.toLowerCase();

    commands.forEach(command=>{

        const text = command.textContent.toLowerCase();

        command.style.display =
            text.includes(value) ? "block" : "none";

    });

});

document.addEventListener("keydown",(e)=>{

    if((e.ctrlKey && e.key==="k") || (e.ctrlKey && e.shiftKey && e.key==="P")){

        e.preventDefault();

        palette.classList.add("open");

        commandInput.focus();

    }

    if(e.key==="Escape"){

        palette.classList.remove("open");

    }

});

palette.addEventListener("click",(e)=>{

    if(e.target===palette){

        palette.classList.remove("open");

    }

});

topicInput.addEventListener("input", saveProject);

notes.addEventListener("input", saveProject);

document.getElementById("saveBtn")
    .addEventListener("click", saveProject);



// ==============================
// Research Engine
// ==============================

async function startResearch() {

    const topic = topicInput.value.trim();

    if (!topic) {

        alert("Please enter a research topic.");

        return;

    }


    summaryOutput.innerHTML =
    "<h2>🔍 Researching...</h2>";


    try {

        const result = await searchWikipedia(topic);

        displayResearch(result);

        saveProject();

    }

    catch(error){

        console.error(error);

        summaryOutput.innerHTML = `
        <h2>Research Failed</h2>
        <p>${error.message}</p>
        `;

    }

}


document
.getElementById("searchBtn")
.addEventListener("click",startResearch);

async function searchWikipedia(topic) {

    const url =
        `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(topic)}`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("Wikipedia page not found.");
    }

    const data = await response.json();

    return {

        title: data.title,
        summary: data.extract,
        url: data.content_urls.desktop.page,
        image: data.thumbnail ? data.thumbnail.source : null

    };

}

function buildResearchWorkspace(data){

summaryOutput.innerHTML = `

<h2>${data.title}</h2>

<div class="researchSection">

<h3>📖 Summary</h3>

<p>${data.summary}</p>

</div>

<div class="researchSection">

<h3>⭐ Key Facts</h3>

<ul id="factsList">

<li>Generating...</li>

</ul>

</div>

<div class="researchSection">

<h3>📚 Sources</h3>

<a href="${data.url}" target="_blank">

Wikipedia Article

</a>

</div>

`;

}

function generateFacts(summary){

const facts=[];

const sentences=summary.split(". ");

for(let i=0;i<Math.min(5,sentences.length);i++){

facts.push(sentences[i]);

}

document.getElementById("factsList").innerHTML=

facts.map(f=>`<li>${f}</li>`).join("");

}

function displayResearch(result){


    const facts = result.summary
        .split(". ")
        .filter(sentence => sentence.length > 30)
        .slice(0,5);



    summaryOutput.innerHTML = `


    <div class="researchSection">

        <h1>🔬 ${result.title}</h1>

    </div>



    <div class="researchSection">

        <h2>📖 Overview</h2>

        <p>
        ${result.summary}
        </p>

    </div>




    <div class="researchSection">

        <h2>⭐ Key Facts</h2>

        <ul>

        ${
            facts.map(
                fact => `<li>${fact}</li>`
            ).join("")
        }

        </ul>

    </div>




    ${
        result.image ?

        `

        <div class="researchSection">

            <h2>🖼 Image</h2>

            <img 
            src="${result.image}"
            style="
            max-width:300px;
            border-radius:15px;
            ">

        </div>

        `

        :

        ""

    }




    <div class="researchSection">

        <h2>🔗 Source</h2>

        <a href="${result.url}" target="_blank">

            Wikipedia Article

        </a>

    </div>


    `;

}