const sounds = [{
        hasPlayed: false,
        fileName: "audio/What does home sound like - part 1.m4a",
    },
    {
        hasPlayed: false,
        fileName: "audio/What does home sound like - part 2.m4a",
    },
    {
        hasPlayed: false,
        fileName: "audio/What does home sound like - part 3.m4a",
    },
]

function allHavePlayed(sounds) {
    const numPlayed = sounds.filter((sound) => {
        return sound.hasPlayed;
    }).length;
    return numPlayed === sounds.length;
}


function onAllSoundsPlayed(onAllFinished) {
    if (allHavePlayed(sounds)) {

        onAllFinished();

    } else {

        const sound = sounds[Math.floor(Math.random() * sounds.length)] length
        if (!sound.hasPlayed) {
            const audio = new Audio(sound.fileName);

            setTimeout(() => { // on sound finished playing

                sound.hasPlayed = true;
                onAllSoundsPlayed(onAllFinished);

            }, 1000); // length of sound clip
        } else {

            // recurse to play a different random sound in the set
            onAllSoundsPlayed(onAllFinished);
        }
    }
}

function init() {
    onAllSoundsPlayed(() => {
        // all have finished
    });
}
