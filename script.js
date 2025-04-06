document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("healthForm");
    const userDetails = JSON.parse(localStorage.getItem("userDetails"));

    if (form) {
        setupFormSubmission();
    }

    if (userDetails) {
        displayUserDetails(userDetails);
        fetchTreatmentData(userDetails.symptoms);
    }
});

function setupFormSubmission() {
    document.getElementById("healthForm").addEventListener("submit", async function (event) {
        event.preventDefault();

        const name = document.getElementById("name").value.trim();
        const age = document.getElementById("age").value.trim();
        const symptoms = document.getElementById("symptoms").value.toLowerCase().trim();
        const errorMessage = document.getElementById("error-message");

        if (!name || !age || !symptoms) {
            errorMessage.textContent = "Please fill out all fields.";
            errorMessage.style.display = "block";
            return;
        }

        errorMessage.style.display = "none";
        localStorage.setItem("userDetails", JSON.stringify({ name, age, symptoms }));

        try {
            await fetchTreatmentData(symptoms);
            window.location.href = "details.html";
        } catch (error) {
            errorMessage.textContent = "Error submitting form.";
            errorMessage.style.display = "block";
        }
    });
}

function displayUserDetails(userDetails) {
    document.getElementById("userName").textContent = userDetails.name || "N/A";
    document.getElementById("userAge").textContent = userDetails.age || "N/A";
    document.getElementById("userSymptoms").textContent = userDetails.symptoms || "N/A";
}

async function fetchTreatmentData(symptoms) {
    try {
        const response = await fetch("http://localhost:5000/api/treatment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ symptoms }),
        });

        if (!response.ok) throw new Error("Server Error");

        const data = await response.json();
        console.log("🔥 API Response:", data); // ✅ Debugging

        document.getElementById("condition").innerHTML = `<strong>Possible Conditions:</strong><br>${data.condition || "Unknown"}`;
        document.getElementById("treatment").innerHTML = `<strong>Treatments:</strong><br>${convertToHTML(data.treatment || "Consult a doctor")}`;

        // ✅ Display YouTube videos in table format
        const videoTableEl = document.getElementById("videoTable");
        if (Array.isArray(data.videos) && data.videos.length > 0) {
            videoTableEl.innerHTML = `
                <tr>
                    <th>Language</th>
                    <th>Video</th>
                </tr>
                ${data.videos.map(video => 
                    `<tr><td>${video.language}</td><td><a href="${video.link}" target="_blank">Watch Video</a></td></tr>`
                ).join("")}
            `;
        } else {
            videoTableEl.innerHTML = "<tr><td colspan='2'>No videos available</td></tr>";
        }

    } catch (error) {
        console.error("⚠️ Error fetching treatment data:", error);
    }
}

// ✅ Convert Gemini API text response into proper HTML
function convertToHTML(text) {
    return text
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") // Convert **bold** to <strong>
        .replace(/\*(.*?)\*/g, "<em>$1</em>") // Convert *italics* to <em>
        .replace(/- (.*?)\n/g, "<li>$1</li>") // Convert "- Item" to <li>Item</li>
        .replace(/\n\d+\.\s(.*?)\n/g, "<li>$1</li>") // Convert numbered list "1. Item" to <li>Item</li>
        .replace(/\n/g, "<br>") // Convert new lines to <br>
        .replace(/<li>(.*?)<\/li>/g, "<ul><li>$1</li></ul>") // Wrap list items in <ul>
        .replace(/<\/ul><ul>/g, ""); // Remove extra <ul> tags
}
