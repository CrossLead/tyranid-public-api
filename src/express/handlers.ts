import { Handler } from 'express';
import { Path, Spec } from 'swagger-schema-official';
import { Tyr as Tyranid } from 'tyranid';
import { each, error } from '../utils';

export interface ExpressHandlerHash {
  [key: string]: ExpressHandlerHash | Handler;
}

function isHandler(obj: {}): obj is Handler {
  return typeof obj === 'function';
}

/**
 * Generate handlers for
 */
export function handlers(
  Tyr: typeof Tyranid,
  api: Spec
) {
  const out = {} as ExpressHandlerHash;
  const methods = ['get', 'post', 'put', 'delete'] as (keyof Path)[];

  each(api.paths, (path, name) => {
    const parts = name.split('/');
    parts.shift(); // remove empty string for first '/'
    let ref = out;

    parts.forEach((part, index) => {
      if (index === parts.length - 1) {

        const routes = ref[part] = ref[part] || {};

        if (isHandler(routes)) {
          return error(`
            handler exists at point: ${part} in path: ${path}
          `);
        }

        return methods.forEach(method => {
          if (path[method]) {
            routes[method] = (req, res, next) => {
              console.log(`In handler for route = ${name}, method = ${method}`);
              return res.json({
                message: 'ok'
              });
            };
          }
        });
      }

      const next = ref[part] = ref[part] || {};

      if (isHandler(next)) {
        return error(`
          handler exists at point: ${part} in path: ${path}
        `);
      }

      ref = next;
    });
  });

  return out;
}
