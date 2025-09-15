// Reactプレビュー用に、提供いただいたコンポーネントをそのまま組み込みました。
// 画面右でそのまま動作確認ができます。

import * as React from 'react'

function OYOSecureAIBotGuide() {
  // -----------------------------
  // Data
  // -----------------------------
  const sections = [
    {
      id: "salary",
      emoji: "💰",
      title: "給与・手当関連",
      items: [
        "（職員）給与の内訳は何ですか。",
        "（職員）給与の締日と支払日はいつですか。",
        "（職員）欠勤日の給与はどうなりますか。",
        "（職員）基本給基礎額はどのように決定しますか。",
        "（職員）定期の給与改定はありますか。",
        "（職員）臨時昇格・降格はありますか。",
        "（職員）時間外労働手当の算定はどうなりますか。",
        "（職員）通勤手当の支給基準は何ですか。",
        "（職員）在宅・リモート勤務時の通勤費はどうなりますか。",
        "（職員）住宅手当の概要は何ですか。",
      ],
    },
    {
      id: "leave",
      emoji: "🌿",
      title: "休暇・休業関連",
      items: [
        "年次有給休暇の付与（職員）はどうなりますか。",
        "年次有給休暇の加算（職員）はありますか。",
        "年休の取得手続（職員）はいつまでに必要ですか。",
        "年休の時季変更（職員）はありますか。",
        "年休の繰越（職員）はどうなりますか。",
        "年5日の年休取得義務はどう扱いますか。",
        "欠勤を年休に振り替えることはできますか。",
        "特別休暇（職員）には何がありますか。",
        "結婚休暇の日数はどのくらいですか。",
        "忌引休暇の日数はどうなりますか。",
        "夏期休暇の取扱いはどうなりますか。",
        "生理休暇は取得できますか。",
        "育児休業の対象者と除外要件は何ですか。",
        "育児休業の申出期限はいつですか。",
        "出生時育児休業の対象者と留意点は何ですか。",
        "出生時育児休業はいつ終了しますか。",
        "介護休業の対象者・申出期限は何ですか。",
        "育児・介護に関する会社の支援は何がありますか。",
        "育児・介護に関する法との関係はどうなりますか。",
        "積立休暇の目的と上限は何ですか。",
        "積立休暇の使用要件と手続は何ですか。",
        "特別休暇の「法要休暇」は取得できますか。",
        "単身赴任・家族同伴赴任時の特別休暇はありますか。",
        "災害・隔離による特別休暇の取扱いはありますか。",
      ],
    },
    {
      id: "travel",
      emoji: "✈",
      title: "出張・旅費関連",
      items: [
        "旅費精算の申請手続（出張前）は何ですか。",
        "出張の区分（国内）はどう定義しますか。",
        "鉄道・航空・バス等の運賃の扱いはどうなりますか。",
        "日当・宿泊料（国内）の支給基準は何ですか。",
        "就業時間以上の現地調査は出張扱いになりますか。",
        "会社指定施設に泊まった場合の宿泊料はどうなりますか。",
        "海外出張の滞在費・精算期限はどうなりますか。",
        "取引先同行で高額な会食費が必要な場合はどうしますか。",
        "（参考）別規程における日当基準の違いはありますか。",
        "海外出張の渡航手続・保険対応はどうなりますか。",
      ],
    },
  ];

  const allItems = sections.flatMap((s) => s.items.map((txt) => ({
    section: s.id,
    sectionTitle: s.title,
    emoji: s.emoji,
    text: txt,
  })));

  // -----------------------------
  // State
  // -----------------------------
  const [q, setQ] = React.useState("");
  const [active, setActive] = React.useState("all");
  const [copied, setCopied] = React.useState(null);
  const [showCopyHelp, setShowCopyHelp] = React.useState(false);
  const [copyHelpText, setCopyHelpText] = React.useState("");
  const [copyError, setCopyError] = React.useState(null);
  const copyTextAreaRef = React.useRef(null);

  const filtered = allItems.filter((it) => {
    const hitQ = q.trim() === "" || it.text.includes(q.trim());
    const hitSec = active === "all" || it.section === active;
    return hitQ && hitSec;
  });

  // -----------------------------
  // Clipboard-safe copy (user gesture only)
  // -----------------------------
  function copy(text) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.top = '-9999px';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    ta.setSelectionRange(0, ta.value.length);

    let ok = false;
    try {
      ok = document.execCommand && document.execCommand('copy');
    } catch (_) {
      ok = false;
    }
    document.body.removeChild(ta);

    if (ok) {
      setCopied(text);
      setTimeout(() => setCopied(null), 1400);
      return;
    }

    if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
      navigator.clipboard.writeText(text).then(
        () => {
          setCopied(text);
          setTimeout(() => setCopied(null), 1400);
        },
        (err) => {
          setCopyError(err && err.message ? String(err.message) : 'コピーがブロックされました');
          setCopyHelpText(text);
          setShowCopyHelp(true);
        }
      );
      return;
    }

    setCopyError('この環境ではクリップボードが使用できません');
    setCopyHelpText(text);
    setShowCopyHelp(true);
  }

  React.useEffect(() => {
    if (showCopyHelp && copyTextAreaRef.current) {
      const el = copyTextAreaRef.current;
      setTimeout(() => {
        el.focus();
        el.select();
      }, 0);
    }
  }, [showCopyHelp]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 text-slate-800">
      <header className="sticky top-0 z-10 backdrop-blur bg-white/70 border-b border-slate-200">
        <div className="mx-auto max-w-5xl px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-2xl bg-slate-900 text-white grid place-items-center text-lg">AI</div>
            <div>
              <h1 className="text-lg font-bold">OYOセキュアAI × 社内規定Bot Ver2.5</h1>
              <p className="text-xs text-slate-500">「こんな風に質問してみてください」ガイド（職員向け）</p>
            </div>
          </div>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.print();
            }}
            className="text-sm px-3 py-1.5 rounded-xl border border-slate-300 hover:bg-slate-100"
          >
            印刷 / PDF保存
          </a>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-6">
        {/* Search & Filters */}
        <div className="grid gap-3 md:grid-cols-[1fr_auto] items-start">
          <div className="relative">
            <input
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="キーワードで絞り込み（例：年休、海外出張、通勤手当）"
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 pr-10 focus:outline-none focus:ring-4 focus:ring-slate-200"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden>⌘K</span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <FilterButton label="すべて" active={active === "all"} onClick={() => setActive("all")} />
            {sections.map((s) => (
              <FilterButton key={s.id} label={`${s.emoji} ${s.title}`} active={active === s.id} onClick={() => setActive(s.id)} />
            ))}
          </div>
        </div>

        {/* Result Summary */}
        <div className="mt-4 text-sm text-slate-600" aria-live="polite">{filtered.length} 件ヒット（{active === "all" ? "全カテゴリ" : sections.find(s=>s.id===active)?.title}）</div>

        {/* Cards */}
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((it, idx) => (
            <article key={idx} className="group rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow">
              <div className="p-4">
                <div className="text-xs text-slate-500 mb-1">{it.emoji} {it.sectionTitle}</div>
                <h3 className="text-sm font-medium leading-6">{it.text}</h3>
              </div>
              <div className="px-4 pb-4 flex items-center gap-2">
                <button
                  onClick={() => copy(it.text)}
                  className="text-xs px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-100"
                  aria-label="質問文をコピー"
                >
                  {copied === it.text ? "✓ コピーしました" : "質問をコピー"}
                </button>
                <a
                  href="#ask"
                  onClick={(e) => e.preventDefault()}
                  className="text-xs text-slate-600 underline underline-offset-2 hover:text-slate-900"
                  title="社内規定Botに貼り付けて質問してください"
                >
                  Botで質問する手順
                </a>
              </div>
            </article>
          ))}
        </div>

        {/* Manual copy modal */}
        {showCopyHelp && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm grid place-items-center">
            <div role="dialog" aria-modal="true" className="w-[92vw] max-w-lg rounded-2xl bg-white shadow-xl border border-slate-200 p-5">
              <h3 className="text-base font-semibold mb-2">コピーがブロックされました</h3>
              <p className="text-sm text-slate-600 mb-3">お手数ですが、以下を <kbd className="px-1 border rounded">Ctrl</kbd>+<kbd className="px-1 border rounded">C</kbd>（Macは <kbd className="px-1 border rounded">⌘</kbd>+<kbd className="px-1 border rounded">C</kbd>）でコピーしてください。</p>
              {copyError && <p className="text-xs text-red-600 mb-2">詳細: {copyError}</p>}
              <textarea
                ref={copyTextAreaRef}
                className="w-full h-28 rounded-xl border border-slate-300 p-3 text-sm"
                value={copyHelpText}
                onChange={(e) => setCopyHelpText(e.target.value)}
              />
              <div className="mt-3 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      if (!copyTextAreaRef.current) return;
                      copyTextAreaRef.current.focus();
                      copyTextAreaRef.current.select();
                    }}
                    className="text-xs px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-100"
                  >
                    全選択
                  </button>
                  <button
                    onClick={() => setShowCopyHelp(false)}
                    className="text-xs px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-100"
                  >
                    閉じる
                  </button>
                </div>
                <div className="text-xs text-slate-500">コピー後、このダイアログは閉じてもOKです。</div>
              </div>
            </div>
          </div>
        )}

        {/* How-to */}
        <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="text-base font-semibold mb-2">使い方のコツ</h2>
          <ul className="list-disc pl-5 space-y-1 text-sm text-slate-700">
            <li>対象を明示すると精度が上がります（例：「（職員）」「部署名」など）。</li>
            <li>該当する規程名が分かれば一緒に入力すると、より正確な回答になります。</li>
            <li>うまく出ない場合は、言い回しを少し変えて再質問してみてください。</li>
          </ul>
        </section>

        <details className="mt-8 rounded-2xl border border-slate-200 bg-white p-5">
          <summary className="cursor-pointer text-sm font-semibold">開発者向けテスト（コピー動作）</summary>
          <div className="mt-3 flex flex-wrap gap-2">
            <button className="text-xs px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-100" onClick={() => copy('テスト')}>短文をコピー</button>
            <button className="text-xs px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-100" onClick={() => copy('これはコピー機能の長文テストです。複数文を含み、ポリシーブロック時は手動コピーのダイアログが開くはずです。')}>長文をコピー</button>
            <button className="text-xs px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-100" onClick={() => copy('絵文字🙂👍✨と日本語の混在テスト')}>絵文字混在をコピー</button>
          </div>
          <p className="mt-2 text-xs text-slate-600">結果は画面右下のトースト（ボタンの文言が「✓ コピーしました」に変化）または手動コピー用ダイアログで確認できます。</p>
        </details>

        <footer className="py-10 text-center text-xs text-slate-400">
          © {new Date().getFullYear()} KCS / OYOセキュアAI. 社内限定ページ。
        </footer>
      </main>

      <style>{`
        @media print {
          header { position: static; box-shadow: none; }
          a[href^="#"] { text-decoration: none; }
          .group { break-inside: avoid; }
        }
      `}</style>
    </div>
  );
}

function FilterButton({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={
        "text-sm px-3 py-2 rounded-xl border transition " +
        (active
          ? "border-slate-900 bg-slate-900 text-white"
          : "border-slate-300 bg-white hover:bg-slate-100 text-slate-700")
      }
    >
      {label}
    </button>
  );
}

export default function App(){
  return (
    <div>
      {/* Tailwindはプレビュー環境で有効です */}
      <OYOSecureAIBotGuide />
    </div>
  )
}
