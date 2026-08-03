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
        //
        // Temps are declared OUTSIDE the unrolled loops — three.js
        // unroll_loop pragmas inline iterations into one scope, so
        // per-iteration local declarations would error as redefinitions.
        {
          vec3 sssN = geometryNormal;
          vec3 sssView = normalize( geometryViewDir );
          vec3 sssAccum = vec3( 0.0 );
          vec3 sssL;
          vec3 sssLightColor;
          vec3 sssScatterDir;
          vec3 sssLVector;
          float sssNdotL;
          float sssWrapDiffuse;
          float sssVdotScatter;
          float sssScatter;
          float sssLightDistance;
          float sssAttenuation;

          #if ( NUM_DIR_LIGHTS > 0 )
            #pragma unroll_loop_start
            for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
              sssL = directionalLights[ i ].direction;
              sssLightColor = directionalLights[ i ].color;
              sssNdotL = dot( sssN, sssL );
              sssWrapDiffuse = saturate( ( sssNdotL + uWrap ) / ( 1.0 + uWrap ) );
              sssScatterDir = normalize( sssL + sssN * uSSSDistortion );
              sssVdotScatter = saturate( dot( sssView, -sssScatterDir ) );
              sssScatter = pow( sssVdotScatter, uSSSPower ) * uSSSStrength;
              sssAccum += sssLightColor * ( sssWrapDiffuse * 0.18 + sssScatter ) * uSubsurfaceColor;
            }
            #pragma unroll_loop_end
          #endif

          #if ( NUM_POINT_LIGHTS > 0 )
            #pragma unroll_loop_start
            for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
              sssLVector = pointLights[ i ].position - geometryPosition;
              sssLightDistance = length( sssLVector );
              sssL = sssLVector / max( sssLightDistance, 1e-4 );
              sssAttenuation = getDistanceAttenuation(
                sssLightDistance,
                pointLights[ i ].distance,
                pointLights[ i ].decay
              );
              sssNdotL = dot( sssN, sssL );
              sssWrapDiffuse = saturate( ( sssNdotL + uWrap ) / ( 1.0 + uWrap ) );
              sssScatterDir = normalize( sssL + sssN * uSSSDistortion );
              sssVdotScatter = saturate( dot( sssView, -sssScatterDir ) );
              sssScatter = pow( sssVdotScatter, uSSSPower ) * uSSSStrength * 0.65;
              sssAccum += pointLights[ i ].color * sssAttenuation * ( sssWrapDiffuse * 0.12 + sssScatter ) * uSubsurfaceColor;
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
