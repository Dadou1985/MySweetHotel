const queryString = window.location.search;
    console.log("url", queryString)
    const urlParams = new URLSearchParams(queryString);
    const hotelLogo = urlParams.get('url')
    const hotelId = urlParams.get('hotelId')
    const hotelName = urlParams.get('hotelName')

const manifestJSON = {
    "background_color": "#ffffff",
    "description": "",
    "display": "standalone",
    "lang": "en",
    "name": `${hotelName}`,
    "short_name": `${hotelName}`,
    "start_url": `https://mysweethotel.eu/?url=${hotelLogo}&hotelId=${hotelId}&hotelName=${hotelName}`,
    "theme_color": "#8ac8ff",
    "orientation": "portrait",
    "gcm_sender_id": "746435372425",
    "related_applications": [
      {
        "platform": "itunes",
        "id": "com.dadou1885.mySweatHotel"
      },
      {
        "platform": "play",
        "url": "http://play.google.com/store/apps/details?id=com.dadou1885.mySweatHotel",
        "id": "com.dadou1885.mySweatHotel"
      }
    ],
    "prefer_related_applications": true,
    "icons": [
      {
        "src": `${hotelLogo}`,
        "sizes": "512x512",
        "type": "image/png"
      }
    ]
  }

const stringManifest = JSON.stringify(manifestJSON)
const blob = new Blob([stringManifest], {type: 'application/json'})
const manifestURL = URL.createObjectURL(blob)
document.querySelector('#my-manifest-placeholder').setAttribute('href', manifestURL)