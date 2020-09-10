const formToObject = async (form) => {
  const dataForm = new FormData(form);
  const data = {}
  
  for(const pair of dataForm.entries()) {
    data[pair[0]] = pair[1]
  }
  return data
}

const formErrors = (form, errors) => {
  const allInputs = form.getElementsByTagName('input')

  for (const key in errors) {
    if (errors.hasOwnProperty(key)) {
      for (let input of allInputs) {
        if (input.name === errors[key].path) {
          input.classList.add('is-invalid')
          input.insertAdjacentHTML("afterend", `<div class="invalid-feedback">${errors[key].message}</div>`);
        }
      }
    }
  }
}

const formClear = async (form) => {
  for (let input of form.getElementsByTagName('input')) {
    input.value = ''
  }
}

const closeCollaspse = () => {
  setTimeout(() => {
    document.querySelector('.collapse').classList.remove('show').classList.add('collapsing')
      setTimeout(() => {
      document.querySelector('.collapse').classList.remove('collapsing')
    }, 2000);
  }, 1000);
}

const getStorageBoxes = (value) => {
  axios({
    method: 'POST',
    url: `/api/storages/${selectStorages.value}/boxes`
  })
  .then(response => {
    if (response.status === 200) {
      selectBoxes.removeAttribute('disabled')
      selectBoxes.innerHTML = ''
      response.data.forEach(el => {
        const selected = value === el.id ? 'selected' : ''
        selectBoxes.innerHTML += `<option value="${el.id}" ${selected}>${el.name}</option>            `
      })
    }
  })
  .catch(err => {
    console.log(err);
  })
}

window.onload = () => {
  const customInputs = document.querySelectorAll('.custom-file-input');
  const formAddress = document.getElementById("addAddress");
  const takeImageProduct = document.getElementById("takeImageProduct");
  const selectStorages = document.getElementById('selectStorages')
  const selectBoxes = document.getElementById('selectBoxes')


  
  if (selectStorages  !== null && selectBoxes !== null) {
    selectStorages.addEventListener("click", () => {
      getStorageBoxes(selectBoxes.value)
    })
    selectStorages.addEventListener("change", () => {
      getStorageBoxes(selectBoxes.value)
    })
  }
  
  
  const newImage = document.querySelector('.new-image');
  if (customInputs  !== null) {
    bsCustomFileInput.init()
    customInputs.forEach(input => {
      input.addEventListener("change", (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = function(event) {
          newImage.src = event.target.result
          newImage.classList.remove('d-none')
        };
        
        reader.readAsDataURL(file);
        takeImageProduct.classList.add('d-none')
      })
    })
  }
  
  if (takeImageProduct !== null) {
    const controls = document.querySelector('.controls');
    const cameraOptions = document.querySelector('.video-options');
    const video = document.querySelector('video');
    const close = document.querySelector('button.close');
    const canvas = document.querySelector('canvas');
    const screenshotSelector = document.querySelector('.btn-select-image');
    const imageCamera = document.querySelector('.image-camera');
    const localFile = document.querySelector('.browse-image');
    const screenshotImage = document.querySelector('.screenshot>img');
    const buttons = [...controls.querySelectorAll('.controls button')];

    let streamStarted = false;

    const [play, screenshotBtn] = buttons;

    const constraints = {
      video: {
        width: {
          min: 1280,
          ideal: 1920,
          max: 2560,
        },
        height: {
          min: 720,
          ideal: 1080,
          max: 1440
        },
      }
    };

    cameraOptions.onchange = () => {
      const updatedConstraints = {
        ...constraints,
        deviceId: {
          exact: cameraOptions.value
        }
      };

      startStream(updatedConstraints);
    };

    play.onclick = () => {
      document.querySelector('.initial-msg').classList.add('d-none');
      if (streamStarted) {
        video.play();
        play.classList.add('d-none');
        return;
      }
      if ('mediaDevices' in navigator && navigator.mediaDevices.getUserMedia) {
        const updatedConstraints = {
          ...constraints,
          deviceId: {
            exact: cameraOptions.value
          }
        };
        startStream(updatedConstraints);
      }
    };
    
    const pauseStream = () => {
      video.pause();
      play.classList.remove('d-none');
    };
    
    const doScreenshot = () => {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext('2d').drawImage(video, 0, 0);
      screenshotImage.src = canvas.toDataURL('image/jpeg', 0.5);
      screenshotImage.classList.remove('d-none');
      screenshotSelector.classList.remove('d-none');
    };
    
    screenshotBtn.onclick = doScreenshot;

    screenshotSelector.onclick = () => {
      newImage.src = screenshotImage.src
      imageCamera.value = screenshotImage.src
      newImage.classList.remove('d-none');
      localFile.classList.add('d-none');
      pauseStream()
    }
    
    close.onclick = () => {
      pauseStream()
    }

    const startStream = async (constraints) => {
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      handleStream(stream);
    };


    const handleStream = (stream) => {
      video.srcObject = stream;
      play.classList.add('d-none');
      screenshotBtn.classList.remove('d-none');
    };


    const getCameraSelection = async () => {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      const options = videoDevices.map(videoDevice => {
        return `<option value="${videoDevice.deviceId}">${videoDevice.label}</option>`;
      });
      cameraOptions.innerHTML = options.join('');
    };

    getCameraSelection();
  }

  if (formAddress !== null) {
    const messageErrors = document.getElementById('messageErrors')
    const zipCode = document.getElementById('addressPostalCode')
    const city = document.getElementById('addressCity')
    const address = document.getElementById('addressAddress')
    const state = document.getElementById('addressState')
    const country = document.getElementById('addressCountry')
    const longitude = document.getElementById('addressLongitude')
    const latitude = document.getElementById('addressLatitude')
    
    const elementsToListen = [zipCode, country, address]

    elementsToListen.forEach(el => {
      el.addEventListener("change", () => {
        if (zipCode.value !== '' && country.value !== '' && address.value !== '') {
          zipCode.classList.remove('is-invalid')
          country.classList.remove('is-invalid')
          address.classList.remove('is-invalid')
          axios({
            method: 'GET',
            url: `https://maps.googleapis.com/maps/api/geocode/json?address=${address.value}, ${zipCode.value}, ${country.value}&key=neddapi`
          })
          .then(response => {
            if (response.data.status !== 'ZERO_RESULTS') {
              messageErrors.innerHTML = ''
              messageErrors.classList.add('d-none')
              let i = 0
              if (response.data.results[0].address_components.length >= 7) {
                i++
              }
              city.value = response.data.results[0].address_components[1+i].long_name;
              state.value = response.data.results[0].address_components[2+i].long_name;
              latitude.value = response.data.results[0].geometry.location.lat;
              longitude.value = response.data.results[0].geometry.location.lng;
            } else {
              messageErrors.classList.remove('d-none')
              messageErrors.innerHTML = ''
              messageErrors.innerHTML = 'Sorry, we could not verify your address exchange them or continuous'
            }
          })
          .catch(error => {
            console.log(error);
          })
        } else {
          elementsToListen.forEach(element => {
            if (element.value === '') {
              element.classList.add('is-invalid')
            }
          });
        }
      })
    })
    
    const buttonSend = document.querySelector('.btn-send')
    const listAddresses = document.getElementById('listAddresses')

    if (buttonSend  !== null) {
      buttonSend.addEventListener("click",  (e) => {
        e.preventDefault()
        formToObject(formAddress)
          .then(body => {
            axios({
              method: 'POST',
              url: '/api/addresses/new',
              data: body
            })
            .then(response => {
              if (response.status === 200) {
                messageErrors.innerHTML = ''
                messageErrors.classList.add('d-none')
                listAddresses.innerHTML += `<div class="col-sm-6 mb-4">
                <div class="card">
                <div class="card-body">
                <h5 class="card-title">${response.data.name}</h5>
                <p>${response.data.address}<br>${response.data.city}</p>
                <div class="custom-control custom-switch">
                <input type="radio" class="custom-control-input" name="address" id="address${response.data.id}" value="${response.data.id}" 
                checked="checked" required>
                <label class="custom-control-label" for="address${response.data.id}">Select this address.</label>
                </div>
                </div>
                </div>
                </div>`
                formClear(formAddress)
                .then(() => {
                  closeCollaspse()
                })
              } else {
                messageErrors.classList.remove('d-none')
                messageErrors.innerHTML = ''
                messageErrors.innerHTML = 'Sorry, we could not save your address check errors'
                formErrors(formAddress, response.data)
              }
            })
            .catch(err => {
              console.log(err);
            })
          })
          .catch(error => {
            console.log(error);
          })
      })
    }
  }
};