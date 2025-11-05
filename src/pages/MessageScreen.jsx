import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Badge } from "../components/ui/badge";
import { ScrollArea } from "../components/ui/scroll-area";
import {
  Search,
  Send,
  Paperclip,
  MoreVertical,
  Phone,
  Video,
  ArrowLeft,
} from "lucide-react";
import { Footer } from "../components/layout/Footer";

export function MessageScreen({ user }) {
  // ------------------ STATE ------------------
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [showChatOnMobile, setShowChatOnMobile] = useState(false);
  const [showNewChat, setShowNewChat] = useState(false);
  const [contacts, setContacts] = useState([]);

  // ------------------ LOAD CONVERSATIONS ------------------
  useEffect(() => {
    async function loadConversations() {
      try {
        const res = await fetch(
          `http://localhost:3000/api/conversations/${user.id}`
        );
        const data = await res.json();
        setConversations(data);
        if (data.length > 0) setSelectedConversation(data[0]); // chọn cuộc đầu tiên
      } catch (err) {
        console.error("❌ Lỗi tải danh sách cuộc trò chuyện:", err);
      }
    }
    loadConversations();
  }, [user.id]);

  // ------------------ LOAD MESSAGES ------------------
  const loadMessages = async () => {
    if (!selectedConversation) return;
    try {
      const partnerId =
        selectedConversation.partner_id || selectedConversation.userId;
      const res = await fetch(
        `http://localhost:3000/api/messages/${user.id}/${partnerId}`
      );
      const data = await res.json();
      if (!Array.isArray(data)) {
        console.error("❌ Backend trả về không phải mảng:", data);
        setMessages([]); // tránh messages.map bị crash
        return;
      }
      setMessages(data);
    } catch (err) {
      console.error("❌ Lỗi tải tin nhắn:", err);
      setMessages([]); // tránh crash
    }
  };


  // ------------------ LOAD CONTACTS KHI MỞ MODAL ------------------
  useEffect(() => {
    if (showNewChat) loadContacts();
  }, [showNewChat]);

  // ------------------ SEND MESSAGE ------------------
  const handleSendMessage = async () => {
    if (newMessage.trim() === "") return;

    const partnerId =
      selectedConversation.partner_id || selectedConversation.userId;

    let payload = {
      student_id: user.id,
      tutor_id: partnerId,
      sender_id: user.id,
      content: newMessage,
    };

    // ✅ Nếu user là tutor hoặc admin thì đảo ngược cho hợp logic
    if (user.role === "tutor" || user.role === "admin") {
      payload = {
        student_id: partnerId,
        tutor_id: user.id,
        sender_id: user.id,
        content: newMessage,
      };
    }


    try {
      await fetch("http://localhost:3000/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      setNewMessage("");
      await loadMessages();
    } catch (err) {
      console.error("❌ Lỗi gửi tin nhắn:", err);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // ------------------ FILTER CONVERSATIONS ------------------
  const filteredConversations = conversations.filter((conv) =>
    conv.partner_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  async function loadContacts() {
    try {
      const res = await fetch(`http://localhost:3000/api/contacts/${user.id}`);
      const data = await res.json();
      setContacts(data);
    } catch (err) {
      console.error("❌ Lỗi tải danh sách người có thể chat:", err);
    }
  }
  useEffect(() => {
  if (!selectedConversation) return;
  const interval = setInterval(() => {
    loadMessages();
  }, 100); // 2 giây 1 lần
  return () => clearInterval(interval);

  useEffect(() => {
    const interval = setInterval(() => {
      fetch(`http://localhost:3000/api/conversations/${user.id}`)
        .then((res) => res.json())
        .then((data) => setConversations(data))
        .catch(() => {});
    }, 100); // 2 giây 1 lần
    return () => clearInterval(interval);
  }, [user.id]);
}, [selectedConversation]);

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-260px)]">
            {/* Sidebar - danh sách cuộc trò chuyện */}
            <div
              className={`lg:col-span-1 ${
                showChatOnMobile ? "hidden lg:block" : "block"
              }`}
            >
              <Card className="h-full flex flex-col">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Cuộc trò chuyện</CardTitle>

                    {/* Nút Chat mới */}
                    <Button
                      size="sm"
                      className="bg-brand-gradient hover:bg-brand-gradient/90 text-white"
                      onClick={() => setShowNewChat(true)}
                    >
                      + Chat mới
                    </Button>
                  </div>

                  <div className="relative mt-4">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Tìm kiếm..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </CardHeader>

                <CardContent className="flex-1 overflow-hidden p-0">
                  <ScrollArea className="h-full">
                    <div className="space-y-1 p-4 pt-0">
                      {filteredConversations.map((conv) => (
                        <button
                          key={conv.partner_id}
                          onClick={() => {
                            setSelectedConversation(conv);
                            setShowChatOnMobile(true);
                          }}
                          className={`w-full p-3 rounded-lg text-left transition-colors ${
                            selectedConversation?.partner_id === conv.partner_id
                              ? "bg-[#A7C6ED]/30 border border-[#0388B4]"
                              : "hover:bg-gray-100"
                          }`}
                        >
                          <div className="flex items-start space-x-3">
                            <Avatar className="h-12 w-12">
                              <AvatarImage src={conv.avatar || ""} />
                              <AvatarFallback className="bg-brand-gradient text-white">
                                {conv.partner_name?.charAt(0) || "?"}
                              </AvatarFallback>
                            </Avatar>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <p className="text-sm truncate">
                                  {conv.partner_name || "Người dùng"}
                                </p>
                                <span className="text-xs text-gray-500">
                                  {conv.last_time
                                    ? new Date(
                                        conv.last_time
                                      ).toLocaleTimeString("vi-VN", {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      })
                                    : ""}
                                </span>
                              </div>

                              <div className="flex items-center justify-between">
                                <p className="text-xs text-gray-600 truncate">
                                  {conv.last_message || "Chưa có tin nhắn"}
                                </p>
                                {conv.unread > 0 && (
                                  <Badge className="bg-brand-gradient ml-2">
                                    {conv.unread}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>

            {/* Chat chính */}
            <div
              className={`lg:col-span-2 ${
                !showChatOnMobile ? "hidden lg:block" : "block"
              }`}
            >
              {selectedConversation ? (
                <Card className="h-full flex flex-col">
                  {/* Header */}
                  <CardHeader className="border-b">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="lg:hidden"
                          onClick={() => setShowChatOnMobile(false)}
                        >
                          <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <Avatar className="h-10 w-10">
                          <AvatarImage
                            src={selectedConversation.avatar || ""}
                          />
                          <AvatarFallback className="bg-brand-gradient text-white">
                            {selectedConversation.partner_name?.charAt(0) ||
                              "?"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm">
                            {selectedConversation.partner_name}
                          </p>
                          <p className="text-xs text-gray-500">
                            Đang hoạt động
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="icon">
                          <Phone className="h-5 w-5 text-gray-600" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Video className="h-5 w-5 text-gray-600" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-5 w-5 text-gray-600" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>

                  {/* Nội dung tin nhắn */}
                  <CardContent className="flex-1 overflow-hidden p-0">
                    <ScrollArea className="h-full p-4">
                      <div className="space-y-4">
                        {messages.map((message) => (
                          <div
                            key={message.id}
                            className={`flex ${
                              message.sender_id === user.id
                                ? "justify-end"
                                : "justify-start"
                            }`}
                          >
                            <div className="max-w-[70%]">
                              <div
                                className={`rounded-lg px-4 py-2 ${
                                  message.sender_id === user.id
                                    ? "bg-brand-gradient text-white"
                                    : "bg-gray-200 text-gray-900"
                                }`}
                              >
                                <p className="text-sm">{message.content}</p>
                              </div>
                              <p className="text-xs text-gray-500 mt-1">
                                {new Date(
                                  message.created_at
                                ).toLocaleTimeString("vi-VN", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>

                  {/* Ô nhập tin nhắn */}
                  <div className="border-t p-4">
                    <div className="flex items-end space-x-2">
                      <Button variant="ghost" size="icon" className="mb-1">
                        <Paperclip className="h-5 w-5 text-gray-600" />
                      </Button>
                      <div className="flex-1">
                        <Input
                          placeholder="Nhập tin nhắn..."
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyPress={handleKeyPress}
                          className="min-h-[40px]"
                        />
                      </div>
                      <Button
                        onClick={handleSendMessage}
                        className="bg-brand-gradient/90 mb-1"
                        disabled={!newMessage.trim()}
                      >
                        <Send className="h-5 w-5" />
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Nhấn Enter để gửi, Shift + Enter để xuống dòng
                    </p>
                  </div>
                </Card>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  <p>Chọn một cuộc trò chuyện để bắt đầu.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      {/* Modal Chat mới */}
      {showNewChat && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-6 relative">
            <h2 className="text-lg font-bold mb-4">
              Chọn người để bắt đầu chat
            </h2>

            <ScrollArea className="max-h-80">
              {Array.isArray(contacts) &&
                contacts.map((contact) => (
                  <div
                    key={contact.id}
                    onClick={() => {
                      setSelectedConversation({
                        partner_id: contact.id,
                        partner_name: contact.full_name,
                        last_message: "",
                        last_time: null,
                      });
                      setShowNewChat(false);
                      setShowChatOnMobile(true);
                    }}
                    className="p-3 rounded-lg hover:bg-gray-100 flex items-center gap-3 cursor-pointer transition"
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarImage src="" />
                      <AvatarFallback className="bg-brand-gradient text-white">
                        {contact.full_name?.charAt(0) || "?"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{contact.full_name}</p>
                      <p className="text-xs text-gray-500">
                        {contact.role?.name
                          ? contact.role.name.toUpperCase()
                          : ""}
                      </p>
                    </div>
                  </div>
                ))}
            </ScrollArea>

            <Button
              variant="outline"
              className="mt-4 w-full"
              onClick={() => setShowNewChat(false)}
            >
              Đóng
            </Button>
          </div>
        </div>
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
}
