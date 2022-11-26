document.getElementById("hash").innerHTML = "<b>Hash:</b> " + Blake2b.hash("", "");

// Hash message
function calculateHash(){
  let textPlan = document.getElementById("message").value;
	let secretKey = document.getElementById("secretKey").value;

	document.getElementById("hash").innerHTML = "<b>Hash:</b> " + Blake2b.hash(textPlan, secretKey);
}

document.getElementById("message").addEventListener('input', () => {
  calculateHash();
});

document.getElementById("secretKey").addEventListener('input', () => {
  calculateHash();
});

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function calcT(timer){
	return Date.now() - timer;
}

// Performance test
document.getElementById("btn-start").addEventListener("click", () => {
	let amount = document.getElementById("amount").value;
	if(amount < 1) amount = 1;
	if(amount > 100000) amount = 100000;
	let perf = document.getElementById("perf");
	let messages = [];
	let hashedMessages = [];
	let secretKey = "test123";
	let timerStart = Date.now();

	perf.innerText = "1. Performance test has started.\n";

	let timer = Date.now();
	for(let i = 0; i < amount; i++){
		messages[i] = btoa(getRandomInt(100000) + Date.now() + getRandomInt(100000));
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