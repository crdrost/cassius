
export type Flag = {
  /** If this flag takes a parameter, what is it named? */
  param?: string,
  /** A single-character form for this flag */
  short?: string,
  /** A description, for documenting in the help text. */
  helpText: string,
  /** True if this flag can be repeated */
  repeatable?: boolean
}

export type ValueFromFlag<f extends Flag> = 
  f extends {param: string, repeatable: true}? string[] :
  f extends {param: string, repeatable?: false}? string | undefined :
  f extends {param?: undefined, repeatable: true}? number :
  boolean;

export type PascalFromKebab<s extends string> =
  s extends `${infer pre}-${infer suf}` ? 
    `${Capitalize<pre>}${PascalFromKebab<suf>}` :
    Capitalize<s>;

export type CamelFromKebab<s extends string> =
  s extends `${infer pre}-${infer suf}` ? 
    `${pre}${PascalFromKebab<suf>}` :
    s;

export type FlagVals<spec extends Record<string, Flag>> =
  {[k in keyof spec as CamelFromKebab<k>]: ValueFromFlag<spec[k]>}

function camelFromKebab(str: string): string {
  return key.split('-')
            .map((segment, index) => 
                index === 0 ? segment 
		            : segment[0].toUpperCase() + segment.slice(1))
            .join('');
}

function mzero<spec extends Record<string, Flag>>(spec: spec): FlagVals<spec> {
  const result = {} as Record<string, unknown>;
  for (const key of Object.keys(spec)) {
    const newKey = camelFromKebab(key);
    if (typeof spec[key].param === 'string') {
      result[newKey] = spec[key].repeatable ? [] : undefined;
    } else {
      result[newKey] = spec[key].repeatable ? 0 : false;
    }
  }
  return result as FlagVals<spec>
}

function parseArgv<spec extends Record<string, Flag>>(argv: string[], spec: spec): {flags: FlagVals<spec>, params: string[], errors: string[]} {
  const flags = mzero(spec) as Record<string, unknown>;
  let params = [] as string[];
  const errors = [] as string[];
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--') {
       params = params.concat(argv.slice(i + 1));
       break;
    }
    if (argv[i][0] !== '-') {
      params.push(argv[i]);
    }
    if (argv[i][1] === '-') {
      const eq = argv[i].indexOf('=');
      const record = spec[argv[i].slice(2)];
      if (!record) {
	errors

	
