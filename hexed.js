function incrementTime(){
    var time = parseInt($("#timer").text(), 10);
    time++;
    $("#timer").text(time.toString());
}

// PLUGIN HERE:
$.fn.hexed = function(settings) {
    var options = $.extend({
            // Default
            playerName: "Default Name",
            numTurns: 3
        }, settings );

    if(options.numTurns === null){
        options.numTurns = 3;
    }
    if(options.playerName === null){
        options.playerName = "Default Name";
    }
    $("#num_guess").text(options.numTurns);
    $("#player_name").text(options.playerName);
    
    var newgame = false;

    $("#timer").text("0");
    var timer = setInterval(incrementTime, 1);
    // these should be set to the random color values from initialization

    var red = Math.floor((Math.random() * 255) + 1);
    var green = Math.floor((Math.random() * 255) + 1);
    var blue = Math.floor((Math.random() * 255) + 1);
    $("#color_div").css("background-color", '"' + rgbToHex(red, green, blue) + '"');

    // the number of guesses
    var guesses = options.numTurns;
    var currentguess = 0;
    
    // just hex functions
    function componentToHex(c) {
        var hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    }
    
    function rgbToHex(r, g, b) {
        return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
    }

    function isHexComponent(h) { // can use this to make sure string is valid hex
        if(h.length==0){
            return true;
        }
        var a = parseInt(h,16);
        return ((a.toString(16) === h.toLowerCase()) && (h.length==2 || h.length==1));
    }

    // Initializing sliders: sets initial values,
    //also updates the current slider value (each time you drag the slider handle)
 
    $( "#red_slider" ).slider({
        value: 120, // starter value is 120 (halfway) for all sliders
        min: 0,
        max: 255,
        animate:"slow",
        orientation: "horizontal",
        slide: function( event, ui ) {
                var r = parseInt(ui.value);
                var rhexval = componentToHex(r);
                $("#out1").val(rhexval);
        }
    });

    $( "#green_slider" ).slider({
        value: 120,
        min: 0,
        max: 255,
        animate:"slow",
        orientation: "horizontal",
        slide: function( event, ui ) {
            var g = parseInt(ui.value);
            var ghexval = componentToHex(g);
            $("#out2").val(ghexval);
        }
    });

    $( "#blue_slider" ).slider({
        value: 120,
        min: 0,
        max: 255,
        animate:"slow",
        orientation: "horizontal",
        slide: function( event, ui ) {
            var b = parseInt(ui.value);
            var bhexval = componentToHex(b);
            $("#out3").val(bhexval);
        }
    });

    // These functions update the sliders if values are typed in the te
    $("#out1").keyup( function() {
        var txthex = $("#out1").val();
        if(!(isHexComponent(txthex))){
            alert("Invalid hex value!");
        }
        else{
            var txtval = parseInt(txthex, 16);
            $( "#red_slider" ).slider( "value", txtval );
        }
   });

   $("#out2").keyup( function() {
        var txthex = $("#out2").val();
        if(!(isHexComponent(txthex))){
            alert("Invalid hex value!");
        }
        else{
            var txtval = parseInt(txthex, 16);
            $( "#green_slider" ).slider( "value", txtval );
        }
    });

    $("#out3").keyup( function() {
        var txthex = $("#out3").val();
        if(!(isHexComponent(txthex))){
            alert("Invalid hex value");
        }
        else{
            var txtval = parseInt(txthex, 16);
            $( "#blue_slider" ).slider( "value", txtval );
        }
    });

    // button and guess stuff
    function percentOff(color, guess, format) {
        var percentoff = Math.trunc(Math.abs(((color - guess) / 255) * 100));
        if(format == "y"){
            if(percentoff == 0){
                return "You got it! (0% off)";
            }
            return percentoff + "% off";
        }
        return percentoff;
    }

    // Caulculates the score
    function scoring(rps, gps, bps, time){
        if((20000 - time) < 0){
            return 0;
        } else{
            return (300 - (rps + gps + bps)) * (20000 - time);
        }
    }

    guessandnew_button.onclick = function() {

        var newbutton = document.getElementById("guessandnew_button");
        var score = document.getElementById("score");

        if(newgame){
            score.innerHTML = "0";
            //newbutton.innerHTML = "Guess"; 
            newbutton.style.backgroundImage = "url('guess_button_text.png')";
            $("#game-element").hexed(settings); 
            newgame = true;
        }

        currentguess ++;
        if(currentguess <= guesses){
            $("#num_guess").text((guesses-currentguess).toString());
        }

        // this lil segment of code doesnt even belong here, but its ok, ill move her
        var rtxthex = $("#out1").val();
        var r = parseInt(rtxthex, 16);
        var gtxthex = $("#out2").val();
        var g = parseInt(gtxthex, 16);
        var btxthex = $("#out3").val();
        var b = parseInt(btxthex, 16);
        // var hexval = rgbToHex(r, g, b);

        // get da percentz
        var rp = percentOff(red, r, "y");
        var gp = percentOff(green, g, "y");
        var bp = percentOff(blue, b, "y");

        // the y/n thing is just cuz i was too lazy to not format the words in the function
        var rps = percentOff(red, r, "n");
        var gps = percentOff(green, g, "n");
        var bps = percentOff(blue, b, "n");

        //this goes where the witch talks
        var estimate = document.getElementById("estimate");
        estimate.innerHTML = 'Red: ' + rp +"<br>" + "Green: " + gp + "<br>" + "Blue: " + bp;

        var time = parseInt($("#timer").text(), 10);

   
        // calc score
        var newscore = scoring(rps, gps, bps, time);
        // if new score better than what's currently in the html, change it
        if(newscore > score.innerHTML){
            score.innerHTML = newscore;
        }

        //build new button if >= 3 or if all answers are correct
        if(currentguess == guesses || (rp == "You got it! (0% off)" && gp == "You got it! (0% off)" && bp == "You got it! (0% off)")){
            //newbutton.innerHTML = "New Game";
            newbutton.style.backgroundImage = "url('new_game_button.png')";
            newgame = true;
            clearInterval(timer);       
        } else {
            $("#timer").text("0");
        }
    }
};

window.onload=function(){
    time = 0;
    var settings = JSON.parse(localStorage.getItem('jsonInfo'));
    $("#game-element").hexed(settings);
}