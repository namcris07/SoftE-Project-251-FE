import React, { useState, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
import { Search, Send, Paperclip, ArrowLeft, X, UserPlus } from "lucide-react";
import { Footer } from "../components/layout/Footer";
import { toast } from "sonner";
import axiosClient from "../api/axiosClient";

// --- API Calls ---

const fetchConversations = async (userId) => {
  if (!userId) return [];
  try {
    const res = await axiosClient.get(`/messages/conversations/${userId}`);
    return Array.isArray(res) ? res : [];
  } catch (error) {
    console.error("Lỗi tải danh sách chat:", error);
    return [];
  }
};

const fetchMessages = async (userId, partnerId) => {
  if (!partnerId) return [];
  const res = await axiosClient.get(`/messages/${userId}/${partnerId}`);
  return Array.isArray(res) ? res : [];
};

const fetchContacts = async () => {
  const res = await axiosClient.get("/users/contacts");
  return Array.isArray(res) ? res : [];
};

export function MessageScreen({ user: propUser }) {
  const queryClient = useQueryClient();
  const chatBottomRef = useRef(null);

  const user = propUser || {
    id: localStorage.getItem("userId"),
    role: localStorage.getItem("role"),
    name: localStorage.getItem("userName"),
  };

  // ------------------ STATE ------------------
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [showChatOnMobile, setShowChatOnMobile] = useState(false);
  const [showNewChat, setShowNewChat] = useState(false);
  const [contactSearch, setContactSearch] = useState("");

  // ------------------ REACT QUERY ------------------

  const { data: conversations = [], isLoading: loadingConversations } =
    useQuery({
      queryKey: ["conversations", user.id],
      queryFn: () => fetchConversations(user.id),
      refetchInterval: 5000,
      enabled: !!user.id,
    });

  const { data: contacts = [], isLoading: loadingContacts } = useQuery({
    queryKey: ["contacts"],
    queryFn: fetchContacts,
    enabled: showNewChat,
  });

  const partnerId =
    selectedConversation?.partner_id || selectedConversation?.userId;
  const {
    data: messages = [],
    isLoading: loadingMessages,
    refetch: refetchMessages,
  } = useQuery({
    queryKey: ["messages", user.id, partnerId],
    queryFn: () => fetchMessages(user.id, partnerId),
    enabled: !!partnerId,
    refetchInterval: 2000,
  });

  const sendMutation = useMutation({
    mutationFn: async (payload) => {
      return await axiosClient.post("/messages", payload);
    },
    onSuccess: () => {
      setNewMessage("");
      refetchMessages();
      queryClient.invalidateQueries(["conversations"]);
    },
    onError: () => {
      toast.error("Không thể gửi tin nhắn.");
    },
  });

  // ------------------ HANDLERS ------------------

  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, selectedConversation]); // Scroll khi có tin mới hoặc đổi chat

  const handleSelectContact = (contact) => {
    const existingConv = conversations.find((c) => c.partner_id === contact.id);

    if (existingConv) {
      setSelectedConversation(existingConv);
    } else {
      setSelectedConversation({
        partner_id: contact.id,
        partner_name: contact.name,
        role: contact.role,
        avatar: contact.avatar,
        last_message: "",
      });
    }

    setShowNewChat(false);
    setShowChatOnMobile(true);
    setContactSearch("");
  };

  const handleSendMessage = () => {
    if (
      newMessage.trim() === "" ||
      sendMutation.isPending ||
      !selectedConversation
    )
      return;

    const partnerIdToSend = selectedConversation.partner_id;
    const isCurrentUserTutor = user.role === "tutor" || user.role === "admin";

    let payload = {
      sender_id: user.id,
      content: newMessage,
      student_id: isCurrentUserTutor ? partnerIdToSend : user.id,
      tutor_id: isCurrentUserTutor ? user.id : partnerIdToSend,
    };

    sendMutation.mutate(payload);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const filteredConversations = conversations.filter((conv) =>
    conv.partner_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredContacts = contacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(contactSearch.toLowerCase()) ||
      contact.email.toLowerCase().includes(contactSearch.toLowerCase())
  );

  // ------------------ RENDER ------------------

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 h-full">
          {/* Container chính: Cố định chiều cao để không bị tràn màn hình */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-160px)]">
            {/* Sidebar (Danh sách chat) */}
            <div
              className={`lg:col-span-1 ${
                showChatOnMobile ? "hidden lg:block" : "block"
              } h-full`}
            >
              <Card className="h-full flex flex-col">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Cuộc trò chuyện</CardTitle>
                    <Button
                      size="sm"
                      className="bg-brand-gradient text-white"
                      onClick={() => setShowNewChat(true)}
                    >
                      <UserPlus className="h-4 w-4 mr-2" /> Chat mới
                    </Button>
                  </div>
                  <div className="relative mt-4">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Tìm hội thoại..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </CardHeader>

                <CardContent className="flex-1 overflow-hidden p-0">
                  <ScrollArea className="h-full">
                    <div className="space-y-1 p-4 pt-0">
                      {loadingConversations ? (
                        <div className="text-center py-4 text-sm text-gray-500">
                          Đang tải...
                        </div>
                      ) : filteredConversations.length === 0 ? (
                        <div className="text-center py-8 text-gray-400 text-sm">
                          Chưa có tin nhắn nào
                        </div>
                      ) : (
                        filteredConversations.map((conv) => (
                          <button
                            key={conv.partner_id}
                            onClick={() => {
                              setSelectedConversation(conv);
                              setShowChatOnMobile(true);
                              // refetchMessages sẽ tự chạy do đổi key useQuery
                            }}
                            className={`w-full p-3 rounded-lg text-left transition-colors flex items-start space-x-3 ${
                              selectedConversation?.partner_id ===
                              conv.partner_id
                                ? "bg-[#A7C6ED]/30 border border-[#0388B4]"
                                : "hover:bg-gray-100"
                            }`}
                          >
                            <Avatar className="h-12 w-12 flex-shrink-0">
                              <AvatarFallback className="bg-brand-gradient text-white">
                                {conv.partner_name?.charAt(0) || "?"}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <p className="text-sm font-medium truncate">
                                  {conv.partner_name}
                                </p>
                                <span className="text-xs text-gray-500">
                                  {new Date(conv.last_time).toLocaleTimeString(
                                    "vi-VN",
                                    { hour: "2-digit", minute: "2-digit" }
                                  )}
                                </span>
                              </div>
                              <p className="text-xs text-gray-600 truncate">
                                {conv.last_message || "Hình ảnh"}
                              </p>
                            </div>
                          </button>
                        ))
                      )}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>

            {/* Chat Area (Khung chat chính) */}
            <div
              className={`lg:col-span-2 ${
                !showChatOnMobile ? "hidden lg:block" : "block"
              } h-full`}
            >
              {selectedConversation ? (
                <Card className="h-full flex flex-col overflow-hidden">
                  {/* 1. Chat Header (Cố định) */}
                  <CardHeader className="border-b py-3 flex-shrink-0 bg-white z-10">
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
                          <AvatarFallback className="bg-brand-gradient text-white">
                            {selectedConversation.partner_name?.charAt(0) ||
                              "?"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">
                            {selectedConversation.partner_name}
                          </p>
                          <p className="text-xs text-gray-500 capitalize">
                            {selectedConversation.role}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  {/* 2. Messages List (Cuộn độc lập) - QUAN TRỌNG: Thay ScrollArea bằng div overflow-y-auto */}
                  <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4 scroll-smooth">
                    {loadingMessages ? (
                      <div className="text-center py-8 text-gray-400">
                        Đang tải tin nhắn...
                      </div>
                    ) : messages.length === 0 ? (
                      <div className="text-center py-10 text-gray-400">
                        <p>
                          Bắt đầu cuộc trò chuyện với{" "}
                          {selectedConversation.partner_name}
                        </p>
                      </div>
                    ) : (
                      messages.map((message) => {
                        const isOwner = message.sender_id == user.id;
                        return (
                          <div
                            key={message.id}
                            className={`flex w-full ${
                              isOwner ? "justify-end" : "justify-start"
                            }`}
                          >
                            <div
                              className={`flex max-w-[80%] md:max-w-[70%] gap-2 ${
                                isOwner ? "flex-row-reverse" : "flex-row"
                              }`}
                            >
                              {/* Avatar người khác */}
                              {!isOwner && (
                                <Avatar className="h-8 w-8 mt-1 border border-gray-200 shadow-sm flex-shrink-0">
                                  <AvatarImage
                                    src={selectedConversation.avatar}
                                  />
                                  <AvatarFallback className="bg-gray-200 text-gray-500 text-xs">
                                    {selectedConversation.partner_name?.charAt(
                                      0
                                    )}
                                  </AvatarFallback>
                                </Avatar>
                              )}

                              {/* Nội dung tin nhắn */}
                              <div>
                                <div
                                  className={`px-4 py-2 text-sm shadow-sm break-words ${
                                    isOwner
                                      ? "bg-brand-gradient text-white rounded-2xl rounded-tr-none"
                                      : "bg-white text-gray-800 border border-gray-100 rounded-2xl rounded-tl-none"
                                  }`}
                                >
                                  {message.content}
                                </div>
                                <p
                                  className={`text-[10px] text-gray-400 mt-1 ${
                                    isOwner
                                      ? "text-right mr-1"
                                      : "text-left ml-1"
                                  }`}
                                >
                                  {new Date(
                                    message.created_at
                                  ).toLocaleTimeString("vi-VN", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                    {/* Điểm neo để scroll xuống đáy */}
                    <div ref={chatBottomRef} />
                  </div>

                  {/* 3. Input Area (Cố định ở đáy) */}
                  <div className="p-4 bg-white border-t flex-shrink-0">
                    <div className="flex items-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-gray-500"
                      >
                        <Paperclip className="h-5 w-5" />
                      </Button>
                      <Input
                        placeholder="Nhập tin nhắn..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="flex-1"
                      />
                      <Button
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim() || sendMutation.isPending}
                        className="bg-brand-gradient text-white"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-400 bg-white rounded-lg border border-dashed">
                  <div className="bg-gray-100 p-4 rounded-full mb-4">
                    <Send className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="text-lg font-medium">
                    Chọn một cuộc trò chuyện
                  </p>
                  <p className="text-sm">Hoặc bấm "Chat mới" để bắt đầu</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* MODAL CHAT MỚI */}
      {showNewChat && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-md rounded-xl shadow-xl overflow-hidden flex flex-col max-h-[80vh]">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-lg font-bold">Bắt đầu đoạn chat mới</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowNewChat(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="p-4 border-b bg-gray-50">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Tìm người dùng..."
                  value={contactSearch}
                  onChange={(e) => setContactSearch(e.target.value)}
                  className="pl-10 bg-white"
                />
              </div>
            </div>

            <ScrollArea className="flex-1">
              <div className="p-2">
                {loadingContacts ? (
                  <div className="text-center py-8 text-gray-500">
                    Đang tải danh sách...
                  </div>
                ) : filteredContacts.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    Không tìm thấy người dùng nào
                  </div>
                ) : (
                  filteredContacts.map((contact) => (
                    <button
                      key={contact.id}
                      onClick={() => handleSelectContact(contact)}
                      className="w-full flex items-center p-3 hover:bg-gray-100 rounded-lg transition-colors text-left group"
                    >
                      <Avatar className="h-10 w-10 mr-3 border group-hover:border-blue-300">
                        <AvatarImage src={contact.avatar} />
                        <AvatarFallback className="bg-gray-200 text-gray-600">
                          {contact.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm text-gray-900">
                          {contact.name}
                        </p>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className="text-[10px] px-1 py-0 h-4"
                          >
                            {contact.role}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            {contact.email}
                          </span>
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </ScrollArea>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
