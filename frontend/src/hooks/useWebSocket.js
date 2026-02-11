import { useState, useEffect, useRef, useCallback } from 'react'

const getWsUrl = () => {
  const base = window.location.origin.replace(/^http/, 'ws')
  return `${base}/ws`
}

export function useWebSocket() {
  const [lastMessage, setLastMessage] = useState(null)
  const [metrics, setMetrics] = useState({
    auctions: 0,
    wins: 0,
    win_rate: 0,
    total_savings: 0,
    avg_savings: 0,
  })
  const [feed, setFeed] = useState([])
  const [connected, setConnected] = useState(false)
  const wsRef = useRef(null)
  const reconnectTimeoutRef = useRef(null)

  const connect = useCallback(() => {
    const url = getWsUrl()
    const ws = new WebSocket(url)

    ws.onopen = () => setConnected(true)
    ws.onclose = () => {
      setConnected(false)
      reconnectTimeoutRef.current = setTimeout(connect, 2000)
    }
    ws.onerror = () => {}
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        setLastMessage(data)
        if (data.metrics) setMetrics(data.metrics)
        setFeed((prev) => [data, ...prev].slice(0, 50))
      } catch (_) {}
    }

    wsRef.current = ws
    return () => {
      ws.close()
    }
  }, [])

  useEffect(() => {
    connect()
    return () => {
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current)
      if (wsRef.current) wsRef.current.close()
    }
  }, [connect])

  return { lastMessage, metrics, feed, connected }
}
