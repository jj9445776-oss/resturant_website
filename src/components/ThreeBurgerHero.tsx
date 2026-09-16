import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Layers, RotateCw, Sparkles, Eye, ShieldCheck, Award } from 'lucide-react';

interface ThreeBurgerHeroProps {
  onOrderClick?: () => void;
  onExploreLayers?: (exploded: boolean) => void;
}

export const ThreeBurgerHero: React.FC<ThreeBurgerHeroProps> = ({ onOrderClick, onExploreLayers }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isExploded, setIsExploded] = useState<boolean>(false);
  const [isRotating, setIsRotating] = useState<boolean>(true);
  const [activeLayerInfo, setActiveLayerInfo] = useState<string | null>(null);

  // References to animate layers in Explode mode
  const layersRef = useRef<{
    topBun: THREE.Group;
    sauce: THREE.Mesh;
    bacon: THREE.Group;
    cheese: THREE.Mesh;
    patty: THREE.Group;
    onions: THREE.Group;
    tomatoes: THREE.Group;
    lettuce: THREE.Group;
    bottomBun: THREE.Mesh;
    board: THREE.Mesh;
    burgerGroup: THREE.Group;
    friesGroup: THREE.Group;
    smokeGroup: THREE.Points;
  } | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Scene setup
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(38, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.set(0, 1.2, 9.8);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    } catch {
      return;
    }

    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);

    // Dynamic studio burger lighting
    const ambientLight = new THREE.AmbientLight(0xfff3e0, 1.1);
    scene.add(ambientLight);

    // Warm key spotlight for the appetizing glossy bun & melted cheese
    const keySpot = new THREE.SpotLight(0xffeedd, 3.8, 25, Math.PI / 4, 0.4, 1.2);
    keySpot.position.set(4, 7, 6);
    keySpot.castShadow = true;
    keySpot.shadow.mapSize.width = 1024;
    keySpot.shadow.mapSize.height = 1024;
    keySpot.shadow.bias = -0.001;
    scene.add(keySpot);

    // Warm rim light highlighting the sizzling burger edges and lettuce
    const rimLight = new THREE.PointLight(0xf59e0b, 3.2, 20);
    rimLight.position.set(-5, 3, -4);
    scene.add(rimLight);

    // Front fill light
    const fillLight = new THREE.DirectionalLight(0xfffaed, 1.3);
    fillLight.position.set(0, 2, 8);
    scene.add(fillLight);

    // Main Burger Assembly Group
    const burgerGroup = new THREE.Group();
    burgerGroup.position.set(0, -0.4, 0);
    scene.add(burgerGroup);

    // --- MATERIALS ---
    // Brioche bun material
    const bunMaterial = new THREE.MeshStandardMaterial({
      color: 0xcf7f2b, // Golden toasted brioche
      roughness: 0.38,
      metalness: 0.08,
      emissive: 0x3d1d05,
      emissiveIntensity: 0.25,
    });

    // Sesame seed material
    const sesameMaterial = new THREE.MeshStandardMaterial({
      color: 0xfbf6e8,
      roughness: 0.3,
      metalness: 0.05,
    });

    // 100% Fresh Angus Beef Patty material
    const pattyMaterial = new THREE.MeshStandardMaterial({
      color: 0x2e180d,
      roughness: 0.85,
      metalness: 0.05,
      bumpScale: 0.05,
    });

    // Melted American Cheddar Cheese material
    const cheeseMaterial = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      roughness: 0.25,
      metalness: 0.12,
      emissive: 0xd97706,
      emissiveIntensity: 0.22,
    });

    // Crispy Smoked Bacon material
    const baconMaterial = new THREE.MeshStandardMaterial({
      color: 0x6e2418,
      roughness: 0.45,
      metalness: 0.15,
      emissive: 0x380f08,
      emissiveIntensity: 0.2,
    });

    // Vine-ripe tomato material
    const tomatoMaterial = new THREE.MeshStandardMaterial({
      color: 0xdd2222,
      roughness: 0.18,
      metalness: 0.1,
      emissive: 0x550a0a,
      emissiveIntensity: 0.2,
    });

    // Crisp garden ruffled lettuce material
    const lettuceMaterial = new THREE.MeshStandardMaterial({
      color: 0x48a832,
      roughness: 0.5,
      metalness: 0.02,
      emissive: 0x14380a,
      emissiveIntensity: 0.15,
      side: THREE.DoubleSide,
    });

    // Caramelized grilled onion material
    const onionMaterial = new THREE.MeshStandardMaterial({
      color: 0x9333ea,
      roughness: 0.35,
      metalness: 0.1,
      transparent: true,
      opacity: 0.85,
    });

    // Factory secret sauce material
    const sauceMaterial = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      roughness: 0.15,
      metalness: 0.2,
    });

    // Rustic wooden serving board material (matching the screenshot)
    const boardMaterial = new THREE.MeshStandardMaterial({
      color: 0x201a15,
      roughness: 0.8,
      metalness: 0.08,
    });

    // --- 1. RUSTIC WOODEN PLATTER ---
    const boardGeo = new THREE.CylinderGeometry(2.8, 2.7, 0.24, 48);
    const board = new THREE.Mesh(boardGeo, boardMaterial);
    board.position.y = -1.55;
    board.receiveShadow = true;
    burgerGroup.add(board);

    // --- 2. BOTTOM BRIOCHE BUN ---
    const bottomBunGeo = new THREE.CylinderGeometry(1.68, 1.62, 0.52, 40);
    const bottomBun = new THREE.Mesh(bottomBunGeo, bunMaterial);
    bottomBun.position.y = -1.18;
    bottomBun.castShadow = true;
    bottomBun.receiveShadow = true;
    burgerGroup.add(bottomBun);

    // --- 3. CRISP RUFFLED LETTUCE ---
    const lettuceGroup = new THREE.Group();
    lettuceGroup.position.y = -0.85;
    const leafCount = 9;
    for (let i = 0; i < leafCount; i++) {
      const angle = (i / leafCount) * Math.PI * 2;
      const leafGeo = new THREE.PlaneGeometry(1.2, 0.9, 5, 5);
      // deform vertices to make it ruffled
      const pos = leafGeo.attributes.position;
      for (let j = 0; j < pos.count; j++) {
        const u = pos.getX(j);
        const v = pos.getY(j);
        pos.setZ(j, Math.sin(u * 5) * 0.12 + Math.cos(v * 4) * 0.08);
      }
      leafGeo.computeVertexNormals();
      const leaf = new THREE.Mesh(leafGeo, lettuceMaterial);
      leaf.rotation.x = -Math.PI / 2 + 0.2 * Math.sin(i);
      leaf.rotation.z = angle;
      leaf.position.set(Math.cos(angle) * 1.3, 0, Math.sin(angle) * 1.3);
      leaf.scale.set(1.15, 1.15, 1.15);
      lettuceGroup.add(leaf);
    }
    burgerGroup.add(lettuceGroup);

    // --- 4. VINE-RIPE TOMATO SLICES ---
    const tomatoesGroup = new THREE.Group();
    tomatoesGroup.position.y = -0.62;
    const tomatoGeo = new THREE.CylinderGeometry(1.1, 1.1, 0.16, 32);
    const tomato1 = new THREE.Mesh(tomatoGeo, tomatoMaterial);
    tomato1.position.set(-0.48, 0, 0.2);
    tomato1.rotation.z = 0.08;
    tomato1.castShadow = true;
    tomatoesGroup.add(tomato1);

    const tomato2 = new THREE.Mesh(tomatoGeo, tomatoMaterial);
    tomato2.position.set(0.55, -0.03, -0.15);
    tomato2.rotation.z = -0.06;
    tomato2.castShadow = true;
    tomatoesGroup.add(tomato2);
    burgerGroup.add(tomatoesGroup);

    // --- 5. CARAMELIZED ONIONS ---
    const onionsGroup = new THREE.Group();
    onionsGroup.position.y = -0.42;
    for (let i = 0; i < 4; i++) {
      const ringGeo = new THREE.TorusGeometry(0.85 + i * 0.15, 0.07, 12, 32);
      const ring = new THREE.Mesh(ringGeo, onionMaterial);
      ring.rotation.x = Math.PI / 2 + (Math.random() - 0.5) * 0.2;
      ring.position.set((Math.random() - 0.5) * 0.4, 0, (Math.random() - 0.5) * 0.4);
      onionsGroup.add(ring);
    }
    burgerGroup.add(onionsGroup);

    // --- 6. 100% ANGUS BEEF PATTY ---
    const pattyGroup = new THREE.Group();
    pattyGroup.position.y = -0.15;
    const pattyGeo = new THREE.CylinderGeometry(1.82, 1.82, 0.65, 42);
    // Deform edges for real charred grilled texture
    const pattyPos = pattyGeo.attributes.position;
    for (let k = 0; k < pattyPos.count; k++) {
      const yVal = pattyPos.getY(k);
      if (Math.abs(yVal) < 0.3) {
        const rough = (Math.sin(k * 2.3) + Math.cos(k * 4.1)) * 0.06;
        pattyPos.setX(k, pattyPos.getX(k) + rough);
        pattyPos.setZ(k, pattyPos.getZ(k) + rough);
      }
    }
    pattyGeo.computeVertexNormals();
    const patty = new THREE.Mesh(pattyGeo, pattyMaterial);
    patty.castShadow = true;
    patty.receiveShadow = true;
    pattyGroup.add(patty);
    burgerGroup.add(pattyGroup);

    // --- 7. MELTED CHEDDAR CHEESE (Draping over corners) ---
    const cheeseGeo = new THREE.BoxGeometry(2.35, 0.08, 2.35, 10, 2, 10);
    // Droop the 4 corners of the cheese slice
    const cheesePos = cheeseGeo.attributes.position;
    for (let c = 0; c < cheesePos.count; c++) {
      const x = cheesePos.getX(c);
      const z = cheesePos.getZ(c);
      const dist = Math.sqrt(x * x + z * z);
      if (dist > 1.1) {
        cheesePos.setY(c, cheesePos.getY(c) - (dist - 1.1) * 0.5);
      }
    }
    cheeseGeo.computeVertexNormals();
    const cheese = new THREE.Mesh(cheeseGeo, cheeseMaterial);
    cheese.position.y = 0.28;
    cheese.rotation.y = Math.PI / 4;
    cheese.castShadow = true;
    burgerGroup.add(cheese);

    // --- 8. CRISPY SMOKED BACON STRIPS ---
    const baconGroup = new THREE.Group();
    baconGroup.position.y = 0.44;
    for (let b = 0; b < 2; b++) {
      const bStripGeo = new THREE.BoxGeometry(2.4, 0.06, 0.55, 12, 1, 3);
      const bPos = bStripGeo.attributes.position;
      for (let bp = 0; bp < bPos.count; bp++) {
        const x = bPos.getX(bp);
        bPos.setY(bp, bPos.getY(bp) + Math.sin(x * 4.5) * 0.08);
      }
      bStripGeo.computeVertexNormals();
      const strip = new THREE.Mesh(bStripGeo, baconMaterial);
      strip.rotation.y = b === 0 ? 0.35 : -0.85;
      strip.castShadow = true;
      baconGroup.add(strip);
    }
    burgerGroup.add(baconGroup);

    // --- 9. FACTORY SECRET SAUCE DRIZZLE ---
    const sauceGeo = new THREE.TorusGeometry(1.4, 0.12, 14, 36);
    const sauce = new THREE.Mesh(sauceGeo, sauceMaterial);
    sauce.position.y = 0.62;
    sauce.rotation.x = Math.PI / 2;
    burgerGroup.add(sauce);

    // --- 10. TOP BRIOCHE BUN WITH 3D SESAME SEEDS ---
    const topBunGroup = new THREE.Group();
    topBunGroup.position.y = 1.15;

    // Dome shape
    const topBunGeo = new THREE.SphereGeometry(1.8, 36, 24, 0, Math.PI * 2, 0, Math.PI * 0.52);
    topBunGeo.scale(1, 0.68, 1);
    const topBun = new THREE.Mesh(topBunGeo, bunMaterial);
    topBun.castShadow = true;
    topBun.receiveShadow = true;
    topBunGroup.add(topBun);

    // Add 160 scattered 3D white sesame seeds
    const seedGeo = new THREE.ConeGeometry(0.04, 0.09, 6);
    for (let s = 0; s < 160; s++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * (Math.PI * 0.38); // top region
      const radius = 1.82;
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.cos(phi) * 0.68;
      const z = radius * Math.sin(phi) * Math.sin(theta);

      const seed = new THREE.Mesh(seedGeo, sesameMaterial);
      seed.position.set(x, y, z);
      seed.lookAt(x * 1.5, y * 1.5, z * 1.5);
      topBunGroup.add(seed);
    }
    burgerGroup.add(topBunGroup);

    // --- 11. FLOATING GOLDEN FRENCH FRIES IN 3D SPACE ---
    const friesGroup = new THREE.Group();
    const fryGeo = new THREE.BoxGeometry(0.18, 1.4, 0.18);
    const fryMaterial = new THREE.MeshStandardMaterial({
      color: 0xf5b525,
      roughness: 0.45,
      metalness: 0.1,
    });
    for (let f = 0; f < 14; f++) {
      const fry = new THREE.Mesh(fryGeo, fryMaterial);
      const angle = (f / 14) * Math.PI * 2 + Math.random() * 0.5;
      const dist = 3.6 + Math.random() * 1.6;
      fry.position.set(
        Math.cos(angle) * dist,
        -1.2 + (Math.random() - 0.5) * 3.5,
        Math.sin(angle) * dist
      );
      fry.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      friesGroup.add(fry);
    }
    scene.add(friesGroup);

    // --- 12. STEAM EMBER PARTICLES ---
    const particleCount = 45;
    const smokeGeo = new THREE.BufferGeometry();
    const smokePositions = new Float32Array(particleCount * 3);
    for (let p = 0; p < particleCount; p++) {
      smokePositions[p * 3] = (Math.random() - 0.5) * 1.8;
      smokePositions[p * 3 + 1] = -0.2 + Math.random() * 2.5;
      smokePositions[p * 3 + 2] = (Math.random() - 0.5) * 1.8;
    }
    smokeGeo.setAttribute('position', new THREE.BufferAttribute(smokePositions, 3));
    const smokeMat = new THREE.PointsMaterial({
      color: 0xffeedd,
      size: 0.09,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending,
    });
    const smoke = new THREE.Points(smokeGeo, smokeMat);
    scene.add(smoke);

    layersRef.current = {
      topBun: topBunGroup,
      sauce,
      bacon: baconGroup,
      cheese,
      patty: pattyGroup,
      onions: onionsGroup,
      tomatoes: tomatoesGroup,
      lettuce: lettuceGroup,
      bottomBun,
      board,
      burgerGroup,
      friesGroup,
      smokeGroup: smoke,
    };

    // --- INTERACTIVE MOUSE ROTATION ---
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let targetRotationY = 0.4;
    let targetRotationX = 0.12;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) {
        // subtle hover parallax
        const rect = container.getBoundingClientRect();
        const normX = (e.clientX - rect.left) / rect.width - 0.5;
        const normY = (e.clientY - rect.top) / rect.height - 0.5;
        targetRotationY = normX * 0.8 + 0.3;
        targetRotationX = normY * 0.4 + 0.1;
        return;
      }
      const deltaX = e.clientX - prevMouseX;
      const deltaY = e.clientY - prevMouseY;
      targetRotationY += deltaX * 0.008;
      targetRotationX += deltaY * 0.008;
      targetRotationX = Math.max(-0.4, Math.min(0.6, targetRotationX));
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // --- ANIMATION LOOP ---
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth rotation interpolation
      if (!prefersReducedMotion) {
        if (isRotating && !isDragging) {
          burgerGroup.rotation.y += 0.004;
        } else {
          burgerGroup.rotation.y += (targetRotationY - burgerGroup.rotation.y) * 0.06;
          burgerGroup.rotation.x += (targetRotationX - burgerGroup.rotation.x) * 0.06;
        }

        // Floating gentle breathing motion
        burgerGroup.position.y = -0.4 + Math.sin(elapsedTime * 1.8) * 0.08;

        // Tumble fries
        friesGroup.children.forEach((f, idx) => {
          f.rotation.x += 0.005 * (idx % 2 === 0 ? 1 : -1);
          f.rotation.y += 0.008;
          f.position.y += Math.sin(elapsedTime + idx) * 0.002;
        });

        // Steam particles rise
        const positions = smokeGeo.attributes.position.array as Float32Array;
        for (let i = 0; i < particleCount; i++) {
          positions[i * 3 + 1] += 0.012;
          if (positions[i * 3 + 1] > 2.8) {
            positions[i * 3 + 1] = -0.2;
          }
        }
        smokeGeo.attributes.position.needsUpdate = true;
      }

      renderer.render(scene, camera);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [isRotating]);

  // Handle Explode Animation
  const toggleExplode = () => {
    const nextState = !isExploded;
    setIsExploded(nextState);
    setIsRotating(!nextState);
    if (onExploreLayers) onExploreLayers(nextState);

    const layers = layersRef.current;
    if (!layers) return;

    // Smooth tween with requestAnimationFrame
    const duration = 750;
    const start = performance.now();

    const initialPositions = {
      topBunY: layers.topBun.position.y,
      sauceY: layers.sauce.position.y,
      baconY: layers.bacon.position.y,
      cheeseY: layers.cheese.position.y,
      pattyY: layers.patty.position.y,
      onionsY: layers.onions.position.y,
      tomatoesY: layers.tomatoes.position.y,
      lettuceY: layers.lettuce.position.y,
      bottomBunY: layers.bottomBun.position.y,
    };

    const targetPositions = nextState
      ? {
          topBunY: 2.7,
          sauceY: 2.1,
          baconY: 1.6,
          cheeseY: 1.1,
          pattyY: 0.45,
          onionsY: -0.2,
          tomatoesY: -0.75,
          lettuceY: -1.3,
          bottomBunY: -1.9,
        }
      : {
          topBunY: 1.15,
          sauceY: 0.62,
          baconY: 0.44,
          cheeseY: 0.28,
          pattyY: -0.15,
          onionsY: -0.42,
          tomatoesY: -0.62,
          lettuceY: -0.85,
          bottomBunY: -1.18,
        };

    const step = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const ease = 1 - Math.pow(1 - progress, 3);

      layers.topBun.position.y = initialPositions.topBunY + (targetPositions.topBunY - initialPositions.topBunY) * ease;
      layers.sauce.position.y = initialPositions.sauceY + (targetPositions.sauceY - initialPositions.sauceY) * ease;
      layers.bacon.position.y = initialPositions.baconY + (targetPositions.baconY - initialPositions.baconY) * ease;
      layers.cheese.position.y = initialPositions.cheeseY + (targetPositions.cheeseY - initialPositions.cheeseY) * ease;
      layers.patty.position.y = initialPositions.pattyY + (targetPositions.pattyY - initialPositions.pattyY) * ease;
      layers.onions.position.y = initialPositions.onionsY + (targetPositions.onionsY - initialPositions.onionsY) * ease;
      layers.tomatoes.position.y = initialPositions.tomatoesY + (targetPositions.tomatoesY - initialPositions.tomatoesY) * ease;
      layers.lettuce.position.y = initialPositions.lettuceY + (targetPositions.lettuceY - initialPositions.lettuceY) * ease;
      layers.bottomBun.position.y = initialPositions.bottomBunY + (targetPositions.bottomBunY - initialPositions.bottomBunY) * ease;

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };
    requestAnimationFrame(step);
  };

  return (
    <div className="relative w-full h-[520px] md:h-[620px] lg:h-[680px] flex items-center justify-center select-none overflow-visible">
      {/* 3D WebGL Canvas Container */}
      <div
        ref={containerRef}
        className="w-full h-full cursor-grab active:cursor-grabbing z-10"
        title="Click & Drag to rotate burger in 3D"
      />

      {/* Floating 3D Control Bar */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 bg-[#17171d]/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-[#2e2e3a] shadow-2xl">
        <button
          onClick={toggleExplode}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
            isExploded
              ? 'bg-[#f59e0b] text-[#0d0d0f] shadow-lg shadow-[#f59e0b]/30'
              : 'bg-[#22222b] text-[#e0dfeb] hover:bg-[#2c2c38]'
          }`}
          title="Inspect each ingredient layer in 3D"
        >
          <Layers className="w-3.5 h-3.5" />
          {isExploded ? 'Assemble 🍔' : '3D Explode Layers 💥'}
        </button>

        <button
          onClick={() => setIsRotating(!isRotating)}
          className={`p-1.5 rounded-full transition-all cursor-pointer ${
            isRotating ? 'bg-[#f59e0b]/20 text-[#f59e0b]' : 'bg-[#22222b] text-[#8e8d9e]'
          }`}
          title={isRotating ? 'Pause Auto-Spin' : 'Resume Auto-Spin'}
        >
          <RotateCw className={`w-3.5 h-3.5 ${isRotating ? 'animate-spin-slow' : ''}`} />
        </button>

        <span className="hidden sm:inline text-[11px] text-[#9ca3af] px-2 font-medium">
          Drag to orbit 360°
        </span>
      </div>

      {/* 3D Exploded Layer Annotation Cards (Visible when Exploded) */}
      {isExploded && (
        <div className="absolute inset-y-8 right-2 sm:right-6 z-20 flex flex-col justify-between py-2 pointer-events-none text-right">
          <div className="bg-[#121217]/85 backdrop-blur-md border border-[#f59e0b]/30 rounded-lg px-2.5 py-1 text-xs text-white shadow-lg pointer-events-auto">
            <span className="text-[#f59e0b] font-bold block text-[10px] uppercase">Layer 01</span>
            Toasted Sesame Brioche
          </div>
          <div className="bg-[#121217]/85 backdrop-blur-md border border-[#f59e0b]/30 rounded-lg px-2.5 py-1 text-xs text-white shadow-lg pointer-events-auto">
            <span className="text-[#f59e0b] font-bold block text-[10px] uppercase">Layer 02</span>
            Factory Secret Drizzle
          </div>
          <div className="bg-[#121217]/85 backdrop-blur-md border border-[#f59e0b]/30 rounded-lg px-2.5 py-1 text-xs text-white shadow-lg pointer-events-auto">
            <span className="text-[#f59e0b] font-bold block text-[10px] uppercase">Layer 03</span>
            Applewood Smoked Bacon
          </div>
          <div className="bg-[#121217]/85 backdrop-blur-md border border-[#f59e0b]/30 rounded-lg px-2.5 py-1 text-xs text-white shadow-lg pointer-events-auto">
            <span className="text-[#f59e0b] font-bold block text-[10px] uppercase">Layer 04</span>
            Melted American Cheddar
          </div>
          <div className="bg-[#121217]/85 backdrop-blur-md border border-[#f59e0b]/30 rounded-lg px-2.5 py-1 text-xs text-white shadow-lg pointer-events-auto">
            <span className="text-[#f59e0b] font-bold block text-[10px] uppercase">Layer 05</span>
            100% Fresh Angus Patty
          </div>
          <div className="bg-[#121217]/85 backdrop-blur-md border border-[#f59e0b]/30 rounded-lg px-2.5 py-1 text-xs text-white shadow-lg pointer-events-auto">
            <span className="text-[#f59e0b] font-bold block text-[10px] uppercase">Layer 06</span>
            Crisp Butterhead Lettuce
          </div>
          <div className="bg-[#121217]/85 backdrop-blur-md border border-[#f59e0b]/30 rounded-lg px-2.5 py-1 text-xs text-white shadow-lg pointer-events-auto">
            <span className="text-[#f59e0b] font-bold block text-[10px] uppercase">Layer 07</span>
            Butter-Toasted Base Bun
          </div>
        </div>
      )}
    </div>
  );
};
