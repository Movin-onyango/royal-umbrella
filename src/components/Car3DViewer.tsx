'use client'

import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'

interface Car3DViewerProps {
  modelUrl: string
  soundUrl?: string
  fallbackImageUrl?: string | null
  fallbackAlt: string
}

export default function Car3DViewer({ modelUrl, soundUrl, fallbackImageUrl, fallbackAlt }: Car3DViewerProps) {
  const mountRef = useRef<HTMLDivElement>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isPlayingSound, setIsPlayingSound] = useState(false)
  const [isModelLoaded, setIsModelLoaded] = useState(false)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    let active = true
    let carModel: THREE.Group | undefined
    let frameId = 0
    let isDragging = false
    let lastPointerX = 0
    let previousFrameTime: number | undefined
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100)
    camera.position.set(0, 0.8, 6)

    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    } catch {
      return
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.15
    renderer.setClearColor(0x000000, 0)
    mount.appendChild(renderer.domElement)
    renderer.domElement.style.cursor = 'grab'
    renderer.domElement.style.touchAction = 'pan-y'

    const handlePointerDown = (event: PointerEvent) => {
      isDragging = true
      lastPointerX = event.clientX
      renderer.domElement.style.cursor = 'grabbing'
      renderer.domElement.setPointerCapture(event.pointerId)
    }
    const handlePointerMove = (event: PointerEvent) => {
      if (!isDragging || !carModel) return
      carModel.rotation.y += (event.clientX - lastPointerX) * 0.01
      lastPointerX = event.clientX
    }
    const handlePointerUp = () => {
      isDragging = false
      renderer.domElement.style.cursor = 'grab'
    }

    renderer.domElement.addEventListener('pointerdown', handlePointerDown)
    renderer.domElement.addEventListener('pointermove', handlePointerMove)
    renderer.domElement.addEventListener('pointerup', handlePointerUp)
    renderer.domElement.addEventListener('pointercancel', handlePointerUp)

    scene.add(new THREE.HemisphereLight(0xffffff, 0x5b5148, 2))
    const keyLight = new THREE.DirectionalLight(0xffffff, 3)
    keyLight.position.set(4, 6, 5)
    scene.add(keyLight)
    const fillLight = new THREE.DirectionalLight(0xc9d9ff, 1.5)
    fillLight.position.set(-5, 2, -3)
    scene.add(fillLight)

    const resize = () => {
      const { width, height } = mount.getBoundingClientRect()
      if (!width || !height) return
      renderer.setSize(width, height, false)
      camera.aspect = width / height
      camera.updateProjectionMatrix()
    }

    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(mount)
    resize()

    const animate = (time: number) => {
      frameId = window.requestAnimationFrame(animate)
      const delta = Math.min((time - (previousFrameTime ?? time)) / 1000, 0.05)
      previousFrameTime = time
      if (carModel && !isDragging) carModel.rotation.y += 0.3 * delta
      renderer.render(scene, camera)
    }

    const loader = new GLTFLoader()
    loader.load(
      modelUrl,
      ({ scene: loadedScene }) => {
        if (!active) return
        carModel = loadedScene
        const bounds = new THREE.Box3().setFromObject(carModel)
        const center = bounds.getCenter(new THREE.Vector3())
        const size = bounds.getSize(new THREE.Vector3())
        const largestDimension = Math.max(size.x, size.y, size.z)

        if (largestDimension > 0) {
          carModel.position.sub(center)
          carModel.scale.setScalar(4.2 / largestDimension)
        }

        scene.add(carModel)
        setIsModelLoaded(true)
        frameId = window.requestAnimationFrame(animate)
      },
      undefined,
      () => undefined,
    )

    return () => {
      active = false
      window.cancelAnimationFrame(frameId)
      resizeObserver.disconnect()
      renderer.domElement.removeEventListener('pointerdown', handlePointerDown)
      renderer.domElement.removeEventListener('pointermove', handlePointerMove)
      renderer.domElement.removeEventListener('pointerup', handlePointerUp)
      renderer.domElement.removeEventListener('pointercancel', handlePointerUp)
      renderer.dispose()
      carModel?.traverse((object) => {
        if (!(object instanceof THREE.Mesh)) return
        object.geometry.dispose()
        const materials = Array.isArray(object.material) ? object.material : [object.material]
        materials.forEach((material) => {
          Object.values(material).forEach((value) => {
            if (value instanceof THREE.Texture) value.dispose()
          })
          material.dispose()
        })
      })
      renderer.domElement.remove()
    }
  }, [modelUrl])

  useEffect(() => () => {
    audioRef.current?.pause()
  }, [])

  async function playSound() {
    if (!soundUrl || isPlayingSound) return

    const audio = new Audio(soundUrl)
    audio.volume = 0.65
    audioRef.current?.pause()
    audioRef.current = audio
    setIsPlayingSound(true)

    const stopSound = () => {
      audio.pause()
      if (audioRef.current === audio) {
        audioRef.current = null
        setIsPlayingSound(false)
      }
    }

    audio.addEventListener('ended', stopSound, { once: true })
    audio.addEventListener('error', stopSound, { once: true })

    try {
      await audio.play()
    } catch {
      stopSound()
    }
  }

  return (
    <div className="absolute inset-0 overflow-hidden">
      {fallbackImageUrl && (
        <img
          src={fallbackImageUrl}
          alt={fallbackAlt}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${isModelLoaded ? 'opacity-0' : 'opacity-100'}`}
        />
      )}
      <div
        ref={mountRef}
        role="img"
        aria-label="3D vehicle model. Drag horizontally to rotate."
        className="absolute inset-0"
      />
      {isModelLoaded && (
        <p className="pointer-events-none absolute bottom-4 right-4 z-10 rounded-full border border-white/20 bg-black/60 px-3 py-2 text-xs text-white/80">
          Drag to rotate
        </p>
      )}
      {soundUrl && (
        <button
          type="button"
          onClick={playSound}
          disabled={isPlayingSound}
          className="absolute right-4 top-4 z-10 border border-white/30 bg-black/70 px-4 py-2 text-xs text-white transition hover:bg-black disabled:opacity-60"
          aria-label={isPlayingSound ? 'Engine sound playing' : 'Play engine sound'}
        >
          {isPlayingSound ? 'Playing...' : 'Rev engine'}
        </button>
      )}
    </div>
  )
}
