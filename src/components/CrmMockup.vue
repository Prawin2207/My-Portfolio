<template>
  <!-- Coded Zoho CRM / Desk dashboard mockup. Sizes use container units so it scales crisply. -->
  <div class="crm-wrap">
    <div class="crm" role="img" aria-label="Zoho CRM sales pipeline and support SLA dashboard">
      <!-- Window bar -->
      <div class="bar">
        <span class="dot" style="background:#ff5f57"></span>
        <span class="dot" style="background:#febc2e"></span>
        <span class="dot" style="background:#28c840"></span>
        <span class="bar-title">CRM · Sales &amp; Support Overview</span>
        <span class="bar-pill">Q3 2024</span>
      </div>

      <div class="body">
        <!-- Sidebar -->
        <nav class="side">
          <span v-for="i in 5" :key="i" :class="['side-ico', i === 2 && 'on']"></span>
        </nav>

        <div class="main">
          <!-- KPIs -->
          <div class="kpis">
            <div v-for="k in kpis" :key="k.label" class="card kpi">
              <span class="kpi-label">{{ k.label }}</span>
              <span class="kpi-val">{{ k.value }}</span>
              <span :class="['kpi-delta', k.up ? 'up' : 'down']">{{ k.delta }}</span>
            </div>
          </div>

          <div class="cols">
            <!-- Funnel -->
            <div class="card funnel">
              <div class="card-head">
                <span>Deal pipeline</span>
                <span class="muted">Conversion</span>
              </div>
              <div v-for="s in stages" :key="s.name" class="stage">
                <span class="stage-name">{{ s.name }}</span>
                <span class="track">
                  <span class="fill" :style="{ width: s.pct + '%', background: s.color }"></span>
                </span>
                <span class="stage-num">{{ s.count }}</span>
              </div>
            </div>

            <!-- Lists -->
            <div class="stack">
              <div class="card list">
                <div class="card-head">
                  <span>Hot leads · auto-assigned</span>
                </div>
                <div v-for="l in leads" :key="l.name" class="row">
                  <span class="avatar" :style="{ background: l.color }">{{ l.initials }}</span>
                  <span class="row-text">
                    <span class="row-title">{{ l.name }}</span>
                    <span class="row-sub">→ {{ l.owner }}</span>
                  </span>
                  <span class="score">{{ l.score }}</span>
                </div>
              </div>

              <div class="card list">
                <div class="card-head">
                  <span>Desk SLA</span>
                  <span class="muted">96% met</span>
                </div>
                <div v-for="t in tickets" :key="t.id" class="row">
                  <span class="tick-bar" :style="{ background: t.color }"></span>
                  <span class="row-text">
                    <span class="row-title">{{ t.title }}</span>
                    <span class="row-sub">{{ t.id }} · {{ t.time }}</span>
                  </span>
                  <span class="tag" :style="{ color: t.color, borderColor: t.color }">{{ t.status }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const kpis = [
  { label: 'New leads', value: '1,284', delta: '▲ 18%', up: true },
  { label: 'Deals won', value: '168', delta: '▲ 9%', up: true },
  { label: 'Pipeline', value: '₹48.2L', delta: '▲ 12%', up: true },
  { label: 'Avg. response', value: '14m', delta: '▼ 3x faster', up: true }
];

const stages = [
  { name: 'Leads', count: '1,284', pct: 100, color: '#5b8def' },
  { name: 'Qualified', count: '842', pct: 66, color: '#4aa8e8' },
  { name: 'Proposal', count: '486', pct: 38, color: '#3cc3d8' },
  { name: 'Negotiation', count: '271', pct: 21, color: '#5fd6c4' },
  { name: 'Won', count: '168', pct: 13, color: '#76e3d7' }
];

const leads = [
  { name: 'Acme Logistics', owner: 'Priya S.', initials: 'AL', score: 92, color: '#5b8def' },
  { name: 'Nova Retail', owner: 'Arjun M.', initials: 'NR', score: 87, color: '#e8915b' },
  { name: 'Kite Health', owner: 'Divya R.', initials: 'KH', score: 81, color: '#9b6be8' }
];

const tickets = [
  { id: 'T-490', title: 'Data sync issue', time: '2h left', status: 'High', color: '#f2994a' },
  { id: 'T-489', title: 'Login trouble', time: 'Resolved', status: 'Done', color: '#3ecf8e' }
];
</script>

<style scoped>
.crm-wrap {
  container-type: inline-size;
  width: 100%;
}
.crm {
  --bg: #0e1117;
  --card: #161b24;
  --line: rgba(255, 255, 255, 0.07);
  --muted: rgba(255, 255, 255, 0.45);
  font-family: Inter, system-ui, sans-serif;
  color: #fff;
  background: var(--bg);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 2.6cqw;
  overflow: hidden;
  box-shadow: 0 4cqw 10cqw -3cqw rgba(0, 0, 0, 0.6);
  aspect-ratio: 16 / 10.5;
  display: flex;
  flex-direction: column;
}
.bar {
  display: flex;
  align-items: center;
  gap: 1cqw;
  padding: 1.6cqw 2.2cqw;
  border-bottom: 1px solid var(--line);
}
.dot { width: 1.3cqw; height: 1.3cqw; border-radius: 50%; }
.bar-title { margin-left: 1.2cqw; font-size: 1.7cqw; color: rgba(255,255,255,.7); font-weight: 500; }
.bar-pill {
  margin-left: auto; font-size: 1.4cqw; padding: .4cqw 1.2cqw; border-radius: 99px;
  background: rgba(118, 227, 215, .12); color: #76e3d7;
}
.body { flex: 1; display: flex; min-height: 0; }
.side {
  width: 6cqw; border-right: 1px solid var(--line);
  display: flex; flex-direction: column; align-items: center; gap: 1.8cqw; padding-top: 2.2cqw;
}
.side-ico { width: 2.4cqw; height: 2.4cqw; border-radius: .7cqw; background: rgba(255,255,255,.12); }
.side-ico.on { background: #76e3d7; }
.main { flex: 1; padding: 2cqw; display: flex; flex-direction: column; gap: 1.6cqw; min-width: 0; }
.card { background: var(--card); border: 1px solid var(--line); border-radius: 1.6cqw; }
.kpis { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.4cqw; }
.kpi { padding: 1.5cqw 1.7cqw; display: flex; flex-direction: column; gap: .3cqw; }
.kpi-label { font-size: 1.35cqw; color: var(--muted); }
.kpi-val { font-size: 3cqw; font-weight: 700; letter-spacing: -.03em; line-height: 1.1; }
.kpi-delta { font-size: 1.25cqw; }
.kpi-delta.up { color: #3ecf8e; }
.kpi-delta.down { color: #f25f5c; }
.cols { flex: 1; display: grid; grid-template-columns: 1.15fr 1fr; gap: 1.6cqw; min-height: 0; }
.card-head {
  display: flex; justify-content: space-between; align-items: center;
  font-size: 1.55cqw; font-weight: 600; margin-bottom: 1.4cqw;
}
.muted { color: var(--muted); font-weight: 400; font-size: 1.35cqw; }
.funnel { padding: 1.8cqw; display: flex; flex-direction: column; justify-content: space-between; }
.stage { display: grid; grid-template-columns: 9.5cqw 1fr 5cqw; align-items: center; gap: 1.2cqw; }
.stage-name { font-size: 1.4cqw; color: rgba(255,255,255,.7); }
.track { height: 2.6cqw; border-radius: .8cqw; background: rgba(255,255,255,.05); overflow: hidden; }
.fill { display: block; height: 100%; border-radius: .8cqw; }
.stage-num { font-size: 1.45cqw; font-weight: 600; text-align: right; font-variant-numeric: tabular-nums; }
.stack { display: flex; flex-direction: column; gap: 1.6cqw; min-height: 0; }
.list { padding: 1.5cqw 1.7cqw; flex: 1; }
.list .card-head { margin-bottom: .8cqw; }
.row { display: flex; align-items: center; gap: 1.2cqw; padding: .75cqw 0; border-top: 1px solid var(--line); }
.avatar {
  width: 2.8cqw; height: 2.8cqw; border-radius: 50%; display: grid; place-items: center;
  font-size: 1.1cqw; font-weight: 700; flex-shrink: 0;
}
.row-text { display: flex; flex-direction: column; min-width: 0; flex: 1; }
.row-title { font-size: 1.4cqw; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.row-sub { font-size: 1.15cqw; color: var(--muted); }
.score {
  font-size: 1.25cqw; font-weight: 700; color: #0b0c10; background: #76e3d7;
  padding: .3cqw .9cqw; border-radius: 99px;
}
.tick-bar { width: .45cqw; height: 2.8cqw; border-radius: 99px; flex-shrink: 0; }
.tag { font-size: 1.15cqw; border: 1px solid; padding: .2cqw .9cqw; border-radius: 99px; }
</style>
