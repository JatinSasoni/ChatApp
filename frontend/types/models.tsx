export interface user {
  username: string;
  email: string;
  Profile: {
    profilePhoto: string;
    bio: string;
  };
  createdAt: string;
  updatedAt: string;
  _id: string;
}

export interface Message {
  senderId: string;
  receiverId: string;
  text: string;
  createdAt: string;
  _id: string;
  seen: boolean;
  image: string;
}

export interface UnseenMessages {
  [userId: string]: number;
}
