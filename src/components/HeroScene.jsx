import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function HeroScene() {
  const containerRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // Dimensions
    const width = container.clientWidth || 300
    const height = container.clientHeight || 300

    // 1. Scene, Camera, and Renderer setup
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100)
    camera.position.z = 7

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(width, height)
    container.appendChild(renderer.domElement)

    // 2. 3D Elements Group
    const group = new THREE.Group()
    scene.add(group)

    // (1) Outer shell: Wireframe edges of an Icosahedron in signal orange
    const outerGeo = new THREE.IcosahedronGeometry(1.9, 1)
    const outerEdges = new THREE.EdgesGeometry(outerGeo)
    const outerMat = new THREE.LineBasicMaterial({
      color: 0xff5b1f,
      transparent: true,
      opacity: prefersReducedMotion ? 0.9 : 0.0,
    })
    const outerShell = new THREE.LineSegments(outerEdges, outerMat)
    group.add(outerShell)

    // (2) Inner core: Dense particle swarm
    const innerGeo = new THREE.IcosahedronGeometry(1.15, 4)
    const innerMat = new THREE.PointsMaterial({
      color: 0xe8e6df,
      size: 0.025,
      transparent: true,
      opacity: 0.8,
    })
    const innerCore = new THREE.Points(innerGeo, innerMat)
    group.add(innerCore)

    // (3) Orbit ring: Tilted subtle ellipse path
    const curve = new THREE.EllipseCurve(0, 0, 2.7, 2.7, 0, 2 * Math.PI, false, 0)
    const curvePoints = curve.getPoints(128)
    const ringGeo = new THREE.BufferGeometry().setFromPoints(curvePoints)
    const ringMat = new THREE.LineBasicMaterial({
      color: 0xe8e6df,
      transparent: true,
      opacity: 0.18,
    })
    const orbitRing = new THREE.LineLoop(ringGeo, ringMat)
    orbitRing.rotation.x = Math.PI / 2.4
    group.add(orbitRing)

    // Initial scale depending on motion preferences
    if (prefersReducedMotion) {
      group.scale.setScalar(1)
    } else {
      group.scale.setScalar(0.6)
    }

    // 3. Pointer interaction state
    let targetRotationX = 0
    let targetRotationY = 0
    let dragSpinX = 0
    let dragSpinY = 0
    let isDragging = false
    let previousPointerX = 0
    let previousPointerY = 0
    let autoSpinY = 0

    const onPointerMove = (e) => {
      // Normalised coordinates (-1 to 1)
      const normalisedX = (e.clientX / window.innerWidth - 0.5) * 2
      const normalisedY = (e.clientY / window.innerHeight - 0.5) * 2
      targetRotationY = normalisedX * 0.4
      targetRotationX = normalisedY * 0.25

      // Add extra rotation while dragging
      if (isDragging) {
        const deltaX = e.clientX - previousPointerX
        const deltaY = e.clientY - previousPointerY
        dragSpinY += deltaX * 0.01
        dragSpinX += deltaY * 0.01
        previousPointerX = e.clientX
        previousPointerY = e.clientY
      }
    }

    const onCanvasPointerDown = (e) => {
      isDragging = true
      previousPointerX = e.clientX
      previousPointerY = e.clientY
    }

    const onPointerUp = () => {
      isDragging = false
    }

    const canvas = renderer.domElement
    canvas.addEventListener('pointerdown', onCanvasPointerDown)
    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp)

    // 4. Resize handling
    const onResize = () => {
      if (!container) return
      const newWidth = container.clientWidth
      const newHeight = container.clientHeight
      if (newWidth === 0 || newHeight === 0) return

      camera.aspect = newWidth / newHeight
      camera.updateProjectionMatrix()
      renderer.setSize(newWidth, newHeight)
    }
    window.addEventListener('resize', onResize)

    // 5. Visibility / Off-screen pausing via IntersectionObserver
    let isVisible = true
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        isVisible = entry.isIntersecting
      },
      { threshold: 0.05 },
    )
    observer.observe(container)

    // 6. Animation loop
    let animationFrameId = null
    const startTime = performance.now()
    let currentTiltX = 0
    let currentTiltY = 0

    const animate = (currentTime) => {
      animationFrameId = requestAnimationFrame(animate)

      if (!isVisible) return

      const timeInSeconds = currentTime * 0.001
      const elapsed = (performance.now() - startTime) / 1000

      // Intro materialization (over ~1 second)
      if (!prefersReducedMotion && elapsed < 1.0) {
        const progress = Math.min(elapsed / 1.0, 1.0)
        const easeOut = 1 - Math.pow(1 - progress, 3)
        group.scale.setScalar(0.6 + 0.4 * easeOut)
        outerMat.opacity = 0.9 * easeOut
      } else if (!prefersReducedMotion) {
        group.scale.setScalar(1)
        outerMat.opacity = 0.9
      }

      // Auto-spin on Y-axis
      if (!prefersReducedMotion) {
        autoSpinY += 0.0025
        innerCore.rotation.y = -timeInSeconds * 0.15
      }

      // Smooth easing toward mouse tilt + drag spin
      currentTiltX += (targetRotationX + dragSpinX - currentTiltX) * 0.06
      currentTiltY += (targetRotationY + dragSpinY - currentTiltY) * 0.06

      group.rotation.x = currentTiltX
      group.rotation.y = autoSpinY + currentTiltY

      renderer.render(scene, camera)
    }

    animationFrameId = requestAnimationFrame(animate)

    // 7. Cleanup everything on unmount
    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId)
      observer.disconnect()

      canvas.removeEventListener('pointerdown', onCanvasPointerDown)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
      window.removeEventListener('resize', onResize)

      // Dispose geometries and materials
      outerGeo.dispose()
      outerEdges.dispose()
      outerMat.dispose()

      innerGeo.dispose()
      innerMat.dispose()

      ringGeo.dispose()
      ringMat.dispose()

      // Dispose renderer and force context loss
      renderer.dispose()
      renderer.forceContextLoss()

      if (canvas.parentNode) {
        canvas.parentNode.removeChild(canvas)
      }
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="h-full w-full cursor-grab active:cursor-grabbing"
      role="img"
      aria-label="Interactive 3D shape — drag to rotate"
      data-cursor="hot"
    />
  )
}
