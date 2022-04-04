import styles from './index.module.scss';

import { InputText } from '@ht-ctrl/ui-form';
import { isEmpty } from 'lodash';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { Button } from 'apps/web/src/components/button/button';
import { atom, useRecoilState } from 'recoil';
import { persistAtomEffect } from '@hx-ctrl/recoil-persist';
import { useEffect } from 'react';
import { OmitStrict, Param0 } from 'type-zoo';
import { useMutation } from 'react-query';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { GeneratePluginBody, GeneratePluginError, GeneratePluginResponse } from 'apps/web/src/pages/api/v1/generate_plugin';
import { useState } from 'react';
import { Log, LogProps } from 'apps/web/src/components/log/log';
import { ReactNode } from 'react';

export type Inputs = {
  outputDir?: string | undefined;
  filePath?: string | undefined;
};

const formAtom = atom<{ form: Inputs | null }>({
  default: { form: null },
  key: 'formAtom',
  effects_UNSTABLE: [persistAtomEffect],
});

const presetLog = atom<LogProps['logs']>({
  default: [],
  key: 'submitLog',
  effects_UNSTABLE: [persistAtomEffect],
});

export function Index() {
  const [formState, setFormState] = useRecoilState(formAtom);
  const [logs, setLogs] = useRecoilState(presetLog);
  const [formInitialized, setFormInitialized] = useState(false);
  const form = useForm<Inputs>({ defaultValues: { filePath: '', outputDir: '' } });
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
      setLogs((prev) => [...prev, { status: 'error', date: new Date(), ...values }]);
    },
    onSuccess: () => {
      setLogs((prev) => [...prev, { status: 'success', date: new Date(), ...values }]);
    },
    useErrorBoundary: false,
  });

  const onSubmit: SubmitHandler<Inputs> = () => {
    mutateAsync();
  };

  useEffect(() => {
    if (formState.form === null || formInitialized) {
      return;
    }
    console.log('#75', formState.form, values);

    if (!isEmpty(formState.form) && !values.filePath && !values.outputDir) {
      form.reset(formState.form);
    }

    setFormInitialized(true);
  }, [values, formState]);

  useEffect(() => {
    if (formState.form === null || isEmpty(values)) {
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
    <main className={styles.main}>
      <h1>HX Ctrl</h1>
      <h5>
        Select your Helix <code>*.hlx</code>{' '}
      </h5>

      <form onSubmit={form.handleSubmit(onSubmit)} className={styles.form}>
        <div className={styles.fields}>
          <div className={styles.field}>
            <Controller
              control={form.control}
              name="filePath"
              render={({ field }) => (
                <InputText label="Preset" placeholder="The preset you want to process" id="filePath" {...field} />
              )}
            />

            <label className={styles.fileUpload}>
              Select
              <input type="file" onChange={handleInput} />
            </label>
          </div>

          <div className={styles.field}>
            <Controller
              control={form.control}
              name="outputDir"
              render={({ field }) => (
                <InputText
                  label="Output directory"
                  placeholder="Path to the `REAPER/Effects/midi` directory"
                  id="outputDir"
                  {...field}
                />
              )}
            />

            <label className={styles.fileUpload}>
              Select
              <input {...{ directory: '', webkitdirectory: '' }} type="file" onChange={handleOutput} />
            </label>
          </div>
        </div>

        <Button type="submit" className={styles.submit}>
          {isLoading ? 'Loading...' : 'Generate'}
        </Button>

        {isSuccess && (
          <Message
            message={
              <>
                Success, file <strong>{data?.outputFile}</strong> created at <strong>{data?.outputPath}</strong>
              </>
            }
          />
        )}

        {isError && (
          <Message
            message={
              <>
                <h4>Something went wrong</h4>
                {error?.message && <p>{error.message}</p>}
              </>
            }
          />
        )}
      </form>

      {!isEmpty(logs) && (
        <>
          <Log logs={logs} onClear={() => setLogs([])} />
        </>
      )}
    </main>
  );
}

export default Index;

const Message = ({ message }: { message: ReactNode }) => {
  return <p className={styles.message}>{message}</p>;
};
