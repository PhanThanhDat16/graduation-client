import { io, Socket } from 'socket.io-client'
import { create } from 'zustand'

interface ISocketSore {
  socket: Socket | null
  isConnected: boolean
  connect: () => void
  disconnect: () => void
}

const SOCKET_URL = import.meta.env.VITE_SOCKETIO

export const useStoreSocketIO = create<ISocketSore>((set) => ({
  socket: null,
  isConnected: false,

  connect: () => {
    set((state) => {
      if (state.socket && state.socket.connected) {
        console.warn('Socket already connected')
        return state
      }

      const socket = io(SOCKET_URL)

      let failedAttempts = 0

      socket.on('connect', () => {
        set({ socket, isConnected: true })

        // console.log('Socket IO Connected')
        failedAttempts = 0
      })

      socket.on('connectError', () => {
        console.error('connectError', failedAttempts)
        failedAttempts += 1
        if (failedAttempts >= 10) {
          socket.disconnect()
          console.error('Failed to connect 10 times. Socket disconnected.')
        }
      })

      return { socket, isConnected: true }
    })
  },

  disconnect() {
    set((state) => {
      if (state.socket && state.socket.connected) {
        state.socket.disconnect()
        // console.log('Socket disconnected')
      }
      return { socket: null, isConnected: false }
    })
  }
}))
