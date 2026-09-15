"use client";

import { Suspense, useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer, useGLTF } from "@react-three/drei";
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
  supply: number;
};

const MODEL_URL = `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/models/golden-star-balm.glb?v=5`;
const INTRO_SCALE = 1.88;

const initialStory: StoryState = {
  camX: 0,
  camY: 0,
  camZ: 5.45,
  lookX: 0,
  lookY: 0,
  productX: 1.35,
  productY: 0,
  productZ: 0,
  productScale: 0.94,
  rotX: -0.2,
  rotY: -0.22,
  rotZ: 0.035,
  ambient: 0.12,
  gold: 4.8,
  red: 1.5,
  green: 0,
  atmosphere: 0,
  supply: 0,
};

const sceneStates: StoryState[] = [
  initialStory,
  {
    ...initialStory,
    camZ: 5.15,
    productX: 1.45,
    productScale: 1.14,
    rotX: -0.24,
    rotY: -0.08,
    gold: 5.6,
    red: 1.9,
  },
  {
    ...initialStory,
    camX: -0.1,
    camY: 0.1,
    camZ: 4.05,
    lookX: -0.3,
    productX: -1.05,
    productY: 0.08,
    productScale: 1.34,
    rotX: -0.3,
    rotY: 0.46,
    rotZ: -0.07,
    gold: 6.8,
    red: 2.7,
  },
  {
    ...initialStory,
    camZ: 5.25,
    productX: 2.05,
    productY: 0.12,
    productScale: 0.86,
    rotX: -0.37,
    rotY: -0.58,
    rotZ: 0.1,
    atmosphere: 1,
    green: 2.8,
    gold: 5.2,
    red: 1.4,
  },
  {
    ...initialStory,
    camZ: 5.7,
    productX: -1.95,
    productY: 0.08,
    productScale: 0.78,
    rotX: -0.24,
    rotY: 0.42,
    rotZ: -0.05,
    atmosphere: 0.58,
    green: 1.7,
    gold: 5.8,
    red: 1.8,
  },
  {
    ...initialStory,
    camZ: 5.9,
    productX: 0,
    productY: 0.62,
    productZ: -0.8,
    productScale: 0.54,
    rotX: -0.18,
    rotY: 0.34,
    rotZ: -0.04,
    atmosphere: 0.28,
    green: 0.8,
    gold: 5.8,
    red: 2.1,
  },
  {
    ...initialStory,
    camZ: 6.8,
    productY: -0.25,
    productZ: -4,
    productScale: 0.16,
    rotY: 0.78,
    atmosphere: 0.1,
    supply: 1,
    gold: 6.2,
    red: 2.6,
  },
  {
    ...initialStory,
    camZ: 4.9,
    lookX: 0.34,
    productX: 1.78,
    productY: 0.06,
    productScale: 0.98,
    rotX: -0.25,
    rotY: -0.32,
    rotZ: 0.06,
    green: 0.45,
    gold: 6.8,
    red: 1.5,
  },
  {
    ...initialStory,
    camZ: 4.55,
    lookX: 0.4,
    productX: 1.9,
    productY: 0.16,
    productScale: 1.08,
    rotX: -0.18,
    rotY: 0.04,
    rotZ: -0.03,
    green: 0.2,
    gold: 7.5,
    red: 2.1,
  },
];

function prepareScene(source: THREE.Group, anisotropy: number) {
  const clone = source.clone(true);
  clone.traverse((object) => {
    if (!(object instanceof THREE.Mesh)) return;
    object.castShadow = true;
    object.receiveShadow = true;
    const material = object.material as THREE.MeshStandardMaterial;
    if (material) {
      material.envMapIntensity = 2.2;
      material.metalness = 0.82;
      material.roughness = 0.46;
      material.normalScale?.set(0.58, 0.58);
      material.side = THREE.FrontSide;
      [material.map, material.metalnessMap, material.roughnessMap, material.normalMap]
        .filter((texture): texture is THREE.Texture => Boolean(texture))
        .forEach((texture) => {
          texture.anisotropy = anisotropy;
          texture.needsUpdate = true;
        });
      material.needsUpdate = true;
    }
  });
  return clone;
}

function BalmModel({ source }: { source: THREE.Group }) {
  const { gl } = useThree();
  const clone = useMemo(
    () => prepareScene(source, gl.capabilities.getMaxAnisotropy()),
    [gl, source],
  );
  return <primitive object={clone} />;
}

function StudioEnvironment() {
  return (
    <Environment resolution={256} background={false}>
      <Lightformer
        form="rect"
        intensity={3.8}
        color="#fff8ec"
        position={[0, 3.6, 5.5]}
        scale={[5.2, 1.35, 1]}
        target={[0, 0, 0]}
      />
      <Lightformer
        form="rect"
        intensity={8}
        color="#fff4df"
        position={[-3.5, 4.5, 4.5]}
        scale={[5.5, 1.4, 1]}
        target={[0, 0, 0]}
      />
      <Lightformer
        form="rect"
        intensity={5}
        color="#ffe0a0"
        position={[4.5, 1.2, 3.5]}
        scale={[1.2, 6, 1]}
        target={[0, 0, 0]}
      />
      <Lightformer
        form="rect"
        intensity={4}
        color="#ff332c"
        position={[-4.5, -1.5, 1.5]}
        scale={[2.5, 4, 1]}
        target={[0, 0, 0]}
      />
      <Lightformer
        form="ring"
        intensity={4}
        color="#f6c763"
        position={[0, 2.5, -4]}
        scale={3.5}
        target={[0, 0, 0]}
      />
      <Lightformer
        form="rect"
        intensity={2.5}
        color="#d8fff0"
        position={[0, -4, 2]}
        scale={[8, 1, 1]}
        target={[0, 0, 0]}
      />
    </Environment>
  );
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
    <group ref={groupRef} visible={false}>
      {layout.map((item, index) => (
        <group key={index} position={item.position} rotation={item.rotation} scale={item.scale}>
          <BalmModel source={source} />
        </group>
      ))}
    </group>
  );
}

function Scene({ onReady }: { onReady?: () => void }) {
  const { scene } = useGLTF(MODEL_URL);
  const mainGroupRef = useRef<THREE.Group>(null);
  const ambientLightRef = useRef<THREE.AmbientLight>(null);
  const goldLightRef = useRef<THREE.SpotLight>(null);
  const redLightRef = useRef<THREE.PointLight>(null);
  const greenLightRef = useRef<THREE.PointLight>(null);
  const { camera } = useThree();
  const story = useRef<StoryState>({ ...initialStory });
  const intro = useRef({ progress: 0 });
  const pointerTarget = useRef({ x: 0, y: 0 });
  const pointerMotion = useRef({ x: 0, y: 0 });
  const lookMotion = useRef({ x: initialStory.lookX, y: initialStory.lookY });

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => onReady?.());
    return () => window.cancelAnimationFrame(frame);
  }, [onReady]);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const updatePointer = (event: PointerEvent) => {
      pointerTarget.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointerTarget.current.y = -((event.clientY / window.innerHeight) * 2 - 1);
    };
    const resetPointer = () => {
      pointerTarget.current.x = 0;
      pointerTarget.current.y = 0;
    };
    window.addEventListener("pointermove", updatePointer, { passive: true });
    window.addEventListener("blur", resetPointer);

    const introTween = gsap.to(intro.current, {
      progress: 1,
      duration: 0.95,
      ease: "power4.out",
    });
    const sections = gsap.utils.toArray<HTMLElement>("#film .story-section");
    const sceneTweens = sections.slice(1).map((section, index) =>
      gsap.fromTo(
        story.current,
        { ...sceneStates[index] },
        {
          ...sceneStates[index + 1],
          duration: 1,
          ease: "power3.inOut",
          immediateRender: false,
          scrollTrigger: {
            trigger: section,
            start: "top 92%",
            end: "top 22%",
            scrub: 0.48,
            invalidateOnRefresh: true,
          },
        },
      ),
    );

    return () => {
      window.removeEventListener("pointermove", updatePointer);
      window.removeEventListener("blur", resetPointer);
      introTween.kill();
      sceneTweens.forEach((tween) => {
        tween.scrollTrigger?.kill();
        tween.kill();
      });
    };
  }, []);

  useFrame((state, delta) => {
    const current = story.current;
    pointerMotion.current.x = THREE.MathUtils.damp(pointerMotion.current.x, pointerTarget.current.x, 5, delta);
    pointerMotion.current.y = THREE.MathUtils.damp(pointerMotion.current.y, pointerTarget.current.y, 5, delta);
    camera.position.set(
      THREE.MathUtils.damp(camera.position.x, current.camX, 9, delta),
      THREE.MathUtils.damp(camera.position.y, current.camY, 9, delta),
      THREE.MathUtils.damp(camera.position.z, current.camZ, 9, delta),
    );
    lookMotion.current.x = THREE.MathUtils.damp(lookMotion.current.x, current.lookX, 9, delta);
    lookMotion.current.y = THREE.MathUtils.damp(lookMotion.current.y, current.lookY, 9, delta);
    camera.lookAt(lookMotion.current.x, lookMotion.current.y, 0);

    if (mainGroupRef.current) {
      const entrance = intro.current.progress;
      const targetX = current.productX;
      const targetY = current.productY + Math.sin(state.clock.elapsedTime * 0.65) * 0.025 * entrance;
      const targetZ = current.productZ + THREE.MathUtils.lerp(0.9, 0, entrance);
      const targetScale = current.productScale * THREE.MathUtils.lerp(INTRO_SCALE, 1, entrance);
      const targetRotX = current.rotX + pointerMotion.current.y * 0.1 + THREE.MathUtils.lerp(-0.08, 0, entrance);
      const targetRotY = current.rotY + pointerMotion.current.x * 0.16 + THREE.MathUtils.lerp(-0.12, 0, entrance);

      mainGroupRef.current.position.x = THREE.MathUtils.damp(mainGroupRef.current.position.x, targetX, 14, delta);
      mainGroupRef.current.position.y = THREE.MathUtils.damp(mainGroupRef.current.position.y, targetY, 14, delta);
      mainGroupRef.current.position.z = THREE.MathUtils.damp(mainGroupRef.current.position.z, targetZ, 14, delta);
      const settledScale = THREE.MathUtils.damp(mainGroupRef.current.scale.x, targetScale, 14, delta);
      mainGroupRef.current.scale.setScalar(settledScale);
      mainGroupRef.current.rotation.x = THREE.MathUtils.damp(mainGroupRef.current.rotation.x, targetRotX, 14, delta);
      mainGroupRef.current.rotation.y = THREE.MathUtils.damp(mainGroupRef.current.rotation.y, targetRotY, 14, delta);
      mainGroupRef.current.rotation.z = THREE.MathUtils.damp(mainGroupRef.current.rotation.z, current.rotZ, 14, delta);
    }

    if (ambientLightRef.current) ambientLightRef.current.intensity = THREE.MathUtils.damp(ambientLightRef.current.intensity, current.ambient, 4, delta);
    if (goldLightRef.current) goldLightRef.current.intensity = THREE.MathUtils.damp(goldLightRef.current.intensity, current.gold, 4, delta);
    if (redLightRef.current) redLightRef.current.intensity = THREE.MathUtils.damp(redLightRef.current.intensity, current.red, 4, delta);
    if (greenLightRef.current) greenLightRef.current.intensity = THREE.MathUtils.damp(greenLightRef.current.intensity, current.green, 4, delta);
  });

  return (
    <>
      <fog attach="fog" args={["#120504", 6.4, 15.5]} />
      <StudioEnvironment />
      <ambientLight ref={ambientLightRef} intensity={initialStory.ambient} />
      <spotLight ref={goldLightRef} position={[2.8, 4.5, 5]} angle={0.42} penumbra={0.85} color="#ffd68a" castShadow />
      <pointLight ref={redLightRef} position={[-3.2, -1.3, 2.2]} color="#e51d24" distance={8} />
      <pointLight ref={greenLightRef} position={[3.3, 1.2, 1.5]} color="#2cac61" distance={7} />
      <directionalLight position={[-3, 1, 4]} intensity={0.76} color="#fff0d2" />

      <group
        ref={mainGroupRef}
        position={[initialStory.productX, initialStory.productY, initialStory.productZ + 0.9]}
        rotation={[initialStory.rotX - 0.08, initialStory.rotY - 0.12, initialStory.rotZ]}
        scale={initialStory.productScale * INTRO_SCALE}
      >
        <BalmModel source={scene} />
      </group>

      <ParticleAtmosphere story={story} />
      <SupplyField source={scene} story={story} />

    </>
  );
}

export default function CinematicCanvas({ onReady }: { onReady?: () => void }) {
  return (
    <Canvas
      className="webgl-canvas"
      camera={{ position: [0, 0, initialStory.camZ], fov: 34, near: 0.1, far: 100 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance", stencil: false }}
      shadows={{ type: THREE.PCFShadowMap }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.36;
        gl.outputColorSpace = THREE.SRGBColorSpace;
      }}
    >
      <Suspense fallback={null}>
        <Scene onReady={onReady} />
      </Suspense>
    </Canvas>
  );
}

useGLTF.preload(MODEL_URL);
