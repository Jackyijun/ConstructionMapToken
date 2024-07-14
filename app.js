require([
    "esri/identity/IdentityManager",
    "esri/Map",
    "esri/views/MapView",
    "esri/layers/FeatureLayer",
    "esri/widgets/Search",
    "esri/widgets/Legend"
  ], function(IdentityManager, Map, MapView, FeatureLayer, Search, Legend) {

    async function fetchToken() {
      const response = await fetch('http://localhost:3000/generateToken');
      const data = await response.json();
  
      if (data.error) {
        throw new Error(data.error);
      }
  
      return data.token;
    }
  
    async function initialize() {
      const token = await fetchToken(); // Fetch the token from the backend
      
      IdentityManager.registerToken({
        server: "https://admin-enterprise-gis.ucsd.edu/portal",
        token: token,
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
        url: `https://admin-enterprise-gis.ucsd.edu/server/rest/services/Hosted/Busyness_poly/FeatureServer/0`,
        outFields: ["*"], // Ensure all fields are fetched
        popupTemplate: {
          title: "{Name}",
          content: [{
            type: "fields",
            fieldInfos: [
              { fieldName: "Name", label: "Name" },
              { fieldName: "AcademicStatus", label: "AcademicStatus" },
              { fieldName: "BuildingCategory", label: "BuildingCategory" },
              { fieldName: "Busyness", label: "Busyness" }
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
  