
class HereMap {
  constructor(appId, appCode, mapElement) {
    this.appId = appId;
    this.appCode = appCode;
    this.platform = new H.service.Platform({
      app_id: this.appId,
      app_code: this.appCode,
    });

    this.map = new H.Map(
      mapElement,
      this.platform.createDefaultLayers().normal.map,
      {
        zoom: 10,
        center: { lat: 37, lng: -121 },
      }
    );

    this.map.addEventListener(
      "tap",
      (ev) => {
        var target = ev.target;
        this.map.removeObject(this.currentPosition);
        this.currentPosition = new H.map.Marker(
          this.map.screenToGeo(
            ev.currentPointer.viewportX,
            ev.currentPointer.viewportY
          )
        );
        this.map.addObject(this.currentPosition);
        this.fenceRequest(["1234"], this.currentPosition.getPosition()).then(
          (result) => {
            if (result.geometries.length > 0) {
              alert("You are within a geofence!");
            } else {
              console.log("Not within a geofence!");
            }
          }
        );
      },
      false
    );
    const mapEvent = new H.mapevents.MapEvents(this.map);
    const behavior = new H.mapevents.Behavior(mapEvent);
    this.geofencing = this.platform.getGeofencingService();
    this.currentPosition = new H.map.Marker({ lat: 37.21, lng: -121.21 });
    this.map.addObject(this.currentPosition);
  }
  draw(mapObject) {}
  polygonToWKT(polygon) {}
  uploadGeofence(layerId, name, geometry) {}
  fenceRequest(layerIds, position) {}

  polygonToWKT(polygon) {
    const geometry = polygon.getGeometry();
    return geometry.toString();
  }

  draw(mapObject) {
    this.map.addObject(mapObject);
  }

  uploadGeofence(layerId, name, geometry) {
    const zip = new JSZip();
    zip.file("data.wkt", "NAME\tWKT\n" + name + "\t" + geometry);
    return zip.generateAsync({ type: "blob" }).then((content) => {
      var formData = new FormData();
      formData.append("zipfile", content);
      return axios.post(
        "https://gfe.api.here.com/2/layers/upload.json",
        formData,
        {
          headers: {
            "content-type": "multipart/form-data",
          },
          params: {
            app_id: this.appId,
            app_code: this.appCode,
            layer_id: layerId,
          },
        }
      );
    });
  }

  fenceRequest(layerIds, position) {
    return new Promise((resolve, reject) => {
      this.geofencing.request(
        H.service.extension.geofencing.Service.EntryPoint.SEARCH_PROXIMITY,
        {
          layer_ids: layerIds,
          proximity: position.lat + "," + position.lng,
          key_attributes: ["NAME"],
        },
        (result) => {
          resolve(result);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }
}
