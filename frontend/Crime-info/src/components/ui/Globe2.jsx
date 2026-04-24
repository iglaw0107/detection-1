// import { useEffect, useRef } from "react";
// import * as THREE from "three";
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

// const RADIUS = 100;

// export default function Globe() {
//   const mountRef = useRef(null);

//   useEffect(() => {
//     let scene = new THREE.Scene();

//     let camera = new THREE.PerspectiveCamera(
//       45,
//       mountRef.current.clientWidth / mountRef.current.clientHeight,
//       0.1,
//       1000
//     );

//     camera.position.set(0, 20, 260);

//     let renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
//     renderer.setSize(
//       mountRef.current.clientWidth,
//       mountRef.current.clientHeight
//     );

//     mountRef.current.appendChild(renderer.domElement);

//     let controls = new OrbitControls(camera, renderer.domElement);
//     controls.enableDamping = true;

//     // 🌍 Globe
//     const globeGeo = new THREE.SphereGeometry(RADIUS, 128, 128);

//     const texture = new THREE.TextureLoader().load("/earthmap.jpg"); // add texture

//     const globeMat = new THREE.MeshPhongMaterial({
//       map: texture
//     });

//     const globe = new THREE.Mesh(globeGeo, globeMat);
//     scene.add(globe);

//     // 💡 Lighting
//     scene.add(new THREE.AmbientLight(0xffffff, 0.6));

//     const light = new THREE.DirectionalLight(0xffffff, 0.6);
//     light.position.set(100, 100, 100);
//     scene.add(light);

//     // 🌍 Load GeoJSON
//     fetch("/data/countries.geojson")
//       .then(res => res.json())
//       .then(data => drawCountries(data, scene));

//     // 🔁 Animation
//     const animate = () => {
//       requestAnimationFrame(animate);
//       controls.update();
//       renderer.render(scene, camera);
//     };
//     animate();

//     // 🧹 Cleanup
//     return () => {
//       renderer.dispose();
//       mountRef.current.removeChild(renderer.domElement);
//     };
//   }, []);

//   return <div ref={mountRef} style={{ width: "100%", height: "100vh" }} />;
// }

// // ===== HELPERS =====

// function latLngToVec3(lat, lng, radius) {
//   const phi = (90 - lat) * Math.PI / 180;
//   const theta = (lng + 180) * Math.PI / 180;

//   return new THREE.Vector3(
//     -radius * Math.sin(phi) * Math.cos(theta),
//     radius * Math.cos(phi),
//     radius * Math.sin(phi) * Math.sin(theta)
//   );
// }

// function drawCountries(geojson, scene) {
//   const group = new THREE.Group();

//   geojson.features.forEach(feature => {
//     const coords = feature.geometry.coordinates;

//     const drawPolygon = polygon => {
//       polygon.forEach(ring => {
//         const points = ring.map(([lng, lat]) =>
//           latLngToVec3(lat, lng, RADIUS + 0.2)
//         );

//         const geometry = new THREE.BufferGeometry().setFromPoints(points);

//         const material = new THREE.LineBasicMaterial({
//           color: 0x4cc9f0,
//           transparent: true,
//           opacity: 0.6
//         });

//         group.add(new THREE.Line(geometry, material));
//       });
//     };

//     if (feature.geometry.type === "Polygon") {
//       drawPolygon(coords);
//     } else if (feature.geometry.type === "MultiPolygon") {
//       coords.forEach(drawPolygon);
//     }
//   });

//   scene.add(group);
// }



import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { latLngToVec3, drawCountries } from "../utils/geo";
import { createPoint, createArc } from "../utils/points";

const RADIUS = 100;

export default function Globe() {
  const mountRef = useRef(null);

  useEffect(() => {
    let scene = new THREE.Scene();

    let camera = new THREE.PerspectiveCamera(
      45,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      2000
    );
    camera.position.set(0, 20, 260);

    let renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(
      mountRef.current.clientWidth,
      mountRef.current.clientHeight
    );

    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.5;

    mountRef.current.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    //////////////////////////////////////
    // 🌍 REALISTIC EARTH
    //////////////////////////////////////
    const loader = new THREE.TextureLoader();

    const earthMap = loader.load("/textures/earth_day.jpg");

    const globe = new THREE.Mesh(
      new THREE.SphereGeometry(RADIUS, 128, 128),
      new THREE.MeshPhongMaterial({ map: earthMap })
    );

    scene.add(globe);

    //////////////////////////////////////
    // 🌫️ ATMOSPHERE
    //////////////////////////////////////
    const atmosphere = new THREE.Mesh(
      new THREE.SphereGeometry(RADIUS * 1.02, 64, 64),
      new THREE.MeshBasicMaterial({
        color: 0x00ffff,
        transparent: true,
        opacity: 0.1,
        side: THREE.BackSide,
      })
    );
    scene.add(atmosphere);

    //////////////////////////////////////
    // 💡 LIGHT
    //////////////////////////////////////
    scene.add(new THREE.AmbientLight(0xffffff, 0.6));

    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(200, 200, 200);
    scene.add(light);

    //////////////////////////////////////
    // 🌌 STARS
    //////////////////////////////////////
    const starGeo = new THREE.BufferGeometry();
    const vertices = [];

    for (let i = 0; i < 5000; i++) {
      vertices.push(
        (Math.random() - 0.5) * 2000,
        (Math.random() - 0.5) * 2000,
        (Math.random() - 0.5) * 2000
      );
    }

    starGeo.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(vertices, 3)
    );

    const stars = new THREE.Points(
      starGeo,
      new THREE.PointsMaterial({ color: 0xffffff, size: 1 })
    );
    scene.add(stars);

    //////////////////////////////////////
    // 🌍 GEOJSON
    //////////////////////////////////////
    fetch("/data/countries.geojson")
      .then(res => res.json())
      .then(data => drawCountries(data, scene, RADIUS));

    //////////////////////////////////////
    // 🔥 DATA POINTS + ARCS
    //////////////////////////////////////
    const points = [];

    const cities = [
      [28.6, 77.2],
      [40.7, -74],
      [51.5, -0.1],
      [35.7, 139.7],
      [19.0, 72.8],
      [48.8, 2.3],
      [34.0, -118.2],
    ];

    cities.forEach(c => {
      const p = createPoint(c[0], c[1], RADIUS, scene, latLngToVec3);
      points.push(p);
    });

    for (let i = 0; i < points.length - 1; i++) {
      createArc(points[i], points[i + 1], RADIUS, scene);
    }

    //////////////////////////////////////
    // 🔁 ANIMATION
    //////////////////////////////////////
    const animate = () => {
      requestAnimationFrame(animate);

      globe.rotation.y += 0.001;

      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      renderer.dispose();
      mountRef.current.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} style={{ width: "100%", height: "100vh" }} />;
}