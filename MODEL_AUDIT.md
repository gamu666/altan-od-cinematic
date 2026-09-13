# GLB model audit

Current source: `Meshy_AI_Golden_Star_Balm_Tin__0913111452_texture.glb`

## Structure

| Item | Result |
| --- | --- |
| GLB version | 2.0 |
| Generator | pygltflib v1.16.5 |
| File size | 38,256,496 bytes |
| Scenes / nodes | 1 / 1 |
| Meshes / primitives | 1 / 1 |
| Materials | 1 PBR material (`material_0`) |
| Vertices / triangles | 15,755 / 23,686 |
| Animations / skins | 0 / 0 |
| Model bounds | X −0.952→0.951, Y −0.952→0.950, Z −0.294→0.292 |

## Textures

- Base-color JPEG: 8192×8192, 27,901,045 bytes
- Metallic-roughness JPEG: 4096×4096, 3,136,442 bytes
- Normal-map JPEG: 4096×4096, 6,428,313 bytes
- All three images are embedded in the GLB.

## Rendering decisions

- This is the high-detail Meshy export and matches the 23,686-face model shown in the Meshy workspace.
- The site uses the supplied metallic-roughness and normal maps with maximum texture anisotropy for angled close-ups.
- A self-contained studio reflection environment made from large rectangular and ring light-formers gives the metallic paint readable highlights without requiring a remote HDRI file.
- The material keeps its PBR maps and receives calibrated metalness, roughness, normal strength, and environment intensity values.
- Geometry and textures are shared between supply-scene clones, so the 38 MB model is loaded only once.
- The lid and base remain a single mesh, so the macro transition stays camera-driven rather than faking a physical lid opening.

## Later mobile pass

The 8K/4K textures are intentionally retained for this desktop-first prototype. Before a public mobile launch, create a KTX2/Basis variant, lower DPR on weaker devices, and use a lower-detail multiplication asset for the supply scene.
