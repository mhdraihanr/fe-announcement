"use client";

import { useState, useRef, useEffect } from "react";
import type { User, ChatChannel, Message, Officer } from "@/types";
import { initialChannels, initialMessages } from "@/app/chat/data";
import { initialOfficers } from "@/app/officer/data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import {
  MessageCircle,
  Send,
  Users,
  Hash,
  Settings,
  UserPlus,
  MoreHorizontal,
  Pin,
  PinOff,
  Edit,
  Trash2,
  Link,
  Check,
} from "lucide-react";

interface ChatSystemProps {
  currentUser: User;
}

export default function ChatSystem({ currentUser }: ChatSystemProps) {
  const [activeChannel, setActiveChannel] = useState("general");
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [channels, setChannels] = useState<ChatChannel[]>(initialChannels);
  const [messages, setMessages] =
    useState<Record<string, any[]>>(initialMessages);

  // Dialog states
  const [addMemberDialog, setAddMemberDialog] = useState(false);
  const [settingsDialog, setSettingsDialog] = useState(false);
  const [newMemberName, setNewMemberName] = useState("");
  const [editChannelName, setEditChannelName] = useState("");
  const [editChannelType, setEditChannelType] = useState<
    "public" | "private" | "department"
  >("public");
  const [pinnedChannels, setPinnedChannels] = useState<string[]>([]);
  const [selectedOfficers, setSelectedOfficers] = useState<Officer[]>([]);
  const [showOfficerList, setShowOfficerList] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showCopyLink, setShowCopyLink] = useState(false);

  const canAccessChannel = (channel: any) => {
    const roleHierarchy = ["Employee", "Officer", "VP", "SVP", "Admin"];
    const userRoleIndex = roleHierarchy.indexOf(currentUser.role);
    const requiredRoleIndex = roleHierarchy.indexOf(channel.requiredRole);

    if (userRoleIndex < requiredRoleIndex) return false;
    if (channel.department && channel.department !== currentUser.department)
      return false;

    return true;
  };

  const accessibleChannels = channels.filter(canAccessChannel);

  const currentChannelMessages = messages[activeChannel] || [];

  const sendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        id: currentChannelMessages.length + 1,
        user: currentUser.name,
        role: currentUser.role,
        message: message.trim(),
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        avatar: "/api/placeholder/32/32",
      };

      setMessages((prev) => ({
        ...prev,
        [activeChannel]: [...(prev[activeChannel] || []), newMessage],
      }));

      setMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Add members function (multiple)
  const handleAddMembers = () => {
    if (selectedOfficers.length > 0) {
      const updatedChannels = channels.map((channel) => {
        if (channel.id === activeChannel) {
          return {
            ...channel,
            members: channel.members + selectedOfficers.length,
          };
        }
        return channel;
      });
      setChannels(updatedChannels);

      // Add system message for multiple members
      const memberNames = selectedOfficers
        .map((officer) => `${officer.name} (${officer.position})`)
        .join(", ");
      const systemMessage = {
        id: (messages[activeChannel]?.length || 0) + 1,
        user: "System",
        role: "System",
        message: `${
          selectedOfficers.length > 1 ? "Members" : "Member"
        } added to channel: ${memberNames}`,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        avatar: "/api/placeholder/32/32",
        isSystem: true,
      };

      setMessages((prev) => ({
        ...prev,
        [activeChannel]: [...(prev[activeChannel] || []), systemMessage],
      }));

      setSelectedOfficers([]);
      setSearchTerm("");
      setShowOfficerList(false);
      setAddMemberDialog(false);
    }
  };

  // Toggle officer selection
  const toggleOfficerSelection = (officer: Officer) => {
    setSelectedOfficers((prev) => {
      const isSelected = prev.some((o) => o.id === officer.id);
      if (isSelected) {
        return prev.filter((o) => o.id !== officer.id);
      } else {
        return [...prev, officer];
      }
    });
  };

  // Copy channel link
  const copyChannelLink = () => {
    const channelLink = `${window.location.origin}/chat?channel=${activeChannel}&invite=true`;
    navigator.clipboard.writeText(channelLink).then(() => {
      setShowCopyLink(true);
      setTimeout(() => setShowCopyLink(false), 2000);
    });
  };

  // Filter officers based on search
  const filteredOfficers = initialOfficers.filter(
    (officer) =>
      officer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      officer.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      officer.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Edit channel function
  const handleEditChannel = () => {
    if (editChannelName.trim()) {
      const updatedChannels = channels.map((channel) => {
        if (channel.id === activeChannel) {
          return {
            ...channel,
            name: editChannelName,
            type: editChannelType,
          };
        }
        return channel;
      });
      setChannels(updatedChannels);

      // Add system message
      const systemMessage = {
        id: (messages[activeChannel]?.length || 0) + 1,
        user: "System",
        role: "System",
        message: `Channel updated: ${editChannelName} (${editChannelType})`,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        avatar: "/api/placeholder/32/32",
        isSystem: true,
      };

      setMessages((prev) => ({
        ...prev,
        [activeChannel]: [...(prev[activeChannel] || []), systemMessage],
      }));

      setSettingsDialog(false);
    }
  };

  // Pin/Unpin channel function
  const handlePinChannel = () => {
    if (pinnedChannels.includes(activeChannel)) {
      setPinnedChannels((prev) => prev.filter((id) => id !== activeChannel));
    } else {
      setPinnedChannels((prev) => [...prev, activeChannel]);
    }
  };

  // Open settings dialog with current values
  const openSettingsDialog = () => {
    const currentChannel = channels.find((c) => c.id === activeChannel);
    if (currentChannel) {
      setEditChannelName(currentChannel.name);
      setEditChannelType(currentChannel.type);
      setSettingsDialog(true);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentChannelMessages]);

  const activeChannelInfo = channels.find((c) => c.id === activeChannel);

  return (
    <div className="h-[calc(100vh-200px)] flex">
      {/* Channels Sidebar */}
      <div className="w-80 bg-background border-r border-border">
        <div className="p-4 border-b">
          <h3 className="font-semibold text-lg">Chat Channels</h3>
          <p className="text-sm text-muted-foreground">
            Role-based communication
          </p>
        </div>
        <ScrollArea className="h-full">
          <div className="p-2 space-y-1">
            {/* Pinned Channels */}
            {pinnedChannels.length > 0 && (
              <>
                <div className="px-2 py-1">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Pinned Channels
                  </span>
                </div>
                {accessibleChannels
                  .filter((channel) => pinnedChannels.includes(channel.id))
                  .map((channel) => (
                    <Button
                      key={channel.id}
                      variant={
                        activeChannel === channel.id ? "default" : "ghost"
                      }
                      className="w-full justify-start h-auto p-3"
                      onClick={() => setActiveChannel(channel.id)}
                    >
                      <div className="flex items-center space-x-3 w-full">
                        <div className="flex items-center space-x-2">
                          <Pin className="h-3 w-3 text-yellow-500" />
                          {channel.type === "private" ? (
                            <Users className="h-4 w-4" />
                          ) : (
                            <Hash className="h-4 w-4" />
                          )}
                          <span className="font-medium">{channel.name}</span>
                        </div>
                        <div className="ml-auto flex items-center space-x-1">
                          {channel.unread > 0 && (
                            <Badge
                              variant="destructive"
                              className="text-xs h-5 min-w-[20px] rounded-full"
                            >
                              {channel.unread}
                            </Badge>
                          )}
                          <span className="text-xs text-muted-foreground">
                            {channel.members}
                          </span>
                        </div>
                      </div>
                    </Button>
                  ))}
                <div className="border-b border-border my-2" />
              </>
            )}

            {/* Regular Channels */}
            <div className="px-2 py-1">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Channels
              </span>
            </div>
            {accessibleChannels
              .filter((channel) => !pinnedChannels.includes(channel.id))
              .map((channel) => (
                <Button
                  key={channel.id}
                  variant={activeChannel === channel.id ? "default" : "ghost"}
                  className="w-full justify-start h-auto p-3"
                  onClick={() => setActiveChannel(channel.id)}
                >
                  <div className="flex items-center space-x-3 w-full">
                    <div className="flex items-center space-x-2">
                      {channel.type === "private" ? (
                        <Users className="h-4 w-4" />
                      ) : (
                        <Hash className="h-4 w-4" />
                      )}
                      <span className="font-medium">{channel.name}</span>
                    </div>
                    <div className="ml-auto flex items-center space-x-1">
                      {channel.unread > 0 && (
                        <Badge
                          variant="destructive"
                          className="text-xs h-5 min-w-[20px] rounded-full"
                        >
                          {channel.unread}
                        </Badge>
                      )}
                      <span className="text-xs text-muted-foreground">
                        {channel.members}
                      </span>
                    </div>
                  </div>
                </Button>
              ))}
          </div>
        </ScrollArea>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b border-border bg-background">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {activeChannelInfo?.type === "private" ? (
                <Users className="h-5 w-5" />
              ) : (
                <Hash className="h-5 w-5" />
              )}
              <div>
                <h3 className="font-semibold">{activeChannelInfo?.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {activeChannelInfo?.members} members •{" "}
                  {activeChannelInfo?.type} channel
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {/* Add Member Dialog */}
              <Dialog open={addMemberDialog} onOpenChange={setAddMemberDialog}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <UserPlus className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px] max-h-[80vh] flex flex-col">
                  <DialogHeader className="flex-shrink-0">
                    <DialogTitle>Add Members to Channel</DialogTitle>
                    <DialogDescription>
                      Select officers to add to {activeChannelInfo?.name}{" "}
                      channel. You can select multiple members.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex-1 py-3 space-y-3 flex flex-col min-h-0 overflow-hidden">
                    {/* Search and Copy Link Row */}
                    <div className="flex gap-2 flex-shrink-0">
                      <div className="flex-1 space-y-1">
                        <Label className="text-sm">Search Officers</Label>
                        <Input
                          placeholder="Search officers..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full h-8"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-sm">Invite</Label>
                        <Button
                          variant="outline"
                          onClick={copyChannelLink}
                          size="sm"
                          className="flex items-center gap-1 h-8 px-2"
                        >
                          {showCopyLink ? (
                            <>
                              <Check className="h-3 w-3 text-green-600" />
                              <span className="text-xs">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Link className="h-3 w-3" />
                              <span className="text-xs">Copy</span>
                            </>
                          )}
                        </Button>
                      </div>
                    </div>

                    {/* Selected Officers */}
                    {selectedOfficers.length > 0 && (
                      <div className="space-y-1 flex-shrink-0">
                        <Label className="text-sm">
                          Selected ({selectedOfficers.length})
                        </Label>
                        <div className="flex flex-wrap gap-1 p-2 border rounded bg-muted/20 max-h-16 overflow-y-auto">
                          {selectedOfficers.map((officer) => (
                            <Badge
                              key={officer.id}
                              variant="secondary"
                              className="flex items-center gap-1 px-2 py-1 text-xs flex-shrink-0"
                            >
                              <Avatar className="h-4 w-4">
                                <AvatarImage
                                  src={officer.avatar}
                                  alt={officer.name}
                                />
                                <AvatarFallback className="text-xs">
                                  {officer.name.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <span className="max-w-16 truncate">
                                {officer.name}
                              </span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleOfficerSelection(officer);
                                }}
                                className="hover:bg-destructive/20 rounded-full w-4 h-4 flex items-center justify-center text-xs transition-colors flex-shrink-0"
                              >
                                ×
                              </button>
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Officers List */}
                    <div className="space-y-1 flex-1 min-h-0 flex flex-col">
                      <div className="flex items-center justify-between flex-shrink-0">
                        <Label className="text-sm">Available Officers</Label>
                        <span className="text-xs text-muted-foreground">
                          {filteredOfficers.length} found
                        </span>
                      </div>
                      <div className="flex-1 border rounded">
                        <ScrollArea className="h-[300px]">
                          <div className="p-2 space-y-1">
                            {filteredOfficers.length === 0 ? (
                              <div className="text-center py-8 text-muted-foreground">
                                <Users className="h-6 w-6 mx-auto mb-2 opacity-50" />
                                <p className="text-sm">No officers found.</p>
                              </div>
                            ) : (
                              filteredOfficers.map((officer) => {
                                const isSelected = selectedOfficers.some(
                                  (o) => o.id === officer.id
                                );
                                return (
                                  <div
                                    key={officer.id}
                                    className={`flex items-center space-x-2 p-2 rounded cursor-pointer transition-all ${
                                      isSelected
                                        ? "bg-primary/10 border border-primary/30"
                                        : "hover:bg-muted/50"
                                    }`}
                                    onClick={() =>
                                      toggleOfficerSelection(officer)
                                    }
                                  >
                                    <Avatar className="h-8 w-8 flex-shrink-0">
                                      <AvatarImage
                                        src={officer.avatar}
                                        alt={officer.name}
                                      />
                                      <AvatarFallback className="text-xs">
                                        {officer.name.charAt(0)}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 min-w-0">
                                      <p className="font-medium text-sm truncate">
                                        {officer.name}
                                      </p>
                                      <p className="text-xs text-muted-foreground truncate">
                                        {officer.position}
                                      </p>
                                    </div>
                                    <div className="flex items-center space-x-1 flex-shrink-0">
                                      <Badge
                                        variant="outline"
                                        className="text-xs px-1 py-0"
                                      >
                                        {officer.status}
                                      </Badge>
                                      {isSelected && (
                                        <div className="w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                                          <Check className="h-2 w-2 text-primary-foreground" />
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                );
                              })
                            )}
                          </div>
                        </ScrollArea>
                      </div>
                    </div>
                  </div>
                  <DialogFooter className="flex justify-between pt-4 border-t bg-background flex-shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedOfficers([]);
                        setSearchTerm("");
                      }}
                      disabled={selectedOfficers.length === 0}
                    >
                      Clear Selection
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleAddMembers}
                      disabled={selectedOfficers.length === 0}
                    >
                      Add{" "}
                      {selectedOfficers.length > 0
                        ? `${selectedOfficers.length} Member${
                            selectedOfficers.length > 1 ? "s" : ""
                          }`
                        : "Members"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {/* Settings Dialog */}
              <Dialog open={settingsDialog} onOpenChange={setSettingsDialog}>
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={openSettingsDialog}
                  >
                    <Settings className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Channel Settings</DialogTitle>
                    <DialogDescription>
                      Edit channel name and privacy settings.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="channel-name" className="text-right">
                        Name
                      </Label>
                      <Input
                        id="channel-name"
                        value={editChannelName}
                        onChange={(e) => setEditChannelName(e.target.value)}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="channel-type" className="text-right">
                        Type
                      </Label>
                      <Select
                        value={editChannelType}
                        onValueChange={(
                          value: "public" | "private" | "department"
                        ) => setEditChannelType(value)}
                      >
                        <SelectTrigger className="col-span-3">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="public">Public</SelectItem>
                          <SelectItem value="private">Private</SelectItem>
                          <SelectItem value="department">Department</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit" onClick={handleEditChannel}>
                      Save Changes
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {/* More Options Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={copyChannelLink}>
                    {showCopyLink ? (
                      <>
                        <Check className="mr-2 h-4 w-4 text-green-600" />
                        Link Copied!
                      </>
                    ) : (
                      <>
                        <Link className="mr-2 h-4 w-4" />
                        Copy Invite Link
                      </>
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handlePinChannel}>
                    {pinnedChannels.includes(activeChannel) ? (
                      <>
                        <PinOff className="mr-2 h-4 w-4" />
                        Unpin Channel
                      </>
                    ) : (
                      <>
                        <Pin className="mr-2 h-4 w-4" />
                        Pin Channel
                      </>
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={openSettingsDialog}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Channel
                  </DropdownMenuItem>
                  {currentUser.role === "Admin" && (
                    <DropdownMenuItem className="text-red-600">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete Channel
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {currentChannelMessages.map((msg) => (
              <div key={msg.id} className="flex items-start space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={msg.avatar} alt={msg.user} />
                  <AvatarFallback>{msg.user.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-sm">{msg.user}</span>
                    <Badge variant="outline" className="text-xs">
                      {msg.role}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {msg.timestamp}
                    </span>
                  </div>
                  <p
                    className={`text-sm mt-1 ${
                      msg.isSystem
                        ? "bg-blue-50 dark:bg-blue-950/30 p-2 rounded italic"
                        : ""
                    }`}
                  >
                    {msg.message}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Message Input */}
        <div className="p-4 border-t border-border bg-background">
          <div className="flex items-center space-x-2">
            <Input
              placeholder={`Message #${activeChannelInfo?.name}`}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1"
            />
            <Button onClick={sendMessage} size="icon">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
