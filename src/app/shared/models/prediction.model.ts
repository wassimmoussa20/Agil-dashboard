export interface PredictionRequest {
  periods?: number;
  start_date?: string;
}

export interface PredictionResponse {
  prediction: number;
  confidence_interval?: {
    lower: number;
    upper: number;
  };
  period: string;
  graph_data?: any[];
}

export interface APIError {
  message: string;
  statusCode: number;
  timestamp: string;
}