// Tipos para la aplicación de chat
export interface User {
    id: string;
    name: string;
    avatar?: string;
    status?: 'online' | 'offline' | 'away';
}

export interface Message {
    id: string;
    userId: string;
    content: string;
    timestamp: Date;
    type?: 'text' | 'image' | 'file';
}

export interface Chat {
    id: string;
    participants: User[];
    messages: Message[];
    lastMessage?: Message;
}
