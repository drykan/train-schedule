var currentTime = moment().format("HH:mm");

console.log(currentTime);




// Initialize Firebase
var config = {
	apiKey: "AIzaSyDgc12Uy42sWuAh8uK3MqevYLtMz2cmKIw",
	authDomain: "trainscheduler-7b56c.firebaseapp.com",
	databaseURL: "https://trainscheduler-7b56c.firebaseio.com",
	projectId: "trainscheduler-7b56c",
	storageBucket: "trainscheduler-7b56c.appspot.com",
	messagingSenderId: "833205658558"
};
firebase.initializeApp(config);

var database = firebase.database();

var name;
var destination;
var first;
var frequency;
var firstTimeConverted;
var diffTime;
var remainder;
var minutesTillTrain;
var theNextTrain;
var nextTrain;



$("#add-train").on("click", function(event) {
	event.preventDefault();

	name = $("#name-input").val().trim();
	destination = $("#destination-input").val().trim();
	first = $("#first-input").val().trim();
	frequency = $("#frequency-input").val().trim();

	firstTimeConverted = moment(first, "hh:mm").subtract(1, "years");
	diffTime = moment().diff(moment(firstTimeConverted), "minutes");
	remainder = diffTime % frequency;
	minutesTillTrain = frequency - remainder;
	nextTrain = moment().add(minutesTillTrain, "minutes");
	theNextTrain = moment(theNextTrain).format("hh:mm A");

	console.log("MINUTES TILL TRAIN: " + minutesTillTrain);
	console.log("ARRIVAL TIME: " + theNextTrain);

	var newTrain = {
		name: name,
		destination: destination,
		first: first,
		frequency: frequency,
		minTillNext: minutesTillTrain,
		theNextTrain: theNextTrain
	};

	database.ref().push(newTrain);
});

database.ref().on("child_added", function(childSnapshot) {

	var trainName = childSnapshot.val().name;
	var trainDest = childSnapshot.val().destination;
	var trainFreq = childSnapshot.val().frequency;
	var trainMin = childSnapshot.val().minTillNext;
	var trainNext = childSnapshot.val().theNextTrain;

	
	$(".train-section").append("<tr><td>" + trainName + "</td><td>" + trainDest + "</td><td>" + trainFreq + "</td><td>" + trainNext + "</td><td>" + trainMin + " min" + "<td><i class='fa fa-pencil-square fa-2x' aria-hidden='true'></i>" + " " + " " + "<i class='fa fa-window-close fa-2x' aria-hidden='true'></i></td></tr>");
});