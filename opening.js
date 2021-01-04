window.onload=function(){
    $("#popup").hide();

	$("#start_game").click(function(){
        var enteredName = $("#p-name").val();
        var enteredTurns = parseInt($("#p-turns").val());
        if(enteredTurns === null){
        	enteredTurns = 3;
        }
        var JSONstuff = {};
        JSONstuff.playerName = enteredName;
        JSONstuff.numTurns = enteredTurns;
        localStorage.setItem("jsonInfo", JSON.stringify(JSONstuff))
        document.location.href = 'index.html';
    });

    $("#instruction").click(function(){
        $("#popup").show();
    });

    $("#exit").click(function(){
        $("#popup").hide();
    });

}