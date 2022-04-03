import styles from './index.module.scss';

import { InputText } from '@ht-ctrl/ui-form';
import { isEmpty } from 'lodash';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Button } from 'apps/web/src/components/button/button';
import { atom, useRecoilState } from 'recoil';
import { persistAtomEffect } from '@hx-ctrl/recoil-persist';
import { useEffect } from 'react';
import { Param0 } from 'type-zoo';
import { useMutation } from 'react-query';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { GeneratePluginBody, GeneratePluginError, GeneratePluginResponse } from 'apps/web/src/pages/api/v1/generate_plugin';
import { useState } from 'react';
import { Log } from 'apps/web/src/components/log/log';

export type Inputs = {
  outputDir?: string | undefined;
  filePath?: string | undefined;
};

const formAtom = atom<{ form: Inputs | null }>({
  default: { form: null },
  key: 'formAtom',
  effects_UNSTABLE: [persistAtomEffect],
});

const presetLog = atom<({ status: 'error' | 'success' } & Inputs)[]>({
  default: [],
  key: 'submitLog',
  effects_UNSTABLE: [persistAtomEffect],
});

export function Index() {
  const [formState, setFormState] = useRecoilState(formAtom);
  const [logs, setLogs] = useRecoilState(presetLog);
  const [formInitialized, setFormInitialized] = useState(false);
  const form = useForm<Inputs>();
  const values = form.watch();

  const { outputDir, filePath } = values;
  const { mutateAsync, isLoading, isError, data, isSuccess, error } = useMutation<GeneratePluginResponse, GeneratePluginError>({
    mutationKey: filePath,
    mutationFn: async () => {
      try {
        return (
          await axios.post<GeneratePluginResponse, AxiosResponse<GeneratePluginResponse>, GeneratePluginBody>(
            '/api/v1/generate_plugin',
            { filePath: filePath, outputDir: outputDir },
          )
        )?.data;
      } catch (err) {
        if ((err as AxiosError)?.isAxiosError) {
          throw err?.response?.data as GeneratePluginError;
        }
      }
    },
    onError: () => {
      setLogs((prev) => [...prev, { status: 'error', ...values }]);
    },
    onSuccess: () => {
      setLogs((prev) => [...prev, { status: 'success', ...values }]);
    },
    useErrorBoundary: false,
  });

  const onSubmit: SubmitHandler<Inputs> = () => {
    mutateAsync();
  };

  useEffect(() => {
    if (!isEmpty(values) || formState.form === null || formInitialized) {
      return;
    }

    if (!isEmpty(formState) && isEmpty(values)) {
      form.reset(formState.form);
      setFormInitialized(true);
    }
  }, [values, formState]);

  useEffect(() => {
    if (isEmpty(values)) {
      return;
    }

    setFormState({ form: values });
  }, [values.filePath, values.outputDir]);

  const getFile = (e: Param0<React.ChangeEventHandler<HTMLInputElement>>): (File & { path?: string }) | undefined => {
    const target = e.target as HTMLInputElement;
    const files = target.files;

    if (isEmpty(files)) {
      console.warn('No files selected');
      return;
    }

    return files?.[0];
  };

  const handleInput: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = getFile(e);

    form.setValue('filePath', file?.path, { shouldValidate: true });
  };

  const handleOutput: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = getFile(e);

    const pathWithoutExt = file?.path.split('/').slice(0, -1).join('/');

    form.setValue('outputDir', pathWithoutExt, { shouldValidate: true });
  };

  return (
    <div className={styles.page}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <InputText id="input_path" label="Preset" type="file" onChange={handleInput} />
        {filePath && <div>Selected preset {filePath}</div>}

        <InputText id="output" label="Output directory" directory="" webkitdirectory="" type="file" onChange={handleOutput} />
        {outputDir && <div>Selected output path is {outputDir}</div>}

        <Button type="submit" className={styles.submit}>
          {isLoading ? 'Loading...' : 'Generate'}
        </Button>

        {isSuccess && (
          <p>
            Success, file <strong>{data?.outputFile}</strong> created at <strong>{data?.outputPath}</strong>
          </p>
        )}

        {isError && (
          <div>
            <h4>Something went wrong</h4>
            {error?.message && <p>{error.message}</p>}
          </div>
        )}
      </form>

      {!isEmpty(logs) && (
        <>
          <Log logs={logs} onClear={() => setLogs([])} />
        </>
      )}
    </div>
  );
}

export default Index;
