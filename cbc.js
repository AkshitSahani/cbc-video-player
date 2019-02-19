    const regex = /^\d+$/;
    let currentVideoId;
    let activeTab = 'Normal';

    adjustVideo = () => {
      let video = document.querySelector('#video');
      if(video){
        if(window.innerWidth < 700 &&  window.innerWidth > 500){
          setActiveTab(document.getElementsByClassName('btn')[2]);
          video.width = 500;
        }
        else if(window.innerWidth < 500){
          setActiveTab(document.getElementsByClassName('btn')[1]);
          video.width = 300;
        }
      }
    }

    window.addEventListener('resize', adjustVideo);

    const fetchVideo = async (id) => {
      try{

        toggleLoader();
        // console.log('inside fetch video function!!!')
        const response = await fetch(`https://www.cbc.ca/bistro/order?mediaId=${id}`);
        const myJson = await response.json(); //extract JSON from the http response
        // console.log('JSON resposne', myJson);
        toggleLoader();
        if(myJson.errors.length){
          createError('the id provided does not have a video associated with it! Please try again', 'search');
        }
        else{
          currentVideoId = id;
          removeError();
          const {assetDescriptors, title, thumbnail, description, } = myJson.items[0];
          console.log(assetDescriptors, title, thumbnail, description);
          renderVideo(assetDescriptors[1].key, title, thumbnail, description);
        }
      }
      catch(e){
        console.log('error in fetching video', e);
        console.log('full error', e.response);
      }
    }

    onKeyPress = () => {
      let userInput = document.querySelector('input').value.trim();
      console.log('key pressed!!!', userInput);
      let submitButton = document.querySelector('.submit');
      userInput !== '' ? submitButton.disabled = false : submitButton.disabled = true;
    }

    onSubmit = () => {
      let userInput = document.querySelector('input').value.trim();
      // console.log('videoID', userInput);
      if(userInput === currentVideoId){
        return createError('this video is already being watched!', 'search')
      }
      if(regex.test(userInput)){
        removeError();
        return fetchVideo(userInput);
      }
      createError('video Ids can only be numbers! Please try again', 'search');
    }

    renderCourtesy = () => {
      let courtesy = document.createElement('p');
      courtesy.className = 'courtesy';
      let text = document.createTextNode('Video courtesy of ');
      courtesy.appendChild(text);
      courtesy.appendChild(createLink('https://www.cbc.ca', 'CBC'));
      return courtesy;
    }

    createLink = (url, text) => {
      let link = document.createElement('a');
      link.href = url;
      link.target = "_blank";
      link.innerHTML = text;
      link.className = 'link';
      return link;
    }

    renderTitle = (title) => {
      let heading = document.createElement('h2');
      heading.className = 'title';
      heading.innerHTML = title;
      return heading;
    }

    renderDescription = (desc) => {
      let description =  document.createElement('p');
      description.className = 'desc';
      description.innerHTML = desc;
      return description;
    }

    createVideo = (url) => {
      let video = document.createElement('video');
      video.id = 'video';
      video.autoplay = true;
      video.setAttribute('controls', true);
      video.width = 500;
      let source = document.createElement('source');
      source.setAttribute('src', url);
      video.appendChild(source);
      return video;
    }

    toggleVideo = (video) => {
      let pausePlay = document.querySelector('.pause-play');
      if(video.paused){
        video.play();
        return pausePlay.innerHTML = 'Pause'
      }
      video.pause();
      pausePlay.innerHTML = 'Play'
    }

    createButtons = (video) => {
      let text = ['Pause', 'Small', 'Normal', 'Big', 'Full Screen'];
      let videoDimensions = [0, 300, 500, 700]; //0th element doesnt matter

      let buttonsContainer = document.createElement('div');
      buttonsContainer.className = 'buttons';

      for(var i = 0; i < 5; i++){
        let button = document.createElement('button');
        button.className = 'btn';
        if(i === 0){
          button.classList.add('pause-play');
          button.onclick = () => toggleVideo(video);
        }
        else if(i > 3){
          button.onclick = () => video.requestFullscreen ? video.requestFullscreen() : null;
        }
        else{
          let width = videoDimensions[i];
          if(i === 2){
            button.classList.add('active-tab');
          }
          button.onclick = () => {
            video.width = width;
            setActiveTab(button);
          }
        }
        button.innerHTML = text[i];
        buttonsContainer.appendChild(button);
      }
      return buttonsContainer;
    }

    setActiveTab = (button) => {
      let currentlyActive = document.querySelector('.active-tab');
      currentlyActive.classList.remove('active-tab');
      button.classList.add('active-tab');
    }

    renderVideo = (url, title, img, desc) => {
      let existingContainer = document.querySelector('.vid-container');
      existingContainer ? existingContainer.parentNode.removeChild(existingContainer) : null;

      let container = document.createElement('div');
      container.className = 'vid-container';
      let video = createVideo(url);
      let buttons = createButtons(video);
      container.appendChild(renderTitle(title))
      container.appendChild(buttons);
      container.appendChild(video);
      container.appendChild(renderDescription(desc));
      container.appendChild(renderCourtesy());
      document.querySelector('body').appendChild(container);
    }

    createError = (message, appendTo) => {
      removeError();
      let error = document.createElement('p');
      error.className = 'error';
      let errorText = document.createTextNode(`Oops, ${message}`);
      error.appendChild(errorText);
      document.querySelector(`.${appendTo}`).appendChild(error);
    }

    removeError = () => {
      let error = document.querySelector('.error');
      error ? error.parentNode.removeChild(error) : null;
    }

    toggleLoader = () => {
      // console.log('in toggleLoader function');
      let loader = document.querySelector('.loader');
      // console.log('loader', loader,);
      loader.classList.toggle('hidden');
    }
