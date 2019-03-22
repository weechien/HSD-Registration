// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database. 
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

exports.updateAttendanceCount = functions.database.ref('/attendance/{nameKey}/Attendance')
.onWrite(event => {
    // Grab the current value of what was written to the Realtime Database.
    const eventSnapshot = event.data;
    var attdCountReg;
    var attdCountUnreg;

    if (eventSnapshot.val() === "true") {
        // Read the database once
        return admin.database().ref('count/attendance_count').once("value", function(snapshot) {
            snapshot.forEach(function(childSnapshot) {
                // Get the values from the database
                if (childSnapshot.key === "registered") {
                    attdCountReg = childSnapshot.val();
                } else if (childSnapshot.key === "unregistered") {
                    attdCountUnreg = childSnapshot.val();
                }
            })
        }).then(function() {
            // Update the values to the database
            admin.database().ref('count/attendance_count').update({
                registered: attdCountReg + 1,
                unregistered: attdCountUnreg - 1
            })
        });

    } else if (eventSnapshot.val() === "false") {
        // Read the database once
        return admin.database().ref('count/attendance_count').once("value", function(snapshot) {
            snapshot.forEach(function(childSnapshot) {
                // Get the values from the database
                if (childSnapshot.key === "registered") {
                    attdCountReg = childSnapshot.val();
                } else if (childSnapshot.key === "unregistered") {
                    attdCountUnreg = childSnapshot.val();
                }
            })
        }).then(function() {
            // Update the values to the database
            admin.database().ref('count/attendance_count').update({
                registered: attdCountReg - 1,
                unregistered: attdCountUnreg + 1
            })
        });
    }
});

exports.updateBadgeCount = functions.database.ref('/attendance/{nameKey}/Badge')
.onWrite(event => {
    // Grab the current value of what was written to the Realtime Database.
    const eventSnapshot = event.data;
    var badgeCountCollected;
    var badgeCountUncollected;

    if (eventSnapshot.val() === "true") {
        // Read the database once
        return admin.database().ref('count/badge_count').once("value", function(snapshot) {
            snapshot.forEach(function(childSnapshot) {
                // Get the values from the database
                if (childSnapshot.key === "collected") {
                    badgeCountCollected = childSnapshot.val();
                } else if (childSnapshot.key === "uncollected") {
                    badgeCountUncollected = childSnapshot.val();
                }
            })
        }).then(function() {
            // Update the values to the database
            admin.database().ref('count/badge_count').update({
                collected: badgeCountCollected + 1,
                uncollected: badgeCountUncollected - 1
            })
        });

    } else if (eventSnapshot.val() === "false") {
        // Read the database once
        return admin.database().ref('count/badge_count').once("value", function(snapshot) {
            snapshot.forEach(function(childSnapshot) {
                // Get the values from the database
                if (childSnapshot.key === "collected") {
                    badgeCountCollected = childSnapshot.val();
                } else if (childSnapshot.key === "uncollected") {
                    badgeCountUncollected = childSnapshot.val();
                }
            })
        }).then(function() {
            // Update the values to the database
            admin.database().ref('count/badge_count').update({
                collected: badgeCountCollected - 1,
                uncollected: badgeCountUncollected + 1
            })
        });
    }
});