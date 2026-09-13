# GLB model audit

Source inspected: `Meshy_AI_Cao_Sao_Vang_Balm_Tin_0910135901_texture.glb`

## Structure

| Item | Result |
| --- | --- |
| GLB version | 2.0 |
| Generator | Khronos glTF Blender I/O v4.4.55 |
| File size | 5,894,520 bytes |
| Scenes / nodes | 1 / 1 |
| Meshes / primitives | 1 / 1 |
| Materials | 1 PBR material (`material.001`) |
| Vertices / triangles | 1,567 / 1,118 |
| Animations / skins | 0 / 0 |
| Model bounds | X −1→1, Y −0.981→0.981, Z −0.265→0.265 |

## Textures

- Base-color PNG: 2048×2048, 4,983,212 bytes
- Metallic-roughness PNG: 1024×1024, 852,900 bytes
- Both images are embedded in the GLB.

## Animation implications

- The lid, base, label, and balm are **not separate meshes**. A physically opening lid cannot be animated cleanly without remodeling the asset.
- The prototype therefore uses camera travel, product rotation, framing, lighting, and depth transitions for the macro sequence.
- Geometry is very light and can be duplicated for the supply scene while sharing the same loaded geometry/material data.
- Texture payload is the main mobile cost. A later mobile pass should create a separate compressed KTX2/WebP texture variant and lower the device pixel ratio/effects on weaker devices.
