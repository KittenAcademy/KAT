export interface IGif {
  id: string;
  name: string;
  tags: string[];
  checksum?: string;
}

export interface IScoredGif extends IGif {
  score: number;
}
