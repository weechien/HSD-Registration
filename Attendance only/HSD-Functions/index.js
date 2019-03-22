// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database. 
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

exports.updateAttendanceCount = functions.database.ref('/attendance/{nameKey}/Attendance')
.onUpdate(event => {
    // Grab the current value of what was written to the Realtime Database.
    const eventSnapshot = event.data;
    var attdCountReg;
    var attdCountUnreg;

    if (eventSnapshot.val() === "true") {
        // Read the database once
        return admin.database().ref('count/attendance_count/registered').transaction(function(currentData) {
            return currentData + 1
        }).then(function() {
            admin.database().ref('count/attendance_count/unregistered').transaction(function(currentData) {
                return currentData - 1
            })
        })
        // return admin.database().ref('count/attendance_count').once("value", function(snapshot) {
        //     snapshot.forEach(function(childSnapshot) {
        //         // Get the values from the database
        //         if (childSnapshot.key === "registered") {
        //             attdCountReg = childSnapshot.val();
        //         } else if (childSnapshot.key === "unregistered") {
        //             attdCountUnreg = childSnapshot.val();
        //         }
        //     })
        // }).then(function() {
        //     // Update the values to the database
        //     admin.database().ref('count/attendance_count').update({
        //         registered: attdCountReg + 1,
        //         unregistered: attdCountUnreg - 1
        //     })
        // });

    } else if (eventSnapshot.val() === "false") {
        // Read the database once
        return admin.database().ref('count/attendance_count/registered').transaction(function(currentData) {
            return currentData - 1
        }).then(function() {
            admin.database().ref('count/attendance_count/unregistered').transaction(function(currentData) {
                return currentData + 1
            })
        })
        // return admin.database().ref('count/attendance_count').once("value", function(snapshot) {
        //     snapshot.forEach(function(childSnapshot) {
        //         // Get the values from the database
        //         if (childSnapshot.key === "registered") {
        //             attdCountReg = childSnapshot.val();
        //         } else if (childSnapshot.key === "unregistered") {
        //             attdCountUnreg = childSnapshot.val();
        //         }
        //     })
        // }).then(function() {
        //     // Update the values to the database
        //     admin.database().ref('count/attendance_count').update({
        //         registered: attdCountReg - 1,
        //         unregistered: attdCountUnreg + 1
        //     })
        // });
    }
});

exports.updateCreationAttendance = functions.database.ref('/attendance/{nameKey}')
.onCreate(event => {
    // Grab the current value of what was written to the Realtime Database.
    const eventSnapshot = event.data.child('Attendance');
    var attdCountReg;
    var attdCountUnreg;

    if (eventSnapshot.val() === "true") {
        // Read the database once
        return admin.database().ref('count/attendance_count/registered').transaction(function(currentData) {
            return currentData + 1
        })
        // return admin.database().ref('count/attendance_count').once("value", function(snapshot) {
        //     snapshot.forEach(function(childSnapshot) {
        //         // Get the values from the database
        //         if (childSnapshot.key === "registered") {
        //             attdCountReg = childSnapshot.val();
        //         } else if (childSnapshot.key === "unregistered") {
        //             attdCountUnreg = childSnapshot.val();
        //         }
        //     })
        // }).then(function() {
        //     // Update the values to the database
        //     admin.database().ref('count/attendance_count').update({
        //         registered: attdCountReg + 1,
        //         unregistered: attdCountUnreg
        //     })
        // });

    } else if (eventSnapshot.val() === "false") {
        // Read the database once
        return admin.database().ref('count/attendance_count/unregistered').transaction(function(currentData) {
            return currentData + 1
        })
        // return admin.database().ref('count/attendance_count').once("value", function(snapshot) {
        //     snapshot.forEach(function(childSnapshot) {
        //         // Get the values from the database
        //         if (childSnapshot.key === "registered") {
        //             attdCountReg = childSnapshot.val();
        //         } else if (childSnapshot.key === "unregistered") {
        //             attdCountUnreg = childSnapshot.val();
        //         }
        //     })
        // }).then(function() {
        //     // Update the values to the database
        //     admin.database().ref('count/attendance_count').update({
        //         registered: attdCountReg,
        //         unregistered: attdCountUnreg + 1
        //     })
        // });
    }
});

exports.updateDeletionAttendance = functions.database.ref('/attendance/{nameKey}')
.onDelete(event => {
    // Grab the current value of what was written to the Realtime Database.
    const eventSnapshot = event.data.previous.child('Attendance');
    var attdCountReg;
    var attdCountUnreg;

    if (eventSnapshot.val() === "true") {
        // Read the database once
        return admin.database().ref('count/attendance_count/registered').transaction(function(currentData) {
            return currentData - 1
        })
        // return admin.database().ref('count/attendance_count').once("value", function(snapshot) {
        //     snapshot.forEach(function(childSnapshot) {
        //         // Get the values from the database
        //         if (childSnapshot.key === "registered") {
        //             attdCountReg = childSnapshot.val();
        //         } else if (childSnapshot.key === "unregistered") {
        //             attdCountUnreg = childSnapshot.val();
        //         }
        //     })
        // }).then(function() {
        //     // Update the values to the database
        //     admin.database().ref('count/attendance_count').update({
        //         registered: attdCountReg - 1,
        //         unregistered: attdCountUnreg
        //     })
        // });

    } else if (eventSnapshot.val() === "false") {
        // Read the database once
        return admin.database().ref('count/attendance_count/unregistered').transaction(function(currentData) {
            return currentData - 1
        })
        // return admin.database().ref('count/attendance_count').once("value", function(snapshot) {
        //     snapshot.forEach(function(childSnapshot) {
        //         // Get the values from the database
        //         if (childSnapshot.key === "registered") {
        //             attdCountReg = childSnapshot.val();
        //         } else if (childSnapshot.key === "unregistered") {
        //             attdCountUnreg = childSnapshot.val();
        //         }
        //     })
        // }).then(function() {
        //     // Update the values to the database
        //     admin.database().ref('count/attendance_count').update({
        //         registered: attdCountReg,
        //         unregistered: attdCountUnreg - 1
        //     })
        // });
    }
});