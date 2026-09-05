import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Order } from '../../types';
import { Truck, Navigation, CheckCircle2 } from 'lucide-react';

interface PackageTransit3DProps {
  order: Order;
}

export const PackageTransit3D: React.FC<PackageTransit3DProps> = ({ order }) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 480;
    const height = 180;

    // Scene
    const scene = new THREE.Scene();

    // Camera (Isometric perspective)
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 3.2, 5.2);
    camera.lookAt(0, 0.2, 0);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    // 1. Stylized 3D Transit Track / Ground Road
    const trackCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-2.8, 0, 0.5),
      new THREE.Vector3(-1.4, 0, -0.4),
      new THREE.Vector3(0, 0, 0.2),
      new THREE.Vector3(1.4, 0, -0.3),
      new THREE.Vector3(2.8, 0, 0.4)
    ]);

    const trackGeo = new THREE.TubeGeometry(trackCurve, 64, 0.12, 8, false);
    const trackMat = new THREE.MeshStandardMaterial({
      color: 0x4f46e5, // Indigo Track
      roughness: 0.4,
      metalness: 0.6,
    });
    const track = new THREE.Mesh(trackGeo, trackMat);
    scene.add(track);

    // Waypoint Markers on track
    const waypoints = [
      { pos: new THREE.Vector3(-2.8, 0, 0.5), label: 'Warehouse' },
      { pos: new THREE.Vector3(-1.0, 0, -0.2), label: 'Sorting Center' },
      { pos: new THREE.Vector3(1.0, 0, -0.1), label: 'Carrier Facility' },
      { pos: new THREE.Vector3(2.8, 0, 0.4), label: 'Destination' }
    ];

    waypoints.forEach((wp, idx) => {
      const pinGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.08, 16);
      const isReached =
        order.status === 'Delivered' ||
        (order.status === 'Shipped' && idx <= 2) ||
        (order.status === 'Processing' && idx === 0);

      const pinMat = new THREE.MeshStandardMaterial({
        color: isReached ? 0x10b981 : 0x94a3b8, // Emerald or Slate
        emissive: isReached ? 0x059669 : 0x000000,
        emissiveIntensity: isReached ? 0.6 : 0,
      });
      const pin = new THREE.Mesh(pinGeo, pinMat);
      pin.position.copy(wp.pos);
      pin.position.y += 0.04;
      scene.add(pin);
    });

    // 2. 3D Delivery Vehicle: Autonomous Cargo Drone & Transport Pod
    const vehicleGroup = new THREE.Group();
    scene.add(vehicleGroup);

    // Drone Body (Futuristic aeropod)
    const podGeo = new THREE.BoxGeometry(0.6, 0.25, 0.4);
    const podMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.2,
      metalness: 0.8
    });
    const pod = new THREE.Mesh(podGeo, podMat);
    vehicleGroup.add(pod);

    // Drone Cargo Package suspended underneath
    const boxGeo = new THREE.BoxGeometry(0.3, 0.25, 0.3);
    const boxMat = new THREE.MeshStandardMaterial({
      color: 0xd97706, // Cardboard Amber
      roughness: 0.8,
      metalness: 0.1
    });
    const cargoBox = new THREE.Mesh(boxGeo, boxMat);
    cargoBox.position.y = -0.26;
    vehicleGroup.add(cargoBox);

    // 4 Quadcopter Rotors with spinning blades
    const rotors: THREE.Mesh[] = [];
    const rotorArmGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.3, 8);
    const rotorBladeGeo = new THREE.BoxGeometry(0.35, 0.01, 0.05);
    const bladeMat = new THREE.MeshBasicMaterial({ color: 0x60a5fa, transparent: true, opacity: 0.7 });

    const armOffsets = [
      { x: -0.35, z: -0.25 },
      { x: 0.35, z: -0.25 },
      { x: -0.35, z: 0.25 },
      { x: 0.35, z: 0.25 }
    ];

    armOffsets.forEach(offset => {
      const arm = new THREE.Mesh(rotorArmGeo, podMat);
      arm.position.set(offset.x, 0.1, offset.z);
      vehicleGroup.add(arm);

      const blade = new THREE.Mesh(rotorBladeGeo, bladeMat);
      blade.position.set(offset.x, 0.2, offset.z);
      vehicleGroup.add(blade);
      rotors.push(blade);
    });

    // Glowing navigation beacon
    const beaconLight = new THREE.PointLight(0x38bdf8, 2, 4);
    beaconLight.position.set(0, 0.2, 0);
    vehicleGroup.add(beaconLight);

    // Position the vehicle based on current order status
    let targetT = 0.5; // midway
    if (order.status === 'Processing') targetT = 0.1;
    if (order.status === 'Shipped') targetT = 0.65;
    if (order.status === 'Delivered') targetT = 0.98;

    const initialPos = trackCurve.getPointAt(targetT);
    vehicleGroup.position.copy(initialPos);
    vehicleGroup.position.y += 0.55;

    // Ambient & Directional Lighting
    const ambient = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambient);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
    dirLight.position.set(3, 5, 4);
    scene.add(dirLight);

    // Resize Observer
    const resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        const w = entry.contentRect.width;
        if (w) {
          camera.aspect = w / height;
          camera.updateProjectionMatrix();
          renderer.setSize(w, height);
        }
      }
    });
    resizeObserver.observe(container);

    // Animation Loop
    let animationId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Spin rotors rapidly
      rotors.forEach((r, i) => {
        r.rotation.y += 0.35 * (i % 2 === 0 ? 1 : -1);
      });

      // Drone flight hovering float
      const hover = Math.sin(elapsed * 4) * 0.06;
      vehicleGroup.position.y = initialPos.y + 0.55 + hover;

      // Subtle bank tilt
      vehicleGroup.rotation.z = Math.sin(elapsed * 2) * 0.05;
      vehicleGroup.rotation.x = Math.cos(elapsed * 1.5) * 0.04;

      // Pulse track emissive
      trackMat.roughness = 0.4 + Math.sin(elapsed * 2) * 0.1;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      resizeObserver.disconnect();
      scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.geometry?.dispose();
          if (Array.isArray(child.material)) {
            child.material.forEach((m) => m.dispose());
          } else {
            child.material?.dispose();
          }
        }
      });
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [order.status]);

  return (
    <div className="relative w-full bg-gradient-to-b from-indigo-950/20 via-neutral-900/10 to-neutral-50 rounded-xl border border-neutral-200 overflow-hidden select-none">
      <div ref={mountRef} className="w-full h-[180px]" />

      <div className="absolute top-2.5 left-3 flex items-center gap-1.5 text-xs font-semibold text-neutral-800 bg-white/90 backdrop-blur px-2.5 py-1 rounded-full border border-neutral-200 shadow-2xs">
        <Navigation className="w-3.5 h-3.5 text-indigo-600 animate-pulse" />
        <span>Live 3D Dispatch Flight Route</span>
      </div>

      <div className="absolute bottom-2.5 right-3 flex items-center gap-2 text-[11px] font-medium text-neutral-600 bg-white/90 backdrop-blur px-2.5 py-1 rounded-full border border-neutral-200 shadow-2xs">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
        <span>Carrier Scan: <strong>{order.carrier}</strong></span>
      </div>
    </div>
  );
};
