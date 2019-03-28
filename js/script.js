function whenTypewriterFinishesPrinting(typewriterTextNode, scriptLines, onFinished) {

    const timeoutForNextChar = 100;
    const timeoutForNextLine = 500;

    function removeTrailingUnderscore(destination) {
        const str = destination.innerHTML;
        destination.innerHTML = str.substring(0, str.length - 1);
    }

    function typewriter(positionOfCursor = 0, currentLineIndex = 0) {

        const lengthOfCurrentLine = scriptLines[currentLineIndex].length;
        const isFinishedWithLine = positionOfCursor === lengthOfCurrentLine;
        if (isFinishedWithLine) {

            currentLineIndex += 1; // bump to next line
            const isFinishedWithScript = currentLineIndex === scriptLines.length;
            if (isFinishedWithScript) {
                return onFinished();
            }

            // reset cursor & recurse with incremented line index to begin typing on the next line
            removeTrailingUnderscore(typewriterTextNode);
            positionOfCursor = 0; // reset position back to 0 to begin typing the next line
            typewriterTextNode.innerHTML += '<br />';

            setTimeout(typewriter, timeoutForNextLine, positionOfCursor, currentLineIndex);
        } else { // still accumulating characters on this line

            const underscore = '_';
            const hasUnderscore = positionOfCursor !== 0;
            if (hasUnderscore) {
                removeTrailingUnderscore(typewriterTextNode);
            }
            const currentChar = scriptLines[currentLineIndex][positionOfCursor++];
            typewriterTextNode.innerHTML += currentChar; // add next character
            typewriterTextNode.innerHTML += underscore;
            setTimeout(typewriter, timeoutForNextChar, positionOfCursor, currentLineIndex);
        }
    }

    typewriter();
}

let currentAudio = { isPlaying: false, audio: new Audio() };
const audioTracks = [{
        isPlaying: false,
        audio: new Audio('audio/What does home sound like - part 1.m4a'),
    },
    {
        isPlaying: false,
        audio: new Audio('audio/What does home sound like - part 2.m4a'),
    },
    {
        isPlaying: false,
        audio: new Audio('audio/What does home sound like - part 3.m4a'),
    },
    {
        isPlaying: false,
        audio: new Audio('audio/What does home sound like - part 4.m4a'),
    },
    {
        isPlaying: false,
        audio: new Audio('audio/What does home sound like - part 6.m4a'),
    },
];

function playRandomStory() {

    if (currentAudio.isPlaying) {
        currentAudio.audio.pause();
        currentAudio.audio.currentTime = 0;
    }

    const randomIdx = Math.floor(Math.random() * audioTracks.length);
    currentAudio = audioTracks[randomIdx];
    currentAudio.audio.play();
    currentAudio.isPlaying = true;
}

function scrollAfterTypedText() {
    $('html, body').animate({
        scrollTop: $('#exploreSounds').offset().top,
    }, 1500);
}

function init() {

    let exploreSoundsBtn = document.getElementById('exploreSoundsBtn');
    exploreSoundsBtn.addEventListener('click', playRandomStory);

    const typewriterNode = document.getElementById('typedtext');
    whenTypewriterFinishesPrinting(typewriterNode, [
        'What happens when you ask 10 different people',
        'the same question?',
    ], scrollAfterTypedText);
}

$(document).ready(init);