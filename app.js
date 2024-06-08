require([
    "esri/identity/IdentityManager",
    "esri/Map",
    "esri/views/MapView",
    "esri/layers/FeatureLayer",
    "esri/widgets/Search",
    "esri/widgets/Legend"
  ], function(IdentityManager, Map, MapView, FeatureLayer, Search, Legend) {


    // async function generateToken(clientId, clientSecret) {
    //   const params = new URLSearchParams();
    //   params.append('client_id', clientId);
    //   params.append('client_secret', clientSecret);
    //   params.append('grant_type', 'client_credentials');
    //   params.append('expiration', 1440); // Token expiration time in minutes (optional)
    //   params.append('f', 'json');
  
    //   const response = await fetch('https://www.arcgis.com/sharing/rest/oauth2/token', {
    //     method: 'POST',
    //     body: params
    //   });
  
    //   const data = await response.json();
  
    //   if (data.error) {
    //     throw new Error(data.error.message);
    //   }
  
    //   return data.access_token;
    // }

    async function fetchToken() {
      const response = await fetch('http://localhost:3000/generateToken');
      const data = await response.json();
  
      if (data.error) {
        throw new Error(data.error);
      }
  
      return data.token;
    }
  
    async function initialize() {
      // const token = await generateToken(process.env.CLIENT_ID,process.env.CLIENT_SECRET); // Get the temporary token
      // const token = await generateToken("rsLkOWeKLsKiXnrf","b5867dbe3f9a40ad9d6864f941e9e0c5");
      // console.log(token);
      const token = await fetchToken(); // Fetch the token from the backend
      
      IdentityManager.registerToken({
        server: "https://ucsdonline.maps.arcgis.com",
        token: token,
        // userId: "yil@ucsd.edu", // Replace with your ArcGIS username
        expires: Date.now() + 2 * 60 * 60 * 1000 // Token expiration time in milliseconds
      });
  
      document.getElementById('mapTab').addEventListener('click', function() {
        document.getElementById('generalTabContent').style.display = 'none';
        document.getElementById('mapTabContent').style.display = 'block';
        loadMap();
      });
  
      document.getElementById('generalTab').addEventListener('click', function() {
        document.getElementById('mapTabContent').style.display = 'none';
        document.getElementById('generalTabContent').style.display = 'block';
      });
    }
  
    function loadMap() {
      var map = new Map({
        basemap: "topo-vector"
      });
  
      var view = new MapView({
        container: "viewDiv",
        map: map,
        center: [-117.236378, 32.8800607], // Longitude, latitude
        zoom: 15
      });
  
      var layer = new FeatureLayer({
        url: `https://services1.arcgis.com/eGSDp8lpKe5izqVc/arcgis/rest/services/polygon_busyness_layer/FeatureServer/0`,
        outFields: ["*"], // Ensure all fields are fetched
        popupTemplate: {
          title: "{building}",
          content: [{
            type: "fields",
            fieldInfos: [
              { fieldName: "building", label: "Building" },
              { fieldName: "busyness", label: "Busyness" },
              { fieldName: "Shape__Area", label: "Shape Area" },
              { fieldName: "Shape__Length", label: "Shape Length" }
            ]
          }]
        }
      });
  
      map.add(layer);
  
      var searchWidget = new Search({
        view: view
      });
  
      view.ui.add(searchWidget, {
        position: "top-right"
      });
  
      var legend = new Legend({
        view: view,
        container: "legendDiv"
      });

      view.ui.add(legend, {
        position: "top-left"
      });

    }
  
    initialize();
  });
  