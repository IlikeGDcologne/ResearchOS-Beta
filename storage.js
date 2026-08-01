const PROJECT_KEY = "researchos-project";

function saveProject() {

    const project = {

        topic: document.getElementById("topicInput").value,

        notes: document.getElementById("notes").value,

        summary: document.getElementById("summaryOutput").innerHTML

    };

    localStorage.setItem(PROJECT_KEY, JSON.stringify(project));

    const saveStatus = document.getElementById("saveStatus");

    if (saveStatus) {

        saveStatus.textContent = "Saved";

        setTimeout(() => {

            saveStatus.textContent = "Ready";

        }, 1500);

    }

}

function loadProject() {

    const data = localStorage.getItem(PROJECT_KEY);

    if (!data) return;

    const project = JSON.parse(data);

    document.getElementById("topicInput").value =
        project.topic || "";

    document.getElementById("notes").value =
        project.notes || "";

    document.getElementById("summaryOutput").innerHTML =
        project.summary || "Your summary will appear here...";

}

window.addEventListener("load", loadProject);