export interface ChatMessageRequest {
  chatId: number;
  username?: string;
  prompt: string;
}

export interface ChatMessageResponse {
  answer: string;
  model: string;
  promptTokens: number;
  completionTokens: number;
}
