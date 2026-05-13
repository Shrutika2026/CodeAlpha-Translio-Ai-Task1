const synth = window.speechSynthesis;

const allChars = [
    'A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z',
    'क','ख','ग','घ','ङ','च','छ','ज','झ','ञ','ट','ठ','ड','ढ','ण','त','थ','द','ध','न','प','फ','ब','भ','म',
    'அ','இ','உ','எ','ஒ','க','ங','ச','ஞ','ட','ண','த','ந','ப','ம','ய','ர','ல','வ','ழ','ள','ற','ன',
    'అ','ఆ','ఇ','ఈ','ఉ','ఊ','ఋ','ఎ','ఏ','ఐ','ఒ','ఓ','ఔ','క','ఖ','గ','ఘ','ఙ',
    'ക','ഖ','ഗ','ഘ','ങ','ച','ഛ','ജ','ഝ','ഞ','ട','ഠ','ഡ','ഢ','ണ','ത','ഥ','ദ','ധ','ന',
    'ક','ખ','ગ','ઘ','ઙ','ચ','છ','જ','ઝ','ઞ','ટ','ઠ','ડ','ઢ','ણ','ત','થ','દ','ધ','ન',
    'あ','い','う','え','お','か','き','く','け','こ','サ','シ','ス','セ','ソ',
    'ㄱ','ㄴ','ㄷ','ㄹ','ㅁ','ㅂ','ㅅ','ㅇ','ㅈ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ','ㅏ','ㅑ','ㅓ','ㅕ',
    'é','à','ç','ü','ö','ä','ß','ñ','¿','¡'
];

const container = document.getElementById('floating-container');

function createChar() {
    const span = document.createElement('span');
    span.className = 'float-char';
    span.innerText = allChars[Math.floor(Math.random() * allChars.length)];
    const size = Math.random() * 24 + 10;
    span.style.fontSize = size + 'px';
    const startX = Math.random() * window.innerWidth;
    const startY = Math.random() * window.innerHeight;
    span.style.left = startX + 'px';
    span.style.top = startY + 'px';
    container.appendChild(span);
    let posX = startX;
    let posY = startY;
    let velX = (Math.random() - 0.5) * 1.8;
    let velY = (Math.random() - 0.5) * 1.8;
    function animate() {
        posX += velX;
        posY += velY;
        if (posX < -60) posX = window.innerWidth + 60;
        if (posX > window.innerWidth + 60) posX = -60;
        if (posY < -60) posY = window.innerHeight + 60;
        if (posY > window.innerHeight + 60) posY = -60;
        span.style.transform = `translate(${posX - startX}px, ${posY - startY}px)`;
        requestAnimationFrame(animate);
    }
    animate();
}

for(let i=0; i<160; i++) {
    setTimeout(createChar, i * 20);
}

const morphList = ['A', 'अ', 'あ', 'Ω', 'En', 'Ma', 'Fr', 'Es'];
let charIdx = 0;
setInterval(() => {
    charIdx = (charIdx + 1) % morphList.length;
    const nextIdx = (charIdx + 1) % morphList.length;
    document.querySelectorAll('.leftChar').forEach(el => el.innerText = morphList[charIdx]);
    document.querySelectorAll('.rightChar').forEach(el => el.innerText = morphList[nextIdx]);
}, 1500);

function toggleApp() {
    document.getElementById('translator-app').style.display = "block"; 
    document.getElementById('welcomeScreen').style.display = "none";
}

function goBack() {
    document.getElementById('translator-app').style.display = "none"; 
    document.getElementById('welcomeScreen').style.display = "block";
}

function swapLangs() {
    const from = document.getElementById('langFrom');
    const to = document.getElementById('langTo');
    const temp = from.value;
    from.value = to.value;
    to.value = temp;
}

async function translateProcess() {
    const text = document.getElementById('inputText').value;
    if(!text) return;
    const sl = document.getElementById('langFrom').value.split('-')[0];
    const tl = document.getElementById('langTo').value.split('-')[0];
    try {
        const res = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sl}&tl=${tl}&dt=t&q=${encodeURIComponent(text)}`);
        const data = await res.json();
        document.getElementById('outputText').value = data[0].map(x => x[0]).join('');
    } catch(e) { alert("Translation error."); }
}

function speakNow(type) {
    const text = (type === 'input') ? document.getElementById('inputText').value : document.getElementById('outputText').value;
    const lang = (type === 'input') ? document.getElementById('langFrom').value : document.getElementById('langTo').value;
    
    if(!text) return;
    synth.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;

    const voices = synth.getVoices();
    const femaleIndiaVoice = voices.find(voice => 
        (voice.lang.includes('IN') || voice.lang.includes(lang.split('-')[0])) && 
        (voice.name.toLowerCase().includes('female') || voice.name.toLowerCase().includes('google') || voice.name.toLowerCase().includes('samantha'))
    );

    if (femaleIndiaVoice) utterance.voice = femaleIndiaVoice;
    
    // MAX LOUDNESS
    utterance.volume = 1.0; 
    utterance.pitch = 1.4;
    utterance.rate = 1.0;
    synth.speak(utterance);
}

function copyText() {
    const out = document.getElementById('outputText');
    if(!out.value) return;
    navigator.clipboard.writeText(out.value);
    alert("Copied!");
}
