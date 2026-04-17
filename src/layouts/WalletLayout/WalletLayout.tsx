import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { Wallet, BanknoteArrowDownIcon, BanknoteArrowUp, CreditCard, Banknote } from 'lucide-react'
import NavItem from '@/components/components-wallet/NavItem'
import path from '@/constants/path'

function WalletSidebar() {
  const navigate = useNavigate()
  const location = useLocation()

  const navItems = [
    {
      icon: <Wallet size={24} />,
      label: 'Tổng quan',
      path: path.WALLET,
      exact: true
    },
    {
      icon: <BanknoteArrowDownIcon size={24} />,
      label: 'Nạp tiền',
      path: path.ADD_FUNDS,
      exact: false
    },
    {
      icon: <BanknoteArrowUp size={24} />,
      label: 'Rút tiền',
      path: path.WITHDRAW,
      exact: false
    },
    {
      icon: <Banknote size={24} />,
      label: 'Yêu cầu rút tiền',
      path: path.WITHDRAW_REQUESTS,
      exact: false
    },
    {
      icon: <CreditCard size={24} />,
      label: 'Tài khoản ngân hàng',
      path: path.BANK_ACCOUNTS,
      exact: false
    }
  ]

  return (
    <aside className="w-64 shrink-0 flex flex-col h-screen bg-white border-r border-slate-200 px-4 py-6 sticky top-0">
      {/* Header */}
      <div className="mb-8 ml-1">
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight ml-3">Ví của tôi</h2>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-2 flex-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path

          return (
            <NavItem
              key={item.path}
              icon={item.icon}
              label={item.label}
              active={isActive}
              onClick={() => navigate(item.path)}
            />
          )
        })}
      </nav>
    </aside>
  )
}

export default function WalletLayout() {
  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      <WalletSidebar />
      <Outlet />
    </div>
  )
}
