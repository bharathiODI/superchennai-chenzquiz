export function generateExtraFieldsHTML(extraFields?: Record<string, any>) {
  if (!extraFields) return "";
  return Object.entries(extraFields)
    .map(
      ([key, value]) => `
        <tr>
          <td style="padding:8px 0; font-weight:bold;">${key}:</td>
          <td>${value ?? "N/A"}</td>
        </tr>
      `
    )
    .join("");
}
