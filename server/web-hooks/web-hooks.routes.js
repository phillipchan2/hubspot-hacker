var express = require('express');
var hubspot = require('../hubspot/hubspot');
var router = express.Router();
var listUtils = require('../utils/listUtils');
var regionConverter = require('../regionConverter/regionConverter');

router.post('/', function(req, res, callback) {
	var payload = req.body;
	var occurences = 0;

	// if payload is JSON object
	if (Array.isArray(payload)) {

		// filter the payload just in case there are empty ones in the array
		let filteredPayload = hubspot.filterPayload(payload);
		var numOfPayloads = filteredPayload.length;

		// throttle number of api calls with custom loop
		var interval = setInterval(function() {
			if (occurences < numOfPayloads) {
				console.log(filteredPayload[occurences]);

				let event = filteredPayload[occurences].subscriptionType;
				let currentPayload = filteredPayload[occurences];

				if (event === 'contact.creation' || event === 'contact.propertyChange') {
					regionConverter.addRegionToContact(currentPayload.objectId, function(response) {
						if (response.success === true) {
							occurences++;
						}
					});
				}

				else {
					console.log('Web hook hit but no action specified');
				}
			}

			else {
				clearInterval(interval);
			}
		}, 3000);
	}

	// if payload is single object
	else if (typeof payload === 'object' && payload.objectId && listUtils.isJSON(payload)) {
		regionConverter.addRegionToContact(payload.objectId);
	}
	else {
		console.log('Not a proper payload datatype');
	}
});

module.exports = router;