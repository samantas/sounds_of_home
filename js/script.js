$(document).ready(function() {

    // typed text code from https://codepen.io/gavra/pen/tEpzn
    var aText = new Array(
        "What happens when you ask 10 different people",
        "the same question?"
    );
    var iSpeed = 100; // time exploreSoundslay of print out
    var iIndex = 0; // start printing array at this posision
    var iArrLength = aText[0].length; // the length of the text array
    var iScrollAt = 20; // start scrolling up at this many lines

    var iTextPos = 0; // initialise text position
    var sContents = ''; // initialise contents variable
    var iRow; // initialise current row

    let exploreSoundsBtn = document.getElementById("exploreSoundsBtn");

    exploreSoundsBtn.addEventListener("click", playRandomStory);

    var isPlaying = false;
    console.log('is playing: ', isPlaying);

    function playRandomStory() {

        var sounds = [
            "audio/What does home sound like - part 1.m4a",
            "audio/What does home sound like - part 2.m4a",
            "audio/What does home sound like - part 3.m4a",
            "audio/What does home sound like - part 4.m4a",
            "audio/What does home sound like - part 6.m4a"
        ]

        if (isPlaying === false) {
            console.log('is playing: ', isPlaying);
            
            // ?????????
            var randomSound = sounds[Math.floor(Math.random() * sounds.length)];
        	var sound = new Audio(randomSound);

            sound.play();
            isPlaying = true;

        } else {
            console.log('is playing: ', isPlaying);
            sound.pause();
            sound.currentTime = 0;
            isPlaying = false;

        }
    }

    function typewriter(onFinished) {
        sContents = ' ';
        iRow = Math.max(0, iIndex - iScrollAt);
        var destination = document.getElementById("typedtext");

        while (iRow < iIndex) {
            sContents += aText[iRow++] + '<br />';
        }
        destination.innerHTML = sContents + aText[iIndex].substring(0, iTextPos) + "_";
        if (iTextPos++ === iArrLength) {
            iTextPos = 0;
            iIndex++;
            if (iIndex !== aText.length) {
                iArrLength = aText[iIndex].length;
                setTimeout(typewriter, 500, onFinished);
            } else {
                onFinished();
            }
        } else {
            setTimeout(typewriter, iSpeed, onFinished);
        }
    }

    typewriter(function() {
        scrollAfterTypedText();
    });

    function scrollAfterTypedText() {
        $("html, body").animate({
            scrollTop: $("#exploreSounds").offset().top
        }, 1500);
    }

});