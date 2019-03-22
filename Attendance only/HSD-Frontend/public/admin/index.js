// Get a reference to the database service
var database = firebase.database();

$("#signout").on("click", function() {
  firebase.auth().signOut();
});

$("#add_attendee").on("click", function() {
  $("#dialog-modal-add").dialog({
    modal: true,
    resizable: true,
    height: 'auto',
    width: 'auto',
    dialogClass: 'no-close success-dialog'
  })
  $("#dialog-modal-add").show()
  $('.ui-dialog :button').blur();
});

$("#remove_attendee").on("click", function() {
  // Clear the table first
  $('#mTable').empty()
  // Disable remove button
  $('#remove_attendee_table2').prop('disabled', true);
  // Get the attendance value from firebase
  database.ref('attendance/').once('value', function(snapshot) {
    // Initial content headers
    var content = ''
    content += '<tr>'
    content += '<th>Name</th>'
    content += '<th>Group</th>'
    content += '<th>Attendance</th>'

    snapshot.forEach(function(child) {
      var val = child.val()
      content += '<tr>'
      content += '<td>' + val.Name + '</td>'
      content += '<td>' + val.Group + '</td>'
      content += '<td>' + val.Attendance + '</td>'
      content += '</tr>'
    })
    $('#mTable').append(content)
    
    enableRowHighlighting()
  })

  $("#dialog-modal").dialog({
    modal: true,
    resizable: true,
    autoResize:true,
    dialogClass: 'no-close success-dialog'
  })
 $("#dialog-modal").show()
 $('.ui-dialog :button').blur();
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

        if (data.Attendance === "false") {
          formatAttd = "style='color:rgba(187,63,63,0.7)'";
        } else if (data.Attendance === "true") {
          formatAttd = "style='color:rgba(0,188,0,0.7)'";
        }
        
        return '<div class="hit">' +
          '<h2 class="hit-Name">' + data._highlightResult.Name.value + '</h2>' +
          '<h4 class="hit-Group">' + data._highlightResult.Group.value + '</h4>' +
          '<h4 class="hit-Attendance"' + formatAttd + '>Attendance</h4>' +
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

  document.getElementById('id01').style.display='block'
  document.getElementById('modalname').innerHTML = name;
  document.getElementById('modalgroup').innerHTML = "Group " + group;
  document.getElementById('modalattd').innerHTML = attd;
  document.getElementById('modalattd').style.color = attdColor
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

    let name = modalName.innerHTML.replace(/ /g,"");
    let group = modalGroup.innerHTML.substring(6, modalGroup.innerHTML.length);

    // Read the values from firebase database
    let firebaseAttdVal = snapshot.child(name + group).child('Attendance').val();

      if (firebaseAttdVal === "true") {
        modalAttd.style.color = "rgba(0,188,0,0.7)";
      } else {
        modalAttd.style.color = "rgba(187,63,63,0.7)";
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
  console.log(modalgroup)
  var group = modalgroup.substring(6, modalgroup.length);

  // Get the attendance value from firebase
  firebase.database().ref('attendance/' + name + group).child('Attendance').once('value').then(checkAttendance).then(updateAttendance);

  function checkAttendance(snapshot) {
    if (snapshot.val() === "true") {
      return Promise.resolve(true);
    } else {
      return Promise.resolve(false);
    }
  }

  function updateAttendance(boolean) {
    if (boolean) {
      var x = document.getElementById("snackbar2")
      x.className = "show";
      setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);

      return;
    } 

    firebase.database().ref('attendance/' + name + group).update({
      Attendance: "true"
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

// Remove attendance button within the modal is clicked
$("#removeattendance").on("click", function() {
  var name = document.getElementById('modalname').innerHTML.replace(/ /g,"");
  var modalgroup = document.getElementById('modalgroup').innerHTML;
  var group = modalgroup.substring(6, modalgroup.length);

  // Get the attendance value from firebase
  firebase.database().ref('attendance/' + name + group).child('Attendance').once('value').then(checkAttendance).then(updateAttendance);

  function checkAttendance(snapshot) {
    if (snapshot.val() === "true") {
      return Promise.resolve(true);
    } else {
      return Promise.resolve(false);
    }
  }

  function updateAttendance(boolean) {
    if (!boolean) {
      var x = document.getElementById("snackbar4")
      x.className = "show";
      setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);

      return;
    } 

    firebase.database().ref('attendance/' + name + group).update({
      Attendance: "false"
    }).then(function(snapshot) {
      modal.style.display = "none"; // Close the modal

      var x = document.getElementById("snackbar7")
      x.className = "show";
      setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);

    }, function(error) {
      var x = document.getElementById("snackbar3")
      x.className = "show";
      setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
    });
  }
})

//Where el is the DOM element you'd like to test for visibility
function isHidden(el) {
  return (el.offsetParent === null)
}

var attdReg;
var attdUnreg;

// Listen to firebase database changes
firebase.database().ref('count/attendance_count').on('value', function(snapshot) {

  snapshot.forEach(function(childSnapshot) {
    if (childSnapshot.key === 'registered') {
      attdReg = childSnapshot.val();
    } else if (childSnapshot.key === 'unregistered') {
      attdUnreg = childSnapshot.val();
    }
  })

  displayProgressNum();  
});

var showPercent = true;

function displayProgressNum() {
  var attendanceBar = document.getElementById("attendance-bar");
  var attendanceBarAlt = document.getElementById("attendance-bar-alt");

  attendanceBar.style.width = parseFloat(attdReg/(attdReg + attdUnreg) * 100).toFixed(1) + "%";
  attendanceBarAlt.style.width = parseFloat(attdUnreg/(attdReg + attdUnreg) * 100).toFixed(1) + "%";

  if (showPercent) {  
    attendanceBar.innerHTML = parseFloat(attdReg/(attdReg + attdUnreg) * 100).toFixed(1) + "%";
    attendanceBarAlt.innerHTML = parseFloat(attdUnreg/(attdReg + attdUnreg) * 100).toFixed(1) + "%";
  } else {
    attendanceBar.innerHTML = attdReg;
    attendanceBarAlt.innerHTML = attdUnreg;
  }
}

$('#attendance-progress').on('click', function() {
  showPercent = !showPercent;
  displayProgressNum();
})

// Enable the 'Stats' bar to expand or collapse
$(function() {
  $( "#accordion" ).accordion({
    collapsible: true
  });
});

// Enable highlight of the items in the table
function enableRowHighlighting() {
  /* Get all rows from your 'table' but not the first one 
   * that includes headers. */
  var rows = $('tr').not(':first')
  
  /* Create 'click' event handler for rows */
  rows.on('click', function(e) {
      
      /* Get current row */
      var row = $(this)
      
      /* Check if 'Ctrl', 'cmd' or 'Shift' keyboard key was pressed
       * 'Ctrl' => is represented by 'e.ctrlKey' or 'e.metaKey'
       * 'Shift' => is represented by 'e.shiftKey' */
      if ((e.ctrlKey || e.metaKey) || e.shiftKey) {
          /* If pressed highlight the other row that was clicked */
          row.addClass('tableRowHighlight')
      } else {
          /* Otherwise just highlight one row and clean others */
          rows.removeClass('tableRowHighlight')
          row.addClass('tableRowHighlight')
      }
      $('#remove_attendee_table2').prop('disabled', false);
  })
}

// Onclick listener for 'remove' button
$('#remove_attendee_table2').click(function() {
  $("#dialog-modal-confirm")
  .html('<div><h6>Are you sure?</h6></div>')
  .dialog({
    modal: true,
    title: 'Remove attendee',
    resizable: true,
    autoResize:true,
    buttons: {
      Yes: function () {
        const rowsToDelete = $('.tableRowHighlight').children()

        for (var i = 0; i < rowsToDelete.length; i += 3) {
          var name = rowsToDelete.eq(i).text().replace(/ /g,"")
          var group = rowsToDelete.eq(i+1).text()
          
          database.ref().child('attendance/' + name + group).remove()
        }
        $(".ui-dialog-content").dialog('destroy');
      },
      No: function () {                                                               
        $(this).dialog("close");
      }
    },
    dialogClass: 'no-close success-dialog'
  })
  $('.ui-dialog :button').blur();
})

// Onclick listener for 'remove all' button
$('#remove_attendee_table1').click(function() {
  $("#dialog-modal-confirm")
  .html('<div><h6>Are you sure?</h6></div>')
  .dialog({
    modal: true,
    title: 'Remove all',
    resizable: true,
    autoResize:true,
    buttons: {
      Yes: function () {
        database.ref().child('attendance').remove()
        $(".ui-dialog-content").dialog('destroy');
      },
      No: function () {                                                               
        $(this).dialog("close");
      }
    },
    dialogClass: 'no-close success-dialog'
  })
  $('.ui-dialog :button').blur()
})

// Initialize appendGrid
$('#tblAppendGrid').appendGrid({
  initRows: 1,
  columns: [
      { name: 'Name', display: 'Name', type: 'text', ctrlAttr: { maxlength: 100 }, ctrlCss: { width: '160px'}, emptyCriteria: '' },
      { name: 'Group', display: 'Group', type: 'text', ctrlAttr: { maxlength: 100 }, ctrlCss: { width: '80px'}, emptyCriteria: '' },
      { name: 'Attendance', display: 'Attendance', type: 'checkbox' }
  ]
});

// Onclick listener for 'Add' button
$('#add_attendee_table1').click(function() {
  var data = $('#tblAppendGrid').appendGrid('getAllValue');

  for (var i = 0; i < data.length; i++) {
    if ($('#tblAppendGrid').appendGrid('isRowEmpty', i)) {
      return
    }       
  }

  $("#dialog-modal-confirm")
  .html('<div><h6>Are you sure?</h6></div>')
  .dialog({
    modal: true,
    title: 'Add attendee',
    resizable: true,
    autoResize:true,
    buttons: {
      Yes: function () {
        // Get all data as array
        var data = $('#tblAppendGrid').appendGrid('getAllValue');
        for (var i = 0; i < data.length; i++) {
          database.ref('attendance/' + data[i].Name.replace(/ /g,"") + data[i].Group).set({
            Name: data[i].Name,
            Group: data[i].Group,
            Attendance : data[i].Attendance === 0 ? 'false' : 'true'
          })    
        }
        $(".ui-dialog-content").dialog('destroy');
      },
      No: function () {                                                               
        $(this).dialog("close");
      }
    },
    dialogClass: 'no-close success-dialog'
  })
  $('.ui-dialog :button').blur()
})

// Onclick listener for 'Cancel' button
$('#add_attendee_table2').click(function() {
  $(".ui-dialog-content").dialog('destroy');
})
