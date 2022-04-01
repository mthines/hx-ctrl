import { arrayFromNumber } from './utils/common';
import { generatePlugin, SLIDER, Slider } from './utils/slider';

const sliders: Slider[] = [
  {
    ...SLIDER.KNOB,
    title: 'Snapshot',
    cc: 69,
  },
  {
    ...SLIDER.KNOB,
    title: 'G. Volume',
    cc: 10,
  },
  {
    ...SLIDER.KNOB,
    title: 'G. Pan',
    cc: 11,
  },
  ...arrayFromNumber(8).map<Slider>((_s, i) => ({
    ...SLIDER.KNOB,
    title: `G. Knob ${i + 1}`,
    cc: 12 + i,
  })),
  ...arrayFromNumber(5).map<Slider>((_s, i) => ({
    ...SLIDER.SWITCH,
    title: `G. Switch ${i + 1}`,
    cc: 20 + i,
  })),
];

generatePlugin(sliders, { desc: 'HX Guitar' });
