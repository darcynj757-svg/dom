export const YM_COUNTER_ID = 112787674;

type YmFunction = (
  counterId: number,
  action: string,
  ...rest: unknown[]
) => void;

function getYm(): YmFunction | undefined {
  if (typeof window === "undefined") return undefined;
  const ym = (window as unknown as { ym?: YmFunction }).ym;
  return typeof ym === "function" ? ym : undefined;
}

/** Отправляет просмотр страницы при клиентской навигации SPA. */
export function ymHit(url: string, title?: string): void {
  const ym = getYm();
  if (!ym) return;
  ym(YM_COUNTER_ID, "hit", url, title ? { title } : undefined);
}

/** Отправляет достижение цели (заявка, звонок, расчёт и т.п.). */
export function ymReachGoal(
  goal: string,
  params?: Record<string, unknown>,
): void {
  const ym = getYm();
  if (!ym) return;
  ym(YM_COUNTER_ID, "reachGoal", goal, params);
}
