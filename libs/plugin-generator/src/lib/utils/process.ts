import chalk from 'chalk';

// Log the error and exit
export const error = (name: string, ...args: any[]) => {
  let message = `\n\n${chalk.red('> ')}${chalk.bgRed.hex('#000').bold(' Error ')} ${chalk.red(name)}`;

  if (args.length > 0) {
    message = `${message}\n
  ${chalk.grey('Failed:')}

  ${args.join('\n\n  ')}\n\n`;
  }

  console.warn(message);
  // process.exit(1);
};

// Log the error and exit
export const success = (name: string, ...args: any[]) => {
  let message = `\n\n${chalk.green('> ')}${chalk.bgGreen.hex('#000').bold(' Success ')} ${chalk.green(name)}`;

  if (args.length > 0) {
    message = `${message}\n
  ${chalk.grey('Success:')}

  ${args.join('\n\n  ')}\n\n`;
  }

  console.warn(message);
};

export const getArg = (name: string, config: { required?: boolean; errorMessage?: string[] } = {}) => {
  const [_, value] = process.argv.find((arg) => arg.startsWith(`--${name}=`))?.split(`--${name}=`) || [];

  if (config.required && !value) {
    error(`No ${name} is specificed`, ...(config?.errorMessage || []));
  }

  return value;
};
