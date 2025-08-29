import { ethers } from "ethers";

export async function connectWallet() {
  if (window.ethereum) {
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      return address;
    } catch (err) {
      console.error("Wallet connection error:", err);
    }
  } else {
    alert("Metamask가 설치되어 있어야 합니다!");
  }
}
