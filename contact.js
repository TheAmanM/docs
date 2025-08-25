document.addEventListener("DOMContentLoaded", () => {
  console.log("Executing contact.js");
  const contactForm = document.getElementById("contact-form");
  if (!contactForm) {
    return; // Exit if the form isn't on the page
  }

  // --- Part 1: Swap the div for a real textarea ---
  const placeholder = document.getElementById("message-placeholder");
  if (placeholder) {
    const textarea = document.createElement("textarea");

    // Copy the classes from the div to the new textarea
    textarea.className = placeholder.className;

    // Set the necessary attributes for a textarea
    textarea.name = "message";
    textarea.placeholder = "Enter your message here...";

    // Replace the placeholder div with the new textarea in the document
    placeholder.parentNode.replaceChild(textarea, placeholder);
  }

  // --- Part 2: Handle the form submission ---
  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault(); // Stop the default form submission

    const statusElement = document.getElementById("form-status");
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const formData = new FormData(contactForm);

    statusElement.textContent = "Sending...";
    submitButton.disabled = true;

    try {
      const response = await fetch(contactForm.action, {
        method: "POST",
        body: formData,
        headers: {
          // THIS HEADER IS THE KEY TO PREVENTING THE REDIRECT.
          // It tells Formspree you want a data response, not a redirect.
          Accept: "application/json",
        },
      });

      if (response.ok) {
        statusElement.textContent = "Message sent successfully!";
        statusElement.style.color = "green";
        contactForm.reset();
      } else {
        // If the server responds with an error, handle it here
        const errorData = await response.json();
        const errorMessage = errorData.error || "Something went wrong.";
        throw new Error(errorMessage);
      }
    } catch (error) {
      statusElement.textContent = `Oops! ${error.message}`;
      statusElement.style.color = "red";
    } finally {
      submitButton.disabled = false;
    }
  });
});
