
//Time Clock
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


//Hide Error Message for not filling out all fields when adding a new train
$("#errorMsg").hide();

//Hide Error Message when hitting the X close button
$("#closeError").on("click", function() {
	$("#errorMsg").hide();
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

//Set firebase var's
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

//Update records every minute
setInterval(function() {
	updateTime();
}, 60 * 1000);

//Update function
var updateTime = function() {

}


//When clicking the submit button to add a new train
$("#add-train").on("click", function(event) {
	event.preventDefault();

	//set vars of field inputs
	name = $("#name-input").val().trim();
	destination = $("#destination-input").val().trim();
	first = $("#first-input").val().trim();
	frequency = $("#frequency-input").val().trim();

	//calculate time and arrival times
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

	//set up fields for Firebase
	var newTrain = {
		name: name,
		destination: destination,
		first: first,
		frequency: frequency,
		minTillNext: minutesTillTrain,
		theNextTrain: theNextTrain
	};

	//if fields are all filled out then push to firebase otherwise give an error and do not push.
	if (name === "" || destination === "" || first === "" || frequency === "") {
		$("#errorMsg").show();
	} else {
		$("#errorMsg").css({"display":"none"});
		database.ref().push(newTrain);
	}
});

//setting up the table with the list of trains
database.ref().on("child_added", function(childSnapshot) {

	//Logging data to target a key
	var keyId = childSnapshot.key;

	//Creating Var to store the newly created details to be placed into the HTML
	var trainName = childSnapshot.val().name;
	var trainDest = childSnapshot.val().destination;
	var trainFreq = childSnapshot.val().frequency;
	var trainMin = childSnapshot.val().minTillNext;
	var trainNext = childSnapshot.val().theNextTrain;

	//Create table row of newly created train schedule
	$(".train-section").append("<tr class=" + keyId + "><td>" + trainName + "</td><td>" + trainDest + "</td><td>" + trainFreq + "</td><td>" + trainNext + "</td><td>" + trainMin + " min" + "<td><div id=edit-" + keyId + " class='edit' data-key='" + keyId + "' data-toggle='modal' data-target='#edit-modal'><i class='edit-icon fa fa-pencil-square fa-2x' aria-hidden='true'></i></div>" + " " + "<div id=" + keyId + " class='delete'><i class='delete-icon fa fa-window-close fa-2x' aria-hidden='true'></i></div></td></tr>");

	$("#name-input").val('');
	$("#destination-input").val('');
	$("#first-input").val('');
	$("#frequency-input").val('');

	//Delete record
	$("#" + keyId).on("click", function() {
		var removeKey = $(this).attr('id');
		database.ref().child(removeKey).remove();
		var yourID = "." + removeKey;
		$(yourID).remove();
	});

	//Edit existing record
	$("#edit-" + keyId).on("click", function() {

		var editKey = $(this).attr('data-key');
		var editYourID = "." + editKey; 
		$("#edit-train").attr('data-id', editKey);

		var placeholderText = childSnapshot.val();

		$("#name-edit").attr('value', placeholderText.name);
		$("#destination-edit").attr('value', placeholderText.destination);
		$("#first-edit").attr('value', placeholderText.first);
		$("#frequency-edit").attr('value', placeholderText.frequency);

		console.log(editKey);
	});

	//Edit Modal popup
	$("#edit-train").on("click", function(event) {
		event.preventDefault();

		var keyToEdit = $("#edit-train").attr('data-id');

		name = $("#name-edit").val().trim();
		destination = $("#destination-edit").val().trim();
		first = $("#first-edit").val().trim();
		frequency = $("#frequency-edit").val().trim();

		firstTimeConverted = moment(first, "HH:mm").subtract(1, "years");
		diffTime = moment().diff(moment(firstTimeConverted), "minutes");
		remainder = diffTime % frequency;
		minutesTillTrain = frequency - remainder;
		nextTrain = moment().add(minutesTillTrain, "minutes");
		theNextTrain = moment(nextTrain).format("hh:mm A");

		var editTrain = {
			name: name,
			destination: destination,
			first: first,
			frequency: frequency,
			minTillNext: minutesTillTrain,
			theNextTrain: theNextTrain
		};

		database.ref(keyToEdit).update(editTrain);

		location.reload();
	});
});


});








