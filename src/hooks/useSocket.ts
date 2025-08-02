import { useEffect } from 'react'
import { io } from 'socket.io-client'

const socket = io('http://localhost:3000')

export const useThreadSocket = (onNewThread: (data: any) => void) => {
  useEffect(() => {
    socket.on("new-thread", onNewThread)

    // Cleanup function (dipanggil saat komponen unmount)
    return () => {
      socket.off("new-thread", onNewThread)
    }
  }, [onNewThread])
}