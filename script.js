
document.addEventListener('DOMContentLoaded', async function () {


  const updateProfileLink = document.getElementById('update-profile-link');
  updateProfileLink.addEventListener('click', async function () {

    window.location.reload();
  });

  const userDataResponse = await fetch('/get-user-data', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const userData = await userDataResponse.json();
  if (userDataResponse.ok) {
    document.getElementById('username').textContent = userData.username;
    document.getElementById('useremail').textContent = userData.email;
    document.getElementById('registrationdate').textContent = userData.registrationDate;
  } else {
    console.error('Error fetching user data');
  }

});

