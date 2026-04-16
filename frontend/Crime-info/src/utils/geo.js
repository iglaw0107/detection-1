import * as THREE from "three";

export function latLngToVec3(lat, lng, radius) {
  const phi = (90 - lat) * Math.PI / 180;
  const theta = (lng + 180) * Math.PI / 180;

  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

export function drawCountries(geojson, scene, radius) {
  const group = new THREE.Group();

  geojson.features.forEach(feature => {
    const coords = feature.geometry.coordinates;

    const drawPolygon = polygon => {
      polygon.forEach(ring => {
        const points = ring.map(([lng, lat]) =>
          latLngToVec3(lat, lng, radius + 0.2)
        );

        const geo = new THREE.BufferGeometry().setFromPoints(points);

        const mat = new THREE.LineBasicMaterial({
          color: 0x00ffff,
          opacity: 0.8,
          transparent: true,
        });

        group.add(new THREE.Line(geo, mat));
      });
    };

    if (feature.geometry.type === "Polygon") {
      drawPolygon(coords);
    } else {
      coords.forEach(drawPolygon);
    }
  });

  scene.add(group);
}