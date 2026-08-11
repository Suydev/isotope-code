# Liquid Glass Effect — Android Overlay

## What is Liquid Glass

Liquid Glass (iOS 26, Android 17 Frosted Glass) is a translucent material that **refracts** content behind it (not just blurs). It uses:

1. **Refraction** — bends light through curved glass (SDF-based, not Gaussian blur)
2. **Specular highlights** — bright white edge reflections responding to surface normals
3. **Ambient glow** — soft edge glow from all directions
4. **Chromatic aberration** — RGB separation (optional, prismatic effect)
5. **Depth shadows** — adaptive shadows below glass

## Reference Libraries

| Library | Approach | Our Constraint |
|---------|----------|----------------|
| [Kyant0/AndroidLiquidGlass](https://github.com/Kyant0/AndroidLiquidGlass) | Compose + AGSL shaders (API 33+) | We use Views, not Compose |
| [Kashif-E/KMPLiquidGlass](https://github.com/Kashif-E/KMPLiquidGlass) | Compose Multiplatform + SkSL/AGSL | We use Views, not Compose |
| [QmDeve/AndroidLiquidGlassView](https://github.com/QmDeve/AndroidLiquidGlassView) | Custom View + RenderEffect (API 31+) | TYPE_APPLICATION_OVERLAY can't use RenderEffect |

**Key constraint:** Our overlay uses `TYPE_APPLICATION_OVERLAY` windows, which **cannot** use:
- `RenderEffect` (API 31+) — restricted in overlay windows
- `RuntimeShader` / AGSL — needs hardware layer which overlays may not support
- `BlurEffect` — same restriction

## Our Approach: View-Based Simulation

We simulate the liquid glass look with **layered translucent Views**:

### Card Body
```
Color.argb(120-140, 240, 240, 248)  // milky white, semi-transparent
cornerRadius = 24-28dp
```

### Edge Highlight (Specular)
- **Top edge:** `View` height 2-3dp, gradient from `Color.argb(100, 255,255,255)` → transparent
- Position: `Gravity.TOP`, full width, rounded top corners

### Inner Glow
- **Top inner shine:** `View` height 30-50dp, gradient from `Color.argb(40, 255,255,255)` → transparent
- Creates the "light passing through glass" effect

### Bottom Edge Shadow
- **Bottom edge:** `View` height 1-2dp, gradient from transparent → `Color.argb(30, 0,0,0)`
- Simulates depth/shadow at glass bottom

### Drop Shadow
- Use `android:elevation` or a dark gradient View below card

## AGSL Shader Reference (for future API 33+ upgrade)

### Refraction Shader
```glsl
// Bends content behind glass based on SDF distance to edge
float circleMap(float x) { return 1.0 - sqrt(1.0 - x * x); }
half4 main(float2 coord) {
    float sd = sdRoundedRect(centeredCoord, halfSize, radius);
    float d = circleMap(1.0 - -sd / refractionHeight) * refractionAmount;
    float2 grad = normalize(gradSdRoundedRect(...));
    float2 refractedCoord = coord + d * grad;
    return content.eval(refractedCoord);
}
```

### Highlight Shader
```glsl
// Directional lighting from surface normal
half4 main(float2 coord) {
    float2 grad = gradSdRoundedRect(centeredCoord, halfSize, gradRadius);
    float2 normal = float2(cos(angle), sin(angle));
    float d = dot(grad, normal);
    float intensity = pow(abs(d), falloff);
    return color * intensity;
}
```

### SDF Rounded Rect
```glsl
float sdRoundedRect(float2 coord, float2 halfSize, float radius) {
    float2 cornerCoord = abs(coord) - (halfSize - float2(radius));
    float outside = length(max(cornerCoord, 0.0)) - radius;
    float inside = min(max(cornerCoord.x, cornerCoord.y), 0.0);
    return outside + inside;
}
```

## Three Theme Modes

| Theme | Body | Text | Buttons | Edge Effects |
|-------|------|------|---------|--------------|
| **Dark** | Solid `rgb(14,14,17)` | White | Solid colors | None |
| **Glass** | `argb(80, 18,18,24)` dark frosted | White | Semi-transparent | None |
| **Apple Glass** | `argb(120-140, 240,240,248)` milky | Dark `rgb(15,15,20)` | Glass-tinted, colored text | Edge highlights + glow |

## Button Sizing Rules

All buttons scale proportionally with overlay dimensions:
- Scale factor: `min(overlayWidth/300, overlayHeight/340)`
- Clamp: `0.65x` to `1.4x`
- Elements that scale: timer text, button height, button text size, padding, corner radius
- Scale triggers: resize handle drag, theme change, initial render

## Files

- `FloatingTimerService.kt` — overlay rendering, theme switching, scaling
- `PipActivity.kt` — settings screen with theme/size pickers
- `PipClient.kt` — HTTP client for server communication
- `TimerState.kt` — timer state parser
