import {
  CCControl,
  Config,
  generatePlugin,
  getArg,
  Preset,
  Slider,
  SLIDER_DEFAULTS,
  ToneBlockTypes,
} from '@hx-ctrl/plugin-generator';
import * as fs from 'fs';
import { blocknames } from 'libs/plugin-generator/src/lib/constants/blocks';

export type GetSliderFromPresetParam = {
  filePath: string;
  outputDir?: string;
};

export const getSliderFromPreset = async ({
  filePath,
  outputDir,
}: GetSliderFromPresetParam): Promise<{
  config: Config;
  sliders: Slider[];
} | void> => {
  try {
    const fileName = '02_03_22-CC.hlx';
    const preset = fs.readFileSync(filePath, { encoding: 'utf-8' });
    const parsed = JSON.parse(preset) as Preset;
    const {
      data: { meta, tone },
    } = parsed;
    const { controller, footswitch } = tone;
    const controllers = Object.entries(controller);
    const toneDsps = Object.entries({ dsp0: tone.dsp0, dsp1: tone.dsp1 });

    const config: Config = {
      // desc: `HX Ctrl - ${meta.name} (${dayjs().format('HH:mm:ss DD/MM/YYYY')})`,
      desc: `HX Ctrl - ${meta.name}`,
      outputDir,
      fileName,
    };

    const slidersRecord: Record<string, Slider> = {};

    controllers.forEach(([dspName, dsp]) => {
      const toneBlocks = tone?.[dspName as keyof typeof tone] as ToneBlockTypes;
      const blocks = Object.entries(dsp);

      blocks.forEach(([blockName, block]) => {
        const properties = Object.entries(block);
        const toneBlock = toneBlocks?.[blockName];
        const modelName = (toneBlock['@model'] && blocknames[toneBlock['@model']]) || toneBlock['@model'];

        properties.forEach(([propertyName, property]) => {
          const title = `${propertyName} (${modelName}${toneBlock['@stereo'] ? ' ⚭' : ''})`;

          if (!property['@cc']) return;

          const isSwitch =
            property['@max'] === true || property['@max'] === false || property['@max'] === 1 || property['@max'] === 0;

          if (isSwitch) {
            slidersRecord[property['@cc']] = {
              cc: property['@cc'],
              title,
              max: property['@max'] === true ? 1 : 0,
              min: property['@max'] === true ? 0 : 1,
              default: 0,
            };
            return;
          }

          slidersRecord[property['@cc']] = {
            cc: property['@cc'],
            title,
            max: 127,
            min: 0,
            default: 0,
          };
        });
      });
    });

    let footswitches: Record<string, Partial<CCControl>> = {};
    Object.entries(footswitch).forEach(([_, dsp]) => {
      const blocks = Object.entries(dsp);
      blocks.forEach(([blockName, block]) => {
        if (!block['@cc']) return;
        footswitches = {
          ...footswitches,
          [blockName]: block,
        };
      });
    }, {});

    toneDsps.forEach(([_, dsp]) => {
      const blocks = Object.entries(dsp);

      blocks.forEach(([blockName, block]) => {
        const footswitchBlock = footswitches[blockName];
        if (footswitchBlock && footswitchBlock['@cc']) {
          const modelName = (block['@model'] && blocknames[block['@model'] as string]) || block['@model'];
          slidersRecord[footswitchBlock['@cc']] = {
            cc: footswitchBlock['@cc'],
            title: `${modelName} Bypass`,
            max: 1,
            min: 0,
            default: 0,
          };
          delete footswitches[blockName];
        }
      });
    });

    const collectedSlides: typeof slidersRecord = {
      ...slidersRecord,
      10: {
        ...slidersRecord[10],
        default: 102,
      },
      11: {
        ...slidersRecord[11],
        default: 63,
      },
    };

    const slidersValues = Object.values(collectedSlides);

    slidersValues.sort((a, b) => {
      if (!a.cc || !b.cc) return 0;
      return a.cc - b.cc;
    });

    return { config, sliders: [SLIDER_DEFAULTS.SNAPSHOT, ...slidersValues] };
  } catch (err) {
    console.error(err);
  }
};

const filePath = getArg('path', {
  required: true,
  errorMessage: [
    'The path to the *.hlx file is required',
    'Please add the path to your file (e.g. --path=./path/to/your/preset.hlx)',
  ],
});

const outputDir = getArg('output');

const load = async (): Promise<void> => {
  const { config, sliders } = (await getSliderFromPreset({ filePath, outputDir })) || {};

  if (!sliders || !config) {
    console.warn('Not able to generate sliders from the Preset');
    return;
  }

  generatePlugin(sliders, config);

  process.exit(0);
};

load();
