import { yupResolver } from '@hookform/resolvers/yup';
import { InputText } from '@ht-ctrl/ui-form';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { isEmpty } from 'lodash';
import { useEffect } from 'react';
import { useState } from 'react';
import { ReactNode } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useMutation } from 'react-query';
import { atom, useRecoilState } from 'recoil';
import { Param0 } from 'type-zoo';
import * as yup from 'yup';

import { persistAtomEffect } from '@hx-ctrl/recoil-persist';

import { Button } from 'apps/web/src/components/button/button';
import { Log, LogProps } from 'apps/web/src/components/log/log';

import { GeneratePluginBody, GeneratePluginError, GeneratePluginResponse } from 'apps/web/src/pages/api/v1/generate_plugin';

import styles from './index.module.scss';

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
const schema = yup
  .object()
  .shape({
    filePath: yup.string().required(),
    outputDir: yup.number().required(),
  })
  .required();

export function Index() {
  const [formState, setFormState] = useRecoilState(formAtom);
  const [logs, setLogs] = useRecoilState(presetLog);
  const [formInitialized, setFormInitialized] = useState(false);
  const form = useForm<Inputs>({ defaultValues: { filePath: '', outputDir: '' }, resolver: yupResolver(schema) });
  const values = form.watch();
  const { outputDir, filePath } = values;
  console.log('#54', values);

  const { mutateAsync, isLoading, isError, data, isSuccess, error } = useMutation<
    GeneratePluginResponse,
    GeneratePluginError,
    Inputs
  >({
    mutationKey: filePath,
    mutationFn: async (inputs) => {
      try {
        return (
          await axios.post<GeneratePluginResponse, AxiosResponse<GeneratePluginResponse>, GeneratePluginBody>(
            '/api/v1/generate_plugin',
            { filePath: inputs.filePath, outputDir: inputs.outputDir },
          )
        )?.data;
      } catch (err) {
        if ((err as AxiosError)?.isAxiosError) {
          throw err?.response?.data as GeneratePluginError;
        }
      }
    },
    onError: () => {
      setLogs((prev) => [{ status: 'error', date: new Date(), ...values }, ...prev]);
    },
    onSuccess: () => {
      setLogs((prev) => [{ status: 'success', date: new Date(), ...values }, ...prev]);
    },
    useErrorBoundary: false,
  });

  const onSubmit: SubmitHandler<Inputs> = () => {
    mutateAsync({ filePath, outputDir });
  };

  const handleRerun: SubmitHandler<Inputs> = async (inputs: Inputs) => {
    mutateAsync(inputs);
    form.reset(inputs, { keepTouched: true });
  };

  useEffect(() => {
    if (formState.form === null || formInitialized) {
      return;
    }

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
      <form onSubmit={form.handleSubmit(onSubmit)} className={styles.form}>
        <div className={styles.fields}>
          <div className={styles.field}>
            <Controller
              control={form.control}
              name="filePath"
              render={({ field }) => (
                <InputText label="*.hlx preset" placeholder="The preset you want to process" id="filePath" {...field} />
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
                  label="Reaper output directory"
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
                <h6>Something went wrong</h6>
                {error?.message && <p>{error.message}</p>}
              </>
            }
          />
        )}
      </form>

      {!isEmpty(logs) && (
        <>
          <Log logs={logs} onClear={() => setLogs([])} handleRerun={handleRerun} />
        </>
      )}
    </main>
  );
}

export default Index;

const Message = ({ message }: { message: ReactNode }) => {
  return <p className={styles.message}>{message}</p>;
};
