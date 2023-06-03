document.addEventListener('DOMContentLoaded', () => {
// Function to fetch all dogs and render them in the table
function fetchAndRenderDogs() {
    fetch('http://localhost:3000/dogs')
      .then(response => response.json())
      .then(data => {
        const table = document.getElementById('dogsTable');
        table.innerHTML = ''; // Clear existing table

        data.forEach(dog => {
          const row = document.createElement('tr');
          row.innerHTML = `
            <td>${dog.name}</td>
            <td>${dog.breed}</td>
            <td>${dog.sex}</td>
            <td><button class="editButton" data-id="${dog.id}">Edit</button></td>
          `;
          table.appendChild(row);
        });

        // Add event listeners to the edit buttons
        const editButtons = document.getElementsByClassName('editButton');
        for (let i = 0; i < editButtons.length; i++) {
          editButtons[i].addEventListener('click', handleEdit);
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }

  // Function to handle the edit button click event
  function handleEdit(event) {
    event.preventDefault();

    // Get the dog ID from the clicked edit button's data-id attribute
    const dogId = event.target.dataset.id;

    // Fetch the dog's current information
    fetch(`http://localhost:3000/dogs/${dogId}`)
      .then(response => response.json())
      .then(data => {
        // Populate the form fields with the dog's current information
        document.getElementById('name').value = data.name;
        document.getElementById('breed').value = data.breed;
        document.getElementById('sex').value = data.sex;
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }

  // Function to handle form submission
  function handleFormSubmit(event) {
    event.preventDefault();

    // Get the dog ID from the form's data-id attribute
    const dogId = event.target.dataset.id;

    // Get the updated dog information from the form
    const updatedDog = {
      name: document.getElementById('name').value,
      breed: document.getElementById('breed').value,
      sex: document.getElementById('sex').value,
    };

    // Make a PATCH request to update the dog information
    fetch(`http://localhost:3000/dogs/${dogId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedDog),
    })
      .then(response => response.json())
      .then(data => {
        // Fetch and render all dogs to reflect the updated information
        fetchAndRenderDogs();
      })
      .catch(error => {
        console.error('Error:', error);
      });

    // Clear the form fields after submission
    document.getElementById('name').value = '';
    document.getElementById('breed').value = '';
    document.getElementById('sex').value = '';
  }

  // Add event listener to the form submit event
  const form = document.getElementById('dogForm');
  form.addEventListener('submit', handleFormSubmit);

  // Fetch and render all dogs when the page loads
  fetchAndRenderDogs();

})