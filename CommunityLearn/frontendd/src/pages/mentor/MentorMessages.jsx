import { useState, useEffect, useRef } from 'react';
import { Send, MessageSquare, Search } from 'lucide-react';
import {
  getMentorConversations,
  getConversation,
  sendMessage,
  markMessageRead,
  getUnreadCount,
} from '../../utils/sharedStore';

const MentorMessages = ({ currentUser }) => {
  const [conversations, setConversations] = useState([]);
  const [activeConv,    setActiveConv]    = useState(null);
  const [messages,      setMessages]      = useState([]);
  const [input,         setInput]         = useState('');
  const [search,        setSearch]        = useState('');
  const bottomRef = useRef(null);

  const loadConversations = () => {
    if (!currentUser?.id) return;
    const convs = getMentorConversations(currentUser.id);
    setConversations(convs);
  };

  const loadMessages = (partnerId) => {
    if (!currentUser?.id) return;
    const msgs = getConversation(currentUser.id, partnerId);
    setMessages(msgs);
    // mark all as read
    msgs.filter(m => m.recipientId === currentUser.id && !m.read)
        .forEach(m => markMessageRead(m.id));
  };

  useEffect(() => {
    loadConversations();
    const iv = setInterval(loadConversations, 3000);
    window.addEventListener('cl_message_update', loadConversations);
    return () => { clearInterval(iv); window.removeEventListener('cl_message_update', loadConversations); };
  }, [currentUser]);

  useEffect(() => {
    if (activeConv) {
      loadMessages(activeConv.partnerId);
      const iv = setInterval(() => loadMessages(activeConv.partnerId), 3000);
      return () => clearInterval(iv);
    }
  }, [activeConv, currentUser]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior:'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim() || !activeConv) return;
    sendMessage({
      senderId:      currentUser.id,
      senderName:    currentUser.name,
      recipientId:   activeConv.partnerId,
      recipientName: activeConv.partnerName,
      text:          input.trim(),
    });
    setInput('');
    loadMessages(activeConv.partnerId);
    loadConversations();
    window.dispatchEvent(new Event('cl_message_update'));
  };

  const filteredConvs = conversations.filter(c =>
    c.partnerName.toLowerCase().includes(search.toLowerCase())
  );

  const initials = (name) => name?.split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,2) || '?';
  const colors   = ['from-blue-500 to-cyan-500','from-pink-500 to-rose-500','from-violet-500 to-purple-500','from-emerald-500 to-teal-500'];

  return (
    <div className="rounded-2xl bg-[#0d1f1a] border border-emerald-900/30 overflow-hidden" style={{ height:'600px' }}>
      <div className="flex h-full">
        {/* Sidebar */}
        <div className="w-64 flex-shrink-0 border-r border-emerald-900/20 flex flex-col">
          <div className="p-3 border-b border-emerald-900/20">
            <h3 className="text-sm font-bold text-white mb-2">Messages</h3>
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-600" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..."
                className="w-full pl-7 pr-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.07] text-xs text-white placeholder-gray-700 outline-none" />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {filteredConvs.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center px-4">
                <MessageSquare className="w-8 h-8 text-gray-700 mb-2" />
                <p className="text-gray-600 text-xs">No messages yet</p>
                <p className="text-gray-700 text-[10px] mt-1">Students can message you after booking</p>
              </div>
            ) : (
              filteredConvs.map(c => {
                const colorIdx = c.partnerName.charCodeAt(0) % colors.length;
                const unread   = getConversation(currentUser.id, c.partnerId).filter(m => m.recipientId === currentUser.id && !m.read).length;
                return (
                  <button key={c.partnerId} onClick={() => setActiveConv(c)}
                    className={`w-full flex items-center gap-3 px-3 py-3 border-b border-white/[0.04] hover:bg-white/[0.04] transition-colors text-left ${activeConv?.partnerId === c.partnerId ? 'bg-emerald-500/10' : ''}`}>
                    <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${colors[colorIdx]} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                      {initials(c.partnerName)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-bold text-white truncate">{c.partnerName}</p>
                        {unread > 0 && <span className="w-4 h-4 rounded-full bg-emerald-500 text-white text-[9px] font-black flex items-center justify-center flex-shrink-0">{unread}</span>}
                      </div>
                      <p className="text-[10px] text-gray-600 truncate">{c.lastMsg?.text || ''}</p>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Chat area */}
        <div className="flex-1 flex flex-col">
          {activeConv ? (
            <>
              <div className="px-4 py-3 border-b border-emerald-900/20 flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${colors[activeConv.partnerName.charCodeAt(0) % colors.length]} flex items-center justify-center text-white text-xs font-bold`}>
                  {initials(activeConv.partnerName)}
                </div>
                <p className="text-sm font-bold text-white">{activeConv.partnerName}</p>
                <span className="text-[10px] text-emerald-400 ml-auto">Student</span>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-600 text-xs">Start the conversation</p>
                  </div>
                ) : messages.map(msg => {
                  const isMe = msg.senderId === currentUser.id;
                  return (
                    <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[75%] px-3 py-2 rounded-2xl text-xs ${isMe ? 'bg-emerald-600 text-white rounded-tr-sm' : 'bg-white/[0.07] text-gray-200 rounded-tl-sm'}`}>
                        {msg.text}
                        <p className={`text-[9px] mt-1 ${isMe ? 'text-emerald-200' : 'text-gray-600'}`}>
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' })}
                        </p>
                      </div>
                    </div>
                  );
                })}
                <div ref={bottomRef} />
              </div>
              <div className="px-4 py-3 border-t border-emerald-900/20 flex gap-2">
                <input value={input} onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSend()}
                  placeholder="Type a message…"
                  className="flex-1 px-4 py-2 rounded-xl bg-white/[0.05] border border-white/[0.08] text-sm text-white placeholder-gray-600 outline-none focus:border-emerald-600/50 transition-colors" />
                <button onClick={handleSend} disabled={!input.trim()}
                  className="w-10 h-10 rounded-xl bg-emerald-600 hover:bg-emerald-500 flex items-center justify-center text-white disabled:opacity-40 transition-all">
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              <MessageSquare className="w-12 h-12 text-gray-700 mb-3" />
              <p className="text-gray-500 font-semibold text-sm">Select a conversation</p>
              <p className="text-gray-700 text-xs mt-1">Choose a student to start messaging</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MentorMessages;
