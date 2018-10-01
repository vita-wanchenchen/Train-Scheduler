// Initialize Firebase
var config = {
    apiKey: "AIzaSyBf8TPzYm25aF2_hBg_nXppZFgA03zjQls",
    authDomain: "train-scheduler-33f98.firebaseapp.com",
    databaseURL: "https://train-scheduler-33f98.firebaseio.com",
    projectId: "train-scheduler-33f98",
    storageBucket: "",
    messagingSenderId: "165732848118"
  };

  firebase.initializeApp(config);

  var database = firebase.database();

// Button for adding Train
$("#add-train-btn").on("click", function(event) {

    // Prevent page default setting to refresh the page
    event.preventDefault();

    $("#message").text("");

    // Grab user input
    var trainName = $("#train-name-input").val().trim();
    var trainDest = $("#train-destination-input").val().trim();
    var firstTrain = moment($("#first-train-time-input").val().trim(), "HH:mm").format("X");
    var trainFreq = $("#train-frequency-input").val().trim();

    // Create object for holding employee data
    var newTrain = {
        name: trainName,
        destination: trainDest,
        start: firstTrain,
        frequency: trainFreq
    };

    // Upload new train data to the database
    database.ref().push(newTrain);

    // Logs everything to console
    console.log(newTrain.name);
    console.log(newTrain.destination);
    console.log(newTrain.start);
    console.log(newTrain.frequency);

    $("#message").text("New train sucessfully added");

    // Clear the form input
    $("#train-name-input").val("");
    $("#train-destination-input").val("");
    $("#first-train-time-input").val("");
    $("#train-frequency-input").val("");
});

// Create Firebase event for adding new train to the database
// Add a row in the html when user adds an entry
database.ref().on("child_added", function(childSnapshot) {

    // Store everything into a variable.
    var trainName = childSnapshot.val().name;
    var trainDest = childSnapshot.val().destination;
    var firstTrain = childSnapshot.val().start;
    var trainFreq = childSnapshot.val().frequency;

    // Train Info
    console.log(trainName);
    console.log(trainDest);
    console.log(firstTrain);
    console.log(trainFreq);

    // Prettify the new train start
    //var newTrainStartPretty = moment.unix(firstTrain).format("HH:mm");

    // First time
    var firstTrainTimeConv = moment(firstTrain, "HH:mm").subtract(1,"years");
    console.log(firstTrainTimeConv);

    //Current Time
    var currentTime = moment();
    console.log("Current Time: " + moment(currentTime).format("hh:mm"));

    // Difference between the times
    var diffTime = moment().diff(moment(firstTrainTimeConv), "minutes");
    console.log("Difference in Time: " + diffTime);

    // Time remainder
    var timeRemainder = diffTime % trainFreq;
    console.log(timeRemainder);
    
    // Minute untill next train come
    var minuteTillNext = trainFreq - timeRemainder;
    console.log("Minutes Till Next Train: " + minuteTillNext);

    // Next train time
    var nextTrain = moment().add(minuteTillNext, "minutes");
    console.log("Arrival Time: " + moment(nextTrain).format("hh:mm"));

    // Create the new row
    var newRow = $("<tr>").append(
        $("<td>").text(trainName),
        $("<td>").text(trainDest),
        $("<td>").text(trainFreq),
        $("<td>").text(nextTrain),
        $("<td>").text(minuteTillNext)
    );

    // Append the new row to the table
    $("#train-list-table > tbody").append(newRow);
}) 