import * as THREE from "three";

export function createPoint(lat, lng, radius, scene, convert) {
  const pos = convert(lat, lng, radius + 1);

  const mesh = new THREE.Mesh(
    new THREE.SphereGeometry(0.8, 8, 8),
    new THREE.MeshBasicMaterial({ color: 0x00ffff })
  );

  mesh.position.copy(pos);
  scene.add(mesh);

  return pos;
}

export function createArc(start, end, radius, scene) {
  const mid = start.clone().add(end).multiplyScalar(0.5);
  mid.normalize().multiplyScalar(radius + 20);

  const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
  const points = curve.getPoints(50);

  const geo = new THREE.BufferGeometry().setFromPoints(points);

  const line = new THREE.Line(
    geo,
    new THREE.LineBasicMaterial({
      color: 0x00ffff,
      opacity: 0.4,
      transparent: true,
    })
  );

  scene.add(line);
}