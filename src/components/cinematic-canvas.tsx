"use client";

import { Suspense, useLayoutEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Preload, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type StoryState = {
  camX: number;
  camY: number;
  camZ: number;
  lookX: number;
  lookY: number;
  productX: number;
  productY: number;
  productZ: number;
  productScale: number;
  rotX: number;
  rotY: number;
  rotZ: number;
  ambient: number;
  gold: number;
  red: number;
  green: number;
  atmosphere: number;
  route: number;
  supply: number;
};

const initialStory: StoryState = {
  camX: 0,
  camY: 0,
  camZ: 7.5,
  lookX: 0,
  lookY: 0,
  productX: 1.25,
  productY: -0.1,
  productZ: 0,
  productScale: 0.55,
  rotX: -0.12,
  rotY: -0.32,
  rotZ: -0.08,
  ambient: 0.08,
  gold: 0.2,
  red: 0.1,
  green: 0,
  atmosphere: 0,
  route: 0,
  supply: 0,
};

function prepareScene(source: THREE.Group) {
  const clone = source.clone(true);
  clone.traverse((object) => {
    if (!(object instanceof THREE.Mesh)) return;
    object.castShadow = true;
    object.receiveShadow = true;
    const material = object.material as THREE.MeshStandardMaterial;
    if (material) {
      material.envMapIntensity = 0.85;
      material.needsUpdate = true;
    }
  });
  return clone;
}

function BalmModel({ source }: { source: THREE.Group }) {
  const clone = useMemo(() => prepareScene(source), [source]);
  return <primitive object={clone} />;
}

function ParticleAtmosphere({ story }: { story: React.MutableRefObject<StoryState> }) {
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.PointsMaterial>(null);
  const positions = useMemo(() => {
    const random = (index: number) => {
      const value = Math.sin(index * 12.9898 + 78.233) * 43758.5453;
      return value - Math.floor(value);
    };
    return Float32Array.from({ length: 270 * 3 }, (_, index) => {
      const axis = index % 3;
      if (axis === 0) return (random(index) - 0.5) * 11;
      if (axis === 1) return (random(index) - 0.5) * 6;
      return (random(index) - 0.5) * 5 - 1;
    });
  }, []);

  useFrame((_, delta) => {
    if (!pointsRef.current || !materialRef.current) return;
    pointsRef.current.rotation.z += delta * 0.012;
    pointsRef.current.rotation.y -= delta * 0.018;
    materialRef.current.opacity = story.current.atmosphere * 0.68;
    pointsRef.current.visible = story.current.atmosphere > 0.01;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        ref={materialRef}
        color="#e7c371"
        size={0.026}
        transparent
        opacity={0}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function RouteArc({ story }: { story: React.MutableRefObject<StoryState> }) {
  const groupRef = useRef<THREE.Group>(null);
  const lineMaterialRef = useRef<THREE.MeshBasicMaterial>(null);
  const glowMaterialRef = useRef<THREE.MeshBasicMaterial>(null);
  const travelerRef = useRef<THREE.Mesh>(null);
  const curve = useMemo(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(-3.8, -0.9, -0.8),
        new THREE.Vector3(-1.9, 1.1, 0.1),
        new THREE.Vector3(0.2, 1.6, 0.5),
        new THREE.Vector3(2.1, 0.65, 0.15),
        new THREE.Vector3(3.8, -0.45, -0.9),
      ]),
    [],
  );

  useFrame((state) => {
    const progress = story.current.route;
    if (!groupRef.current || !lineMaterialRef.current || !glowMaterialRef.current || !travelerRef.current) return;
    groupRef.current.visible = progress > 0.01;
    lineMaterialRef.current.opacity = progress * 0.9;
    glowMaterialRef.current.opacity = progress * 0.18;
    travelerRef.current.position.copy(curve.getPointAt(THREE.MathUtils.clamp(progress, 0, 1)));
    const pulse = 1 + Math.sin(state.clock.elapsedTime * 4) * 0.18;
    travelerRef.current.scale.setScalar(pulse * progress);
  });

  return (
    <group ref={groupRef} visible={false}>
      <mesh>
        <tubeGeometry args={[curve, 96, 0.012, 8, false]} />
        <meshBasicMaterial ref={lineMaterialRef} color="#ffc75f" transparent opacity={0} />
      </mesh>
      <mesh>
        <tubeGeometry args={[curve, 96, 0.055, 8, false]} />
        <meshBasicMaterial
          ref={glowMaterialRef}
          color="#e32622"
          transparent
          opacity={0}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      <mesh ref={travelerRef}>
        <sphereGeometry args={[0.065, 24, 24]} />
        <meshBasicMaterial color="#ffe8a6" toneMapped={false} />
      </mesh>
    </group>
  );
}

function SupplyField({ source, story }: { source: THREE.Group; story: React.MutableRefObject<StoryState> }) {
  const groupRef = useRef<THREE.Group>(null);
  const layout = useMemo(
    () =>
      Array.from({ length: 21 }, (_, index) => {
        const column = (index % 7) - 3;
        const row = Math.floor(index / 7) - 1;
        const depth = ((index * 7) % 9) * -0.42;
        return {
          position: [column * 1.28 + (row % 2) * 0.32, row * 1.3, depth] as [number, number, number],
          rotation: [0.06 * row, -0.07 * column, ((index % 3) - 1) * 0.08] as [number, number, number],
          scale: 0.46 + (index % 4) * 0.025,
        };
      }),
    [],
  );

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const progress = story.current.supply;
    groupRef.current.visible = progress > 0.01;
    const eased = THREE.MathUtils.smoothstep(progress, 0, 1);
    groupRef.current.scale.setScalar(eased);
    groupRef.current.rotation.y += delta * 0.025 * eased;
    groupRef.current.position.z = THREE.MathUtils.lerp(-3.4, -0.5, eased);
    groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.22) * 0.05;
  });

  return (
    <group ref={groupRef} visible={false} rotation={[0, Math.PI, 0]}>
      {layout.map((item, index) => (
        <group key={index} position={item.position} rotation={item.rotation} scale={item.scale}>
          <BalmModel source={source} />
        </group>
      ))}
    </group>
  );
}

function Scene() {
  const { scene } = useGLTF("/models/golden-star-balm.glb");
  const mainGroupRef = useRef<THREE.Group>(null);
  const ambientLightRef = useRef<THREE.AmbientLight>(null);
  const goldLightRef = useRef<THREE.SpotLight>(null);
  const redLightRef = useRef<THREE.PointLight>(null);
  const greenLightRef = useRef<THREE.PointLight>(null);
  const { camera } = useThree();
  const story = useRef<StoryState>({ ...initialStory });

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const timeline = gsap.timeline({
      defaults: { ease: "power2.inOut", duration: 1 },
      scrollTrigger: {
        trigger: "#film",
        start: "top top",
        end: "bottom bottom",
        scrub: 1.15,
        invalidateOnRefresh: true,
      },
    });

    timeline
      .to(story.current, {
        camZ: 5.25,
        productScale: 1.16,
        productX: 1.05,
        rotX: -0.22,
        rotY: -0.16,
        rotZ: 0.035,
        ambient: 0.55,
        gold: 5.2,
        red: 1.8,
      }, 0)
      .to(story.current, {
        camX: -0.12,
        camY: 0.12,
        camZ: 4.2,
        lookX: -0.3,
        productX: -0.85,
        productY: 0.12,
        productScale: 1.32,
        rotX: -0.32,
        rotY: 0.5,
        rotZ: -0.08,
        gold: 6.5,
        red: 2.8,
      }, 1)
      .to(story.current, {
        camX: 0.15,
        camY: 0.04,
        camZ: 2.35,
        lookX: 0.55,
        productX: 0.65,
        productY: -0.12,
        productScale: 1.52,
        rotX: -0.04,
        rotY: 0.03,
        rotZ: 0.02,
        gold: 7.6,
        red: 3.7,
      }, 2)
      .to(story.current, {
        camX: 0,
        camY: 0,
        camZ: 5.1,
        lookX: 0,
        productX: 2.15,
        productY: 0.25,
        productScale: 0.86,
        rotX: -0.38,
        rotY: -0.62,
        rotZ: 0.12,
        atmosphere: 1,
        green: 2.8,
        gold: 4.4,
        red: 1.2,
      }, 3)
      .to(story.current, {
        camZ: 5.8,
        productX: 0,
        productY: -0.1,
        productZ: -0.6,
        productScale: 0.64,
        rotX: -0.18,
        rotY: 0.38,
        rotZ: -0.05,
        atmosphere: 0.34,
        route: 1,
        green: 0.9,
        gold: 5.8,
        red: 2.3,
      }, 4)
      .to(story.current, {
        camZ: 6.8,
        productY: -0.25,
        productZ: -2,
        productScale: 0.34,
        rotY: 0.8,
        atmosphere: 0.12,
        route: 0,
        supply: 1,
        gold: 6.2,
        red: 2.7,
      }, 5)
      .to(story.current, {
        camX: 0,
        camY: 0,
        camZ: 4.8,
        lookX: 0.35,
        productX: 1.7,
        productY: 0.05,
        productZ: 0,
        productScale: 1.02,
        rotX: -0.26,
        rotY: -0.35,
        rotZ: 0.07,
        supply: 0,
        atmosphere: 0,
        gold: 6.8,
        red: 1.4,
        green: 0.5,
      }, 6)
      .to(story.current, {
        camZ: 4.4,
        lookX: 0.42,
        productX: 1.82,
        productY: 0.2,
        productScale: 1.12,
        rotX: -0.18,
        rotY: 0.06,
        rotZ: -0.035,
        gold: 7.8,
        red: 2.2,
        green: 0.25,
      }, 7);

    return () => {
      timeline.scrollTrigger?.kill();
      timeline.kill();
    };
  }, []);

  useFrame((state, delta) => {
    const current = story.current;
    camera.position.set(current.camX, current.camY, current.camZ);
    camera.lookAt(current.lookX, current.lookY, 0);

    if (mainGroupRef.current) {
      mainGroupRef.current.position.set(current.productX, current.productY, current.productZ);
      mainGroupRef.current.scale.setScalar(current.productScale);
      mainGroupRef.current.rotation.set(
        current.rotX + state.pointer.y * 0.055,
        Math.PI + current.rotY + state.pointer.x * 0.07,
        current.rotZ,
      );
      mainGroupRef.current.position.y += Math.sin(state.clock.elapsedTime * 0.65) * 0.025;
    }

    if (ambientLightRef.current) ambientLightRef.current.intensity = THREE.MathUtils.damp(ambientLightRef.current.intensity, current.ambient, 4, delta);
    if (goldLightRef.current) goldLightRef.current.intensity = THREE.MathUtils.damp(goldLightRef.current.intensity, current.gold, 4, delta);
    if (redLightRef.current) redLightRef.current.intensity = THREE.MathUtils.damp(redLightRef.current.intensity, current.red, 4, delta);
    if (greenLightRef.current) greenLightRef.current.intensity = THREE.MathUtils.damp(greenLightRef.current.intensity, current.green, 4, delta);
  });

  return (
    <>
      <fog attach="fog" args={["#090202", 6.2, 15]} />
      <ambientLight ref={ambientLightRef} intensity={initialStory.ambient} />
      <spotLight ref={goldLightRef} position={[2.8, 4.5, 5]} angle={0.42} penumbra={0.85} color="#ffd68a" castShadow />
      <pointLight ref={redLightRef} position={[-3.2, -1.3, 2.2]} color="#e51d24" distance={8} />
      <pointLight ref={greenLightRef} position={[3.3, 1.2, 1.5]} color="#2cac61" distance={7} />
      <directionalLight position={[-3, 1, 4]} intensity={1.2} color="#fff0d2" />

      <group ref={mainGroupRef}>
        <BalmModel source={scene} />
      </group>

      <ParticleAtmosphere story={story} />
      <RouteArc story={story} />
      <SupplyField source={scene} story={story} />

      <ContactShadows position={[0, -1.45, -0.45]} opacity={0.36} scale={9} blur={2.8} far={4.5} color="#250704" />
    </>
  );
}

export default function CinematicCanvas() {
  return (
    <Canvas
      className="webgl-canvas"
      camera={{ position: [0, 0, 7.5], fov: 34, near: 0.1, far: 100 }}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      shadows={{ type: THREE.PCFShadowMap }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.05;
        gl.outputColorSpace = THREE.SRGBColorSpace;
      }}
    >
      <Suspense fallback={null}>
        <Scene />
        <Preload all />
      </Suspense>
    </Canvas>
  );
}

useGLTF.preload("/models/golden-star-balm.glb");
