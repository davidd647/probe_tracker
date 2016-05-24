
/////////////////////////////////////////////////////////////////////
//TO DO LIST
/////////////////////////////////////////////////////////////////////
////Design
/////////////////////////////////////////////////////////////////////
// - Increase the card display speed?
// - Try to get the solar system to display 100% properly
// - Change design of the dropdown menu? 
// - Create edge of the universe with a space sloth? 
// - Make the bottom of the page look more like the horizon 
// - Enter the space probe's name in red after the choice card 		:)
// - When user clicks "Restart?", scroll to the top of the page 	:)
// - Change the default height of cards at startup 					:)
// - Include twitter / email / linkedin icons						:)
// - Change order of probes so that Voyagers come first   			:)
// - Change the time for the 'Loading...' bit						:)
// - Add loading bit to both info panels							:)
// - Add buttons that change the size of each menu panel 			NO
// - Add buttons to the top left of each screen to min/maximize 	NO
// - Add dynamic (animated) text insertion into each info panel 	:)
// - Add image into one of the two (or both?)   					:)
// - Add animated screens to take you through each step of the process :)
// - Zoom out from beside Earth, from black to a solar system view! NO
// - Add solar system visualization 								:)
// - Add a reset button 											:)
/////////////////////////////////////////////////////////////////////
////Code
/////////////////////////////////////////////////////////////////////
// - Update the distance from Earth with the KM/s figure? 	
// - Add commas to the KM from earth number 						:)
// - Include Pioneer 10 and 11 										:)
// - Make sure Juno in wiki points to the probe, not the goddess	:)
// - Wolfram Alpha sometimes only displays part of the info we get 	:)
// - Test to make sure the probe info works on individual probes 	:)
// - Break lines in Wolfram Alpha info 								:)
// - Link selected probe to relevant data 							:)
// - Make sure the content fits on the screen~~~~~~~~~~~~~~~~~~~~~~~:)
// - Chg Wolfram line feed chars to array element separaters 		:)
/////////////////////////////////////////////////////////////////////


// Scrollbar stuff
    (function($){
        $('.wiki_info p').load(function(){
            $(".content").mCustomScrollbar();
        });
    })(jQuery);



probeInfo = {};

	probeInfo.getUserInfo = function(){
		var userChoice = $('select').val();
		// console.log(userChoice);
		return userChoice;
	}

	probeInfo.getAndDispWikiInfo = function(userChoice){
		//Make sure the wiki call is accurate
		if (userChoice === "juno space probe"){
			userChoice = "juno%20(spacecraft)";
		} else if (userChoice === "new_horizons"){
			userChoice = "New%20Horizons";
		} else if (userChoice === "dawn spacecraft"){
			userChoice = "dawn%20(spacecraft)";
		}
		//Get the intro paragraph from wikipedia
		$.ajax({
			url: "https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro=&explaintext=&titles=" + userChoice,
			type: 'GET',
			dataType: 'jsonp'
		}).then(function(res){
			console.log("This is the data from the Wiki article: ", res);

			///////////////////////////////////
			//Display Wiki info on screen
			///////////////////////////////////

			// this doesn't work
			// var wikiTxt = res.query.pages["32781"].extract;
			
			// each probe has a different page number, 
			// so take first element:
			var wikiPages = res.query.pages[Object.keys(res.query.pages)[0]];
			var wikiTxt = wikiPages.extract;
			$('.wiki_info p .wiki_text').empty();
			// $('.wiki_info p').append(wikiTxt).css("height","100\%");

			
			///////////////////////////////
			// Display letter-by-letter
			///////////////////////////////

			//divide the feedback string into individual characters
			var contentArray = wikiTxt.split("");
			index = 0;
				$('.wiki_info p').css("max-height","250px");
			setInterval(function() {
				if (index < contentArray.length) {
					$('.wiki_info p .wiki_text')
						.append(contentArray[index]);
					index++;
				}
			}, 5);


			$('.wiki_info p').css("display","block");
			$('.wiki_info p').css("margin","1px 1px 25px 1px");



			// $('.wiki_info').css("height","100\%");

		});
	}

	probeInfo.getAndDispWraInfo = function(userChoice){
		//Make sure "new horizons" talks about the space probe
		if (userChoice === "new horizons"){
			userChoice = "new horizons spacecraft";
		}

		//Get specific probe info from Wolframalpha
		// userChoice = "Voyager 1";
		$.ajax({
		    url: 'http://proxy.hackeryou.com',
		    dataType: 'json',
		    method:'GET',
		    data: {
		        reqUrl: 'http://api.wolframalpha.com/v2/query',
		        params: {
		            input: userChoice,
		            appid: 'T5LJTT-7ER2VLRUHW'
		        },
		        xmlToJSON: true
		    }
		}).then(function(res) {
			// console.log(res);
			if(res.queryresult.error[0] === true){
				console.log("Wolfram is giving me an error! " + res.queryresult.error[1].msg);
			} else {
				console.log("This is the data from Wolfram Alpha: ", res);
				var wraTxt = res.queryresult.pod[1].subpod.plaintext;
				console.log("This is the text from Wolfram Alpha: ", wraTxt);
			}

			///////////////////////////////////
			//Display Wolfram info on screen
			///////////////////////////////////
			var probesInfoStringArray = wraTxt.split("\n");
			$('.wolfram_info ul').empty();
			

			//For some reason, this only outputs every 4th element...
				// index = 0;
				
				// setInterval(function(){
				// 	if (index < probesInfoStringArray.length){
				// 		$('.wolfram_info ul')
				// 			.append("<li>" + probesInfoStringArray[index] + "</li>")
				// 			.css("height","100\%");
				// 		$('.wolfram_info').css("height","100\%");
				// 		index++;
				// 	}
				// }, 100);

			for (var index = 0; index < probesInfoStringArray.length; index++){
				$('.wolfram_info ul')
					.append("<li>" + probesInfoStringArray[index] + "</li>")
					.css("height","100\%");
				$('.wolfram_info').css("height","100\%");
			}
			if (userChoice === "dawn spacecraft"){
				probeImage = res.queryresult.pod[3].subpod.img.src;
			} else {
				probeImage = res.queryresult.pod[4].subpod.img.src;
			}
			$('.wolfram_image').css("background", "url(" + probeImage + ")");


			///////////////////////////////////
			//Get probe's AUs from Earth
			///////////////////////////////////
			var indexNumFirstChar;
			for (i in probesInfoStringArray){
				var srchChar = probesInfoStringArray[i].charAt(0);
				if (!isNaN(srchChar)){
					// console.log("This is a number: " + i);
					indexNumFirstChar = i;
				}
			}
			console.log(probesInfoStringArray[indexNumFirstChar]);

			if (indexNumFirstChar != undefined){
				//Truncate suffix AU
				var distAU = probesInfoStringArray[indexNumFirstChar];
				console.log("This is distAU before .replace: " + distAU);
				
				distAU = distAU.replace(' au', '');
				console.log("This is distAU after .replace: " + distAU);


				//Convert into a percentage
				//auInPercent: 
				var auInPercent = distAU * 0.5;
				console.log("I just set auInPercent, and it's: " + auInPercent);

				//Give a % suffix
				auInPercent = auInPercent + "\%";
				console.log("I just added a percent sign, now auInPercent is: " + auInPercent);

				///////////////////////////////////
				//Display the probe's distance on graphic display
				///////////////////////////////////
				$('.probe_location').css("display","block");
				$('.probe_location p').css("display","block");
				$('.probe_location').animate({right:auInPercent}, 3000);
				distKM = distAU * 149597870;
				$('.solar_sys .distance_info').empty();
				
			    while (/(\d+)(\d{3})/.test(distKM.toString())){
      				distKM = distKM.toString().replace(/(\d+)(\d{3})/, '$1'+','+'$2');
    			}



				$('.solar_sys .distance_info').text("The probe is " + distAU + "AU's away from Earth. In other words, it's " + distKM + "km away!");
			} else {
				$('.solar_sys .distance_info').empty();
				$('.solar_sys .distance_info').text("Wolfram Alpha currently has no distance data for this probe.")
			}


		});
	}

	probeInfo.getAndDispAllInfo = function(){
		var userInput = probeInfo.getUserInfo();
		// console.log(userInput);


		//Parse string for Wolfram Alpha
			var parsedUserInput = userInput.replace('_', ' ');
			// var parsedUserInput = parsedUserInput.charAt(0).toUpperCase() + parsedUserInput.slice(1);
			// console.log("For wolfram alpha, we have: " + parsedUserInput);
			probeInfo.getAndDispWraInfo(parsedUserInput);
			// probeInfo.getAndDispWraInfo();

		//Parse string for Wikipedia
			var parsedUserInput = userInput.replace('_', ' ');
			// console.log("For wikipedia, we have: " + parsedUserInput);
			probeInfo.getAndDispWikiInfo(userInput);
				//do we not need to parse user input for wikipedia???
	}

	probeInfo.startLoading = function(){
		$('.wolfram_info ul').empty();
		$('.wolfram_info ul').append("<span class='text'>Loading...</span>");
		$('.wolfram_info').css("height","100\%");
		$('.wiki_info p .wiki_text').empty();
		$('.wiki_info p .wiki_text').append("<span class='text'>Loading...</span>");
		$('.wiki_info').css("height","100\%");
	}

	// $('input').on('click', function(){
	// 	//replace wolfram alpha and wiki data with "Loading..." text
	// 	probeInfo.startLoading();
	// 	probeInfo.getAndDispAllInfo();
	// });

	probeInfo.init = function(){

	}


// Dynamic menu sliding
	$('.finish_intro_bttn').on('click',function(){
		$('.intro').animate({height:"75px"}, 3000);
		$('.selection').animate({height:"325px"}, 3000);
		// console.log("What?");
	});
	$('.finish_selection_bttn').on('click',function(){
		$('.selection').animate({height:"75px"},3000);
		$('.solar_sys').animate({height:"300px"}, 3000);
		var probeOfChoice = $('select').val();
		probeOfChoice = probeOfChoice.toUpperCase();
		probeOfChoice = probeOfChoice.replace('_',' ');
		$('h3').text(probeOfChoice);
		probeInfo.startLoading();
		probeInfo.getAndDispAllInfo();
	});
	$('.restart_bttn').on('click',function(){
		window.location.reload(false);
	})

$(function(){
	/////////////////////////////////////////////
	// FOR NOW, USE HARD-CODED PROBE NAMES
	// USE CAPTURED PROBE NAMES FROM WIKI LATER?
	/////////////////////////////////////////////
});


// APPID NOTES
	// WOLFRAM ALPHA NOTES
		// APP NAME: SpaceProbeTracker001
		// APPID: T5LJTT-7ER2VLRUHW
		// USAGE TYPE: Personal/Non-commercial Only
		// LAST LOG COUNT: 163 / 2000

	// WIKIPEDIA NOTES
		// DOES NOT REQUIRE APP ID OR REGISTRATION


