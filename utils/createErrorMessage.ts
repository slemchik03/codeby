export default function createErrorMessage(
  error?: { [key: string]: string } | null,
  defaultError?: string
) {
  const errorMessage = Object.values(error || {});

  return errorMessage[0]
    ? errorMessage[0]?.slice(0, 1).toUpperCase() + errorMessage[0]?.slice(1)
    : (defaultError || "Ошибка!");
}
