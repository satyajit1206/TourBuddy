document.addEventListener("DOMContentLoaded", function () {
  const aiButtons = document.querySelectorAll(".ask-ai");
  const aiResponseContainer = document.getElementById("ai-response-container");
  const aiResponse = document.getElementById("ai-response");
  const loadingSpinner = document.querySelector(".loading-spinner");

  aiButtons.forEach(button => {
    button.addEventListener("click", async function () {
      const title = this.getAttribute("data-title");
      const location = this.getAttribute("data-location");

      aiResponseContainer.style.display = "block"; // Show the response container
      loadingSpinner.style.display = "block"; // Show loading spinner
      aiResponse.innerHTML = ""; // Clear previous response

      try {
        const response = await fetch(`/ai/place-description/${title}/${location}`);
        const data = await response.json();
        if (response.ok) {
          aiResponse.innerHTML = `<h4>Description:</h4><p>${data.description}</p>`;
        } else {
          aiResponse.innerHTML = `<p>Error: ${data.error}</p>`;
        }
      } catch (error) {
        aiResponse.innerHTML = `<p>Error: ${error.message}</p>`;
      } finally {
        loadingSpinner.style.display = "none"; // Hide loading spinner
      }
    });
  });
});

