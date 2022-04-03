import { Config, generatePlugin, getArg, Preset, Slider, SLIDER_DEFAULTS, ToneBlockTypes } from '@hx-ctrl/plugin-generator';
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
    const { controller } = tone;
    const dsps = Object.entries(controller);

    const config: Config = {
      // desc: `HX Ctrl - ${meta.name} (${dayjs().format('HH:mm:ss DD/MM/YYYY')})`,
      desc: `HX Ctrl - ${meta.name}`,
      outputDir,
      fileName,
    };

    const slidersRecord: Record<string, Slider> = {};

    dsps.forEach(([dspName, dsp]) => {
      const toneBlocks = tone?.[dspName as keyof typeof tone] as ToneBlockTypes;
      const blocks = Object.entries(dsp);

      blocks.forEach(([blockName, block]) => {
        const properties = Object.entries(block);

        const toneBlock = toneBlocks?.[blockName];
        properties.forEach(([propertyName, property]) => {
          if (!property['@cc']) return;

          const isSwitch = property['@max'] === true || property['@max'] === false;

          const modelName = (toneBlock['@model'] && blocknames[toneBlock['@model']]) || toneBlock['@model'];
          const title = `${propertyName} (${modelName}${toneBlock['@stereo'] ? ' ⚭' : ''})`;

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
