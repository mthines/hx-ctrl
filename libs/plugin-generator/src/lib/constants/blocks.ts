import { Block } from '@hx-ctrl/plugin-generator';

export const blocknames: Record<Block['@model'], string> = {
  HD2_AppDSPFlowOutput: 'Output',
  VIC_DynPlate: 'Dynamic Hall',
  HD2_VolPanStereoWidth: 'Stereo Width',
  HD2_DL4DynamicDelayStereo: 'Dynamic Delay (Legacy)',
  HD2_RetroReel: 'Retro Reel',
  L6SPB_PolyWham: 'Poly Wham',
  HD2_VolPanGain: 'Gain',
};
