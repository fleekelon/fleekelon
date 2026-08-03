import {
  Color,
  MeshPhysicalMaterial,
  type Texture,
  type WebGLProgramParametersWithUniforms,
} from "three";

export type SoftRubberOptions = {
  /** Base albedo. Ignored multiply-wise when `map` is set (use white). */
  color?: Color | string;
  map?: Texture | null;
  /** Warm light that bleeds through the rubber. */
  subsurfaceColor?: Color | string;
  /** 0..1 wrap amount for half-lambert soft shading. */
  wrap?: number;
  /** Strength of the backscatter / SSS lobe. */
  strength?: number;
  /** Exponent controlling how tight the SSS lobe is. */
  power?: number;
  /** Distortion of the light vector into the surface for thickness feel. */
  distortion?: number;
};

/**
 * Soft-rubber MeshPhysicalMaterial.
 *
 * Keeps clearcoat + sheen for the "wet vinyl" top layer, then injects a
 * wrap-lighting / backscatter term via `onBeforeCompile` so thin edges and
 * grazing light pick up a warm subsurface glow — the classic rubber-duck look
 * without a full multipass SSS pipeline.
 */
export function createSoftRubberMaterial(
  options: SoftRubberOptions = {},
): MeshPhysicalMaterial {
  const color = new Color(options.color ?? "#ffc400");
  const subsurface = new Color(options.subsurfaceColor ?? "#ff6a00");
  const wrap = options.wrap ?? 0.4;
  const strength = options.strength ?? 0.62;
  const power = options.power ?? 3.2;
  const distortion = options.distortion ?? 0.18;

  const material = new MeshPhysicalMaterial({
    color: options.map ? new Color("#ffffff") : color,
    map: options.map ?? null,
    roughness: 0.42,
    metalness: 0,
    clearcoat: 0.78,
    clearcoatRoughness: 0.38,
    sheen: 0.65,
    sheenRoughness: 0.48,
    sheenColor: new Color("#fff1c2"),
    // Tiny bit of transmission sells translucent rubber without going glassy.
    transmission: 0.04,
    thickness: 0.45,
    attenuationDistance: 0.55,
    attenuationColor: subsurface.clone(),
    ior: 1.35,
  });

  material.onBeforeCompile = (shader: WebGLProgramParametersWithUniforms) => {
    shader.uniforms.uSubsurfaceColor = { value: subsurface };
    shader.uniforms.uWrap = { value: wrap };
    shader.uniforms.uSSSStrength = { value: strength };
    shader.uniforms.uSSSPower = { value: power };
    shader.uniforms.uSSSDistortion = { value: distortion };

    shader.fragmentShader = shader.fragmentShader
      .replace(
        "#include <common>",
        /* glsl */ `
        #include <common>
        uniform vec3 uSubsurfaceColor;
        uniform float uWrap;
        uniform float uSSSStrength;
        uniform float uSSSPower;
        uniform float uSSSDistortion;
        `,
      )
      .replace(
        "#include <lights_fragment_end>",
        /* glsl */ `
        #include <lights_fragment_end>

        // --- Soft-rubber approximate SSS ---------------------------------
        // Wrap diffuse softens the terminator; backscatter lights the
        // opposite lobe with the warm subsurface colour so edges glow
        // like thin vinyl under desk lamps.
        {
          vec3 sssN = geometryNormal;
          vec3 sssView = normalize( geometryViewDir );
          vec3 sssAccum = vec3( 0.0 );

          #if ( NUM_DIR_LIGHTS > 0 )
            #pragma unroll_loop_start
            for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
              vec3 L = directionalLights[ i ].direction;
              vec3 lightColor = directionalLights[ i ].color;
              float NdotL = dot( sssN, L );
              float wrapDiffuse = saturate( ( NdotL + uWrap ) / ( 1.0 + uWrap ) );
              vec3 scatterDir = normalize( L + sssN * uSSSDistortion );
              float VdotScatter = saturate( dot( sssView, -scatterDir ) );
              float scatter = pow( VdotScatter, uSSSPower ) * uSSSStrength;
              sssAccum += lightColor * ( wrapDiffuse * 0.18 + scatter ) * uSubsurfaceColor;
            }
            #pragma unroll_loop_end
          #endif

          #if ( NUM_POINT_LIGHTS > 0 )
            #pragma unroll_loop_start
            for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
              vec3 lVector = pointLights[ i ].position - geometryPosition;
              float lightDistance = length( lVector );
              vec3 L = lVector / max( lightDistance, 1e-4 );
              float attenuation = getDistanceAttenuation(
                lightDistance,
                pointLights[ i ].distance,
                pointLights[ i ].decay
              );
              float NdotL = dot( sssN, L );
              float wrapDiffuse = saturate( ( NdotL + uWrap ) / ( 1.0 + uWrap ) );
              vec3 scatterDir = normalize( L + sssN * uSSSDistortion );
              float VdotScatter = saturate( dot( sssView, -scatterDir ) );
              float scatter = pow( VdotScatter, uSSSPower ) * uSSSStrength * 0.65;
              sssAccum += pointLights[ i ].color * attenuation * ( wrapDiffuse * 0.12 + scatter ) * uSubsurfaceColor;
            }
            #pragma unroll_loop_end
          #endif

          reflectedLight.directDiffuse += sssAccum * diffuseColor.rgb;
        }
        `,
      );
  };

  // Ensure three.js recompiles when we hot-swap options in dev.
  material.customProgramCacheKey = () =>
    `soft-rubber-sss:${wrap}:${strength}:${power}:${distortion}`;

  return material;
}
