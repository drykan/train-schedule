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

	if (name === "" || destination === "" || first === "" || frequency === "") {
		$("#errorMsg").show();
	} else {
		$("#errorMsg").css({"display":"none"});
		database.ref().push(newTrain);
	}
});

database.ref().on("child_added", function(childSnapshot) {

	//Logging data to target a key
	var keyId = childSnapshot.key;

	var trainName = childSnapshot.val().name;
	var trainDest = childSnapshot.val().destination;
	var trainFreq = childSnapshot.val().frequency;
	var trainMin = childSnapshot.val().minTillNext;
	var trainNext = childSnapshot.val().theNextTrain;

	$(".train-section").append("<tr class=" + keyId + "><td>" + trainName + "</td><td>" + trainDest + "</td><td>" + trainFreq + "</td><td>" + trainNext + "</td><td>" + trainMin + " min" + "<td><div id=" + keyId + " class='edit' data-toggle='modal' data-target='#edit-modal'><i class='edit-icon fa fa-pencil-square fa-2x' aria-hidden='true'></i></div>" + " " + "<div id=" + keyId + " class='delete'><i class='delete-icon fa fa-window-close fa-2x' aria-hidden='true'></i></div></td></tr>");

	$(".delete").on("click", function() {
		var removeKey = $(this).attr('id');
		database.ref().child(removeKey).remove();
		var yourID = "." + removeKey;
		$(yourID).remove();
	});

	$(".edit").on("click", function() {
		var editKey = $(this).attr('id');
		var editYourID = "." + editKey; 
		//var placeholderText = database.ref().child(editKey).val();
		$("#edit-train").attr('data-id', editKey);

		$("#name-edit").attr('value', childSnapshot.val().name);
		$("#destination-edit").attr('value', childSnapshot.val().destination);

		console.log(editKey);
	});

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

	});
});












