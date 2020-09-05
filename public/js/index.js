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


window.onload = () => {
  const formAddress = document.getElementById("addAddress");
  
  if (formAddress !== null) {
    const messageErrors = document.getElementById('messageErrors')
    const zipCode = document.getElementById('addressPostalCode')
    const city = document.getElementById('addressCity')
    const address = document.getElementById('addressAddress')
    const state = document.getElementById('addressState')
    const country = document.getElementById('addressCountry')
    const longitude = document.getElementById('addressLongitude')
    const latitude = document.getElementById('addressLatitude')
    const panelAddresCollapse = document.getElementById('collapseNewAddress')
    
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
    const listAddresses = document.getElementById('list-addresses')

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