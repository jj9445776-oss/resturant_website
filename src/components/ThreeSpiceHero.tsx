import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const ThreeSpiceHero: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0b0b0d, 0.035);

    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.z = 18;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    } catch {
      return; // WebGL not supported
    }

    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Warm royal restaurant lighting
    const ambientLight = new THREE.AmbientLight(0xffeedd, 0.8);
    scene.add(ambientLight);

    const goldPointLight = new THREE.PointLight(0xd4af37, 2.5, 30);
    goldPointLight.position.set(5, 5, 8);
    scene.add(goldPointLight);

    const amberRimLight = new THREE.PointLight(0xff7722, 1.8, 25);
    amberRimLight.position.set(-6, -4, 6);
    scene.add(amberRimLight);

    // Group for all floating spice geometries
    const spiceGroup = new THREE.Group();
    scene.add(spiceGroup);

    // Materials
    const goldMaterial = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.85,
      roughness: 0.25,
      emissive: 0x221804,
    });

    const cardamomMaterial = new THREE.MeshStandardMaterial({
      color: 0x7e8f54,
      metalness: 0.3,
      roughness: 0.6,
    });

    const cinnamonMaterial = new THREE.MeshStandardMaterial({
      color: 0x8b3a1a,
      metalness: 0.2,
      roughness: 0.8,
    });

    // 1. Star Anise (Dodecahedron / star like forms)
    const starGeometry = new THREE.DodecahedronGeometry(0.7, 0);
    for (let i = 0; i < 6; i++) {
      const star = new THREE.Mesh(starGeometry, goldMaterial);
      star.position.set(
        (Math.random() - 0.5) * 16,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 8 - 2
      );
      star.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
      star.userData = {
        rotSpeedX: (Math.random() - 0.5) * 0.015,
        rotSpeedY: (Math.random() - 0.5) * 0.015,
        floatSpeed: Math.random() * 0.02 + 0.01,
        startY: star.position.y,
      };
      spiceGroup.add(star);
    }

    // 2. Cardamom pods (smooth stretched spheroids)
    const cardamomGeom = new THREE.SphereGeometry(0.45, 16, 12);
    cardamomGeom.scale(0.65, 1.3, 0.65);
    for (let i = 0; i < 8; i++) {
      const pod = new THREE.Mesh(cardamomGeom, cardamomMaterial);
      pod.position.set(
        (Math.random() - 0.5) * 18,
        (Math.random() - 0.5) * 12,
        (Math.random() - 0.5) * 8 - 3
      );
      pod.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      pod.userData = {
        rotSpeedX: (Math.random() - 0.5) * 0.02,
        rotSpeedY: (Math.random() - 0.5) * 0.02,
        floatSpeed: Math.random() * 0.025 + 0.01,
        startY: pod.position.y,
      };
      spiceGroup.add(pod);
    }

    // 3. Cinnamon quills (slender curved cylinders)
    const cinnamonGeom = new THREE.CylinderGeometry(0.12, 0.15, 2.2, 12);
    for (let i = 0; i < 5; i++) {
      const quill = new THREE.Mesh(cinnamonGeom, cinnamonMaterial);
      quill.position.set(
        (Math.random() - 0.5) * 16,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 6 - 2
      );
      quill.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      quill.userData = {
        rotSpeedX: (Math.random() - 0.5) * 0.012,
        rotSpeedY: (Math.random() - 0.5) * 0.012,
        floatSpeed: Math.random() * 0.018 + 0.01,
        startY: quill.position.y,
      };
      spiceGroup.add(quill);
    }

    // 4. Glowing Gold Dust & Saffron Embers particle field
    const particleCount = 140;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const scales = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 24;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 16;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 12;
      scales[i] = Math.random() * 0.08 + 0.02;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xf6c555,
      size: 0.15,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Mouse interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      mouseX = (x / rect.width - 0.5) * 2;
      mouseY = -(y / rect.height - 0.5) * 2;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // ResizeObserver
    const resizeObserver = new ResizeObserver(() => {
      if (!container) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    });
    resizeObserver.observe(container);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse follow
      targetX += (mouseX - targetX) * 0.05;
      targetY += (mouseY - targetY) * 0.05;

      spiceGroup.rotation.y = targetX * 0.35 + (prefersReducedMotion ? 0 : elapsedTime * 0.04);
      spiceGroup.rotation.x = -targetY * 0.25;

      if (!prefersReducedMotion) {
        spiceGroup.children.forEach((child) => {
          const ud = child.userData;
          if (ud) {
            child.rotation.x += ud.rotSpeedX || 0.005;
            child.rotation.y += ud.rotSpeedY || 0.005;
            child.position.y = ud.startY + Math.sin(elapsedTime * ud.floatSpeed * 3) * 0.35;
          }
        });

        particles.rotation.y = elapsedTime * 0.02;
        particles.rotation.x = Math.sin(elapsedTime * 0.05) * 0.1;
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      resizeObserver.disconnect();
      cancelAnimationFrame(animationFrameId);
      if (renderer && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden"
      aria-hidden="true"
    />
  );
};
