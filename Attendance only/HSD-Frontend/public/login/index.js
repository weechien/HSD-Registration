$(document).ready(function() {
  $('#email').css('color','gray');
  $('#email').change(function() {
     var current = $('#email').val();
     if (current != 'null') {
         $('#email').css('color','black');
     } else {
         $('#email').css('color','gray');
     }
  }); 
});

$("#button").on("click", function() {
    let emailObj = document.getElementById("email")
    let email = emailObj.options[emailObj.selectedIndex].value
    let password = document.getElementById("pass").value

    if (email === "null") {
      let x = document.getElementById("snackbar1")
      x.className = "show";
      setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);

      return;
    }

    if (!password) {
      let x = document.getElementById("snackbar2")
      x.className = "show";
      setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);

      return;
    }

    firebase.auth().signInWithEmailAndPassword(email, password).then(function() {
      if (email === "admin@hsd.com") {
        window.location.href = 'https://hsd-registration.firebaseapp.com/admin';
      } else if (email === "attendance@hsd.com") {
        window.location.href = 'https://hsd-registration.firebaseapp.com/attendance';
      }

    }).catch(function(error) {
      let x = document.getElementById("snackbar3")
      x.className = "show";
      setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
    });
  });

$("#pass").keydown(function(event) {
  if (event.keyCode === 13) {
    document.getElementById("button").style.background='#57f7e7';
  }
});

$("#pass").keyup(function(event) {
  if (event.keyCode === 13) {
      document.getElementById("button").style.background='#40e0d0';
      $("#button").click();
  }
});

