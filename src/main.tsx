import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.scss'
import App from './App.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // Dữ liệu sẽ được coi là "mới" trong 5 phút
      gcTime: 1000 * 60 * 10, // Giữ dữ liệu trong bộ nhớ đệm 10 phút
      retry: 1, // Nếu lỗi thì thử lại 1 lần
      refetchOnWindowFocus: false // Không tải lại dữ liệu khi chuyển tab trình duyệt
    }
  }
})
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </StrictMode>
)
