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
    
    // Checking for invalid user enter
    // User didn't fill every input
    if (trainName == "" || trainDest == "" || firstTrain == "" || trainFreq == "" ) {
        $("#message").text("Please complete the form!");
        return;
    }

    // User didn't put number at train frquency
    if (isNaN(trainFreq)) {
        $("#message").text("Please enter a number for frequency.");
        return;
    }

   // User didn't enter valid format for the first train time
   if (firstTrain == "Invalid date") {
   $("#message").text("Please enter military time for the First Train.");
   return;
    }

    // Create object for holding employee data
    var newTrain = {
        name: trainName,
        destination: trainDest,
        start: firstTrain,
        frequency: trainFreq
    };

    // Upload new train data to the database
    database.ref().push(newTrain);

    $("#message").text("New train sucessfully added");

    // Clear the form input
    $("#train-name-input").val("");
    $("#train-destination-input").val("");
    $("#first-train-time-input").val("");
    $("#train-frequency-input").val("");
});

//Display the current train table
function display() {

    // Clear the train table
    $("#train-list-table > tbody").empty();

// Create Firebase event for adding new train to the database
// Add a row in the html when user adds an entry
    database.ref().on("child_added", function(childSnapshot) {

        // Store everything into a variable.
        var trainName = childSnapshot.val().name;
        var trainDest = childSnapshot.val().destination;
        var firstTrain = childSnapshot.val().start;
        var trainFreq = childSnapshot.val().frequency;

        // Grab the key Firebase assigned
        var key = childSnapshot.ref.key;

        // First train time
        var firstTrainTimeConv = moment(firstTrain, "HH:mm").subtract(1,"years");

        //Current Time
        var currentTime = moment();

        // Difference between the times
        var diffTime = currentTime.diff(firstTrainTimeConv, "minutes");

        // Time remainder
        var timeRemainder = diffTime % trainFreq;
        
        // Minute untill next train come
        var minuteTillNext = trainFreq - timeRemainder;

        // Next train time
        var nextTrain = currentTime.add(minuteTillNext, "minutes").format("hh:mm A");

        var deleteBtn = $("<button class='delete btn btn-primary'>");
        deleteBtn.attr("data-key", key).text("Delete");

        // Create the new row
        var newRow = $("<tr>").append(
            $("<td>").text(trainName),
            $("<td>").text(trainDest),
            $("<td>").text(trainFreq),
            $("<td>").text(nextTrain),
            $("<td>").text(minuteTillNext),
            $("<td>").append(deleteBtn)
        );

        // Append the new row to the table
        $("#train-list-table > tbody").append(newRow);
    }) 
}
   $(document).on("click", ".delete", function() {
    var key = $(this).attr("data-key");
    database.ref(key).remove();
    $(this).closest('tr').remove();
   });

   display();
   setInterval(display, 1000*60);