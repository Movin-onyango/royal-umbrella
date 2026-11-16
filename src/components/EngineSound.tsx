'use client'

import { useEffect, useState } from 'react'

export default function EngineSound() {
  const [hasPlayed, setHasPlayed] = useState(false)

  useEffect(() => {
    // Browsers block autoplay unless the user has interacted with the page first.
    // We try to play it after 5 seconds.
    const timer = setTimeout(() => {
      const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3') // Free engine rev sound
      audio.volume = 0.5 // Set volume to 50%
      audio.play().then(() => {
        setHasPlayed(true)
      }).catch((err) => {
        console.log("Browser blocked auto-play. Waiting for user interaction.", err)
        // Fallback: If autoplay is blocked, we don't force it.
      })
    }, 5000)

    return () => clearTimeout(timer)
  }, [])

  // This component doesn't render anything visual
  return null
}