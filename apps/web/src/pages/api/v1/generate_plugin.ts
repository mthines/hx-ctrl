import { NextApiRequest, NextApiResponse } from 'next';
import { generatePlugin, getSliderFromPreset, GetSliderFromPresetParam } from '@hx-ctrl/plugin-generator';

export type GeneratePluginBody = GetSliderFromPresetParam;

export type GeneratePluginResponse = ReturnType<typeof generatePlugin>;

export type GeneratePluginError = { error: unknown; message: string };

async function handle(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  try {
    if (req.method === 'POST') {
      const body = req.body as GeneratePluginBody;

      if (!body.filePath) {
        throw new Error('Missing plugin file path');
      }

      if (!body.filePath.split('.').pop().includes('hlx')) {
        throw new Error('File needs to be of extension *.hlx');
      }

      if (!body.outputDir) {
        throw new Error('Missing output  directory path');
      }

      const { config, sliders } = (await getSliderFromPreset({ filePath: body.filePath, outputDir: body.outputDir })) || {};

      if (!sliders || !config) {
        console.warn('Not able to generate sliders from the Preset');
        return;
      }

      const plugin = await generatePlugin(sliders, config);

      return res.status(200).json({ ...plugin } as GeneratePluginResponse);
    } else {
      throw new Error('Only POST requests are supported');
    }
  } catch (error) {
    console.error('Error: %s', error);

    if (error instanceof Error) {
      return res.status(500).json({ message: error.message, error } as GeneratePluginError);
    }

    return res.status(500).json({ message: 'Bad request', error } as GeneratePluginError);
  }
}

export default handle;
