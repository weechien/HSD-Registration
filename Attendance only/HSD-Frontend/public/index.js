//Handle Account Status
firebase.auth().onAuthStateChanged(user => {
    if(user) {
        var email = firebase.auth().currentUser.email;
        
        if (email === "admin@hsd.com") {
            window.location.href = 'https://hsd-registration.firebaseapp.com/admin';
        } else if (email === "attendance@hsd.com") {
            window.location.href = 'https://hsd-registration.firebaseapp.com/attendance';
        }
        
    } else {
        window.location.href = 'https://hsd-registration.firebaseapp.com/login';
    }
  });