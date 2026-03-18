const API_URL = import.meta.env.PROD ? '/api/claude' : '/api/claude';

async function callClaude(body) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  return response.json();
}

export async function generateConceptContent(conceptName, conceptSummary, onStatusUpdate) {
  const cacheKey = "cache_" + conceptName;
  const cached = localStorage.getItem(cacheKey);
  if (cached) return JSON.parse(cached);

  let attempts = 0;
  let lastContent = null;

  while (attempts < 3) {
    attempts++;
    if (onStatusUpdate) onStatusUpdate("🤖 핀이가 공부하는 중...");

    const data = await callClaude({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1500,
      messages: [{
        role: "user",
        content: `당신은 대한민국 금융 교육 전문가입니다. 금융 완전 초보자에게 "${conceptName}" 개념을 가르쳐주세요. (${conceptSummary})

아래 JSON으로만 응답:
{
  "hook": "흥미로운 질문 1~2문장",
  "metaphor": "한국인 친숙한 비유 2~3문장",
  "core": {
    "explanation": "핵심 개념 설명 3~4문장",
    "points": ["포인트1", "포인트2", "포인트3"]
  },
  "quiz": {
    "question": "개념 확인 문제",
    "choices": ["보기1", "보기2", "보기3", "보기4"],
    "correct_index": 0,
    "explanation": "해설"
  },
  "tip": "실생활 팁 1~2문장"
}`
      }]
    });

    const text = data.content[0].text;
    const clean = text.replace(/```json|```/g, "").trim();
    lastContent = JSON.parse(clean);

    if (onStatusUpdate) onStatusUpdate("🔍 핀이가 문제를 검토하는 중...");
    const validation = await validateQuiz(lastContent.quiz);

    if (validation.valid) {
      localStorage.setItem(cacheKey, JSON.stringify(lastContent));
      return lastContent;
    }
  }

  localStorage.setItem(cacheKey, JSON.stringify(lastContent));
  return lastContent;
}

async function validateQuiz(quiz) {
  if (!quiz) return { valid: false };
  const { question, choices, correct_index, explanation } = quiz;
  if (!question?.trim()) return { valid: false };
  if (!Array.isArray(choices) || choices.length !== 4) return { valid: false };
  if (typeof correct_index !== 'number' || correct_index < 0 || correct_index > 3) return { valid: false };
  if (!explanation?.trim()) return { valid: false };
  return { valid: true };
}

export async function generateTrendTopics() {
  const data = await callClaude({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1000,
    messages: [{
      role: "user",
      content: `당신은 대한민국 금융 교육 전문가입니다. 현재 한국 투자자들에게 중요한 글로벌/국내 경제 트렌드 주제 5가지를 생성해주세요. 각 주제에 대해 id, name(한국어, 최대 15자), summary(한국어, 최대 50자), category(saving/investing/realestate/tax/macro 중 하나), level(1-3)을 제공하십시오.
      아래 JSON 배열 형식으로만 응답:
      [{"id":"t1","name":"...","summary":"...","category":"...","level":1}, ...]`
    }]
  });
  const text = data.content[0].text;
  const clean = text.replace(/```json|```/g, "").trim();
  return JSON.parse(clean);
}

export async function generateAdvancedConcepts(categoryName) {
  const data = await callClaude({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1000,
    messages: [{
      role: "user",
      content: `당신은 대한민국 금융 교육 전문가입니다. "${categoryName}" 분야에 대해 더 깊이 있는 심화 학습 주제 3가지를 생성해주세요.
      각 주제는 실생활과 밀접하면서도 전문적인 내용을 다뤄야 하며, 레벨은 4 이상으로 설정하십시오.
      각 주제에 대해 id, name(한국어, 최대 15자), summary(한국어, 최대 50자), category(분야명), level(4-6)을 제공하십시오.
      아래 JSON 배열 형식으로만 응답:
      [{"id":"a1","name":"...","summary":"...","category":"${categoryName}","level":4}, ...]`
    }]
  });
  const text = data.content[0].text;
  const clean = text.replace(/```json|```/g, "").trim();
  return JSON.parse(clean);
}

export async function askPinee(conceptName, question) {
  const data = await callClaude({
    model: "claude-sonnet-4-20250514",
    max_tokens: 500,
    system: `You are 핀이, a friendly Korean financial educator. You are currently teaching about ${conceptName}. 
    Answer the user's question in a warm, friendly tone using Korean. 
    Use '~이에요', '~거든요', '~해요' speech style. Keep answer under 150 words.`,
    messages: [{ role: "user", content: question }]
  });
  return data.content[0].text;
}