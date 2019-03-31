
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
    pause() {
        clearTimeout(this.typewriterTimeout);
    }
    reset() {
        this.pause();
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
    new UserStory('audio/new/WDHSLTY_1.mp3', [
        'my bad,...uh, my dog',
        'and with like my laptop open on my lap playing like Narso',
        'thats it'
    ], [
        'my dog',
        'laptop'
    ]),
    new UserStory('audio/new/WDHSLTY_2.mp3', [
        'umm, home usually sounds like roosters, to be honest, and then cows giving birth',
        'and then my dad typing on his computer',
        'and then, usually like home movies',
        'or like, any type of like cooking channels on, so yeah'
    ], [
        'roosters',
        'cows giving birth',
        'cooking channels'
    ]),
    new UserStory('audio/new/WDHSLTY_3.mp3', [
        'moooomy, moomy'
    ], [
        'mooommy'
    ]),
    new UserStory('audio/new/WDHSLTY_4.mp3', [
        'home sounds like dogs barking, my mom yelling at me *giggles*',
        'umm, my family on a shrimp farm (cant tell what she is saying?)',
        'my dogs, and us eating'
    ], [
        'dogs barking',
        'my mom yelling',
        'my dogs'
    ]),
    new UserStory('audio/new/WDHSLTY_5.mp3', [
        'I guess home to me sounds like the sound of everybody doing their own thing cuz my family is pretty independent',
        'whether its my mom cooking or watching yoga videos on youtube',
        'umm, or my brother watching video game videos on youtube, or playing his nintendo switch game',
        'home to me just sounds like everybody being in their own zone and doing whatever they want, basically'
    ], [
        'everybody doing their own thing',
        'mom cooking',
        'yoga videos',
        'nintendo switch'
    ]),
    new UserStory('audio/new/WDHSLTY_6.mp3', [
        'ok, uh, home to me sounds like, umm, family dinners',
        'late night drives with my friends with the volume turned all the way up on the radio',
        'waves crashing, crackling of a bonfire, yeah thats what home sounds like to me'
    ], [
        'family dinners',
        'late night drives',
        'radio',
        'waves crashing',
        'crackling of a bonfire'
    ]),
    new UserStory('audio/new/WDHSLTY_7.mp3', [
        'I guess to me home sounds like, hoooo...m...e, so I hear the h and the o sound but the m part doesnt register as much',
        'so theres an emphasis on the h, and the most emphasis on the o, and then not so much emphasis on the m',
        '(interviewer: why is that?)',
        'I dont know, hoooo..., thats the most important part'
    ], [
        'hoooo...m..e'
    ]),
    new UserStory('audio/new/WDHSLTY_8.mp3', [
        'I am pulling up a song, so I am from a small town just outside of New Orleans...ummmm',
        'and, uh, this is a song my dad played a ton whenever I was...just, throughout my whole life',
        'uh, it is called backwater bayou, it is from a group from New Orleans, and it is just instrumental',
        'but it basically sounds like what the bayou sounds like which is where I am from',
        'this is backwater bayou *plays song* hopefully we can hear it',
        '*song playing*',
        'it kinda has this cool, sort of slow backwater vibe to it, it does pick up',
        'there is some higher pitched guitar, there is some, I will fast forward a bit',
        'a great harmonica bit, which just kinda has a good sort of Louisiana feel I think to it',
        'a cool fun vibe'

    ], [
        'song my dad played',
        'backwater bayou'
    ]),
    new UserStory('audio/new/WDHSLTY_9.mp3', [
        'umm, so I grew up a lot around Latino music, and theres a song that my mom likes to play a lot',
        'and shes played it since, shes been playing it for a while now so it really hits close to home',
        'and umm here you go, its called Despacito'
    ], [
        'Latino music',
        'Despacito'
    ]),
    new UserStory('audio/new/WDHSLTY_10.mp3', [
        'uh, I guess, well whne I think of the word I think of the way it sounds',
        'so hoooo...mm. So I guess its more of a round feeling when I say the o sound',
        'and I guess I can equate that to kind of like when you are home you are in a circle',
        'and then you can equate that to your family, and the warmth you get from your family',
        'so I think that is what home sounds like to me'
    ], [
        'hoooom...mm',
        'round feeling',
        'warmth'
    ]),
    new UserStory('audio/new/WDHSLTY_11.mp3', [
        'So my home sounds to me like the footsteps of my family members, which are very, very distinct.',
        'I can just hear the footsteps of either my brother, my dad, or my mom, and I know exactly which ones belong to which family member.',
        'My home sounds to me also like just something happening in the kitchen. And based on the sounds coming from the kitchen I know who is in the kitchen.',
        'And also, the doors being closed or open, and evening depending on that sound I know who did that activity.'
    ], [
        'footsteps of my brother',
        'the kitchen',
        'the doors'
    ]),
    new UserStory('audio/new/WDHSLTY_12.mp3', [
        'home? I dont know, a place, and with my cats',
        'umm, with my family, and a place where I feel safe',
        'thats it i dont know do you need something else?'
    ], [
        'cats',
        'family',
        'safe'
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

    /*
    * to limit potential confusion with the app's lifecycle, all stateful variables are defined in init
    * in order maintain a single source of truth, all logic and flow control happens in init
    * */

    const audioSubtitleTypewriter = new Typewriter(document.getElementById('audioSubtitles'));
    const audioWordMapEl = document.getElementById('audioWordMap');
    let exploreSoundsBtn = document.getElementById('exploreSoundsBtn');
    let nextAudioIdx = 0;
    exploreSoundsBtn.addEventListener('click', () => {

        currentAudio.pauseAndRestart();
        currentAudio = audioTracks[nextAudioIdx];
        currentAudio.play();

        nextAudioIdx = onRepeatNoShuffle(nextAudioIdx);

        audioSubtitleTypewriter.printScript(currentAudio.transcribedTextArray);
        appendAudioWordMap(audioWordMapEl, currentAudio.wordMapPhrases);
    });

    let stopSoundsBtn = document.getElementById("stopSoundsBtn");
    stopSoundsBtn.addEventListener("click", () => {
        currentAudio.pause();
        audioSubtitleTypewriter.pause();
    });

    // if (currentAudio.isPlaying) {
    //     currentAudio.pause();
    // } else {
    //     currentAudio.play();
    // }

    const heroTypewriter = document.getElementById('typedtext');
    new Typewriter(heroTypewriter).printScript([
        'What happens when you ask different people',
        'the same question?',
    ]).then(scrollAfterTypedText);
}

$(document).ready(init);
