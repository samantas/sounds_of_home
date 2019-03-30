
function scrollAfterTypedText() {
    $('html, body').animate({
        scrollTop: $('#exploreSounds').offset().top,
    }, 1500);
}

function removeTrailingUnderscore(destination) {
    const str = destination.innerHTML;
    destination.innerHTML = str.substring(0, str.length - 1);
}

class Typewriter {
    constructor(typewriterTextNode) {
        this.typewriterTextNode = typewriterTextNode;
        this.timeoutForNextChar = 100;
        this.timeoutForNextLine = 500;
        this.typewriterTimeout = -1;
    }
    printScript(scriptLines) {

        this.reset();

        return new Promise((onFinished) => {

            const runTypewriter = (positionOfCursor = 0, currentLineIndex = 0) => {

                const lengthOfCurrentLine = scriptLines[currentLineIndex].length;
                const isFinishedWithLine = positionOfCursor === lengthOfCurrentLine;
                if (isFinishedWithLine) {

                    currentLineIndex += 1; // bump to next line
                    const isFinishedWithScript = currentLineIndex === scriptLines.length;
                    if (isFinishedWithScript) {
                        return onFinished();
                    }

                    // reset cursor & recurse with incremented line index to begin typing on the next line
                    removeTrailingUnderscore(this.typewriterTextNode);
                    positionOfCursor = 0; // reset position back to 0 to begin typing the next line
                    this.typewriterTextNode.innerHTML += '<br />';

                    this.typewriterTimeout = setTimeout(runTypewriter, this.timeoutForNextLine, positionOfCursor, currentLineIndex);
                } else { // still accumulating characters on this line

                    const underscore = '_';
                    const hasUnderscore = positionOfCursor !== 0;
                    if (hasUnderscore) {
                        removeTrailingUnderscore(this.typewriterTextNode);
                    }
                    const currentChar = scriptLines[currentLineIndex][positionOfCursor++];
                    this.typewriterTextNode.innerHTML += currentChar; // add next character
                    this.typewriterTextNode.innerHTML += underscore;
                    this.typewriterTimeout = setTimeout(runTypewriter, this.timeoutForNextChar, positionOfCursor, currentLineIndex);
                }
            };

            if (this.typewriterTextNode) {
                runTypewriter();
            }
        });
    }
    reset() {
        clearTimeout(this.typewriterTimeout);
        this.typewriterTextNode.innerHTML = '';
    }
}

class UserStory extends Audio {
    constructor(pathToAudioFile = '', transcribedTextArray = [], wordMapPhrases = []) {
        super(pathToAudioFile);
        this.transcribedTextArray = transcribedTextArray;
        this.wordMapPhrases = wordMapPhrases;
        this.isPlaying = false;
    }
    play() {
        this.isPlaying = true;
        return super.play();
    }
    pause() {
        this.isPlaying = false;
        return super.pause();
    }
    pauseAndRestart() {
        this.currentTime = 0;
        return super.pause();
    }
}

let currentAudio = new UserStory();
const audioTracks = [
    new UserStory('audio/home_1.wav', [
        'story 1 text'
    ], [
        'word map text 1',
        'word map text 1',
        'word map text 1',
    ]),
    new UserStory('audio/home_2.wav', [
        'story 2 text'
    ], [
        'word map text 2'
    ]),
    // new UserStory('audio/What does home sound like - part 3.m4a', [], ['word map text']),
    // new UserStory('audio/What does home sound like - part 4.m4a', [], ['word map text']),
    // new UserStory('audio/What does home sound like - part 6.m4a', [], ['word map text']),
    new UserStory('audio/WDHSLTY_1.mp3', [
        'story 3 text'
    ], [
        'word map text 3'
    ]),
    new UserStory('audio/WDHSLTY_2.mp3', [
        'story 4 text'
    ], [
        'word map text 4'
    ]),
    new UserStory('audio/WDHSLTY_3.mp3', [
        'story 5 text'
    ], [
        'word map text 5'
    ]),
    new UserStory('audio/WDHSLTY_4.mp3', [
        'story 6 text'
    ], [
        'word map text 6'
    ]),
    new UserStory('audio/WDHSLTY_5.mp3', [
        'story 7 text'
    ], [
        'word map text 7'
    ]),
    new UserStory('audio/WDHSLTY_6.mp3', [
        'story 8 text'
    ], [
        'word map text 8'
    ]),
    new UserStory('audio/WDHSLTY_7.mp3', [
        'story 9 text'
    ], [
        'word map text 9'
    ]),
];

function appendAudioWordMap(audioWordMapEl, wordMapPhrases) {
    const FADE_IN_TIME = 750;
    wordMapPhrases.forEach((phrase, i) => {
        setTimeout(() => {
            const div = document.createElement('div');
            div.setAttribute('class', `audioWordMap audioWordMap--${i} fadeIn`);
            div.textContent = phrase;
            audioWordMapEl.appendChild(div);
            setTimeout(() => div.classList.remove('fadeIn'), FADE_IN_TIME);
        }, i * FADE_IN_TIME);
    });
}

function onRepeatNoShuffle(indexOfNextAudio) {
    return indexOfNextAudio === audioTracks.length - 1 ? 0 : indexOfNextAudio + 1;
}

function init() {

    const audioSubtitles = new Typewriter(document.getElementById('audioSubtitles'));
    const audioWordMapEl = document.getElementById('audioWordMap');
    let exploreSoundsBtn = document.getElementById('exploreSoundsBtn');
    let nextAudioIdx = 0;
    exploreSoundsBtn.addEventListener('click', () => {

        currentAudio.pauseAndRestart();
        currentAudio = audioTracks[nextAudioIdx];
        currentAudio.play();

        nextAudioIdx = onRepeatNoShuffle(nextAudioIdx);

        audioSubtitles.printScript(currentAudio.transcribedTextArray).then(() => {
            appendAudioWordMap(audioWordMapEl, currentAudio.wordMapPhrases);
        });
    });

    let stopSoundsBtn = document.getElementById("stopSoundsBtn");
    stopSoundsBtn.addEventListener("click", () => {
        currentAudio.pause();

        /*
        * if you want to toggle play pause here:
        if (currentAudio.isPlaying) {
            currentAudio.pause();
        } else {
            currentAudio.play();
        }
        * */
    });

    const heroTypewriter = document.getElementById('typedtext');
    new Typewriter(heroTypewriter).printScript([
        'What happens when you ask 10 different people',
        'the same question?',
    ]).then(scrollAfterTypedText);
}

$(document).ready(init);
