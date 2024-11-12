function calculateNetwork() {
	const ipInput = document.getElementById("ip").value;
	const subnetInput = document.getElementById("subnet").value;
	const ipParts = ipInput.split(".");
  
	const subnetMaskLength = parseInt(subnetInput);
	const subnetBinary = (("1".repeat(subnetMaskLength) + "0".repeat(32 - subnetMaskLength)).match(/.{1,8}/g)).map(b => parseInt(b, 2));
  
	const networkAddress = [];
	for (let i = 0; i < 4; i++) {
		networkAddress.push(parseInt(ipParts[i]) & subnetBinary[i]);
	}
  
	const broadcastAddress = [];
	for (let i = 0; i < 4; i++) {
		broadcastAddress.push(parseInt(ipParts[i]) | (~subnetBinary[i] & 0xFF));
	}
	const broadcastAddressString = broadcastAddress.join(".");
  
	const hostBits = 32 - subnetMaskLength;
	const usableHosts = Math.pow(2, hostBits) - 2;
 
	const firstHost = [...networkAddress];
	firstHost[3] += 1;
	const firstHostString = firstHost.join(".");
  
	const lastHost = [...broadcastAddress];
	lastHost[3] -= 1;
	const lastHostString = lastHost.join(".");
  
	const range = `${firstHostString} - ${lastHostString}`;

	let ipClass;
	if (ipParts[0] <= 126) {
	  ipClass = "A";
	} else if (ipParts[0] <= 191) {
	  ipClass = "B";
	} else if (ipParts[0] <= 223) {
	  ipClass = "C";
	} else {
	  ipClass = "D or E";
	}

	let isPublic;
	if (ipParts[0] === "10" || (ipParts[0] === "172" && parseInt(ipParts[1]) >= 16 && parseInt(ipParts[1]) <= 31) || (ipParts[0] === "192" && parseInt(ipParts[1]) === 168)) {
	  isPublic = false;
	} else {
	  isPublic = true;
	}

	const binaryIP = ipParts.map(part => parseInt(part).toString(2).padStart(8, "0")).join(""); // IP en binario
  
	const networkBinaryString = binaryIP.substring(0, subnetMaskLength); // Bits de red
	const hostBinaryString = binaryIP.substring(subnetMaskLength);      // Bits de host

	const coloredNetwork = networkBinaryString.split("").map(bit => `<span class="red">${bit}</span>`).join("");
	const coloredHost = hostBinaryString.split("").map(bit => `<span class="green">${bit}</span>`).join("");

	const resultHTML = `
	  <p>Direccion IP: ${ipInput}</p>
	  <p>IP de Broadcast: ${broadcastAddressString}</p>
	  <p>Numero de Hosts disponibles: ${usableHosts}</p>
	  <p>Rango de Hosts disponibles: ${range}</p>
	  <p>Clase de la direccion: ${ipClass}</p>
	  <p>Es una IP Publica?: ${isPublic ? "Yes" : "No"}</p>
	  <p>Porcion de red y host en binario: 
	    <div style="font-family: monospace; padding: 5px; border: 1px solid #ccc; display: inline-block;">
	      ${coloredNetwork}${coloredHost}
	    </div>
	  </p>
	`;

	document.getElementById("result").innerHTML = resultHTML;
}

const style = document.createElement('style');
style.innerHTML = `
	.red {
		background-color: #ff6666;
		padding: 2px 4px;
		color: white;
	}
	.green {
		background-color: #66ff66;
		padding: 2px 4px;
		color: black;
	}
`;
document.head.appendChild(style);

