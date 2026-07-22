const messages = document.querySelector("#messages");
const form = document.querySelector("#chatForm");
const input = document.querySelector("#promptInput");
const sendButton = document.querySelector("#sendButton");
const resultTemplate = document.querySelector("#resultTemplate");

const researchSets = {
  pet: {
    title: "AI 宠物陪伴正在从新奇功能转向日常照护",
    summary: "公开讨论的关注点正在从“宠物会不会互动”转向“主人不在家时，产品能否持续理解并回应宠物状态”。",
    signals: [
      ["陪伴需求变得具体", "用户更关注独处焦虑、日间互动与异常行为提醒，而非一次性娱乐功能。"],
      ["软硬件开始融合", "摄像、声音识别、自动投喂与个性化互动逐渐出现在同一产品链路中。"],
      ["信任决定留存", "误报、隐私和设备稳定性会直接影响用户是否长期开启智能功能。"],
      ["服务仍有断层", "多数产品能记录事件，但缺少可读的长期变化解释与照护建议。"],
    ],
    opportunity: ["建立可解释的宠物状态日记", "先聚焦独处场景，将视频、声音和行为事件整理成主人能理解的变化摘要，并明确标注判断依据。"],
    evidence: [
      ["产品评论", "用户反复提到误报、订阅价值和夜间识别效果。"],
      ["社区讨论", "分离焦虑、远程互动和多宠识别是高频问题。"],
      ["新品动向", "智能摄像与自动喂养产品正在增加生成式解释功能。"],
    ],
  },
  health: {
    title: "情绪健康产品的竞争点正在转向低负担陪伴",
    summary: "年轻用户并不缺少内容，而是缺少在压力出现时能够快速开始、不会制造额外负担的支持方式。",
    signals: [
      ["轻量入口更重要", "一分钟记录、语音表达和无须分类的输入，比复杂打卡更容易被持续使用。"],
      ["用户反感说教", "模板化鼓励和过度积极的回应会降低信任，具体复述更容易被接受。"],
      ["隐私预期提高", "用户希望清楚知道哪些内容被保存、如何删除，以及模型是否使用这些数据。"],
      ["危机边界受关注", "产品需要明确区分日常支持与专业帮助，避免给出超出能力范围的判断。"],
    ],
    opportunity: ["设计一次两分钟的情绪整理流程", "通过简短复述、可选择的问题和一个可执行的小行动，帮助用户完成当下整理，而非追求长期打卡。"],
    evidence: [
      ["应用评论", "高频负面反馈集中在提醒压力、回复重复和订阅透明度。"],
      ["产品更新", "语音输入、私密模式和短时练习成为常见迭代方向。"],
      ["用户访谈", "用户更愿意使用“整理思绪”而非“治疗”定位的产品。"],
    ],
  },
  senior: {
    title: "银发智能硬件的机会不在功能数量，而在家庭协作",
    summary: "真正的购买者和使用者往往不是同一人。产品需要同时降低长辈的操作成本与家人的远程照护压力。",
    signals: [
      ["安装仍是第一门槛", "联网、账号绑定和权限配置让许多设备在首次使用时就被放弃。"],
      ["提醒需要可确认", "单向通知不足以解决问题，家人需要知道提醒是否被看到和执行。"],
      ["异常比全量更重要", "家庭用户希望优先看到值得关注的变化，而不是持续查看原始数据。"],
      ["尊重感影响接受度", "过度监控式设计会引发抵触，产品需要让长辈保有控制权。"],
    ],
    opportunity: ["打造家庭共用的轻量照护终端", "围绕用药、到家确认和异常提醒构建少步骤体验，并让每一次数据共享都可见、可控。"],
    evidence: [
      ["电商评价", "配置复杂、提示音不清和售后响应是主要抱怨。"],
      ["家庭讨论", "异地照护者更关注异常提醒与一键联系，而非完整健康数据。"],
      ["行业产品", "硬件厂商开始将家庭账号和远程协作设为默认能力。"],
    ],
  },
};

function pickResearch(prompt) {
  if (/宠物|猫|狗/.test(prompt)) return researchSets.pet;
  if (/银发|老人|长辈|养老/.test(prompt)) return researchSets.senior;
  if (/情绪|心理|压力|焦虑|健康/.test(prompt)) return researchSets.health;
  return null;
}

function addUserMessage(text) {
  const article = document.createElement("article");
  article.className = "message user-message";
  article.innerHTML = `<div class="message-author">你</div><div class="message-body"><p></p></div>`;
  article.querySelector("p").textContent = text;
  messages.append(article);
}

function addThinking() {
  const article = document.createElement("article");
  article.className = "message assistant-message";
  article.id = "thinkingMessage";
  article.innerHTML = `
    <div class="message-author">TrendPulse</div>
    <div class="thinking"><span>正在整理研究信号</span><i></i><i></i><i></i></div>
  `;
  messages.append(article);
  return article;
}

function addResult(data) {
  const fragment = resultTemplate.content.cloneNode(true);
  fragment.querySelector("h2").textContent = data.title;
  fragment.querySelector(".summary").textContent = data.summary;
  fragment.querySelector(".signals").innerHTML = data.signals
    .map(([title, body]) => `<article class="signal-card"><strong>${title}</strong><p>${body}</p></article>`)
    .join("");
  fragment.querySelector(".opportunity h3").textContent = data.opportunity[0];
  fragment.querySelector(".opportunity p").textContent = data.opportunity[1];
  fragment.querySelector(".evidence-list").innerHTML = data.evidence
    .map(([type, body]) => `<div class="evidence-item"><span>${type}</span><p>${body}</p></div>`)
    .join("");
  messages.append(fragment);
}

function addUnsupportedResult(prompt) {
  const article = document.createElement("article");
  article.className = "message assistant-message unsupported-message";
  article.innerHTML = `
    <div class="message-author">TrendPulse</div>
    <div class="message-body">
      <div class="unsupported-notice">
        <strong>这个主题暂未收录</strong>
        <p>当前是预置数据演示，没有接入大语言模型，因此不能可靠分析“<span></span>”。请选择一个已有研究案例继续体验。</p>
      </div>
      <div class="suggestions">
        <button type="button" data-prompt="分析 AI 宠物陪伴产品的近期趋势">AI 宠物陪伴</button>
        <button type="button" data-prompt="研究年轻人的情绪健康产品机会">情绪健康产品</button>
        <button type="button" data-prompt="看看银发人群的智能硬件需求">银发智能硬件</button>
      </div>
    </div>
  `;
  article.querySelector(".unsupported-notice span").textContent = prompt;
  messages.append(article);
}

function scrollToLatest() {
  messages.scrollTo({ top: messages.scrollHeight, behavior: "smooth" });
}

async function submitPrompt(text) {
  const clean = text.trim();
  if (!clean || sendButton.disabled) return;

  document.querySelector("#suggestions")?.remove();
  addUserMessage(clean);
  input.value = "";
  input.style.height = "auto";
  sendButton.disabled = true;
  const thinking = addThinking();
  scrollToLatest();

  await new Promise((resolve) => window.setTimeout(resolve, 1050));
  thinking.remove();
  const research = pickResearch(clean);
  if (research) addResult(research);
  else addUnsupportedResult(clean);
  sendButton.disabled = false;
  input.focus();
  scrollToLatest();
}

function resetDemo() {
  window.location.reload();
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  submitPrompt(input.value);
});

input.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    form.requestSubmit();
  }
});

input.addEventListener("input", () => {
  input.style.height = "auto";
  input.style.height = `${Math.min(input.scrollHeight, 120)}px`;
});

document.addEventListener("click", (event) => {
  const suggestion = event.target.closest("[data-prompt]");
  if (suggestion) submitPrompt(suggestion.dataset.prompt);
});

document.querySelector("#resetChat").addEventListener("click", resetDemo);
document.querySelector("#resetTop").addEventListener("click", resetDemo);
