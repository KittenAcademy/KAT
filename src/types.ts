export interface IGif {
  id: string;
  name: string;
  tags: string[];
  checksum?: string;
  ext: string;
  // schema version
  version?: number;
}

export interface IScoredGif extends IGif {
  score: number;
}
