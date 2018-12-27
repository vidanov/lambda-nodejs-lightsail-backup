'use strict';

exports.handler = (event, context, callback) => {


// PLEASE DEFINE YOUR REGIONS & INSTANCES!	

	
	// ================================				
	// Define region & instance
	// ================================
	
	const instances = [
		{name: "Plesk_Hosting_Stack_on_Ubuntu-1GB-Frankfurt-1", region: "eu-central-1", label: "Bunny1"}
		];
	
	// Your instance name and region can be found here (see image): http://take.ms/3KOAo
	
	// NOTE:	Define a unique label for proper snapshot names
	// WARNING:	Only one instance per snapshot script is possible

	
// YOU CAN ADJUST THE FREQUENCY AND NUMBER OF BACKUPS TO STORE HERE.

	
	// ================================				
	// Define snapshot settings
	// ================================
	
	const backupDaysMax = 7; // keep at least 7 daily backups 
	const backupWeeksMax = 4; // keep at least 4 weekly backups
	const backupMonthsMax = 3; // keep at least 3 monthly backups

	
// YOU DO NOT CHANGE ANYTHING HERE!

	
	// ================================				
	// Dates calculations for the name
	// ================================

	const now = new Date();
	const start = new Date(now.getFullYear(), 0, 0);
	const diff = now - start;
	const oneDay = 1000 * 60 * 60 * 24;
	const kw = Math.floor(diff / oneDay / 7) + 1;
	const day = Math.floor(diff / oneDay);

	console.log('KW of year: ' + kw);
	console.log('day of year:' + day);
	console.log('day of month:' + now.getDate());
	console.log('day of week:' + now.getDay());
	console.log('month:' + now.getMonth());

	const backupDaysNR = now.getDay() % backupDaysMax;
	const backupWeeksNR = kw % backupWeeksMax;
	const backupMonthsNR = now.getMonth() % backupMonthsMax;

	console.log('backupDaysNR:' + backupDaysNR);
	console.log('backupWeeksNR:' + backupWeeksNR);
	console.log('backupMonthsNR:' + backupMonthsNR);
	
	// ================================				
	// Define Functions
	// ================================
	
	function newDaySnapshot(instanceN, instanceL, backupDaysNR) {
		var params = {
			instanceName: instanceN,
			instanceSnapshotName: instanceL + 'TAG' + backupDaysNR
		};
		Lightsail.createInstanceSnapshot(params, function (err, data) {
			if (err) {
				//console.log(err, err.stack); // an error occurred
			} else {
				console.log(data); // successful response
			}
		});
	}
	
	function getSnapshots(err, data) {
		if (err) {
			//console.log(err, err.stack); // an error occurred
		}	else {
			var instanceSnapshotNameLog = "";
			// BROWSE THROUGH SNAPSHOTS
			for (var i = 0; i < data.instanceSnapshots.length; i++) {
				instanceSnapshotNameLog = data.instanceSnapshots[i].name;
				if (instanceSnapshotNameLog.indexOf(instances[0].label) >= 0){
					backupDate = new Date(data.instanceSnapshots[i].createdAt);
					backupDaysTillNow = Math.floor((now - backupDate) / oneDay);
					saveBackup = false;

					// DO NOT DELETE LAST backupDaysMax DAYS BACKUPS
					if (backupDaysTillNow <= backupDaysMax) { saveBackup = true; }
					// DO NOT DELETE LAST backupWeeksMax WEEKS BACKUPS
					if (backupDaysTillNow > backupDaysMax && backupDaysTillNow <= backupWeeksMax * 7 && backupDate.getDay() == 0) { saveBackup = true; }
					// DO NOT DELETE LAST backupWeeksMax MONTHS BACKUPS
					if (backupDaysTillNow > backupWeeksMax * 7 && backupDaysTillNow <= backupMonthsMax * 30 && backupDate.getDate() < 8 && backupDate.getDay() == 0) { saveBackup = true; }

					if (saveBackup) {
						// WE KEPT THESE BACKUPS
						console.log(`Kept: ${backupDate.getDate()} ${data.instanceSnapshots[i].createdAt} ${data.instanceSnapshots[i].name}`);
					} else {
						// WE DELETED THESE BACKUPS
						var paramsDelete = {
						"instanceSnapshotName": data.instanceSnapshots[i].name
						};
						Lightsail.deleteInstanceSnapshot(paramsDelete, function () {

						if (err) {
							//console.log(err, err.stack); // an error occurred
						} else {
							console.log('Deleted: ' + instanceSnapshotNameLog);
							instanceSnapshotNameLog = "";
						}
						});
					}
				} else { saveBackup = true; }
			}

		// IF WE HAVE MORE BACKUPS WE SHOULD NAVIGATE TO THE NEXT PAGE AND USE RECURSION
		console.log('\n\r=============== TOKEN =============== ');
		if (typeof data.nextPageToken != 'undefined') {
			console.log(data.nextPageToken);
			var params = {
				pageToken: data.nextPageToken
			};
			Lightsail.getInstanceSnapshots(params, getSnapshots);
			}
		}
	}

	// ================================				
	// Create an AWS Lightsail client
	// ================================

	var instanceName = instances[0].name;
	var instanceRegion = instances[0].region;
	var instanceLabel = instances[0].label;
	var AWS = require('aws-sdk');
	AWS.config.update({ region: instanceRegion });
	var Lightsail = new AWS.Lightsail();
	
	console.log("instanceName: " + instanceName);
	console.log("instanceRegion: " + instanceRegion);
	console.log("instanceLabel: " + instanceLabel);
	
	// ================================				
	// Create a new snapshot
	// ================================

	var params = {
		"instanceSnapshotName": instanceLabel + "KW" + kw + "TAG" + backupDaysNR
	};

	Lightsail.getInstanceSnapshot(params, function (err, data) {
		if (err) {
			//console.log(err, err.stack); // an error occurred
			newDaySnapshot(instanceName, instanceLabel, "KW" + kw + "TAG" + backupDaysNR);
		} else {
			console.log(data); // successful response
			// delete old backup
			Lightsail.deleteInstance(params, function (err, data) {
			if (err) {
				// console.log(err, err.stack); // an error occurred
			} else {
				console.log(data); // successful response
				newDaySnapshot(instanceName, instanceLabel, backupDaysNR);
			}
			});
		}
	});

	// ================================				
	//	Deleting old snapshots
	// ================================

	var params = {};
	var backupDaysTillNow;
	var saveBackup;
	var backupDate;

	Lightsail.getInstanceSnapshots(params, getSnapshots);
};
