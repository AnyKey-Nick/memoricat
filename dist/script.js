const memInput = document.getElementById('typeans');
let typedAnswer;
const requiredAnswer = document.querySelector('.card-content.back .mem-field h2').innerText;
const cardCont = document.getElementById('card-container');
const typedAlert = document.querySelector('.card-content.back .mem-alert');
let activeTimeout;
const flipButton = document.getElementById('flip-btn');
const audioButtons = document.querySelectorAll('a.replay-button');
const svgCircles = document.querySelectorAll('a.replay-button svg.playImage circle'); 
const screenKeyboard = document.getElementById('scr-keyboard');
const Qs = document.querySelectorAll('.mem-question');
const listenQ = document.querySelector('.mem-question.listen');
const audioContainers = document.querySelectorAll('.audio-container');
const backFields = document.querySelectorAll('.mem-field');
const spellcheckHighlights = document.getElementById('spellcheck');
const info = document.getElementById('info');

const timer = document.querySelector('timer');

function cycle(value, list) {
  return list[(list.indexOf(value) + 1) % list.length];
}

function cycleAttribute(attr, list) {
  cardCont.setAttribute('data-'+attr, cycle(cardCont.getAttribute('data-'+attr),list));
}

function togglekeyboard() {
  screenKeyboard.classList.toggle("no-keyboard");
}

function toggleLarge() {
  const fields = [...Qs, memInput, ...backFields, screenKeyboard, ...spellcheckHighlights];
  fields.forEach(el => el.classList.toggle('large'));
}

function toggleShapes() {
  const aConts = [...audioContainers, listenQ];
  aConts.forEach(el => el.classList.toggle('memblob'));
}

function toggleSpellcheck() {
  spellcheckHighlights.classList.toggle('disabled');
}

function levenshteinDistance(str1, str2) {
  const m = str1.length;
  const n = str2.length;
  const dp = new Array(m + 1).fill(null).map(() => new Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) {
    for (let j = 0; j <= n; j++) {
      if (i === 0) {
        dp[i][j] = j;
      } else if (j === 0) {
        dp[i][j] = i;
      } else {
        const cost = str1.charAt(i - 1) !== str2.charAt(j - 1) ? 1 : 0;
        dp[i][j] = Math.min(
          dp[i - 1][j - 1] + cost,
          dp[i - 1][j] + 1,
          dp[i][j - 1] + 1
        );
      }
    }
  }

  return dp[m][n];
}

function currentSide() {
  if (cardCont.classList.contains("backside")) {
    return("back");
  } else {
    return("front");
  }
}

function currentType() {
    if (cardCont.classList.contains("classic")) {
    return("classic");
  } else {
    return("listen");
  }
}

function currentInput() {
  return (cardCont.getAttribute('data-input'));
}

memInput.addEventListener('keydown', function (event) {
  if (event.keyCode === 13) {
    flipButton.focus();
    memSubmit();
  }
});

document.addEventListener('keydown', function (event) {
  if (currentSide() == "back" && event.keyCode === 13) {
    screenKeyboard.querySelectorAll('.mchoice').forEach(btn => btn.classList.remove('pressed'));
    
    cardCont.classList.remove("correct", "wrong", "soclose");
    fliptoggle();
    memInput.value = "";
    if (currentInput() === "typing") {memInput.focus();} else {flipButton.blur();}
  } else if (currentSide() == "front" && event.keyCode >= 48 && event.keyCode <= 57) {
    let numkey = event.keyCode - 48;
    if (numkey == 0) {numkey = 10};
    if (currentInput() === "mult-choice") {
      const mchoiceButtons = screenKeyboard.querySelectorAll(".mchoice");
      if (numkey <= mchoiceButtons.length) {
        mchoiceButtons[numkey - 1].onclick();
      }
    }
    // console.log(numkey);
  }
});

function memSubmit() {
  event.preventDefault();
  typedAnswer = memInput.value;
  typedAlert.innerText = typedAnswer;

  cardCont.classList.remove("correct", "wrong", "soclose");
  if (typedAnswer == requiredAnswer) {
    cardCont.classList.add('correct');
  } else if (requiredAnswer.length > 1 && levenshteinDistance(typedAnswer, requiredAnswer) < 0.5 * requiredAnswer.length) {
    cardCont.classList.add('soclose');
  } else {
    cardCont.classList.add('wrong');
  }
  
  activeTimeout = setTimeout(()=>{if (currentSide() == "front") {fliptoggle();}}, 1500);
}

function changetype() {
  cardCont.classList.toggle("classic");
  cardCont.classList.toggle("listen");
}

function changestyle() {
  document.body.classList.toggle('ankirise');
}

function inputtoggle() {
  if (cardCont.classList.contains("wrong")) {
    cardCont.classList.remove("wrong");
    cardCont.classList.add("correct");
  } else if (cardCont.classList.contains("correct")) {
    cardCont.classList.remove("correct");
    cardCont.classList.add("soclose");
  } else if (cardCont.classList.contains("soclose")) {
    cardCont.classList.remove("soclose");
  } else {
    cardCont.classList.add("wrong");
  };
}

function replayQAudio() {
  audioButtons[0].onclick();
  audioButtons[0].classList.add('active');
  audioButtons[0].classList.remove('pulse');
  void audioButtons[0].offsetHeight;
  audioButtons[0].classList.add('pulse');  
}

function reshuffleChoices() {
  const mkeys = screenKeyboard.querySelectorAll('.mchoice')
  const maxChoices = mkeys.length;

  let choices = document.getElementById('choices').innerText.split('|').map(s => s.trim());
  shuffle(choices);
  choices = [...new Set([requiredAnswer, ...choices])];
  choices.splice(maxChoices);
  shuffle(choices); 
  
  mkeys.forEach((button, i) => {
        button.classList.remove('correct');
        button.innerText = choices[i];
        if (choices[i] == requiredAnswer) {
          button.classList.add('correct');
        }
    });
}

function fliptoggle(proceed = true) {
  cardCont.classList.toggle("backside");
  clearTimeout(activeTimeout);
 // flipButton.blur();
  
  audioButtons.forEach((b) => {
			b.classList.remove('active');
		});
  Array.from(audios).forEach(a => a.pause());
  
// changing to next card type  
  if (proceed && currentSide() == "front") {
    cycleAttribute('input', ['typing', 'mult-choice']);

    if (currentInput() == "mult-choice") {
      changetype();
      reshuffleChoices();  
    }
    
    if (cardCont.classList.contains("listen")) {
      replayQAudio();
    };
  };
}

//audio buttons animation
audioButtons.forEach((a) => {
	a.addEventListener("click", () => {
		audioButtons.forEach((b) => {
			b.classList.remove('active');
		});
    a.classList.add('active');

    //let c = a.querySelector('svg.playImage circle');
    a.classList.remove('pulse');
		void a.offsetHeight;
    a.classList.add('pulse');
	});
});

//audio playback
audios = document.getElementsByClassName('audioPlayer');
alen = Math.min(audios.length, audioButtons.length); 
for (let i = 0; i < alen; i++) {
  audios[i].volume = 0.5;
  audioButtons[i].onclick = ()=> {
      Array.from(audios).forEach(a => a.pause());
      audios[i].currentTime = 0;
      audios[i].play().catch((err) => {
                    console.log('reloading...');
                    Array.from(audios).forEach(a => a.load());
                    audios[i].play();
                    });
  }
  audios[0].volume = 0.4;
  audios[1].volume = 0.25;
}


//--------------------------------------------
//on-screen keyboard/ mutl-choice buttons


function lengthOfCommonPart(str1, str2) {
    const minLength = Math.min(str1.length, str2.length);
    let i; 
    for (i = 0; str1[i] == str2[i] && i < minLength; i++) {}
    return i;
}

function typeHint() {
  const correctLength = lengthOfCommonPart(memInput.value, requiredAnswer);
  if (correctLength < requiredAnswer.length) {
    memInput.value = requiredAnswer.slice(0, correctLength + 1);
    memInput.focus();
  } else {
    memSubmit();
  }
}

function shuffle(arr) {
  return arr.sort(() => 0.5 - Math.random());
}

keysString = requiredAnswer + 'äéöüßかナ漢字';
keysString = 'äéöüßかナ漢字';
//keysString = keysString.replace(/ /g, "⌴"); //whitespace symbol
const hasSpace = (keysString.indexOf(' ') !== -1);
const hasJpSpace = (keysString.indexOf('　') !== -1);
keys = shuffle([... new Set(keysString.replace(/[ 　]/g, "").split(''))]);
if (hasSpace || hasJpSpace) {keys.push(' ')};

keys.reverse().forEach((key)=>{
  const keyButton = document.createElement("div");
  keyButton.innerText = key;
  keyButton.classList.add('membtn');
  if (key === ' ') {keyButton.classList.add('space')}
  screenKeyboard.prepend(keyButton);
})

/*Multiple choice*/
const maxChoices = 4;

let choices = document.getElementById('choices').innerText.split('|').map(s => s.trim());
shuffle(choices);
choices = [...new Set([requiredAnswer, ...choices])];
choices.splice(maxChoices);
shuffle(choices); 

choices.reverse().forEach((choice)=>{
  const choiceButton = document.createElement("div");
  choiceButton.innerText = choice;
  choiceButton.classList.add('membtn');
choiceButton.classList.add('mchoice');
  if (choice == requiredAnswer) {
    choiceButton.classList.add('correct');
  }
  screenKeyboard.prepend(choiceButton);
})

/*keyboard onclick*/
keyboardButtons = document.querySelectorAll('#scr-keyboard > *');
keyboardButtons.forEach( btn => {
  if (!btn.onclick) {
    btn.onclick = ()=>{
      const cursorStart = memInput.selectionStart;
      const cursorEnd = memInput.selectionEnd;
      const currentInput = memInput.value;
      
      if (cardCont.classList.contains("correct") || 
          cardCont.classList.contains("wrong") ||
          cardCont.classList.contains("soclose")) {return;}; 

      let key = btn.innerText;
      if (key === '⌴' || key === '') {
        key = hasJpSpace ? "　" : " ";
      }
      memInput.value = currentInput.slice(0, cursorStart) + key + currentInput.slice(cursorEnd);
      memInput.setSelectionRange(cursorStart + 1, cursorStart + 1);
      //memInput.focus();
  if (btn.classList.contains('mchoice')) {
    btn.classList.add('pressed');
    flipButton.focus();
    memSubmit();
  }
    };
  };
})