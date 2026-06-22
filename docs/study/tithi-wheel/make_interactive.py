"""Build an interactive Plotly version of the Lunar Wheel of Devotion.

Reads the canonical CSV produced by `_posts/make_tithi_wheel.py` and
emits two HTML fragments and one combined index.html:

  plots/wheel.html         — interactive polar/barpolar wheel
  plots/stacked.html       — interactive stacked horizontal bar
  index.html               — full study page wrapping both, with prose

Hover tooltips on each spoke show: tithi name, paksha-pair deities,
exact Shiva/Shakti/Vishnu split, and any Jayantis on that tithi.
"""
import csv
import os
import textwrap

import plotly.graph_objects as go

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, '..', '..'))
CSV_PATH = os.path.join(ROOT, '_posts', 'tithi-data.csv')
PLOTS_DIR = os.path.join(HERE, 'plots')
DATA_DIR = os.path.join(HERE, 'data')
INDEX_PATH = os.path.join(HERE, 'index.html')

STREAM_COLORS = {
    'Shiva':  '#3a4a5c',
    'Shakti': '#c0392b',
    'Vishnu': '#e8a33d',
}


def load_rows():
    with open(CSV_PATH) as f:
        return list(csv.DictReader(f))


def hover_text(row):
    s = float(row['shiva'])
    sh = float(row['shakti'])
    v = float(row['vishnu'])
    jay = row['jayantis'] or '(no major Jayantis)'
    # wrap the jayantis list for readability
    jay_lines = '<br>  • '.join([j.strip() for j in jay.split(';')])
    return (
        f"<b>{row['tithi_num']}. {row['tithi_name']}</b><br>"
        f"<br>"
        f"<b>Narada Purana</b><br>"
        f"  Shukla: {row['shukla_deity']}<br>"
        f"  Krishna: {row['krishna_deity']}<br>"
        f"<br>"
        f"<b>Devotional lean</b><br>"
        f"  Shiva:  {s:.3f}<br>"
        f"  Shakti: {sh:.3f}<br>"
        f"  Vishnu: {v:.3f}<br>"
        f"  Dominant: <b>{row['dominant']}</b><br>"
        f"<br>"
        f"<b>Jayantis on this tithi</b><br>"
        f"  • {jay_lines}"
    )


def build_wheel(rows):
    """Polar bar chart — each tithi is one wedge, colored by dominant
    stream, length = score of dominant stream."""
    n = len(rows)
    theta_step = 360.0 / n
    # We want Pratipada at top (90 deg) going clockwise; Plotly polar default
    # is counterclockwise from East. We'll set sector and direction.
    thetas = [i * theta_step for i in range(n)]
    radii = []
    colors = []
    customdata = []
    labels = []
    for i, r in enumerate(rows):
        s = float(r['shiva']); sh = float(r['shakti']); v = float(r['vishnu'])
        scores = {'Shiva': s, 'Shakti': sh, 'Vishnu': v}
        dom = max(scores, key=scores.get)
        radii.append(scores[dom])
        colors.append(STREAM_COLORS[dom])
        customdata.append(hover_text(r))
        labels.append(r['tithi_name'])

    fig = go.Figure(go.Barpolar(
        r=radii, theta=thetas, width=[theta_step * 0.92] * n,
        marker_color=colors, marker_line_color='white', marker_line_width=2,
        opacity=0.92,
        hovertemplate='%{customdata}<extra></extra>',
        customdata=customdata,
    ))

    # Annotation labels for tithi names around the rim
    annotations = []
    for theta, name in zip(thetas, labels):
        annotations.append(dict(
            x=theta, y=1.18, text=name, showarrow=False,
            xref='polar', yref='polar',
            font=dict(size=12, color='#cfd6e0'),
        ))

    fig.update_layout(
        title=dict(text='Lunar Wheel of Devotion — dominant stream per tithi',
                   font=dict(size=18, color='#e7ecf3'), x=0.5),
        polar=dict(
            bgcolor='#15171d',
            radialaxis=dict(range=[0, 1.0], showticklabels=True,
                            tickvals=[0.25, 0.5, 0.75, 1.0],
                            tickfont=dict(size=10, color='#9aa4b2'),
                            gridcolor='#2a2f3a', linecolor='#2a2f3a'),
            angularaxis=dict(direction='clockwise', rotation=90,
                              showticklabels=False,
                              gridcolor='#2a2f3a', linecolor='#2a2f3a'),
        ),
        paper_bgcolor='#0e0f13',
        plot_bgcolor='#15171d',
        font=dict(family='-apple-system, BlinkMacSystemFont, "Segoe UI", '
                         'Inter, Roboto, Helvetica, Arial, sans-serif',
                  color='#e7ecf3'),
        margin=dict(l=20, r=20, t=70, b=20),
        height=620,
    )
    # Place tithi labels using polar layout coordinates via add_annotation
    for theta, name in zip(thetas, labels):
        fig.add_annotation(
            x=0.5 + 0.46 * _dx(theta),
            y=0.5 + 0.46 * _dy(theta),
            xref='paper', yref='paper',
            text=name, showarrow=False,
            font=dict(size=12, color='#cfd6e0'),
        )
    return fig


def _dx(theta_deg):
    import math
    # plotly polar: rotation=90 + clockwise => theta measured clockwise from top
    a = math.radians(90 - theta_deg)
    return math.cos(a)


def _dy(theta_deg):
    import math
    a = math.radians(90 - theta_deg)
    return math.sin(a)


def build_stacked(rows):
    """Stacked horizontal bar of (Shiva, Shakti, Vishnu) per tithi."""
    names = [f"{r['tithi_num']}. {r['tithi_name']}" for r in rows]
    shiva  = [float(r['shiva'])  for r in rows]
    shakti = [float(r['shakti']) for r in rows]
    vishnu = [float(r['vishnu']) for r in rows]
    customdata = [hover_text(r) for r in rows]

    fig = go.Figure()
    fig.add_trace(go.Bar(
        y=names, x=shiva, name='Shiva', orientation='h',
        marker_color=STREAM_COLORS['Shiva'],
        customdata=customdata,
        hovertemplate='%{customdata}<extra></extra>',
    ))
    fig.add_trace(go.Bar(
        y=names, x=shakti, name='Shakti', orientation='h',
        marker_color=STREAM_COLORS['Shakti'],
        customdata=customdata,
        hovertemplate='%{customdata}<extra></extra>',
    ))
    fig.add_trace(go.Bar(
        y=names, x=vishnu, name='Vishnu', orientation='h',
        marker_color=STREAM_COLORS['Vishnu'],
        customdata=customdata,
        hovertemplate='%{customdata}<extra></extra>',
    ))
    fig.update_layout(
        barmode='stack',
        title=dict(text='Exact Shiva / Shakti / Vishnu split per tithi',
                   font=dict(size=18, color='#e7ecf3'), x=0.5),
        xaxis=dict(range=[0, 1.0], title='Devotional lean (proportion)',
                   gridcolor='#2a2f3a', linecolor='#2a2f3a',
                   tickfont=dict(color='#9aa4b2')),
        yaxis=dict(autorange='reversed', tickfont=dict(color='#cfd6e0')),
        paper_bgcolor='#0e0f13',
        plot_bgcolor='#15171d',
        font=dict(family='-apple-system, BlinkMacSystemFont, "Segoe UI", '
                         'Inter, Roboto, Helvetica, Arial, sans-serif',
                  color='#e7ecf3'),
        legend=dict(orientation='h', y=-0.12, x=0.5, xanchor='center',
                    font=dict(color='#cfd6e0')),
        margin=dict(l=140, r=40, t=70, b=70),
        height=620,
    )
    return fig


def write_html_fragment(fig, name):
    path = os.path.join(PLOTS_DIR, name)
    fig.write_html(path, include_plotlyjs='cdn', full_html=True,
                   config={'displayModeBar': False, 'responsive': True})
    print(f'wrote {path}')
    return path


def write_index(rows):
    wheel_html = build_wheel(rows).to_html(
        include_plotlyjs='cdn', full_html=False,
        config={'displayModeBar': False, 'responsive': True},
        div_id='wheel-plot',
    )
    stacked_html = build_stacked(rows).to_html(
        include_plotlyjs=False, full_html=False,
        config={'displayModeBar': False, 'responsive': True},
        div_id='stacked-plot',
    )

    page = textwrap.dedent("""\
    <!doctype html>
    <html lang="en">
    <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>The Lunar Wheel of Devotion — Interactive</title>
    <meta name="description" content="An interactive visualization of the 15 tithis of a paksha projected onto the Shiva, Shakti, and Vishnu streams of Hindu devotion. Hover any tithi for its presiding deity and Jayantis.">
    <style>
      :root{
        --bg:#0e0f13; --panel:#15171d; --panel2:#1b1e26; --text:#e7ecf3;
        --muted:#9aa4b2; --shiva:#3a4a5c; --shakti:#c0392b; --vishnu:#e8a33d;
        --max:1080px;
      }
      *{box-sizing:border-box}
      html,body{margin:0;padding:0;background:var(--bg);color:var(--text);
        font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Inter,Roboto,Helvetica,Arial,sans-serif;
        line-height:1.65;font-size:16px}
      header{
        background:radial-gradient(900px 400px at 20% 0%,rgba(232,163,61,.20),transparent 60%),
                   radial-gradient(700px 300px at 90% 20%,rgba(192,57,43,.18),transparent 60%),
                   linear-gradient(180deg,#0c0d11 0%,#11131a 100%);
        padding:64px 24px 44px;border-bottom:1px solid #23262e}
      .wrap{max-width:var(--max);margin:0 auto;padding:0 24px}
      .badge{display:inline-block;font-weight:600;font-size:.78rem;letter-spacing:.08em;
        text-transform:uppercase;background:rgba(232,163,61,.15);color:#f6c98a;
        padding:6px 12px;border-radius:999px;border:1px solid rgba(232,163,61,.35);margin-bottom:18px}
      h1{font-size:2.1rem;line-height:1.2;margin:0 0 14px;letter-spacing:-.01em}
      .lede{color:#d9e1eb;font-size:1.05rem;max-width:720px}
      .actions{margin-top:22px;display:flex;flex-wrap:wrap;gap:10px}
      .btn{display:inline-block;padding:9px 16px;border-radius:10px;border:1px solid #2a2f3a;
        background:#1b1e26;color:#e7ecf3;text-decoration:none;font-size:.92rem}
      .btn:hover{background:#232834}
      main{padding:40px 0 80px}
      section{margin:36px 0}
      h2{font-size:1.4rem;margin:0 0 12px;letter-spacing:-.005em;
        border-left:4px solid var(--vishnu);padding-left:12px}
      p{color:#d0d7e0}
      .panel{background:var(--panel);border:1px solid #23262e;border-radius:14px;
        padding:18px;margin:18px 0;overflow:hidden}
      .legend{display:flex;flex-wrap:wrap;gap:18px;margin:8px 0 18px;color:var(--muted);font-size:.95rem}
      .swatch{display:inline-block;width:14px;height:14px;border-radius:3px;vertical-align:-2px;margin-right:6px}
      .grid2{display:grid;grid-template-columns:1fr;gap:18px}
      @media (min-width:980px){.grid2{grid-template-columns:1fr 1fr}}
      .note{color:var(--muted);font-size:.9rem;margin-top:8px}
      footer{padding:28px 24px 60px;border-top:1px solid #23262e;color:var(--muted);font-size:.9rem;text-align:center}
      footer a{color:var(--vishnu);text-decoration:none}
      footer a:hover{text-decoration:underline}
      a.read-more{color:var(--vishnu);text-decoration:none;border-bottom:1px dashed rgba(232,163,61,.5)}
      a.read-more:hover{color:#ffd26a}
    </style>
    </head>
    <body>
    <header>
      <div class="wrap">
        <span class="badge">Interactive · tatva</span>
        <h1>The Lunar Wheel of Devotion</h1>
        <p class="lede">Each of the fifteen tithis of a paksha has a presiding deity. Project those deities onto the three streams of Hindu devotion — <span style="color:var(--shiva);font-weight:600">Shiva</span>, <span style="color:var(--shakti);font-weight:600">Shakti</span>, <span style="color:var(--vishnu);font-weight:600">Vishnu</span> — and the lunar month reveals a rhythm. Hover any tithi for its scriptural deities and Jayantis.</p>
        <div class="actions">
          <a class="btn" href="/posts/2026/04/25/lunar-wheel-of-devotion/">← Read the full essay</a>
          <a class="btn" href="/posts/2026/04/25/lunar-wheel-of-devotion/tithi-data.csv">Download CSV</a>
          <a class="btn" href="/posts/2026/04/25/lunar-wheel-of-devotion/make_tithi_wheel.py">Plot script</a>
        </div>
      </div>
    </header>

    <main class="wrap">
      <section>
        <div class="legend">
          <span><span class="swatch" style="background:var(--shiva)"></span>Shiva (Shaiva stream)</span>
          <span><span class="swatch" style="background:var(--shakti)"></span>Shakti (Shakta stream)</span>
          <span><span class="swatch" style="background:var(--vishnu)"></span>Vishnu (Vaishnava stream)</span>
        </div>
        <div class="grid2">
          <div class="panel">
            __WHEEL__
          </div>
          <div class="panel">
            __STACKED__
          </div>
        </div>
        <p class="note">The wheel collapses Purnima and Amavasya into spoke #15. Pratipada sits at the top (12 o'clock) and the cycle runs clockwise.</p>
      </section>

      <section>
        <h2>What you are looking at</h2>
        <p>The base scoring pairs the Shukla and Krishna paksha presiding deities of <b>Narada Purana 56.133b–135</b>, folds them onto the Shiva / Shakti / Vishnu axes, and adds Jayanti reinforcements (Maha Shivratri, Krishna Janmashtami, Ram Navami, the ten avatars, the major Devi vrats, and the systemic monthly recurrences of Ekadashi, Pradosh, and Masik Shivratri). The full methodology, folding table, and source citations live in the <a class="read-more" href="/posts/2026/04/25/lunar-wheel-of-devotion/">accompanying essay</a>.</p>
        <p>Three patterns are visible at a glance: <b>Vishnu owns the digestive middle</b> (Chaturthi, Ekadashi, Dwadashi). <b>Shiva owns the closing tithis</b> (Ashtami, Chaturdashi, Purnima/Amavasya). <b>Shakti claims the generative tithis</b> (Panchami, Shashthi, Trayodashi).</p>
      </section>
    </main>

    <footer>
      <p><a href="/">← back to tatva</a> · <a href="/posts/2026/04/25/lunar-wheel-of-devotion/">read the full essay</a></p>
      <p>data: <a href="/posts/2026/04/25/lunar-wheel-of-devotion/tithi-data.csv">tithi-data.csv</a> · plot: <a href="/posts/2026/04/25/lunar-wheel-of-devotion/make_tithi_wheel.py">make_tithi_wheel.py</a></p>
    </footer>
    </body>
    </html>
    """)
    page = page.replace('__WHEEL__', wheel_html).replace('__STACKED__', stacked_html)
    with open(INDEX_PATH, 'w') as f:
        f.write(page)
    print(f'wrote {INDEX_PATH}')


def main():
    os.makedirs(PLOTS_DIR, exist_ok=True)
    os.makedirs(DATA_DIR, exist_ok=True)
    rows = load_rows()
    write_index(rows)
    # Also write standalone plots in plots/ for embedability
    write_html_fragment(build_wheel(rows), 'wheel.html')
    write_html_fragment(build_stacked(rows), 'stacked.html')


if __name__ == '__main__':
    main()
