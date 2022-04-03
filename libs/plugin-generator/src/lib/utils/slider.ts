/* eslint-disable no-console */
import { error, success } from '@hx-ctrl/plugin-generator';
import fs from 'fs';
import path from 'path';

const outputDir = path.resolve('dist');

const SLIDE_OFFSET = 5;
const MIDI_SLIDER_ID = 1;

export type Slider = {
  default: number;
  min: number;
  max: number;
  title: string;
  cc: number | null;
  ceil?: boolean;
};

export const SLIDER: Record<'KNOB' | 'SWITCH', Pick<Slider, 'default' | 'min' | 'max'>> = {
  KNOB: {
    default: 0,
    min: 0,
    max: 127,
  },
  SWITCH: {
    default: 0,
    min: 0,
    max: 1,
  },
};

export const SLIDER_DEFAULTS: Record<'SNAPSHOT', Slider> = {
  SNAPSHOT: {
    title: 'Snapshot',
    cc: 69,
    default: 0,
    min: 0,
    max: 7,
  },
};

export type Config = {
  desc: string;
  fileName?: string;
  outputDir?: string;
};

export const generatePlugin = (sliders: Slider[], config: Config) => {
  const [fileName] = config.fileName?.split('.') || ['[MISSING FILENAME]'];

  // Add Description
  let outputData = `desc: ${config.desc}\n`;

  // MIDI Channel Slider
  outputData = `${outputData}slider${MIDI_SLIDER_ID}:0<0,15,1{1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16}>MIDI Channel\n`;

  // Set the Slider, default, min, max values and the name
  outputData = sliders.reduce((_outputData, s, i) => {
    const id = i + SLIDE_OFFSET;

    return `${_outputData}slider${id}:${s.default}<${s.min},${s.max},1>${s.cc ? `(${s.cc}) ` : ''}${s.title}\n`;
  }, outputData);

  // Initialize the Sliders
  outputData = `${outputData}
@init
cc_msg = 176; // 0xB0 or CC messages\n`;

  outputData = sliders.reduce((_outputData, s, i) => {
    const id = i + SLIDE_OFFSET;
    return `${_outputData}c${id} = ceil(slider${id});\n`;
  }, outputData);

  // Cancel execution
  outputData = `${outputData}\n`;

  outputData = sliders.reduce((_outputData, s, i) => {
    const id = i + SLIDE_OFFSET;
    return `${_outputData}c${id}_run = 0;\n`;
  }, outputData);

  // Generate Sliders
  outputData = `${outputData}
@slider\n`;

  outputData = sliders.reduce((_outputData, s, i) => {
    const id = i + SLIDE_OFFSET;

    return `${_outputData}c${id} != slider${id} ? (
 c${id} = slider${id};
 c${id}_run = 1;
);\n`;
  }, outputData);

  // Create the Blocks and mix the values with the MIDI Channel
  outputData = `${outputData}
@block\n`;

  outputData = sliders.reduce((_outputData, s, i) => {
    const id = i + SLIDE_OFFSET;

    if (s.max === 1) {
      return `${_outputData}c${id}_run ? (
 midisend(offset, (cc_msg + slider${MIDI_SLIDER_ID}), (${s.cc}) | (c${id} === 0 ? 0 : 127 * 256));
 c${id}_run = 0;
);\n`;
    }

    return `${_outputData}c${id}_run ? (
 midisend(offset, (cc_msg + slider${MIDI_SLIDER_ID}), (${s.cc}) | (c${id} * 256));
 c${id}_run = 0;
);\n`;
  }, outputData);

  const outputPath = config.outputDir || outputDir;
  const outputFile = `${fileName}.jsfx`;

  if (!fs.existsSync(outputPath)) {
    try {
      fs.mkdirSync(outputPath, { recursive: true });
      console.log(`Created the directory ${outputPath}`);
    } catch (err) {
      error('Failed creating directory', err);
    }
  }

  try {
    // Write the file
    fs.writeFileSync(path.join(outputPath, outputFile), outputData);

    success('File created', `File name: ${outputFile}`, `File path: ${outputPath}`);

    return {
      outputFile,
      outputPath,
    };
  } catch (err) {
    error('Failure', err);
  }
};
