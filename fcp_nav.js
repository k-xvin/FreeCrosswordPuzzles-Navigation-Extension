// The code below might be messy, 
// but I just wanted to hack something useful together

const clueBoxes = getClueBoxes();
const acrossClueNumbers = getClues("frAcross");
const downClueNumbers = getClues("frDown");

function getClues(clueIFrameId) {
    const divClues = document.getElementById(clueIFrameId).contentWindow.document.getElementsByTagName("div");
    let clues = Array.from(divClues).map(
        (d) => {
            // slice the divClue text off of divClue#
            return Number(d.id.slice("divClue".length));
        }
    );

    console.log(clueIFrameId, clues);
    return clues;
}

function getClueBoxes() {
    const boxNumbers = document.getElementById("tblCrossword").querySelectorAll("td div:first-child");
    // this also maps one of the blank squares, but that's okay
    let mappedBoxes = new Map(Array.from(boxNumbers).map((b) => {
        let clueBoxNum = Number(b.textContent);
        return [clueBoxNum, b];
    }));
    console.log("clueboxes", mappedBoxes);
    return mappedBoxes;
}

let currentClueNumber = 1;

// odd# == across mode / even# == down mode
// let numClicks = 0;
const Mode = {
    ACROSS: true,
    DOWN: false
}
let currentMode = Mode.ACROSS;
document.getElementById("tblCrossword").addEventListener("click", (event) => {
    // The down/across mode flips when you click a box 
    // but not when it is a BLACK BOX
    // currentMode = !currentMode;

    // we can just check which clue list has a highlighted clue in it instead
    // this is more consistent
    currentMode = getCurrentMode();

    // depending on where someone clicked, update the position
    currentClueNumber = getCurrentClue();
});

function getCurrentMode() {
    const divCluesAcross = document.getElementById("frAcross").contentWindow.document.getElementsByTagName("div");
    for (let i = 0; i < divCluesAcross.length; i++) {
        let d = divCluesAcross[i];
        if (d.style.backgroundColor) {
            return Mode.ACROSS;
        }
    }
    return Mode.DOWN;
}

function getCurrentClue() {
    if (currentMode == Mode.ACROSS) {
        // find the first highlighted across clue and return the number
        const divClues = document.getElementById("frAcross").contentWindow.document.getElementsByTagName("div");
        for (let i = 0; i < divClues.length; i++) {
            let d = divClues[i];
            if (d.style.backgroundColor) {
                return Number(d.id.slice("divClue".length));
            }
        }
    }
    else {
        // find the first highlighted down clue and return the number
        const divClues = document.getElementById("frDown").contentWindow.document.getElementsByTagName("div");
        for (let i = 0; i < divClues.length; i++) {
            let d = divClues[i];
            if (d.style.backgroundColor) {
                return Number(d.id.slice("divClue".length));
            }
        }
    }
}


function traverseNext(clueArray) {
    // find and go to the next element
    for (let i = 0; i < clueArray.length; i++) {
        let clueNumber = clueArray[i];
        if (clueNumber > currentClueNumber) {
            currentClueNumber = clueNumber;
            doubleClick(clueBoxes.get(clueNumber).parentElement);
            return;
        }
    }
    // no element found, so we need to go to the start
    currentClueNumber = 1;
    doubleClick(clueBoxes.get(currentClueNumber).parentElement);
}

function traversePrev(clueArray) {
    // find and go to the next preceding element
    for (let i = clueArray.length - 1; i >= 0; i--) {
        let clueNumber = clueArray[i];
        if (clueNumber < currentClueNumber) {
            currentClueNumber = clueNumber;
            doubleClick(clueBoxes.get(clueNumber).parentElement);
            return;
        }
    }
    // no element found, so we need to go to the end
    currentClueNumber = clueArray[clueArray.length - 1];
    doubleClick(clueBoxes.get(currentClueNumber).parentElement);
}

function doubleClick(element) {
    // double click to retain across mode
    element.dispatchEvent(new Event('click'));
    element.dispatchEvent(new Event('click'));
}

document.addEventListener("keydown", (event) => {
    if (event.key == 'Tab' || event.key == 'Enter') {
        if (event.shiftKey) { // shift+tab
            if (currentMode == Mode.ACROSS) {
                traversePrev(acrossClueNumbers);
            }
            else {
                traversePrev(downClueNumbers);
            }
        }
        else { // tab
            if (currentMode == Mode.ACROSS) {
                traverseNext(acrossClueNumbers);
            }
            else {
                traverseNext(downClueNumbers);
            }
        }
    }
});

