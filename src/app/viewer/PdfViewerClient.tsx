// app/viewer/PdfViewerClient.tsx
'use client'

import { useRef, useLayoutEffect, useEffect, useState } from 'react'
import { Worker, Viewer, ZoomEvent } from '@react-pdf-viewer/core'
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout'

import '@react-pdf-viewer/core/lib/styles/index.css'
import '@react-pdf-viewer/default-layout/lib/styles/index.css'

type Props = {
    fileUrl: string
}

export default function PdfViewerClient({ fileUrl }: Props) {
    const defaultLayoutPluginInstance = defaultLayoutPlugin()

    const containerRef = useRef<HTMLDivElement>(null)

    const [scale, setScale] = useState(1)

    useLayoutEffect(() => {
        const container = containerRef.current
        if (container) {
            container.style.setProperty('--scale-factor', scale.toString())
        }
    }, [scale])

    const handleZoom = (e: ZoomEvent) => {
        setScale(e.scale)
    }

    useEffect(() => {
        const container = containerRef.current
        if (!container) return

        const preventCtrlZoom = (e: WheelEvent) => {
            if (e.ctrlKey) {
                e.preventDefault()
            }
        }

        container.addEventListener('wheel', preventCtrlZoom, { passive: false })
        return () => {
            container.removeEventListener('wheel', preventCtrlZoom)
        }
    }, [])

    return (
        <div ref={containerRef} style={{ height: '100vh' }}>
            <Worker workerUrl="/pdf.worker.min.js">
                <Viewer
                    fileUrl={fileUrl}
                    plugins={[defaultLayoutPluginInstance]}
                    onZoom={handleZoom}
                />
            </Worker>
        </div>
    )
}
