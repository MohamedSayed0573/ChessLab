export function toErrorMessage(err: unknown): string {
	// eslint-disable-next-line no-restricted-syntax
	return err instanceof Error ? err.message : String(err);
}
