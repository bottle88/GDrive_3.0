import Upload from "./artifacts/contracts/Upload.sol/Upload.json";
import {useEffect, useState} from "react";
import FileUpload from "./components/FileUpload"
import Display from "./components/Display"
import Modal from "./components/Modal"
import './App.css';
// import { ethers } from "ethers";
const ethers = require("ethers")


function App() {

  const [account,setAccount] = useState('');
  const [contract,setContract] = useState(null);
  const [provider,setProvider] = useState(null);
  const [modalOpen,setModalOpen] = useState(false);


  useEffect(()=> {

    // const provider = new ethers.providers.Web3Provider(window.ethereum);
    const provider = new ethers.BrowserProvider(window.ethereum);
    const loadProvider = async() => {
      
      if (provider) {

        window.ethereum.on("chainChanged", () => {
          window.location.reload();
        });

        window.ethereum.on("accountsChanged", () => {
          window.location.reload();
        });

        // Metamask account !!
        await provider.send("eth_requestAccounts",[]);
        // const signer = provider.getSigner();
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        // console.log(address);  
        setAccount(address);

        // About Contract
        let contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3" ;
        const contract = new ethers.Contract(
          contractAddress,
          Upload.abi,
          signer
        );    //Contract Instance
        // console.log(contract);
        setContract(contract);
        setProvider(provider);


      } else {
        console.error("Metamask is not installed");
      }
    }

    provider && loadProvider();

  },[]);

  return (
    <>
      {!modalOpen && (
        <button className="share" onClick={() => setModalOpen(true)}>
          Share
        </button>
      )}
      {modalOpen && (
        <Modal setModalOpen={setModalOpen} contract={contract}></Modal>
      )}

      <div className="App">
        <h1 style={{ color: "white" }}>Gdrive 3.0</h1>
        <div class="bg"></div>
        <div class="bg bg2"></div>
        <div class="bg bg3"></div>

        <p style={{ color: "white" }}>
          Account : {account ? account : "Not connected"}
        </p>
        <FileUpload
          account={account}
          provider={provider}
          contract={contract}
        ></FileUpload>
        <Display contract={contract} account={account}></Display>
      </div>
    </>
  );
}

export default App;
