var currentTime = moment().format("HH:mm A");

console.log(currentTime);


var datetime = null;
	date = null;

var update = function () {
    date = moment(new Date())
    datetime.html(date.format('dddd, MMMM Do YYYY, h:mm:ss a'));
};

$(document).ready(function(){
    datetime = $('#currentTime');
    update();
    setInterval(update, 1000);
});



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

var name,
	destination,
	first,
	frequency,
	firstTimeConverted,
	diffTime,
	remainder,
	minutesTillTrain,
	theNextTrain,
	nextTrain;

$("#add-train").on("click", function(event) {
	event.preventDefault();

	name = $("#name-input").val().trim();
	destination = $("#destination-input").val().trim();
	first = $("#first-input").val().trim();
	frequency = $("#frequency-input").val().trim();

	firstTimeConverted = moment(first, "HH:mm").subtract(1, "years");
	diffTime = moment().diff(moment(firstTimeConverted), "minutes");
	remainder = diffTime % frequency;
	minutesTillTrain = frequency - remainder;
	nextTrain = moment().add(minutesTillTrain, "minutes");
	theNextTrain = moment(nextTrain).format("hh:mm A");

	console.log("converted: " + firstTimeConverted);
	console.log("REMAINDER: " + remainder);
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

	//Logging data to target a key
	var keyId = childSnapshot.key;

	var trainName = childSnapshot.val().name;
	var trainDest = childSnapshot.val().destination;
	var trainFreq = childSnapshot.val().frequency;
	var trainMin = childSnapshot.val().minTillNext;
	var trainNext = childSnapshot.val().theNextTrain;

	$(".train-section").append("<tr class=" + keyId + "><td class='editable'>" + trainName + "</td><td class='destination-div'>" + trainDest + "</td><td class='frequency-div'>" + trainFreq + "</td><td class='nextTrain-div'>" + trainNext + "</td><td class='minUntil-div'>" + trainMin + " min" + "<td><div class=" + keyId + " class='edit' data-toggle='modal' data-target='#edit-modal'><i class='edit fa fa-pencil-square fa-2x' aria-hidden='true'></i></div>" + " " + "<div class=" + keyId + " class='delete'><i class='fa fa-window-close fa-2x' aria-hidden='true'></i></div></td></tr>");

	//removes data on firebase and deletes the table row when clicked
	$(".delete").on("click", function() {
		var removeKey = $(this).attr('id');
		database.ref().child(removeKey).remove();
		var yourID = "." + removeKey;
		$(yourID).remove();
	});

	//edits the firebase database and changes data on website to match.
	// $(".edit").on("click", function() {

	// });


});












