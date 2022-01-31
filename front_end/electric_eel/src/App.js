
import './App.css';
import React from 'react';
import FormData from 'form-data'
import axios from 'axios';

import Button from "@mui/material/Button";


class App extends React.Component {
  state = {
    selectedFile:null,
    savedImages: [],
    imageFilteringText: ''
  }

  componentDidMount() {
    this.getImages()
}

  getImages = () =>{
    axios.get('https://firebasestorage.googleapis.com/v0/b/strive-62ef8/o/').catch(function (error) {
    if (error.response) {
      console.log(error.response.data);
      console.log(error.response.status);
      console.log(error.response.headers);
    } else if (error.request) {

      console.log(error.request);
    } else {
      console.log('Error', error.message);
    }
  }).then(response => {
    let imageUrls = []
    for (var i = 0; i < response.data.items.length; i++) {
      imageUrls.push(response.data.items[i].name);
      }
      this.setState({savedImages: imageUrls})
    });
  }

  fileUploadHandler = () =>{
    const fd = new FormData();
    if(this.state.selectedFile==null){
      alert("no file selected");
    }
    else{
      fd.append('image', this.state.selectedFile, this.state.selectedFile.name);
      axios.post('https://us-central1-strive-62ef8.cloudfunctions.net/uploadFile',fd).catch(function (error) {
      if (error.response) {
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {

        console.log(error.request);
      } else {
        console.log('Error', error.message);
      }
    }).then(response => {
          alert("Upload Successful!")
          this.getImages()
         });
     }
  }

  fileSelectedHandler = e => {
    this.setState({
      selectedFile:e.target.files[0]
    })
  }

  imageFilteringTextFn = e => {
    console.log(e.target.value)
    this.setState({
      imageFilteringText:e.target.value
    })
  }
    render(){
      return (
      <div className="App">
            <div id="center-square">
                <input className ="inputSearch"  type="search" onChange={this.imageFilteringTextFn} />
                <br />
                <br />
                <input  type="file" id="my_file_input" onChange={this.fileSelectedHandler} />
                <button variant="contained" color="primary" onClick={this.fileUploadHandler}>Upload Image</button>
                <ul>
                  {this.state.savedImages.map((item,index)=>{
                    if(item.includes(this.state.imageFilteringText)){
                      return(
                          <div id="image-square">
                            <img  className="uploadedPhoto" key={index} src={"https://firebasestorage.googleapis.com/v0/b/strive-62ef8/o/"+item+"?alt=media"} alt="uploaded image" />
                            {item.substr(0, 7) + '\u2026'}
                          </div>
                        )
                      }
                    })}
                </ul>
            </div>
      </div>

      );
    }
}

export default App;
