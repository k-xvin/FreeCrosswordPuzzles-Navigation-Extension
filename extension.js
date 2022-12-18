const clueBoxes = getClueBoxes();
const acrossClueNumbers = getClues("frAcross"); 
const downClueNumbers = getClues("frDown");

function getClues(clueIFrameId){
    const divClues = document.getElementById("frAcross").contentWindow.document.getElementsByTagName("div");
    let clues = Array.from(divClues).map(
        (d) => {
            // slice the divClue text off of divClue#
            return Number(d.id.slice("divClue".length));
        }
    );

    console.log(clueIFrameId, clues);
    return clues;
}

function getClueBoxes(){
    const boxNumbers = document.getElementById("tblCrossword").querySelectorAll("td div:first-child");
    // this also maps one of the blank squares, but that's okay
    let mappedBoxes = new Map(Array.from(boxNumbers).map((b) => {
        let clueBoxNum = Number(b.textContent);
        return [clueBoxNum, b];
    }));
    console.log("clueboxes", mappedBoxes);
    return mappedBoxes;
}

// function getClueSquare(clueNum){
//     console.log(document.getElementById("tblCrossword").querySelectorAll("td div:first-child"));
// }

let currentClueNumber = 1;
let acrossMode = false;

function nextAcross(){
    for(let i=0;i<acrossClueNumbers.length;i++){
        let clueNumber = acrossClueNumbers[i];
        if(clueNumber>currentClueNumber){
            // console.log(clueBoxes.get(num).parentElement);

            // double click to retain across mode
            clueBoxes.get(clueNumber).parentElement.dispatchEvent(new Event('click'));
            clueBoxes.get(clueNumber).parentElement.dispatchEvent(new Event('click'));

            // cycle cluenumber back to start when we reach end
            currentClueNumber = clueNumber;
            if(i == acrossClueNumbers.length-1) currentClueNumber = 0;
            return;
        }
    }
}

function prevAcross(){

}

function nextDown(){

}

function prevDown(){

}

// function clickSquare(row, col){
//     document.getElementById(`T${col}x${row}`).dispatchEvent(new Event('click'));
// }


document.addEventListener("keydown", (event) => {
    if(event.key == 'Tab'){
        if(event.shiftKey){
            console.log("shifttabbed")
        }
        else {
            console.log("tabbed")
            // getClueSquare(3);
            nextAcross();
        }
        
        // document.getElementById("T1x1").click(); // .click() doesn't work
        // document.getElementById("T1x14").dispatchEvent(new Event('click'));

    }
});

