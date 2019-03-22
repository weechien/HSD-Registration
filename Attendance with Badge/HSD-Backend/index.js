const algoliasearch = require('algoliasearch');
const dotenv = require('dotenv');
const firebase = require('firebase');

// load values from the .env file in this directory into process.env
dotenv.load();

// Initialize Firebase
var config = {
  apiKey: "AIzaSyBiaJOMnGs11HgMJKQSvwKvWIv4aWf57zA",
  authDomain: "hsd-registration.firebaseapp.com",
  databaseURL: "https://hsd-registration.firebaseio.com",
  projectId: "hsd-registration",
  storageBucket: "hsd-registration.appspot.com",
  messagingSenderId: "606557954166"
};
firebase.initializeApp(config);

const database = firebase.database();

// configure algolia
const algolia = algoliasearch(
  process.env.ALGOLIA_APP_ID,
  process.env.ALGOLIA_API_KEY
);
const index = algolia.initIndex(process.env.ALGOLIA_INDEX_NAME);

const contactsRef = database.ref('/attendance');
contactsRef.on('child_added', addOrUpdateIndexRecord);
contactsRef.on('child_changed', addOrUpdateIndexRecord);
contactsRef.on('child_removed', deleteIndexRecord);

function addOrUpdateIndexRecord(contact) {
  // Get Firebase object
  const record = contact.val();
  // Specify Algolia's objectID using the Firebase object key
  record.objectID = contact.key;
  // Add or update object
  index
    .saveObject(record)
    .then(() => {
      console.log('Firebase object indexed in Algolia', record.objectID);
    })
    .catch(error => {
      console.error('Error when indexing contact into Algolia', error);
      process.exit(1);
    });
}

function deleteIndexRecord(contact) {
  // Get Algolia's objectID from the Firebase object key
  const objectID = contact.key;
  // Remove the object from Algolia
  index
    .deleteObject(objectID)
    .then(() => {
      console.log('Firebase object deleted from Algolia', objectID);
    })
    .catch(error => {
      console.error('Error when deleting contact from Algolia', error);
      process.exit(1);
    });
}