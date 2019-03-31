
function scrollAfterTypedText() {
    $('html, body').animate({
        scrollTop: $('#exploreSounds').offset().top,
    }, 1500);
}

function removeTrailingUnderscore(destination) {
    const str = destination.innerHTML;
    destination.innerHTML = str.substring(0, str.length - 1);
}

function hasUnderscore(positionOfCursor) {
    return positionOfCursor !== 0;
}

/*
* Typewriter and Stories are classes
* classes are both useful for isolating state
* and bundling information with functionality. they are also
* memory efficient for repeated operations / assignments
* */
class Typewriter {
    constructor(typewriterTextNode) {
        // typewriter shares a lifecycle with the node it appends to (typewriterTextNode)
        // in essence it is an extension of that element
        this.typewriterTextNode = typewriterTextNode;
        this.typewriterTimeout = -1;
        this.positionOfCursor = 0;
        this.currentLineIndex = 0;
        this.scriptLines = [];
    }

    // #print - returns promise - begins fresh animation of printing a script
    print(scriptLines = []) {

        // either resume playing the previous script or play the passed script
        this.scriptLines = scriptLines.length ? scriptLines : this.scriptLines;
        const TIMEOUT_FOR_NEXT_LINE = 500;
        const TIMEOUT_FOR_NEXT_CHAR = 100;

        // execute async callback when the typewriter is finished printing
        return new Promise((onFinished) => {
            // Promises are a modern JS pattern to streamline async callbacks
            // they return a #then and #catch interface

            const runTypewriter = () => {
                // locally scoped arrow body function (() => {}) preserves `this` context
                // usefull here bc we need to reference instance variables (this.scriptLines)

                const lengthOfCurrentLine = (this.scriptLines[this.currentLineIndex] || []).length;
                const isFinishedWithLine = this.positionOfCursor === lengthOfCurrentLine;
                if (isFinishedWithLine) {

                    this.currentLineIndex += 1; // bump to next line
                    const isFinishedWithScript = this.currentLineIndex === this.scriptLines.length;
                    if (isFinishedWithScript) {
                        return onFinished();
                    }

                    // reset cursor & recurse with incremented line index to begin typing on the next line
                    removeTrailingUnderscore(this.typewriterTextNode);
                    this.positionOfCursor = 0; // reset position back to 0 to begin typing the next line
                    this.typewriterTextNode.innerHTML += '<br />';

                    // recurse to print the next line
                    this.typewriterTimeout = setTimeout(runTypewriter, TIMEOUT_FOR_NEXT_LINE, this.positionOfCursor, this.currentLineIndex);

                } else { // still accumulating characters on this line

                    if (hasUnderscore(this.positionOfCursor)) {
                        removeTrailingUnderscore(this.typewriterTextNode);
                    }

                    const currentChar = (this.scriptLines[this.currentLineIndex] || [])[this.positionOfCursor++];
                    if (currentChar) {
                        this.typewriterTextNode.innerHTML += `${currentChar}_`; // add next character
                        // recurse to print the next character
                        this.typewriterTimeout = setTimeout(runTypewriter, TIMEOUT_FOR_NEXT_CHAR, this.positionOfCursor, this.currentLineIndex);
                    } else {
                        onFinished();
                    }
                }
            };

            if (this.typewriterTextNode) {
                runTypewriter();
            }
        });
    }

    // #play - like print but can resume a paused typewriter
    play(script) {
        this.print(script);
        return this;
    }

    // #pause - stops the typewriter but does not clear it
    pause() {
        clearTimeout(this.typewriterTimeout);
        return this;
    }

    // #reset - stops and resets the typewriter animation
    reset() {
        this.pause();
        this.positionOfCursor = 0;
        this.currentLineIndex = 0;
        this.typewriterTextNode.innerHTML = '';
        return this;
    }
}

/*
* * objects are good for streamlining state across similarly structured items
* a class is just an object with superpowers.
*
* classes are also good for _extending_ existing APIs for your own custom use
* here we decorate a basic Audio class with audio track data to create a Story
* */
class Story extends Audio {
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

const stories = [
    new Story('audio/new/WDHSLTY_1.mp3', [
        'my bad,...uh, my dog',
        'and with like my laptop open on my lap playing like Narso',
        'thats it'
    ], [
        'my dog',
        'laptop'
    ]),
    new Story('audio/new/WDHSLTY_2.mp3', [
        'umm, home usually sounds like roosters, to be honest, and then cows giving birth',
        'and then my dad typing on his computer',
        'and then, usually like home movies',
        'or like, any type of like cooking channels on, so yeah'
    ], [
        'roosters',
        'cows giving birth',
        'cooking channels'
    ]),
    new Story('audio/new/WDHSLTY_3.mp3', [
        'moooomy, moomy'
    ], [
        'mooommy'
    ]),
    new Story('audio/new/WDHSLTY_4.mp3', [
        'home sounds like dogs barking, my mom yelling at me *giggles*',
        'umm, my family on a shrimp farm (cant tell what she is saying?)',
        'my dogs, and us eating'
    ], [
        'dogs barking',
        'my mom yelling',
        'my dogs'
    ]),
    new Story('audio/new/WDHSLTY_5.mp3', [
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
    new Story('audio/new/WDHSLTY_6.mp3', [
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
    new Story('audio/new/WDHSLTY_7.mp3', [
        'I guess to me home sounds like, hoooo...m...e, so I hear the h and the o sound but the m part doesnt register as much',
        'so theres an emphasis on the h, and the most emphasis on the o, and then not so much emphasis on the m',
        '(interviewer: why is that?)',
        'I dont know, hoooo..., thats the most important part'
    ], [
        'hoooo...m..e'
    ]),
    new Story('audio/new/WDHSLTY_8.mp3', [
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
    new Story('audio/new/WDHSLTY_9.mp3', [
        'umm, so I grew up a lot around Latino music, and theres a song that my mom likes to play a lot',
        'and shes played it since, shes been playing it for a while now so it really hits close to home',
        'and umm here you go, its called Despacito'
    ], [
        'Latino music',
        'Despacito'
    ]),
    new Story('audio/new/WDHSLTY_10.mp3', [
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
    new Story('audio/new/WDHSLTY_11.mp3', [
        'So my home sounds to me like the footsteps of my family members, which are very, very distinct.',
        'I can just hear the footsteps of either my brother, my dad, or my mom, and I know exactly which ones belong to which family member.',
        'My home sounds to me also like just something happening in the kitchen. And based on the sounds coming from the kitchen I know who is in the kitchen.',
        'And also, the doors being closed or open, and evening depending on that sound I know who did that activity.'
    ], [
        'footsteps of my brother',
        'the kitchen',
        'the doors'
    ]),
    new Story('audio/new/WDHSLTY_12.mp3', [
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
    return indexOfNextAudio === stories.length - 1 ? 0 : indexOfNextAudio + 1;
}

function init() {

    /*
    * to limit potential confusion with the app's lifecycle, stateful DOM variables are defined in init
    * this maintains a single source of truth. all logic and flow control happen here.
    * data (stories) is intentionally separated from functionality (typewriter and event handlers).
    *
    * stateful variables are bug farms and should be limited to the parts of your app that manage lifecycle
    * */

    // all these variables are stateful to the init function (scoped to init)
    // `const` means their values will never change
    const audioSubtitleTypewriter = new Typewriter(document.getElementById('audioSubtitles'));
    const exploreStoryBtn = document.getElementById('exploreSoundsBtn');
    const stopStoryBtn = document.getElementById("stopSoundsBtn");
    const playPauseBtn = document.getElementById('playPauseBtn');

    // `let` means these variables are overwritten
    let currentStory = new Story();
    let nextAudioIdx = 0;

    exploreStoryBtn.addEventListener('click', () => {

        playPauseBtn.classList.remove('disabled'); // enable pause / play button

        currentStory.pauseAndRestart(); // stop current audio story
        currentStory = stories[nextAudioIdx]; // queue next story
        currentStory.play(); // play next story

        nextAudioIdx = onRepeatNoShuffle(nextAudioIdx); // queue next. repeat. don't shuffle

        // start tyepwriter for the current story text
        audioSubtitleTypewriter.reset().print(currentStory.transcribedTextArray);

        // start word map for the current story text
        const audioWordMapEl = document.getElementById('audioWordMap');
        appendAudioWordMap(audioWordMapEl, currentStory.wordMapPhrases);
    });

    stopStoryBtn.addEventListener("click", () => {
        currentStory.pauseAndRestart();
        audioSubtitleTypewriter.reset();
    });

    playPauseBtn.addEventListener('click', () => {
        if (currentStory.isPlaying) { // pause story audio and typewriter. show pause button
            currentStory.pause();
            audioSubtitleTypewriter.pause();
            playPauseBtn.children[0].classList.replace('fa-play-circle', 'fa-pause-circle');
        } else { // play story audio and resume typewriting. show play button
            currentStory.play();
            audioSubtitleTypewriter.play();
            playPauseBtn.children[0].classList.replace('fa-pause-circle', 'fa-play-circle');
        }
    });

    // start printing the hero banner text
    const heroTypewriter = document.getElementById('typedtext');
    new Typewriter(heroTypewriter).print([
        'What happens when you ask different people',
        'the same question?',
    ]).then(scrollAfterTypedText);
}

// when the DOM is finished drawing, start querying it and animating.
$(document).ready(init);
