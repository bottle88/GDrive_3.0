import { useState } from "react";
// import {axios} from "axios";
import axios from "axios";
import "./FileUpload.css";

const FileUpload = ({contract, account, provider}) => {

    const [file,setFile] = useState(null);
    const [fileName,setFileName] = useState("No image selected");

    // Handle Image - TO upload image on IPFS

    const handleSubmit = async(e)=>{
        e.preventDefault();

        if (file) {
            try {
                const formData = new FormData();
                formData.append("file",file);

                const resFile = await axios({
                    method: "post",
                    url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
                    data: formData,
                    headers: {
                      pinata_api_key: `13b683cc4b319af18147`,
                      pinata_secret_api_key: `5aea6ba2eb30237214c611bc55d38f1d50b567fc8ab5f179d948c994838c0df0`,
                      "Content-Type": "multipart/form-data",
                    },
                  });
                
                const ImgHash = `https://gateway.pinata.cloud/ipfs/${resFile.data.IpfsHash}`;
                //   console.log(ImgHash);
                contract.add(account,ImgHash);
                alert("Successfully Image Uploaded");
                setFileName("No Image Selected");
                setFile(null);
                
            } catch (e) {
                alert("Unable to upload image to Pinata");
            }
        } 
    }
    
    // Retreive the File
    
    const retrieveFile =  (e) =>{
        const data = e.target.files[0];
        const reader = new window.FileReader();
        reader.readAsArrayBuffer(data);
        reader.onloadend = ()=>{
            setFile(e.target.files[0]);
        };
        // console.log(event.target.files[0].name)
        setFileName(e.target.files[0].name);
        e.preventDefault();
    }

    return (
        <div className="top">
      <form className="form" onSubmit={handleSubmit}>
        <label htmlFor="file-upload" className="choose">
          Choose Image
        </label>
        <input
          disabled={!account}
          type="file"
          id="file-upload"
          name="data"
          onChange={retrieveFile}
        />
        <span className="textArea">Image: {fileName}</span>
        <button type="submit" className="upload" disabled={!file}>
          Upload File
        </button>
      </form>
    </div>
    );
};

export default FileUpload;