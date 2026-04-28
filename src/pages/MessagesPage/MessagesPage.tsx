import { useState } from 'react'
import {
  Search,
  MoreVertical,
  Paperclip,
  Send,
  Image as ImageIcon,
  Smile,
  CheckCheck,
  Phone,
  Video,
  Info,
  ArrowLeft,
  Briefcase,
  MessageSquare
} from 'lucide-react'

// --- MOCK DATA ---
const CONVERSATIONS = [
  {
    id: 'c1',
    user: {
      name: 'Nguyễn Tấn Sang',
      avatar: 'https://ui-avatars.com/api/?name=Tan+Sang&background=1B2A6B&color=fff',
      isOnline: true,
      role: 'Fullstack Developer'
    },
    project_ref: 'Phát triển nền tảng E-commerce MERN Stack',
    lastMessage: 'Dạ anh, em có thể fix lại giá xuống còn 18tr nếu...',
    time: '10:25',
    unread: 2
  },
  {
    id: 'c2',
    user: {
      name: 'Lê Hoàng Sơn',
      avatar: 'https://ui-avatars.com/api/?name=Hoang+Son&background=F59E0B&color=fff',
      isOnline: false,
      role: 'Backend Developer'
    },
    project_ref: 'Thiết kế UI/UX App Đặt Lịch Spa',
    lastMessage: 'Ok anh, em sẽ gửi lại portfolio cho anh xem nhé.',
    time: 'Hôm qua',
    unread: 0
  },
  {
    id: 'c3',
    user: {
      name: 'Trần Thu Hà',
      avatar: 'https://ui-avatars.com/api/?name=Thu+Ha&background=16A34A&color=fff',
      isOnline: true,
      role: 'Frontend React/Vue'
    },
    project_ref: 'Tuyển Dev React Native fix bug',
    lastMessage: 'Cảm ơn anh đã phản hồi. Hẹn anh dự án khác ạ.',
    time: 'T2',
    unread: 0
  }
]

const CHAT_MESSAGES = [
  {
    id: 1,
    sender: 'Nguyễn Tấn Sang',
    text: 'Chào anh, em đã đọc kỹ yêu cầu dự án E-commerce của bên mình. Em từng làm 2 dự án tương tự rồi ạ.',
    time: '10:15',
    isMe: false
  },
  {
    id: 2,
    sender: 'Bạn',
    text: 'Chào Sang. Mình thấy CV của bạn khá ổn. Tuy nhiên mức giá 20tr có vẻ hơi vượt ngân sách dự kiến của bên mình một chút.',
    time: '10:20',
    isMe: true
  },
  {
    id: 3,
    sender: 'Nguyễn Tấn Sang',
    text: 'Dạ anh, em có thể fix lại giá xuống còn 18tr nếu bên mình bỏ bớt tính năng đa ngôn ngữ đi ạ. Anh thấy sao?',
    time: '10:25',
    isMe: false
  }
]

export default function MessagesPage() {
  const [activeChat, setActiveChat] = useState<(typeof CONVERSATIONS)[0] | null>(CONVERSATIONS[0])
  const [messageInput, setMessageInput] = useState('')

  return (
    <div className="w-full max-w-7xl mx-auto animate-in fade-in duration-300 h-[calc(100vh-100px)] flex flex-col">
      {/* KHUNG CHAT CHÍNH (CHIA 2 CỘT) */}
      <div className="flex-1 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col md:flex-row h-full min-h-0">
        {/* ==========================================
            CỘT TRÁI: DANH SÁCH HỘI THOẠI
        ========================================== */}
        <div
          className={`w-full md:w-80 lg:w-96 border-r border-slate-200 flex flex-col bg-slate-50/50 shrink-0 ${activeChat ? 'hidden md:flex' : 'flex'}`}
        >
          {/* Header & Search */}
          <div className="p-4 border-b border-slate-200 bg-white shrink-0">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Tìm kiếm tin nhắn..."
                className="w-full pl-9 pr-4 py-2.5 bg-slate-100 border-transparent rounded-xl text-sm focus:bg-white focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-none transition-all"
              />
            </div>
          </div>

          {/* List Users */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden p-2 space-y-1 custom-scrollbar">
            {CONVERSATIONS.map((chat) => (
              <button
                key={chat.id}
                onClick={() => setActiveChat(chat)}
                className={`w-full text-left p-3 rounded-xl flex items-start gap-3 transition-colors ${activeChat?.id === chat.id ? 'bg-indigo-50 border border-indigo-100' : 'hover:bg-slate-100 border border-transparent'}`}
              >
                {/* Avatar có chấm Online */}
                <div className="relative shrink-0 mt-1">
                  <img
                    src={chat.user.avatar}
                    alt="Avatar"
                    className="w-12 h-12 rounded-full border border-slate-200 object-cover"
                  />
                  {chat.user.isOnline && (
                    <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></span>
                  )}
                </div>

                {/* Nội dung List */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-0.5">
                    <h3
                      className={`text-sm truncate pr-2 ${chat.unread > 0 ? 'font-extrabold text-slate-900' : 'font-bold text-slate-700'}`}
                    >
                      {chat.user.name}
                    </h3>
                    <span
                      className={`text-[10px] shrink-0 ${chat.unread > 0 ? 'font-bold text-indigo-600' : 'text-slate-400'}`}
                    >
                      {chat.time}
                    </span>
                  </div>
                  <p className={`text-xs truncate ${chat.unread > 0 ? 'font-bold text-slate-800' : 'text-slate-500'}`}>
                    {chat.lastMessage}
                  </p>
                </div>

                {/* Badge Tin nhắn chưa đọc */}
                {chat.unread > 0 && (
                  <div className="w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-2">
                    {chat.unread}
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* ==========================================
            CỘT PHẢI: KHUNG CHAT CHI TIẾT
        ========================================== */}
        {activeChat ? (
          <div className={`flex-1 flex flex-col bg-white min-w-0 ${!activeChat ? 'hidden md:flex' : 'flex'}`}>
            {/* Header Khung Chat */}
            <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-white shrink-0 z-10 shadow-sm">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setActiveChat(null)}
                  className="md:hidden p-2 -ml-2 text-slate-400 hover:text-indigo-600"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="relative shrink-0">
                  <img
                    src={activeChat.user.avatar}
                    alt="Avatar"
                    className="w-10 h-10 rounded-full border border-slate-200 object-cover"
                  />
                  {activeChat.user.isOnline && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></span>
                  )}
                </div>
                <div>
                  <h2 className="font-bold text-base text-slate-900">{activeChat.user.name}</h2>
                  <p className="text-xs text-emerald-600 font-medium">
                    {activeChat.user.isOnline ? 'Đang hoạt động' : 'Hoạt động 2 giờ trước'}
                  </p>
                </div>
              </div>

              {/* Nút hành động nhanh trên Header */}
              <div className="flex items-center gap-2 sm:gap-4">
                <div className="hidden sm:flex items-center gap-1">
                  <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors">
                    <Phone className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors">
                    <Video className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors">
                    <Info className="w-5 h-5" />
                  </button>
                </div>
                <div className="w-px h-6 bg-slate-200 hidden sm:block mx-1"></div>
                <button className="hidden sm:flex px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-lg shadow-sm hover:bg-indigo-700 transition-colors">
                  Tạo hợp đồng
                </button>
                <button className="p-2 text-slate-400 hover:text-slate-600 sm:hidden">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Thanh Ref Dự án (Điểm nhấn UI/UX cực xịn) */}
            <div className="bg-indigo-50/50 border-b border-indigo-100 px-6 py-2 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2 overflow-hidden">
                <Briefcase className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span className="text-xs text-slate-500 shrink-0">Đang trao đổi về:</span>
                <span className="text-xs font-bold text-indigo-700 truncate">{activeChat.project_ref}</span>
              </div>
              <button className="text-xs font-bold text-indigo-600 hover:underline shrink-0 pl-4 hidden sm:block">
                Xem dự án
              </button>
            </div>

            {/* Lịch sử Tin nhắn (Scroll Area) */}
            <div className="flex-1 p-6 overflow-y-auto bg-slate-50/30 space-y-6">
              <div className="text-center">
                <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full uppercase tracking-wider">
                  Hôm nay, 10:15
                </span>
              </div>

              {CHAT_MESSAGES.map((msg) => (
                <div key={msg.id} className={`flex flex-col ${msg.isMe ? 'items-end' : 'items-start'}`}>
                  <div className={`max-w-[85%] sm:max-w-[70%] flex flex-col ${msg.isMe ? 'items-end' : 'items-start'}`}>
                    {/* Bong bóng tin nhắn */}
                    <div
                      className={`px-4 py-3 rounded-2xl text-sm ${msg.isMe ? 'bg-indigo-600 text-white rounded-br-sm' : 'bg-white border border-slate-200 text-slate-800 rounded-bl-sm shadow-sm'}`}
                    >
                      {msg.text}
                    </div>

                    {/* Trạng thái gửi (Giờ + Đã xem) */}
                    <div className="flex items-center gap-1 mt-1 px-1">
                      <span className="text-[10px] text-slate-400">{msg.time}</span>
                      {msg.isMe && <CheckCheck className="w-3 h-3 text-emerald-500" />}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Ô Nhập tin nhắn (Input Area) */}
            <div className="p-4 bg-white border-t border-slate-200 shrink-0">
              <div className="flex items-end gap-2 bg-slate-50 border border-slate-200 rounded-2xl p-2 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition-all">
                <div className="flex items-center gap-1 pb-1 px-1 shrink-0">
                  <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors">
                    <Paperclip className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors hidden sm:block">
                    <ImageIcon className="w-5 h-5" />
                  </button>
                </div>

                <textarea
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder="Nhập tin nhắn thương lượng..."
                  className="flex-1 bg-transparent border-none text-sm px-2 py-3 outline-none resize-none max-h-32 min-h-[44px]"
                  rows={1}
                />

                <div className="flex items-center gap-2 pb-1 px-1 shrink-0">
                  <button className="p-2 text-slate-400 hover:text-amber-500 transition-colors hidden sm:block">
                    <Smile className="w-5 h-5" />
                  </button>
                  <button
                    className={`p-2.5 rounded-xl transition-all ${messageInput.trim() ? 'bg-indigo-600 text-white shadow-md hover:bg-indigo-700' : 'bg-slate-200 text-slate-400'}`}
                  >
                    <Send className="w-5 h-5 ml-0.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Trạng thái chưa chọn tin nhắn nào (Empty State) */
          <div className="hidden md:flex flex-1 flex-col items-center justify-center bg-slate-50/50">
            <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mb-6">
              <MessageSquare className="w-10 h-10 text-indigo-300" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Tin nhắn của bạn</h3>
            <p className="text-slate-500 text-center max-w-sm">
              Chọn một cuộc hội thoại ở danh sách bên trái để bắt đầu thương lượng với ứng viên.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
