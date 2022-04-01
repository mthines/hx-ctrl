export type BlockKeys =
  | 'block0'
  | 'block1'
  | 'block2'
  | 'block3'
  | 'block4'
  | 'block5'
  | 'block6'
  | 'block7'
  | 'block8'
  | 'block9'
  | 'block10'
  | 'block11'
  | 'block12'
  | 'block13'
  | 'block14'
  | 'block15';

export type OtherKeys = 'join' | 'split' | 'outputA' | 'outputB' | 'inputA' | 'inputB';

export type Preset = {
  data: Data;
  meta: PresetMeta;
  schema: string;
  version: number;
};

export type PresetMeta = {
  original: number;
  pbn: number;
  premium: number;
};

export type Data = {
  meta: DataMeta;
  device: number;
  tone: Tone;
  device_version: number;
};

export type DataMeta = {
  name: string;
  application: string;
  build_sha: string;
  modifieddate: number;
  appversion: number;
};

export type Tone = {
  controller: Controller;
  dsp0: Dsp;
  dsp1: Dsp;
};

export type Controller = {
  dsp0?: Dsp;
  dsp1?: Dsp;
};

export type Dsp = Partial<Record<BlockKeys | OtherKeys, BlockTypes>>;

export type BlockTypes = Record<string, Partial<CCControl>>;

export type ToneBlockTypes = BlockKeys & Record<string, Partial<Block>>;

export type CCControl = {
  '@cc': number;
  '@max': number | boolean;
  '@min': number | boolean;
  '@controller': number;
};

export type Block = {
  '@model': string;
  '@no_snapshot_bypass': boolean;
  '@path': number;
  '@stereo': boolean;
  '@position': number;
  '@enabled': boolean;
};
