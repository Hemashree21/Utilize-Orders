const admin = require("firebase-admin");
const path = require("path");
const fs = require("fs");

const serviceAccount = require("./service_key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://utilize-d76ec-default-rtdb.firebaseio.com"
});

const firestore = admin.firestore();
const directoryPath = path.join(__dirname, "data");

// Read directory contents
fs.readdir(directoryPath, function(err, files) {
  if (err) {
    return console.log("Unable to scan directory: " + err);
  }

  // Iterate through files in the directory
  files.forEach(function(file) {
    var filePath = path.join(directoryPath, file);

    // Check if file is JSON
    if (file.endsWith(".json")) {
      try {
        // Read file contents
        const data = fs.readFileSync(filePath, 'utf8');

        // Parse JSON data
        const jsonData = JSON.parse(data);

        // Ensure jsonData is an array
        if (!Array.isArray(jsonData)) {
          throw new Error('JSON data is not an array');
        }

        // Extract collection name from filename (remove extension)
        const collectionName = path.parse(file).name;

        // Batch size for Firestore writes
        const batchSize = 500; // Adjust batch size as per your needs

        // Upload documents in batches
        const batches = [];
        for (let i = 0; i < jsonData.length; i += batchSize) {
          const batch = firestore.batch();

          // Add documents to the batch
          for (let j = i; j < i + batchSize && j < jsonData.length; j++) {
            const obj = jsonData[j];
            const { id, ...rest } = obj; // Assuming 'id' is the document ID

            const docRef = firestore.collection(collectionName).doc(id);
            batch.set(docRef, rest);
          }

          batches.push(batch);
        }

        // Execute all batches asynchronously
        Promise.all(batches.map(batch => batch.commit()))
          .then(() => {
            console.log(`All batches uploaded for ${collectionName}`);
          })
          .catch(error => {
            console.error(`Error uploading batches for ${collectionName}: `, error);
          });

      } catch (error) {
        console.error(`Error processing file ${file}: `, error);
      }
    }
  });
});
