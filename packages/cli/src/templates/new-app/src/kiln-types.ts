import type { Request, Response } from "express";

/**
 * Every Kiln controller handler receives a KilnRequest and a
 * KilnResponse. Keeping this shape identical across every controller
 * is deliberate: a human or an AI coding agent that has read one
 * controller can correctly predict the shape of every other one
 * without re-reading the whole codebase.
 */
export interface KilnRequest<
  Params = Record<string, string>,
  Body = unknown,
  Query = Record<string, string>,
> extends Request<Params, unknown, Body, Query> {}

export interface KilnResponse extends Response {}

/**
 * Return type intentionally includes KilnResponse (not just void):
 * the idiomatic early-return pattern `return res.status(404).json(...)`
 * is encouraged throughout Kiln's generated controllers, and its
 * return value is a Response, not void. Don't narrow this back down
 * without checking the generators in packages/cli/src/generators/.
 */
export type KilnHandler = (
  req: KilnRequest,
  res: KilnResponse,
) => void | KilnResponse | Promise<void | KilnResponse>;

/**
 * A Kiln controller is a plain object of named handlers. You only
 * implement the ones the resource needs — there is no abstract base
 * class to extend and no boilerplate for the handlers you skip.
 */
export interface KilnController {
  index?: KilnHandler;
  show?: KilnHandler;
  create?: KilnHandler;
  update?: KilnHandler;
  destroy?: KilnHandler;
}
