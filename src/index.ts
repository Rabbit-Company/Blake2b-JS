import Blake2b from "./blake2b.js";

const hashElement = document.getElementById("hash");
const messageInput = document.getElementById("message") as HTMLInputElement;
const secretInput = document.getElementById("secretKey") as HTMLInputElement;
const amountInput = document.getElementById("amount") as HTMLInputElement;

if(hashElement) hashElement.innerHTML = "<b>Hash:</b> " + Blake2b.hash('', '');

// Hash message
function calculateHash(){
  let textPlan = messageInput?.value;
	let secretKey = secretInput?.value;

	if(hashElement) hashElement.innerHTML = "<b>Hash:</b> " + Blake2b.hash(textPlan, secretKey);
}

messageInput.addEventListener('input', () => {
  calculateHash();
});

secretInput.addEventListener('input', () => {
  calculateHash();
});

function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}

function calcT(timer: number){
	return Date.now() - timer;
}

// Performance test
document.getElementById("btn-start")?.addEventListener("click", () => {
	const perf = document.getElementById("perf");
	if(!perf) return;

	let amount = parseInt(amountInput?.value, 10);
	if(amount < 1) amount = 1;
	if(amount > 100000) amount = 100000;
	let messages = [];
	let hashedMessages = [];
	let secretKey = "test123";
	let timerStart = Date.now();

	perf.innerText = "1. Performance test has started.\n";

	let timer = Date.now();
	for(let i = 0; i < amount; i++){
		messages[i] = btoa('' + getRandomInt(100000) + Date.now() + getRandomInt(100000));
	}
	perf.innerText += "2. " + amount + " random messages generated in " + calcT(timer) + " milliseconds.\n";

	timer = Date.now();
	for(let i = 0; i < amount; i++){
		hashedMessages[i] = Blake2b.hash(messages[i], secretKey);
	}
	perf.innerText += "3. " + amount + " random messages hashed in " + calcT(timer) + " milliseconds.\n";

	timer = Date.now();
  let validate = 0;
	for(let i = 0; i < amount; i++){
    if(hashedMessages[i] === Blake2b.hash(messages[i], secretKey)) validate++;
	}
	perf.innerText += "4. " + validate + " random messages validated successfully in " + calcT(timer) + " milliseconds.\n";

	perf.innerText += "5. Performance test has completed in " + calcT(timerStart) + " milliseconds.\n";
});