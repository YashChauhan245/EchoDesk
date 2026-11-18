import { SCENARIOS, type SupportScenario, type THREADS } from "./data";

export function createDemoReply(scenario: SupportScenario) {
  return {
    scenario,
    question: scenario.question,
    answer: scenario.answer,
    known: true,
  };
}

/** The landing page shows sample answers; it does not call the live chat API. */
export function getDemoReply(question: string) {
  const text = question.trim();
  const pricing = /price|cost|plan|free|upgrade|billing/i.test(text);
  const installation = /install|embed|script|website|code/i.test(text);
  const known =
    /price|cost|plan|free|upgrade|billing|install|embed|script|website|code|knowledge|learn|train|pdf|document|source|faq/i.test(
      text,
    );
  const scenario = SCENARIOS[pricing ? 0 : installation ? 1 : 2];

  return {
    scenario,
    question: text,
    known,
    answer: known
      ? scenario.answer
      : "This local demo covers pricing, installation, and knowledge sources. Try a sample question to see how EchoDesk uses your content.",
  };
}

export function downloadConversation(
  conversation: (typeof THREADS)[number],
  format: "csv" | "json" | "pdf",
) {
  if (format === "pdf") {
    window.print();
    return;
  }

  const { question, answer, flagged } = conversation;
  const csvRow = [question, answer, String(flagged)]
    .map((value) => `"${value.replaceAll('"', '""')}"`)
    .join(",");
  const content =
    format === "csv"
      ? `question,answer,flagged\n${csvRow}`
      : JSON.stringify({ question, answer, flagged }, null, 2);
  const file = new Blob([content], {
    type: format === "csv" ? "text/csv;charset=utf-8" : "application/json",
  });
  const url = URL.createObjectURL(file);
  const link = document.createElement("a");
  link.href = url;
  link.download = `echodesk-sample-conversation.${format}`;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
