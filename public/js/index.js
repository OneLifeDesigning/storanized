const formToObject = async (form) => {
  const dataForm = new FormData(form);
  const data = {}
  
  for(const pair of dataForm.entries()) {
    data[pair[0]] = pair[1]
  }
  return data
}

const formToString = async (form) => {
  const dataForm = new FormData(form);
  const data = []
  
  for(const value of dataForm.values()) {
    data.push(value)
  }
  data.shift()
  return data.toString()
}

window.onload = () => {
  const formAddressApi = document.getElementById("apiAddress");
  
  if (formAddressApi !== null) {
    const butonSend = formAddressApi.getElementsByClassName('btn-send')[0]
    const address = formAddressApi.getElementsByTagName('input')[1]
    address.addEventListener("change", () => {
      formToString(formAddressApi)
      .then(string => {
        axios({
          method: 'GET',
          url: `https://maps.googleapis.com/maps/api/geocode/json?address=${string}&key=AIzaSyCz26pVEyOnMuAuOAE7H_LCBhDk_V-_MmE`
        })
        .then(response => {
          console.log(response)
        })
        .catch(error => {
          console.log(error);
        })
      })
      .catch(error => {
        console.log(error);
      })
    });
    
    butonSend.addEventListener("click",  () => {
      formToObject(formAddressApi)
        .then(body => {
          axios({
            method: 'POST',
            url: '/api/addresses/new',
            data: body
          })
          .then(response => {
            console.log(response.data);
          })
          .catch(error => {
            console.log(error);
          })
        })
        .catch(error => {
          console.log(error);
        })
    })
  }
};
