import { Button } from 'apps/web/src/components/button/button';
import { Inputs } from 'apps/web/src/pages';
import dayjs from 'dayjs';
import React from 'react';

import styles from './log.module.scss';

export type LogProps = {
  logs: ({ status: 'error' | 'success'; date: Date } & Inputs)[];
  onClear?: () => void;
  handleRerun: (inputs: Inputs) => void;
};

export const Log = ({ logs, onClear, handleRerun }: LogProps) => {
  return (
    <section className={styles.logs}>
      <h5 className={styles.title}>Log</h5>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Status</th>
            <th>Date</th>
            <th>File name</th>
            <th>Output Directory</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr className={styles.log} key={log.date.toString()}>
              <td className={styles.status} data-status={log.status}>
                {log.status}
              </td>
              <td className={styles.date}>{dayjs(log.date).format('HH:mm:ss - DD/MM/YYYY')}</td>
              <td className={styles.filePath}>{log.filePath}</td>
              <td className={styles.outputDir}>{log.outputDir}</td>
              <td className={styles.outputDir}>
                <Button className={styles.rerun} onClick={() => handleRerun(log)}>
                  Rerun
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {onClear && (
        <Button className={styles.clear} onClick={onClear}>
          Clear log
        </Button>
      )}
    </section>
  );
};
