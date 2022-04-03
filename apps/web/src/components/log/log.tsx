import { Inputs } from 'apps/web/src/pages';
import React from 'react';

import styles from './log.module.scss';

type Props = { logs: ({ status: 'error' | 'success' } & Inputs)[]; onClear?: () => void };

export const Log = ({ logs, onClear }: Props) => {
  return (
    <section className={styles.logs}>
      <h5 className={styles.title}>Log</h5>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Status</th>
            <th>File name</th>
            <th>Output Directory</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr className={styles.log}>
              <td className={styles.status} data-status={log.status}>
                {log.status}
              </td>
              <td className={styles.filePath}>{log.filePath}</td>
              <td className={styles.outputDir}>{log.outputDir}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {onClear && (
        <button className={styles.clear} onClick={onClear}>
          Clear log
        </button>
      )}
    </section>
  );
};
