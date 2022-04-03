import { Block } from 'libs/hx-loader/src/lib/types/helix';

export const blocknames: Record<Block['@model'], string> = {
  HD2_AppDSPFlowOutput: 'Output',
  VIC_DynPlate: 'Dynamic Hall',
  HD2_VolPanStereoWidth: 'Stereo Width',
  L6SPB_PolyWham: 'Poly Wham',
  HD2_VolPanGain: 'Gain',
};
