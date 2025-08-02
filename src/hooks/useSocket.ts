import { useEffect } from 'react'
import { io } from 'socket.io-client'

const socket = io('https://circle-api-22.up.railway.app')

export const useThreadSocket = (onNewThread: (data: any) => void) => {
  useEffect(() => {
    socket.on("new-thread", onNewThread)

    // Cleanup function (dipanggil saat komponen unmount)
    return () => {
      socket.off("new-thread", onNewThread)
    }
  }, [onNewThread])
}