// Get a reference to the database service
var database = firebase.database();

$("#signout").on("click", function() {
  firebase.auth().signOut();
});

var search = instantsearch({
  // Replace with your own values
  appId: '6TK1IS9RWT',
  apiKey: 'ef0d419c1877e1d27d230ad407e7f10d', // search only API key, no ADMIN key
  indexName: 'instant_search',
  urlSync: true
});

search.addWidget(
  instantsearch.widgets.searchBox({
    container: '#search-input',
    queryHook: searchEvent,
  })
);

search.addWidget(
  instantsearch.widgets.hits({
    container: '#hits',
    hitsPerPage: 24,
    templates: {
      item: function(data) {
        var formatAttd;
        var formatBadge;

        if (data.Attendance === "false") {
          formatAttd = "style='color:rgba(187,63,63,0.7)'";
        } else if (data.Attendance === "true") {
          formatAttd = "style='color:rgba(0,188,0,0.7)'";
        }

        if (data.Badge === "false") {
          formatBadge = "style='color:rgba(187,63,63,0.7)'";
        } else if (data.Badge === "true") {
          formatBadge = "style='color:rgba(0,188,0,0.7)'";
        }
        
        return '<div class="hit">' +
          '<h2 class="hit-Name">' + data._highlightResult.Name.value + '</h2>' +
          '<h4 class="hit-Group">' + data._highlightResult.Group.value + '</h4>' +
          '<h4 class="hit-Attendance"' + formatAttd + '>Attendance</h4>' +
          '<h4 class="hit-Badge"' + formatBadge + '>Badge</h4>' +
        '</div>'
        },
      empty: "We didn't find any results for the search <em>\"{{query}}\"</em>"
    },
    cssClasses: {
      root: 'row',
      item: 'col-lg-3 col-md-4 col-sm-6'
    }
  })
);

search.addWidget(
  instantsearch.widgets.pagination({
    container: '#pagination',
    showFirstLast: false
  })
);

search.start();

// Hit item clicked
$("#hits").on("click", ".hit", function() {
  var name = $(this).children("h2").text();
  var group = $(this).children("h4:nth-child(2)").text();
  var attd = $(this).children("h4:nth-child(3)").text();
  var attdColor = $(this).children("h4:nth-child(3)").css("color");
  var badge = $(this).children("h4:nth-child(4)").text();
  var badgeColor = $(this).children("h4:nth-child(4)").css("color");

  document.getElementById('id01').style.display='block'
  document.getElementById('modalname').innerHTML = name;
  document.getElementById('modalgroup').innerHTML = "Group " + group;
  document.getElementById('modalattd').innerHTML = attd;
  document.getElementById('modalattd').style.color = attdColor
  document.getElementById('modalbadge').innerHTML = badge;
  document.getElementById('modalbadge').style.color = badgeColor
  document.getElementById("submitattendance").focus();
});

// Fires every time a search is done (optional)
function searchEvent(query, mSearch) {
  search.client.clearCache(); // Refresh the cache whenever the database changes
  mSearch(query);
}

// Listen to firebase database changes
firebase.database().ref('attendance').on('value', function(snapshot) {
  // Re-run the search to refresh the hits widget after some time
  setTimeout(function() {startSearch(snapshot);}, 3000);
});

function startSearch(snapshot) {
  search.client.clearCache(); // Refresh the cache whenever the database changes
  var query = document.getElementById("search-input").value.trim();
  search.helper.setQuery(query).search(); //Set the query and search

  let modalContainer = document.getElementById("modalname");
  
  // Proceed to read the database if the modal container is visible
  if (!isHidden(modalContainer)) {
    let modalName = document.getElementById("modalname");
    let modalGroup = document.getElementById("modalgroup");
    let modalAttd = document.getElementById("modalattd");
    let modalBadge = document.getElementById("modalbadge");

    let name = modalName.innerHTML.replace(/ /g,"");
    let group = modalGroup.innerHTML.substring(modalGroup.innerHTML.length - 3, modalGroup.innerHTML.length);

    // Read the values from firebase database
    let firebaseAttdVal = snapshot.child(name + group).child('Attendance').val();
    let firebaseBadgeVal = snapshot.child(name + group).child('Badge').val();

      if (firebaseAttdVal === "true") {
        modalAttd.style.color = "rgba(0,188,0,0.7)";
      } else {
        modalAttd.style.color = "rgba(187,63,63,0.7)";
      }

      if (firebaseBadgeVal === "true") {
        modalBadge.style.color = "rgba(0,188,0,0.7)";
      } else {
        modalBadge.style.color = "rgba(187,63,63,0.7)";
      }
  }
}

// Get the modal
var modal = document.getElementById('id01');

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

// Submit attendance button within the modal is clicked
$("#submitattendance").on("click", function() {
  var name = document.getElementById('modalname').innerHTML.replace(/ /g,"");
  var modalgroup = document.getElementById('modalgroup').innerHTML;
  var group = modalgroup.substring(modalgroup.length -3, modalgroup.length);

  // Get the attendance value from firebase
  firebase.database().ref('attendance/' + name + group).once('value').then(function(snapshot) {
      if (snapshot.child('Attendance').val() === "false") {
        var x = document.getElementById("snackbar4");
        x.className = "show";
        setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);

        return Promise.reject("Attendance is false");
      } else {
        return Promise.resolve(snapshot);
      }
    
  }).then(checkBadge).then(updateBadge).catch(function(e) {
    console.log(e);
  });

  function checkBadge(snapshot) {
    if (snapshot.child('Badge').val() === "true") {
      return Promise.resolve(true);
    } else {
      return Promise.resolve(false);
    }
  }

  function updateBadge(boolean) {
    if (boolean) {
      var x = document.getElementById("snackbar2")
      x.className = "show";
      setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);

      return;
    } 

    firebase.database().ref('attendance/' + name + group).update({
      Badge: "true"
    }).then(function(snapshot) {
      modal.style.display = "none"; // Close the modal

      var x = document.getElementById("snackbar1")
      x.className = "show";
      setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);

    }, function(error) {
      var x = document.getElementById("snackbar3")
      x.className = "show";
      setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
    });
  }
})

// Change the background color of the submit attendance when enter is pressed
$("#submitattendance").keydown(function(event) {
  if (event.keyCode === 13) {
    document.getElementById("submitattendance").style.background='#57f7e7';
  }
});

$("#submitattendance").keyup(function(event) {
  if (event.keyCode === 13) {
      document.getElementById("submitattendance").style.background='#40e0d0';
  }
});

//Where el is the DOM element you'd like to test for visibility
function isHidden(el) {
  return (el.offsetParent === null)
}