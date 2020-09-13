function initMap() {

  const myLatlng = {lat: 40.459452, lng: -3.690572};
  
  const geocoder = new google.maps.Geocoder();

  const map = new google.maps.Map(document.getElementById('map'), {zoom: 15, center: myLatlng});
  let infoWindow = new google.maps.InfoWindow({content: 'Click the map to get Address!', position: myLatlng});
  infoWindow.open(map);

  if (navigator.geolocation) {
    var options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    };
    
    const success = (pos) => {
      var crd = pos.coords;
      setTimeout(() => {
        map.setCenter({lat: crd.latitude, lng: crd.longitude})
        infoWindow.close();
        infoWindow = new google.maps.InfoWindow({content: 'Click the map to get Address!', position: {lat: crd.latitude, lng: crd.longitude}});
        infoWindow.open(map);
      }, 3000);
    }

    const error = (err) => {
      console.warn(`ERROR(${err.code}): ${err.message}`);
    }

    navigator.geolocation.getCurrentPosition(success, error, options)

  } 

  map.addListener('click', function(event) {
    geocoder.geocode({
      'latLng': event.latLng
    }, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        if (results[0]) {
          axios({
            method: 'GET',
            url: `https://maps.googleapis.com/maps/api/geocode/json?address=${results[0].formatted_address}&key=NEEDAPI`
          })
          .then(response => {
            infoWindow.close();
            infoWindow = new google.maps.InfoWindow({position: event.latLng});
            infoWindow.setContent(`<p>${results[0].formatted_address}<br>Cordinates: ${response.data.results[0].geometry.location.lat}, ${response.data.results[0].geometry.location.lng}</p><a href="#0" class="btn btn-primary set-address" data-address="${response.data.results[0].address_components[1].long_name}" data-number="${response.data.results[0].address_components[0].long_name}" data-city="${response.data.results[0].address_components[2].long_name}" data-state="${response.data.results[0].address_components[4].long_name}" data-country="${response.data.results[0].address_components[5].long_name}" data-postalCode="${response.data.results[0].address_components[6].long_name}" data-lat="${response.data.results[0].geometry.location.lat}" data-long="${response.data.results[0].geometry.location.lng}"
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
}
