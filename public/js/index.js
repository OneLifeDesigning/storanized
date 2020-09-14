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

const closeFormCollaspse = () => {
  const toCollapse = document.querySelector('.form-collapse')
  if(toCollapse) {
    setTimeout(() => {
      toCollapse.classList.remove('show')
    }, 1000);
  }
}

const getStorageBoxes = (value, object) => {
  if (value.length !== 0) {
    axios({
      method: 'GET',
      url: `/api/storages/${value}/boxes`
    })
    .then(response => {
      if (response.status === 200) {
        object.removeAttribute('disabled')
        object.innerHTML = ''
        response.data.forEach(el => {
          const selected = value === el.id ? 'selected' : ''
          object.innerHTML += `<option value="${el.id}" ${selected}>${el.name}</option>            `
        })
      }
    })
    .catch(err => {
      console.log(err);
    })
  }
}

const getStorages = (storages) => {
  axios({
    method: 'GET',
    url: `/api/storages`
  })
  .then(response => {
    if (response.status === 200) {
      if (storages.getAttribute('disabled')) {
        storages.removeAttribute('disabled')
      }
      storages.innerHTML = ''
      response.data.forEach(el => {
        storages.innerHTML += `<option value="${el.id}">${el.name}</option>            `
      })
    }
  })
  .catch(err => {
    console.log(err);
  })
}

const mapSetAddress = document.getElementById('mapSetAddress')
const mapViewAddress = document.getElementById('mapViewAddress')

const breadcrumb = document.getElementById('breadcrumb')

if (breadcrumb) {
  const childs = breadcrumb.childNodes
  if (childs[childs.length-4]) {
    childs[childs.length-4].classList.add('active')
  }
}

function initMap() {
  const myLatlng = {lat: 40.459452, lng: -3.690572};
  let map = ''
  let infoWindow = ''
  
  if (mapSetAddress && navigator.geolocation) {
    const options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    };
    
    const success = (pos) => {
      const crd = pos.coords;
      setTimeout(() => {
        map.setCenter({lat: crd.latitude, lng: crd.longitude})
        if (mapSetAddress) {
            infoWindow.close();
            infoWindow = new google.maps.InfoWindow({content: 'Click the map to get Address!', position: {lat: crd.latitude, lng: crd.longitude}});
            infoWindow.open(map);
        }
      }, 3000);
    }

    const error = (err) => {
      console.warn(`ERROR(${err.code}): ${err.message}`);
    }

    navigator.geolocation.getCurrentPosition(success, error, options)
  }

  if (mapSetAddress) {
    const geocoder = new google.maps.Geocoder();
    map = new google.maps.Map(mapSetAddress, {zoom: 15, center: myLatlng});
    infoWindow = new google.maps.InfoWindow({content: 'Click the map to get Address!', position: myLatlng});
    infoWindow.open(map);
    
    map.addListener('click', function(event) {
      geocoder.geocode({
        'latLng': event.latLng
      }, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          if (results[0]) {
            axios({
              method: 'GET',
              url: `https://maps.googleapis.com/maps/api/geocode/json?address=${results[0].formatted_address}&key=AIzaSyBYXm379NbtX6xF2bMJzEb_9R0lyKX5k8A`
            })
            .then(response => {
              infoWindow.close();
              infoWindow = new google.maps.InfoWindow({position: event.latLng});
              infoWindow.setContent(`<p>${results[0].formatted_address}<br>Cordinates: ${response.data.results[0].geometry.location.lat}, ${response.data.results[0].geometry.location.lng}</p><a href="#0" class="btn btn-primary" id="setAddress" data-address="${response.data.results[0].address_components[1].long_name}" data-number="${response.data.results[0].address_components[0].long_name}" data-city="${response.data.results[0].address_components[2].long_name}" data-state="${response.data.results[0].address_components[4].long_name}" data-country="${response.data.results[0].address_components[5].long_name}" data-postalcode="${response.data.results[0].address_components[6].long_name}" data-lat="${response.data.results[0].geometry.location.lat}" data-long="${response.data.results[0].geometry.location.lng}"
              >Use this</a>`);
              infoWindow.open(map);
            })
            .catch(error => {
              console.log(error);
            })
          }
        }
      });
    });

    document.addEventListener('click',function(e){
      if(e.target && e.target.id === 'setAddress'){
        const address = document.getElementById('addressAddress')
        address.value = `${e.path[0].dataset.address}, ${e.path[0].dataset.number}`
        const zipCode = document.getElementById('addressPostalCode')
        zipCode.value = e.path[0].dataset.postalcode
        const city = document.getElementById('addressCity')
        city.value = e.path[0].dataset.city
        const state = document.getElementById('addressState')
        state.value = e.path[0].dataset.state
        const country = document.getElementById('addressCountry')
        country.value = e.path[0].dataset.country
        const longitude = document.getElementById('addressLongitude')
        longitude.value = e.path[0].dataset.long
        const latitude = document.getElementById('addressLatitude')
        latitude.value = e.path[0].dataset.lat
      }
    })

  }

  if (mapViewAddress) {
    map = new google.maps.Map(mapViewAddress, {zoom: 15, center: myLatlng});
    map.setCenter({lat: Number(mapViewAddress.dataset.lat), lng: Number(mapViewAddress.dataset.long)})
    infoWindow = new google.maps.InfoWindow({position: {lat: Number(mapViewAddress.dataset.lat), lng: Number(mapViewAddress.dataset.long)}});
    infoWindow.setContent(`<h5><b>${mapViewAddress.dataset.name}</b></h5><p>${mapViewAddress.dataset.address}<br>${mapViewAddress.dataset.postalcode} - ${mapViewAddress.dataset.city} <br> ${mapViewAddress.dataset.state}<br>${mapViewAddress.dataset.country}</p>`);
    infoWindow.open(map);
  }
}
const countNewMsgToBullet = (data, ele) => {
  if (data && ele) {
    if (ele.classList.contains('d-none')) {
      ele.classList.remove('d-none')
    }
    ele.innerText = data.length;
  }
}
const countNewMsgToList = (newMessages, toPrint) => {
  if (newMessages && toPrint) {
    const messages = newMessages.filter(message => {
      return message.chatId === toPrint.dataset.chatid
    })
    if (messages.length > 0) {
      messages.forEach(msg => {
        toPrint.innerHTML += `<div class="incoming_msg"><div class="incoming_msg_img"><img src="${msg.from.avatar}" alt="${msg.from.username}" class="rounded-circle img-fluid"> </div><div class="received_msg mb-1"><div class="received_withd_msg"><p>${msg.text}</p><span class="time_date">${msg.createdAt}</span></div></div></div>`
        listMsg.scrollTop = listMsg.scrollHeight;
        markReadMsg(msg.id)
      })
    }
  }
} 
const markReadMsg = (id) => {
  axios({
    method: 'POST',
    url: '/api/junglesales/chats/messages/readed',
    data: {id: id}
  })
  .then(response => {
    if (response.status === 200) {
      console.log('mark ok');
    }
  })
  .catch()
}
const getMsgPending = (bullet, list) => {
  axios({
    method: 'GET',
    url: '/api/junglesales/chats/messages/get'
  })
  .then(response => {
    countNewMsgToBullet(response.data, bullet)
    countNewMsgToList(response.data, list)
  })
  .catch()
}

window.onload = () => {
  const collapserBtn = document.querySelector('.btn-collapser');
  const customInputs = document.querySelectorAll('.custom-file-input');
  const formAddress = document.getElementById("addAddress");
  const formBox = document.getElementById("addBox");
  const takeImageProduct = document.getElementById("takeImageProduct");
  const selectStorages = document.getElementById('selectStorages')
  const selectBoxes = document.getElementById('selectBoxes')
  const newImage = document.querySelector('.new-image');
  const sentNewMsg = document.getElementById('newMsg')
  const badgetNewMsgs = document.getElementById('badgetNewMsgs')
  const listMsg = document.getElementById('listMsg')
  const noMsg = document.getElementById('noMsg')


  if (collapserBtn) {
    collapserBtn.addEventListener("click", (e) => {
      const targetSlash = e.path[0].dataset.target
      const targetId = targetSlash.substring(1)

      const moveTo = document.getElementById(targetId)
      console.log(moveTo);
      setTimeout(() => {
        moveTo.scrollIntoView()
      }, 500);
    })
  }
  if (selectStorages && selectBoxes) {
    selectStorages.addEventListener("change", (e) => {
        getStorageBoxes(e.target.value, selectBoxes)
    })
  }
  if (badgetNewMsgs) {
    if (listMsg) {
      getMsgPending(badgetNewMsgs, listMsg)
      setInterval(() => {
        getMsgPending(badgetNewMsgs, listMsg)
      }, 10000);
    } else {
      getMsgPending(badgetNewMsgs)
      setInterval(() => {
        getMsgPending(badgetNewMsgs)
      }, 10000);
    }
  }

  if (sentNewMsg && listMsg) {
    listMsg.scrollTop = listMsg.scrollHeight;
    const sendMsgButton = sentNewMsg.childNodes[3]
    const sendMsgInput = sentNewMsg.childNodes[1]
    
    const sendToApiNewMsg = () => {
      if (!sendMsgInput.value) {
        sendMsgInput.classList.add('is-invalid')
      } else {
        sendMsgInput.classList.remove('is-invalid')
        const data = { text: sendMsgInput.value, chatId: sendMsgButton.dataset.id, from: sendMsgButton.dataset.from};
        axios({
          method: 'POST',
          url: '/api/junglesales/chats/messages/new',
          data: data
        })
        .then(response => {
          if (response.status === 200) {
            sendMsgInput.value = ''
            if(noMsg) {
              noMsg.classList.add('d-none')
            }
            listMsg.innerHTML += `<div class="outgoing_msg"><div class="sent_msg"><p>${response.data.text}</p><span class="time_date">Just Now</span></div></div>`
            listMsg.scrollTop = listMsg.scrollHeight;
          }
        })
        .catch()
      }
    }
    
    sendMsgButton.addEventListener('click', () => {
      sendToApiNewMsg()
    })
    
    sendMsgInput.addEventListener('keypress', function (e) {
      if (e.key === 'Enter') {
        sendToApiNewMsg()
      }
  });
  
  }

  if (customInputs) {
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
  
  if (takeImageProduct) {
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

  if (formBox) {
    const messageErrors = document.getElementById('messageErrors')
    const boxStorage = document.getElementById('boxStorage')
    
    if (boxStorage) {
      getStorages(boxStorage)
    }

    const buttonSend = document.querySelector('.btn-send')

    if (buttonSend) {
      buttonSend.addEventListener("click",  (e) => {
        e.preventDefault()
        formToObject(formBox)
          .then(body => {
            axios({
              method: 'POST',
              url: '/api/boxes/new',
              data: body
            })
            .then(response => {
              if (response.status === 200) {
                messageErrors.innerHTML = ''
                messageErrors.classList.add('d-none')
                formClear(formBox)
                .then(() => {
                  closeFormCollaspse()
                  if (response.data.storage) {
                    selectStorages.value = response.data.storage
                  }
                })
              } else {
                messageErrors.classList.remove('d-none')
                messageErrors.innerHTML = ''
                messageErrors.innerHTML = 'Sorry, we could not save your address check errors'
                formErrors(formBox, response.data)
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

  if (formAddress) {
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
            url: `https://maps.googleapis.com/maps/api/geocode/json?address=${address.value}, ${zipCode.value}, ${country.value}&key=AIzaSyBYXm379NbtX6xF2bMJzEb_9R0lyKX5k8A`
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

    if (buttonSend) {
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
                  closeFormCollaspse()
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