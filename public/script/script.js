(() => {
  "use strict";

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll(".needs-validation");

  // Loop over them and prevent submission
  Array.from(forms).forEach((form) => {
    form.addEventListener(
      "submit",
      (event) => {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }

        form.classList.add("was-validated");
      },
      false
    );
  });
})();


document.getElementById('searchButton').addEventListener('click', function() {
  const searchInput = document.getElementById('searchInput');
  const searchForm = document.getElementById('searchForm');
  const query = searchInput.value.trim();

  if (searchInput.classList.contains('open')) {
    if (query === '') {
      // add bootstrap v alidation
      searchInput.classList.remove('open');
      return;
    }
    // Submit the form if input is open
    searchForm.submit();
  } else {
    // Add 'open' class to input to trigger the CSS transition
    searchInput.classList.add('open');
    searchInput.focus(); // Optional: Focus on input field
  }
});


function confirmLogout() {
  return confirm("Are you sure you want to log out?");
}


function confirmDelete() {
  return confirm("Are you sure you want to delete this place?");
}
